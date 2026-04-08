const fs = require('fs');
let code = fs.readFileSync('app/public/js/dashboardDies.js', 'utf8');

// 1. Feature 3: Select color
code = code.replace(
    'let fakeDiceValues = [];',
    `const colorInput = document.getElementById('dice-color-picker');
    const color = colorInput ? colorInput.value : "#2d2d2d";
    let fakeDiceValues = [];`
);

code = code.replace(
    'let die = createDice(type, 0.8, "#2d2d2d", "#f0f0f0");',
    'let die = createDice(type, 0.8, color, "#f0f0f0");'
);

// 2. Feature 1 & 2: wait for rolling, share local metadata
code = code.replace(
    'const allShareValues = diceValues.concat(fakeDiceValues);\n    shareThrow(allShareValues, relances, caracteristic, competence, thrownByAI);',
   `const allShareValues = diceValues.concat(fakeDiceValues);
    
    const localThrowId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    window.myRollIds = window.myRollIds || [];
    window.myRollIds.push(localThrowId);
    
    setTimeout(() => {
        shareThrow(allShareValues, relances, caracteristic, competence, thrownByAI, color, localThrowId);
    }, 2500);`
);

let shareThrowBody = `function shareThrow(dices, relances = 0, caracteristic = null, competence = null, thrownByAI = false, color = "#2d2d2d", localThrowId = null) {`;
code = code.replace(
    `function shareThrow(dices, relances = 0, caracteristic = null, competence = null
, thrownByAI = false) {`,
    shareThrowBody
);
code = code.replace(
    `function shareThrow(dices, relances = 0, caracteristic = null, competence = null, thrownByAI = false) {`,
    shareThrowBody
);


fs.writeFileSync('app/public/js/dashboardDies.js', code);
