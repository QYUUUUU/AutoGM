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
            puissance: document.getElementsByName('puissance')[0].value,
            resistance: document.getElementsByName('resistance')[0].value,
            precicion: document.getElementsByName('precicion')[0].value,
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
            rituels: document.getElementsByName('rituels')[0].value
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