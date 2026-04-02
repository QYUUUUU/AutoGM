document.addEventListener('DOMContentLoaded', function () {
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');

    nextButtons.forEach(button => {
        button.addEventListener('click', function () {
            const currentStep = this.closest('.step');
            const nextStep = document.getElementById(this.getAttribute('data-next'));
            currentStep.style.display = 'none';
            nextStep.style.display = 'block';
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', function () {
            const currentStep = this.closest('.step');
            const prevStep = document.getElementById(this.getAttribute('data-prev'));
            currentStep.style.display = 'none';
            prevStep.style.display = 'block';
        });
    });

    const submitButton = document.getElementById("submit");

    submitButton.addEventListener("click", createCharacter);

    function createCharacter() {
        // Gather form data
        const formData = {
            nom: document.getElementsByName('nom')[0].value,
            age: document.getElementsByName('age')[0].value,
            genre: document.getElementsByName('genre')[0].value,
            instinct: document.getElementsByName('instinct')[0].value,
            signeastro: document.getElementsByName('signeastro')[0].value,
            origine: document.getElementsByName('origine')[0].value,
            avantage: document.querySelector('input[name="origin_advantage"]:checked') ? document.querySelector('input[name="origin_advantage"]:checked').value : 'none',
            desavantage: document.querySelector('input[name="origin_disadvantage"]:checked') ? document.querySelector('input[name="origin_disadvantage"]:checked').value : 'none',
            capaciteInstinct1: document.querySelector('input[name="instinct_capacite"]:checked') ? document.querySelector('input[name="instinct_capacite"]:checked').value : 'none',
            puissance: document.getElementsByName('puissance')[0].value,
            resistance: document.getElementsByName('resistance')[0].value,
            precision: document.getElementsByName('precision')[0].value,
            reflexes: document.getElementsByName('reflexes')[0].value,
            connaissance: document.getElementsByName('connaissance')[0].value,
            perception: document.getElementsByName('perception')[0].value,
            volonte: document.getElementsByName('volonte')[0].value,
            empathie: document.getElementsByName('empathie')[0].value,
            arts: document.getElementsByName('arts')[0].value,
            cite: document.getElementsByName('cite')[0].value,
            civilisations: document.getElementsByName('civilisations')[0].value,
            relationnel: document.getElementsByName('relationnel')[0].value,
            soins: document.getElementsByName('soins')[0].value,
            animalisme: document.getElementsByName('animalisme')[0].value,
            faune: document.getElementsByName('faune')[0].value,
            montures: document.getElementsByName('montures')[0].value,
            pistage: document.getElementsByName('pistage')[0].value,
            territoire: document.getElementsByName('territoire')[0].value,
            adresse: document.getElementsByName('adresse')[0].value,
            armurerie: document.getElementsByName('armurerie')[0].value,
            artisanat: document.getElementsByName('artisanat')[0].value,
            mecanisme: document.getElementsByName('mecanisme')[0].value,
            runes: document.getElementsByName('runes')[0].value,
            athletisme: document.getElementsByName('athletisme')[0].value,
            discretion: document.getElementsByName('discretion')[0].value,
            flore: document.getElementsByName('flore')[0].value,
            vigilance: document.getElementsByName('vigilance')[0].value,
            voyage: document.getElementsByName('voyage')[0].value,
            bouclier: document.getElementsByName('bouclier')[0].value,
            cac: document.getElementsByName('cac')[0].value,
            lancer: document.getElementsByName('lancer')[0].value,
            melee: document.getElementsByName('melee')[0].value,
            tir: document.getElementsByName('tir')[0].value,
            eclats: document.getElementsByName('eclats')[0].value,
            lunes: document.getElementsByName('lunes')[0].value,
            mythes: document.getElementsByName('mythes')[0].value,
            pantheons: document.getElementsByName('pantheons')[0].value,
            rituels: document.getElementsByName('rituels')[0].value,
            equipments: Array.from(document.querySelectorAll('.equip-checkbox:checked')).map(cb => cb.value)
            // Add other fields as needed
        };

        // Send the data to your Express server
        fetch('/create-character', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then(response => {
            if (response.ok) {
                // Redirect or handle success as needed
                window.location.href = '/characters'; // Redirect to characters list, for example
            } else {
                // Handle error responses
                console.error('Failed to create character:', response.statusText);
            }
        }).catch(error => {
            console.error('Error creating character:', error);
        });
    }
});



//Origin maj

function formatStatsWithSelection(rawStats) {
    const parts = rawStats.split('<br><br>');
    let newParts = [];
    
    let hasAdvantage = false;
    let hasDisadvantage = false;
    
    for (let part of parts) {
        if (part.includes('<b>Compétence de Débutant bonus</b>') || part.includes('<b>Compétence de Débutant bonus :</b>')) {
            const match = part.match(/<b>Compétence de Débutant bonus\s*:\s*<\/b>(.*)/s);
            if (match) {
                const skillsStr = match[1].split('(')[0].trim(); // Remove parentheticals
                const skills = skillsStr.split(/ou/i).map(s => s.trim());
                
                newParts.push('<div style="margin-top: 10px;"><strong>Choisissez votre Compétence de Débutant bonus :</strong></div>');
                skills.forEach((skill, index) => {
                    const isChecked = index === 0 ? 'checked' : '';
                    newParts.push(`<div style="margin-left: 15px; margin-bottom: 5px;"><label><input type="radio" class="origin-bonus-skill" name="origin_bonus_skill" value="${skill}" ${isChecked}> <b>${skill}</b></label></div>`);
                });
                // We keep the original text underneath if wanted, or just skip it
                continue;
            }
        }
        
        if (part.includes('<b>Avantage')) {
            const match = part.match(/<b>Avantage(?:\s+|&nbsp;|&#160;|\u2013|-)*([^\:]+)\s*:\s*<\/b>(.*)/s);
            if (match) {
                if (!hasAdvantage) {
                    newParts.push('<div style="margin-top: 10px;"><strong>Choisissez au maximum un Avantage :</strong></div>');
                    newParts.push(`<div><label><input type="radio" name="origin_advantage" value="none" checked> <i>Aucun Avantage</i></label></div>`);
                    hasAdvantage = true;
                }
                const name = match[1].trim().replace(/^[-–—]\s*/, '');
                const desc = match[2];
                newParts.push(`<div style="margin-left: 15px; margin-bottom: 5px;"><label><input type="radio" name="origin_advantage" value="${name}"> <b>${name} :</b> ${desc}</label></div>`);
                continue;
            }
        }
        
        if (part.includes('<b>Désavantage')) {
            const match = part.match(/<b>Désavantage(?:\s+|&nbsp;|&#160;|\u2013|-)*([^\:]+)\s*:\s*<\/b>(.*)/s);
            if (match) {
                if (!hasDisadvantage) {
                    newParts.push('<div style="margin-top: 10px;"><strong>Choisissez au maximum un Désavantage :</strong></div>');
                    newParts.push(`<div><label><input type="radio" name="origin_disadvantage" value="none" checked> <i>Aucun Désavantage</i></label></div>`);
                    hasDisadvantage = true;
                }
                const name = match[1].trim().replace(/^[-–—]\s*/, '');
                const desc = match[2];
                newParts.push(`<div style="margin-left: 15px; margin-bottom: 5px;"><label><input type="radio" name="origin_disadvantage" value="${name}"> <b>${name} :</b> ${desc}</label></div>`);
                continue;
            }
        }
        
        if (part.includes('<b>Capacité d\'Instinct')) {
            const match = part.match(/<b>Capacité d\'Instinct(?:\s+|&nbsp;|&#160;|\u2013|-)*([^\:]+)\s*:\s*<\/b>(.*)/s);
            if (match) {
                const name = match[1].trim().replace(/^[-–—]\s*/, '');
                const desc = match[2];
                // Try to find if we already added the radio group description
                if (!newParts.some(p => p.includes('Choisissez votre Capacité d\'Instinct'))) {
                    newParts.push('<div style="margin-top: 10px;"><strong>Choisissez votre Capacité d\'Instinct :</strong></div>');
                }
                // default checked on the first one
                const isChecked = newParts.some(p => p.includes('name="instinct_capacite"')) ? '' : 'checked';
                newParts.push(`<div style="margin-left: 15px; margin-bottom: 5px;"><label><input type="radio" name="instinct_capacite" value="${name}" ${isChecked}> <b>${name} :</b> ${desc}</label></div>`);
                continue;
            }
        }
        
        newParts.push(part);
    }
    return newParts.join('<br><br>');
}

document.getElementById('origineSelect').addEventListener('change', function () {
    const selectedValue = this.value;
    const description = origineDescriptions[selectedValue];

    if (description) {
        document.getElementById('bannerImage').src = description.banner;
        document.getElementById('originTitle').innerText = description.title;
        let statsHtml = "";
        if (description.stats) {
            statsHtml = "<div style='margin-top: 15px; color: #a33; border-top: 1px solid #ddd; padding-top: 10px;'>" + formatStatsWithSelection(description.stats) + "</div>";
        }
        document.getElementById('originText').innerHTML = description.text + statsHtml;
    }
});

// Trigger change event to load the initial origin's stats
document.getElementById('origineSelect').dispatchEvent(new Event('change'));



let instinctSelect = document.getElementById('instinctSelect');
if (!instinctSelect) {
    instinctSelect = document.querySelector('select[name="instinct"]');
    if (instinctSelect) {
        instinctSelect.id = 'instinctSelect';
    }
}

if (instinctSelect) {
    // If the HTML hasn't updated due to twig caching, create the description block manually!
    if (!document.getElementById('instinctDescriptionBlock')) {
        const p1 = instinctSelect.nextElementSibling;
        const p2 = p1 ? p1.nextElementSibling : null;
        if (p1 && p1.tagName === 'P') p1.style.display = 'none';
        if (p2 && p2.tagName === 'P') p2.style.display = 'none';

        const blockHTML = `
            <div id="instinctDescriptionBlock" class="originDescription" style="margin-top: 20px;">
                <div class="row">
                    <div class="textorigin col-12">
                        <h3 id="instinctTitle"></h3>
                        <p id="instinctText"></p>
                    </div>
                </div>
            </div>
        `;
        instinctSelect.insertAdjacentHTML('afterend', blockHTML);
    }

    instinctSelect.addEventListener('change', function () {
        const selectedValue = this.value;
        const description = instinctDescriptions[selectedValue];

        if (description) {
            document.getElementById('instinctTitle').innerText = description.title;
            let finalHtml = description.text;
            if (description.stats) {
                finalHtml += "<div style='margin-top: 15px; color: #33a; border-top: 1px solid #ddd; padding-top: 10px;'>" + formatStatsWithSelection(description.stats) + "</div>";
            }
            document.getElementById('instinctText').innerHTML = finalHtml;
        }
    });

    // Manually dispatch change event to set initial text
    instinctSelect.dispatchEvent(new Event('change'));
}

let signeastroSelect = document.getElementById('signeastroSelect');
if (!signeastroSelect) {
    signeastroSelect = document.querySelector('select[name="signeastro"]');
    if (signeastroSelect) {
        signeastroSelect.id = 'signeastroSelect';
        // Cleanup old options if they have the text fallback
        Array.from(signeastroSelect.options).forEach(opt => {
            if (opt.text.includes(':')) {
                opt.text = signeastroDescriptions[opt.value]?.title || opt.text;
            }
        });
    }
}

if (signeastroSelect) {
    if (!document.getElementById('signeastroDescriptionBlock')) {
        const blockHTML = `
            <div id="signeastroDescriptionBlock" class="originDescription" style="margin-top: 20px;">
                <div class="row">
                    <div class="textorigin col-12">
                        <h3 id="signeastroTitle"></h3>
                        <p id="signeastroStat" style="font-weight: bold; color: #a33;"></p>
                        <p id="signeastroText"></p>
                    </div>
                </div>
            </div>
        `;
        signeastroSelect.insertAdjacentHTML('afterend', blockHTML);
    }

    signeastroSelect.addEventListener('change', function () {
        const selectedValue = this.value;
        const description = signeastroDescriptions[selectedValue];

        if (description) {
            document.getElementById('signeastroTitle').innerText = description.title;
            document.getElementById('signeastroStat').innerText = "Compétence bonus : " + description.stat;
            document.getElementById('signeastroText').innerHTML = description.text;
        }
    });

    signeastroSelect.dispatchEvent(new Event('change'));
}


// --- VALIDATION TRACKER LOGIC ---
document.addEventListener('DOMContentLoaded', function() {
    const characteristicsNames = ['puissance', 'resistance', 'precision', 'reflexes', 'connaissance', 'perception', 'volonte', 'empathie'];
    const skillsNames = ['arts', 'cite', 'civilisations', 'relationnel', 'soins', 'animalisme', 'faune', 'montures', 'pistage', 'territoire', 'adresse', 'armurerie', 'artisanat', 'mecanisme', 'runes', 'athletisme', 'discretion', 'flore', 'vigilance', 'voyage', 'bouclier', 'cac', 'lancer', 'melee', 'tir', 'eclats', 'lunes', 'mythes', 'pantheons', 'rituels'];
    
    // Convert friendly names to select names
    const normalizeName = (name) => {
        name = name.toLowerCase()
            .replace('é', 'e')
            .replace('è', 'e')
            .replace('ê', 'e')
            .replace('à', 'a')
            .replace('â', 'a')
            .replace('ô', 'o')
            .replace('û', 'u')
            .replace(/[^a-z]/g, '');
        if (name === 'corpsacorps' || name === 'cac') return 'cac';
        return name;
    };

    let bonusCharacteristics = {};
    let bonusSkills = {};

    function updateBonuses() {
        bonusCharacteristics = {};
        bonusSkills = {};

        // Astrological sign bonus
        const signeSelect = document.getElementById('signeastroSelect');
        if (signeSelect && signeSelect.value) {
            // "Loup" -> "Faune"
            // The `stat` property in signeastroDescriptions maps the sign to the competence
            // But we don't have access to signeastroDescriptions directly in this scope unless it's global
            // We can read it from the DOM element we injected or just re-map
            const map = {
                "Loup": "faune",
                "Enfant": "civilisations",
                "Arbre": "flore",
                "Sceptre": "relationnel",
                "Tourbillon": "athletisme",
                "Vautour": "vigilance",
                "Voyage": "voyage",
                "Glaive": "armurerie",
                "Chat": "discretion"
            };
            const skill = map[signeSelect.value];
            if (skill) bonusSkills[skill] = (bonusSkills[skill] || 0) + 1;
        }

        // Origin bonus skill
        const originBonusRadio = document.querySelector('input[name="origin_bonus_skill"]:checked');
        if (originBonusRadio) {
            const val = normalizeName(originBonusRadio.value);
            if (skillsNames.includes(val)) {
                bonusSkills[val] = (bonusSkills[val] || 0) + 1;
            }
            if (characteristicsNames.includes(val)) {
                bonusCharacteristics[val] = (bonusCharacteristics[val] || 0) + 1;
            }
        }
        
        // Handle Advantages that grant a rank if any (currently mostly specialties, but we can hook them here if needed later)
    }
    
    const container = document.getElementById('character-creation-form-container');
    if (!container) return;
    
    const trackerHTML = `
        <div id="stats-tracker" style="position: sticky; top: 0; background: #222; border: 1px solid #555; padding: 10px; margin-bottom: 20px; z-index: 1000; border-radius: 5px; color: #eee; box-shadow: 0 4px 6px rgba(0,0,0,0.5);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="margin: 0 0 5px 0; font-size: 14px; color: #aaa;">Caractéristiques (Base 1D)</h4>
                    <span id="char-status" style="font-weight: bold;">0 / 8 points répartis</span>
                    <div id="char-error" style="color: #ff4444; font-size: 12px; display: none;">Max 3D par carac !</div>
                </div>
                <div>
                    <h4 style="margin: 0 0 5px 0; font-size: 14px; color: #aaa;">Compétences</h4>
                    <span id="skill-status" style="font-weight: bold;">0 / 13 points (1x3D, 2x2D, 3x1D + 3 Libres)</span>
                    <div id="skill-error" style="color: #ff4444; font-size: 12px; display: none;">Répartition invalide !</div>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('afterbegin', trackerHTML);

    const charStatus = document.getElementById('char-status');
    const charError = document.getElementById('char-error');
    const skillStatus = document.getElementById('skill-status');
    const skillError = document.getElementById('skill-error');
    const submitBtn = document.getElementById('submit');

    function checkValidation() {
        updateBonuses();

        let charSum = 0;
        let charMaxExceeded = false;
        
        characteristicsNames.forEach(name => {
            const el = document.querySelector(`select[name="${name}"]`);
            if (el) {
                const bonusStr = bonusCharacteristics[name] || 0;
                let val = parseInt(el.value) || 1;
                
                const lastBonus = parseInt(el.dataset.lastBonus) || 0;
                // Auto-adjust down if it was only high because of the previous bonus
                if (val === Math.max(1, lastBonus + 1) && val > Math.max(1, bonusStr + 1)) {
                    val = Math.max(1, bonusStr + 1);
                    el.value = val;
                }
                el.dataset.lastBonus = bonusStr;

                // Enforce minimum based on bonus (default min is 1 anyway)
                const minVal = Math.max(1, bonusStr + 1); 
                if (val < minVal) {
                    val = minVal;
                    el.value = minVal;
                }
                
                // Hide options less than minimum
                Array.from(el.options).forEach(opt => {
                    const optVal = parseInt(opt.value);
                    if (optVal < minVal || optVal > 3) {
                        opt.style.display = 'none';
                    } else {
                        opt.style.display = '';
                    }
                });
                
                // Force max cap at 3 (Expert)
                if (val > 3) {
                    val = 3;
                    el.value = 3;
                }

                charSum += (val - bonusStr);
                if (val > 3) charMaxExceeded = true;
            }
        });
        
        // Base is 1 * 8 = 8. Points distributed = charSum - 8. Max distributed = 8.
        const charDistributed = charSum - 8;
        
        if (charDistributed === 8 && !charMaxExceeded) {
            charStatus.style.color = '#44ff44';
            charStatus.innerText = `8 / 8 points répartis`;
            charError.style.display = 'none';
        } else {
            charStatus.style.color = '#ffcc00';
            charStatus.innerText = `${charDistributed} / 8 points répartis`;
            if (charMaxExceeded) {
                charError.innerText = "Max 3D par caractéristique !";
                charError.style.display = 'block';
            } else if (charDistributed > 8) {
                charError.innerText = "Trop de points répartis !";
                charError.style.display = 'block';
            } else {
                charError.style.display = 'none';
            }
        }
        
        let skillLevels = [];
        let skillSum = 0;
        let skillMaxExceeded = false;
        
        skillsNames.forEach(name => {
            const el = document.querySelector(`select[name="${name}"]`);
            if (el) {
                const bonus = bonusSkills[name] || 0;
                let val = parseInt(el.value) || 0;
                
                const lastBonus = parseInt(el.dataset.lastBonus) || 0;
                // Auto-adjust down if it was only high because of the previous bonus
                if (val === lastBonus && val > bonus) {
                    val = bonus;
                    el.value = bonus;
                }
                el.dataset.lastBonus = bonus;

                // Enforce minimum based on bonus
                if (val < bonus) {
                    val = bonus;
                    el.value = bonus;
                }
                
                // Hide options less than bonus and limit maximum absolute to 3
                Array.from(el.options).forEach(opt => {
                    const optVal = parseInt(opt.value);
                    if (optVal < bonus || optVal > 3) {
                        opt.style.display = 'none';
                    } else {
                        opt.style.display = '';
                    }
                });

                // Force max cap at 3 (Expert)
                if (val > 3) {
                    val = 3;
                    el.value = 3;
                }

                const spent = val - bonus;

                if (spent > 0) {
                    skillLevels.push(spent);
                    skillSum += spent;
                    if (val > 3) skillMaxExceeded = true;
                }
            }
        });
        
        skillLevels.sort((a, b) => b - a); // descending
        
        // conditions: sum == 13, max <= 3, pointwise domination of [3, 2, 2, 1, 1, 1]
        const baseSkillRequirement = [3, 2, 2, 1, 1, 1];
        let dominationValid = true;
        
        for (let i = 0; i < baseSkillRequirement.length; i++) {
            const currentSkill = skillLevels[i] || 0;
            if (currentSkill < baseSkillRequirement[i]) {
                dominationValid = false;
                break;
            }
        }
        
        const isSkillValid = (skillSum === 13 && dominationValid && !skillMaxExceeded);
        
        if (isSkillValid) {
            skillStatus.style.color = '#44ff44';
            skillStatus.innerText = `${skillSum} / 13 points (Répartition correcte)`;
            skillError.style.display = 'none';
        } else {
            skillStatus.style.color = '#ffcc00';
            skillStatus.innerText = `${skillSum} / 13 points lus`;
            if (skillMaxExceeded) {
                skillError.innerText = "Max 3D par compétence !";
                skillError.style.display = 'block';
            } else if (!dominationValid && skillSum <= 13) {
                skillError.innerText = "Il manque les bases (1x3D, 2x2D, 3x1D)";
                skillError.style.display = 'block';
            } else if (skillSum > 13) {
                skillError.innerText = "Trop de points répartis !";
                skillError.style.display = 'block';
            } else {
                 skillError.innerText = "Répartition incomplète/invalide.";
                 skillError.style.display = 'block';
            }
        }
        
        // Automatically hide Options > 3 in selects is now handled above during calculation

        if (submitBtn) {
            submitBtn.disabled = !(charDistributed === 8 && !charMaxExceeded && isSkillValid);
            if (submitBtn.disabled) {
                submitBtn.style.opacity = '0.5';
                submitBtn.style.cursor = 'not-allowed';
                submitBtn.title = "Veuillez répartir vos points correctement.";
            } else {
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
                 submitBtn.title = "";
            }
        }
    }

    // Attach listeners
    characteristicsNames.forEach(name => {
        const el = document.querySelector(`select[name="${name}"]`);
        if (el) el.addEventListener('change', checkValidation);
    });
    skillsNames.forEach(name => {
        const el = document.querySelector(`select[name="${name}"]`);
        if (el) el.addEventListener('change', checkValidation);
    });
    
    // Equipment logic: Max 5 items
    const equipCheckboxes = document.querySelectorAll('.equip-checkbox');
    equipCheckboxes.forEach(cb => {
        cb.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('.equip-checkbox:checked').length;
            if (checkedCount > 5) {
                alert("Vous ne pouvez sélectionner que 5 pièces d'équipement au maximum.");
                this.checked = false;
            }
        });
    });

    const origineSelect = document.getElementById('origineSelect');
    if (origineSelect) origineSelect.addEventListener('change', () => { setTimeout(checkValidation, 50); });

    const signeSelect = document.getElementById('signeastroSelect');
    if (signeSelect) signeSelect.addEventListener('change', checkValidation);

    // Also add listener to origin bonus skill radio inputs when they are injected
    document.addEventListener('change', function(e) {
        if (e.target && e.target.name === 'origin_bonus_skill') {
            checkValidation();
        }
    });

    // Initial check
    setTimeout(checkValidation, 100);
});
