const fs = require('fs');
const path = 'app/views/admin.html.twig';
let code = fs.readFileSync(path, 'utf8');

const customJs = `
<script>
// ----- GESTION DE COMBAT ----- //
const PC_DATA = {{ characters|json_encode()|raw }};
const EQ_DATA = {{ equipment|json_encode()|raw }};

let combatants = [];

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les combatants PCs
    PC_DATA.forEach(pc => {
        let defense = (pc.reflexes || 0) + Math.max(pc.melee||0, pc.cac||0, Math.floor((pc.athletisme||0)/2));
        let reaction = (pc.reflexes || 0) + (pc.vigilance || 0);
        let hpMax = (pc.maxblessurelegere||5) + (pc.maxblessuregrave||3) + (pc.maxblessuremortelle||2);
        let hpCurrent = hpMax - ((pc.blessurelegere||0) + (pc.blessuregrave||0) + (pc.blessuremortelle||0));
        
        let armorDesc = "0,0,0"; // Default
        if(pc.armureEquipee) {
            let eq = EQ_DATA.find(e => e.name === pc.armureEquipee);
            if(eq && eq.stats) {
                const match = eq.stats.match(/Protection: (\\d+)\\((.*?)\\)\\/(\\d+)\\((.*?)\\)\\/(\\d+)\\((.*?)\\)/);
                if(match) {
                    armorDesc = match[1]+","+match[3]+","+match[5];
                }
            }
        }
        
        combatants.push({
            id: pc.id_Character,
            isPC: true,
            name: pc.nom || "Inconnu",
            reaction: reaction,
            init: 0,
            def: defense,
            armor: armorDesc,
            hpMax: hpMax,
            hp: hpCurrent
        });
    });
    
    updateCombatUI();
});

function getArmorVal(armorStr, type) {
    // armorStr is format "C,P,T"
    let parts = armorStr.split(',');
    if(parts.length < 3) return 0;
    if(type === "C") return parseInt(parts[0])||0;
    if(type === "P") return parseInt(parts[1])||0;
    if(type === "T") return parseInt(parts[2])||0;
    return parseInt(parts[0])||0;
}

function addEnemy() {
    const name = document.getElementById("neName").value || "Goule";
    const react = parseInt(document.getElementById("neReact").value) || 2;
    const def = parseInt(document.getElementById("neDef").value) || 12;
    const armor = document.getElementById("neArmor").value || "0,0,0";
    const hp = parseInt(document.getElementById("neHP").value) || 10;
    
    combatants.push({
        id: "npc_"+Date.now(),
        isPC: false,
        name: name,
        reaction: react,
        init: 0,
        def: def,
        armor: armor,
        hpMax: hp,
        hp: hp
    });
    updateCombatUI();
}

function clearCombatants() {
    combatants = combatants.filter(c => c.isPC);
    logAction("PNJ nettoyés du traqueur.");
    updateCombatUI();
}

function rollInitiative() {
    combatants.forEach(c => {
        let roll = Math.floor(Math.random() * 10) + 1;
        c.init = roll + c.reaction;
    });
    combatants.sort((a,b) => b.init - a.init);
    logAction("Initiative lancée pour tous !");
    updateCombatUI();
}

function removeCombatant(id) {
    combatants = combatants.filter(c => c.id !== id);
    updateCombatUI();
}

function updateCombatUI() {
    const tbody = document.querySelector("#combatTable tbody");
    tbody.innerHTML = "";
    
    let attSelect = document.getElementById("atkAttaquant");
    let cibleSelect = document.getElementById("atkCible");
    let prevAtt = attSelect.value;
    let prevCib = cibleSelect.value;
    
    attSelect.innerHTML = "";
    cibleSelect.innerHTML = "";
    
    combatants.forEach(c => {
        // Table row
        let tr = document.createElement("tr");
        let badge = c.isPC ? '<span class="badge bg-primary">PJ</span>' : '<span class="badge bg-danger">PNJ</span>';
        let barColor = (c.hp / c.hpMax) > 0.5 ? 'success' : (c.hp / c.hpMax) > 0.2 ? 'warning' : 'danger';
        
        tr.innerHTML = \`
            <td><input type="number" class="form-control form-control-sm mj-input text-center p-0" style="width:40px;" value="\${c.init}" onchange="changeInit('\${c.id}', this.value)"></td>
            <td>\${badge} \${c.name}</td>
            <td><input type="number" class="form-control form-control-sm mj-input text-center p-0" style="width:40px;" value="\${c.def}" onchange="changeDef('\${c.id}', this.value)"></td>
            <td><input type="text" class="form-control form-control-sm mj-input text-center p-0" style="width:60px;" value="\${c.armor}" onchange="changeArmor('\${c.id}', this.value)"></td>
            <td>
                <div style="font-size:0.8em;">\${c.hp} / \${c.hpMax}</div>
                <div class="progress" style="height: 5px;">
                  <div class="progress-bar bg-\${barColor}" role="progressbar" style="width: \${(c.hp/c.hpMax)*100}%"></div>
                </div>
            </td>
            <td>
              <button class="btn btn-sm btn-outline-danger py-0 px-1" onclick="removeCombatant('\${c.id}')"><i class="fas fa-times"></i></button>
            </td>
        \`;
        tbody.appendChild(tr);
        
        // Selects
        let opt = document.createElement("option");
        opt.value = c.id; opt.textContent = c.name + " (Init:"+c.init+")";
        attSelect.appendChild(opt.cloneNode(true));
        cibleSelect.appendChild(opt);
    });
    
    if(prevAtt && combatants.find(c=>c.id==prevAtt)) attSelect.value = prevAtt;
    if(prevCib && combatants.find(c=>c.id==prevCib)) cibleSelect.value = prevCib;
}

function changeInit(id, val) { let c = combatants.find(x=>x.id==id); if(c) { c.init = parseInt(val)||0; combatants.sort((a,b)=>b.init-a.init); updateCombatUI(); } }
function changeDef(id, val) { let c = combatants.find(x=>x.id==id); if(c) c.def = parseInt(val)||0; }
function changeArmor(id, val) { let c = combatants.find(x=>x.id==id); if(c) c.armor = val; }

document.getElementById('atkArme').addEventListener('change', function(e) {
    if(this.value === 'custom') {
        document.getElementById('atkArmeCustom').style.display = 'block';
    } else {
        document.getElementById('atkArmeCustom').style.display = 'none';
        let parts = this.value.split(','); // 1D6,P
        document.getElementById('atkType').value = parts[1];
    }
});

function logAction(msg) {
    let box = document.getElementById("combatLog");
    box.innerHTML += "<div>" + msg + "</div>";
    box.scrollTop = box.scrollHeight;
}

function resolveAttack() {
    let attId = document.getElementById("atkAttaquant").value;
    let cibId = document.getElementById("atkCible").value;
    let jet = parseInt(document.getElementById("atkJet").value) || 0;
    
    let att = combatants.find(c=>c.id==attId);
    let cib = combatants.find(c=>c.id==cibId);
    
    if(!att || !cib) return alert("Veuillez sélectionner un attaquant et une cible.");
    
    // Vérifier la Défense
    let isHit = jet >= cib.def;
    
    logAction(\`---------------------\`);
    logAction(\`🥊 <b>\${att.name}</b> attaque <b>\${cib.name}</b> (\${jet} vs Déf \${cib.def})\`);
    
    if(!isHit) {
        return logAction(\`<span class="text-warning">=> L'attaque est esquivée ou bloquée par la défense !</span>\`);
    }
    
    // Si touche, lancer dégâts
    let weaponVal = document.getElementById("atkArme").value;
    let diceExpression = "";
    let type = "P";
    
    if(weaponVal === "custom") {
        diceExpression = document.getElementById("atkArmeCustom").value.toUpperCase();
        // Fallback default P
        type = "P";
    } else {
        let p = weaponVal.split(',');
        diceExpression = p[0];
        type = p[1];
    }
    
    // Rouler les dés: ex: 2D6
    let dmgTotal = 0;
    let m = diceExpression.match(/(\\d+)D(\\d+)/);
    if(m) {
        let n = parseInt(m[1]);
        let d = parseInt(m[2]);
        let rolls = [];
        for(let i=0; i<n; i++) {
            let r = Math.floor(Math.random()*d)+1;
            rolls.push(r);
            dmgTotal += r;
        }
        logAction(\`Dés roulés (\${diceExpression}): [\${rolls.join(', ')}] = \${dmgTotal} Dégâts \${type}\`);
    } else {
        dmgTotal = parseInt(diceExpression) || 0; // Fixed value
        logAction(\`Dégâts fixes: \${dmgTotal} \${type}\`);
    }
    
    // Soustraction de l'armure
    let armorProtec = getArmorVal(cib.armor, type);
    let finalDmg = Math.max(0, dmgTotal - armorProtec);
    
    logAction(\`Armure de \${cib.name} (\${cib.armor}): absorbe \${armorProtec} pt(s).\`);
    
    if(finalDmg <= 0) {
        logAction(\`<span class="text-info">=> L'armure encaisse tout ! Aucun dégât subi.</span>\`);
    } else {
        cib.hp = Math.max(0, cib.hp - finalDmg);
        
        // Qualification de la blessure selon la taille
        let woundCategory = "Légère";
        if(finalDmg >= 10) woundCategory = "Mortelle";
        else if(finalDmg >= 5) woundCategory = "Grave";
        
        logAction(\`<span class="text-danger">=> <b>\${cib.name}</b> subit \${finalDmg} Dégâts (Catégorie: \${woundCategory}) ! PV Restants: \${cib.hp}/\${cib.hpMax}</span>\`);
        updateCombatUI();
    }
}
</script>
`;

code = code.replace(/<\/script>\n\{% endblock %\}/, customJs + '\n</script>\n{% endblock %}');
fs.writeFileSync(path, code);
