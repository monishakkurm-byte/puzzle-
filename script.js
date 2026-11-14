// =====================================
// THE REPUBLIC OF PUZZLES
// Ancient Roman Sliding Puzzle
// =====================================

const puzzle = document.getElementById("puzzle");

const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const message = document.getElementById("message");

const shuffleBtn = document.getElementById("shuffleBtn");
const restartBtn = document.getElementById("restartBtn");

const SIZE = 4;
const TOTAL = SIZE * SIZE;

const romanNumerals = [
    "I", "II", "III", "IV",
    "V", "VI", "VII", "VIII",
    "IX", "X", "XI", "XII",
    "XIII", "XIV", "XV"
];

let board = [];
let moves = 0;

let seconds = 0;
let timerInterval = null;

let gameStarted = false;
let gameWon = false;

// =====================================
// INITIALIZE GAME
// =====================================

function initializeGame() {

    board = [];

    for (let i = 1; i < TOTAL; i++) {
        board.push(i);
    }

    board.push(0);

    moves = 0;
    seconds = 0;

    gameStarted = false;
    gameWon = false;

    stopTimer();

    updateStats();

    message.textContent =
        "The challenge awaits. Restore the Senate Seal!";

    renderPuzzle();
}

// =====================================
// DISPLAY PUZZLE
// =====================================

function renderPuzzle() {

    puzzle.innerHTML = "";

    board.forEach((value, index) => {

        const tile = document.createElement("div");

        tile.classList.add("tile");

        if (value === 0) {

            tile.classList.add("empty");

        } else {

            tile.textContent = romanNumerals[value - 1];

            tile.addEventListener("click", () => {

                moveTile(index);

            });

        }

        puzzle.appendChild(tile);

    });

}

// =====================================
// CHECK VALID MOVES
// =====================================

function getNeighbors(index) {

    const row = Math.floor(index / SIZE);
    const col = index % SIZE;

    const neighbors = [];

    if (row > 0) {
        neighbors.push(index - SIZE);
    }

    if (row < SIZE - 1) {
        neighbors.push(index + SIZE);
    }

    if (col > 0) {
        neighbors.push(index - 1);
    }

    if (col < SIZE - 1) {
        neighbors.push(index + 1);
    }

    return neighbors;

}

// =====================================
// MOVE TILE
// =====================================

function moveTile(index) {

    if (gameWon) return;

    const emptyIndex = board.indexOf(0);

    const validMoves = getNeighbors(emptyIndex);

    if (!validMoves.includes(index)) {

        return;

    }

    if (!gameStarted) {

        gameStarted = true;

        startTimer();

    }

    [board[index], board[emptyIndex]] =
        [board[emptyIndex], board[index]];

    moves++;

    updateStats();

    renderPuzzle();

    checkWin();

}

// =====================================
// SHUFFLE PUZZLE
// =====================================

function shufflePuzzle() {

    stopTimer();

    initializeGame();

    let previousEmpty = -1;

    // Perform many legal moves so the
    // puzzle always remains solvable.

    for (let i = 0; i < 450; i++) {

        const emptyIndex = board.indexOf(0);

        let neighbors = getNeighbors(emptyIndex);

        neighbors = neighbors.filter(
            index => index !== previousEmpty
        );

        const randomIndex =
            neighbors[Math.floor(Math.random() * neighbors.length)];

        previousEmpty = emptyIndex;

        [board[randomIndex], board[emptyIndex]] =
            [board[emptyIndex], board[randomIndex]];

    }

    moves = 0;
    seconds = 0;

    gameStarted = false;
    gameWon = false;

    stopTimer();

    updateStats();

    renderPuzzle();

    message.textContent =
        "The Senate Seal has been scattered. Can you restore it?";

}

// =====================================
// TIMER
// =====================================

function startTimer() {

    if (timerInterval !== null) return;

    timerInterval = setInterval(() => {

        seconds++;

        updateStats();

    }, 1000);

}

function stopTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

}

// =====================================
// UPDATE STATS
// =====================================

function updateStats() {

    movesDisplay.textContent = moves;

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0");

}

// =====================================
// CHECK WIN
// =====================================

function checkWin() {

    for (let i = 0; i < TOTAL - 1; i++) {

        if (board[i] !== i + 1) {

            return false;

        }

    }

    if (board[TOTAL - 1] !== 0) {

        return false;

    }

    gameWon = true;

    stopTimer();

    message.innerHTML =
        "🏛️ VICTORY! 🏛️<br>" +
        "You have restored the Senate Seal!<br>" +
        "Moves: " + moves +
        " | Time: " + timerDisplay.textContent;

    return true;

}

// =====================================
// BUTTON EVENTS
// =====================================

shuffleBtn.addEventListener(
    "click",
    shufflePuzzle
);

restartBtn.addEventListener(
    "click",
    initializeGame
);

// =====================================
// START GAME
// =====================================

initializeGame();

shufflePuzzle();