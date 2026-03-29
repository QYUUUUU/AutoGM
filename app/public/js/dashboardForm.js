document.addEventListener('DOMContentLoaded', function () {
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

    setupDropdown('dropdown-input', 'dropdown');
    setupDropdown('caracteristic-input', 'caracteristic-dropdown');

    const modifierInput = document.getElementById("modifier");
    const incrementButton = document.getElementById("increment");
    const decrementButton = document.getElementById("decrement");

    incrementButton.addEventListener("click", () => {
        modifierInput.value = parseInt(modifierInput.value) + 1;
    });

    decrementButton.addEventListener("click", () => {
        modifierInput.value = parseInt(modifierInput.value) - 1;
    });


    const statsSendButton = document.getElementById("stats-send");
    const competenceInput = document.getElementById("dropdown-input");
    const caracteristicInput = document.getElementById("caracteristic-input");
    statsSendButton.addEventListener("click", () => {
        console.log("triggered")
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
                console.log(responseData)
                const diceCounts = { "d10": responseData.totalDice }
                randomDiceThrow(diceCounts, responseData.relances); // Appeler votre fonction avec l'objet diceCounts
            })
            .catch(error => {
                console.error(error);
            });
    })
});