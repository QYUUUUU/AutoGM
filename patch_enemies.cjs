const fs = require('fs');
let code = fs.readFileSync('app/views/admin.html.twig', 'utf8');

const targetHtml = `<h5>Ajouter Ennemi / PNJ</h5>
                            <div class="row g-2 mb-3">`;

const replaceHtml = `<h5>Ajouter Ennemi / PNJ</h5>
                            <select id="bestiarySelect" class="form-select form-select-sm mj-select mb-2" onchange="loadBestiary(this)">
                                <option value="">-- Depuis le Bestiaire --</option>
                                {% for adv in adversaries %}
                                <option value="{{ adv.name|escape('html') }}" data-react="{{ adv.reaction }}" data-arm="{{ adv.armure }}" data-l="{{ adv.blessuresLegeres }}" data-g="{{ adv.blessuresGraves }}" data-m="{{ adv.blessuresMortelles }}">{{ adv.name }} (Menace: {{ adv.menace }})</option>
                                {% endfor %}
                            </select>
                            <div class="row g-2 mb-3">`;

if (code.includes(targetHtml)) {
    code = code.replace(targetHtml, replaceHtml);
}

const jsAppend = `
function loadBestiary(sel) {
    if (!sel.value) return;
    const opt = sel.options[sel.selectedIndex];
    document.getElementById('neName').value = sel.value;
    
    let l = opt.getAttribute('data-l') || 3;
    let g = opt.getAttribute('data-g') || 2;
    let m = opt.getAttribute('data-m') || 1;
    document.getElementById('neWounds').value = l + ',' + g + ',' + m;
    
    let armText = (opt.getAttribute('data-arm') || "").toLowerCase();
    let arm = "0,0,0";
    let match = armText.match(/(\\d+)/);
    if (match) {
        let n = parseInt(match[1]);
        arm = n + ',' + n + ',' + n;
    }
    document.getElementById('neArmor').value = arm;
    
    let reactText = opt.getAttribute('data-react') || "";
    let reactMatch = reactText.match(/(\\d+)/);
    if (reactMatch) {
       document.getElementById('neReact').value = reactMatch[1];
    }
}
`;

if (!code.includes('function loadBestiary')) {
    code = code.replace('</script>', jsAppend + '\n</script>');
}

fs.writeFileSync('app/views/admin.html.twig', code);
console.log("Patched Add Enemy window for bestiary integration !");

