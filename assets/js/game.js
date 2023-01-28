//localStorage perm values
localStorage.setItem('p1TotalWins', 0);
localStorage.setItem('p2TotalWins', 0);
localStorage.setItem('p1Streak', 0);
localStorage.setItem('p2Streak', 0);
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
const p1totalWins = document.querySelector('#p1total-wins')
const p1streak = document.querySelector('#p1streak')
const p2totalWins = document.querySelector('#p2total-wins')
const p2streak = document.querySelector('#p2streak')
//Sounds
const diceRollSound = document.querySelector('#dice-roll-sound')
const wooHooSound = document.querySelector('#woo-hoo-sound')
const aiWinSound = document.querySelector('#ai-win-sound')
const welcomeMusic = document.querySelector('#start-music-sound')
const roundOne = document.querySelector('#round-one-sound')
const gameMusic = document.querySelector('#game-music-sound')
//Event Listeners
startBtn.addEventListener('click', startGame);
aiBtn.addEventListener('click', startGameAI);
rollBtn.addEventListener('click', rollDice);
holdBtn.addEventListener('click', holdScore)
newGameBtn.addEventListener('click', newGame)
//functions
//Game mechanics
function startGame(params) {//initiates game session for two players.
    localStorage.setItem('targetScore', scoreInput.value);
    localStorage.setItem('player1', JSON.stringify({ totalScore: 0, currentScore: 0, isPlaying: true }));
    localStorage.setItem('player2', JSON.stringify({ totalScore: 0, currentScore: 0, isPlaying: false, isAI: false }));
    welcomeWindow.style.display = 'none';
    gameWindow.style.display = ''
    holdBtn.disabled = true;
    updateUI()
    welcomeMusic.pause()
    roundOne.play()
    gameMusic.play()
    gameMusic.volume = 0.3;
    wooHooSound.volume = 0.4;
}
function startGameAI(params) {//initiates game session vs AI1
    localStorage.setItem('targetScore', scoreInput.value);
    localStorage.setItem('player1', JSON.stringify({ totalScore: 0, currentScore: 0, isPlaying: true }));
    localStorage.setItem('player2', JSON.stringify({ totalScore: 0, currentScore: 0, isPlaying: false, isAI: true }));
    welcomeWindow.style.display = 'none';
    gameWindow.style.display = ''
    holdBtn.disabled = true;
    updateUI()
    welcomeMusic.pause()
    roundOne.play()
    gameMusic.play()
}

