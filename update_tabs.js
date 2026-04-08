const fs = require('fs');
const path = './app/views/eclats.html.twig';
let content = fs.readFileSync(path, 'utf8');

const oldTab2 = `        <!-- TAB 2 : LE PACTE -->
        <div class="tab-pane fade" id="pacte-tab-pane" role="tabpanel" aria-labelledby="pacte-tab" tabindex="0">
            <div class="card bg-dark text-light border-secondary">
                <div class="card-body">
                    <p>C'est ici que votre personnage établira ou rompra ses liens avec l'Éclat du Dieu choisi.<br/></p>
                    <div class="alert alert-info bg-dark border-info text-info">
                        <strong>Progression :</strong> Rencontre (Stade I) > Entente (Stade II) > Accord (Stade III)
                    </div>
                    <em>Les mécaniques de lien et de mise à jour des statistiques via Le Pacte et les Faveurs arriveront dans les prochaines mises à jour.</em>
                </div>
            </div>
        </div>`;

const newTab2 = `        <!-- TAB 2 : LE PACTE -->
        <div class="tab-pane fade" id="pacte-tab-pane" role="tabpanel" aria-labelledby="pacte-tab" tabindex="0">
            <div class="card bg-dark text-light border-secondary">
                <div class="card-body">
                    <p>C'est ici que votre personnage établira ou rompra ses liens avec l'Éclat du Dieu choisi.<br/></p>
                    <div class="alert alert-info bg-dark border-info text-info">
                        <strong>Progression :</strong> Rencontre (Stade I) > Entente (Stade II) > Accord (Stade III)
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6 offset-md-3">
                            <label class="form-label text-warning">Sélectionner un de vos Personnages</label>
                            <select id="pacteCharacterSelect" class="form-select bg-secondary text-light border-dark mb-4" onchange="updateCharacterPactState()">
                                <option value="">-- Choisir un Personnage --</option>
                                {% for character in characters %}
                                    <option value="{{ character.id_Character }}" 
                                            data-god-id="{{ character.godId|default('') }}" 
                                            data-stade="{{ character.stadeEclat|default('') }}">
                                        {{ character.Nom }} {% if character.godId %}(Lié: {{ character.God.nom }}){% else %}(Sans Éclat){% endif %}
                                    </option>
                                {% endfor %}
                            </select>

                            <div id="pacteActionsContainer" style="display:none;">
                                <div id="unboundGodSection" class="mb-3">
                                    <label class="form-label text-light">Choisir un Dieu à lier</label>
                                    <select id="pacteGodSelect" class="form-select bg-secondary text-light border-dark mb-3">
                                        <option value="">-- Choisir un Dieu --</option>
                                        {% for deity in gods %}
                                            <option value="{{ deity.id }}">{{ deity.nom }}</option>
                                        {% endfor %}
                                    </select>
                                    <button class="btn btn-warning w-100" onclick="bindGod()">Lier (Rencontre)</button>
                                </div>

                                <div id="boundGodSection" class="mb-3" style="display:none;">
                                    <div class="alert alert-success bg-dark border-success text-success">
                                        <strong>Stade actuel :</strong> <span id="currentStadeDisplay"></span>
                                    </div>
                                    <button class="btn btn-info w-100 mb-2" id="upgradeBtn" onclick="upgradePact()">Atteindre le stade supérieur</button>
                                    <button class="btn btn-danger w-100" onclick="breakPact()">Rompre le Pacte</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>`;

const oldTab3 = `        <!-- TAB 3 : LES FAVEURS -->
        <div class="tab-pane fade" id="faveurs-tab-pane" role="tabpanel" aria-labelledby="faveurs-tab" tabindex="0">
            <div class="card bg-dark text-light border-secondary">
                <div class="card-body">
                    <div class="alert alert-warning bg-dark border-warning text-warning">
                        <strong>Faveurs Divines</strong>
                    </div>
                    <p>Débloquez le pouvoir des Dieux. (Bientôt disponible)</p>
                </div>
            </div>
        </div>`;

const newTab3 = `        <!-- TAB 3 : LES FAVEURS -->
        <div class="tab-pane fade" id="faveurs-tab-pane" role="tabpanel" aria-labelledby="faveurs-tab" tabindex="0">
            <div class="card bg-dark text-light border-secondary">
                <div class="card-body">
                    <div class="alert alert-warning bg-dark border-warning text-warning">
                        <strong>Faveurs Divines</strong>
                    </div>
                    <p>Débloquez le pouvoir des Dieux pour votre personnage lié.</p>

                    <div class="row">
                        <div class="col-md-6 offset-md-3">
                            <label class="form-label text-warning">Sélectionner un Personnage</label>
                            <select id="faveurCharacterSelect" class="form-select bg-secondary text-light border-dark mb-4" onchange="updateCharacterFaveurState()">
                                <option value="">-- Choisir un Personnage --</option>
                                {% for character in characters %}
                                    <option value="{{ character.id_Character }}" 
                                            data-god-id="{{ character.godId|default('') }}" 
                                            data-faveurs="{{ character.faveurs|default('[]')|escape }}">
                                        {{ character.Nom }}
                                    </option>
                                {% endfor %}
                            </select>

                            <div id="faveursContainer" style="display:none;">
                                <div class="alert alert-danger" id="noGodAlert" style="display:none;">Ce personnage n'est lié à aucun Dieu. Rendez-vous dans l'onglet "Pacte" d'abord.</div>
                                
                                <div id="faveursListArea" style="display:none;">
                                    <p class="text-info">Faveurs disponibles à ajouter :</p>
                                    <div class="input-group mb-4">
                                        <input type="text" id="faveurNameInput" class="form-control bg-secondary text-light border-dark" placeholder="Nom de la faveur (ex: Manteau d'Ombre)">
                                        <button class="btn btn-warning" onclick="addFaveur()">Ajouter</button>
                                    </div>

                                    <h5 class="text-warning border-bottom border-secondary pb-2">Faveurs Actuelles</h5>
                                    <ul class="list-group" id="currentFaveursList">
                                        <!-- Injectées via JS -->
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>`;

