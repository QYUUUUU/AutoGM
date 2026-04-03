function updateCombatUI() {
    const tbody = document.querySelector("#combatTable tbody");
    tbody.innerHTML = "";
    
    let attSelect = document.getElementById("atkAttaquant");
    let cibleSelect = document.getElementById("atkCible");
    let prevAtt = attSelect.value;
    let prevCib = cibleSelect.value;
    
    attSelect.innerHTML = "";
    cibleSelect.innerHTML = "";

    // Create optgroups
    let optPJ_att = document.createElement("optgroup"); optPJ_att.label = "Joueurs (PJ)";
    let optPNJ_att = document.createElement("optgroup"); optPNJ_att.label = "Non-Joueurs (PNJ)";
    
    let optPJ_cib = document.createElement("optgroup"); optPJ_cib.label = "Joueurs (PJ)";
    let optPNJ_cib = document.createElement("optgroup"); optPNJ_cib.label = "Non-Joueurs (PNJ)";
    
    combatants.forEach(c => {
        // Table row
        let tr = document.createElement("tr");
        let badge = c.isPC ? '<span class="badge bg-primary">PJ</span>' : '<span class="badge bg-danger">PNJ</span>';
        let barColor = (c.hp / c.hpMax) > 0.5 ? 'success' : (c.hp / c.hpMax) > 0.2 ? 'warning' : 'danger';
        tr.innerHTML = `
            <td><input type="number" class="form-control form-control-sm mj-input text-center p-0" style="width:40px;" value="${c.init}" onchange="changeInit('${c.id}', this.value)"></td>
            <td>${badge} ${c.name}</td>
            <td><input type="number" class="form-control form-control-sm mj-input text-center p-0" style="width:40px;" value="${c.def}" onchange="changeDef('${c.id}', this.value)"></td>
            <td><input type="text" class="form-control form-control-sm mj-input text-center p-0" style="width:60px;" value="${c.armor}" onchange="changeArmor('${c.id}', this.value)"></td>
            <td>
                <div style="font-size:0.8em;">${c.hp} / ${c.hpMax}</div>
                <div class="progress" style="height: 5px;">
                  <div class="progress-bar bg-${barColor}" role="progressbar" style="width: ${(c.hp/c.hpMax)*100}%"></div>
                </div>
            </td>
            <td>
              <button class="btn btn-sm btn-outline-danger py-0 px-1" onclick="removeCombatant('${c.id}')"><i class="fas fa-times"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
        
        // Selects
        let opt = document.createElement("option");
        opt.value = c.id; 
        opt.textContent = c.name + " (Init:"+c.init+")";
        
        if (c.isPC) {
            optPJ_att.appendChild(opt.cloneNode(true));
            optPJ_cib.appendChild(opt.cloneNode(true));
        } else {
            optPNJ_att.appendChild(opt.cloneNode(true));
            optPNJ_cib.appendChild(opt.cloneNode(true));
        }
    });

    attSelect.appendChild(optPJ_att);
    attSelect.appendChild(optPNJ_att);
    
    cibleSelect.appendChild(optPJ_cib);
    cibleSelect.appendChild(optPNJ_cib);
    
    if(prevAtt && combatants.find(c=>c.id==prevAtt)) attSelect.value = prevAtt;
    if(prevCib && combatants.find(c=>c.id==prevCib)) cibleSelect.value = prevCib;
}
