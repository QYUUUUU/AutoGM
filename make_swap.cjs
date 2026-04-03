const fs = require('fs');
const filepath = 'app/views/index.html.twig';
const content = fs.readFileSync(filepath, 'utf8');
const lines = content.split('\n');

// Arrays
let pBlock = lines.slice(25, 59); // length 34
let lBlock = lines.slice(59, 92); // length 33
let tBlock = lines.slice(93, 155); // length 62. (Line 94 is index 93, Line 155 is index 154)

// Update classes
tBlock[0] = tBlock[0].replace('class="options-section mb-3"', 'class="options-section mb-4 pb-3 border-bottom"');
pBlock[0] = pBlock[0].replace('class="options-section mb-4 pb-3 border-bottom"', 'class="options-section mb-3"');

// Close T block properly
tBlock.push('                    </div>');

// Assemble the middle part
const newMiddle = [
    ...tBlock,
    '',
    ...lBlock,
    '',
    ...pBlock
];

// Replace inside lines: 25 to 130 removed
lines.splice(25, 130, ...newMiddle); 

fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
console.log('Swap complete.');
