const fs = require('fs');

const newContent = `            <!-- GESTIONNAIRE DE COMBAT -->
            <div class="col-lg-12">
                <div class="mj-card mt-4">
                    <div class="mj-card-header">
                        <h2 class="mj-card-title"><i class="fas fa-swords text-white"></i> Suivi d'Initiative & Combats</h2>
                    </div>
                    <div class="mj-card-body row text-white">
                        <!-- Panel de gauche : Liste de combat -->
                        <div class="col-md-7 border-end border-secondary">
                            <div class="d-flex justify-content-between mb-3">
                                <h4>Combattants</h4>
                                <div>
                                    <button class="btn btn-sm btn-outline-info" onclick="rollInitiative()">Lancer Initiative (1D10 + Réaction)</button>
                                    <button class="btn btn-sm btn-outline-warning" onclick="clearCombatants()">Vider Ennemis</button>
                                </div>
                            </div>
                            
                            <h5>Personnages Joueurs (PJ)</h5>
                            <div class="table-responsive mb-3">
                                <table class="table table-dark table-striped text-white align-middle" id="combatTablePJ">
                                    <thead>
                                        <tr>
                                            <th>Init</th>
                                            <th>Nom</th>
                                            <th>Armure<br><small>(C,P,T)</small></th>
                                            <th style="width:150px;">Blessures<br><small>(L/G/M)</small></th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>

                            <h5>Personnages Non-Joueurs (PNJ)</h5>
                            <div class="table-responsive mb-4">
                                <table class="table table-dark table-striped text-white align-middle" id="combatTablePNJ">
                                    <thead>
                                        <tr>
                                            <th>Init</th>
                                            <th>Nom</th>
                                            <th>Armure<br><small>(C,P,T)</small></th>
                                            <th style="width:150px;">Blessures<br><small>(L/G/M)</small></th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                            
                            <hr class="border-secondary">
                            <h5>Ajouter Ennemi / PNJ</h5>
                            <div class="row g-2 mb-3">
                                <div class="col-sm-3"><input type="text" id="neName" class="form-control form-control-sm mb-1" placeholder="Nom"></div>
                                <div class="col-sm-2"><input type="number" id="neReact" class="form-control form-control-sm mb-1" placeholder="Réaction" value="2"></div>
                                <div class="col-sm-3"><input type="text" id="neArmor" class="form-control form-control-sm mb-1" placeholder="0,0,0 (C,P,T)"></div>
                                <div class="col-sm-4"><input type="text" id="neWounds" class="form-control form-control-sm mb-1" placeholder="Max: L,G,M (ex: 3,2,1)" value="3,2,1"></div>
                            </div>
                            <button class="btn btn-sm btn-danger w-100" onclick="addEnemy()">+ Ajouter Ennemi</button>
                            
                            <hr class="border-secondary mt-4">
                            <h5>Générateur Express de PNJ</h5>
                            <div class="row g-2 mb-3">
                                <div class="col-sm-4">
                                    <select id="expressProfil" class="form-select form-select-sm mj-select">
                                        <option value="3">Néophyte (3 dés)</option>
                                        <option value="5">Apprenti (5 dés)</option>
                                        <option value="7">Vétéran (7 dés)</option>
                                        <option value="9">Élite (9 dés)</option>
                                    </select>
                                </div>
                                <div class="col-sm-4">
                                    <select id="expressCulture" class="form-select form-select-sm mj-select">
                                        <option value="Babel">Babel (+Int)</option>
                                        <option value="Empire">L'Empire (+For/Arm)</option>
                                        <option value="Khashan">Khashan (+Ref)</option>
                                        <option value="Saeth">Saeth (+Agil)</option>
                                    </select>
                                </div>
                                <div class="col-sm-4">
                                    <button class="btn btn-sm btn-warning w-100" onclick="generateExpressPNJ()">+ Générer</button>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Panel de droite : Résolution Combat -->
                        <div class="col-md-5">
                            <h4>Résolution d'Attaque</h4>
                            
                            <div class="mb-3">
                                <label>Attaquant :</label>
                                <select id="atkAttaquant" class="form-select form-select-sm mj-select"></select>
                            </div>

                            <div class="mb-3">
                                <label>Réussites de l'attaquant (Jet d'Attaque) :</label>
                                <input type="number" id="atkJet" class="form-control form-control-sm" placeholder="Nb de réussites">
                            </div>
                            
                            <hr class="border-secondary">

                            <div class="mb-3">
                                <label>Cible :</label>
                                <select id="atkCible" class="form-select form-select-sm mj-select"></select>
                            </div>
                            
                            <div class="mb-3">
                                <label>Réussites du défenseur (Jet de Défense) :</label>
                                <input type="number" id="defJet" class="form-control form-control-sm" placeholder="Nb de réussites">
                            </div>
                            
                            <hr class="border-secondary">

                            <div class="mb-3">
                                <label>Arme & Dégâts de base (si touché) :</label>
                                <select id="atkArme" class="form-select form-select-sm mj-select mb-1">
                                    <option value="1D6,P">Arc - 1D6 (P)</option>
                                    <option value="1D6,T">Epée Courte - 1D6 (T)</option>
                                    <option value="2D6,T">Epée Lourde - 2D6 (T)</option>
                                    <option value="1D8,C">Masse - 1D8 (C)</option>
                                    <option value="1D4,C">Poings - 1D4 (C)</option>
                                    <option value="custom">Autre (Saisie Manuelle)</option>
                                </select>
                                <input type="text" id="atkArmeCustom" class="form-control form-control-sm" placeholder="Ex: 5" style="display:none;">
                                <input type="hidden" id="atkType" value="P">
                            </div>
                            
                            <button class="btn btn-danger w-100 mb-3" onclick="resolveAttack()"><i class="fas fa-gavel"></i> Lancer l'Attaque</button>
                            
                            <div id="combatLog" class="p-2 border border-secondary rounded" style="background:#111; height:300px; overflow-y:auto; font-family:monospace; font-size:0.9em; white-space:pre-wrap;"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050">
    <div id="saveToast" class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          <i class="fas fa-check-circle me-2"></i> État du monde sauvegardé !
        </div>
      </div>
    </div>
</div>

<script>
// ----- JSON DATA DUMPS ----- //
const activeGroupeId = document.getElementById('activeGroupeId') ? document.getElementById('activeGroupeId').value : null;
const saveBtn = document.getElementById('saveWorldBtn');
const saveBtn2 = document.getElementById('saveWorldBtn2');
const toast = document.getElementById('saveToast');

document.addEventListener('DOMContentLoaded', () => {
    const saveChanges = async () => {
        const payload = {
            saison: document.getElementById('saison') ? document.getElementById('saison').value : null,
            climat: document.getElementById('climat') ? document.getElementById('climat').value : null,
            timeOfDay: document.getElementById('timeOfDay') ? document.getElementById('timeOfDay').value : null,
            weekType: document.getElementById('weekType') ? document.getElementById('weekType').value : null,
            dayNumber: document.getElementById('dayNumber') ? document.getElementById('dayNumber').value : null,
            sinlaPhase: document.getElementById('sinlaPhase') ? document.getElementById('sinlaPhase').value : null,
            akhatState: document.getElementById('akhatState') ? document.getElementById('akhatState').value : null,
            loisCoutumes: document.getElementById('loisCoutumes') ? document.getElementById('loisCoutumes').value : null,
            rations: document.getElementById('rations') ? document.getElementById('rations').value : null,
            etatMontures: document.getElementById('etatMontures') ? document.getElementById('etatMontures').value : null,
            encombrement: document.getElementById('encombrement') ? document.getElementById('encombrement').value : null,
            groupeId: activeGroupeId
        };
        try {
            const response = await fetch('/admin/world-state', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if(response.ok) {
                toast.style.display = 'block';
                setTimeout(() => { toast.style.opacity = '1'; }, 10);
                setTimeout(() => {
                    toast.style.opacity = '0';
                    setTimeout(() => { toast.style.display = 'none'; }, 400);
                }, 3000);
            } else {
                alert("Erreur lors de la sauvegarde.");
            }
        } catch(err) {
            console.error(err);
        }
    };
    if (saveBtn) saveBtn.addEventListener('click', saveChanges);
    if (saveBtn2) saveBtn2.addEventListener('click', saveChanges);
});

// ----- GESTION DE COMBAT ----- //
const PC_DATA = {{ characters|json_encode()|raw }};
const EQ_DATA = {{ equipment|json_encode()|raw }};

let combatants = [];

document.addEventListener('DOMContentLoaded', () => {
    // Initialiser les combatants PCs
    PC_DATA.forEach(pc => {
        let reaction = (pc.reflexes || 0) + (pc.vigilance || 0);
        let maxL = pc.maxblessurelegere || 4;
        let maxG = pc.maxblessuregrave || 2;
        let maxM = pc.maxblessuremortelle || 1;
        
        let l = pc.blessurelegere || 0;
        let g = pc.blessuregrave || 0;
        let m = pc.blessuremortelle || 0;
        
        let armorDesc = "0,0,0"; // Default (C,P,T)
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
            armor: armorDesc,
            lMax: maxL,
            gMax: maxG,
            mMax: maxM,
            l: l,
            g: g,
            m: m
        });
    });
    
    updateCombatUI();
});

function getArmorVal(armorStr, type) {
    if(!armorStr) return 0;
    let parts = armorStr.split(',');
    if(parts.length < 3) return parseInt(parts[0])||0;
    if(type === "C") return parseInt(parts[0])||0;
    if(type === "P") return parseInt(parts[1])||0;
    if(type === "T") return parseInt(parts[2])||0;
    return parseInt(parts[0])||0;
}

function generateExpressPNJ() {
    const profSelect = document.getElementById("expressProfil");
    const cultSelect = document.getElementById("expressCulture");
    const rating = parseInt(profSelect.value); // 3, 5, 7, 9
    const culture = cultSelect.value;
    
    let baseName = "PNJ ("+culture+" - "+rating+"d)";
    let react = rating - 1;
    
    let maxL = Math.max(1, Math.floor(rating / 1.5));
    let maxG = Math.max(1, Math.floor(rating / 3));
    let maxM = 1;
    
    let arm = 0;
    if(rating >= 5) arm = 2;
    if(rating >= 7) arm = 4;
    if(rating >= 9) arm = 6;
    
    if(culture === "Empire") { arm += 1; maxL += 1; }
    if(culture === "Khashan") { react += 2; }
    
    let armor = arm + "," + arm + "," + arm;

    combatants.push({
        id: "npc_exp_"+Date.now(),
        isPC: false,
        name: baseName,
        reaction: react,
        init: 0,
        armor: armor,
        lMax: maxL,
        gMax: maxG,
        mMax: maxM,
        l: 0,
        g: 0,
        m: 0
    });
    updateCombatUI();
    logAction(\`=> Ajout Rapide: \${baseName} (Blessures max: L:\${maxL} G:\${maxG} M:\${maxM})\`);
}

function addEnemy() {
    const name = document.getElementById("neName").value || "Goule";
    const react = parseInt(document.getElementById("neReact").value) || 2;
    const armor = document.getElementById("neArmor").value || "0,0,0";
    
    let woundsRaw = document.getElementById("neWounds").value || "3,2,1";
    let wSplit = woundsRaw.split(',');
    
    let maxL = parseInt(wSplit[0]) || 3;
    let maxG = parseInt(wSplit[1]) || 2;
    let maxM = parseInt(wSplit[2]) || 1;
    
    combatants.push({
        id: "npc_"+Date.now(),
        isPC: false,
        name: name,
        reaction: react,
        init: 0,
        armor: armor,
        lMax: maxL,
        gMax: maxG,
        mMax: maxM,
        l: 0,
        g: 0,
        m: 0
    });
    updateCombatUI();
}

function clearCombatants() {
    combatants = combatants.filter(c => c.isPC);
    logAction("=> PNJ balayés du traqueur.");
    updateCombatUI();
}

function rollInitiative() {
    combatants.forEach(c => {
        let roll = Math.floor(Math.random() * 10) + 1;
        c.init = roll + c.reaction;
    });
    combatants.sort((a,b) => b.init - a.init);
    logAction("=> Initiatives lancées (1D10 + R.) 🎲");
    updateCombatUI();
}

function removeCombatant(id) {
    combatants = combatants.filter(c => c.id !== id);
    updateCombatUI();
}

function renderRow(c) {
    let badge = c.isPC ? '<span class="badge bg-primary">PJ</span>' : '<span class="badge bg-danger">PNJ</span>';
    return \`
        <tr>
            <td><input type="number" class="form-control form-control-sm mj-input text-center p-0" style="width:40px;" value="\${c.init}" onchange="changeInit('\${c.id}', this.value)"></td>
            <td>\${badge} \${c.name}</td>
            <td><input type="text" class="form-control form-control-sm mj-input text-center p-0" style="width:60px;" value="\${c.armor}" onchange="changeArmor('\${c.id}', this.value)"></td>
            <td>
                <div class="d-flex align-items-center justify-content-start gap-2" style="font-size:0.85em;">
                    <div class="d-flex flex-column align-items-center">
                        <small class="text-warning">Lég (\${c.lMax})</small>
                        <input type="number" min="0" max="\${c.lMax}" class="form-control form-control-sm mj-input text-center p-0" style="width:35px; height:24px; color:#ffc107;" value="\${c.l}" onchange="changeWound('\${c.id}', 'l', this.value)">
                    </div>
                    <div class="d-flex flex-column align-items-center">
                        <small class="text-danger">Grav (\${c.gMax})</small>
                        <input type="number" min="0" max="\${c.gMax}" class="form-control form-control-sm mj-input text-center p-0" style="width:35px; height:24px; color:#dc3545;" value="\${c.g}" onchange="changeWound('\${c.id}', 'g', this.value)">
                    </div>
                    <div class="d-flex flex-column align-items-center">
                        <small class="text-white" style="background:#dc3545; padding:0 2px; border-radius:2px;">Mort (\${c.mMax})</small>
                        <input type="number" min="0" max="\${c.mMax}" class="form-control form-control-sm mj-input text-center p-0" style="width:35px; height:24px; color:#ff8888;" value="\${c.m}" onchange="changeWound('\${c.id}', 'm', this.value)">
                    </div>
                </div>
            </td>
            <td>
              <button class="btn btn-sm btn-outline-danger py-0 px-1" onclick="removeCombatant('\${c.id}')"><i class="fas fa-times"></i></button>
            </td>
        </tr>
    \`;
}

function updateCombatUI() {
    const tbodyPJ = document.querySelector("#combatTablePJ tbody");
    const tbodyPNJ = document.querySelector("#combatTablePNJ tbody");
    if(tbodyPJ) tbodyPJ.innerHTML = "";
    if(tbodyPNJ) tbodyPNJ.innerHTML = "";
    
    let attSelect = document.getElementById("atkAttaquant");
    let cibleSelect = document.getElementById("atkCible");
    let prevAtt = attSelect ? attSelect.value : null;
    let prevCib = cibleSelect ? cibleSelect.value : null;
    
    if(attSelect) attSelect.innerHTML = "";
    if(cibleSelect) cibleSelect.innerHTML = "";

    let optPJ_att = document.createElement("optgroup"); optPJ_att.label = "Joueurs (PJ)";
    let optPNJ_att = document.createElement("optgroup"); optPNJ_att.label = "Non-Joueurs (PNJ)";
    let optPJ_cib = document.createElement("optgroup"); optPJ_cib.label = "Joueurs (PJ)";
    let optPNJ_cib = document.createElement("optgroup"); optPNJ_cib.label = "Non-Joueurs (PNJ)";
    
    combatants.forEach(c => {
        if (c.isPC) {
            if(tbodyPJ) tbodyPJ.innerHTML += renderRow(c);
        } else {
            if(tbodyPNJ) tbodyPNJ.innerHTML += renderRow(c);
        }
        
        let opt = document.createElement("option");
        opt.value = c.id; 
        opt.textContent = c.name + " (" + c.init + ")";
        
        if (c.isPC) {
            optPJ_att.appendChild(opt.cloneNode(true));
            optPJ_cib.appendChild(opt.cloneNode(true));
        } else {
            optPNJ_att.appendChild(opt.cloneNode(true));
            optPNJ_cib.appendChild(opt.cloneNode(true));
        }
    });

    if(attSelect) { attSelect.appendChild(optPJ_att); attSelect.appendChild(optPNJ_att); }
    if(cibleSelect) { cibleSelect.appendChild(optPJ_cib); cibleSelect.appendChild(optPNJ_cib); }
    
    if(prevAtt && combatants.find(c=>c.id==prevAtt) && attSelect) attSelect.value = prevAtt;
    if(prevCib && combatants.find(c=>c.id==prevCib) && cibleSelect) cibleSelect.value = prevCib;
}

function changeInit(id, val) { let c = combatants.find(x=>x.id==id); if(c) { c.init = parseInt(val)||0; combatants.sort((a,b)=>b.init-a.init); updateCombatUI(); } }
function changeArmor(id, val) { let c = combatants.find(x=>x.id==id); if(c) { c.armor = val; } }
function changeWound(id, type, val) {
    let c = combatants.find(x=>x.id==id);
    if(c) {
        let v = parseInt(val) || 0;
        if(type === 'l') c.l = Math.max(0, Math.min(v, c.lMax));
        if(type === 'g') c.g = Math.max(0, Math.min(v, c.gMax));
        if(type === 'm') c.m = Math.max(0, Math.min(v, c.mMax));
        updateCombatUI();
    }
}

document.getElementById('atkArme').addEventListener('change', function(e) {
    if(this.value === 'custom') {
        document.getElementById('atkArmeCustom').style.display = 'block';
    } else {
        document.getElementById('atkArmeCustom').style.display = 'none';
        let parts = this.value.split(','); // "1D6,P"
        if(parts.length > 1) document.getElementById('atkType').value = parts[1];
    }
});

function logAction(msg) {
    let box = document.getElementById("combatLog");
    if(box) {
        box.innerHTML += "<div>" + msg + "</div>";
        box.scrollTop = box.scrollHeight;
    }
}

function resolveAttack() {
    let attId = document.getElementById("atkAttaquant").value;
    let cibId = document.getElementById("atkCible").value;
    
    let atkJet = parseInt(document.getElementById("atkJet").value) || 0;
    let defJet = parseInt(document.getElementById("defJet").value) || 0;
    
    let att = combatants.find(c=>c.id==attId);
    let cib = combatants.find(c=>c.id==cibId);
    
    if(!att || !cib) return alert("Sélectionnez les cibles.");
    
    logAction(\`<hr class="border-secondary my-1">\`);
    logAction(\`🥊 <b>\${att.name}</b> attaque <b>\${cib.name}</b>\`);
    logAction(\`=> Jet: \${atkJet} R. (Attaque) VS \${defJet} R. (Défense)\`);
    
    if(defJet >= atkJet) {
        let margin = defJet - atkJet;
        let cAttack = margin >= 3 ? " <span class='text-warning'>(Contre-attaque dispo!)</span>" : "";
        return logAction(\`<span class="text-info align-items-center">🛡️ Défense réussie!\${cAttack} Aucun dommage.</span>\`);
    }
    
    // Attaquant gagne
    let successes = atkJet; // les dommages de la base de l'arme + réussites du jet
    
    let weaponVal = document.getElementById("atkArme").value;
    let diceExpression = "";
    let type = "P";
    
    if(weaponVal === "custom") {
        diceExpression = document.getElementById("atkArmeCustom").value.toUpperCase();
        type = "P";
    } else {
        let parts = weaponVal.split(',');
        diceExpression = parts[0];
        type = parts[1];
    }
    
    let baseDmg = 0;
    let m = diceExpression.match(/(\\d+)D(\\d+)/);
    if(m) {
        let n = parseInt(m[1]);
        let d = parseInt(m[2]);
        let rolls = [];
        for(let i=0; i<n; i++) {
            let r = Math.floor(Math.random()*d)+1;
            rolls.push(r);
            baseDmg += r;
        }
        logAction(\`=> Dégâts arme (\${diceExpression}): [\${rolls.join('+')}] = \${baseDmg} (\${type})\`);
    } else {
        baseDmg = parseInt(diceExpression) || 0;
        logAction(\`=> Dégâts arme (fixes): \${baseDmg} (\${type})\`);
    }
    
    let totalDmg = baseDmg + successes;
    logAction(\`=> Dégâts bruts: \${baseDmg} (arme) + \${successes} (réussites) = \${totalDmg} (\${type})\`);
    
    // Soustraction armure
    let armorValue = getArmorVal(cib.armor, type);
    let finalDmg = Math.max(0, totalDmg - armorValue);
    
    logAction(\`=> Armure cible (\${cib.armor}): absorbe \${armorValue} pt(s)\`);
    
    if(finalDmg <= 0) {
        logAction(\`<span class="text-success">=> L'armure absorbe la totalité ! 0 Dégât net.</span>\`);
    } else {
        logAction(\`<span class="text-danger">=> <b>\${cib.name}</b> subit <b>\${finalDmg} Dégâts nets</b>. (Mettez à jour les coche(s) de Blessure manuellement)</span>\`);
    }
}
</script>
{% endblock %}
`;

fs.appendFileSync('app/views/admin.html.twig', newContent);
console.log("Success");
