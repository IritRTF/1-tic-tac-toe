const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

let field;
let gaming = true;
let size;
let pStep = true;
let count = 0;
let robo;
const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    size = Number(prompt('Введите размер поля:', 3));
    gaming = true;
    field = createField(size);
    renderGrid(size);
    robo = Number(prompt('Введите 1 для игры против робота',0));
}

function createField(size){
    let grid = [];
    for (let i = 0; i<size; i++){
        let row = [];
        for (let j = 0; j< size; j++) row.push(EMPTY);
        grid.push(row);
    }
    return grid;
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
    let sym;
    if (gaming == true && pStep == true && field[row][col] == EMPTY){
        pStep = false;
        renderSymbolInCell(CROSS, row, col)
        field[row][col] = CROSS;   
        sym = CROSS;
        count++;
        if (gaming == true  && robo == 1){
            randomizer();
        }
    }
    else if (gaming == true && field[row][col] == EMPTY) {
        pStep = true;
        renderSymbolInCell(ZERO, row, col)
        field[row][col] = ZERO;
        sym = ZERO;
        count++;d
        
    }
    checkWin(sym);
}

function randomizer(){
    let randomRow = Math.floor(Math.random() * size);
    let randomCol = Math.floor(Math.random() * size);
    if (field[randomRow][randomCol] == EMPTY) {
        pStep = true;
        renderSymbolInCell(ZERO, randomRow, randomCol)
        field[randomRow][randomCol] = ZERO;
        sym = ZERO;
        count++;
    }
    else randomizer();
}

function checkWin(sym){
if (checkSym(sym)) {
    alert(`Победил ${sym}`)
}
else if (count == size*size) alert(`Победила дружба`);
}

function checkSym(sym){
    let mainDiag = [];
    let subDiag = [];
    for(let i = 0; i<size; i++){
        let horizon = [];
        let vertical = [];
        for (let j = 0; j<size; j++){
            if(field[i][j] === sym) horizon.push({row: i, col: j});
            if(field[j][i] === sym) vertical.push({row: j, col: i});
        }
        if(field[i][i] === sym) mainDiag.push({row: i, col: i});
        if(field[size-1-i][i] === sym) subDiag.push({row: size-1-i, col: i});
        if (checker(horizon) | checker(vertical) | checker(mainDiag) | checker (subDiag)) return true;
        
    }
    return false;
}

function checker(line){
    if(size == line.length){
        red(line);
        return true;
    }
    return false;
}

function red(line){
    for (let pos of line) {
        let paint = findCell(pos.row, pos.col);
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
    startGame();
    count = 0;
    pStep = true;
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
