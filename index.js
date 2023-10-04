const CROSS = 'X';  
const ZERO = 'O';  
const EMPTY = ' ';  
let field = [  
    ["", "", ""],  
    ["", "", ""],  
    ["", "", ""]  ];  
let turn = 0;
let gameOver = false;

const container = document.getElementById('fieldWrapper');  
  
startGame();  
addResetListener();  
  
function startGame () 
{  
    renderGrid(3);  
}  
  
function renderGrid (dimension) 
{  
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
  
function cellClickHandler(row, col) 
{  
    if (!gameOver && field[row][col] === "") 
    {  
        let currentPlayer = (turn % 2 === 0) ? CROSS : ZERO;  
        field[row][col] = currentPlayer;  
        renderSymbolInCell(currentPlayer, row, col);  
        let winner = checkWinner(); 

        if (winner !== null) 
        {  
            gameOver = true;
            highlightWinningCells(winner);
            setTimeout(() => 
            {
                alert("Победитель: " + winner);
                resetGame();
            }, 100);

        } 

        else if (turn === 8) 
        {
            setTimeout(() => 
            {
                alert("Победила дружба");
                resetGame();
            }, 100);
        } 

        else 
        {  
            turn++;  
        }  
    }  
}  
  
function renderSymbolInCell (symbol, row, col, color = '#333') 
{  
    const targetCell = findCell(row, col);  
  
    targetCell.textContent = symbol;  
    targetCell.style.color = color;  
}  
  
function findCell (row, col) 
{  
    const targetRow = container.querySelectorAll('tr')[row];  
    return targetRow.querySelectorAll('td')[col];  
}  
  
function addResetListener () 
{  
    const resetButton = document.getElementById('reset');  
    resetButton.addEventListener('click', resetClickHandler);  
}  
  
function resetClickHandler () {  
    resetGame();
}  

function resetGame() 
{
    field = [  
        ["", "", ""],  
        ["", "", ""],  
        ["", "", ""]  ]; 
    turn = 0;
    gameOver = false;
    renderGrid(3);
}

function checkWinner() 
{
    // Горизонтальная комбинация
    for (let i = 0; i < 3; i++) {
        if (field[i][0] !== "" && field[i][0] === field[i][1] && field[i][0] === field[i][2]) {
            return field[i][0];
        }
    }

    // Вертикальная комбинация
    for (let j = 0; j < 3; j++) {
        if (field[0][j] !== "" && field[0][j] === field[1][j] && field[0][j] === field[2][j]) {
            return field[0][j];
        }
    }

    // Диагональная комбинация
    if (field[0][0] !== "" && field[0][0] === field[1][1] && field[0][0] === field[2][2]) {
        return field[0][0];
    }
    if (field[0][2] !== "" && field[0][2] === field[1][1] && field[0][2] === field[2][0]) {
        return field[0][2];
    }

    return null;
}

function highlightWinningCells(winner) 
{
    // Закрашивание строки
    for (let i = 0; i < 3; i++) 
    {
        if (field[i][0] === winner && field[i][1] === winner && field[i][2] === winner) {
            renderSymbolInCell(winner, i, 0, 'red');
            renderSymbolInCell(winner, i, 1, 'red');
            renderSymbolInCell(winner, i, 2, 'red');
            break;
        }
    }

    // Закрашивание колоны 
    for (let j = 0; j < 3; j++) 
    {
        if (field[0][j] === winner && field[1][j] === winner && field[2][j] === winner) 
        {
            renderSymbolInCell(winner, 0, j, 'red');
            renderSymbolInCell(winner, 1, j, 'red');
            renderSymbolInCell(winner, 2, j, 'red');
            break;
        }
    }

    // Закрашивание диагонали
    if (field[0][0] === winner && field[1][1] === winner && field[2][2] === winner) {
        renderSymbolInCell(winner, 0, 0, 'red');
        renderSymbol
InCell(winner, 1, 1, 'red');
        renderSymbolInCell(winner, 2, 2, 'red');
    }
    if (field[0][2] === winner && field[1][1] === winner && field[2][0] === winner) {
        renderSymbolInCell(winner, 0, 2, 'red');
        renderSymbolInCell(winner, 1, 1, 'red');
        renderSymbolInCell(winner, 2, 0, 'red');
    }
}

/* Test Function */  
/* Победа первого игрока */  
function testWin () 
{  
    clickOnCell(0, 2);  
    clickOnCell(0, 0);  
    clickOnCell(2, 0);  
    clickOnCell(1, 1);  
    clickOnCell(2, 2);  
    clickOnCell(1, 2);  
    clickOnCell(2, 1);  
}  
  
/* Ничья */  
function testDraw () 
{  
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
  
function clickOnCell (row, col) 
{  
    findCell(row, col).click();  
}
