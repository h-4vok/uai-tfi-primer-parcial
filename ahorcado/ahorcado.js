"use strict";

const bodyParts = {
    head: null,
    leftArm: null,
    body: null,
    rightArm: null,
    leftLeg: null,
    rightLeg: null,
    allParts: null
};

const linkedListOfParts = null;

let secretWordLabel = null;
let tryLetterButton = null;
let letterInput = null;
let newGameButton = null;
let currentSecretWord = null;
let charsToIndexesDictionary = null;
let discoveredLetters = null;
let currentBodyPartIndex = 0;

const words = [
    'QUIMERA',
    'ELECTRICIDAD',
    'ZIMBABWE',
    'DROGAS',
    'ELECTROMAGNETISMO',
    'INGENIERIA',
    'ROSEDAL',
    'MADERERA',
    'INMOBILIARIA',
    'MAESTRO'
];

function hideBody() {
    bodyParts.allParts.forEach(part => part.style.visibility = 'hidden');
}

function showBodyPart(index) {
    bodyParts.allParts[index].style.visibility = 'visible';
}

function init() {

    function initBodyParts() {
        bodyParts.head = document.querySelector("#player-head");
        bodyParts.leftArm = document.querySelector("#player-left-arm");
        bodyParts.body = document.querySelector("#player-body");
        bodyParts.rightArm = document.querySelector("#player-right-arm");
        bodyParts.leftLeg = document.querySelector("#player-left-leg");
        bodyParts.rightLeg = document.querySelector("#player-right-leg");

        bodyParts.allParts = [bodyParts.head, bodyParts.leftArm, bodyParts.body, bodyParts.rightArm, bodyParts.leftLeg, bodyParts.rightLeg];
    }

    function initOtherControls() {
        secretWordLabel = document.querySelector("#secret-word-label");
        tryLetterButton = document.querySelector("#try-word");
        letterInput = document.querySelector("#letter-input");
        newGameButton = document.querySelector("#new-game");

        tryLetterButton.addEventListener('click', tryLetter);

        letterInput.addEventListener('keypress', function (e) {
            if (e.keyCode !== 13)
                return;

            tryLetter();
        });

        newGameButton.addEventListener('click', newGame);

    }

    initBodyParts();
    hideBody();
    initOtherControls();

}

document.addEventListener('DOMContentLoaded', init);

function tryLetter() {
    // Take the char from the input
    const char = letterInput.value;

    // Have we used it before? If so, we forgive the player and leave with no penalty.
    if (discoveredLetters.has(char))
        return;

    // The char is on the word? Good! Make it appear on the label on every occurence.
    if (!!charsToIndexesDictionary[char]) {
        const indexes = charsToIndexesDictionary[char];
        let currentLabelContent = secretWordLabel.innerHTML;

        for (let index of indexes) {
            currentLabelContent = currentLabelContent.substring(0, index) + char + currentLabelContent.substring(index + 1);
        }

        secretWordLabel.innerHTML = currentLabelContent;
        discoveredLetters.add(char);

        checkIfPlayerWon(currentLabelContent);

        return;
    }

    // The char is not on the word? Punish the player
    punish();
}

function checkIfPlayerWon(currentLabel) {
    if (currentLabel.includes('_'))
        return;

    tryLetterButton.disabled = 'disabled';
    letterInput.disabled = 'disabled';
    letterInput.readOnly = true;
    alert('Ganaste Papurri!!!!');
}

function newGame() {
    // Reset body parts and elements
    currentBodyPartIndex = 0;
    hideBody();
    tryLetterButton.disabled = '';
    letterInput.disabled = '';
    letterInput.readOnly = false;

    // Randomize word selection
    const selectedWordIndex = Math.floor(Math.random() * words.length);
    const word = words[selectedWordIndex];

    currentSecretWord = word;

    // Put all underscores in our secret word label
    secretWordLabel.innerHTML = '_'.repeat(word.length);

    // We create an empty set of discovered letters
    discoveredLetters = new Set();

    // Build the dictionary of chars for this word
    buildCharsToLetterDictionary();
}

function buildCharsToLetterDictionary() {
    charsToIndexesDictionary = {};

    for (let i = 0; i < currentSecretWord.length; i++) {

        const char = currentSecretWord[i];

        if (!charsToIndexesDictionary[char]) {
            charsToIndexesDictionary[char] = [i];
        }
        else {
            charsToIndexesDictionary[char].push(i);
        }
    }
}

function punish() {
    showBodyPart(currentBodyPartIndex);

    currentBodyPartIndex++;

    if (currentBodyPartIndex >= bodyParts.allParts.length) {
        tryLetterButton.disabled = 'disabled';
        letterInput.disabled = 'disabled';
        letterInput.readOnly = true;
        alert('Game Over!!!');
    }
}