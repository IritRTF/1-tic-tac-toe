class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const RED_COLOR = '#F00'
const WIN_LENGTH = 3;


const UPLEFT =  new Vector(-1, -1);
const UP = new Vector(-1, 0);
const UPRIGHT = new Vector(-1, 1);
const RIGHT = new Vector(0, 1);
const DOWNRIGHT = new Vector(1, 1);
const DOWN = new Vector(1, 0);
const DOWNLEFT = new Vector(1, -1);
const LEFT = new Vector(0, -1);


const DIRECTIONS = [UPLEFT, UP, UPRIGHT, RIGHT, DOWNRIGHT, DOWN, DOWNLEFT, LEFT]; 

const container = document.getElementById('fieldWrapper');

let onAI = false;
let isAdvanceAI = false;
let isFieldExtensionEnabled = false;

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
            if (field[i][j] === EMPTY) result.push(new Vector(i, j));
        }
    }
    return result;
}

function updateListCell(){
    allCell = shuffleArray(getEmptyCells());
}


function startGame () {
    if (!isFieldExtensionEnabled){
        isFieldExtensionEnabled = confirm("Включить расширение поля?");
    }
    if(!onAI){
        if(confirm("Включить AI?")){
            isAdvanceAI = confirm("Включить умный AI?");
            onAI = true;
        }
    }
    isGameOver = false;
    field = []
    fieldSize = getStartFieldSize();
    moveCounter = 0;
    createField(fieldSize)
    renderGrid(fieldSize);
    updateListCell();
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
    arr.sort(()=>Math.random()-0.5);
    return arr; // спорный момент, но для js, нврн, норм
}


function getSymbol (moveCounter) {
    return moveCounter % 2 == 0 ? CROSS: ZERO;
}

function isNotOutOfBounds (point) {
    return point.x >= 0 && point.x < fieldSize && point.y >= 0 && point.y < fieldSize;
}

function getNeighbourCells (x, y) {
    let result = [];
    for (let direction of DIRECTIONS) {
        let point =  new Vector(x + direction.x, y + direction.y);
        if (isNotOutOfBounds(point)){
            result.push(point);
        }
    }
    return result;
}

function createField (fieldSize) {
    for (let i = 0; i < fieldSize; ++i) {
        let row = []
        for (let j = 0; j < fieldSize; ++j) {
            row.push(EMPTY);
        }
        field.push(row);
    }
}

function extendField () {
    let row = []
    for (let i = 0; i < fieldSize; ++i) {
        row.push(EMPTY);
    }
    field.push(row);
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
    renderSymbolInCell(ZERO, point.x, point.y);
    ++moveCounter;
    field[point.x][point.y] = ZERO;
    let result = IsMoveToCellWinning(point.x, point.y, ZERO);
    if (result){
        announceWinner(result, "AI");
        return;
    }
    updateGameStatus();

}

function getMoveAI(){
    let result = allCell.pop();
    while(field[result.x][result.y] !== EMPTY && allCell.length !== 0){
        result = allCell.pop();
    }
    return result;
}

function getAdvanceMoveAI(){
    let result = findWinnerCell(ZERO);
    return result !== null? result: getMoveAI();
}   

function announceWinner(winner, w){
    let symbol = field[winner[0].x][winner[0].y];
    renderVictorySymbols(symbol, winner, RED_COLOR);
    alert(`Победил ${w}`);
    isGameOver = true;
}


function findWinnerCell (symbol) {
    main: for (let i = 0; i < allCell.length; ++i) {
            if (field[allCell[i].x][allCell[i].y] === EMPTY){
                if (IsMoveToCellWinning(allCell[i].x, allCell[i].y, symbol))
                    return allCell[i];
            }
    }
    return null;
}

function IsMoveToCellWinning(i,j, symbol){
    let neighbourCells = getNeighbourCells(i, j);  // отбирает все клетки, которые находятся в поле вокруг
    for (let neighbourCell of neighbourCells) {
        let direction = new Vector(neighbourCell.x - i, neighbourCell.y - j);
        let line = createLine(new Vector(i,j), direction, symbol);
        if(line.length >= WIN_LENGTH)
            return line; 
    }
    return null;
}

//рефакторинг
function createLine(point, direction, symbol){
    let result = [point];
    for (let step = 1;
      isNotOutOfBounds(new Vector(point.x + step * direction.x,point.y + step * direction.y));
      step++){

        let newPoint = new Vector(point.x + step * direction.x,point.y + step * direction.y);
        if (field[newPoint.x][newPoint.y] !== symbol){
            break;
        }
        result.push(newPoint);
    }
    for (let step = -1;
      isNotOutOfBounds(new Vector(point.x + step * direction.x,point.y + step * direction.y));
      step--){

        let newPoint = new Vector(point.x + step * direction.x,point.y + step * direction.y);
        if (field[newPoint.x][newPoint.y] !== symbol){
            break;
        }
        result.push(newPoint);
    }
    return result;
}


function updateGameStatus () {
    console.log(fieldSize ** 2 / 2);
    console.log(moveCounter);
    if (fieldSize ** 2 == moveCounter) {
        alert('Победила дружба');
        isGameOver = true;
    } else if (isFieldExtensionEnabled && moveCounter > fieldSize ** 2 / 2) {
        renderExtendedField();
        updateListCell();
    }
}

function renderVictorySymbols (symbol, winner, color) {
    for(let i =0; i < winner.length; i++){
        renderSymbolInCell(symbol, winner[i].x, winner[i].y, color);
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
