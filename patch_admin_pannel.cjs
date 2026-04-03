const fs = require('fs');
let code = fs.readFileSync('app/controllers/adminController.js', 'utf8');

// Find where equipment is loaded and add adversaries
if(!code.includes('let adversaries = [];')) {
    code = code.replace('let equipment = [];', 'let equipment = [];\n      let adversaries = [];');
    code = code.replace('equipment = JSON.parse(fs.readFileSync(eqPath, "utf8"));\n          }', 'equipment = JSON.parse(fs.readFileSync(eqPath, "utf8"));\n          }\n          adversaries = await prisma.adversary.findMany();');
    code = code.replace('{ worldState, groupes, activeGroupeId, characters, equipment }', '{ worldState, groupes, activeGroupeId, characters, equipment, adversaries }');
    fs.writeFileSync('app/controllers/adminController.js', code);
    console.log("Patched displayPannel to include adversaries");
}

