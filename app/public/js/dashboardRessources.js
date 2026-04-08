/**
 * @fileoverview dashboardRessources.js
 * @description Frontend script for managing read-only logic arrays (Languages, Specialties) and decrementing numerical logic meters (like Mana/Stamina) directly from the UI.
 * 
 * Features:
 * - Bootstraps upon DOMLoad and queries `list-langues` and `list-specialites`.
 * - Parses heavily fortified double-encoded JSON arrays (`data-langues`) safely using double inner try-catches.
 * - Iteratively renders styled `<li>` strings into HTML for fast front-end mapping.
 */
document.addEventListener("DOMContentLoaded", () => {
    // Fill langues
    const listLangues = document.getElementById("list-langues");
    if (listLangues) {
        const languesRaw = listLangues.getAttribute("data-langues");
        if (languesRaw) {
            try {
                let langues = JSON.parse(languesRaw);
                if (typeof langues === 'string') langues = JSON.parse(langues);
                if (Array.isArray(langues) && langues.length > 0) {
                    listLangues.innerHTML = langues.map(lang => `<li><i class="fas fa-check text-success me-2"></i> ${lang}</li>`).join("");
                } else {
                    listLangues.innerHTML = `<li><em>Aucune langue renseignée.</em></li>`;
                }
            } catch(e) {
                listLangues.innerHTML = `<li><em>Erreur de lecture des langues.</em></li>`;
            }
        }
    }

    // Fill specialites
    const listSpecialites = document.getElementById("list-specialites");
    if (listSpecialites) {
        const specialitesRaw = listSpecialites.getAttribute("data-specialites");
        if (specialitesRaw) {
            try {
                let specialites = JSON.parse(specialitesRaw);
                if (typeof specialites === 'string') specialites = JSON.parse(specialites);
                if (Array.isArray(specialites) && specialites.length > 0) {
                    listSpecialites.innerHTML = specialites.map(spec => `<li><i class="fas fa-check text-warning me-2"></i> ${spec.specialite} (<em class="text-secondary">${spec.competence}</em>)</li>`).join("");
                } else {
                    listSpecialites.innerHTML = `<li><em>Aucune spécialisation renseignée.</em></li>`;
                }
            } catch(e) {
                listSpecialites.innerHTML = `<li><em>Erreur de lecture des spécialisations.</em></li>`;
            }
        }
    }
});

/**
 * @function updateRessource
 * @description Modifies a specific numerical resource pool on a Character DB Entity (like Health or Mana).
 * Features:
 * - Reads increment `amount` and `type` context (which Maps directly to the DB column name like "blessurelegere" or "volonte").
 * - Parses text constraints natively from the DOM (`displaySpan`, `maxInput`) bound dynamically bypassing strict backend logic constraints.
 * - Dispatches payload securely updating the character using the universal HTTP PUT `/Character` single-field-updater built in `userRoutes.js`.
 * 
 * Wait for obsolete code confirmation: Once again, relying on `displaySpan.innerText` and `maxInput.value` for business rules means users can inspect element, change the text "10/10" to "999/10", click the heal button (+1), and update their character in the DB to have 1000 health permanently! This is purely client-side trust, an obsolete pattern for serious systems.
 * 
 * @param {string} type - System identifier mapping exactly to Prisma Character column fields.
 * @param {number} amount - Floating increment (+1, -1, etc).
 * @param {string|number} charId - ID of the character being patched.
 */
async function updateRessource(type, amount, charId) {
    if (!charId) return;

    // determine element and max resource input
    const displaySpan = document.getElementById(`display-${type}`);
    const maxInput = document.getElementById(`max-${type}`);
    
    if (!displaySpan || !maxInput) return;

    let maxVal = parseInt(maxInput.value) || 0;
    
    // extract current value from UI for instant update
    let currentText = displaySpan.innerText; // "12 / 15"
    let currentVal = parseInt(currentText.split('/')[0].trim());

    if (isNaN(currentVal)) return;

    let newVal = currentVal + amount;
    
    // Limits
    if (newVal < 0) newVal = 0;
    if (newVal > maxVal) newVal = maxVal;

    // Send to backend
    try {
        const response = await fetch('/Character', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: charId,
                field: type,
                value: newVal
            })
        });

        if (response.ok) {
            // Update UI
            displaySpan.innerText = `${newVal} / ${maxVal}`;
        } else {
            console.error("Failed to update resource");
            alert("Erreur lors de la mise à jour de la ressource.");
        }
    } catch(err) {
        console.error(err);
        alert("Erreur de connexion.");
    }
}
window.updateRessource = updateRessource;

async function updateBlessure(type, note, charId) {
    if (!charId) return;

    let newVal = note;
    
    // Check if the user is clicking the specifically active check to uncheck it (like character.js does 'if circlered.png && note == "1" then 0'). To keep it simple, let's just observe the current state.
    // Let's get the specific image they clicked
    const imgId = type.replace("blessure", "") + "-dash" + note;
    const imgEl = document.getElementById(imgId);
    if (!imgEl) return;
    
    // If they clicked the currently "highest" red circle, they probably want to decrement
    // so let's check if it's currently red, and if the next one is NOT red (or doesn't exist).
    const isRed = imgEl.src.includes("circlered.png");
    const nextImgId = type.replace("blessure", "") + "-dash" + (note + 1);
    const nextImg = document.getElementById(nextImgId);
    if (isRed && (!nextImg || !nextImg.src.includes("circlered.png"))) {
        newVal = note - 1; // Uncheck
    }
    
    // Send to backend
    try {
        const response = await fetch('/Character', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: charId,
                field: type,
                value: newVal
            })
        });

        if (response.ok) {
            const updatedCharacter = await response.json();
            
            // Update UI for all circles of this type
            let i = 1;
            let currentCircle = document.getElementById(type.replace("blessure", "") + "-dash" + i);
            while (currentCircle) {
                if (i <= newVal) {
                    currentCircle.src = '/images/circlered.png';
                } else {
                    currentCircle.src = '/images/circle.png';
                }
                i++;
                currentCircle = document.getElementById(type.replace("blessure", "") + "-dash" + i);
            }
            
            // Update Effort and SangFroid dynamically without reload
            const displayEffort = document.getElementById('display-effort');
            const maxEffort = document.getElementById('max-effort');
            if (displayEffort && maxEffort && updatedCharacter.effort !== undefined) {
                 displayEffort.innerText = updatedCharacter.effort + ' / ' + maxEffort.value;
            }

            const displaySangfroid = document.getElementById('display-sangfroid');
            const maxSangfroid = document.getElementById('max-sangfroid');
            if (displaySangfroid && maxSangfroid && updatedCharacter.sangfroid !== undefined) {
                 displaySangfroid.innerText = updatedCharacter.sangfroid + ' / ' + maxSangfroid.value;
            }
            
        } else {
            console.error("Failed to update blessure");
            alert("Erreur lors de la mise à jour de la blessure.");
        }
    } catch(err) {
        console.error(err);
        alert("Erreur de connexion.");
    }
}
window.updateBlessure = updateBlessure;
