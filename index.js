const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let gameField;
let activePlayer;
let winner;

function generateGrid (dimension) {
    field = []
    for (let i = 0; i < dimension; i++) {
        field.push([])
        for (let j = 0; j < dimension; j++) {
            field[i].push(EMPTY)
        }
    }
    return field
}

startGame();
addResetListener();

function startGame () {
    gameField = generateGrid (3)
    activePlayer = CROSS
    winner = EMPTY
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
    if (winner != EMPTY) return

    if (gameField[row][col] == EMPTY) {
        renderSymbolInCell(activePlayer, row, col, '#F00');
        gameField[row][col] = activePlayer
        activePlayer = activePlayer === CROSS ? ZERO : CROSS
    }
    console.log(`Clicked on cell: ${row}, ${col}`);
    winner = checkingWinner ()
    if (winner != EMPTY) alert(`Победили ${winner} !!!`)
    else if (checkingFullField ()) alert(`Победила дружба !!!`)

    /* Пользоваться методом для размещения символа в клетке так:
        renderSymbolInCell(ZERO, row, col);
     */
}

function checkingFullField () {
    for (let i = 0; i < gameField.length; i++) 
        for (let j = 0; j < gameField.length; j++)
            if (gameField[i][j] == EMPTY) return false
    return true
}

function checkingWinner () {
    ans = EMPTY
    for (let i = 0; i < gameField.length; i++) {
        if (checkingMasIdentity(gameField[i]) != EMPTY) return checkingMasIdentity(gameField[i])
    }

    for (let i = 0; i < gameField.length; i++) {
        if (checkingMasIdentity(gameField.map(item => item[i])) != EMPTY) return checkingMasIdentity(gameField.map(item => item[i]))
    }
    
    d1 = []
    d2 = []
    for (let i = 0; i < gameField.length; i++) {
        d1.push(gameField[i][i])
        d2.push(gameField[i][gameField.length - 1 - i])
    }
    if (checkingMasIdentity(d1) != EMPTY) return checkingMasIdentity(d1)
    if (checkingMasIdentity(d2) != EMPTY) return checkingMasIdentity(d2)
    return ans
}

function checkingMasIdentity (mas) {
    first = mas[0] 
    return mas.every(element => element == first) ? first : EMPTY
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
    startGame()
    console.log('reset!');
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
