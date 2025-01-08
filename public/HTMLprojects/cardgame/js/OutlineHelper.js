import * as THREE from 'three';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'

export function getOutlineEffect(window, scene, camera){
    let outlinePass = new OutlinePass( new THREE.Vector2( window.innerWidth, window.innerHeight ), scene, camera );

    return outlinePass;
}

export function configureOutlineEffectSettings_Default(outlinePass){

    outlinePass.edgeStrength = 10;
    outlinePass.edgeGlow = 0.001;
    outlinePass.edgeThickness = 1;
    outlinePass.visibleEdgeColor.set('#ff0000');
    outlinePass.hiddenEdgeColor.set('#ff0000');
}

export function addOutlinesBasedOnIntersections(intersections, outlinePass){

    outlinePass.selectedObjects = [];

    if(intersections.length > 0){
        let firstObject = intersections[0].object
    
        outlinePass.selectedObjects = [firstObject];
    }
}