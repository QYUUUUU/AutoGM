const fs = require('fs');

let lines = fs.readFileSync('app/views/index.html.twig', 'utf8').split('\n');

let pStart = 26, pEnd = 59;
let lStart = 60, lEnd = 92;
let tStart = 94, tEnd = 155;

let pLines = lines.slice(pStart, pEnd + 1);
let lLines = lines.slice(lStart, lEnd + 1);
let tLines = lines.slice(tStart, tEnd + 1);

// Step 1. Fix the missing closing div in tLines.
// Currently tLines ends with:
//                         <button id="stats-send" class="stats-send" type="button">Lancer les dés</button><br>
//                     </div>
tLines[tLines.length - 1] = tLines[tLines.length - 1] + '\n                    </div>'; // close the dice-statistics

// Step 2. Update CSS classes
// Since t is moving to the top, it needs "mb-4 pb-3 border-bottom"
// p is moving to bottom, it needs "mb-3" and no border bottom
for(let i=0; i<tLines.length; i++) {
    if(tLines[i].includes('class="options-section mb-3"')) {
        tLines[i] = tLines[i].replace('class="options-section mb-3"', 'class="options-section mb-4 pb-3 border-bottom"');
    }
}
for(let i=0; i<pLines.length; i++) {
    if(pLines[i].includes('class="options-section mb-4 pb-3 border-bottom"')) {
        pLines[i] = pLines[i].replace('class="options-section mb-4 pb-3 border-bottom"', 'class="options-section mb-3"');
    }
}

// Assemble the new body-card content
let newBlocks = [];
newBlocks.push(...tLines);
newBlocks.push('');
newBlocks.push(...lLines);
newBlocks.push('');
newBlocks.push(...pLines);

let newLines = [
    ...lines.slice(0, pStart),
    ...newBlocks,
    ...lines.slice(tEnd + 1) // wait, what about the empty line 93? 
];

fs.writeFileSync('app/views/index.html.twig', newLines.join('\n'));
console.log("Written!");
