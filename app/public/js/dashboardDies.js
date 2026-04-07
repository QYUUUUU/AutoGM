/**
 * @fileoverview dashboardDies.js
 * @description Frontend module controlling the 3D physics rendering and logic of dice throws using Three.js and Cannon.js.
 */
import * as THREE from 'three';
import * as CANNON from 'cannon';
import { OrbitControls } from 'OrbitControls';
import Stats from 'stats';
import { DiceManager, DiceD4, DiceD6, DiceD8, DiceD10, DiceD12, DiceD20 } from 'threejs-dice';

/**
 * @description Monkey patch for `DiceD4` from `threejs-dice` lib to correct the D4 upward reading logic/topology.
 */
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

/**
 * @function updateDiceInput
 * @description Modifies the raw input string representing the dice to roll (e.g. `1d10+2d6`) according to UI interaction (`+` or `-` buttons).
 * Features:
 * - Uses regex interpolation to increment or decrement the count of a specific die type (e.g., parsing `(\d*)${diceType}`).
 * - Adds a new die type with a default count of 1 if it wasn't in the input string previously upon `add`.
 * - Cleans up dangling `+` artifacts when decremented to 0.
 * 
 * @param {string} diceType - The type of dice formatted as "d<N>" (d4, d6, etc).
 * @param {string} action - 'add' or 'remove' modifying intention.
 */
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



/**
 * @function parseDiceInput
 * @description Extracts and catalogs discrete numbers of dice to throw from a raw string format input (`+` separated).
 * 
 * @returns {Object} JSON dictionary of counts, e.g. `{"d10": 2, "d8": 1}`.
 */
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
/**
 * @event 'click' on throwDiceTrigger
 * @description Manual trigger for parsing user's basic input string and rolling the resulting dice immediately.
 */
throwDiceTrigger.addEventListener("click", () => {
    const diceCounts = parseDiceInput();
    randomDiceThrow(diceCounts); // Appeler votre fonction avec l'objet diceCounts
});


let container, scene, camera, renderer, controls, stats, world, dice = [];
let clearDiceTimeoutId = null;

initWorld();

/**
 * @function initWorld
 * @description Bootstraps the complete Three.js and Cannon.js canvas rendering and physics engine for the 3D dice.
 * Features:
 * - Scoped locally to `#ThreeJS` container appending the `WebGLRenderer`.
 * - Enables responsive camera metrics based on `window.innerWidth`.
 * - Injects transparent scene (`setClearColor(0, 0)`).
 * - Maps Lights (`AmbientLight`, `DirectionalLight`, and soft shadow mapping).
 * - Instantiates Cannon `CANNON.World` physics parameters (gravity `y=294.6`).
 * - Defines invisible collision walls (`CANNON.Plane` and `CANNON.Box`) acting as a cage preventing dice from flying off-screen.
 * - Handles `onWindowResize` event updates recursively.
 * - Loops into requestAnimationFrame -> `animate`.
 */
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

