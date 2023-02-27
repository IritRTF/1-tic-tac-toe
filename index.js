const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let board;
let dimension;
let actionCounter = 0;
let gameContinues = true;

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();


function startGame() {
    dimension = Number(prompt('Введите размер поля:', 3))
    if (dimension < 1){
        alert('Введите число > 1')
        startGame()
    }
    gameContinues = true;
    board = createBoard(dimension);
    renderGrid(dimension);
}

function createBoard(dimension) {
    let board = []
    for (let i = 0; i < dimension; i++) {
        let row = [];
        for (let j = 0; j < dimension; j++) {
            row.push(EMPTY)
        }
        board.push(row)
    }
    return board;
}

function renderGrid(dimension) {
    container.clear;
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
    console.log(`Clicked on cell: ${row}, ${col}`);
    if (gameContinues && board[row][col] === EMPTY) {
        let currentSymbol;
        if (actionCounter % 2 === 0) {
            currentSymbol = CROSS;
        } else {
            currentSymbol = ZERO;
        }
        board[row][col] = currentSymbol;
        renderSymbolInCell(currentSymbol, row, col);
        actionCounter++;
        checkWinner(currentSymbol);

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
    startGame()
    actionCounter = 0;
    console.log('reset!');
}

function decorateCell(points) {
    for (let point of points) {
        const targetCell = findCell(point.row, point.col);
        targetCell.style.background = '#900'
        targetCell.style.color = '#999'
    }
}

function checkConditions(points) {
    if (dimension === points.length) {
        decorateCell(points)
        return true;
    }
    return false;
}

function checkCombinations(symbol) {
    let mainDiagonal = [];
    let reverseDiagonal = [];
    for (let i = 0; i < dimension; i++) {
        let vertical = [];
        let horizontal = [];
        for (let j = 0; j < dimension; j++) {
            if (board[i][j] === symbol) {
                horizontal.push({row: i, col: j});
            }
            if (board[j][i] === symbol) {
                vertical.push({row: j, col: i});
            }
        }
        if (board[i][i] === symbol) {
            mainDiagonal.push({row: i, col: i})
        }
        let reversPoint = dimension - 1 - i;
        if (board[reversPoint][i] === symbol) {
            reverseDiagonal.push({row: reversPoint, col: i})
        }
        if (checkConditions(mainDiagonal) |
            checkConditions(reverseDiagonal) |
            checkConditions(vertical) |
            checkConditions(horizontal)) {
            return true
        }
    }
    return false;
}

function checkWinner(symbol) {
    if (checkCombinations(symbol)) {
        gameContinues = false;
        alert(`Победитель - ${symbol}`)
    } else if (actionCounter === dimension * dimension) {
        gameContinues = false;
        alert('Победила дружба')
    }
}


/* Test Function */

/* Победа первого игрока */
function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

/* Ничья */
function testDraw() {
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

function clickOnCell(row, col) {
    findCell(row, col).click();
}
