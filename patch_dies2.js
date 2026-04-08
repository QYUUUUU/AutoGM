const fs = require('fs');
let code = fs.readFileSync('app/public/js/dashboardDies.js', 'utf8');

code = code.replace(
    'const data = {\n        result,\n        relances,\n        caracteristic,\n        competence,\n        thrownByAI\n    };',
    'const data = {\n        result,\n        relances,\n        caracteristic,\n        competence,\n        thrownByAI,\n        color,\n        localThrowId\n    };'
);

// We define animateRemoteRoll to receive incoming throws without sharing it
let animateRemoteRoll = `
window.animateRemoteRoll = function(diceResults, color) {
    if (clearDiceTimeoutId !== null) {
        clearTimeout(clearDiceTimeoutId);
        clearDiceTimeoutId = null;
    }
    DiceManager.throwRunning = false;
    dice.forEach(die => {
        scene.remove(die.getObject());
        if (die.getObject().body) {
            world.remove(die.getObject().body);
        }
    });
    dice = [];

    var diceValues = [];
    diceResults.forEach(item => {
        let isFake = ![4, 6, 8, 10, 12, 20].includes(item.values);
        if(!isFake) {
            let die = createDice("d" + item.values, 0.8, color, "#f0f0f0");
            scene.add(die.getObject());
            dice.push(die);
            diceValues.push({ dice: die, value: item.value });
        }
    });
    
    for (var i = 0; i < dice.length; i++) {
        let yRand = Math.random() * 20;
        dice[i].getObject().position.x = (Math.random() - 0.5) * 10;
        dice[i].getObject().position.y = 15 + Math.random() * 10;
        dice[i].getObject().position.z = (Math.random() - 0.5) * 10;
        dice[i].getObject().quaternion.x = (Math.random() * 90 - 45) * Math.PI / 180;
        dice[i].getObject().quaternion.z = (Math.random() * 90 - 45) * Math.PI / 180;
        dice[i].updateBodyFromMesh();
        dice[i].getObject().body.velocity.set((Math.random() - 0.5) * 10, 10 + yRand, (Math.random() - 0.5) * 10);
        dice[i].getObject().body.angularVelocity.set(20 * Math.random() - 10, 20 * Math.random() - 10, 20 * Math.random() - 10);
    }
    
    if (diceValues.length > 0) {
        DiceManager.prepareValues(diceValues);
    } else {
        DiceManager.throwRunning = false;
    }
    
    clearDiceTimeoutId = setTimeout(() => {
        dice.forEach(die => {
            scene.remove(die.getObject());
            if (die.getObject().body) { world.remove(die.getObject().body); }
        });
        dice = [];
        DiceManager.throwRunning = false;
        clearDiceTimeoutId = null;
    }, 8000);
};
`;

code += "\n" + animateRemoteRoll;

fs.writeFileSync('app/public/js/dashboardDies.js', code);
