import * as THREE from 'three';
import * as CANNON from 'cannon';
import { OrbitControls } from 'OrbitControls';
import Stats from 'stats';
import { DiceManager, DiceD4, DiceD6, DiceD10, DiceD20 } from 'threejs-dice';


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

initWorld();

function initWorld() {
    // SCENE
    scene = new THREE.Scene();

    //Container
    container = document.getElementById('ThreeJS');

    console.log(container.offsetWidth, container.offsetHeight);
    // CAMERA
    var SCREEN_WIDTH = container.offsetWidth, SCREEN_HEIGHT = container.offsetHeight;
    var VIEW_ANGLE = 20, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.01, FAR = 20000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(60, 60, -0);
    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // the default
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // CONTROLS
    controls = new OrbitControls(camera, renderer.domElement);
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


    var textureLoader = new THREE.TextureLoader();

    // Remplacez 'path/to/image.jpg' par le chemin de votre image
    textureLoader.load('images/floorArt.png', function (texture) {
        var floorMaterial = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
        var floorGeometry = new THREE.PlaneGeometry(50, 50, 10, 10);
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.receiveShadow = true;
        floor.rotation.x = Math.PI / 2;
        scene.add(floor);
    });

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

    function onWindowResize() {
        var SCREEN_WIDTH = container.offsetWidth;
        var SCREEN_HEIGHT = container.offsetHeight;
        var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    }

    window.addEventListener('resize', onWindowResize, false);

    requestAnimationFrame(animate);
}

export function randomDiceThrow(diceCounts, relances = 0) {

    // Vider tous les dés de la scène
    dice.forEach(die => {
        scene.remove(die.getObject());
        if (die.getObject().body) {
            world.remove(die.getObject().body);
        }
    });
    dice = [];

    console.log(diceCounts);

    // Add dice to the scene
    for (let [type, numberThrow] of Object.entries(diceCounts)) {
        for (let i = 0; i < numberThrow; i++) {
            let die = createDice(type, 1.5, "#ffffff");
            scene.add(die.getObject());
            dice.push(die);
        }
    }

    var diceValues = [];
    var trimmedValues = [];
    for (var i = 0; i < dice.length; i++) {
        let yRand = Math.random() * 20
        dice[i].getObject().position.x = -15 - (i % 3) * 1.5;
        dice[i].getObject().position.y = 2 + Math.floor(i / 3) * 1.5;
        dice[i].getObject().position.z = -15 + (i % 3) * 1.5;
        dice[i].getObject().quaternion.x = (Math.random() * 90 - 45) * Math.PI / 180;
        dice[i].getObject().quaternion.z = (Math.random() * 90 - 45) * Math.PI / 180;
        dice[i].updateBodyFromMesh();
        let rand = Math.random() * 5;
        dice[i].getObject().body.velocity.set(25 + rand, 40 + yRand, 15 + rand);
        dice[i].getObject().body.angularVelocity.set(20 * Math.random() - 10, 20 * Math.random() - 10, 20 * Math.random() - 10);

        let value = Math.floor(Math.random() * dice[i].values) + 1; // generate a random integer between 1 and 10

        trimmedValues.push({ dice: dice[i].constructor.name, value: value });
        diceValues.push({ dice: dice[i], value: value });
    }
    console.log(diceValues);
    shareThrow(diceValues, relances);
    DiceManager.prepareValues(diceValues);
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
    controls.update();
    stats.update();
}

function render() {
    renderer.render(scene, camera);
}

// Placeholder function for creating dice of different types
function createDice(type, size, backColor) {
    // Assume we have a Dice class for each type of die
    switch (type) {
        case 'd4':
            return new DiceD4({ size: size, backColor: backColor });
        case 'd6':
            return new DiceD6({ size: size, backColor: backColor });
        case 'd10':
            return new DiceD10({ size: size, backColor: backColor });
        case 'd20':
            return new DiceD20({ size: size, backColor: backColor });
        default:
            throw new Error('Unknown dice type');
    }
}


function shareThrow(dices, relances = 0) {

    dices.forEach(item => {
        console.log("am trying");
        console.log(item);
        console.log(item["dice"]["values"]);
    });
    const result = dices.map(item => ({
        value: item.dice.values,
        values: item.value
    }));

    console.log("result = ", result)

    const url = '/share/throw';

    // Updated payload to be sent in the request body
    const data = {
        result,
        relances
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
                console.log(response.json()); // Parse JSON response
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