class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const RED_COLOR = '#F00';

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

let winLength = 3;
let fieldSize = 3;
let moveCounter = 0;
let isGameOver = false;


startGame();
addResetListener();

function getEmptyCells () {
    let result = [];
    for (let i = 0; i < fieldSize; i++) {
        for (let j = 0; j < fieldSize; j++) {
            if (field[i][j] === EMPTY) result.push(new Vector(i, j));
        }
    }
    return result;
}

function updateListCell (){
    allCell = shuffle(getEmptyCells());
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
    field = [];
    fieldSize = getStartFieldSize();
    //winLength = fieldSize <= 5? 3: 5; // если вдруг не хотим делать серии из 3 на большом поле 
    moveCounter = 0;
    createField(fieldSize);
    renderGrid(fieldSize);
    updateListCell();
}

function getStartFieldSize () {
    let result = "";
    result = prompt("Введите стартовое значение размера поля.", 3);
    while (isNaN(result)) {
        result = prompt("Неверный ввод данных. Повторите попытку — введите число.", 3);
    }
    return result;
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function GetCurrentSymbolPlayer (moveCounter) {
    return moveCounter % 2 == 0 ? CROSS: ZERO;
}

function isWithinField (point) {
    return point.x >= 0 && point.x < fieldSize && point.y >= 0 && point.y < fieldSize;
}

function getNeighbourCells (x, y) {
    let result = [];
    for (let direction of DIRECTIONS) {
        let point =  new Vector(x + direction.x, y + direction.y);
        if (isWithinField(point)){
            result.push(point);
        }
    }
    return result;
}

function createField (fieldSize) {
    for (let i = 0; i < fieldSize; i++) {
        let row = []
        for (let j = 0; j < fieldSize; j++) {
            row.push(EMPTY);
        }
        field.push(row);
    }
}

function extendField () {
    let row = []
    for (let i = 0; i < fieldSize; i++) {
        row.push(EMPTY);
    }
    field.push(row);
    for (let i = 0; i <= fieldSize; i++) {
        field[i][fieldSize] = EMPTY;
    }
    fieldSize++;
}

function cellClickHandler (row, col) {
    console.log(`Clicked on cell: ${row}, ${col}`);

    if (isGameOver || field[row][col] !== EMPTY) return;
    
    makeMove(new Vector(row, col), GetCurrentSymbolPlayer(moveCounter));
    
}

function makeMove (point, symbol){
    if(isGameOver) return;

    field[point.x][point.y] = symbol;
    renderSymbolInCell(symbol, point.x, point.y);
    moveCounter++;
    let line = findWinLineInPosition(point.x, point.y, symbol);
    if (line){
        announceWinner(line, onAI && symbol === ZERO ? "AI": `Player${symbol === CROSS? 1: 2}`);
        return;
    }
    updateGameStatus();

    if(onAI && symbol == CROSS)
        makeMove(getMoveAI(), GetCurrentSymbolPlayer(moveCounter));
}

function announceWinner (lineWinner, nameWinner){
    let symbol = field[lineWinner[0].x][lineWinner[0].y];
    renderVictorySymbols(symbol, lineWinner, RED_COLOR);
    alert(`Победил ${nameWinner}`);
    isGameOver = true;
}

function updateGameStatus () {
    if (fieldSize ** 2 == moveCounter) {
        alert('Победила дружба');
        isGameOver = true;
    } else if (isFieldExtensionEnabled && moveCounter > fieldSize ** 2 / 2) {
        extendField();
        rerenderField();
        updateListCell();
    }
}

function getMoveAI (){
    return isAdvanceAI? getAdvanceMoveAI(): getRandomMove();
}

function getRandomMove (){
    let result = allCell.pop();
    while(field[result.x][result.y] !== EMPTY && allCell.length !== 0){
        result = allCell.pop();
    }
    return result;
}

function getAdvanceMoveAI (){
    return findWinnerCell(ZERO) ?? getRandomMove();
}   

function findWinnerCell (symbol) {
    let EmtyCells = getEmptyCells();
    for (let i = 0; i < EmtyCells.length; i++) {
        if (findWinLineInPosition(EmtyCells[i].x, EmtyCells[i].y, symbol))
            return EmtyCells[i];
    }
    return null;
}

function findWinLineInPosition (x, y, symbol){
    let neighbourCells = getNeighbourCells(x, y);
    for (let neighbourCell of neighbourCells) {
        let direction = new Vector(neighbourCell.x - x, neighbourCell.y - y);
        let line = createLine(new Vector(x, y), direction, symbol);

        if(line.length >= winLength)
            return line; 
    }
    return null;
}

function createLine (point, direction, symbol){
    let result = [point];
    let isPossibleToGoInDir = true;
    let isPossibleToGoAgainstDir = true;

    for (let step = 1; step < winLength; step++){
        if (!isPossibleToGoInDir && !isPossibleToGoAgainstDir) break;

        if (isPossibleToGoInDir){
            isPossibleToGoInDir =
             addPointInLine(new Vector(point.x + step * direction.x,
                                       point.y + step * direction.y),
                            symbol, result);
        }
        if (isPossibleToGoAgainstDir){
            isPossibleToGoAgainstDir = 
             addPointInLine(new Vector(point.x - step * direction.x,
                                       point.y - step * direction.y),
                            symbol, result)
        }
    }
    return result;
}

function addPointInLine (point, symbol, line){
    if (isWithinField(point) && field[point.x][point.y] === symbol){
        line.push(point)
        return true;
    }
    return false;
}

function rerenderField () {
    renderGrid(fieldSize);
    for (let i = 0; i < fieldSize; i++) {
        for (let j = 0; j < fieldSize; j++) {
            renderSymbolInCell(field[i][j], i, j);
        }
    }
}

function renderVictorySymbols (symbol, winnerLine, color) {
    for(let i = 0; i < winnerLine.length; i++){
        renderSymbolInCell(symbol, winnerLine[i].x, winnerLine[i].y, color);
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

function clickOnCell (row, col) {
    findCell(row, col).click();
}
