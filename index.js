const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let pole;
let dimension;
let movesLeft;
let isGameOver;

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    dimension = prompt('Укадиие размер поля')
    movesLeft = dimension**2
    pole = [];
    isGameOver = false;
    renderGrid(dimension);
}

function renderGrid (dimension) {  
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        pole.push([]);
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = EMPTY;
            pole[i][j]=EMPTY;
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
}

function cellClickHandler (row, col) {
    // Пиши код тут
    if (isGameOver){
        return
    }
    if (findCell(row, col).textContent === EMPTY){
        if (movesLeft % 2 == 0){
            makeMove(CROSS, row, col);
        }
        else{
            makeMove(ZERO, row, col);
        }
    }
    console.log(`Clicked on cell: ${row}, ${col}`);


    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
}

function makeMove(symbol, row, col){
    renderSymbolInCell(symbol, row, col)
    pole[row][col] = symbol;
    movesLeft--;
    if (checkWinner(symbol, row, col)){
        if (symbol === CROSS){
            alert('Победили крестики!');  
        }
        if (symbol === ZERO){
            alert('Победили нолики!');
        }
        isGameOver = true
    }
    if (movesLeft === 0 && !isGameOver)
        alert('Победила дружба!');
}


function checkWinner (symbol, row, col) {
    let Found_win = true;
    let winLine;
    for (let i = 0; i < dimension; i++) {
        if (pole[row][i] !== symbol) {
            Found_win = false;
            break;
        }
        Found_win = true;
    }
    winLine = "вертикаль";

    if (!Found_win) {
        for (let i = 0; i < dimension; i++) {
            if (pole[i][col] !== symbol) {
                Found_win = false;
                break;
            }
            Found_win = true;
        }
        winLine = "горизонталь";
    }

    if (!Found_win) {
        for (let i = 0; i < dimension; i++) {
            if (pole[i][i] !== symbol) {
                Found_win = false;
                break;
            }
            Found_win = true;
        }
        winLine = "диоганаль1";
    }

    if (!Found_win) {
        for (let i = 0; i < dimension; i++) {
            if (pole[i][dimension - (1 + i)] !== symbol) {
                Found_win = false;
                break;
            }
            Found_win = true;
        }
        winLine = "диоганаль2";
    }

    if (Found_win)
        colorWinningLine(winLine, row, col);
    return Found_win;
}

function colorWinningLine(winLine, row, col){
    for (let i = 0; i < dimension; i++) {
        switch (winLine) {
            case "вертикаль":
                changeColor(findCell(row, i));
                break;

            case "горизонталь":
                changeColor(findCell(i, col));
                break;

            case "диоганаль1":
                changeColor(findCell(i, i));
                break;

            case "диоганаль2":
                changeColor(findCell(i, dimension - (i + 1)));
                break;
        }
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
    console.log('reset!');
    startGame();
}

function changeColor(cell){
    cell.style.backgroundColor = '#b43030';
    cell.style.color = 'white';
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
