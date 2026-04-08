const fs = require('fs');
let code = fs.readFileSync('app/public/js/dashboardDies.js', 'utf8');

let newShareThrow = `
window.myRollIds = window.myRollIds || [];

function shareThrow(dices, relances = 0, caracteristic = null, competence = null, thrownByAI = false, color = "#2d2d2d", localThrowId = null) {
    const result = dices.map(item => ({
        value: item.dice.values,
        values: item.value
    }));

    const url = '/share/throw';
    const data = {
        result,
        relances,
        caracteristic,
        competence,
        thrownByAI,
        color,
        localThrowId
    };
    
    fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).catch(console.error);
}`

code = code.replace(/function shareThrow\(dices, relances(?:.|\n)*?\}\)\n        \.catch\(error => \{\n            console\.error\(error\);\n        \}\);\n\}/m, newShareThrow);

fs.writeFileSync('app/public/js/dashboardDies.js', code);