function holdScore() {// a function to hold the current score
    let player1 = JSON.parse(localStorage.getItem('player1'))
    let player2 = JSON.parse(localStorage.getItem('player2'))
    if (player1.isPlaying && player2.isAI) { // checks if game is in vs AI Session and updates accordingly scores accordingly , and finally calls the AI function to play.
        player1.totalScore += player1.currentScore;
        player1.currentScore = 0;
        player1.isPlaying = false;
        player2.isPlaying = true;
        localStorage.setItem('player1', JSON.stringify(player1))
        localStorage.setItem('player2', JSON.stringify(player2))
        holdBtn.disabled = true;
        updateUI()
        checkScores()
        AI();
    } else if (player1.isPlaying) {//if current player is Player 1 , updates his score and sets Player 2 to active player
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
    else if (player2.isPlaying) {//if current player is Player 2 , updates his score and sets Player 1 to active player
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

function rollDice() {//Handles the dice rolling event and calls UI update , and dice image swap functions.
    let player1 = JSON.parse(localStorage.getItem('player1'))
    let player2 = JSON.parse(localStorage.getItem('player2'))
    let die1 = Math.floor(Math.random() * 6) + 1
    let die2 = Math.floor(Math.random() * 6) + 1
    localStorage.setItem('die1', die1)//sets roll outcome for die number 1 so we can later update the image accordingly
    localStorage.setItem('die2', die2)//sets roll outcome for die number 2 so we can later update the image accordingly
    if (player1.isPlaying === true) {//if Player 1 is playing store his current score and push it to localStorage 
        player1.currentScore += die1 + die2
        localStorage.setItem('player1', JSON.stringify(player1))
        if (die1 + die2 == 12) {//if its a 6,6 roll pause turn pass for 2 seconds
            rollBtn.disabled = true;
            player1.currentScore = 0
            localStorage.setItem('player1', JSON.stringify(player1))
            setTimeout(holdScore, 2000)
            setTimeout(function () { rollBtn.disabled = false; }, 2000)
        }
    } else {//if Player 2 is playing store his current score and push it to localStorage
        player2.currentScore += die1 + die2
        localStorage.setItem('player2', JSON.stringify(player2))
        if (die1 + die2 == 12) {//if its a 6,6 roll pause turn pass for 2 seconds
            rollBtn.disabled = true;
            player2.currentScore = 0
            localStorage.setItem('player2', JSON.stringify(player2))
            setTimeout(holdScore, 2000)
            setTimeout(function () { rollBtn.disabled = false; }, 2000) //holdScore()
        }
    }
    holdBtn.disabled = false;
    updateUI()
    swapDice()
}

function checkScores() {//checks if any opponent won
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
        p1Card.classList.toggle('waiting')//swaps between waiting state for player cards
        p2Card.classList.toggle('waiting')//
    }
}

//AI Player
function AI() {//ai player executes dice roll function , and later holds score. simple as that.
    let totalScore = localStorage.getItem('targetScore');
    let player1 = JSON.parse(localStorage.getItem('player1'))
    let player2 = JSON.parse(localStorage.getItem('player2'))
    if (player1.totalScore < totalScore && player2.totalScore < totalScore) {//prevents our ai from rolling after victory or defeat.
        rollDice()
        holdScore()
    }

}
//DOM Manipulation Functions
function swapDice() {//swaps the dice images on screen and activates their shake animation.
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

function updateUI() {//updates ui with current and total scores
    let player1 = JSON.parse(localStorage.getItem('player1'))
    let player2 = JSON.parse(localStorage.getItem('player2'))
    p1Current.innerHTML = `${player1.currentScore}`
    p2Current.innerHTML = `${player2.currentScore}`
    p2Total.innerHTML = `${player2.totalScore}`
    p1Total.innerHTML = `${player1.totalScore}`
}

function updateScores(player) {//updates streak and total victories counter and pushes those updates to our UI.(called from declareWinner function)
    let p1TotalWins = Number(localStorage.getItem('p1TotalWins'));
    let p2TotalWins = Number(localStorage.getItem('p2TotalWins'));
    let p1Streak = Number(localStorage.getItem('p1Streak'));
    let p2Streak = Number(localStorage.getItem('p2Streak'));

    if (player === 'P1') {
        p1TotalWins += 1;
        p1Streak += 1;
        p1totalWins.innerHTML = `Total Wins: ${p1TotalWins}`
        p1streak.innerHTML = `Streak: ${p1Streak}`
        p2Streak = 0;
        p2streak.innerHTML = `Streak: ${p2Streak}`

    } else if (player === 'P2') {
        p2TotalWins += 1;
        p2Streak += 1;
        p2totalWins.innerHTML = `Total Wins: ${p2TotalWins}`
        p2streak.innerHTML = `Streak: ${p2Streak}`
        p1Streak = 0;
        p1streak.innerHTML = `Streak: ${p1Streak}`
    }
    localStorage.setItem('p1TotalWins', p1TotalWins);
    localStorage.setItem('p2TotalWins', p2TotalWins);
    localStorage.setItem('p1Streak', p1Streak);
    localStorage.setItem('p2Streak', p2Streak);
}
function declareWinner(player) {//Declares a winner , manipulates card color , replaces current score with an image as well as plays a sound. ( callled from check scores function)
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
        updateScores('P1')
        wooHooSound.play()
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
        updateScores('P2')

    }

    if (player2.isAI && player !== 'P1') {
        p2wintxt.innerHTML = 'AI WINS'
        aiWinSound.play()

    } else {
        wooHooSound.play()
        return
    }

}
function newGame() {//resets all ui states and updates UI
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
    gameMusic.pause()
    welcomeMusic.play()

}