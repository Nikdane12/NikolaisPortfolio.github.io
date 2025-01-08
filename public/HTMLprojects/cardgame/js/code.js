import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import * as dat from 'three/addons/libs/lil-gui.module.min.js';
// import WebGL from 'three/addons/capabilities/WebGL.js';

import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";

import { LoadGLTFByPath } from '/HTMLprojects/cardgame/js/ModelHelper.js'
import { checkRayIntersections, getMouseVector2 } from '/HTMLprojects/cardgame/js/RayCastHelper.js'
import { getOutlineEffect, configureOutlineEffectSettings_Default, addOutlinesBasedOnIntersections } from '/HTMLprojects/cardgame/js/OutlineHelper.js';

const renderer = new THREE.WebGLRenderer({ antialias: false }); 
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(1); 

document.body.appendChild( renderer.domElement ); 
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 500 ); 
// const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 0, 5 ); 
camera.lookAt( 0, 0, 0 ); 
const scene = new THREE.Scene();

const loader = new GLTFLoader();
const model = "./cardgame/blankcard.glb";

const basicMat = new THREE.MeshStandardMaterial();


const textureLoader = new THREE.TextureLoader();

const antialiasTexture = (imageSource) => {
    const colorTexture = textureLoader.load(imageSource, (tex) => {
        tex.minFilter = THREE.NearestFilter;
        tex.magFilter = THREE.NearestFilter;
        tex.anisotropy = 1;
        tex.wrapS = THREE.RepeatWrapping;
        tex.repeat.x = - 1;
    });    
    return colorTexture
}

const imgpath = "/HTMLprojects/cardgame/img/"

const database = {
    avalibleTypes: ["_full_color", "_color"],
    cardLibrary: [
        { name: "Bill Card", id: "bill", path: "billcard", avalibleTypes: ["_full_color", "_color"],},
        { name: "Amongus Card", id: "amongus", path: "amonguscard", avalibleTypes: ["_color"],},
        { name: "Bosco Card", id: "bosco", path: "boscocard", avalibleTypes: ["_full_color", "_color"],},
        { name: "Vault-boy Card", id: "vaultboy", path: "vaultboycard", avalibleTypes: ["_full_color", "_color"],},
        { name: "Blank Card", id: "blank", path: "blankcard", avalibleTypes: [],},
    ]
}

let preferredType = "_full_color"

function getTexture(cardId) {
    const card = database.cardLibrary.find(c => c.id === cardId);    
    if (!card) {
        console.error(`Card with ID "${cardId}" not found.`);
        return "";
    }

    if (preferredType && card.avalibleTypes.includes(preferredType)) {
        return antialiasTexture(`${imgpath}${card.path}${preferredType}.png`);
    }

    for (const type of database.avalibleTypes) {
        if (card.avalibleTypes.includes(type)) {
            return antialiasTexture(`${imgpath}${card.path}${type}.png`);
        }
    }
    return antialiasTexture(`${imgpath}${card.path}.png`);
}

const typesOfContainer = [
    "horizontal", "vertical", 
];

class Container {
    constructor(posx = 0, posy = 0, height = 5, width = 5, type = "horizontal") {
        if (!typesOfContainer.includes(type)) {
            throw new Error(`Invalid container type: ${type}. Must be one of: ${typesOfContainer.join(", ")}`);
        }
        this.posx = posx;
        this.posy = posy;
        this.height = height;
        this.width = width;
        this.type = type;
        this.cards = {}; // Use an object for fast lookup by ID
    }

    addCard(card) {
        if (!this.cards[card.id]) {
            this.cards[card.id] = card;
        } else {
            console.warn(`Card with ID ${card.id} is already in the container.`);
        }
    }

    removeCard(cardId) {
        if (this.cards[cardId]) {
            delete this.cards[cardId];
        } else {
            console.warn(`Card with ID ${cardId} not found in the container.`);
        }
    }

    clearCards() {
        this.cards = {};
    }

    listCards() {
        return Object.values(this.cards); // Return all card objects
    }

    render(scene) {
        Object.values(this.cards).forEach(card => {
            scene.add(card.model);
        });
    }
}



const billTexture = getTexture("bill");
const amongusTexture = getTexture("amongus");
const boscoTexture = getTexture("bosco");
const vaultboyTexture = getTexture("vaultboy");
const blankTexture = getTexture("blank");

