const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
const DIMENSION = prompt('Укажите размер поля:',3)
let grid = [];
let collumns = [];//[cross,zero]
let rows = [];//[cross,zero]
let mainDiagonal = [0,0];//[cross,zero]
let secondDiagonal = [0,0];//[cross,zero]
let isGidAutomaticlyGrow = confirm('Вы хотите, чтобы поле раширялось во время игры ?');
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

function generateGrid(newLength)
{
    for (let row = 0; row < grid.length; row++) {
        for (let col = grid.length; col < newLength; col++) {
            grid[row].push(EMPTY);
        }
    }

    for (let row = grid.length; row < newLength; row++) {
        grid[row] = [];
        rows.push([0,0]);
        collumns.push([0,0]);
        for (let col = 0; col < newLength; col++) {
            grid[row].push(EMPTY);
        }     
    } 
}

function cellClickHandler (row, col) {
    if(canPlay)
    {
        console.log(`Clicked on cell: ${row}, ${col}`);
        if (grid[row][col] === EMPTY) {
            addToMeta(row,col,CROSS);
        }
        else return;
        if (checkWin(CROSS)) return;
        if(currentClickedCells > (grid.length * grid.length) / 2 && isGidAutomaticlyGrow)
        {
            renderGrid(grid.length+1);
        }
        MakeIITurn();
        if (checkWin(ZERO)) return;
    }
}

function checkWin(type)
{
    if (winCheck() == type) {
        alert( type + " wins");
        canPlay = false;
        return true;
    }
    else if (currentClickedCells == grid.length*grid.length)
    {
        alert("Победила дружба")
        canPlay = false;
        return true;
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

function resetClickHandler () {
    clearMap();
    startGame();
    console.log('reset!');
}

function winCheck() {
    for (let indexer = 0; indexer < rows.length; indexer++) {
        let check = checkMeta(rows[indexer]);
        if(check[0]) 
        {
            drawRow(indexer);
            return check[1];
        }
        else
        {
            check = checkMeta(collumns[indexer]);
            if(check[0]) 
            {
                drawColumn(indexer);
                return check[1];
            }
        }
    }
    let diagonalCheck = checkMeta(mainDiagonal);
    if(diagonalCheck[0]) 
    {
        drawMainDiadonal();
        return diagonalCheck[1];
    }
    else
    {
        diagonalCheck = checkMeta(secondDiagonal);
        if(diagonalCheck[0]) 
        {
            drawSecondDiadonal();
            return diagonalCheck[1];
        }
    }
}

function checkMeta(massive)
{
    if (massive[0] == grid.length)
    {
        return [true,CROSS];
    }
    else if(massive[1] == grid.length)
    {
        return [true,ZERO];
    }
    else
    {
        return [false,EMPTY];
    }
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}

function clearMap()
{
    currentClickedCells = 0;
    grid = [];
    canPlay = true;
    rows = [];
    collumns = [];
    mainDiagonal = [0,0];
    secondDiagonal = [0,0];
}

function addToMeta(row,col,type)
{
    let numElement = (type === CROSS) ? 0 : 1;
    currentClickedCells++;
    renderSymbolInCell(type, row, col);
    grid[row][col] = type;
    rows[row][numElement] += 1;
    collumns[col][numElement] += 1;
    if(row === col)
    {
        mainDiagonal[numElement] += 1;
    }

    if(row + col === grid.length - 1)
    {
        secondDiagonal[numElement] += 1;
    }
}

function MakeIITurn()
{
    for (let row = 0; row < rows.length; row++) {
        if(rows[row][1] == grid.length - 1)
        {
            for (let col = 0; col < grid.length; col++) {
                if(grid[row][col] === EMPTY)
                {
                    makeTurn(row,col)
                    return;
                }
            }
        }
        if(collumns[row][1] == grid.length - 1)
        {
            for (let realRow = 0; realRow < grid.length; realRow++) {
                if(grid[realRow][row] === EMPTY)
                {
                    makeTurn(realRow,row)
                    return;
                }
            }
        }
    }
    if(mainDiagonal[1] === grid.length - 1)
    {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid.length; j++) {
                if(i === j && grid[i][j] === EMPTY)
                {
                    makeTurn(ZERO,i,j);
                    return;
                }
            }
        }
    }
    else if (secondDiagonal[1] === grid.length - 1)
    {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid.length; j++) {
                if(i + j === grid.length - 1)
                {
                    makeTurn(ZERO,i,j);
                    return;
                }
            }
        }
    }
    makeTurn();
}

function makeTurn(row, column)
{
    let random = []
    isPlayerTurn = true;
    if(arguments.length === 0)
    {
        let randomizedDots = [];
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid.length; col++) {
                if(grid[row][col] === EMPTY)
                {
                    randomizedDots.push([row,col])
                }
            }
        }
        random = arrayRandElement(randomizedDots);
    }
    else{
        random = [row,column];
    }
    addToMeta(random[0],random[1],ZERO);
}

function arrayRandElement(arr) {
    var rnd = Math.floor(Math.random() * arr.length);
    return arr[rnd];
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
