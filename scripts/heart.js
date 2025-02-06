import { scene, camera, renderer, GLTFLoader } from './scene.js';
import * as THREE from 'three';

let heartModel;
const loader = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let targetScale = new THREE.Vector3(0.1, 0.1, 0.1);
let targetPosition = new THREE.Vector3(0, 0, 0);

loader.load('assets/models/heart.glb', (gltf) => {
    heartModel = gltf.scene;
    heartModel.position.set(0, 0, 0);
    heartModel.scale.set(0.1, 0.1, 0.1);
    scene.add(heartModel);

    document.addEventListener('mousemove', (event) => {
        const mouseZ = (event.clientY / window.innerHeight) * 2 - 1;
        const rotationAngle = -mouseZ * Math.PI / 10;
        heartModel.rotation.x = rotationAngle;

        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const rotationAngle2 = -mouseX * Math.PI / 10;
        heartModel.rotation.y = rotationAngle2;

        // Update the mouse variable
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the raycaster with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // Calculate objects intersecting the raycaster
        const intersects = raycaster.intersectObject(heartModel, true);

        if (intersects.length > 0) {
            targetScale.set(0.12, 0.12, 0.12);
        } else {
            targetScale.set(0.1, 0.1, 0.1);
        }
    });

    document.addEventListener('click', (event) => {
        // Update the mouse variable
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update the raycaster with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // Calculate objects intersecting the raycaster
        const intersects = raycaster.intersectObject(heartModel, true);

        if (intersects.length > 0) {
            if (heartModel.position.x < -1) {
                targetPosition.set(0, 0, 0);
            } else {
                targetPosition.set(-40, 0, 0);
            }
        }
    });

    function animate() {
        requestAnimationFrame(animate);

        // Smoothly interpolate the scale
        heartModel.scale.lerp(targetScale, 0.1);

        // Smoothly interpolate the position
        heartModel.position.lerp(targetPosition, 0.1);

        // console.log(`Heart position: x=${heartModel.position.x}, y=${heartModel.position.y}, z=${heartModel.position.z}`);

        renderer.render(scene, camera);
    }
    animate();
}, undefined, (error) => {
    console.error('Erreur lors du chargement du modèle heart.glb', error);
});