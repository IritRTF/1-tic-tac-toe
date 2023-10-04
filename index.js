const CROSS = 'X'; 
const ZERO = 'O'; 
const EMPTY = ' '; 
let field = [ 
    ["", "", ""], 
    ["", "", ""], 
    ["", "", ""] 
]; 
let gameOver = false;
let turn = 0 


const container = document.getElementById('fieldWrapper'); 
 
startGame(); 
addResetListener(); 
 
function startGame() {
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
 
function addResetListener(){
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function paintWinnerCells(combination) {
    combination.forEach(([row, col]) => {
        const targetCell = findCell(row, col);
        targetCell.style.color = 'red'; // Красим победные клетки в красный цвет
    });
}

 
function cellClickHandler(row, col) { 
    if (field[row][col] === "" && !gameOver) { 
      let currentPlayer = (turn % 2 === 0) ? "X" : "O"; 
      field[row][col] = currentPlayer; 
      renderSymbolInCell(currentPlayer, row, col);  
      if (checkWinner() !== null) { 
        gameOver = true;
      } else { 
        turn++; 
      } 
    } 
  } 
 
  function renderSymbolInCell (symbol, row, col, color = '#333') { 
    const targetCell = findCell(row, col); 
 
    targetCell.textContent = symbol; 
    targetCell.style.color = color; 

    const winningCombinations = [

        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    for (let combination of winningCombinations) { 
        let isWinningCombination = true;
        for (let cell of combination) {
            let [x, y] = cell;
            if (field[x][y] !== symbol) {
                isWinningCombination = false;
                break;
            }
        }
        if (isWinningCombination) {
            for (let cell of combination) {
                let [x, y] = cell;
                let winningCell = findCell(x, y);
                winningCell.style.color = 'red';
            }
            break;
        }
    }
}
 
 
function findCell (row, col) { 
    const targetRow = container.querySelectorAll('tr')[row]; 
    return targetRow.querySelectorAll('td')[col]; 
} 
 
function addResetListener () { 
    const resetButton = document.getElementById('reset'); 
    resetButton.addEventListener('click', resetClickHandler); 
} 


function resetClickHandler() {
    field = [ 
        ["", "", ""], 
        ["", "", ""], 
        ["", "", ""] 
    ];
   gameOver = false;
   turn = 0;
   startGame();
}
 
function checkWinner() {
    const winningCombinations = [
        // Горизонтальные комбинации
        [field[0][0], field[0][1], field[0][2]],
        [field[1][0], field[1][1], field[1][2]],
        [field[2][0], field[2][1], field[2][2]],
        // Вертикальные комбинации
        [field[0][0], field[1][0], field[2][0]],
        [field[0][1], field[1][1], field[2][1]],
        [field[0][2], field[1][2], field[2][2]],
        // Диагональные комбинации
        [field[0][0], field[1][1], field[2][2]],
        [field[0][2], field[1][1], field[2][0]]
    ];

    for (let combination of winningCombinations)  
    { 
        if (combination.every(cell => cell === CROSS))  
        { 
            alert("1 игрок победил");
            return CROSS;     
        }  
        else if (combination.every(cell => cell === ZERO))  
        { 
            alert("2 игрок победил");   
            return ZERO;  
        } 
    } 
    if (turn === 8)  
    {     
        alert("Победила дружба");
        return "DRAW";
    } 
    return null; 
} 

function clickOnCell (row, col) { 
    findCell(row, col).click(); 
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
 
