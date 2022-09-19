const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let currentPlayer = CROSS;
let countMove = 0;
let endGame = false;
let winCombination = new Array;

let sizeGrid = Number (prompt("Введите размер поля", 3));
let cellArray = new Array(sizeGrid);

createCellDoubArr();
startGame(sizeGrid);
addResetListener();

function createCellDoubArr(){
    for (let i = 0; i < cellArray.length; i++){
        cellArray[i] = new Array(sizeGrid); //[Cross/Zero/Empty, player]
            for(let j = 0; j < cellArray[i].length; j++)
            cellArray[i][j] = EMPTY;
    }

    //Для расширения поля, можно сделать массив больше, чем он изначально нужен
}

function startGame (size) {
    renderGrid(size); 
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

    if(!endGame && findCell(row, col).textContent == EMPTY){
        renderSymbolInCell(currentPlayer, row, col);
        cellArray[row][col] = currentPlayer;
        if(countMove >= 4) checkWin();
        currentPlayer = (currentPlayer == CROSS) ? ZERO : CROSS;
        countMove++;
    }
    console.log(`Clicked on cell: ${row}, ${col}`);
    console.log(cellArray[row][col]);

    if(countMove == sizeGrid ** 2) {
        endGame = true;
        alert("Победила дружба");
    }
}

function checkWin(){
    checkWinHorizontal();
    checkWinVertical();
    checkWinDiagonal();

    //Игрок может выйграть только в сой ход
    //Нужно проверять только последний ход игрока
    //Нужно проверять противоположные стороны 
    //Проверка может начинаться после (хода = SizeGrid * 2 (два игрока))
}

function checkWinHorizontal(){
    for(let x = 0; x < cellArray.length; x++){
        let flag = true;
        
        if(cellArray[x][0] == EMPTY){ 
            flag = false;
            continue;
        }

        if(cellArray[x][0] != currentPlayer){
            flag = false;
            continue;
        }

        for(let y = 0; y < cellArray[x].length; y++){
            if(cellArray[x][0] != cellArray[x][y]){
                flag = false;
                winCombination = [];
                break;
            }
            else winCombination.push([x, y]);
        }
        if(flag) {
            endGame = true;
            paintOverWinComb();
            alert(`Победил ${currentPlayer}`);
            break;
        }
    }
}

function checkWinVertical(){
    for(let y = 0; y < cellArray[0].length; y++){
        let flag = true;
        
        if(cellArray[0][y] == EMPTY){ 
            flag = false;
            continue;
        }

        if(cellArray[0][y] != currentPlayer){
            flag = false;
            continue;
        }

        for(let x = 0; x < cellArray[y].length; x++){
            if(cellArray[0][y] != cellArray[x][y]){
                flag = false;
                winCombination = [];
                break;
            }
            else winCombination.push([x, y]);
        }
        if(flag) {
            endGame = true;
            paintOverWinComb();
            alert(`Победил ${currentPlayer}`);
            break;
        }
    }
}

function checkWinDiagonal(){
    let flag = true;
    let upRightPoint = cellArray.length - 1;
    
    if(cellArray[0][0] == currentPlayer){
        for(let i = 0; i < cellArray.length; i++){
            if(cellArray[i][i] != currentPlayer){
                flag = false;
                winCombination = [];
                break;
            }
            else winCombination.push([i, i]);
        }
    }
    else if(cellArray[0][upRightPoint] == currentPlayer){
        for(let i = 0; i < cellArray.length; i++){
            if(cellArray[i][upRightPoint - i] != currentPlayer){
                flag = false;
                winCombination = [];
                break;
            }
            else winCombination.push([i, upRightPoint - i]);
        }
    }
    else 
        flag = false;

    if(flag) {
        endGame = true;
        paintOverWinComb();
        alert(`Победил ${currentPlayer}`);
    }
}

function paintOverWinComb(){
    for(let e of winCombination){
        let cell = findCell(e[0], e[1]);
        cell.style.color = 'red';
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
    endGame = false;
    countMove = 0;
    currentPlayer = CROSS;
    createCellDoubArr();
    renderGrid(sizeGrid);
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
