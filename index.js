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
    if (dimension <= 1) {
        alert('Размер поля должен быть больше 1')
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
        for (let j = 0; j < dimension; j++) {row.push(EMPTY)}
        board.push(row)
    }
    return board;
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

const cellClickHandler = (row, col) => {
    if (gameContinues && board[row][col] === EMPTY) {
      const currentSymbol = actionCounter % 2 === 0 ? CROSS : ZERO;
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
function highlightCells(points) {
    for (let point of points) {
        const targetCell = findCell(point.row, point.col);
        if (targetCell) {
            targetCell.style.background = '#e9159f';
            targetCell.style.color = '#ffffff';
        }
    }
}
function checkWinningConditions(points) {
    if (dimension === points.length) {
        highlightCells
    (points)
        return true;
    }
    return false;
}
function checkCombinations(symbol) {
    let mainDiagonal = [];
    let reverseDiagonal = [];
    let verticals = new Array(dimension).fill([]);
    let horizontals = new Array(dimension).fill([]);
    
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (board[i][j] === symbol) {
                horizontals[i] = [...horizontals[i], {row: i, col: j}];
                verticals[j] = [...verticals[j], {row: i, col: j}];
            }
        }
        if (board[i][i] === symbol) {
            mainDiagonal.push({row: i, col: i});
        }
        let reversePoint = dimension - 1 - i;
        if (board[reversePoint][i] === symbol) {
            reverseDiagonal.push({row: reversePoint, col: i});
        }
    }
    
    if (checkWinningConditions
    (mainDiagonal) || checkWinningConditions
(reverseDiagonal)) {
        return true;
    }
    
    for (let i = 0; i < dimension; i++) {
        if (checkWinningConditions
        (verticals[i]) || checkWinningConditions
    (horizontals[i])) {
            return true;
        }
    }
    
    return false;
}
function getWinningCombination(symbol) {
    let mainDiagonal = [];
    let reverseDiagonal = [];
    let verticals = new Array(dimension).fill([]);
    let horizontals = new Array(dimension).fill([]);

    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < dimension; j++) {
            if (board[i][j] === symbol) {
                horizontals[i] = [...horizontals[i], {row: i, col: j}];
                verticals[j] = [...verticals[j], {row: i, col: j}];
            }
        }
        if (board[i][i] === symbol) {
            mainDiagonal.push({row: i, col: i});
        }
        let reversePoint = dimension - 1 - i;
        if (board[reversePoint][i] === symbol) {
            reverseDiagonal.push({row: reversePoint, col: i});
        }
    }

    if (checkWinningConditions
    (mainDiagonal)) {
        return mainDiagonal;
    } else if (checkWinningConditions
    (reverseDiagonal)) {
        return reverseDiagonal;
    }

    for (let i = 0; i < dimension; i++) {
        if (checkWinningConditions
        (verticals[i])) {
            return verticals[i];
        } else if (checkWinningConditions
        (horizontals[i])) {
            return horizontals[i];
        }
    }

    return [];
}
function checkWinner(symbol) {
    if (checkCombinations(symbol)) {
        gameContinues = false;
        alert(`Победитель - ${symbol}`);
        highlightCells
    (getWinningCombination(symbol));
    } else if (actionCounter === dimension * dimension) {
        gameContinues = false;
        alert('Победила дружба');
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