const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');
//генератор случайных челых чисел
const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

let table;
let stepCount;
let dim;
let win = false;
let typeOfWin;
let lastRow ;
let lastCol;
let lastSymbol;
let botMode = false;
startGame();
addResetListener();
addAIBotListener();

function startGame () {
    renderGrid(prompt("Введите размер поля", 3));
}

function renderGrid (dimension) {
    container.innerHTML = '';

    stepCount = dimension**2;
    dim = dimension;
    lastRow = -1;
    makeTable();
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

function makeTable(){
    table = [];  
    for (let i = 0;i<dim;i++){
        let row = [];
        for (let j = 0;j<dim;j++){
            row.push(EMPTY);
        }
        table.push(row);
    } 
}
function stepSequence(){
    return stepCount-- % 2 == 0 ? ZERO : CROSS;
}

function findWin(row,col ,symbol){
    if (table[row].filter(sym => sym === symbol).length == dim ){
        typeOfWin = "row"
        return true;
    }

    let colCount = 0;
    for (let i = 0; i < dim; i++){
        if (table[i][col] == symbol) colCount++;
    }
    
    let countLeft = 0;
    let countRight = 0;
    let startRow = dim;

    for (let i = 0; i < dim; i++){
        if (table[i][i] == symbol) countLeft++;
    }
    for (let j = 0; j < dim; j++){
        if (table[--startRow][j] == symbol) countRight++;
        console.log(startRow,j);
    }

    if (countLeft == dim) typeOfWin = "left"
    if (countRight == dim) typeOfWin = "right"      
    if ( colCount == dim) typeOfWin = "column"

    return countLeft == dim || countRight == dim || colCount==dim;
}

function cellClickHandler (row, col) {
    if (!win){
        cell = table[row][col]; 
        
        if (stepCount!=0 && cell=== EMPTY){
            
            renderStep(row,col);
            if (botMode)
                makeBotStep();      
        }
        if (stepCount==0 && !win){
            typeOfWin = "friendship"
            makeWin();
        }
    }
}

function renderStep(row,col){
    lastSymbol = stepSequence();
    lastCol = col;
    lastRow = row;
    table[row][col] = lastSymbol;
    renderSymbolInCell( lastSymbol, row, col);
    if (findWin(row,col,lastSymbol)){
        makeWin();
        botMode = false;
        alert(`Победил ${lastSymbol}!`)
    }

}
function makeBotStep(){
    while(true){
        let rndRow = random(0,dim-1);
        let rndCol = random(0,dim-1);
        if(table[rndRow][rndCol]==EMPTY){
            renderStep(rndRow,rndCol);
            return;
        }
        if (stepCount==0) return;
    }
}

function makeWin()
{
    win = true;
    switch(typeOfWin){
        case "row":
            for(let i =0 ;i<dim;i++)
                renderSymbolInCell(lastSymbol,lastRow,i,'red');
            break;
        case "column":
            for(let i =0 ;i<dim;i++)
                renderSymbolInCell(lastSymbol,i,lastCol,'red');
            break;
        case "left":
            for(let i =0 ;i<dim;i++)
                renderSymbolInCell(lastSymbol,i,i,'red');
            break;
        case "right":
            let length = dim;
            for(let i = 0 ;i<dim;i++)
                renderSymbolInCell(lastSymbol,--length,i,'red');
            break;
        case "friendship":
            alert("Победила дружба!");
            break;
    }
    let resetButton = document.querySelector('.resetButton');
    resetButton.classList.add('active');
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

function addAIBotListener () {
    const AIButton = document.getElementById('startAI');
    AIButton.onclick = function() {
        if (lastRow== -1) 
        AIButton.classList.add('active');
      };
    AIButton.addEventListener('click', startAI);
}

function startAI(){
    if(!botMode && lastRow== -1) botMode = true;
}

function resetClickHandler () {
    win = false;
    const AIButton = document.getElementById('startAI');
    AIButton.classList.remove('active');
    botMode = false;
    let resetButton = document.querySelector('.resetButton');
    resetButton.classList.remove('active');
    startGame();
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
