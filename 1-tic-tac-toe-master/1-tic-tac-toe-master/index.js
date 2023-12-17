// Ваш JS-код
const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const container = document.getElementById('fieldWrapper');
let gridSize = 3; // Размер поля

startGame();
addResetListener();

function startGame() {
    gridSize = parseInt(document.getElementById('gridSizeInput').value) || gridSize;
    renderGrid(gridSize);
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
    const targetCell = findCell(row, col);

    if (targetCell.textContent === EMPTY) {
        renderSymbolInCell(CROSS, row, col);
        if (checkWinner(CROSS)) {
            alert('Выиграл игрок X!');
            highlightWinningCells(CROSS);
            disableClickHandlers();
        } else if (isBoardFull()) {
            alert('Победила дружба!');
            disableClickHandlers();
        } else {
            // Искусственный интеллект (нолик)
            aiMove();
        }
    }
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
    const gridSizeInput = document.getElementById('gridSizeInput');
    gridSizeInput.value = '';
    startGame();
}

function checkWinner(symbol) {
    // Проверка по горизонтали, вертикали и диагоналям
    for (let i = 0; i < gridSize; i++) {
        if (
            checkRow(i, symbol) ||
            checkColumn(i, symbol) ||
            checkDiagonal(symbol)
        ) {
            return true;
        }
    }
    return false;
}

function checkRow(row, symbol) {
    for (let i = 0; i < gridSize; i++) {
        if (findCell(row, i).textContent !== symbol) {
            return false;
        }
    }
    return true;
}

function checkColumn(col, symbol) {
    for (let i = 0; i < gridSize; i++) {
        if (findCell(i, col).textContent !== symbol) {
            return false;
        }
    }
    return true;
}

function checkDiagonal(symbol) {
    let mainDiagonal = true;
    let antiDiagonal = true;

    for (let i = 0; i < gridSize; i++) {
        if (findCell(i, i).textContent !== symbol) {
            mainDiagonal = false;
        }
        if (findCell(i, gridSize - 1 - i).textContent !== symbol) {
            antiDiagonal = false;
        }
    }

    return mainDiagonal || antiDiagonal;
}

function isBoardFull() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (findCell(i, j).textContent === EMPTY) {
                return false;
            }
        }
    }
    return true;
}

function highlightWinningCells(symbol) {
    for (let i = 0; i < gridSize; i++) {
        if (checkRow(i, symbol)) {
            for (let j = 0; j < gridSize; j++) {
                findCell(i, j).style.backgroundColor = 'red';
            }
        } else if (checkColumn(i, symbol)) {
            for (let j = 0; j < gridSize; j++) {
                findCell(j, i).style.backgroundColor = 'red';
            }
        } else if (checkDiagonal(symbol)) {
            for (let j = 0; j < gridSize; j++) {
                findCell(j, j).style.backgroundColor = 'red';
            }
        }
    }
}

function disableClickHandlers() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            findCell(i, j).removeEventListener('click', () => cellClickHandler(i, j));
        }
    }
}

// Искусственный интеллект (нолик)
function aiMove() {
    const emptyCells = [];

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (findCell(i, j).textContent === EMPTY) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }

    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { row, col } = emptyCells[randomIndex];
        renderSymbolInCell(ZERO, row, col);

        if (checkWinner(ZERO)) {
            alert('Выиграл игрок O!');
            highlightWinningCells(ZERO);
            disableClickHandlers();
        } else if (isBoardFull()) {
            alert('Победила дружба!');
            disableClickHandlers();
        }
    }
}
