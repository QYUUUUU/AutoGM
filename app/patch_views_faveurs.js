const fs = require('fs');

let twigContent = fs.readFileSync('views/faveurs.html.twig', 'utf8');

twigContent = twigContent.replace(
  /onclick="openFaveurModal\('\{\{ faveur.nom\|e\('js'\) \}\}'\)"/g,
  'onclick="openFaveurModal(\'{{ faveur.nom|e(\\\'js\\\') }}\', \'{{ faveur.stade|e(\\\'js\\\') }}\')"'
);

twigContent = twigContent.replace(
  /<option value="\{\{ character.id_Character \}\}">\{\{ character.name \}\}<\/option>/g,
  '<option value="{{ character.id_Character }}" data-stade="{{ character.stadeEclat }}">{{ character.nom }}</option>'
);

let jsBlock = `    let selectedFaveurName = '';
    const STADE_LEVELS = {
        'Rencontre': 1,
        'Entente': 2,
        'Accord': 3
    };

    function openFaveurModal(faveurName, faveurStade) {
        selectedFaveurName = faveurName;
        document.getElementById('faveurNameDisplay').innerText = faveurName;
        
        // Filter options
        const faveurLevel = STADE_LEVELS[faveurStade] || 0;
        const options = document.querySelectorAll('#characterSelect option');
        
        options.forEach(option => {
            if (option.value === "") {
                option.style.display = 'block'; // Always show placeholder
                return;
            }
            const charStade = option.getAttribute('data-stade');
            const charLevel = STADE_LEVELS[charStade] || 0;
            
            if (charLevel >= faveurLevel) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
        
        document.getElementById('characterSelect').value = ""; // Reset selection
        
        $('#faveurModal').modal('show');
    }`;

twigContent = twigContent.replace(
  /    let selectedFaveurName = '';\s*function openFaveurModal\(faveurName\) {[\s\S]*?document\.getElementById\('faveurNameDisplay'\)\.innerText = faveurName;[\s\S]*?\$\('#faveurModal'\)\.modal\('show'\);\s*}/g,
  jsBlock
);

fs.writeFileSync('views/faveurs.html.twig', twigContent);
console.log("Updated views/faveurs.html.twig successfully");
