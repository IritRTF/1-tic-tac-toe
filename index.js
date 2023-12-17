const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
let currentPlayer = CROSS;
let boardSize = 3; 
let maxBoardSize = 10; 
let board = [];

startGame();
addResetListener();

function startGame() {
    if (boardSize < 3 || boardSize > maxBoardSize) {
        alert('Invalid board size. Please enter a size between 3 and 10.');
        return;
    }

    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(EMPTY));
    renderGrid(boardSize);
    enableCellClick();
}

function renderGrid(dimension) {
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler(row, col) {
    if (board[row][col] === EMPTY) {
        renderSymbolInCell(currentPlayer, row, col);
        board[row][col] = currentPlayer;

        if (checkWinner()) {
            endGame(currentPlayer);
            disableCellClick();
        } else if (isBoardFull()) {
            endGame(null);
            disableCellClick();
        } else {
            currentPlayer = (currentPlayer === CROSS) ? ZERO : CROSS;

            if (currentPlayer === ZERO) {
                aiMakeMove();
            }

            
            if (isBoardMoreThanHalfFull()) {
                expandBoard();
            }
        }
    }
}

function isBoardMoreThanHalfFull() {
    const totalCells = boardSize * boardSize;
    const filledCells = board.reduce((acc, row) => acc + row.filter(cell => cell !== EMPTY).length, 0);
    return filledCells > totalCells / 2;
}

function expandBoard() {
    if (boardSize >= maxBoardSize) {
        return; 
    }

    
    board.unshift(Array(boardSize).fill(EMPTY));
    board.push(Array(boardSize).fill(EMPTY));

   
    for (let i = 0; i < boardSize + 2; i++) {
        board[i].unshift(EMPTY);
        board[i].push(EMPTY);
    }

   
    boardSize += 2;
    renderGrid(boardSize);
    enableCellClick();
}

function renderSymbolInCell(symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);
    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell(row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler() {
    const newSize = prompt('Enter the new board size (between 3 and 10):');
    if (newSize && !isNaN(newSize) && newSize >= 3 && newSize <= maxBoardSize) {
        boardSize = parseInt(newSize, 10);
        startGame();
    } else {
        alert('Invalid input. Please enter a size between 3 and 10.');
    }
}

function disableCellClick() {
    container.querySelectorAll('td').forEach(cell => {
        cell.removeEventListener('click', cellClickHandler);
    });
}

function enableCellClick() {
    container.querySelectorAll('td').forEach(cell => {
        cell.addEventListener('click', () => cellClickHandler(...getCellIndex(cell)));
    });
}

function getCellIndex(cell) {
    const row = [...cell.parentElement.parentElement.children].indexOf(cell.parentElement);
    const col = [...cell.parentElement.children].indexOf(cell);
    return [row, col];
}

function checkWinner() {
    for (let i = 0; i < boardSize; i++) {
        if (checkLine(i, 0, i, boardSize - 1) || checkLine(0, i, boardSize - 1, i)) {
            return true;
        }
    }

    if (checkLine(0, 0, boardSize - 1, boardSize - 1) || checkLine(0, boardSize - 1, boardSize - 1, 0)) {
        return true;
    }

    return false;
}

function checkLine(row1, col1, row2, col2) {
    return board[row1][col1] !== EMPTY && board[row1][col1] === board[row2][col2] && board[row1][col1] === board[row2][col2];
}

function isBoardFull() {
    return board.every(row => row.every(cell => cell !== EMPTY));
}

function endGame(winner) {
    if (winner) {
        alert(`Winner: ${winner}`);
    } else {
        alert('The game ended in a draw');
    }
}

function aiMakeMove() {
    const emptyCells = [];
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j] === EMPTY) {
                emptyCells.push([i, j]);
            }
        }
    }

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const [row, col] = emptyCells[randomIndex];
        setTimeout(() => cellClickHandler(row, col), 300);
    }
}
