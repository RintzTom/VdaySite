import { animateHeart } from "./heart";

export function toggleText(show) {
    const textContainer = document.getElementById('text-container');
    if (show) {
        textContainer.classList.add('show');
    } else {
        textContainer.classList.remove('show');
    }
}

let lastPositionIndex = -1; // Variable pour stocker la dernière position utilisée

function toggleButtonText() {
    const button = document.getElementById('next-button');
    const title = document.querySelector('#text-container h1');
    const paragraphs = document.querySelectorAll('#text-container p');
    const buttonContainer = document.getElementById('button-container');
    const textContainer = document.getElementById('text-container');

    if (button.textContent === 'Suivant') {
        title.style.opacity = '0';
        paragraphs.forEach(p => p.style.opacity = '0');
        setTimeout(() => {
            title.style.display = 'none';
            paragraphs.forEach(p => p.style.display = 'none');
            button.textContent = 'Retour';
            title.style.opacity = '1';
            paragraphs.forEach(p => p.style.opacity = '1');

            // Créer les boutons "Oui" et "Non"
            const yesButton = document.createElement('button');
            yesButton.id = 'yes-button';
            yesButton.textContent = 'Oui';
            yesButton.className = 'additional-button';

            const noButton = document.createElement('button');
            noButton.id = 'no-button';
            noButton.textContent = 'Non';
            noButton.className = 'additional-button';

            // Ajouter les boutons au conteneur de boutons
            buttonContainer.insertBefore(yesButton, button);
            buttonContainer.appendChild(noButton);

            // Créer le champ de texte avec le message
            const message = document.createElement('p');
            message.id = 'valentine-message';
            message.textContent = 'Veux-tu être ma valentine ?';
            message.className = 'valentine-message';
            textContainer.insertBefore(message, buttonContainer);

            // Evenement pour les boutons "Oui" et "Non"
            yesButton.addEventListener('click', () => {
                animateHeart(displayNewText);
            });
            noButton.addEventListener('click', teleportButton);
        }, 300); // Correspond à la durée de la transition
    } else {
        title.style.display = 'block';
        paragraphs.forEach(p => p.style.display = 'block');
        setTimeout(() => {
            title.style.opacity = '1';
            paragraphs.forEach(p => p.style.opacity = '1');
            button.textContent = 'Suivant';

            // Supprimer les boutons "Oui" et "Non"
            const yesButton = document.getElementById('yes-button');
            const noButton = document.getElementById('no-button');
            if (yesButton) yesButton.remove();
            if (noButton) noButton.remove();

            // Supprimer le champ de texte avec le message
            const message = document.getElementById('valentine-message');
            if (message) message.remove();
        }, 10); // Petit délai pour permettre l'application du display avant l'opacité
    }
}

function displayNewText() {
    const textContainer = document.getElementById('text-container');

    // Masquer les autres éléments de texte
    const title = document.querySelector('#text-container h1');
    const paragraphs = document.querySelectorAll('#text-container p');
    title.style.display = 'none';
    paragraphs.forEach(p => p.style.display = 'none');

    // Supprimer le champ de texte avec le message
    const message = document.getElementById('valentine-message');
    if (message) message.remove();

    // Supprimer les boutons "Oui" et "Non"
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
    if (yesButton) yesButton.remove();
    if (noButton) noButton.remove();

    // Supprimer le bouton "Retour"
    const nextButton = document.getElementById('next-button');
    if (nextButton) nextButton.remove();

    // Ajouter le nouveau texte
    const newText = document.createElement('p');
    newText.textContent = 'Retourne toi';
    newText.className = 'new-text';
    newText.style.fontSize = '1em'; // Réduire un peu la taille du texte
    textContainer.appendChild(newText);
}

function teleportButton() {
    const noButton = document.getElementById('no-button');
    const positions = [
        { left: '-50vw', top: '40vh' },   // Position 1
        { left: '30vw', top: '30vh' },   // Position 2
        { left: '-30vw', top: '-20vh' }    // Position 3
    ];
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * positions.length);
    } while (randomIndex === lastPositionIndex); // Répéter jusqu'à ce que la nouvelle position soit différente
    lastPositionIndex = randomIndex; // Mettre à jour la dernière position utilisée
    const position = positions[randomIndex];
    noButton.style.position = 'fixed';
    noButton.style.left = position.left;
    noButton.style.top = position.top;
}

// Ajouter l'événement directement ici
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('next-button').addEventListener('click', toggleButtonText);
});