const CROSS = 'X';
const ZERO = 'O';
const EMPTY = ' ';
let currPlayer = 0;
let field = new Array(11);
const container = document.getElementById('fieldWrapper');
let flag = true;

let win=[];

startGame();
addResetListener();

function startGame () {
    // let size = prompt('Впишите размер поля');
    // if (size<3){
    //     size = prompt('Неверный размер поля, введите новый');
    // }
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
    // Пиши код тут
    if (findCell(row, col).textContent == EMPTY && flag){
        currPlayer++;
        if (currPlayer % 2 == 1){
            field[(row+1)**2 + col-1] = CROSS;
            renderSymbolInCell(CROSS,row,col);
            if (currPlayer>4){
                let result = checkWinner(CROSS);
                if (result!=0) {
                    recolorCells(result);
                    alert('Крестики победили!');
                    if (confirm("Сыграть заново?")) {
                        resetClickHandler();
                        startGame();
                    } else {
                        flag = false;
                    }
                }
                else if(result==0 && currPlayer==9){
                    alert('Победила дружба!')
                    if (confirm("Сыграть заново?")){
                        resetClickHandler();
                        startGame();
                    }
                    else {
                        flag = false;
                    }
                }
            }
        }
        else{
            field[(row+1)**2 + col-1] = ZERO;
            renderSymbolInCell(ZERO,row,col);
            if (currPlayer>5) {
                let result = checkWinner(ZERO);
                if (result!=0) {
                    alert('Нолики победили!');
                    if (confirm("Сыграть заново?")) {
                        resetClickHandler();
                        startGame();
                    }
                    else {
                        flag = false;
                    }
                }
            }
        }
        console.log(`Clicked on cell: ${row}, ${col}`);
    }

    else if(flag){
        alert('Клетка занята!')
    }
    else {
        console.log('Game doesn`t works')
    }
    console.log(field)
}
function checkWinner(sign){
     if(field[0]==sign && field[1]==sign && field[2]==sign){return 'r1';}
     if(field[3]==sign && field[4]==sign && field[5]==sign){return 'r2';}
     if(field[8]==sign && field[9]==sign && field[10]==sign){return 'r3';}
     if(field[0]==sign && field[3]==sign && field[8]==sign){return 'c1';}
     if(field[1]==sign && field[4]==sign && field[9]==sign){return 'c2';}
     if(field[2]==sign && field[5]==sign && field[10]==sign){return 'c3';}
     if(field[0]==sign && field[4]==sign && field[10]==sign){return 'd1';}
     if(field[8]==sign && field[4]==sign && field[2]==sign){return 'd2';}
    else return 0;
}

function recolorCells(res){
    if(res == 'r1'){
        findCell(0,0).style.color='#f00';
        findCell(0,1).style.color='#f00';
        findCell(0,2).style.color='#f00';
    }
    if(res == 'r2'){
        findCell(1,0).style.color='#f00';
        findCell(1,1).style.color='#f00';
        findCell(1,2).style.color='#f00';
    }
    if(res == 'r3'){
        findCell(2,0).style.color='#f00';
        findCell(2,1).style.color='#f00';
        findCell(2,2).style.color='#f00';
    }
    if(res == 'c1'){
        findCell(0,0).style.color='#f00';
        findCell(1,0).style.color='#f00';
        findCell(2,0).style.color='#f00';
    }
    if(res == 'c2'){
        findCell(0,1).style.color='#f00';
        findCell(1,1).style.color='#f00';
        findCell(2,1).style.color='#f00';
    }
    if(res == 'c3'){
        findCell(0,2).style.color='#f00';
        findCell(1,2).style.color='#f00';
        findCell(2,2).style.color='#f00';
    }
    if(res == 'd1'){
        findCell(2,0).style.color='#f00';
        findCell(1,1).style.color='#f00';
        findCell(0,2).style.color='#f00';
    }
    if(res == 'd2'){
        findCell(0,0).style.color='#f00';
        findCell(1,1).style.color='#f00';
        findCell(2,2).style.color='#f00';
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
    console.log('reset!');
    for(let i =0;i<3;i++){
        for(let j =0;j<3;j++) {
            renderSymbolInCell(EMPTY, i, j);
        }
    }
    field = new Array(11);
    flag = true;
    currPlayer = 0;
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
