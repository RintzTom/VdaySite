import { scene, camera, renderer, GLTFLoader } from './scene.js';
import * as THREE from 'three';
import { toggleText } from './text.js';

let heartModel;
const loader = new GLTFLoader();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let targetScale = new THREE.Vector3(0.1, 0.1, 0.1);
let targetPosition = new THREE.Vector3(0, 0, 0);
let isAnimatingHeart = false;

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
            // Calculer la largeur visible de la scène
            const aspectRatio = window.innerWidth / window.innerHeight;
            const fovRadians = THREE.MathUtils.degToRad(camera.fov / 2);
            const visibleWidthAtDepth = 2 * Math.tan(fovRadians) * Math.abs(camera.position.z) * aspectRatio;
        
            // Convertir la position en pixels en coordonnées 3D
            const pixelPositionX = window.innerWidth / 4; // Exemple : 1920 / 4 = 480
            const normalizedX = (pixelPositionX / window.innerWidth) * visibleWidthAtDepth;
        
            // Appliquer la position
            if (heartModel.position.x < -1) {
                targetPosition.set(0, 0, 0); // Réinitialiser la position
                toggleText(false);
            } else {
                targetPosition.set(-normalizedX, 0, 0); // Déplacer vers la gauche
                toggleText(true);
            }
        }
    });

    function animate() {
        console.log(`Window width: ${window.innerWidth}`);
        requestAnimationFrame(animate);

        // Smoothly interpolate the scale
        heartModel.scale.lerp(targetScale, 0.1);

        // Smoothly interpolate the position only if not animating heart
        if (!isAnimatingHeart) {
            heartModel.position.lerp(targetPosition, 0.1);
        }

        // console.log(`Heart position: x=${heartModel.position.x}, y=${heartModel.position.y}, z=${heartModel.position.z}`);

        renderer.render(scene, camera);
    }
    animate();
}, undefined, (error) => {
    console.error('Erreur lors du chargement du modèle heart.glb', error);
});

export function animateHeart(callback) {
    isAnimatingHeart = true;
    const initialPosition = heartModel.position.clone();
    const targetPosition = new THREE.Vector3(0, 0, 0);
    const moveDuration = 1000; // Durée de l'animation de déplacement en millisecondes
    const startTime = performance.now();

    function moveToCenter() {
        toggleText(false);
        const elapsedTime = performance.now() - startTime;
        const progress = elapsedTime / moveDuration;

        // Interpoler la position du cœur vers (0, 0, 0)
        heartModel.position.lerpVectors(initialPosition, targetPosition, progress);

        if (progress < 1) {
            requestAnimationFrame(moveToCenter);
        } else {
            rotateHeart();
        }
    }

    function rotateHeart() {
        const duration = 2000; // Durée de l'animation en millisecondes
        const startTime = performance.now();

        function rotate() {
            const elapsedTime = performance.now() - startTime;
            const progress = elapsedTime / duration;

            // Faire tourner le cœur
            heartModel.rotation.y = THREE.MathUtils.lerp(0, 2 * Math.PI, progress); // 2 tours complets

            if (progress < 1) {
                requestAnimationFrame(rotate);
            } else {
                // Pause d'une seconde avant de faire monter le cœur
                setTimeout(moveHeartUp, 50);
            }
        }

        requestAnimationFrame(rotate);
    }

    function moveHeartUp() {
        const moveDuration = 500; // Durée de l'animation de montée en millisecondes
        const moveStartTime = performance.now();

        function animateMove() {
            const elapsedTime = performance.now() - moveStartTime;
            const progress = elapsedTime / moveDuration;

            // Déplacer le cœur vers le haut
            heartModel.position.y = THREE.MathUtils.lerp(0, 100, progress); // Déplacer vers le haut

            if (progress < 1) {
                requestAnimationFrame(animateMove);
            } else {
                isAnimatingHeart = false;
                if (callback) {
                    callback(); // Appeler le rappel une fois l'animation terminée
                    toggleText(true);
                }
            }
        }

        requestAnimationFrame(animateMove);
    }

    requestAnimationFrame(moveToCenter);
}