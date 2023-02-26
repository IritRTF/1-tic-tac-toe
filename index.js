const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let actionNumber = 0;
const container = document.getElementById('fieldWrapper');
let dimension;
let board;

startGame();
addResetListener();

function initBoard(dimension) {
    const board = []
    for (let i = 0; i < dimension; i++) {
        const col = []
        for (let j = 0; j < dimension; j++) {
            col.push(EMPTY)
        }
        board.push(col)
    }
    console.log([true, true].all())
    return board;
}

function getDimension() {
    return Number(prompt('Введите размер поля: '))
}

function startGame() {
    dimension = getDimension()
    board = initBoard(dimension)
    renderGrid(dimension);
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
    // Пиши код тут
    let currentSymbol = ((actionNumber % 2) === 0) ? CROSS : ZERO;
    if (board[row][col] === EMPTY) {
        board[row][col] = currentSymbol;
        actionNumber++;
        renderSymbolInCell(currentSymbol, row, col)
    } else {
        console.log('cell is busy')
    }
    checkGame(currentSymbol, row, col);
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
    actionNumber = 0;
    //renderGrid(dimension);
    startGame()
}


function checkGame(symbol, row, col) {
    let isWin = false;
    // if ((row === 0 && col === 0) || (row === dimension && col == dimension)) {
    //     let checkDiagonal = true;
    //     for (let i = 0; i < dimension; i++) {
    //         if ((board[i][i] !== symbol)){
    //             checkDiagonal = false;
    //             break;
    //         }
    //         isWin = checkDiagonal;
    //     }
    // } else if ((row === 0 && col === dimension) || (row === dimension && col == 0)){
    //     for (let i =0; i< dimension; i++){
    //         let checkDiagonal = true;
    //         for (let i = 0; i < dimension; i++) {
    //             if ((board[i][dimension-1-i] !== symbol)){
    //                 checkDiagonal = false;
    //                 break;
    //             }
    //             isWin = checkDiagonal;
    //         }
    //     }
    // } else {
    //     let onVertical = true;
    //     let onHorizontal = true;
    //     for (let i = 0; i < dimension; i++) {
    //         onVertical = onVertical && (board[row][i] === symbol) ? true : false;
    //         onHorizontal = onHorizontal && (board[i][row] === symbol) ? true : false;
    //     }
    //     isWin = onHorizontal || onVertical;
    // }
    if (isWin) {
        alert(`Победила команда: ${symbol}`);
    }
    if (actionNumber === dimension * dimension) {
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
