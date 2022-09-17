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

let onAI = false;
let isAdvanceAI = false;
let allCell = [];

let field = [];
let fieldSize = 3;
let moveCounter = 0;
let isGameOver = false;


startGame();
addResetListener();

function getEmptyCells () {
    let result = [];
    for (let i = 0; i < fieldSize; ++i) {
        for (let j = 0; j < fieldSize; ++j) {
            if (field[i][j] === EMPTY) result.push([i, j]);
        }
    }
    return result;
}

function startGame () {
    if(!onAI){
        if(confirm("Включить AI?")){
            if(confirm("Включить умный AI?")){
                isAdvanceAI = true;
            }
            onAI = true;
        }
    }    
    isGameOver = false;
    field = []
    fieldSize = getStartFieldSize();
    moveCounter = 0;
    allCell = [];
    createField(fieldSize)
    renderGrid(fieldSize);
}

function getStartFieldSize () {
    let result = '';
    result = prompt('Введите стартовое значение размера поля.', 3);
    while (isNaN(result)) {
        result = prompt('Неверный ввод данных. Повторите попытку — введите число.', 3);
    }
    return result;
}


function shuffleArray(arr){
    arr.sort(()=>Math.random()-0.5)
}


function getSymbol (moveCounter) {
    return moveCounter % 2 == 0 ? CROSS: ZERO;
}

function isNotOutOfBounds (cell) {
    return cell[0] >= 0 && cell[0] < fieldSize && cell[1] >= 0 && cell[1] < fieldSize;
}

function getNeighbourCells (x, y) {
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

function createField (fieldSize) {
    for (let i = 0; i < fieldSize; ++i) {
        let array = []
        for (let j = 0; j < fieldSize; ++j) {
            array.push(EMPTY);
            allCell.push([i,j]);
        }
        field.push(array);
    }
    shuffleArray(allCell);
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
    allCell =  getEmptyCells();
    shuffleArray(allCell);
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

    if (isGameOver || field[row][col] !== EMPTY) return;
    
    makeMove(row,col, getSymbol(moveCounter));
    
}


function makeMove(x, y, symbol){
    if (onAI && symbol == ZERO){
        makeMoveAI();
        return;
    }
    field[x][y] = symbol;
    renderSymbolInCell(symbol, x, y);
    ++moveCounter;
    let result = IsMoveToCellWinning(x, y, symbol);
    if (result){
        announceWinner(result, `Player${symbol === CROSS? 1: 2}`);
        return;
    }
    updateGameStatus();
    if(onAI)
        makeMove(-1,-1, ZERO);
    //

}

function makeMoveAI(){
    let point = isAdvanceAI? getAdvanceMoveAI(): getMoveAI();
    renderSymbolInCell(ZERO, point[0], point[1]);
    ++moveCounter;
    field[point[0]][point[1]] = ZERO;
    let result = IsMoveToCellWinning(point[0], point[1], ZERO);
    if (result){
        announceWinner(result, "AI");
        return;
    }
    updateGameStatus();

}


function getMoveAI(){
    let result = allCell.pop();
    while(field[result[0]][result[1]] !== EMPTY && allCell.length !== 0){
        result = allCell.pop();
    }
    return result;
}

function getAdvanceMoveAI(){
    let result = findWinnerCell(ZERO);
    return result !== null? result: getMoveAI();
}   

function announceWinner(winner, w){
    let symbol = field[winner[0][0]][winner[0][1]];
    renderVictorySymbols(symbol, winner, RED_COLOR);
    alert(`Победил ${w}`);
    isGameOver = true;
}


function findWinnerCell (symbol) {
    main: for (let i = 0; i < allCell.length; ++i) {
            if (field[allCell[i][0]][allCell[i][1]] === EMPTY){
                if (IsMoveToCellWinning(allCell[i][0], allCell[i][1], symbol))
                    return allCell[i];
            }
    }
    return null;
}

function IsMoveToCellWinning(i,j, symbol){
    let neighbourCells = getNeighbourCells(i, j);  // отбирает все клетки, которые находятся в поле вокруг
    for (let neighbourCell of neighbourCells) {
        let vector = [neighbourCell[0] - i, neighbourCell[1] - j]; // продлевает линию, исходная точка начальная, neighbourCell следующая, а эта - идущая после NC 
        if (symbol === field[neighbourCell[0]][neighbourCell[1]]) {
            let nextCell = [neighbourCell[0] + vector[0], neighbourCell[1] + vector[1]];
            if (isNotOutOfBounds(nextCell) && symbol === field[nextCell[0]][nextCell[1]]) {
                return createWinLine(neighbourCell[0], neighbourCell[1], vector);
            }
        }
        if(isNotOutOfBounds([i - vector[0], j - vector[1]])
            && field[neighbourCell[0]][neighbourCell[1]] === symbol
            && field[i - vector[0]][j - vector[1]] === symbol){

                return createWinLine(i, j, vector);
            }
    }
    return null;
}

function createWinLine(i, j, vector)
{
    return [[i - vector[0], j - vector[1]], [i, j], [i +  vector[0], j + vector[1]]]; 
}


function updateGameStatus () {
    console.log(fieldSize ** 2 / 2);
    console.log(moveCounter);
    if (fieldSize ** 2 == moveCounter) {
        alert('Победила дружба');
        isGameOver = true;
    } else if (moveCounter > fieldSize ** 2 / 2) {
        renderExtendedField();
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
