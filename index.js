const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

let grid = [];
const dimension = prompt('Укажите размерность поля', 3);

startGame();
addResetListener();

function startGame () {   
    renderGrid(dimension);
}

function renderGrid (dimension) {
    grid = createGrid(dimension);
    fillGridEmpty(grid, dimension);
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

let isCross = false;
let notPut = false;
function cellClickHandler (row, col) {
    if(!notPut){
        if(grid[row][col] === EMPTY){
            if(isCross){
                grid[row][col] = CROSS;
                renderSymbolInCell(CROSS, row, col);
                isCross = !isCross;
            }
            else{
                grid[row][col] = ZERO;
                renderSymbolInCell(ZERO, row, col);
                isCross = !isCross;
            }
            console.log(`Clicked on cell: ${row}, ${col}`);
        }

        let winner = checkWinner();
        if(winner){
            notPut = true;
            alert(winner + ' победили!');
        }    
        checkNoMoves();
    }    
}

function checkNoMoves(){
    let noMovesFlag = false;
    for(let row = 0; row < grid.length; row++){
        for(let col = 0; col < grid[row].length; col++){
            if(grid[row][col] === EMPTY){
                noMovesFlag = true;
            }
        }
    }

    if(!noMovesFlag){
        alert('Победила дружба');
    }
}

function checkWinner(){
    let winner;
    let rowOrColCoordinates = [];
    let reversRowOrColCoordinates = [];
    let winnerLine = [];
    for (let i = 0; i < dimension; i++){ 
        rowOrColCoordinates.push(i); 
    }
    for (let i = dimension - 1; i >= 0; i--){
        reversRowOrColCoordinates.push(i); 
    }

    for(let row = 0; row < grid.length; row++){
        for (let i = 0; i < dimension; i++){ 
            winnerLine.push(row);
        }
        winner = checkCombinationValues(grid[row]);
        if(winner){
            paintWinner(winner, winnerLine, rowOrColCoordinates);
            return winner;
        }
        column = [];
        for (let col = 0; col < grid[row].length; col++) {
            column.push(grid[col][row]);
        }
        winner = checkCombinationValues(column);
        if(winner){
            paintWinner(winner, rowOrColCoordinates, winnerLine);
            return winner;
        }
    }

    let firstDiagonal = createFirstDiagonal();
    let secondDiagonal = createSecondDiagonal();

    winner = checkCombinationValues(firstDiagonal);
    if(winner){
        paintWinner(winner, rowOrColCoordinates, rowOrColCoordinates);
        return winner;
    }

    winner = checkCombinationValues(secondDiagonal);
    if(winner){
        paintWinner(winner, rowOrColCoordinates, reversRowOrColCoordinates);
        return winner;
    }
}

function createFirstDiagonal(){
    let firstDiagonal = [];
    for (let row = 0, col = 0; row < dimension && col < dimension; row++, col++){
        firstDiagonal.push(grid[row][col]);
    }
    return firstDiagonal;
}

function createSecondDiagonal(){
    let secondDiagonal = [];
    for (let row = 0, col = dimension - 1; row < dimension && col >= 0; row++, col--){
        secondDiagonal.push(grid[row][col]);
    }
    return secondDiagonal;
}

function checkCombinationValues(combination){
    let firstElement = combination[0];
    for(let i = 1; i < combination.length; i++){
        if(combination[i] != firstElement){
            return false;
        }        
    } 
    if(firstElement != EMPTY){
        return firstElement;
    }
    else{
        return false;
    }
}

function paintWinner(winner, row, col, color = '#FF0000'){
    for (let i = 0; i < dimension; i++){
        renderSymbolInCell(winner, row[i], col[i], color);
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

function createGrid(dimension){
    let grid = new Array(dimension);
    for (let i = 0; i < dimension; i++){
        grid[i] = new Array(dimension);
    }
    return grid;
}

function fillGridEmpty(grid, dimension){
    for (let row = 0; row < dimension; row++){
        for (let col = 0; col < dimension; col++){
            grid[row][col] = EMPTY;
        }
    }
}

function resetClickHandler () {
    console.log('reset!');
    startGame();
    notPut = false;
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
