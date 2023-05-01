// import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { AsciiEffect } from 'three/addons/effects/AsciiEffect.js';
// const scene = new THREE.Scene()
// const textureLoader = new THREE.TextureLoader()
// const sizes = {
//     width: window.innerWidth,
//     height: window.innerHeight
// }

// window.addEventListener('resize', () => {
//     // Update sizes
//     sizes.width = window.innerWidth
//     sizes.height = window.innerHeight

//     // Update camera
//     camera.aspect = sizes.width / sizes.height
//     camera.updateProjectionMatrix()

//     // Update renderer
//     renderer.setSize(sizes.width, sizes.height)
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// })

// const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.set(0.25, - 0.25, 1)
// camera.position.z = 5;
// scene.add(camera)

// const renderer = new THREE.WebGLRenderer()
// renderer.setSize(window.innerWidth, window.innerHeight);

// const loader = new GLTFLoader();

// let controls

// const pointLight = new THREE.PointLight(0xffffff, 1);
// pointLight.position.set(0, 10, 0);
// scene.add(pointLight);

// const loadModel = () => new Promise((resolve, reject) => {
//     loader.load('./viking//VikingALL.gltf', (gltf) => {
//         resolve(gltf.scene);
//     }, undefined, (error) => {
//         reject(error);
//     });
// });
// let model
// const startup = async () => {
//     document.body.appendChild(renderer.domElement);

//     model = await loadModel();

//     model.scale.set(0.1, 0.1, 0.1);
//     model.position.set(0, 0, 0);
//     model.rotation.set(0, 0, 0)
//     scene.add(model);

//     controls = new OrbitControls(camera, renderer.domElement)
//     controls.enableDamping = true
// }

// startup()

// const animate = () => {
//     requestAnimationFrame(animate);
//     renderer.render(scene, camera);
// }


// animate()

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const scene = new THREE.Scene()
const gui = new GUI();
const textureLoader = new THREE.TextureLoader()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.set(0, 4, 3)
camera.position.set(0, 2, 2.5)
scene.add(camera)
// const cameraFolder = gui.addFolder('Camera')
// cameraFolder.add(camera.position, 'y', 0, 10);

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight);

const loader = new GLTFLoader();

let controls
let model

const loadModel = () => new Promise((resolve, reject) => {
    loader.load('./charactercreator/VikingALL.gltf', (gltf) => {
        resolve(gltf.scene);
    }, undefined, (error) => {
        reject(error);
    });
});

const hideObjects = (object) => {
    object.forEach(element => {
        element.visible = false;
    });
}

const separateParts = (model, parentname) => {
    const parent = model.getObjectByName(parentname)
    const children = parent.children
    return [parent, children]
}

class DegRadHelper {
    constructor(obj, prop) {
      this.obj = obj;
      this.prop = prop;
    }
    get value() {
      return THREE.MathUtils.radToDeg(this.obj[this.prop]);
    }
    set value(v) {
      this.obj[this.prop] = THREE.MathUtils.degToRad(v);
    }
  }

const startup = async () => {
    document.body.appendChild(renderer.domElement);

    // ---------------------------------------------

    function updateLight() {
        helper.update();
    }

    const AmbientLight = new THREE.AmbientLight(0xFFFFFF, 1);
    scene.add(AmbientLight);

    const widthXheight = 10;
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.SpotLight(color, intensity);
    light.castShadow = true;
    scene.add(light);

    const helper = new THREE.SpotLightHelper(light);    
    scene.add(helper);

    const lightFolder = gui.addFolder('Light')
    lightFolder.add(AmbientLight, 'intensity', 1, 5, 0.1)
    lightFolder.add(light, 'intensity', 0, 3, 0.01);
    lightFolder.add(light, 'distance', 0, 40).onChange(updateLight);
    lightFolder.add(light.position, 'x', -11, 11);
    lightFolder.add(light.position, 'z', -11, 11);
    lightFolder.add(light.position, 'y', 1, 10);
    lightFolder.add(new DegRadHelper(light, 'angle'), 'value', 0, 90).name('angle').onChange(updateLight);
    // ---------------------------------------------

    model = await loadModel();

    scene.add(model)
    console.log(model);
    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);
    model.receiveShadow = true;
    model.castShadow = true;
    
    hideObjects(model.children.slice(1, 5))
    separateParts(model, 'Clothes001', 'Top001')

    const size = 10;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper(size, divisions, 0x888888, 0x888888);
    scene.add(gridHelper);

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.target.set(0, 2, 0);
}
startup()

const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate()

const button = document.querySelector('.log');
button.addEventListener('click', () => {
  console.log('Camera Position:', camera.position);
  console.log('Controls Target:', controls.target);

//   controls.target
});

const cycle = (group, direction) => {
    const [parent, childeren] = separateParts(model, 'Clothes001')
    console.log(parent);
}