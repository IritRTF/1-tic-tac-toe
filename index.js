const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let field;
let currentMove = 0;
let gameOver = false;
let dimension;

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    dimension = +(prompt('Введите размер поля:', 3))
    if (dimension <= 1) {
        alert('Введите размер больше 1')
        startGame()
    }
    gameOver = false;
    renderGrid(dimension);
    field = createField(dimension)
}

function createField(dimension) {
    let field = []
    for (let i = 0; i < dimension; i++) {
        let row = [];
        for (let j = 0; j < dimension; j++) {
            row.push(EMPTY)
        }
        field.push(row)
    }
    return field;
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
    if (field[row][col] === EMPTY && !gameOver) {
        let symbol;
        if (currentMove % 2 == 0) symbol = CROSS;
        else symbol = ZERO;
        renderSymbolInCell(symbol, row, col); 
        field[row][col] = symbol;
        currentMove++;
        checkWinner(symbol);
    }
}

function checkWinner(symbol) {
    if (checkCombinations(symbol)) {
        gameOver = true;
        alert(`Победа: ${symbol}`)
    } else if (currentMove === dimension * dimension) {
        gameOver = true;
        alert('Победила дружба');
    }
}


function checkCombinations(symbol) {
    let firstDiagonal = [];
    let secondDiagonal = [];
    for (let i = 0; i < dimension; i++) {
        let horizontal = [];
        let vertical = [];
        for (let j = 0; j < dimension; j++) {
            if (field[i][j] === symbol) horizontal.push({row: i, col: j});
            if (field[j][i] === symbol) vertical.push({row: j, col: i});
        }
        if (field[i][i] === symbol) firstDiagonal.push({row: i, col: i});
        let reversePoint = dimension - 1 - i;
        if (field[reversePoint][i] === symbol) secondDiagonal.push({row: reversePoint, col: i}); 
        if (checkCondition(horizontal) | 
        checkCondition(vertical) | 
        checkCondition(firstDiagonal) | 
        checkCondition(secondDiagonal)) return true;
        }
        return false;
    }

function checkCondition(line){
    if (dimension === line.length) {
        paintRed(line);
        return true;
    }
    return false;
}

function paintRed(line){
    for (let point of line) {
        let paint = findCell(point.row, point.col);
        paint.style.background = '#ff2400'
        paint.style.color = '#fffff'
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
    currentMove = 0;
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
