const fs = require('fs');
const content = fs.readFileSync('app/views/index.html.twig', 'utf-8');
const lines = content.split('\n');

let openDivs = 0;
let target = false;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('id="myTabContent"')) {
        target = true;
    }
    if (target) {
        let opens = (lines[i].match(/<div\b[^>]*>/g) || []).length;
        let closes = (lines[i].match(/<\/div>/g) || []).length;
        openDivs += opens - closes;
        
        if (lines[i].includes('<!-- tab rituels -->')) console.log("Before tab rituels, open divs:", openDivs);
        if (lines[i].includes('<!-- tab groupe -->')) console.log("Before tab groupe, open divs:", openDivs);
    }
    if (openDivs === 0 && target) {
        console.log("myTabContent closed at line", i+1);
        break;
    }
}
