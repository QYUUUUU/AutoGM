
let showedRolls = [];

// Fonction pour appeler la route
async function fetchRolls() {
    const url = '/fetch/rolls';

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse JSON response
            } else {
                console.error(response.status, response.statusText);
            }
        })
        .then(responseData => {
            // Handle successful response
            console.log(responseData)
            showRollOnDashboard(responseData); // Appeler votre fonction avec l'objet diceCounts
        })
        .catch(error => {
            console.error(error);
        });
}



function showRollOnDashboard(rolls) {
    if (!rolls || !Array.isArray(rolls)) {
        console.warn("showRollOnDashboard called with invalid rolls data:", rolls);
        return;
    }
    const rollsTracking = document.querySelector(".dice-results .body-card");
    let added = false;
    rolls.forEach(roll => {
        if (!showedRolls.includes(roll.id)) {
            const rollMessage = document.createElement("div");
            rollMessage.classList.add("rollMessage");
            
            // Add Character name header
            const characterName = roll.Character && roll.Character.nom ? roll.Character.nom : "Aventurier Inconnu";
            const nameHeader = document.createElement("div");
            nameHeader.classList.add("roll-character-name");
            
            let statLabel = "";
            if (roll.isStatRoll) {
                const parts = [];
                if (roll.caracteristic) parts.push(roll.caracteristic);
                if (roll.competence) parts.push(roll.competence);
                if (parts.length > 0) {
                    statLabel = ` <span style="color: #ccc; font-size: 0.85em; font-weight: normal; margin-left: 5px;">(${parts.join(' / ')})</span>`;
                }
            }
            
            let aiBadge = "";
            if (roll.thrownByAI) {
                aiBadge = ` <span style="color: #c7a972; font-size: 0.7em; font-weight: bold; margin-left: 8px; border: 1px solid #c7a972; padding: 1px 4px; border-radius: 3px; vertical-align: middle;">AI</span>`;
            }

            nameHeader.innerHTML = `<i class="fas fa-user-circle"></i> ${characterName}${statLabel}${aiBadge}`;
            
            const textRoll = document.createElement("p");
            
            // Format content: highlight numbers and make it look nicer
            let formattedContent = roll.content.replace(/\b(\d+)\b/g, '<strong class="roll-highlight">$1</strong>');
            // If there's a bar separator | let's format it a bit nicer
            formattedContent = formattedContent.replace(/\|/g, '<span style="color: rgba(199, 169, 114, 0.4); margin: 0 5px;">|</span>');
            
            textRoll.innerHTML = formattedContent;
            
            rollMessage.appendChild(nameHeader);
            rollMessage.appendChild(textRoll);
            rollsTracking.appendChild(rollMessage);
            showedRolls.push(roll.id);
            added = true;
        }
    });

    if (added) {
        // Auto-scroll to the bottom
        rollsTracking.scrollTop = rollsTracking.scrollHeight;
    }
}

// Load initial rolls once
fetchRolls();

// Listen to real-time events
const evtSource = new EventSource('/stream/rolls');
evtSource.onmessage = function(event) {
    const newRolls = JSON.parse(event.data);
    showRollOnDashboard(newRolls);
};
evtSource.onerror = function() {
    console.error("EventSource failed.");
};
