const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const DIMENSION = prompt('Укажите размер поля:',3)
let grid = [];
let canPlay = true;
let currentClickedCells = 0;

const container = document.getElementById('fieldWrapper');

startGame();
addResetListener();

function startGame () {
    renderGrid(DIMENSION);
}

function renderGrid (dimension) {
    generateGrid(dimension)
    container.innerHTML = '';

    for (let i = 0; i < dimension; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < dimension; j++) {
            const cell = document.createElement('td');
            cell.textContent = grid[i][j];
            cell.addEventListener('click', () => cellClickHandler(i, j));
            row.appendChild(cell);
        }
        container.appendChild(row);
    }
    
}

function cellClickHandler (row, col) {
    if(canPlay)
    {
        console.log(`Clicked on cell: ${row}, ${col}`);
        if (grid[row][col] === EMPTY) {
            currentClickedCells++;
            renderSymbolInCell(CROSS, row, col);
            grid[row][col] = CROSS;
        }
        else return;

        if (winCheck() == CROSS) {
            alert("Cross wins");
            canPlay = false;
            return;
        }
        else if (currentClickedCells == grid.length*grid.length)
        {
            alert("Победила дружба")
            canPlay = false;
            return;
        }
        if(canPlay)
        {
            makeTurn();
            if (winCheck() == ZERO) {
                alert("Zero wins");
                canPlay = false;
            }
            else if (currentClickedCells == grid.length*grid.length)
            {
                alert("Победила дружба")
                canPlay = false;
                return;
            }
        }

        /* Пользоваться методом для размещения символа в клетке так:
            renderSymbolInCell(ZERO, row, col);
        */
        if(currentClickedCells > (grid.length * grid.length) / 2)
        {
            renderGrid(grid.length+1);
        }
    }
}


function generateGrid(newLength)
{
    for (let row = 0; row < grid.length; row++) {
        for (let col = grid.length; col < newLength; col++) {
            grid[row].push(EMPTY);
        }
    }

    for (let row = grid.length; row < newLength; row++) {
        grid[row] = [];
        for (let col = 0; col < newLength; col++) {
            grid[row].push(EMPTY);
        }     
    } 
}

/*
function generateGrid(dimension)
{
    for (let i = grid.length; i < dimension; i++) {
        grid[i] = [];
        for (let y = grid[i].length; y < dimension;y++)
        {
            if(grid[i][y] != CROSS && grid[i][y] != CROSS)
                grid[i][y] = EMPTY;
        }
    }
}
*/
function isGridDontHaveEmptySlot()
{
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if(grid[i][j] != EMPTY)
            {
                return false;
            }
        }
    }
    return true;
}

function winCheck()
{
    for (let row = 0; row < grid.length; row++) {
        let firstElementOfString = grid[row][0];
        if(firstElementOfString != EMPTY) {
            for (let col = 1; col < grid[row].length; col++) {
                if (grid[row][col] != firstElementOfString) {
                    break;
                } else if (col == grid[row].length - 1) {
                    drawRow(row)
                    return firstElementOfString;
                }
            }
        }

        let firstElementOfColumn = grid[0][row]
        if(firstElementOfColumn != EMPTY)
        {
            for (let realRow = 0; realRow < grid[0].length; realRow++) {
                if(grid[realRow][row] != firstElementOfColumn)
                {
                    break;
                }
                else if(realRow == grid[0].length - 1)
                {
                    drawColumn(row);
                    return firstElementOfColumn;
                }
            }
        }

        let mainDiagonalFirstElement = grid[0][0]
        if(mainDiagonalFirstElement != EMPTY)
        {
            for (let i = 0; i < grid[0].length; i++) {
                for (let j = 0; j < grid[0].length; j++) {
                    if(i === j)
                    {
                        if(grid[i][j] != mainDiagonalFirstElement) {
                            i = grid.length;
                            break;
                        }
                        else if(i == grid.length - 1 && j == grid.length - 1)
                        {
                            drawMainDiadonal();
                            return grid[grid.length - 1][grid.length - 1];
                        }
                    }
                }
            }
        }

        let secondDiagonalFirstElement = grid[0][grid.length - 1]
        if(secondDiagonalFirstElement != EMPTY)
        {
            for (let i = 0; i < grid.length; i++) {

                for (let j = 0; j < grid.length; j++) {
                    if(i + j == grid.length - 1)
                    {
                        if(grid[i][j] != secondDiagonalFirstElement) {
                            i = grid.length;
                            break;
                        }
                        else if(i == grid.length - 1 && j == 0)
                        {
                            drawSecondDiadonal();
                            return grid[grid.length - 1][0];
                        }
                    }
                }
            }
        }
    }
}

