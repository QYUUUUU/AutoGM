import * as THREE from 'three';
import * as CANNON from 'cannon';
import { OrbitControls } from 'OrbitControls';
import Stats from 'stats';
import { DiceManager, DiceD4, DiceD6, DiceD8, DiceD10, DiceD12, DiceD20 } from 'threejs-dice';

// --- D4 Math Topology Fix ---
DiceD4.prototype.shiftUpperValue = function(t){
    if (this.values === 4) {
        let n = this.getUpsideValue();
        let u=0; if(n===1)u=0; if(n===2)u=3; if(n===3)u=2; if(n===4)u=1;
        let c = ['1','2','3','4'];
        let ts = t.toString();
        let s = c.indexOf(ts);
        c[s] = c[u];
        c[u] = ts;
        this.faceTexts = [[], ["0","0","0"], [c[3], c[1], c[2]], [c[0], c[2], c[1]], [c[3], c[0], c[1]], [c[0], c[3], c[2]]];
        this.object.material = this.getMaterials();
        return;
    }
};
// ----------------------------


function updateDiceInput(diceType, action) {
    const diceInput = document.getElementById("dice-input");
    let diceValue = diceInput.value;
    const diceRegex = new RegExp(`(\\d*)${diceType}`);
    let match = diceValue.match(diceRegex);

    if (action === 'add') {
        if (match) {
            let count = parseInt(match[1]) || 1;
            count++;
            diceValue = diceValue.replace(diceRegex, `${count}${diceType}`);
        } else {
            if (diceValue) {
                diceValue += `+1${diceType}`;
            } else {
                diceValue = `1${diceType}`;
            }
        }
    } else if (action === 'remove') {
        if (match) {
            let count = parseInt(match[1]) || 1;
            if (count > 1) {
                count--;
                diceValue = diceValue.replace(diceRegex, `${count}${diceType}`);
            } else {
                diceValue = diceValue.replace(`1${diceType}`, '');
                diceValue = diceValue.replace(`+${diceType}`, '');
            }
        }
    }

    diceValue = diceValue.replace(/^\+|\+$/g, '');
    diceValue = diceValue.replace(/\+\+/g, '+');
    diceInput.value = diceValue;
}



function parseDiceInput() {
    const diceInput = document.getElementById("dice-input").value;
    const diceArray = diceInput.split('+');
    const diceCounts = {};

    diceArray.forEach(dice => {
        const match = dice.match(/(\d*)(d\d+)/);
        if (match) {
            const count = parseInt(match[1]) || 1;
            const type = match[2];
            diceCounts[type] = (diceCounts[type] || 0) + count;
        }
    });

    return diceCounts;
}

const throwDiceTrigger = document.getElementById("dice-throw-trigger");
throwDiceTrigger.addEventListener("click", () => {
    const diceCounts = parseDiceInput();
    randomDiceThrow(diceCounts); // Appeler votre fonction avec l'objet diceCounts
});


let container, scene, camera, renderer, controls, stats, world, dice = [];
let clearDiceTimeoutId = null;

initWorld();

function initWorld() {
    // SCENE
    scene = new THREE.Scene();

    //Container
    container = document.getElementById('ThreeJS');


    // CAMERA
    var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 20, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.01, FAR = 20000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0, 50, 0);
    camera.lookAt(0, 0, 0);
    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.domElement.style.pointerEvents = "none";
    renderer.setClearColor(0x000000, 0); // the default
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // CONTROLS
    // Controls disabled to prevent interaction
    // // Controls disabled to prevent interaction
    // controls = new OrbitControls(camera, renderer.domElement);
    // STATS
    stats = new Stats();

    let ambient = new THREE.AmbientLight('#ffffff', 0.5);
    scene.add(ambient);

    let directionalLight = new THREE.DirectionalLight('#ffffff', 0.5);
    directionalLight.position.x = -1000;
    directionalLight.position.y = 0;
    directionalLight.position.z = 1000;
    scene.add(directionalLight);

    let light = new THREE.SpotLight(0xefdfd5, 0.5);
    light.position.y = 100;
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.camera.near = 50;
    light.shadow.camera.far = 110;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    scene.add(light);


    // Floor removed

    // CUSTOM //
    ////////////
    world = new CANNON.World();

    world.gravity.set(0, -9.82 * 30, 0);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 16;
    DiceManager.setWorld(world);

    //Floor
    let floorBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: DiceManager.floorBodyMaterial });
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.add(floorBody);

    // Walls to keep dice inside the view
    let wallThickness = 2;
    let wallHeight = 20;

    // Top wall (z = -10)
    let wallTop = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(50, wallHeight, wallThickness)), material: DiceManager.floorBodyMaterial });
    wallTop.position.set(0, wallHeight, -12);
    world.add(wallTop);

    // Bottom wall (z = 10)
    let wallBottom = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(50, wallHeight, wallThickness)), material: DiceManager.floorBodyMaterial });
    wallBottom.position.set(0, wallHeight, 12);
    world.add(wallBottom);

    // Left wall (x = -20)
    let wallLeft = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(wallThickness, wallHeight, 50)), material: DiceManager.floorBodyMaterial });
    wallLeft.position.set(-20, wallHeight, 0);
    world.add(wallLeft);

    // Right wall (x = 20)
    let wallRight = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(wallThickness, wallHeight, 50)), material: DiceManager.floorBodyMaterial });
    wallRight.position.set(20, wallHeight, 0);
    world.add(wallRight);


    function onWindowResize() {
        var SCREEN_WIDTH = window.innerWidth;
        var SCREEN_HEIGHT = window.innerHeight;
        var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setPixelRatio(window.devicePixelRatio);
    }

    window.addEventListener('resize', onWindowResize, false);

    requestAnimationFrame(animate);
}

