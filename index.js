const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let countOfMove;

let isGameActive;

let sizeGrid;

const symbolDictionary = {
    'X': 'крестики', 'O': 'нолики'
};

const container = document.getElementById('fieldWrapper');

let gameBoard;

startGame();
addResetListener();

function makeGameBoard() {
    gameBoard = [];
    for (let i = 0; i < sizeGrid; i++) {
        let row = [];
        for (let j = 0; j < sizeGrid; j++) {
            row.push(EMPTY);
        }
        gameBoard.push(row);
    }
}

function getRandomMove(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function startGame() {
    sizeGrid = prompt('Введите размер поля', [3]);
    renderGrid(sizeGrid);
    isGameActive = true
    countOfMove = 0
}

function stopGame() {
    isGameActive = false
}



function renderGrid(dimension) {
    container.innerHTML = '';
    makeGameBoard()

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

function isFreeCell(row, col) { // my
    if (gameBoard[row][col] == EMPTY) {
        return true;
    }
    return false;
}

//function getWinner(countOfCross, countOfZero, symbol) { }

function findWinner(symbol) {
    for (let i = 0; i < sizeGrid; i++) {
        let countOfCross = 0
        let countOfZero = 0
        for (let j = 0; j < sizeGrid; j++) {
            if (gameBoard[i][j] == CROSS) {
                countOfCross += 1
                if (countOfCross == sizeGrid) {
                    alert(`Победили ${symbolDictionary[symbol]}`)
                    stopGame()
                    break
                }
            }
            else if (gameBoard[i][j] == ZERO) {
                countOfZero += 1
                if (countOfZero == sizeGrid) {
                    alert(`Победили ${symbolDictionary[symbol]}`)
                    stopGame()
                    break
                }
            }
        }
    }

    for (let i = 0; i < sizeGrid; i++) {
        let countOfCross = 0
        let countOfZero = 0
        for (let j = 0; j < sizeGrid; j++) {
            if (gameBoard[j][i] == CROSS) {
                countOfCross += 1
                if (countOfCross == sizeGrid) {
                    alert(`Победили ${symbolDictionary[symbol]}`)
                    stopGame()
                    break
                }
            }
            else if (gameBoard[j][i] == ZERO) {
                countOfZero += 1
                if (countOfZero == sizeGrid) {
                    alert(`Победили ${symbolDictionary[symbol]}`)
                    stopGame()
                    break
                }
            }
        }
    }

    countOfCross = 0
    countOfZero = 0
    for (let i = 0; i < sizeGrid; i++) {

        if (gameBoard[i][i] == ZERO) {
            countOfZero += 1
            if (countOfZero == sizeGrid) {
                alert(`Победили ${symbolDictionary[symbol]}`)
                stopGame()
                break
            }
        }
        else if (gameBoard[i][i] == CROSS) {
            countOfCross += 1
            if (countOfCross == sizeGrid) {
                alert(`Победили ${symbolDictionary[symbol]}`)
                stopGame()
                break
            }
        }
    }
    countOfCross = 0
    countOfZero = 0
    for (let i = 0; i < sizeGrid; i++) {

        if (gameBoard[i][sizeGrid - i - 1] == ZERO) {
            countOfZero += 1
            if (countOfZero == sizeGrid) {
                alert(`Победили ${symbolDictionary[symbol]}`)
                stopGame()
                break
            }
        }
        else if (gameBoard[i][sizeGrid - i - 1] == CROSS) {
            countOfCross += 1
            if (countOfCross == sizeGrid) {
                alert(`Победили ${symbolDictionary[symbol]}`)
                stopGame()
                break
            }
        }
    }

}

function makeMove(symbol, row, col) {
    if (isFreeCell(row, col) && isGameActive) {
        renderSymbolInCell(symbol, row, col);
        gameBoard[row][col] = symbol;
        countOfMove++
        findWinner(symbol)
    }
}

function cellClickHandler(row, col) {
    let symbol;
    if (countOfMove % 2 == 0) {
        symbol = CROSS;
        makeMove(symbol, row, col)
    }
    else {
        symbol = ZERO;
        makeMove(symbol, getRandomMove(0, sizeGrid), getRandomMove(0, sizeGrid))
    }
    countOfMove == sizeGrid ** 2 ? alert("Ничья") : '';

    console.log(`Clicked on cell: ${row}, ${col}`);


    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
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
    console.log('reset!');
    stopGame()
    startGame()
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