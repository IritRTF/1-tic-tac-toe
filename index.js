const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

class Field {
    constructor(size = 3) {
        this._size = size;
        this._field = [];
        this._defSymbol = EMPTY;
        this._generateField();
    }

    get emptyCells() {
        const empties = [];
        for (let row = 0; row < this._size; row++) {
            for (let cell = 0; cell < this._size; cell++) {
                if (this._field[row][cell] === this._defSymbol) empties.push([row, cell]);
            }
        }
        return empties;
    }

    get hasEmptyCells() {
        return this.emptyCells.length > 0;
    }

    tryFillCell(row, cell, symbol) {
        if (this._field[row][cell] !== this._defSymbol) return false;
        this._field[row][cell] = symbol;
        return true;
    }

    checkCombinations(row, cell) {
        const symbol = this._field[row][cell];
        return this._checkHorizontal(row, symbol)
            || this._checkVertical(cell, symbol)
            || this._checkDiagonals(row, cell);
    }

    reset() {
        this._generateField();
    }

    _checkHorizontal(row, symbol) {
        const combination = [];
        for (let cell = 0; cell < this._size; cell++) {
            if (this._field[row][cell] !== symbol) return null;
            combination.push([row, cell]);
        }
        return combination;
    }

    _checkVertical(cell, symbol) {
        const compbination = [];
        for (let row = 0; row < this._size; row++) {
            if (this._field[row][cell] !== symbol) return null;
            compbination.push([row, cell]);
        }
        return compbination;
    }

    _checkDiagonals(row, cell) {
        if (!this._isOnMainDiagonal(row, cell) && !this._isOnSecDiagonal(row, cell)) return null;
        const symbol = this._field[row][cell];
        let mainCombination = [];
        let secCombination = [];
        for (let i = 0; i < this._size; i++) {
            for (let j = 0; j < this._size; j++) {
                if (this._isOnMainDiagonal(i, j) && this._field[i][j] === symbol) mainCombination.push([i, j]);
                if (this._isOnSecDiagonal(i, j) && this._field[i][j] === symbol) secCombination.push([i, j]);
            }
        }
        return mainCombination.length === this._size 
            ? mainCombination 
            : secCombination.length === this._size 
            ? secCombination
            : null;
    }

    _isOnMainDiagonal(row, cell) {
        return row === cell;
    }
    _isOnSecDiagonal(row, cell) {
        return row + cell === this._size - 1;
    }

    _generateField() {
        for (let row = 0; row < this._size; row++) {
            this._field[row] = [];
            for (let cell = 0; cell < this._size; cell++) {
                this._field[row][cell] = this._defSymbol;
            }
        }
    }
}
let gameIsOver = false;
let field = null;
const ai = ZERO;

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    const size = parseInt(prompt('Размер поля (по умолчанию 3):')) || 3;
    renderGrid(size);
    field = new Field(size);
    currentPlayer = CROSS;
    gameIsOver = false;
}

function renderGrid (dimension) {
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

function cellClickHandler (row, col) {
    console.log(`Clicked on cell: ${row}, ${col}`);
    if (gameIsOver) return;
    const filled = field.tryFillCell(row, col, currentPlayer);
    if (!filled) return;
    renderSymbolInCell(currentPlayer, row, col);
    const winnerCombo = field.checkCombinations(row, col);
    if (winnerCombo) renderCombination(currentPlayer, winnerCombo, '#f00');
    gameIsOver = winnerCombo || !field.hasEmptyCells;
    if (gameIsOver) showGameOver(winnerCombo ? currentPlayer : null);
    else togglePlayer();
}

function showGameOver(winner = null) {
    setTimeout(() => {
        alert(winner ? `Победил ${winner}` : 'Победила дружба');
    })
}

function togglePlayer() {
    currentPlayer = currentPlayer === CROSS ? ZERO : CROSS;
    if (currentPlayer === ai) aiMove();
}

function aiMove() {
    const index = Math.floor(Math.random() * field.emptyCells.length);
    const cell = field.emptyCells[index];
    cellClickHandler(cell[0], cell[1])
}

function renderCombination(symbol, combination, color = '#333') {
    for (let coords of combination) {
        renderSymbolInCell(symbol, coords[0], coords[1], color);
    }
}

function renderSymbolInCell (symbol, row, col, color = '#333') {
    const targetCell = findCell(row, col);

    targetCell.textContent = symbol;
    targetCell.style.color = color;
}

function findCell (row, col) {
    const targetRow = container.querySelectorAll('tr')[row];
    return targetRow.querySelectorAll('td')[col];
}

function addResetListener () {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    console.log('reset!');
    startGame();
}


/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw () {
    clickOnCell(2, 0);
    clickOnCell(1, 0);
    clickOnCell(1, 1);
    clickOnCell(0, 0);
    clickOnCell(1, 2);
    clickOnCell(1, 2);
    clickOnCell(0, 2);
    clickOnCell(0, 1);
    clickOnCell(2, 1);
    clickOnCell(2, 2);
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
