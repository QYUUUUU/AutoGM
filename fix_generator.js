                            <hr class="border-secondary mt-4">
                            <h5>Générateur Express de PNJ</h5>
                            <div class="row g-2 mb-3">
                                <div class="col-sm-4">
                                    <select id="expressProfil" class="form-select form-select-sm mj-select">
                                        <option value="3">Néophyte (3d, 10PV, Def 10, Init 2)</option>
                                        <option value="5">Apprenti (5d, 12PV, Def 12, Init 4, Armure 2,2,2)</option>
                                        <option value="7">Vétéran (7d, 15PV, Def 14, Init 6, Armure 4,4,4)</option>
                                        <option value="9">Élite (9d, 20PV, Def 16, Init 8, Armure 6,6,6)</option>
                                    </select>
                                </div>
                                <div class="col-sm-4">
                                    <select id="expressCulture" class="form-select form-select-sm mj-select">
                                        <option value="Babel">Babel (+Int)</option>
                                        <option value="Empire">L'Empire (+For/Armure)</option>
                                        <option value="Khashan">Khashan (+Ref)</option>
                                        <option value="Saeth">Saeth (+Agil)</option>
                                    </select>
                                </div>
                                <div class="col-sm-4">
                                    <button class="btn btn-sm btn-warning w-100" onclick="generateExpressPNJ()">+ Générer</button>
                                </div>
                            </div>
