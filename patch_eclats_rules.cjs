const fs = require('fs');

// Patching eclats.html.twig
const uiFile = 'app/views/eclats.html.twig';
let ui = fs.readFileSync(uiFile, 'utf8');

const newModalHTML = `
<!-- Eclat Modals -->
<div class="modal fade" id="pactModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" style="color: var(--god-text);">
        <div class="modal-content" style="background: var(--god-dark); border: 1px solid var(--god-gold);">
            <div class="modal-header border-bottom-0" style="background: rgba(255,255,255,0.05);">
                <h5 class="modal-title" style="color: var(--god-gold); font-family: 'Cinzel', serif;" id="pactModalTitle">Formation du Pacte</h5>
                <button type="button" class="close" data-dismiss="modal" style="color: var(--god-gold); text-shadow: none;">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p class="mb-4" id="pactModalDesc">L'Élu gagne de nouveaux pouvoirs. Choisissez la caractéristique et les compétences qui seront augmentées.</p>
                <div class="form-group">
                    <label class="god-label">Caractéristique (+1)</label>
                    <select id="pactStat" class="form-control god-input">
                        <option value="puissance">Puissance</option>
                        <option value="resistance">Résistance</option>
                        <option value="precision">Précision</option>
                        <option value="reflexes">Réflexes</option>
                        <option value="connaissance">Connaissance</option>
                        <option value="perception">Perception</option>
                        <option value="volonte">Volonté</option>
                        <option value="empathie">Empathie</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="god-label">Compétence 1 (+1)</label>
                    <select id="pactSkill1" class="form-control god-input">
                        ${[
                            'arts', 'cite', 'civilisations', 'relationnel', 'soins', 'animalisme', 'faune', 'montures', 'pistage', 'territoire',
                            'adresse', 'armurerie', 'artisanat', 'mecanisme', 'runes', 'athletisme', 'discretion', 'flore', 'vigilance', 'voyage',
                            'bouclier', 'cac', 'lancer', 'melee', 'tir', 'eclats', 'lunes', 'mythes', 'pantheons', 'rituels'
                        ].map(s => `<option value="${s}">${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group" id="pactSkill2Container" style="display:none;">
                    <label class="god-label">Compétence 2 (+1)</label>
                    <select id="pactSkill2" class="form-control god-input">
                        <option value="">-- Aucune (Rencontre/Entente) --</option>
                        ${[
                            'arts', 'cite', 'civilisations', 'relationnel', 'soins', 'animalisme', 'faune', 'montures', 'pistage', 'territoire',
                            'adresse', 'armurerie', 'artisanat', 'mecanisme', 'runes', 'athletisme', 'discretion', 'flore', 'vigilance', 'voyage',
                            'bouclier', 'cac', 'lancer', 'melee', 'tir', 'eclats', 'lunes', 'mythes', 'pantheons', 'rituels'
                        ].map(s => `<option value="${s}">${s.charAt(0).toUpperCase() + s.slice(1)}</option>`).join('')}
                    </select>
                </div>
                
                <input type="hidden" id="pactActionType" value="">
            </div>
            <div class="modal-footer border-top-0">
                <button type="button" class="btn btn-god-outline" data-dismiss="modal">Annuler</button>
                <button type="button" class="btn btn-god" onclick="confirmPactAction()">Sceller</button>
            </div>
        </div>
    </div>
</div>
`;

// Remove the old modal
ui = ui.replace(/<!-- Eclat Upgrade Modal -->[\s\S]*?<!-- Tabs Content -->/, newModalHTML + '\n    <!-- Tabs Content -->');

const jsLogic = `
    function bindGod() {
        const characterId = document.getElementById('pacteCharacterSelect').value;
        const godId = document.getElementById('pacteGodSelect').value;
        if(!characterId || !godId) return alert("Sélectionnez l'âme et la divinité.");

        document.getElementById('pactModalTitle').innerText = 'Initier la Rencontre';
        document.getElementById('pactModalDesc').innerText = 'L\\'Élu entre en possession de son Éclat.\\nIl gagne +1 Caractéristique et +1 Compétence.';
        document.getElementById('pactSkill2Container').style.display = 'none';
        document.getElementById('pactActionType').value = 'bind';
        $('#pactModal').modal('show');
    }

    function upgradePact() {
        const select = document.getElementById('pacteCharacterSelect');
        const option = select.options[select.selectedIndex];
        const stade = option.getAttribute('data-stade') || 'Rencontre';

        document.getElementById('pactModalTitle').innerText = 'Élever le Pacte';
        document.getElementById('pactActionType').value = 'upgrade';

        if (stade === 'Rencontre') {
            document.getElementById('pactModalDesc').innerText = 'Passage à l\\'Entente.\\nL\\'Élu gagne +1 Caractéristique et +1 Compétence.';
            document.getElementById('pactSkill2Container').style.display = 'none';
        } else if (stade === 'Entente') {
            document.getElementById('pactModalDesc').innerText = 'Passage à l\\'Accord.\\nL\\'Élu gagne +1 Caractéristique et DEUX Compétences.';
            document.getElementById('pactSkill2Container').style.display = 'block';
        }
        
        $('#pactModal').modal('show');
    }

    function confirmPactAction() {
        const type = document.getElementById('pactActionType').value;
        const characterId = document.getElementById('pacteCharacterSelect').value;
        const stat = document.getElementById('pactStat').value;
        const skill1 = document.getElementById('pactSkill1').value;
        let skill2 = document.getElementById('pactSkill2').value;
        
        if (document.getElementById('pactSkill2Container').style.display === 'none') {
            skill2 = null;
        }

        if (type === 'bind') {
            const godId = document.getElementById('pacteGodSelect').value;
            fetch('/eclats/pacte/bind', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ characterId, godId, stat, skill1 })
            }).then(res => res.json()).then(data => {
                if(data.success) { $('#pactModal').modal('hide'); location.reload(); }
                else alert('Erreur: ' + data.message);
            });
        } else if (type === 'upgrade') {
            fetch('/eclats/pacte/upgrade', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ characterId, statToUpgrade: stat, skillToUpgrade1: skill1, skillToUpgrade2: skill2 })
            }).then(res => res.json()).then(data => {
                if(data.success) { $('#pactModal').modal('hide'); location.reload(); }
                else alert('Erreur: ' + data.message);
            });
        }
    }
