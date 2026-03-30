const fs = require('fs');
const fileContent = fs.readFileSync('app/public/js/newcharacter.js', 'utf8');

const regexInstinct = /const instinctDescriptions = \{[\s\S]*?^};\n/m;
const regexAstro = /const signeastroDescriptions = \{[\s\S]*?^};\n/m;
const regexOrigine = /const origin[e]?Descriptions = \{[\s\S]*?^};\n/m;

const m1 = fileContent.match(regexInstinct);
const m2 = fileContent.match(regexAstro);
const m3 = fileContent.match(regexOrigine);

let out = "";
if(m1) out += m1[0] + "\n";
if(m2) out += m2[0] + "\n";
if(m3) out += m3[0] + "\n";

fs.writeFileSync('app/public/js/character_data.js', out);
console.log('Descriptions extracted to character_data.js. Length:', out.length);
