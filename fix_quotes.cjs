const fs = require('fs');
let ui = fs.readFileSync('app/views/eclats.html.twig', 'utf8');

ui = ui.replace(/'L\\'Élu entre en possession de son Éclat\.\\n\s*Il gagne \+1 Caractéristique et \+1 Compétence\.'/g, "\`L'Élu entre en possession de son Éclat.\\nIl gagne +1 Caractéristique et +1 Compétence.\`");

ui = ui.replace(/'Passage à l\\'Entente\.\\n\s*L\\'Élu gagne \+1 Caractéristique et \+1 Compétence\.'/g, "\`Passage à l'Entente.\\nL'Élu gagne +1 Caractéristique et +1 Compétence.\`");

ui = ui.replace(/'Passage à l\\'Accord\.\\n\s*L\\'Élu gagne \+1 Caractéristique et DEUX Compétences\.'/g, "\`Passage à l'Accord.\\nL'Élu gagne +1 Caractéristique et DEUX Compétences.\`");

fs.writeFileSync('app/views/eclats.html.twig', ui);
