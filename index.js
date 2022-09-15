const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let index = 1;  //счетчик, какой ход по счету. Неч - CROSS, чет ZERO
const container = document.getElementById('fieldWrapper');
const field = new Array();

startGame();
addResetListener();

function createEmptyField(dimension) {
    field.length = 0;

    for (let i = 0; i < dimension; i++)
        field[i] = []

    for (let i = 0; i < dimension; i++)
    for (let j = 0; j < dimension; j++) {
        field[i][j] = EMPTY
    }
}

function  

function startGame () {
    renderGrid(3);
}

function ()

function renderrid (dimension) {
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
    console.log(`Clicked on cell: ${row}, ${col}`);
    if (field[row][col] == EMPTY) {
        
    }
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
}


/* Test Function */
/* Победа первого игрока */
function testWin () {
    clickOnCell(0, 2);//x
    //    x
    //
    //    
    clickOnCell(0, 0);//o
    //o   x
    //
    // 
    clickOnCell(2, 0);//x
    //o   x
    //  
    //x 
    clickOnCell(1, 1);//o
    //o   x
    //  o
    //x   
    clickOnCell(2, 2);//x
    //o   x
    //  o
    //x   x 
    clickOnCell(1, 2);//o
    //o   x
    //  o o
    //x   x
    clickOnCell(2, 1);//x
    //o   x
    //  o o
    //x x x
}

/* Ничья */
function testDraw () {
    clickOnCell(2, 0); //x
    //| | | |
    //| | | |
    //|x| | | 
    clickOnCell(1, 0); //o
    //| | | |
    //|o| | |
    //|x| | |
    clickOnCell(1, 1); //x
    //| | | |
    //|o|x| |
    //|x| | |
    clickOnCell(0, 0); //o
    //|o| | |
    //|o|x| |
    //|x| | |
    clickOnCell(1, 2); //x
    //|o| | |
    //|o|x|x|
    //|x| | |
    clickOnCell(1, 2); //o
    //|o| | |
    //|o|x|x| ????
    //|x| | |
    clickOnCell(0, 2); //x
    //|o| |x|
    //|o|x|x| ????
    //|x| | |
    clickOnCell(0, 1); //o
    //|o|o|x|
    //|o|x|x| ????
    //|x| | |
    clickOnCell(2, 1); //x
    //|o|o|x|
    //|o|x|x o| ????
    //|x| | |
    clickOnCell(2, 2); //o
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
