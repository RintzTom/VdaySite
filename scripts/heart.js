// scripts/heart.js
import { scene, GLTFLoader } from './scene.js';

let heartModel;
const loader = new GLTFLoader();

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
    });
}, undefined, (error) => {
    console.error('Erreur lors du chargement du modèle heart.glb', error);
});