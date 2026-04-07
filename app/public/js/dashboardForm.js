/**
 * @fileoverview dashboardForm.js
 * @description Manages the interactive components of the dice rolling form on the dashboard (custom dropdowns, stat modifiers, and throw dispatching).
 */
document.addEventListener('DOMContentLoaded', function () {
    /**
     * @function setupDropdown
     * @description Initializes a custom searchable dropdown component attached to a text input.
     * Features:
     * - Toggles dropdown visibility on input click.
     * - Hides dropdown when clicking outside of it to prevent UI clutter.
     * - Live-filters available `<a>` options inside the dropdown based on text typed in the input (keyup event).
     * - Allows selecting an option and populating the input with a hidden `data-value` attribute.
     * 
     * @param {string} inputId - DOM ID of the text input acting as a search bar/selector.
     * @param {string} dropdownId - DOM ID of the container holding the dropdown options.
     */
    function setupDropdown(inputId, dropdownId) {
        const input = document.getElementById(inputId);
        const dropdown = document.getElementById(dropdownId);
        const options = dropdown.getElementsByTagName('a');

        input.addEventListener('click', function () {
            dropdown.style.display = 'block';
        });

        document.addEventListener('click', function (e) {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        input.addEventListener('keyup', function () {
            const filter = input.value.toLowerCase();
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                if (option.textContent.toLowerCase().includes(filter)) {
                    option.style.display = '';
                } else {
                    option.style.display = 'none';
                }
            }
        });

        for (let i = 0; i < options.length; i++) {
            options[i].addEventListener('click', function (e) {
                e.preventDefault();
                input.value = this.getAttribute('data-value');
                dropdown.style.display = 'none';
            });
        }
    }

    // Initialize custom dropdown components
    setupDropdown('dropdown-input', 'dropdown');
    setupDropdown('caracteristic-input', 'caracteristic-dropdown');

    const modifierInput = document.getElementById("modifier");
    const incrementButton = document.getElementById("increment");
    const decrementButton = document.getElementById("decrement");

    // Standard +1 / -1 counter mechanics for the dice modifier
    incrementButton.addEventListener("click", () => {
        modifierInput.value = parseInt(modifierInput.value) + 1;
    });

    decrementButton.addEventListener("click", () => {
        modifierInput.value = parseInt(modifierInput.value) - 1;
    });


    const statsSendButton = document.getElementById("stats-send");
    const competenceInput = document.getElementById("dropdown-input");
    const caracteristicInput = document.getElementById("caracteristic-input");
    
    /**
     * @event 'click' on statsSendButton
     * @description Fires an asynchronous request to the server to compute the mechanics for the RPG dice roll attempt.
     * Features:
     * - Packages current input values (`modifier`, `competence`, `caracteristic`).
     * - Sends JSON to `PUT /throw`.
     * - Parses backend response (`responseData.totalDice`, `relances`, and `extraDice`).
     * - Combines the dice count dictionary mapped by string types (e.g. "d10", "d6").
     * - Proxies raw data execution to the global 3D `randomDiceThrow(diceCounts, relances, caracteristic, competence)` method (mapped loosely from `dashboardDies.js`).
     */
    statsSendButton.addEventListener("click", () => {

        const url = '/throw';

        // Updated payload to be sent in the request body
        const data = {
            modifier: modifierInput.value,
            competence: competenceInput.value,
            caracteristic: caracteristicInput.value
        };
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Convert data to JSON string
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

                let diceCounts = { "d10": responseData.totalDice };
                if (responseData.extraDice) {
                    for (let [dType, num] of Object.entries(responseData.extraDice)) {
                        let lowerType = dType.toLowerCase();
                        if (diceCounts[lowerType]) diceCounts[lowerType] += num;
                        else diceCounts[lowerType] = num;
                    }
                }
                randomDiceThrow(diceCounts, responseData.relances, data.caracteristic, data.competence); // Appeler votre fonction avec l'objet diceCounts
            })
            .catch(error => {
                console.error(error);
            });
    })
});