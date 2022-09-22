const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const RED_COLOR = '#F00'

const UPLEFT = [-1, -1];
const UP = [-1, 0];
const UPRIGHT = [-1, 1];
const RIGHT = [0, 1];
const DOWNRIGHT = [1, 1];
const DOWN = [1, 0];
const DOWNLEFT = [1, -1];
const LEFT = [0, -1];

const VECTORS = [UPLEFT, UP, UPRIGHT, RIGHT, DOWNRIGHT, DOWN, DOWNLEFT, LEFT]; 

const container = document.getElementById('fieldWrapper');

let field = [];
let fieldSize = 3;
let moveCounter = 0;
let isGameOver = false;
let isTurnedOnBasicAI = false;
let isTurnedOnAdvancedAI = false;

startGame();
addResetListener();

function getRandomInteger (max) {
    return Math.floor(Math.random() * max);
}

function getSymbol (moveCounter) {
    return moveCounter % 2 == 0 ? CROSS: ZERO;
}

function copyArray (array) {
    return JSON.parse(JSON.stringify(array));
}

function isNotOutOfBounds (cell) {
    return cell[0] >= 0 && cell[0] < fieldSize && cell[1] >= 0 && cell[1] < fieldSize;
}

function getEmptyCells () {
    let result = [];
    for (let i = 0; i < fieldSize; ++i) {
        for (let j = 0; j < fieldSize; ++j) {
            if (field[i][j] === EMPTY) result.push([i, j]);
        }
    }
    return result;
}

function getSameNeighbourCells (x, y) {
    let neighbourCells = [];
    for (let vector of VECTORS) {
        neighbourCells.push([x + vector[0], y + vector[1]]);
    }
    let result = [];
    for (let cell of neighbourCells) {
        if (isNotOutOfBounds(cell)) result.push(cell);
    }
    return result;
}

function getStartFieldSize () {
    let result = '';
    result = prompt('Введите стартовое значение размера поля.', 3);
    while (isNaN(result) || +result < 3) {
        result = prompt('Не получилось. Введите число большее или равное трём.', 3);
    }
    return result;
}

function createField (fieldSize) {
    for (let i = 0; i < fieldSize; ++i) {
        let array = []
        for (let j = 0; j < fieldSize; ++j) {
            array.push(EMPTY);
        }
        field.push(array);
    }
}

function extendField () {
    let array = []
    for (let i = 0; i < fieldSize; ++i) {
        array.push(EMPTY);
    }
    field.push(array);
    for (let i = 0; i <= fieldSize; ++i) {
        field[i][fieldSize] = EMPTY;
    }
    ++fieldSize;
}

function renderExtendedField () {
    extendField();
    renderGrid(fieldSize);
    for (let i = 0; i < fieldSize; ++i) {
        for (let j = 0; j < fieldSize; ++j) {
            renderSymbolInCell(field[i][j], i, j);
        }
    }
}

function turnOnAI() {
    if (confirm('Вы хотите играть против компьютера?')) {
        confirm('Нормальная сложность?') ? isTurnedOnAdvancedAI = true: isTurnedOnBasicAI = true;
    }
}

function startGame () {
    isGameOver = false;
    isTurnedOnBasicAI = false;
    isTurnedOnAdvancedAI = false;
    field = []
    fieldSize = getStartFieldSize();
    moveCounter = 0;
    turnOnAI();
    createField(fieldSize)
    renderGrid(fieldSize);
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
    // Пиши код тут
    let symbol = getSymbol(moveCounter);
    if (field[row][col] == EMPTY && !isGameOver) {
        field[row][col] = symbol;
        renderSymbolInCell(symbol, row, col);
        ++moveCounter;
        checkGameStatus(moveCounter);
    }
    console.log(`Clicked on cell: ${row}, ${col}`);


    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
}

function basicAIMove () {
    let emptyCells = getEmptyCells();
    let randomEmptyCell = emptyCells[getRandomInteger(emptyCells.length - 1)]
    clickOnCell(randomEmptyCell[0], randomEmptyCell[1]);
}

function advancedAIMove () {
    let localField;
    let emptyCells = getEmptyCells();
    let emptyCell;
    let winner;
    for (emptyCell of emptyCells) {
        localField = copyArray(field);
        localField[emptyCell[0]][emptyCell[1]] = CROSS;
        winner = findTheWinner(localField);
        if (winner !== null) break;
    }
    if (winner !== null) {
        clickOnCell(emptyCell[0], emptyCell[1]);
    } else {
        localField;
        emptyCells = getEmptyCells();
        emptyCell = [];
        for (emptyCell of emptyCells) {
            localField = copyArray(field);
            localField[emptyCell[0]][emptyCell[1]] = ZERO;
            let winner = findTheWinner(localField);
            if (winner !== null) break;
        }
        if (winner !== null) {
            clickOnCell(emptyCell[0], emptyCell[1]);
        } else {
            basicAIMove();
        }
    }
}

function findTheWinner (field) {
    for (let i = 0; i < fieldSize; ++i) {
        for (let j = 0; j < fieldSize; ++j) {
            if (field[i][j] !== EMPTY) {
                let neighbourCells = getSameNeighbourCells(i, j);
                for (let neighbourCell of neighbourCells) {
                    let vector = [neighbourCell[0] - i, neighbourCell[1] - j];
                    if (field[i][j] === field[neighbourCell[0]][neighbourCell[1]]) {
                        let nextCell = [neighbourCell[0] + vector[0], neighbourCell[1] + vector[1]];
                        if (isNotOutOfBounds(nextCell) && field[i][j] === field[nextCell[0]][nextCell[1]]) {
                            return [[i, j], [neighbourCell[0], neighbourCell[1]], [nextCell[0], nextCell[1]]];
                        }
                    }
                }
            }
        }
    }
    return null;
}

function checkGameStatus (moveCounter) {
    let winner;
    console.log(fieldSize ** 2 / 2);
    console.log(moveCounter);
    if (fieldSize ** 2 == moveCounter) {
        alert('Победила дружба')
        isGameOver = true
    } else if ((winner = findTheWinner(field)) !== null) {
        let symbol = field[winner[0][0]][winner[0][1]];
        renderVictorySymbols(symbol, winner, RED_COLOR);
        alert(`Победил ${symbol}`);
        isGameOver = true;
    } else if (moveCounter > fieldSize ** 2 / 2) {
        renderExtendedField();
    }
    if ((isTurnedOnBasicAI || isTurnedOnAdvancedAI) && !isGameOver && getSymbol(moveCounter) === ZERO) {
        if (isTurnedOnAdvancedAI) {
            advancedAIMove();
        } else {
            basicAIMove();
        }
    }
}

function renderVictorySymbols (symbol, winner, color) {
    renderSymbolInCell(symbol, winner[0][0], winner[0][1], color);
    renderSymbolInCell(symbol, winner[1][0], winner[1][1], color);
    renderSymbolInCell(symbol, winner[2][0], winner[2][1], color);
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
    startGame();
    console.log('reset!');
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
