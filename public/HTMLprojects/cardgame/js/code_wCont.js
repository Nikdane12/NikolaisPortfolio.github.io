import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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
const aspect = window.innerWidth / window.innerHeight;
const viewSize = 3; 

const left = -viewSize * aspect / 2;
const right = viewSize * aspect / 2;
const top = viewSize / 2;
const bottom = -viewSize / 2;

const camera = new THREE.OrthographicCamera(left, right, top, bottom, 0.1, 500);
const controls = new OrbitControls( camera, renderer.domElement );
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
    constructor(posx = 0, posy = 0, width = 5, height = 5, type = "horizontal") {
        if (!typesOfContainer.includes(type)) {
            throw new Error(`Invalid container type: ${type}. Must be one of: ${typesOfContainer.join(", ")}`);
        }
        this.posx = posx;
        this.posy = posy;
        this.height = height;
        this.width = width;
        this.type = type;
        this.cards = {}; // Store cards by ID
    }

    addCard(card) {
        if (!this.cards[card.id]) {
            this.cards[card.id] = card;
            this.updateCardPositions(); // Update positions when a new card is added
        } else {
            console.warn(`Card with ID ${card.id} is already in the container.`);
        }
    }

    removeCard(cardId) {
        if (this.cards[cardId]) {
            delete this.cards[cardId];
            this.updateCardPositions(); // Update positions when a card is removed
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

    updateCardPositions() {
        const cardArray = this.listCards();
        const count = cardArray.length;

        if (count === 0) return; // No cards to position

        if (this.type === "horizontal") {
            const spacing = this.width / count; // Horizontal spacing
            const cardWidth = spacing * 0.8; // Ensure cards have padding
            const zStep = 0.1; // Offset for the Z-axis

            cardArray.forEach((card, index) => {
                const centerOffset = -this.width / 2; // Center the distribution
                card.model.position.set(
                    this.posx + centerOffset + index * spacing + cardWidth / 2, // X position
                    this.posy, // Y position
                    index * zStep // Z position
                );
            });
        } else if (this.type === "vertical") {
            const spacing = this.height / count; // Vertical spacing
            const cardHeight = spacing * 0.8; // Ensure cards have padding
            const zStep = -0.01; // Offset for the Z-axis (stacking)

            cardArray.forEach((card, index) => {
                const centerOffset = -this.height / 2; // Center the distribution
                card.model.position.set(
                    this.posx, // X position
                    this.posy + centerOffset + index * spacing + cardHeight / 2, // Y position
                    index * zStep // Z position (topmost card under the next)
                );
                card.model.rotation.x = Math.PI / 2; // Lay cards flat for vertical arrangement
            });
        }
    }

    render(scene) {
        Object.values(this.cards).forEach((card) => {
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

class Card {
    static idCounter = 0; 

    constructor(texture, scene, baseModel) {
        if (!baseModel) {
            throw new Error("Base card model not loaded yet.");
        }

        this.id = Card.idCounter++; 
        this.texture = texture;
        this.scene = scene;

        this.model = baseModel.clone();

        this.model.traverse((child) => {
            if (child.isMesh) {
                child.material = child.material.clone();
                child.material.map = texture;
                child.material.map.needsUpdate = true;
            }
        });

        this.animation = this.createTiltingModel();
    }

    createTiltingModel(options = {}) {
        const {
            pos = [0, 0, 0],
            tiltLimit = Math.PI / 32,
            tiltSpeed = 0.05,
        } = options;

        this.model.position.set(pos[0], pos[1], pos[2]);
        this.scene.add(this.model);

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let mouseIntersected = false;

        let initialRotation = new THREE.Euler();
        initialRotation.copy(this.model.rotation);

        const animateTilt = () => {
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(this.model, true);
            const topIntersect = intersects[0];

            if (topIntersect && mouseIntersected) {
                const point = topIntersect.point;

                const localPoint = this.model.worldToLocal(point.clone());

                const boundingBox = new THREE.Box3().setFromObject(this.model);
                const size = new THREE.Vector3();
                boundingBox.getSize(size);

                const normalizedX = localPoint.x / (size.x / 2);
                const normalizedY = localPoint.y / (size.y / 2);

                const tiltX = -tiltLimit * normalizedY;
                const tiltZ = -tiltLimit * normalizedX;

                this.model.rotation.x += (tiltX - initialRotation.x) * tiltSpeed;
                this.model.rotation.z += (tiltZ - initialRotation.z) * tiltSpeed;
            } else {
                this.model.rotation.x += (initialRotation.x - this.model.rotation.x) * tiltSpeed;
                this.model.rotation.z += (initialRotation.z - this.model.rotation.z) * tiltSpeed;
            }

            this.model.rotation.x = Math.max(-tiltLimit, Math.min(tiltLimit, this.model.rotation.x));
            this.model.rotation.z = Math.max(-tiltLimit, Math.min(tiltLimit, this.model.rotation.z));
        };

        const onMouseMove = (event) => {
            mouseIntersected = true;
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener("mousemove", onMouseMove);

        return animateTilt;
    }
}

loader.load(model, (gltf) => {
    baseCardModel = gltf.scene.children[0];

    baseCardModel.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshBasicMaterial({
                alphaMap: blankTexture,
                transparent: true,
                opacity: 1,
            });
        }
    });

    // Create a container
    const container1 = new Container(0, 0, 3, 2, "horizontal");

    // Create cards using the `Card` class
    const billCard = new Card(billTexture, scene, baseCardModel);
    const amongusCard = new Card(amongusTexture, scene, baseCardModel);
    const boscoCard = new Card(boscoTexture, scene, baseCardModel);
    const vaultboyCard = new Card(vaultboyTexture, scene, baseCardModel);


    // Add the cards to the container
    container1.addCard(billCard);
    container1.addCard(amongusCard);
    container1.addCard(boscoCard);
    container1.addCard(vaultboyCard);

    console.log(container1);
    

    // Render the container (adds all card models to the scene)
    container1.render(scene);

    // Add the card animations to the main loop
    tiltingAnimations.push(billCard.animation);
    tiltingAnimations.push(amongusCard.animation);
    tiltingAnimations.push(boscoCard.animation);
    tiltingAnimations.push(vaultboyCard.animation);
});

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

