const fs = require('fs');
let file = fs.readFileSync('app/views/eclats.html.twig', 'utf8');

const replacement = `    <!-- Custom Tabs (Pure JS) -->
    <ul class="nav nav-tabs god-tabs">
        <li class="nav-item">
            <a class="nav-link active" data-target="#pantheon-tab-pane">Le Panthéon</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-target="#pacte-tab-pane">Le Pacte</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-target="#faveurs-tab-pane">Les Faveurs</a>
        </li>
    </ul>

<!-- Eclat Upgrade Modal -->
<div class="modal fade" id="upgradePactModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" style="color: var(--god-text);">
        <div class="modal-content" style="background: var(--god-dark); border: 1px solid var(--god-gold);">
            <div class="modal-header border-bottom-0" style="background: rgba(255,255,255,0.05);">
                <h5 class="modal-title" style="color: var(--god-gold); font-family: 'Cinzel', serif;">Élévation du Pacte</h5>
                <button type="button" class="close" data-dismiss="modal" style="color: var(--god-gold); text-shadow: none;">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <p class="mb-4">Votre lien se renforce. Choisissez la caractéristique qui sera baignée par l'énergie de l'Éclat (+1 point).</p>
                <div class="form-group">
                    <label class="god-label">Caractéristique à améliorer</label>
                    <select id="upgradeStatSelect" class="form-control god-input">
                        <optgroup label="Physique">
                            <option value="puissance">Puissance</option>
                            <option value="resistance">Résistance</option>
                        </optgroup>
                        <optgroup label="Manuel">
                            <option value="precision">Précision</option>
                            <option value="reflexes">Réflexes</option>
                        </optgroup>
                        <optgroup label="Mental">
                            <option value="connaissance">Connaissance</option>
                            <option value="perception">Perception</option>
                        </optgroup>
                        <optgroup label="Social">
                            <option value="volonte">Volonté</option>
                            <option value="empathie">Empathie</option>
                        </optgroup>
                    </select>
                </div>
            </div>
            <div class="modal-footer border-top-0">
                <button type="button" class="btn btn-god-outline" data-dismiss="modal">Annuler</button>
                <button type="button" class="btn btn-god" onclick="confirmUpgradePact()">Sceller l'Évolution</button>
            </div>
        </div>
    </div>
</div>

    <!-- Tabs Content -->`;

file = file.replace(/    <!-- Custom Tabs \(Pure JS\) -->[\s\S]*?<!-- Tabs Content -->/, replacement);

const fnRepl = `    function upgradePact() {
        $('#upgradePactModal').modal('show');
    }

    function confirmUpgradePact() {
        const characterId = document.getElementById('pacteCharacterSelect').value;
        const statToUpgrade = document.getElementById('upgradeStatSelect').value;
        fetch('/eclats/pacte/upgrade', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ characterId, statToUpgrade })
        }).then(res => res.json()).then(data => {
            if(data.success) {
                $('#upgradePactModal').modal('hide');
                location.reload();
            } else {
                alert('Erreur: ' + data.message);
            }
        });
    }`;

file = file.replace(/    function upgradePact\(\) \{[\s\S]*?\}\);[\s\n]*\}/, fnRepl);
fs.writeFileSync('app/views/eclats.html.twig', file);

let routeFile = fs.readFileSync('app/routes/eclatsRoutes.js', 'utf8');
const backendLogic = `router.post('/pacte/upgrade', isAuthenticated, async (req, res) => {
    const { characterId, statToUpgrade } = req.body;
    try {
        const character = await prisma.character.findFirst({ where: { id_Character: parseInt(characterId), userId: req.session.userId } });
        if(!character || !character.godId) return res.status(403).json({ success: false, message: 'Personnage introuvable ou non lié.' });

        let newStade = 'Rencontre';
        if (character.stadeEclat === 'Rencontre') newStade = 'Entente';
        else if (character.stadeEclat === 'Entente') newStade = 'Accord';
        else return res.status(400).json({ success: false, message: 'Niveau maximum atteint.' });

        const validStats = ['puissance', 'resistance', 'precision', 'reflexes', 'connaissance', 'perception', 'volonte', 'empathie'];
        
        let updateData = { stadeEclat: newStade };
        
        if (statToUpgrade && validStats.includes(statToUpgrade)) {
            updateData[statToUpgrade] = { increment: 1 };
        }

        await prisma.character.update({
            where: { id_Character: character.id_Character },
            data: updateData
        });
        
        res.json({ success: true, newStade });
    } catch(err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erreur Serveur.' });
    }
});`;

routeFile = routeFile.replace(/router\.post\('\/pacte\/upgrade',[\s\S]*?catch\(err\) \{[\s\S]*?res\.status\(500\)\.json\(\{ success: false, message: 'Erreur Serveur\.' \}\);\n\s+\}\n\}\);/, backendLogic);

fs.writeFileSync('app/routes/eclatsRoutes.js', routeFile);
console.log('done');
