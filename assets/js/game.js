//DOM Variables
//Buttons
const startBtn = document.querySelector('#start-btn');
const rollBtn = document.querySelector('#roll-btn');
const holdBtn = document.querySelector('#hold-btn');
const aiBtn = document.querySelector('#ai-btn');
const newGameBtn = document.querySelector('#newgame-btn')
//windows
const welcomeWindow = document.querySelector('#welcome-container');
const gameWindow = document.querySelector('#game-container');
//Elements
const scoreInput = document.querySelector('#target-score');
const dice1 = document.querySelector("#dice-1");
const dice2 = document.querySelector("#dice-2");
const p1Current = document.querySelector('#p1score-current');
const p2Current = document.querySelector('#p2score-current');
const p1Total = document.querySelector('#p1score-total');
const p2Total = document.querySelector('#p2score-total');
const p1Card = document.querySelector('#p1-card')
const p2Card = document.querySelector('#p2-card')
const p2wingif = document.querySelector('#p2wingif');
const p1wingif = document.querySelector('#p1wingif');
const p1cbBox = document.querySelectorAll('.p1cb-box')
const p2cbBox = document.querySelectorAll('.p2cb-box')
const p2wintxt = document.querySelector('#p2wintxt')
const p1wintxt = document.querySelector('#p1wintxt')
//Sounds
const diceRollSound = document.querySelector('#dice-roll-sound')
const wooHooSound = document.querySelector('#woo-hoo-sound')
//Event Listeners
startBtn.addEventListener('click', startGame);
aiBtn.addEventListener('click', startGameAI);
rollBtn.addEventListener('click', rollDice);
holdBtn.addEventListener('click', holdScore)
newGameBtn.addEventListener('click', newGame)
//functions
//Game mechanics
function startGame(params) {
    localStorage.setItem('targetScore', scoreInput.value);
    localStorage.setItem('player1', JSON.stringify({ totalScore: 0, currentScore: 0, isPlaying: true }));
    localStorage.setItem('player2', JSON.stringify({ totalScore: 0, currentScore: 0, isPlaying: false, isAI: false }));
    welcomeWindow.style.display = 'none';
    gameWindow.style.display = ''
    holdBtn.disabled = true;
    updateUI()
}
function startGameAI(params) {
    localStorage.setItem('targetScore', scoreInput.value);
    localStorage.setItem('player1', JSON.stringify({ totalScore: 0, currentScore: 0, isPlaying: true }));
    localStorage.setItem('player2', JSON.stringify({ totalScore: 0, currentScore: 0, isPlaying: false, isAI: true }));
    welcomeWindow.style.display = 'none';
    gameWindow.style.display = ''
    holdBtn.disabled = true;
    updateUI()
}

function holdScore() {
    let player1 = JSON.parse(localStorage.getItem('player1'))
    let player2 = JSON.parse(localStorage.getItem('player2'))
    if (player1.isPlaying && player2.isAI) {
        player1.totalScore += player1.currentScore;
        player1.currentScore = 0;
        player1.isPlaying = false;
        player2.isPlaying = true;
        localStorage.setItem('player1', JSON.stringify(player1))
        localStorage.setItem('player2', JSON.stringify(player2))
        holdBtn.disabled = true;
        // rollBtn.disabled = true;
        updateUI()
        checkScores()
        AI();
    } else if (player1.isPlaying) {
        player1.totalScore += player1.currentScore;
        player1.currentScore = 0;
        player1.isPlaying = false;
        player2.isPlaying = true;
        localStorage.setItem('player1', JSON.stringify(player1))
        localStorage.setItem('player2', JSON.stringify(player2))
        holdBtn.disabled = true;
        updateUI()
        checkScores()
    }
    else if (player2.isPlaying) {
        player2.totalScore += player2.currentScore;
        player2.currentScore = 0;
        player1.isPlaying = true;
        player2.isPlaying = false;
        localStorage.setItem('player2', JSON.stringify(player2))
        localStorage.setItem('player1', JSON.stringify(player1))
        holdBtn.disabled = true;
        updateUI()
        checkScores()
    }

}

