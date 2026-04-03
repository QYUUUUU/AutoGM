const fs = require('fs');
const filepath = 'app/views/index.html.twig';
const content = fs.readFileSync(filepath, 'utf8');
const lines = content.split('\n');

// P: indices 25 to 58
// L: indices 59 to 91
// Line 93 is empty: index 92
// T: indices 93 to 155
// Total span to replace: 25 to 155 (131 elements).

let pBlock = lines.slice(25, 59);
let lBlock = lines.slice(59, 92);
let tBlock = lines.slice(93, 156);

// Classes (T becomes top, P becomes bottom)
tBlock[0] = tBlock[0].replace('class="options-section mb-3"', 'class="options-section mb-4 pb-3 border-bottom"');
pBlock[0] = pBlock[0].replace('class="options-section mb-4 pb-3 border-bottom"', 'class="options-section mb-3"');

// Concatenate
const newMiddle = [
    ...tBlock,
    '',
    ...lBlock,
    '',
    ...pBlock
];

lines.splice(25, 131, ...newMiddle);

fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
console.log('Perfect swap done.');
