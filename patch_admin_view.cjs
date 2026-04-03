const fs = require('fs');
const path = 'app/views/admin.html.twig';
let code = fs.readFileSync(path, 'utf8');

const combatHtml = `
            <!-- GESTIONNAIRE DE COMBAT -->
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
                                    <button class="btn btn-sm btn-outline-info" onclick="rollInitiative()">Lancer Initiative (1d10+Réaction)</button>
                                    <button class="btn btn-sm btn-outline-warning" onclick="clearCombatants()">Vider Ennemis</button>
                                </div>
                            </div>
                            
                            <table class="table table-dark table-striped text-white align-middle" id="combatTable">
                                <thead>
                                    <tr>
                                        <th>Init</th>
                                        <th>Nom</th>
                                        <th>Défense</th>
                                        <th>Armure(C,P,T)</th>
                                        <th>Blessures/PV</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                </tbody>
                            </table>
                            
                            <hr class="border-secondary">
                            <h5>Ajouter Ennemi/PNJ</h5>
                            <div class="row g-2 mb-3">
                                <div class="col-sm-3"><input type="text" id="neName" class="form-control form-control-sm mb-1" placeholder="Nom"></div>
                                <div class="col-sm-2"><input type="number" id="neReact" class="form-control form-control-sm mb-1" placeholder="Réaction"></div>
                                <div class="col-sm-2"><input type="number" id="neDef" class="form-control form-control-sm mb-1" placeholder="Défense"></div>
                                <div class="col-sm-3"><input type="text" id="neArmor" class="form-control form-control-sm mb-1" placeholder="0,0,0 (CPT)"></div>
                                <div class="col-sm-2"><input type="number" id="neHP" class="form-control form-control-sm mb-1" placeholder="PV Max" value="10"></div>
                            </div>
                            <button class="btn btn-sm btn-danger w-100" onclick="addEnemy()">+ Ajouter Ennemi</button>
                        </div>
                        
                        <!-- Panel de droite : Résolution Combat -->
                        <div class="col-md-5">
                            <h4>Résolution d'Attaque</h4>
                            
                            <div class="mb-3">
                                <label>Attaquant :</label>
                                <select id="atkAttaquant" class="form-select form-select-sm mj-select"></select>
                            </div>
                            
                            <div class="mb-3">
                                <label>Arme & Dégâts automatiques :</label>
                                <select id="atkArme" class="form-select form-select-sm mj-select mb-1">
                                    <option value="1D6,P">Arc - 1D6 (P)</option>
                                    <option value="1D6,T">Epée Courte - 1D6 (T)</option>
                                    <option value="2D6,T">Epée Lourde - 2D6 (T)</option>
                                    <option value="1D8,C">Masse - 1D8 (C)</option>
                                    <option value="1D4,C">Poings - 1D4 (C)</option>
                                    <option value="custom">Autre (Saisie Manuelle)</option>
                                </select>
                                <input type="text" id="atkArmeCustom" class="form-control form-control-sm" placeholder="Ex: 1D10+2" style="display:none;">
                                <input type="hidden" id="atkType" value="P">
                            </div>

                            <div class="mb-3">
                                <label>Jet d'attaque (score ou réussites) :</label>
                                <input type="number" id="atkJet" class="form-control form-control-sm">
                            </div>

                            <div class="mb-3">
                                <label>Cible :</label>
                                <select id="atkCible" class="form-select form-select-sm mj-select"></select>
                            </div>
                            
                            <button class="btn btn-danger w-100 mb-3" onclick="resolveAttack()"><i class="fas fa-gavel"></i> Lancer l'Attaque</button>
                            
                            <div id="combatLog" class="p-2 border border-secondary rounded" style="background:#111; max-height:200px; overflow-y:auto; font-family:monospace; font-size:0.9em; white-space:pre-wrap;"></div>
                        </div>
                    </div>
                </div>
            </div>`;

code = code.replace(/            <\/div>\n            \n            \n        <\/div>/, '            </div>\n' + combatHtml + '\n        </div>');
fs.writeFileSync(path, code);