/**
 * @function randomDiceThrow
 * @description Central execution method handling mathematical creation, physical spawning, and 3D visual resolution of varying dice types.
 * Features:
 * - Cleans prior un-resolved physics intervals (`clearDiceTimeoutId`).
 * - Prevents thread overlap locking via `DiceManager.throwRunning`.
 * - Wipes the complete scene and physics meshes (`world.remove()`) making way.
 * - Extracts `fakeDiceValues` math independently if the dice provided isn't visually mapped (e.g. `d3` instead of d4,d6,d8...).
 * - Populates physics instances in `world` using custom constructors like `createDice()`.
 * - Injects chaotic starting momentum (Angular & Linear `velocity` logic on XYZ coordinates).
 * - Fires `shareThrow` callback asynchronously to persist rolled numbers immediately for the SSE stream logic.
 * - Enforces an 8-second cleanup cycle removing objects memory post-roll.
 * 
 * @param {Object} diceCounts - Dictionary of requested type and quantites (i.e. `{"d10": 2}`).
 * @param {Number} [relances=0] - Reroll metric supplied by backend logic (passed transparently to sharing logic).
 * @param {String|null} caracteristic - Descriptive string identifier.
 * @param {String|null} competence - Descriptive string identifier.
 * @param {Boolean} [thrownByAI=false] - Flag differentiating if the player clicked it, or the AI triggered the roll remotely.
 */
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
    const colorInput = document.getElementById('dice-color-picker');
    const color = colorInput ? colorInput.value : "#2d2d2d";
    let fakeDiceValues = [];
    for (let [type, numberThrow] of Object.entries(diceCounts)) {
        let faces = parseInt(type.substring(1));
        let isFake = ![4, 6, 8, 10, 12, 20].includes(faces);

        for (let i = 0; i < numberThrow; i++) {
            if (isFake) {
                let value = Math.floor(Math.random() * faces) + 1;
                fakeDiceValues.push({ dice: { values: faces }, value: value });
            } else {
                let die = createDice(type, 0.8, color, "#f0f0f0");
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
    
    // We wait exactly 4 seconds (visual dice usually take 2 to 3.5s to stably bounce) before confirming the results to the chat
    const localThrowId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    window.myRollIds = window.myRollIds || [];
    window.myRollIds.push(localThrowId);

    setTimeout(() => {
        shareThrow(allShareValues, relances, caracteristic, competence, thrownByAI, color, localThrowId);
    }, 3000);
    
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


/**
 * @function animate
 * @description The recurrent engine cycle orchestrating graphics and mechanics processing (`requestAnimationFrame`).
 */
function animate() {
    updatePhysics();
    render();
    update();

    requestAnimationFrame(animate);

}

/**
 * @function updatePhysics
 * @description Tells the Cannon backend engine algorithm to move one fixed step (60Hz) forward, adjusting meshes per their body state.
 */
function updatePhysics() {
    world.step(1.0 / 60.0);

    for (var i in dice) {
        dice[i].updateMeshFromBody();
    }
}

/**
 * @function update
 * @description Refreshes performance/system metadata display interface wrapper plugin.
 */
function update() {
    // // controls.update();
    stats.update();
}

/**
 * @function render
 * @description Injects the 3D graphics pipeline output from Three.js onto screen matrix wrapper (Scene + Camera).
 */
function render() {
    renderer.render(scene, camera);
}

/**
 * @function createDice
 * @description Factory function returning instance wrapper objects natively required for physical interactions from the `threejs-dice` toolkit.
 * 
 * @param {string} type - Standard nomenclature string `dXX`.
 * @param {number} size - Object 3D scaling parameter base.
 * @param {string} backColor - Hexadecimal or color string of the internal material base.
 * @param {string} fontColor - Color of numerical glyphs wrapper on face textures.
 * @returns {Object} Polished and injected Object wrapper mesh tied physically to CANNON properties.
 */
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


/**
 * @function shareThrow
 * @description Forwards exact arrays of logical metadata from local random number generators upwards synchronously across WebSocket / SSE connections.
 * Features:
 * - Aggregates physical instances of dice into cleanly formatted data structures `{ value, values }`.
 * - Fires `fetch() PUT /share/throw`.
 * - Packages state parameters to allow rendering logic contextualization universally (`relances`, `caracteristic`, etc).
 * 
 * Wait for obsolete code confirmation: `dices.forEach(item => { });` is completely empty iteration overhead spanning Line 361. Please confirm if I can delete the blank iterator block.
 * 
 * @param {Array} dices - Formatted output mapped physically mapped dice outputs resolving random numerical outcomes.
 * @param {Number} [relances=0] - Rerolls
 * @param {String|null} caracteristic - Descriptors
 * @param {String|null} competence - Descriptors
 * @param {Boolean} [thrownByAI=false] - Identifying trigger source boolean 
 */
function shareThrow(dices, relances = 0, caracteristic = null, competence = null, thrownByAI = false, color = "#2d2d2d", localThrowId = null) {
    
    // [!] Wait for obsolete code confirmation: Empty iteration block
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
        thrownByAI,
        color,
        localThrowId
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

window.updateDiceInput = updateDiceInput;

window.randomDiceThrow = randomDiceThrow;

