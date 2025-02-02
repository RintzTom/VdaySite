// scripts/stars.js
import { scene, camera, renderer, GLTFLoader } from './scene.js';

let starsModel;
const loader = new GLTFLoader();

loader.load('assets/models/stars.glb', (gltf) => {
    starsModel = gltf.scene;
    starsModel.scale.set(0.6, 0.6, 0.6);
    scene.add(starsModel);

    document.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = (event.clientY / window.innerHeight) * 2 - 1;

        // Déplace le modèle dans la direction opposée au mouvement de la souris
        starsModel.position.x = -mouseX * 0.8;
        starsModel.position.y = mouseY * 0.8;
    });

    function animate() {
        requestAnimationFrame(animate);
        starsModel.rotation.y -= 0.001;
        renderer.render(scene, camera);
    }
    animate();
}, undefined, (error) => {
    console.error('Erreur lors du chargement du modèle stars.glb', error);
});