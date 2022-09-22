const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let field = [[EMPTY,EMPTY,EMPTY],[EMPTY,EMPTY,EMPTY],[EMPTY,EMPTY,EMPTY]];
let currentSymbol = CROSS;
let haveWinner = false;
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
    console.log(`Clicked on cell: ${row}, ${col}`);
    if (field[row][col] !== EMPTY || haveWinner)
        return
    field[row][col] = currentSymbol;
    renderSymbolInCell(currentSymbol,row,col)
    currentSymbol = currentSymbol === CROSS ? ZERO:CROSS;
    decideWinner()
    if(!haveWinner && field.flat(Infinity).every(a => a !== EMPTY))
        announceWinner("Победила дружба");
}

function decideWinner () {
    for (let i = 0; i < 3; i++) {
        if (field[i][0] === field[i][1] && field[i][2] === field[i][1]) {
            if (field[i][0] === CROSS){
                changeColorOfCells([[i,0],[i,1],[i,2]],'#FF0000')
                announceWinner("Крестики победили")
            }

            else if (field[i][0] === ZERO){
                changeColorOfCells([[i,0],[i,1],[i,2]],'#FF0000')
                announceWinner("Нолики победили")
            }
        }
        if (field[0][i] === field[1][i] && field[2][i] === field[1][i]) {
            if (field[0][i] === CROSS){
                changeColorOfCells([[0,i],[1,i],[2,i]],'#FF0000')
                announceWinner("Крестики победили")
            }

            else if (field[0][i] === ZERO){
                changeColorOfCells([[0,i],[1,i],[2,i]],'#FF0000')
                announceWinner("Нолики победили")
            }
        }
    }

    if(field[0][0] === field[1][1] && field[1][1] === field[2][2]){
        if (field[1][1] === CROSS){
            changeColorOfCells([[0,0],[1,1],[2,2]],'#FF0000')
            announceWinner("Крестики победили")
        }
        else if (field[1][1] === ZERO){
            changeColorOfCells([[0,0],[1,1],[2,2]],'#FF0000')
            announceWinner("Нолики победили")
        }
    }
    if(field[0][2] === field[1][1] && field[1][1] === field[2][0]){
        if (field[1][1] === CROSS){
            changeColorOfCells([[2,0],[1,1],[0,2]],'#FF0000')
            announceWinner("Крестики победили")
        }
        else if (field[1][1] === ZERO){
            changeColorOfCells([[2,0],[1,1],[0,2]],'#FF0000')
            announceWinner("Нолики победили")
        }
    }
}

function announceWinner(str){
    haveWinner = true;
    alert(str)
}

function changeColorOfCells(arr, colorNew){
    for (const [row,col] of arr) {
        renderSymbolInCell(field[row][col],row,col,colorNew)
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
    field = [[EMPTY,EMPTY,EMPTY],[EMPTY,EMPTY,EMPTY],[EMPTY,EMPTY,EMPTY]];
    field.forEach((a,row) => {
        a.forEach((b,col) => {
            renderSymbolInCell(EMPTY,row,col)
            return b
        })
        return a
    })
    haveWinner = false;
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