`;

// Replace old script functions
ui = ui.replace(/function bindGod\(\) \{[\s\S]*?\}\s*function upgradePact\(\) \{[\s\S]*?\}\s*function confirmUpgradePact\(\) \{[\s\S]*?\}\s*/, jsLogic + '\n    ');
fs.writeFileSync(uiFile, ui);

// Patch Backend logic
const routesFile = 'app/routes/eclatsRoutes.js';
let routes = fs.readFileSync(routesFile, 'utf8');

// Replace bind
const newBindLogic = `
router.post('/pacte/bind', isAuthenticated, async (req, res) => {
    const { characterId, godId, stat, skill1 } = req.body;
    if (!characterId || !godId) return res.status(400).json({ success: false, message: 'Personnage et Dieu requis.' });
    try {
        const character = await prisma.character.findFirst({ where: { id_Character: parseInt(characterId), userId: req.session.userId } });
        if(!character) return res.status(403).json({ success: false, message: 'Personnage introuvable.' });

        const validStats = ['puissance', 'resistance', 'precision', 'reflexes', 'connaissance', 'perception', 'volonte', 'empathie'];
        const validSkills = ['arts', 'cite', 'civilisations', 'relationnel', 'soins', 'animalisme', 'faune', 'montures', 'pistage', 'territoire', 'adresse', 'armurerie', 'artisanat', 'mecanisme', 'runes', 'athletisme', 'discretion', 'flore', 'vigilance', 'voyage', 'bouclier', 'cac', 'lancer', 'melee', 'tir', 'eclats', 'lunes', 'mythes', 'pantheons', 'rituels'];

        let updateData = { godId: parseInt(godId), stadeEclat: 'Rencontre', faveurs: '[]' };
        
        if (stat && validStats.includes(stat)) updateData[stat] = { increment: 1 };
        if (skill1 && validSkills.includes(skill1)) updateData[skill1] = { increment: 1 };

        await prisma.character.update({
            where: { id_Character: character.id_Character },
            data: updateData
        });
        res.json({ success: true });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erreur Serveur.' });
    }
});
`;

routes = routes.replace(/router\.post\('\/pacte\/bind',[\s\S]*?catch\(err\) \{[\s\S]*?res\.status\(500\)\.json\(\{ success: false, message: 'Erreur Serveur\.' \}\);\n\s+\}\n\}\);/, newBindLogic.trim());

const newUpgradeLogic = `
router.post('/pacte/upgrade', isAuthenticated, async (req, res) => {
    const { characterId, statToUpgrade, skillToUpgrade1, skillToUpgrade2 } = req.body;
    try {
        const character = await prisma.character.findFirst({ where: { id_Character: parseInt(characterId), userId: req.session.userId } });
        if(!character || !character.godId) return res.status(403).json({ success: false, message: 'Personnage introuvable ou non lié.' });

        let newStade = 'Rencontre';
        if (character.stadeEclat === 'Rencontre') newStade = 'Entente';
        else if (character.stadeEclat === 'Entente') newStade = 'Accord';
        else return res.status(400).json({ success: false, message: 'Niveau maximum atteint.' });

        const validStats = ['puissance', 'resistance', 'precision', 'reflexes', 'connaissance', 'perception', 'volonte', 'empathie'];
        const validSkills = ['arts', 'cite', 'civilisations', 'relationnel', 'soins', 'animalisme', 'faune', 'montures', 'pistage', 'territoire', 'adresse', 'armurerie', 'artisanat', 'mecanisme', 'runes', 'athletisme', 'discretion', 'flore', 'vigilance', 'voyage', 'bouclier', 'cac', 'lancer', 'melee', 'tir', 'eclats', 'lunes', 'mythes', 'pantheons', 'rituels'];
        
        let updateData = { stadeEclat: newStade };
        
        if (statToUpgrade && validStats.includes(statToUpgrade)) updateData[statToUpgrade] = { increment: 1 };
        if (skillToUpgrade1 && validSkills.includes(skillToUpgrade1)) updateData[skillToUpgrade1] = { increment: 1 };
        if (skillToUpgrade2 && validSkills.includes(skillToUpgrade2) && newStade === 'Accord') updateData[skillToUpgrade2] = { increment: 1 };

        await prisma.character.update({
            where: { id_Character: character.id_Character },
            data: updateData
        });
        
        res.json({ success: true, newStade });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erreur Serveur.' });
    }
});
`;

routes = routes.replace(/router\.post\('\/pacte\/upgrade',[\s\S]*?catch\(err\) \{[\s\S]*?res\.status\(500\)\.json\(\{ success: false, message: 'Erreur Serveur\.' \}\);\n\s+\}\n\}\);/, newUpgradeLogic.trim());

fs.writeFileSync(routesFile, routes);
console.log('Rules applied successfully');
