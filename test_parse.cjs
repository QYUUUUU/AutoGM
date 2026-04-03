const fs = require('fs');
let lines = fs.readFileSync('app/views/index.html.twig', 'utf8').split('\n');

let pStart = -1, pEnd = -1;
let lStart = -1, lEnd = -1;
let tStart = -1, tEnd = -1;

for(let i=0; i<lines.length; i++) {
    if(lines[i].includes('Personnage & Équipement') && lines[i].includes('<h6')) pStart = i - 1;
    if(lines[i].includes('<div id="armureStats"')) pEnd = i + 2; 

    if(lines[i].includes('Lancer Libre') && lines[i].includes('<h6')) lStart = i - 1;
    if(lines[i].includes('id="dice-throw-trigger"')) lEnd = i + 2;

    if(lines[i].includes('Test de Compétence') && lines[i].includes('<h6')) tStart = i - 1;
    if(lines[i].includes('id="stats-send"')) tEnd = i + 1;
}

console.log("P:", pStart, pEnd);
console.log("L:", lStart, lEnd);
console.log("T:", tStart, tEnd);

// Lets verify lengths
console.log("P text:");
console.log(lines.slice(pStart, pEnd + 1).join('\n'));

console.log("L text:");
console.log(lines.slice(lStart, lEnd + 1).join('\n'));

console.log("T text:");
console.log(lines.slice(tStart, tEnd + 1).join('\n'));