function drawSecondDiadonal()
{
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            if(i + j == grid.length - 1)
            {
                renderSymbolInCell(grid[i][j],i,j,'#ff0000')
            }
        }
    }
}

function drawMainDiadonal()
{
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            if(i == j)
            {
                renderSymbolInCell(grid[i][j],i,j,'#ff0000')
            }
        }
    }
}

function drawColumn(j)
{
    for (let k = 0; k < grid.length; k++) {
        for (let l = 0; l < grid.length; l++) {
            if(l == j)
            {
                renderSymbolInCell(grid[k][l],k,l,'#ff0000')
            }
        }
    }
}

function drawRow(j)
{
    for (let k = 0; k < grid.length; k++) {
        renderSymbolInCell(grid[j][k],j,k,'#ff0000')
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
    currentClickedCells = 0;
    grid = [];
    startGame();
    canPlay = true;
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
/*
function makeIITurn()
{
    for (let row = 0; row < grid.length; row++) {
        let firstElementOfString = grid[row][0];
        if(firstElementOfString != EMPTY) {
            for (let col = 1; col < grid[row].length; col++) {
                if (col == grid[row].length - 1) {
                    makeTurn(firstElementOfString,row,col)
                    return;
                }
                if (grid[row][col] != firstElementOfString) {
                    break;
                }
            }
        }

        let firstElementOfColumn = grid[0][row]
        if(firstElementOfColumn != EMPTY)
        {
            for (let realRow = 0; realRow < grid[0].length; realRow++) {
                if(realRow == grid[0].length - 1)
                {
                    makeTurn(firstElementOfColumn,realRow,row)
                    return;
                }
                if(grid[realRow][row] != firstElementOfColumn)
                {
                    break;
                }
            }
        }

        let mainDiagonalFirstElement = grid[0][0]
        if(mainDiagonalFirstElement != EMPTY)
        {
            for (let i = 0; i < grid[0].length; i++) {
                for (let j = 0; j < grid[0].length; j++) {
                    if(i === j)
                    {
                        if(i == grid.length - 1 && j == grid.length - 1)
                        {
                            makeTurn(mainDiagonalFirstElement,i,j)
                            return;
                        }
                        if(grid[i][j] != mainDiagonalFirstElement) {
                            i = grid.length;
                            break;
                        }
                    }
                }
            }
        }

        let secondDiagonalFirstElement = grid[0][grid.length - 1]
        if(secondDiagonalFirstElement != EMPTY)
        {
            for (let i = 0; i < grid.length; i++) {

                for (let j = 0; j < grid.length; j++) {
                    if(i + j == grid.length - 1)
                    {
                        if(i == grid.length - 1 && j == 0)
                        {
                            makeTurn(secondDiagonalFirstElement,i,j);
                            return;
                        }
                        if(grid[i][j] != secondDiagonalFirstElement) {
                            i = grid.length;
                            break;
                        }
                    }
                }
            }
        }
    }
    makeTurn();
}
*/
function makeTurn(type,row, column)
{
    currentClickedCells++;
    let random = []
    isPlayerTurn = true;
    if(arguments.length === 0)
    {
        let randomizedDots = [];
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid.length; col++) {
                if(grid[row][col] === EMPTY)
                {
                    randomizedDots.push([grid[row][col],row,col])
                }
            }
        }
        random = arrayRandElement(randomizedDots);
    }
    else{
        random = [type,row,column];
    }
    grid[random[1]][random[2]] = ZERO;
    renderSymbolInCell(ZERO,random[1],random[2]);
}

function arrayRandElement(arr) {
    var rnd = Math.floor(Math.random() * arr.length);
    return arr[rnd];
}