// idle tilt
// sine = Mathf.Sin(Time.time + saved index)
// cosine = Mathf.Cos(Time.time + saved index)

const tiltingAnimations = [];
let baseCardModel;

loader.load(model, (gltf) => {
    baseCardModel = gltf.scene.children[0];

    baseCardModel.traverse(function (child) {
        if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({
                alphaMap: blankTexture,
                transparent: true,
                opacity: 1,
            });
        }
    });

    createCard(billTexture);
    createCard(amongusTexture);
    createCard(boscoTexture);
    createCard(vaultboyTexture)
});

let cardIdCounter = 0;

function createCard(texture) {
    if (!baseCardModel) {
        console.error("Base card model not loaded yet.");
        return;
    }

    const cardClone = baseCardModel.clone();
    const id = cardIdCounter++;

    cardClone.traverse(function (child) {
        if (child.isMesh) {
            child.material = child.material.clone();
            child.material.map = texture;
            child.material.map.needsUpdate = true;
        }
    });

    const card = {
        id,
        model: cardClone,
    };

    tiltingAnimations.push(createTiltingmodel(cardClone, {}));
    return card
}

function createTiltingmodel(model, options = {}) {
    
    const {
        pos = [0, 0, 0],
        tiltLimit = Math.PI / 32,
        tiltSpeed = 0.05,
    } = options;

    model.position.set(pos[0], pos[1], pos[2]);
    scene.add(model);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let mouseIntersected = false;

    let initialRotation = new THREE.Euler();  
    initialRotation.copy(model.rotation);

    function animateTilt() {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObject(model, true);

        if (intersects.length > 0 && mouseIntersected) {
            const point = intersects[0].point;

            const localPoint = model.worldToLocal(point.clone());

            const boundingBox = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            boundingBox.getSize(size);

            const normalizedX = localPoint.x / (size.x / 2); 
            const normalizedY = localPoint.y / (size.y / 2); 

            const tiltX = -tiltLimit * normalizedY; // tilt X-axis
            const tiltZ = -tiltLimit * normalizedX;  // tilt Z-axis

            model.rotation.x += (tiltX - initialRotation.x) * tiltSpeed;
            model.rotation.z += (tiltZ - initialRotation.z) * tiltSpeed;
        } else {
            model.rotation.x += (initialRotation.x - model.rotation.x) * tiltSpeed;
            model.rotation.z += (initialRotation.z - model.rotation.z) * tiltSpeed;
        }

        model.rotation.x = Math.max(-tiltLimit, Math.min(tiltLimit, model.rotation.x));
        model.rotation.z = Math.max(-tiltLimit, Math.min(tiltLimit, model.rotation.z));
    }
    
    function MouseTilt(event) {
        mouseIntersected = true;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener('mousemove', MouseTilt);
    return animateTilt;
}

let composer = new EffectComposer( renderer );
let mousePointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
raycaster.setFromCamera(mousePointer, camera);


const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

let outlinePass = getOutlineEffect(window, scene, camera);
configureOutlineEffectSettings_Default(outlinePass);
composer.addPass( outlinePass );

document.addEventListener('click', MouseOutline);

let prevHighlighted = null;
function MouseOutline(event) {
    
    mousePointer = getMouseVector2(event, window);

    const intersections = checkRayIntersections(mousePointer, camera, raycaster, scene);

    if(intersections.length < 1){return}
    if (intersections[0].object.uuid == prevHighlighted){
        outlinePass.selectedObjects = []
        prevHighlighted = null;
    } else{
        prevHighlighted = intersections[0].object.uuid;
        addOutlinesBasedOnIntersections(intersections, outlinePass);
    }
}

const container1 = new Container(10, 10, 15, 20, "horizontal");
container1.addCard(billCard);
container1.addCard(amongusCard);

container1.render(scene);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (composer) {
        composer.setSize(window.innerWidth, window.innerHeight);
    }
}

window.addEventListener('resize', onWindowResize);

function animate() {
    requestAnimationFrame(animate);
    tiltingAnimations.forEach((animateTilt) => animateTilt());
    renderer.render(scene, camera);
    composer.render();
}
animate();

// if ( WebGL.isWebGL2Available() ) {

// 	animate();

// } else {

// 	const warning = WebGL.getWebGL2ErrorMessage();
// 	document.getElementById( 'container' ).appendChild( warning );

// }

