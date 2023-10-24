const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let field;
let currentPlayer;
let currentSymbol;
let gameOver;

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    let dimension = 3;
    renderGrid(dimension);
    field = createField(dimension);
    currentPlayer = 0;
    gameOver = false;
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
    if (field[row][col]=== EMPTY && !gameOver){
        currentSymbol = currentPlayer%2 === 1 ? ZERO: CROSS;
        field[row][col] = currentSymbol;
        currentPlayer+=1;
        renderSymbolInCell(currentSymbol, row, col);
        setTimeout(()=> checkWinner(field[row][col]));
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

function checkWinner () {
    for (let i = 0; i < 3; i++) {
        if (field[i][0] === field[i][1] && field[i][2] === field[i][1]) {
            if (field[i][0] === CROSS){
                changeColorOfWinner([[i,0],[i,1],[i,2]]);
                printWinner("Крестики победили")
            }

            else if (field[i][0] === ZERO){
                changeColorOfWinner([[i,0],[i,1],[i,2]]);
                printWinner("Нолики победили")
            }

        }
        if (field[0][i] === field[1][i] && field[2][i] === field[1][i]) {
            if (field[0][i] === CROSS){
                changeColorOfWinner([[0,i],[1,i],[2,i]]);
                printWinner("Крестики победили")
            }

            else if (field[0][i] === ZERO){
                changeColorOfWinner([[0,i],[1,i],[2,i]]);
                printWinner("Нолики победили")
            }
        }
    }

    if(field[0][0] === field[1][1] && field[1][1] === field[2][2]){
        if (field[1][1] === CROSS){
            changeColorOfWinner([[0,0],[1,1],[2,2]]);
            printWinner("Крестики победили")
        }
        else if (field[1][1] === ZERO){
            changeColorOfWinner([[0,0],[1,1],[2,2]]);
            printWinner("Нолики победили")
        }
    }
    if(field[0][2] === field[1][1] && field[1][1] === field[2][0]){
        if (field[1][1] === CROSS){
            changeColorOfWinner([[2,0],[1,1],[0,2]]);
            printWinner("Крестики победили")
        }
        else if (field[1][1] === ZERO){
            changeColorOfWinner([[2,0],[1,1],[0,2]]);
            printWinner("Нолики победили")
        }
    }

    if (currentPlayer === 8){
        printWinner("Победила дружба")
    }
}

function printWinner(str){
    gameOver = true;
    alert(str)
}

function createField(dimension) {
    let board = []
    for (let i = 0; i < dimension; i++) {
        let row = [];
        for (let j = 0; j < dimension; j++) {row.push(EMPTY)}
        board.push(row)
    }
    return board;
}
function changeColorOfWinner(array){
    for (const [row,col] of array) {
        renderSymbolInCell(field[row][col],row,col,'#FF0000')
    }
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