content = content.replace(oldTab2, newTab2);
content = content.replace(oldTab3, newTab3);

// Inject script at the bottom
const oldScriptEnd = `        } else {
            alert("Erreur lors de la genèse: " + payload.message);
        }
    })
    .catch(err => {
        alert("La toile cosmique du serveur s'est déchirée...");
        console.error(err);
    });
}
</script>`;

const newScriptEnd = `        } else {
            alert("Erreur lors de la genèse: " + payload.message);
        }
    })
    .catch(err => {
        alert("La toile cosmique du serveur s'est déchirée...");
        console.error(err);
    });
}

// === PACTE LOGIC ===
function updateCharacterPactState() {
    const select = document.getElementById('pacteCharacterSelect');
    const container = document.getElementById('pacteActionsContainer');
    const unboundSection = document.getElementById('unboundGodSection');
    const boundSection = document.getElementById('boundGodSection');
    const currentStadeDisplay = document.getElementById('currentStadeDisplay');
    const upgradeBtn = document.getElementById('upgradeBtn');

    if(!select.value) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    const option = select.options[select.selectedIndex];
    const godId = option.getAttribute('data-god-id');
    const stade = option.getAttribute('data-stade');

    if(godId) {
        unboundSection.style.display = 'none';
        boundSection.style.display = 'block';
        currentStadeDisplay.innerText = stade;
        
        if(stade === 'Accord') {
            upgradeBtn.disabled = true;
            upgradeBtn.innerText = "Stade Maximal Atteint";
        } else {
            upgradeBtn.disabled = false;
            upgradeBtn.innerText = "Atteindre le stade supérieur";
        }
    } else {
        unboundSection.style.display = 'block';
        boundSection.style.display = 'none';
    }
}

function bindGod() {
    const characterId = document.getElementById('pacteCharacterSelect').value;
    const godId = document.getElementById('pacteGodSelect').value;
    if(!characterId || !godId) return alert('Sélectionnez un personnage et un dieu.');

    fetch('/eclats/pacte/bind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId, godId })
    }).then(res => res.json()).then(data => {
        if(data.success) { alert('Personnage lié !'); location.reload(); }
        else alert('Erreur: ' + data.message);
    });
}

function upgradePact() {
    const characterId = document.getElementById('pacteCharacterSelect').value;
    fetch('/eclats/pacte/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId })
    }).then(res => res.json()).then(data => {
        if(data.success) { alert('Pacte évolué vers : ' + data.newStade); location.reload(); }
        else alert('Erreur: ' + data.message);
    });
}

function breakPact() {
    if(!confirm('Voulez-vous vraiment rompre ce pacte ? Toutes les faveurs seront perdues !')) return;
    const characterId = document.getElementById('pacteCharacterSelect').value;
    fetch('/eclats/pacte/break', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId })
    }).then(res => res.json()).then(data => {
        if(data.success) { alert('Pacte rompu.'); location.reload(); }
        else alert('Erreur: ' + data.message);
    });
}

// === FAVEURS LOGIC ===
function updateCharacterFaveurState() {
    const select = document.getElementById('faveurCharacterSelect');
    const container = document.getElementById('faveursContainer');
    const noGodAlert = document.getElementById('noGodAlert');
    const faveursListArea = document.getElementById('faveursListArea');

    if(!select.value) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    const option = select.options[select.selectedIndex];
    const godId = option.getAttribute('data-god-id');
    const faveursStr = option.getAttribute('data-faveurs');

    if(!godId) {
        noGodAlert.style.display = 'block';
        faveursListArea.style.display = 'none';
    } else {
        noGodAlert.style.display = 'none';
        faveursListArea.style.display = 'block';
        
        const list = document.getElementById('currentFaveursList');
        list.innerHTML = '';
        try {
            const faveurs = JSON.parse(faveursStr || '[]');
            if(faveurs.length === 0) {
                list.innerHTML = '<li class="list-group-item bg-dark text-muted">Aucune faveur actuellement.</li>';
            } else {
                faveurs.forEach(f => {
                    list.innerHTML += \`<li class="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center">
                        \${f}
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFaveur('\${f}')"><i class="fas fa-trash"></i></button>
                    </li>\`;
                });
            }
        } catch(e) { console.error('Erreur parsing faveurs'); }
    }
}

function addFaveur() {
    const characterId = document.getElementById('faveurCharacterSelect').value;
    const faveurName = document.getElementById('faveurNameInput').value;
    if(!characterId || !faveurName.trim()) return alert('Nom de faveur requis.');

    fetch('/eclats/faveurs/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId, faveurName })
    }).then(res => res.json()).then(data => {
        if(data.success) { location.reload(); }
        else alert('Erreur serveur.');
    });
}

function removeFaveur(faveurName) {
    if(!confirm('Retirer cette faveur ?')) return;
    const characterId = document.getElementById('faveurCharacterSelect').value;

    fetch('/eclats/faveurs/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId, faveurName })
    }).then(res => res.json()).then(data => {
        if(data.success) { location.reload(); }
        else alert('Erreur serveur.');
    });
}
</script>`;

content = content.replace(oldScriptEnd, newScriptEnd);
fs.writeFileSync(path, content);
console.log('Tabs updated');