function rollDice() {
    let player1 = JSON.parse(localStorage.getItem('player1'))
    let player2 = JSON.parse(localStorage.getItem('player2'))
    let die1 = Math.floor(Math.random() * 6) + 1
    let die2 = Math.floor(Math.random() * 6) + 1
    localStorage.setItem('die1', die1)
    localStorage.setItem('die2', die2)
    if (player1.isPlaying === true) {
        player1.currentScore += die1 + die2
        localStorage.setItem('player1', JSON.stringify(player1))
        if (die1 + die2 == 12) {
            player1.currentScore = 0
            localStorage.setItem('player1', JSON.stringify(player1))
            holdScore()
        }
    } else {
        player2.currentScore += die1 + die2
        localStorage.setItem('player2', JSON.stringify(player2))
        if (die1 + die2 == 12) {
            player2.currentScore = 0
            localStorage.setItem('player2', JSON.stringify(player2))
            holdScore()
        }
    }
    holdBtn.disabled = false;
    updateUI()
    swapDice()
}

function checkScores() {
    let totalScore = localStorage.getItem('targetScore');
    let player1 = JSON.parse(localStorage.getItem('player1'))
    let player2 = JSON.parse(localStorage.getItem('player2'))
    if (player2.totalScore == totalScore) {
        declareWinner('P2')
    } else if (player1.totalScore == totalScore) {
        declareWinner('P1')
    } else if (player2.totalScore > totalScore) {
        declareWinner('P1')
    } else if (player1.totalScore > totalScore) {
        declareWinner('P2')
    } else {
        p1Card.classList.toggle('waiting')
        p2Card.classList.toggle('waiting')
    }
}

//AI Player
function AI() {
    let totalScore = localStorage.getItem('targetScore');
    let player1 = JSON.parse(localStorage.getItem('player1'))
    let player2 = JSON.parse(localStorage.getItem('player2'))
    if (player1.totalScore < totalScore) {
        rollDice()
    }

    holdScore()
}
//DOM Manipulation Functions
function swapDice() {
    let die1val = localStorage.getItem('die1');
    let die2val = localStorage.getItem('die2');
    dice1.src = `/assets/images/${die1val}.png`;
    dice2.src = `/assets/images/${die2val}.png`;
    dice1.classList.toggle('dice1-anim')
    dice2.classList.toggle('dice1-anim')
    diceRollSound.play();
    setTimeout(function () {
        dice1.classList.toggle('dice1-anim')
        dice2.classList.toggle('dice1-anim')
    }, 500)
}

function updateUI() {
    let player1 = JSON.parse(localStorage.getItem('player1'))
    let player2 = JSON.parse(localStorage.getItem('player2'))
    p1Current.innerHTML = `${player1.currentScore}`
    p2Current.innerHTML = `${player2.currentScore}`
    p2Total.innerHTML = `${player2.totalScore}`
    p1Total.innerHTML = `${player1.totalScore}`
}

function declareWinner(player) {
    let player2 = JSON.parse(localStorage.getItem('player2'))
    if (player === 'P1') {
        rollBtn.disabled = true;
        holdBtn.disabled = true;
        p2Card.classList.add('waiting')
        p1Card.classList.add('winner')
        p1Card.classList.remove('waiting')
        for (let i = 0; i < p1cbBox.length; i++) {
            p1cbBox[i].style.display = 'none'
            p1wingif.style.display = ''
        }
        p1wintxt.innerHTML = 'YOU WIN'
    } else {
        rollBtn.disabled = true;
        holdBtn.disabled = true;
        p1Card.classList.add('waiting')
        p2Card.classList.add('winner')
        p2Card.classList.remove('waiting')
        for (let i = 0; i < p2cbBox.length; i++) {
            p2cbBox[i].style.display = 'none'
            p2wingif.style.display = ''
        }
        p2wintxt.innerHTML = 'YOU WIN'
    }
    if (player2.isAI && player !== 'P1') {
        p2wintxt.innerHTML = 'AI WINS'
    }
    wooHooSound.play()
}
function newGame() {
    welcomeWindow.style.display = '';
    gameWindow.style.display = 'none'
    p2wintxt.innerHTML = ''
    p1wintxt.innerHTML = ''
    for (let i = 0; i < p1cbBox.length; i++) {
        p1cbBox[i].style.display = ''
        p1wingif.style.display = 'none'
    }
    for (let i = 0; i < p2cbBox.length; i++) {
        p2cbBox[i].style.display = ''
        p2wingif.style.display = 'none'
    }
    p2wintxt.innerHTML = ''
    p1wintxt.innerHTML = ''
    p1Card.classList.remove('winner')
    p2Card.classList.remove('winner')
    p2Card.classList.add('waiting')
    p1Card.classList.remove('waiting')
    rollBtn.disabled = false;
    updateUI()
}