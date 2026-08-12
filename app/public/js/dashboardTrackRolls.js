/**
 * @fileoverview dashboardTrackRolls.js
 * @description Frontend script for managing the Real-time Multiplayer Dice rolling log visualizer on the RPG Dashboard via SSE (Server-Sent Events) and initial historical REST syncing.
 */
let showedRolls = [];
let rollStreamSource = null;
let rollStreamReconnectTimer = null;
let rollStreamReconnectAttempt = 0;

function scheduleRollStreamReconnect() {
    if (rollStreamReconnectTimer) {
        return;
    }

    const delay = Math.min(30000, 1000 * Math.pow(2, rollStreamReconnectAttempt));
    rollStreamReconnectAttempt += 1;

    rollStreamReconnectTimer = setTimeout(() => {
        rollStreamReconnectTimer = null;
        connectRollStream();
    }, delay);
}

function connectRollStream() {
    const rollsTracking = document.querySelector(".dice-results .body-card");
    if (!rollsTracking) return;

    if (rollStreamSource) {
        rollStreamSource.close();
        rollStreamSource = null;
    }

    let sseUrl = '/stream/rolls';
    const groupeInput = document.getElementById('activeGroupeId');
    if (groupeInput && groupeInput.value) {
        sseUrl += `?groupe_id=${groupeInput.value}`;
    }

    const evtSource = new EventSource(sseUrl);
    rollStreamSource = evtSource;

    evtSource.onopen = function() {
        rollStreamReconnectAttempt = 0;
        if (rollStreamReconnectTimer) {
            clearTimeout(rollStreamReconnectTimer);
            rollStreamReconnectTimer = null;
        }
        fetchRolls();
    };

    evtSource.onmessage = function(event) {
        try {
            const newRolls = JSON.parse(event.data);
            showRollOnDashboard(newRolls);
        } catch (e) {
            // Ignore malformed data or keep-alive noise
        }
    };

    evtSource.onerror = function() {
        // Recreate the connection explicitly so it comes back after proxy or network drops.
        console.warn("SSE connection lost. Reconnecting...");

        if (evtSource.readyState === EventSource.CLOSED) {
            scheduleRollStreamReconnect();
            return;
        }

        evtSource.close();
        rollStreamSource = null;
        scheduleRollStreamReconnect();
    };
}

/**
 * @function fetchRolls
 * @description Initially grabs historical rolls log for the current loaded session (grouped or solo).
 * Features:
 * - Scrapes active session context `groupe_id` locally from a hidden DOM element (`activeGroupeId`).
 * - Forwards context correctly to the backend `/fetch/rolls` via `PUT` to filter only relevant team chat rolls.
 * - Bridges parsed JSON dataset to the UI rendering loop `showRollOnDashboard`.
 */
async function fetchRolls() {
    let url = '/fetch/rolls';
    const groupeInput = document.getElementById('activeGroupeId');
    if (groupeInput && groupeInput.value) {
        url += `?groupe_id=${groupeInput.value}`;
    }

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
            showRollOnDashboard(responseData);
        })
        .catch(error => {
            console.error(error);
        });
}

/**
 * @function showRollOnDashboard
 * @description Generates HTML markup natively mapping Dice rolls output data onto the screen context.
 * Features:
 * - Employs a local memory cache tracking `showedRolls` indices to prevent appending multiple copies of the same roll.
 * - Extracts foreign `Character` relational mappings securely creating name headers (`nameHeader`) alongside their respective Avatars.
 * - Dynamically inserts an "AI" badge via conditional ternary logic if `roll.thrownByAI` flag triggered true.
 * - Encompasses simple string formatting using Regex formatting the `content` payload (numbers are wrapped in bold styled tags).
 * - Implements automated auto-scrolling snapping bottom-up behavior when a new roll is attached to the view.
 * 
 * @param {Array} rolls - Array collection consisting of `{ id, content, Character, isStatRoll, thrownByAI... }` structure blocks.
 */
function showRollOnDashboard(rolls) {
    if (!rolls || !Array.isArray(rolls)) {
        console.warn("showRollOnDashboard called with invalid rolls data:", rolls);
        return;
    }
    const rollsTracking = document.querySelector(".dice-results .body-card");
    if (!rollsTracking) return; // wait...
    
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

            let avatarImg = '<i class="fas fa-user-circle"></i>';
            if (roll.Character) {
                if (roll.Character.avatar && roll.Character.avatar !== "") {
                    avatarImg = `<img src="${roll.Character.avatar}" style="width: 25px; height: 25px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(199, 169, 114, 0.4); margin-right: 5px; vertical-align: middle;">`;
                } else if (roll.Character.genre) {
                    avatarImg = `<img src="/images/characters/${roll.Character.genre}/${roll.Character.genre}-1.jpg" style="width: 25px; height: 25px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(199, 169, 114, 0.4); margin-right: 5px; vertical-align: middle;">`;
                }
            }

            nameHeader.innerHTML = `${avatarImg} ${characterName}${statLabel}${aiBadge}`;
            
            const textRoll = document.createElement("p");
            
            let meta = null;
            let rawContent = roll.content || "";
            const metaMatch = rawContent.match(/<!--meta:(.*?)-->/);
            if (metaMatch) {
                try {
                    meta = JSON.parse(metaMatch[1]);
                    rawContent = rawContent.replace(metaMatch[0], '');
                } catch(e) {}
            }

            if (meta && meta.color) {
                nameHeader.style.color = meta.color;
            }

            // Animate remote roll if applicable
            if (meta && meta.localThrowId && meta.results) {
                window.myRollIds = window.myRollIds || [];
                if (!window.myRollIds.includes(meta.localThrowId) && window.animateRemoteRoll) {
                    // It's a remote throw! We animate it!
                    window.animateRemoteRoll(meta.results, meta.color || "#2d2d2d");
                    // Important: Since we already saw it, we can push it to myRollIds just in case although showedRolls handles it
                    window.myRollIds.push(meta.localThrowId);
                }
            }

            // Format content: highlight numbers and make it look nicer
            let formattedContent = rawContent.replace(/\b(\d+)\b/g, '<strong class="roll-highlight">$1</strong>');
            // If there's a bar separator | let's format it a bit nicer
            formattedContent = formattedContent.replace(/\|/g, '<span style="color: rgba(199, 169, 114, 0.4); margin: 0 5px;">|</span>');
            // Format newlines
            formattedContent = formattedContent.replace(/\n/g, '<br>');
            
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

/**
 * @event 'DOMContentLoaded'
 * @description Bootstraps SSE WebSocket-like connection keeping real-time sync with other Group users dynamically connected.
 * Features:
 * - Bootstraps historical sync `fetchRolls()` automatically.
 * - Extracts `groupeInput` logic parameter natively appending `?groupe_id` parameter to `/stream/rolls`.
 * - Establishes the `EventSource(sseUrl)` connecting node.
 * - Bridges the `onmessage` raw streaming pipe down to `showRollOnDashboard(JSON)` mapping without user intervention seamlessly.
 */
// Ensure the DOM is fully loaded before fetching
document.addEventListener('DOMContentLoaded', () => {
    const rollsTracking = document.querySelector(".dice-results .body-card");
    if (rollsTracking) {
        fetchRolls();

        connectRollStream();

        // Close connection cleanly when user leaves or refreshes page
        window.addEventListener('beforeunload', () => {
            if (rollStreamReconnectTimer) {
                clearTimeout(rollStreamReconnectTimer);
            }
            if (rollStreamSource) {
                rollStreamSource.close();
            }
        });
    }
});