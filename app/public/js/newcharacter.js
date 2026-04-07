/**
 * @fileoverview newcharacter.js
 * @description Frontend script dedicated entirely to the multi-step Character Creation form wizard, managing its pagination, avatar selection logic, and final bulk data submission.
 */
document.addEventListener('DOMContentLoaded', function () {
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');

    /**
     * @function updateTrackerVisibility
     * @description Toggles visibility of the sticky stats-tracker sidebar strictly during middle steps mapping mechanical attributes (Step 4 to 10).
     */
    function updateTrackerVisibility(stepId) {
        const tracker = document.getElementById('stats-tracker');
        if (tracker) {
            const stepNum = parseInt(stepId.replace('step-', ''));
            if (stepNum >= 4 && stepNum <= 10) {
                tracker.style.display = 'block';
            } else {
                tracker.style.display = 'none';
            }
        }
    }

    nextButtons.forEach(button => {
        button.addEventListener('click', function () {
            const nextStepId = this.getAttribute('data-next');
            const currentStep = this.closest('.step');
            const nextStep = document.getElementById(nextStepId);
            currentStep.style.display = 'none';
            nextStep.style.display = 'block';
            updateTrackerVisibility(nextStepId);
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', function () {
            const prevStepId = this.getAttribute('data-prev');
            const currentStep = this.closest('.step');
            const prevStep = document.getElementById(prevStepId);
            currentStep.style.display = 'none';
            prevStep.style.display = 'block';
            updateTrackerVisibility(prevStepId);
        });
    });

    const submitButton = document.getElementById("submit");

    submitButton.addEventListener("click", createCharacter);

    // --- AVATAR LOGIC ---
    const genreSelect = document.getElementById('genreSelect');
    const avatarSelection = document.getElementById('avatar-selection');
    const avatarPreset = document.getElementById('avatar_preset');
    const avatarPreview = document.getElementById('avatar_preview');
    const customAvatarInput = document.getElementById('custom_avatar');
    const imageDataInput = document.getElementById('imageData');

    /**
     * @function populateAvatars
     * @description Fills the visual grid wrapper fetching strictly formatted static local avatars depending conditionally on gender matching count (femme=15, else 16).
     * Features:
     * - Generates clickable `<img>` HTML components attached dynamically to `avatarPreset`.
     * - Draws highlighting golden `border` identifying active selection.
     */
    function populateAvatars() {
        if (!avatarSelection) return;
        const genre = genreSelect.value;
        const count = genre === 'femme' ? 15 : 16;
        avatarSelection.innerHTML = '';
        
        for (let i = 1; i <= count; i++) {
            const imgPath = `/images/characters/${genre}/${genre}-${i}.jpg`;
            const img = document.createElement('img');
            img.src = imgPath;
            img.style.width = '60px';
            img.style.height = '60px';
            img.style.objectFit = 'cover';
            img.style.cursor = 'pointer';
            img.style.borderRadius = '5px';
            img.style.border = (avatarPreset.value === imgPath && !imageDataInput.value) ? '2px solid #ffcc00' : '2px solid transparent';
            
            img.addEventListener('click', () => {
                avatarPreset.value = imgPath;
                imageDataInput.value = ''; // clear custom
                customAvatarInput.value = ''; // visual clear
                avatarPreview.src = imgPath;
                populateAvatars(); // re-render borders
            });
            avatarSelection.appendChild(img);
        }
        
        if (!imageDataInput.value && !avatarPreset.value.includes(genre)) {
            avatarPreset.value = `/images/characters/${genre}/${genre}-1.jpg`;
            avatarPreview.src = avatarPreset.value;
            populateAvatars();
        }
    }

    if(genreSelect) {
        genreSelect.addEventListener('change', populateAvatars);
        populateAvatars();
    }

    if(customAvatarInput) {
        customAvatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const fileChosen = document.getElementById('file-chosen');
            if (file) {
                if (fileChosen) fileChosen.textContent = file.name;
                const reader = new FileReader();
                reader.onload = function(evt) {
                    imageDataInput.value = evt.target.result;
                    avatarPreview.src = evt.target.result;
                    populateAvatars(); // to clear the yellow border
                };
                reader.readAsDataURL(file);
            } else {
                if (fileChosen) fileChosen.textContent = "Aucun fichier choisi";
            }
        });
    }

    /**
     * @function createCharacter
     * @description Master bundle extraction mechanism triggered on form `submit` click.
     * Features:
     * - Scrapes DOM for roughly ~64 specific names/ids.
     * - Pulls Avatar Base64 `imageData` if assigned customly.
     * - Resolves custom nested hidden inputs handling RPG `langues` arrays and `specialites` dynamically structured during creation.
     * - Collects mapping arrays out of `.equip-checkbox:checked`.
     * - Calls the secure `fetch` API `POST /create-character`.
     * - Automatically hooks into `window.location.href = '/characters'` to redirect the user.
     * 
     * Wait for obsolete code confirmation: Extracting data by assuming `document.getElementsByName('nom')[0]` exists will instantly crash the entire Javascript context and permanently break the form if a single field is momentarily missing or renamed in the TWIG template. (Consider switching to standard `FormData(formElement)` map).
     */
    function createCharacter() {
        // Gather form data
        const formData = {
            nom: document.getElementsByName('nom')[0].value,
            age: document.getElementsByName('age')[0].value,
            genre: genreSelect ? genreSelect.value : document.getElementsByName('genre')[0].value,
            avatar: avatarPreset ? avatarPreset.value : undefined,
            imageData: imageDataInput ? imageDataInput.value : undefined,
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
            langues: (document.getElementById('langues-hidden') ? document.getElementById('langues-hidden').value : '[]'),
            specialites: (document.getElementById('specialites-hidden') ? document.getElementById('specialites-hidden').value : '[]'),
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

/**
 * @function formatStatsWithSelection
 * @description Parses raw origin HTML descriptions to dynamically inject Interactive Radio Buttons into the DOM for character creation bonuses.
 * Features:
 * - Detects "Compétence de Débutant bonus", "Avantage", "Désavantage", and "Capacité d'Instinct".
 * - Uses Regex to extract names and descriptions.
 * - Wraps findings in `<label><input type="radio"...>` tags to allow users to select their origin-specific perks.
 * - Reconstructs the manipulated HTML.
 * @param {string} rawStats - The raw text block containing predefined origin stat choices from the data objects.
 * @returns {string} The formatted HTML string containing the interactive radio forms.
 */
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
                if (!newParts.some(p => p.includes("Choisissez votre Capacité d'Instinct"))) {
                    newParts.push('<div style="margin-top: 15px; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #4a4a4a; color: #d0c8b0; font-size: 1.1em; font-family: \'Cinzel\', serif;">Choisissez votre Capacité d\'Instinct :</div>');
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

    /**
     * @function updateBonuses
     * @description Recalculates the active bonus points derived from the user's chosen Astrological Sign and Origin Radio selections.
     * Features:
     * - Maps the text values of chosen signs (e.g. "Loup") to the internal stat name (e.g. "faune").
     * - Parses the `origin_bonus_skill` radio buttons.
     * - Populates `bonusCharacteristics` and `bonusSkills` dictionaries to be used by the validation tracker.
     */
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
    
    // Create the tracker and hide it initially
    const trackerHTML = `
        <div id="stats-tracker" style="position: sticky; top: 0; background: rgba(18, 21, 23, 0.95); border: 1px solid #c2a059; padding: 15px; margin-bottom: 20px; z-index: 1000; border-radius: 8px; color: #eee; box-shadow: 0 4px 8px rgba(0,0,0,0.6); display: none;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h4 style="margin: 0 0 5px 0; font-size: 15px; color: #c2a059; text-transform: uppercase;">Caractéristiques (Base 1D)</h4>
                    <span id="char-status" style="font-weight: bold; font-size: 16px;">0 / 8 points répartis</span>
                    <div id="char-error" style="color: #ff4444; font-size: 13px; display: none; margin-top: 5px;">Max 3D par carac !</div>
                </div>
                <div style="text-align: right;">
                    <h4 style="margin: 0 0 5px 0; font-size: 15px; color: #c2a059; text-transform: uppercase;">Compétences</h4>
                    <div id="skill-status" style="font-weight: bold; font-size: 16px;">0 / 13 points lus</div>
                    <div id="skill-missing" style="font-size: 13px; color: #aaa; margin-top: 2px;">Il manque les bases (1x3D, 2x2D, 3x1D)</div>
                    <div id="skill-error" style="color: #ff4444; font-size: 13px; display: none; margin-top: 5px;">Répartition invalide !</div>
                </div>
            </div>
        </div>
    `;
    /**
     * @function checkValidation
     * @description Runs continuous validation on the DOM inputs to enforce character creation rules.
     * Features:
     * - Validates "Caractéristiques" (Base Stats): 8 points total, max 3 per stat.
     * - Validates "Compétences" (Skills): Exactly 1x 3D, 2x 2D, 3x 1D allocation.
     * - Computes final totals merging user inputs and Origin/Sign track bonuses.
     * - Modifies UI text to red (`#ff4444`) on error and locks/unlocks the Form Submission button depending on pass conditions.
     */
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
        
        const skillMissingDiv = document.getElementById('skill-missing');
        
        if (isSkillValid) {
            skillStatus.style.color = '#44ff44';
            skillStatus.innerText = `${skillSum} / 13 points (Répartition correcte)`;
            skillError.style.display = 'none';
            if(skillMissingDiv) skillMissingDiv.style.display = 'none';
        } else {
            skillStatus.style.color = '#ffcc00';
            skillStatus.innerText = `${skillSum} / 13 points lus`;
            
            if (!dominationValid) {
                if(skillMissingDiv) skillMissingDiv.style.display = 'block';
            } else {
                if(skillMissingDiv) skillMissingDiv.style.display = 'none';
            }
            
            if (skillMaxExceeded) {
                skillError.innerText = "Max 3D par compétence !";
                skillError.style.display = 'block';
            } else if (skillSum > 13) {
                skillError.innerText = "Trop de points répartis !";
                skillError.style.display = 'block';
            } else {
                 // skillError is specifically for breaking hard limits, missing bases is handled by skillMissingDiv
                 skillError.style.display = 'none';
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

// --- DYNAMIC LANGUES ET SPECIALITES LOGIC ---
document.addEventListener('DOMContentLoaded', function() {
    const languesContainer = document.getElementById('dynamic-langues');
    const specsContainer = document.getElementById('dynamic-specs');
    if(!languesContainer || !specsContainer) return;

    function updateLanguesAndSpecs() {
        // Runes
        const runesEl = document.querySelector('select[name="runes"]');
        let runesVal = runesEl ? parseInt(runesEl.value) : 0;
        
        let numLangues = 0;
        if(runesVal===1) numLangues = 1;
        if(runesVal===2) numLangues = 2;
        if(runesVal===3) numLangues = 3;
        if(runesVal===4) numLangues = 4;
        if(runesVal===5) numLangues = 6;
        if(runesVal===6) numLangues = 8;
        
        let html = '';
        for(let i=0; i<numLangues; i++) {
            html += `<input type="text" class="form-control langue-input" placeholder="Langue supplémentaire ${i+1}" style="margin-bottom:5px;">`;
        }
        if(numLangues===0) {
            html += `<p style="font-style:italic;">Aucune langue supplémentaire</p>`;
        }
        languesContainer.innerHTML = html;
        
        // Specialites
        const skillsNames = ['arts', 'cite', 'civilisations', 'relationnel', 'soins', 'animalisme', 'faune', 'montures', 'pistage', 'territoire', 'adresse', 'armurerie', 'artisanat', 'mecanisme', 'runes', 'athletisme', 'discretion', 'flore', 'vigilance', 'voyage', 'bouclier', 'cac', 'lancer', 'melee', 'tir', 'eclats', 'lunes', 'mythes', 'pantheons', 'rituels'];
        let specsHtml = '';
        skillsNames.forEach(name => {
            const el = document.querySelector(`select[name="${name}"]`);
            if (el && parseInt(el.value) >= 2) {
                specsHtml += `<div style="margin-bottom:10px;">
                    <label>Spécialité pour <b>${name.toUpperCase()}</b> (Confirmé+):</label>
                    <input type="text" class="form-control spec-input" data-skill="${name}" placeholder="Ex: Arc lourd">
                </div>`;
            }
        });
        if(specsHtml === '') {
            specsHtml += `<p style="font-style:italic;">Aucune compétence n'a atteint le niveau Confirmé.</p>`;
        }
        specsContainer.innerHTML = specsHtml;

        bindInputs();
    }

    function bindInputs() {
        document.querySelectorAll('.langue-input, .spec-input').forEach(inp => {
            inp.addEventListener('input', function() {
                // update hidden fields
                const langues = ['Babelite'];
                document.querySelectorAll('.langue-input').forEach(l => {
                    if(l.value.trim()) langues.push(l.value.trim());
                });
                document.getElementById('langues-hidden').value = JSON.stringify(langues);

                const specs = [];
                document.querySelectorAll('.spec-input').forEach(s => {
                    if(s.value.trim()) {
                        specs.push({ competence: s.getAttribute('data-skill'), specialite: s.value.trim() });
                    }
                });
                document.getElementById('specialites-hidden').value = JSON.stringify(specs);
            });
        });
        
        // manually dispatch input to initialize hidden fields correctly
        if(document.querySelector('.langue-input')) document.querySelector('.langue-input').dispatchEvent(new Event('input'));
    }

    // Bind change on all skills to update dynamic section
    const skillsNames = ['arts', 'cite', 'civilisations', 'relationnel', 'soins', 'animalisme', 'faune', 'montures', 'pistage', 'territoire', 'adresse', 'armurerie', 'artisanat', 'mecanisme', 'runes', 'athletisme', 'discretion', 'flore', 'vigilance', 'voyage', 'bouclier', 'cac', 'lancer', 'melee', 'tir', 'eclats', 'lunes', 'mythes', 'pantheons', 'rituels'];
    skillsNames.forEach(name => {
        const el = document.querySelector(`select[name="${name}"]`);
        if (el) el.addEventListener('change', updateLanguesAndSpecs);
    });

    updateLanguesAndSpecs();
});
