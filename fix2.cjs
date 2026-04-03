const fs = require('fs');
const filepath = 'app/views/index.html.twig';
const content = fs.readFileSync(filepath, 'utf8');
const lines = content.split('\n');

// Arrays. Line N is index N-1.
// P: 26 to 59 = indices 25 to 58. Slice(25, 59).
let pBlock = lines.slice(25, 59);

// L: 60 to 92 = indices 59 to 91. Slice(59, 92).
let lBlock = lines.slice(59, 92);

// T: 94 to 156 = indices 93 to 155. Slice(93, 156).
let tBlock = lines.slice(93, 156);

// Update classes
tBlock[0] = tBlock[0].replace('class="options-section mb-3"', 'class="options-section mb-4 pb-3 border-bottom"');
pBlock[0] = pBlock[0].replace('class="options-section mb-4 pb-3 border-bottom"', 'class="options-section mb-3"');

// Assemble the middle part
const newMiddle = [
    ...tBlock,
    '',
    ...lBlock,
    '',
    ...pBlock
];

// In the original, lines 26 to 156 corresponds to indices 25 to 155.
// So we remove exactly (156 - 26 + 1) = 131 elements starting at index 25.
lines.splice(25, 131, ...newMiddle);

fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
console.log('Swap 2 complete.');
