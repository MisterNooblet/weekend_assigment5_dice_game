//DOM Variables
//Buttons
const startBtn = document.querySelector('#start-btn');
const rollBtn = document.querySelector('#roll-btn');

//windows
const welcomeWindow = document.querySelector('#welcome-container');
const gameWindow = document.querySelector('#game-container');
//Elements
const scoreInput = document.querySelector('#target-score');
const dice1 = document.querySelector("#dice-1");
const dice2 = document.querySelector("#dice-2");
const p1Current = document.querySelector('#p1score-current');
const p2Current = document.querySelector('#p2score-current');
//Event Listeners
startBtn.addEventListener('click', startGame);
rollBtn.addEventListener('click', rollDice);
//functions

function startGame(params) {
    localStorage.setItem('targetScore', scoreInput.value);
    localStorage.setItem('player1', JSON.stringify({ totalScore: 0, currentScore: 0, isPlaying: true }));
    localStorage.setItem('player2', JSON.stringify({ totalScore: 0, currentScore: 0, isPlaying: false, isAI: false }));
    welcomeWindow.style.display = 'none';
    gameWindow.style.display = ''
}

function rollDice() {
    let player1 = JSON.parse(localStorage.getItem('player1'))
    let player2 = JSON.parse(localStorage.getItem('player2'))
    let die1 = Math.floor(Math.random() * 6) + 1
    let die2 = Math.floor(Math.random() * 6) + 1
    localStorage.setItem('die1', die1)
    localStorage.setItem('die2', die2)
    if (player1.isPlaying) {
        player1.currentScore += die1 + die2
        p1Current.innerHTML = `${player1.currentScore}`
        localStorage.setItem('player1', JSON.stringify(player1))
    } else {
        player2.currentScore += die1 + die2
        p2Current.innerHTML = `${player2.currentScore}`
        localStorage.setItem('player2', JSON.stringify(player2))
    }
    swapDice()
}

function swapDice() {
    let die1val = localStorage.getItem('die1');
    let die2val = localStorage.getItem('die2');
    dice1.src = `/assets/images/${die1val}.png`
    dice2.src = `/assets/images/${die2val}.png`
}