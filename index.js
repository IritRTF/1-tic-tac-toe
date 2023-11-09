const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';


let countOfSteps = 0;
const container = document.getElementById('fieldWrapper');

let rightSymbol = CROSS;
let field;
let dimension;
let answers;
let randomRow;
let randomCol;

startGame();
addResetListener();

function startGame () {
    dimension = Number(prompt('Введите размер поля n:'));
    renderGrid(dimension);
}

function renderGrid (dimension) {
    container.innerHTML = '';
    createField(dimension);
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

function createField(dimension){
    field = [];
    for(let i = 0 ; i < dimension; i++){
        let row = [];
        for(let j = 0; j < dimension; j++){
            row.push(EMPTY);
        }
        field.push(row);
    }
}

function isWinner(symbol){
    for(let i = 0; i < dimension; i++){
        answers = [];

        for(let j = 0; j < dimension; j++){
            
            if(field[i][j] !== symbol){
                break;
            }

            answers.push([i, j]);
        }

        if (answers.length === dimension){
            return "Победил " + symbol;
        }

        answers = [];

        for(let j = 0; j < dimension; j++){

            if(field[j][i] !== symbol){
                break;
            }

            answers.push([j,i]);
        }

        if (answers.length === dimension){
            return "Победил " + symbol;
        }
    }

    answers = [];

    for(let i = 0; i < dimension; i++){
        
        if(field[i][i] !== symbol){
            break;
        }

        answers.push([i,i]);
    }

    if (answers.length === dimension){
        return "Победил " + symbol;
    }

    answers = [];

    for(let i = 0; i < dimension; i++){
        
        if(field[dimension - 1 - i][i] !== symbol){
            break;
        }

        answers.push([dimension - 1 - i, i]);
    }

    if (answers.length === dimension){
        return "Победил " + symbol;
    }
}

function determineRightSymbol(){
    rightSymbol = countOfSteps % 2 === 0 ? CROSS : ZERO;
    countOfSteps++;
}

function computerMove(){
    if (isWinner(rightSymbol) !== 'Победил ' + rightSymbol){
        determineRightSymbol();
        randomRow = Math.floor(Math.random() * dimension);
        randomCol = Math.floor(Math.random() * dimension);
        
        while(field[randomRow][randomCol] != EMPTY){
            
            randomRow = Math.floor(Math.random() * dimension);
            randomCol = Math.floor(Math.random() * dimension);
        }
    
        field[randomRow][randomCol] = rightSymbol;
        renderSymbolInCell(rightSymbol, randomRow, randomCol);
        if (isWinner(rightSymbol) == 'Победил ' + rightSymbol){
            for(let i = 0; i < dimension; i++){
                renderSymbolInCell(rightSymbol, answers[i][0], answers[i][1], color = 'red');
            }

            alert(isWinner(rightSymbol));
        }
        else if(countOfSteps == dimension**2){
            alert('Победила дружба');
        }
    }
}

function cellClickHandler(row, col) {
    
    if ((field[row][col] === EMPTY) & (isWinner(rightSymbol) !== 'Победил ' + rightSymbol)){

        determineRightSymbol();
        renderSymbolInCell(rightSymbol, row, col);
        field[row][col] = rightSymbol;
     
        if (isWinner(rightSymbol) == 'Победил ' + rightSymbol){

            for(let i = 0; i < dimension; i++){
                renderSymbolInCell(rightSymbol, answers[i][0], answers[i][1], color = 'red');
            }
            
            alert(isWinner(rightSymbol));
        }
        else if (countOfSteps == dimension**2){
            alert('Победила дружба');
        }
        else{
            computerMove();
        }
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

function addResetListener() {
    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', resetClickHandler);
}

function resetClickHandler () {
    field = field.map(row => row.map(() => EMPTY));
    for(let i = 0; i < dimension; i++){
        for(let j = 0; j < dimension; j++){
            renderSymbolInCell(EMPTY, i, j);
        }
    }
    rightSymbol = CROSS;
    countOfSteps = 0;
}

function clickOnCell (row, col) {
    findCell(row, col).click();
}
