const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

class Field {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
}

var fieldSize = Number(prompt("Введите размер поля игры", 3));
var freeCellArray = createEmptyArray(fieldSize);
var allCells = new Array(fieldSize);
var curPlayer = CROSS;
var moveCounter = 0;
var isGameOver = false;
var winLine = new Array;

startGame(fieldSize);
addResetListener();

function startGame(size) {
    resetAllCells();
    renderGrid(size);
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
    console.log(`Clicked on cell: ${row}, ${col}`);

    if (!isGameOver && findCell(row, col).textContent == EMPTY) {
        curPlayer = CROSS;
        renderSymbolInCell(curPlayer, row, col);
        allCells[row][col] = curPlayer;
        moveCounter++;
        removeField(new Field(row, col));

        if (moveCounter >= 4)
            checkWin(new Field(row, col));
        checkWinFriendship();

        if (!isGameOver) {
            curPlayer = ZERO;
            var field = freeCellArray[Math.floor(Math.random() * freeCellArray.length)];
            renderSymbolInCell(curPlayer, field.row, field.col);
            moveCounter++;
            removeField(field);
            allCells[field.row][field.col] = curPlayer;

            if (moveCounter >= 4) {
                checkWin(new Field(row, col));
                checkWinFriendship();
            }
        }
    }
    console.log(allCells[row][col]);
}

function checkWinFriendship() {
    if (moveCounter == fieldSize ** 2 && !isGameOver) {
        isGameOver = true;
        alert("Ничья");
    }
}

function checkWin(field) {
    checkWinHorizontal(field.row);
    checkWinVertical(field.col);
    checkWinDiagonal(field.col);
}

function checkWinHorizontal(row) {
    var flag = true;
    for (let i = 0; i < allCells.length; i++) {
        winLine.push(new Field(row, i));
        if (allCells[row][i] != curPlayer) {
            flag = false;
            winLine = new Array;
            break
        }
    }
    if (flag) {
        isGameOver = true;
        showWinner();
        alert(`Победил ${curPlayer}`);
    }
}

function checkWinVertical(col) {
    var flag = true;
    for (let i = 0; i < allCells.length; i++) {
        winLine.push(new Field(i, col));
        if (allCells[i][col] != curPlayer) {
            flag = false;
            winLine = new Array;
            break
        }
    }
    if (flag) {
        isGameOver = true;
        showWinner();
        alert(`Победил ${curPlayer}`);
    }
}

function checkWinDiagonal(col) {
    var flag = true;
    if (col <= allCells.length / 2) {
        for (let i = 0; i < allCells.length; i++) {
            winLine.push(new Field(i, i));
            if (allCells[i][i] != curPlayer) {
                flag = false;
                winLine = new Array;
                break
            }
        }
    } else {
        for (let i = 0; i < allCells.length; i++) {
            winLine.push(new Field(allCells.length - 1 - i, i));
            if (allCells[allCells.length - 1 - i][i] != curPlayer) {
                flag = false;
                winLine = new Array;
                break
            }
        }
    }
    if (flag) {
        isGameOver = true;
        showWinner();
        alert(`Победил ${curPlayer}`);
    }
}

function showWinner() {
    for (let field of winLine) {
        var cell = findCell(field.row, field.col);
        cell.style.color = 'red';
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
    isGameOver = false;
    moveCounter = 0;
    curPlayer = CROSS;
    resetAllCells();
    freeCellArray = createEmptyArray(fieldSize);
    renderGrid(fieldSize);
    console.log('reset!');
}

function testWin() {
    clickOnCell(0, 2);
    clickOnCell(0, 0);
    clickOnCell(2, 0);
    clickOnCell(1, 1);
    clickOnCell(2, 2);
    clickOnCell(1, 2);
    clickOnCell(2, 1);
}

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

function createEmptyArray(size) {
    var array = new Array;
    for (let i = 0; i < size; i++)
        for (let j = 0; j < size; j++)
            array.push(new Field(i, j));
    return array;
}

function removeField(field) {
    for (let i = 0; i < freeCellArray.length; i++)
        if (freeCellArray[i].row === field.row && freeCellArray[i].col === field.col) {
            freeCellArray.splice(i, 1);
            break;
        }
}

function resetAllCells() {
    for (let i = 0; i < allCells.length; i++) {
        allCells[i] = new Array(fieldSize);
        for (let j = 0; j < allCells[i].length; j++)
            allCells[i][j] = EMPTY;
    }
}