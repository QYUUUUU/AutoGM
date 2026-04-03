const fs = require('fs');

let code = fs.readFileSync('app/views/admin.html.twig', 'utf8');

const oldForm = `<input type="text" id="newCombatantName" class="form-control" placeholder="Nom du combattant">`;
const newForm = `
<div class="input-group mb-2">
    <input type="text" id="newCombatantName" class="form-control" placeholder="Nom du combattant libre...">
</div>
<div class="input-group mb-2">
    <select id="bestiarySelect" class="form-select bg-dark text-light border-secondary">
        <option value="">-- Choisir depuis le Bestiaire --</option>
        {% for adv in adversaries %}
        <option value="{{ adv.name }}" data-l="{{ adv.blessuresLegeres }}" data-g="{{ adv.blessuresGraves }}" data-m="{{ adv.blessuresMortelles }}">{{ adv.name }} (L:{{ adv.blessuresLegeres }} G:{{ adv.blessuresGraves }} M:{{ adv.blessuresMortelles }})</option>
        {% endfor %}
    </select>
</div>
`;

if(code.includes(oldForm)) {
    code = code.replace(oldForm, newForm);
    fs.writeFileSync('app/views/admin.html.twig', code);
    console.log("Updated form HTML");
}

let newJs = `
function addCombatant() {
    let nameInput = document.getElementById('newCombatantName').value.trim();
    let bestiarySelect = document.getElementById('bestiarySelect');
    let type = document.getElementById('newCombatantType').value;
    
    let name = nameInput;
    let maxL = 5, maxG = 3, maxM = 2; // Default for PJ or generic
    
    if(bestiarySelect && bestiarySelect.value && !nameInput) {
        name = bestiarySelect.value;
        let selectedOption = bestiarySelect.options[bestiarySelect.selectedIndex];
        maxL = parseInt(selectedOption.getAttribute('data-l')) || 2;
        maxG = parseInt(selectedOption.getAttribute('data-g')) || 3;
        maxM = parseInt(selectedOption.getAttribute('data-m')) || 4;
        type = 'PNJ'; // bestiary defaults to PNJ
    }
    
    if (!name) {
        alert("Veuillez entrer un nom ou choisir dans le bestiaire.");
        return;
    }
    
    combatants.push({ 
        id: Date.now(), 
        name, 
        type, 
        init: 0, 
        wounds: { L:0, G:0, M:0 }, 
        maxWounds: { L: maxL, G: maxG, M: maxM } 
    });
    
    document.getElementById('newCombatantName').value = '';
    if(bestiarySelect) bestiarySelect.selectedIndex = 0;
    
    renderCombatTable();
}
`;

code = code.replace(/function addCombatant\(\) \{[\s\S]*?renderCombatTable\(\);\s*\}/, newJs.trim());
fs.writeFileSync('app/views/admin.html.twig', code);
console.log("Updated addCombatant function");
