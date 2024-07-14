
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

setInterval(fetchRolls, 5000);

let showedRolls = [];
function showRollOnDashboard(rolls) {
    const rollsTracking = document.querySelector("body > main > div > div.col-12.col-lg-5 > div > div.dice-results > div.body-card");

    rolls.forEach(roll => {
        if (!showedRolls.includes(roll.id)) {
            const rollMessage = document.createElement("div");
            rollMessage.classList.add("rollMessage")
            const textRoll = document.createElement("p");
            textRoll.innerText = roll.content;
            rollMessage.appendChild(textRoll);
            rollsTracking.appendChild(rollMessage);
            showedRolls.push(roll.id)
        }
    });
}