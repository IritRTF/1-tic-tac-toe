const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let gameContinues = true;
let fieldSize;
let field;
let gameStep = 0;
let roboEnemy;
const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    //renderGrid(3);
    fieldSize = Number(prompt('Введите размер поля:', 3));
    gameContinues = true;
    field = createField(fieldSize);
    renderGrid(fieldSize);
    roboEnemy = confirm('Включить проотивника?')
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

function cellClickHandler(row, col) {
    if (gameContinues && field[row][col] === EMPTY) {
      let symbol = gameStep % 2 === 0 ? CROSS : ZERO;
      renderSymbolInCell(symbol, row, col);
      field[row][col] = symbol;
      gameStep++;
      checkWin(symbol);
    }
}

function checkWin(symbol) {
    if (checkSym(symbol)) {
        gameContinues = false;
        alert(`Побкдил ${symbol}`);
    } else if (gameStep == fieldSize*fieldSize) {
        gameContinues = false;
        alert("Ничья");
    }
}

function checkSym(symbol) {
    let mainDiag = [];
    let subDiag = [];
  
    for (let i = 0; i < fieldSize; i++) {
      let horizon = [];
      let vertical = [];
  
      for (let j = 0; j < fieldSize; j++) {
        if (field[i][j] === symbol) horizon.push({ row: i, col: j });
        if (field[j][i] === symbol) vertical.push({ row: j, col: i });
      }
  
      if (field[i][i] === symbol) mainDiag.push({ row: i, col: i });
      if (field[fieldSize - 1 - i][i] === symbol) subDiag.push({ row: fieldSize - 1 - i, col: i });
  
      if (checker(horizon) || checker(vertical) || checker(mainDiag) || checker(subDiag)) {
        return true;
      }
    }
  
    return false;
}

function checker(line) {
    return line.length === fieldSize;
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
    gameStep = 0;
    gameContinues = true;
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
