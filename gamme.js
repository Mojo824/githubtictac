const boardElement = document.getElementById("board");
const restartButton = document.getElementById("restartBtn");
const backToHomeButton = document.getElementById("backToHomeBtn");
const twoPlayerButton = document.getElementById("two-player");
const computerPlayerButton = document.getElementById("computer-player");
const difficultyOptions = document.getElementById("difficulty-options");

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let currentPlayer = 'X';
let gameOver = false;
let isComputer = false;
let difficulty = 1; // Default to Easy level (1)

// Create the game board cells
function createBoard() {
    boardElement.innerHTML = '';
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        }
    }
}

// Handle cell click
function handleCellClick(e) {
    if (gameOver) return;

    const cell = e.target;
    const row = cell.dataset.row;
    const col = cell.dataset.col;

    if (board[row][col] !== '') return;  // Ignore if the cell is already filled

    board[row][col] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());

    if (checkWinner()) {
        setTimeout(() => alert(`${currentPlayer} wins!`), 100);
        gameOver = true;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';  // Switch players
        if (isComputer && currentPlayer === 'O') {
            setTimeout(computerMove, 500);  // Delay for computer move
        }
    }
}

// Check if a player has won
function checkWinner() {
    // Check rows, columns, and diagonals
    for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) return true;  // Row
        if (board[0][i] && board[0][i] === board[1][i] && board[1][i] === board[2][i]) return true;  // Column
    }

    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) return true;  // Diagonal
    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) return true;  // Diagonal

    return false;
}

// Computer move
function computerMove() {
    if (gameOver) return;

    let bestMove = null;
    let bestScore = -Infinity;

    // AI logic: Based on difficulty, use random moves for easy, and minimax for hard
    if (difficulty === 1) {
        // Easy AI: Random move
        const availableMoves = getAvailableMoves();
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        board[randomMove.row][randomMove.col] = 'O';
        const cell = document.querySelector(`[data-row="${randomMove.row}"][data-col="${randomMove.col}"]`);
        cell.textContent = 'O';
        cell.classList.add('o');
        currentPlayer = 'X';
    } else {
        // Hard AI: Minimax Algorithm
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === '') {
                    board[row][col] = 'O';
                    const score = minimax(board, false);
                    board[row][col] = '';
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { row, col };
                    }
                }
            }
        }
        if (bestMove) {
            board[bestMove.row][bestMove.col] = 'O';
            const cell = document.querySelector(`[data-row="${bestMove.row}"][data-col="${bestMove.col}"]`);
            cell.textContent = 'O';
            cell.classList.add('o');
            currentPlayer = 'X';
        }
    }

    if (checkWinner()) {
        setTimeout(() => alert("Computer wins!"), 100);
        gameOver = true;
    }
}

// Get available moves
function getAvailableMoves() {
    const availableMoves = [];
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === '') {
                availableMoves.push({ row, col });
            }
        }
    }
    return availableMoves;
}

// Minimax algorithm for AI (Hard mode)
function minimax(board, isMaximizing) {
    if (checkWinner()) return isMaximizing ? -1 : 1;
    if (board.flat().every(cell => cell !== '')) return 0; // Tie

    let bestScore = isMaximizing ? -Infinity : Infinity;

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            if (board[row][col] === '') {
                board[row][col] = isMaximizing ? 'O' : 'X';
                const score = minimax(board, !isMaximizing);
                board[row][col] = '';
                bestScore = isMaximizing
                    ? Math.max(score, bestScore)
                    : Math.min(score, bestScore);
            }
        }
    }
    return bestScore;
}

// Reset the game
function resetGame() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    currentPlayer = 'X';
    gameOver = false;
    createBoard();
    document.getElementById("board").style.display = "grid";
    document.getElementById("restartBtn").style.display = "inline-block";
    document.getElementById("backToHomeBtn").style.display = "none";
}

// Go back to home screen
function goBackHome() {
    document.querySelector('.game-options').style.display = "block";
    difficultyOptions.style.display = "none";
    document.getElementById("board").style.display = "none";
    document.getElementById("restartBtn").style.display = "none";
    document.getElementById("backToHomeBtn").style.display = "none";
}

// Event listeners for game mode selection
twoPlayerButton.addEventListener('click', () => {
    isComputer = false;
    document.querySelector('.game-options').style.display = "none";
    document.getElementById("board").style.display = "grid";
    document.getElementById("restartBtn").style.display = "inline-block";
    document.getElementById("backToHomeBtn").style.display = "inline-block";
    createBoard();
});

computerPlayerButton.addEventListener('click', () => {
    isComputer = true;
    difficultyOptions.style.display = "block";
});

// Difficulty selection event listener
document.querySelectorAll('.difficulty-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        difficulty = parseInt(e.target.dataset.level);
        difficultyOptions.style.display = "none";
        document.querySelector('.game-options').style.display = "none";
        document.getElementById("board").style.display = "grid";
        document.getElementById("restartBtn").style.display = "inline-block";
        document.getElementById("backToHomeBtn").style.display = "inline-block";
        createBoard();
        setTimeout(computerMove, 500);  // Computer makes the first move
    });
});

// Inner restart button
restartButton.addEventListener('click', resetGame);

// Back to Home button
backToHomeButton.addEventListener('click', goBackHome);
