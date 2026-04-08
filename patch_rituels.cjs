const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/views/index.html.twig');
let content = fs.readFileSync(filePath, 'utf8');

const rituelsPane = `
            <!-- tab rituels -->
            <div class="tab-pane fade h-100" id="rituels-tab-pane" role="tabpanel" aria-labelledby="rituels-tab" tabindex="0">
                <div class="row h-100 mx-0">
                    <div class="col-12 h-100 px-0">
                        <div class="head-card square-tl square-tr">Rituels Maîtrisés</div>
                        <div class="body-card p-3" style="height: 100%; overflow-y: auto;">
                            <div class="row" id="rituels-list">
                                {% set masteredRituals = favoriteCharacter.character.rituelsMaitrises|default('[]')|trim %}
                                {# The mastered rituals string is JSON encoded array of strings e.g. '["Rituel 1", "Rituel 2"]' #}
                                <script>
                                    document.addEventListener('DOMContentLoaded', () => {
                                        const rituelsContainer = document.getElementById('rituels-list');
                                        let masteredRitualsStr = \`{{ masteredRituals|raw }}\`;
                                        try {
                                            if (masteredRitualsStr) {
                                                const masteredRituals = JSON.parse(masteredRitualsStr);
                                                if (Array.isArray(masteredRituals) && masteredRituals.length > 0) {
                                                    masteredRituals.forEach(r => {
                                                        const div = document.createElement('div');
                                                        div.className = 'col-md-4 mb-3';
                                                        div.innerHTML = \`
                                                            <div class="card h-100 bg-dark text-light border border-secondary">
                                                                <div class="card-body">
                                                                    <h5 class="card-title text-warning">\${r}</h5>
                                                                </div>
                                                            </div>
                                                        \`;
                                                        rituelsContainer.appendChild(div);
                                                    });
                                                } else {
                                                    rituelsContainer.innerHTML = '<div class="col-12 text-muted"><em>Aucun rituel maîtrisé pour ce personnage.</em></div>';
                                                }
                                            } else {
                                                rituelsContainer.innerHTML = '<div class="col-12 text-muted"><em>Aucun rituel maîtrisé pour ce personnage.</em></div>';
                                            }
                                        } catch(e) {
                                            console.error('Error parsing rituals', e);
                                            rituelsContainer.innerHTML = '<div class="col-12 text-muted"><em>Erreur de chargement des rituels.</em></div>';
                                        }
                                    });
                                </script>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
`;

content = content.replace(/(id="ressources-tab-pane"[\s\S]*?<!-- tab groupe -->)/, rituelsPane + '\n$1');

fs.writeFileSync(filePath, content);
console.log('Patched');
