const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let isAI;
let dimension;
let occupiedCells;
let gameField;
let activePlayer;
let winner;
let meta;


startGame();
addResetListener();

function generateGrid (dimension) {
    let field = new Array()
    for (let i = 0; i < dimension; i++) {
        field.push([])
        for (let j = 0; j < dimension; j++) {
            field[i].push({ value: EMPTY, x: i, y: j})
        }
    }
    return field
}

function func(el) {
    if (el.value === CROSS) this.cross++ 
    if (el.value === ZERO) this.zero++

}
function func2() { 
    return this.cross + this.zero === dimension 
}

function generateMeta (dimension, gameField) {
    let meta = {
        lines: [],
        columns: [],
        diagonals: [],
    }

    meta.diagonals.push({ cross: 0,  zero: 0, add: func, isFull: func2, elements: []})
    meta.diagonals.push({ cross: 0,  zero: 0, add: func, isFull: func2, elements: []})

    for (let i = 0; i < dimension; i++) {
        meta.lines.push({ cross: 0,  zero: 0, add: func, isFull: func2, elements: gameField[i]})
        meta.columns.push({ cross: 0,  zero: 0, add: func, isFull: func2, elements: gameField.map(item => item[i])})

        meta.diagonals[0].elements.push(gameField[i][i])
        meta.diagonals[1].elements.push(gameField[i][dimension - 1 - i])
    }
    return meta
}

function startGame () {
    isAI = confirm('Включить искусственный интеллект?');
    dimension = prompt('Укажите размер поля:', 3);
    gameField = generateGrid (dimension);
    meta = generateMeta(dimension, gameField);
    occupiedCells = 0;
    renderGrid(dimension);
    activePlayer = CROSS
    winner = EMPTY
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
    if (winner != EMPTY) return

    if (gameField[row][col].value == EMPTY) {
        console.log(gameField[row][col].value == EMPTY);
        makeMove (gameField[row][col])
    

    if (winner != EMPTY || occupiedCells === Math.pow(dimension, 2)) return

    if (occupiedCells >= Math.pow(dimension, 2) / 2) expandField()

    if (isAI) makeAIMove()
    }
}

function makeMove (cell) {
    renderSymbolInCell(activePlayer, cell.x, cell.y);
    cell.value = activePlayer

    meta.lines[cell.x].add(cell)
    meta.columns[cell.y].add(cell)
    occupiedCells++;

    if (cell.x === cell.y) meta.diagonals[0].add(cell)
    if (cell.x === gameField.length - 1 - cell.y) meta.diagonals[1].add(cell)

    activePlayer = activePlayer === CROSS ? ZERO : CROSS

    winner = checkingWinner ()
    if (winner != EMPTY) {
        for (let i = 0; i < gameField.length; i++) renderSymbolInCell (winner[i].value, winner[i].x, winner[i].y, color = '#F00')
        setTimeout(() => alert(`Победили ${winner[0].value} !!!`), 3)
    }
    else if (occupiedCells === Math.pow(dimension, 2)) setTimeout(() => alert(`Победила дружба !!!`), 3)
}

function makeAIMove () {
    for (let i = 0; i < Object.values(meta).length; i++) {
        for (let j = 0; j < Object.values(meta)[i].length; j++) {
            if (Object.values(meta)[i][j].zero === gameField.length - 1 && Object.values(meta)[i][j].cross === 0) 
            {
                makeMove(Object.values(meta)[i][j].elements.find((el) => el.value === EMPTY));
                return;
            }
        }
    }

    randomMas = []
    for (let i = 0; i < Object.values(meta).length; i++) {
        for (let j = 0; j < Object.values(meta)[i].length; j++) {
            if (Object.values(meta)[i][j].cross + Object.values(meta)[i][j].zero !== gameField.length) 
            {
                randomMas.push(Object.values(meta)[i][j].elements.find((el) => el.value === EMPTY));
            }
        }
    }
    makeMove(randomMas[randomInteger(0, randomMas.length - 1)])

}

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function checkingWinner () {
    for (let i = 0; i < Object.values(meta).length; i++) {
        for (let j = 0; j < Object.values(meta)[i].length; j++) {
            if (Object.values(meta)[i][j].cross === gameField.length || Object.values(meta)[i][j].zero === gameField.length) 
                return Object.values(meta)[i][j].elements;
        }
    }
    return EMPTY
}

function expandField () {
    dimension = +dimension + 2;
    let gameField2 = generateGrid (dimension);
    let meta2 = generateMeta(dimension, gameField2)

    for (let i = 0; i < dimension - 2; i++) {
        for (let j = 0; j < dimension - 2; j++) {
            gameField2[i + 1][j + 1].value = gameField[i][j].value
            meta2.lines[i + 1].add(gameField2[i + 1][j + 1])
            meta2.columns[i + 1].add(gameField2[j + 1][i + 1])
        }
        meta2.diagonals[0].add(gameField2[i + 1][i + 1])
        meta2.diagonals[1].add(gameField2[i + 1][dimension - 2 - i])
    }
    console.log(meta)
    console.log(meta2)

    gameField = gameField2
    meta = meta2
    renderGrid(dimension)

    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension ; j++) {
            renderSymbolInCell(gameField[i][j].value, gameField[i][j].x, gameField[i][j].y)
        }
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
    startGame()
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