export function randomDiceThrow(diceCounts, relances = 0, caracteristic = null, competence = null, thrownByAI = false) {

    // Clear any pending disappearing timer
    if (clearDiceTimeoutId !== null) {
        clearTimeout(clearDiceTimeoutId);
        clearDiceTimeoutId = null;
    }

    // Prevent 'Cannot start another throw' error if spammed or if bodies were removed
    DiceManager.throwRunning = false;

    // Vider tous les dés de la scène
    dice.forEach(die => {
        scene.remove(die.getObject());
        if (die.getObject().body) {
            world.remove(die.getObject().body);
        }
    });

    dice = [];



    // Add dice to the scene
    let fakeDiceValues = [];
    for (let [type, numberThrow] of Object.entries(diceCounts)) {
        let faces = parseInt(type.substring(1));
        let isFake = ![4, 6, 8, 10, 12, 20].includes(faces);

        for (let i = 0; i < numberThrow; i++) {
            if (isFake) {
                let value = Math.floor(Math.random() * faces) + 1;
                fakeDiceValues.push({ dice: { values: faces }, value: value });
            } else {
                let die = createDice(type, 0.8, "#2d2d2d", "#f0f0f0");
                scene.add(die.getObject());
                dice.push(die);
            }
        }
    }

    var diceValues = [];
    var trimmedValues = [];
    for (var i = 0; i < dice.length; i++) {
        let yRand = Math.random() * 20;
        dice[i].getObject().position.x = (Math.random() - 0.5) * 10;
        dice[i].getObject().position.y = 15 + Math.random() * 10;
        dice[i].getObject().position.z = (Math.random() - 0.5) * 10;
        dice[i].getObject().quaternion.x = (Math.random() * 90 - 45) * Math.PI / 180;
        dice[i].getObject().quaternion.z = (Math.random() * 90 - 45) * Math.PI / 180;
        dice[i].updateBodyFromMesh();
        let rand = Math.random() * 5;
        // Keep them from flying linearly sideways
        dice[i].getObject().body.velocity.set((Math.random() - 0.5) * 10, 10 + yRand, (Math.random() - 0.5) * 10);
        dice[i].getObject().body.angularVelocity.set(20 * Math.random() - 10, 20 * Math.random() - 10, 20 * Math.random() - 10);

        let value = Math.floor(Math.random() * dice[i].values) + 1; // generate a random integer between 1 and 10

        trimmedValues.push({ dice: dice[i].constructor.name, value: value });
        diceValues.push({ dice: dice[i], value: value });
    }

    const allShareValues = diceValues.concat(fakeDiceValues);
    shareThrow(allShareValues, relances, caracteristic, competence, thrownByAI);
    
    if (diceValues.length > 0) {
        DiceManager.prepareValues(diceValues);
    } else {
        DiceManager.throwRunning = false;
    }

    // Make dice disappear after 8 seconds
    clearDiceTimeoutId = setTimeout(() => {
        dice.forEach(die => {
            scene.remove(die.getObject());
            if (die.getObject().body) {
                world.remove(die.getObject().body);
            }
        });
        dice = [];
        DiceManager.throwRunning = false;
        clearDiceTimeoutId = null;
    }, 8000);
}


function animate() {
    updatePhysics();
    render();
    update();

    requestAnimationFrame(animate);

}

function updatePhysics() {
    world.step(1.0 / 60.0);

    for (var i in dice) {
        dice[i].updateMeshFromBody();
    }
}

function update() {
    // // controls.update();
    stats.update();
}

function render() {
    renderer.render(scene, camera);
}

// Placeholder function for creating dice of different types
function createDice(type, size, backColor, fontColor) {
    switch (type) {
        case 'd4':
            let dieD4 = new DiceD4({ size: size, backColor: backColor, fontColor: fontColor });
            dieD4.faceTexts = [[], ["0","0","0"], ["4","2","3"], ["1","3","2"], ["4","1","2"], ["1","4","3"]];
            dieD4.object.material = dieD4.getMaterials();
            return dieD4;
        case 'd6':
            return new DiceD6({ size: size, backColor: backColor, fontColor: fontColor });
        case 'd8':
            return new DiceD8({ size: size, backColor: backColor, fontColor: fontColor });
        case 'd10':
            return new DiceD10({ size: size, backColor: backColor, fontColor: fontColor });
        case 'd12':
            return new DiceD12({ size: size, backColor: backColor, fontColor: fontColor });
        case 'd20':
            return new DiceD20({ size: size, backColor: backColor, fontColor: fontColor });
        default:
            throw new Error('Unknown dice type ' + type);
    }
}


function shareThrow(dices, relances = 0, caracteristic = null, competence = null, thrownByAI = false) {

    dices.forEach(item => {



    });
    const result = dices.map(item => ({
        value: item.dice.values,
        values: item.value
    }));



    const url = '/share/throw';

    // Updated payload to be sent in the request body
    const data = {
        result,
        relances,
        caracteristic,
        competence,
        thrownByAI
    };
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Convert data to JSON string
    })
        .then(response => {
            if (response.ok) {

            } else {
                console.error(response.status, response.statusText);
            }
        })
        .catch(error => {
            console.error(error);
        });
}

window.updateDiceInput = updateDiceInput;

window.randomDiceThrow = randomDiceThrow;

