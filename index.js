const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';

const container = document.getElementById('fieldWrapper');

const sideLength = prompt('Введите размерность поля 3 или больше')
const gameField = makeField()
let clickCounter = 0
let checkWin = false
const possibleClicksCount = gameField.length * gameField.length

startGame();
addResetListener();

function makeField(){
    let Field = []
    for( let i = 0; i<Number(sideLength);i++){
        Field.push(Field);
    }
    return Field;
}

function initGameField(dimension, gameField){
    for (let i = 0; i < dimension; i++) {
        gameField[i] = new Array(dimension)
        for (let j = 0; j < dimension; j++) {
            gameField[i][j] = EMPTY;
        }
    }
    console.log(gameField, 'Field initialized')
}

function startGame () {
    initGameField(sideLength, gameField);
    renderGrid(sideLength);
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

function checkWinner(gameField){

    const crossWin=()=>{
        alert(`${CROSS} победил`)
        checkWin = true
        return true
    }
    const zeroWin=()=>{
        alert(`${ZERO} победил`)
        checkWin = true
        return true
    }

    const checkHorizontalWinner = () => {
        for (let i=0;i<gameField.length;i++){
            let rowString = gameField[i].join("")
            if (rowString === CROSS.repeat(gameField.length)){
                paintWinningFields(rowString, i)
                crossWin()
            }
            else if(rowString === ZERO.repeat(gameField.length)) {
                paintWinningFields(rowString, i)
                zeroWin()
            }
        }
    }
    const checkVerticalWinner = (index) => {
        let flatArray = gameField.flat(2)
        let word = ''
        for (let i = index; i < flatArray.length; i+=gameField.length) {
            if(flatArray[i]===EMPTY)
                continue
            word += flatArray[i]
        }
        if( word===CROSS.repeat(gameField.length)){
            paintWinningFields(gameField, index, true)
            crossWin()
        }
        else if( word===ZERO.repeat(gameField.length)){
            paintWinningFields(gameField, index, true)
            zeroWin()
        }
    }

    const checkLeftToRightDiagonal=() =>{
        let flatArray = gameField.flat(2)
        let word = ''
        for (let i = 0; i < flatArray.length; i+=gameField.length+1){
            if(flatArray[i]===EMPTY)
                continue
            word += flatArray[i]
        }
        if(word === CROSS.repeat(gameField.length)){
            paintWinningFields(gameField, gameField, false, true)
            crossWin()
        }
            
        else if(word === ZERO.repeat(gameField.length)){
            paintWinningFields(gameField, gameField, false, true)
            zeroWin()
        }
    }
    
    const checkDiagonalWinner = () => {
        let flatArray = gameField.flat(2)
        console.log(flatArray)
        let word1 = ''
        let ind = gameField.length -1 
        for (let i = gameField.length-1; i < flatArray.length-1; i+=gameField.length-1){
            if(flatArray[i]===EMPTY)
                continue
            word1 += flatArray[i]
        }

        if(word1 === CROSS.repeat(gameField.length)){
            paintWinningFields(gameField, gameField, false, false, true)
            crossWin()
        }
        else if(word1 === ZERO.repeat(gameField.length)){
            paintWinningFields(gameField, gameField, false, false, true)
            zeroWin()
        }
        checkLeftToRightDiagonal()
    }

    const paintWinningFields = (line, startIndex, col = false, diagLR = false, diagRL = false) => {
        if(diagLR){
            for (let i = 0; i < line.length; i++) {
                findCell(i, i).style.color = 'red'
            }
            return
        }
        if(diagRL){
            let j = gameField.length-1
            for (let i = 0; i < line.length; i++) {
                findCell(i, j).style.color = 'red'
                j--
            }
            return
        }
        if (col){
            for (let i = 0; i < line.length; i++) {
                findCell(i, startIndex).style.color = 'red'
            }
            return
        }
        for (let i = 0; i < line.length; i++) {
            findCell(startIndex, i).style.color = 'red'
        }
    }

    checkHorizontalWinner()
    for(let i=0;i<gameField.length;i++){
        if(checkVerticalWinner(i)){
            break
        }
    }
    checkDiagonalWinner()
}

function randomInteger(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function makeList(){
    let list = [] 
    for(let i = 0; i<gameField.length; i++){
        for(let j = 0; j<gameField.length; j++){
            if(gameField[i][j]===EMPTY)
                list.push([i, j])
        }
    }
    console.log(list)
    return list
}

function Bot (){
    let list = makeList()
    let rnd = randomInteger(0,list.length-1)
    let row = list[rnd][0]
    let col = list[rnd][1]
    if(checkWin === false){
        //console.log(`Clicked on cell: ${row}, ${col}`);
        renderSymbolInCell(ZERO, row, col);
        gameField[row][col] = ZERO
        clickCounter++;
        return ZERO
    }
}

function Player (row, col){
    gameField[row][col] = CROSS
    console.log(`Clicked on cell: ${row}, ${col}`);
    renderSymbolInCell(CROSS, row, col);
    clickCounter++;
    return CROSS
}

function cellClickHandler (row, col) {
    if (gameField[row][col]===EMPTY && checkWin === false){
        Player(row, col)
    }
    console.log(gameField);
    checkWinner(gameField)
    if(checkWin === false)
            Bot();
    if (clickCounter === possibleClicksCount && checkWin === false)
        alert('Победила дружба')
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
    for(let i=0; i<gameField.length; i++){
        for(let j = 0; j<gameField.length; j++){
            gameField[i][j]=EMPTY;
            renderSymbolInCell(EMPTY, i, j)
        }
    }
    clickCounter = 0
    checkWin = false
    console.log(gameField)
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
