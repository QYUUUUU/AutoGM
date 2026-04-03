const fs = require('fs');
const filepath = 'app/views/index.html.twig';
const content = fs.readFileSync(filepath, 'utf8');
const lines = content.split('\n');

const pBlock = lines.slice(26, 60); // length 34
const lBlock = lines.slice(60, 93); // length 33
const tBlock = lines.slice(94, 157); // length 63

tBlock[0] = tBlock[0].replace('class="options-section mb-3"', 'class="options-section mb-4 pb-3 border-bottom"');
pBlock[0] = pBlock[0].replace('class="options-section mb-4 pb-3 border-bottom"', 'class="options-section mb-3"');

if (pBlock[1].includes('Personnage') === false) throw Error("P Block doesn't start properly");
if (lBlock[1].includes('Lancer') === false) throw Error("L Block doesn't start properly");
if (tBlock[1].includes('Test') === false) throw Error("T Block doesn't start properly");

const newMiddle = [
    ...tBlock,
    '',
    ...lBlock,
    '',
    ...pBlock
];

lines.splice(26, 131, ...newMiddle);
fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
console.log('The perfect swap is complete.');
