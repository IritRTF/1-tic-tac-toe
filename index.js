const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let field = [[1, 2, 3], [4, 5, 6],[7, 8, 9]];
let currPlayer = 0;
// let crossesRow = 0;
// let crossesCol = 0;
// let crossesDiag = 0;
// let zerosRow = 0;
// let zerosCol = 0;
// let zerosDiag = 0;
const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    renderGrid(3);
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
    // Пиши код тут
    currPlayer++;
    if (currPlayer % 2 == 1){
        renderSymbolInCell(CROSS,row,col);
        field[row, col] = CROSS;
        // for (let j = 0;j<3;j++){
        //     for (let i = 0;i<3;i++){
        //         crossesRow = field[row,i] == CROSS ? crossesRow+1 : crossesRow;
        //     }
        //     console.log(crossesRow);
        //     crossesRow =0;
        // }
    }
    else{
        renderSymbolInCell(ZERO,row,col);
        field[row, col] = ZERO;
    }
    console.log(`Clicked on cell: ${row}, ${col}`);

    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
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
    console.log('reset!');
    for(let i =0;i<3;i++){
        for(let j =0;j<3;j++) {
            renderSymbolInCell(EMPTY, i, j);
        }
    }
    field = [[1, 2, 3], [4, 5, 6],[7, 8, 9]];
    currPlayer = 0;
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
