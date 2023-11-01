const CROSS = "X";
const ZERO = "O";
const EMPTY = " ";
const container = document.getElementById("fieldWrapper");

let board = [];
let dimension = 3;
let currentPlayer = CROSS;
// let clickCount = 0;

startGame();
addResetListener();

function startGame() {
  dimension = getRandomInt(3, 10);
  console.log("Новая игра");
  board = createBoard(dimension);
  renderGrid(dimension);
  currentPlayer = CROSS;
  console.log(board);
}
function createBoard(dimension) {
  const board = [];
  for (let i = 0; i < dimension; i++) {
    board.push([]);
    for (let j = 0; j < dimension; j++) {
      board[i].push(EMPTY);
    }
  }
  return board;
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
function renderGrid(dimension) {
  container.innerHTML = "";

  for (let i = 0; i < dimension; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < dimension; j++) {
      const cell = document.createElement("td");
      cell.textContent = EMPTY;
      cell.addEventListener("click", () => {
        cellClickHandler(i, j);
      });
      row.appendChild(cell);
    }

    container.appendChild(row);
  }
}

function cellClickHandler(row, col) {
  // Пиши код тут

  if (board[row][col] == EMPTY) {
    // clickCount++;
    // console.log(clickCount);
    renderSymbolInCell(currentPlayer, row, col);
    board[row][col] = currentPlayer;
    let isWin = checkWin(board);

    checkTie(isWin.isWin);
    if (isWin.isWin) {
      alert(`Победил ${currentPlayer}`);
      removeEventListeners();
    }

    if (currentPlayer === CROSS) {
      currentPlayer = ZERO;
    } else {
      currentPlayer = CROSS;
    }
    console.log(board);
  } else return;
}
function checkTie(isWin) {
  let testRow = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== " ") {
        testRow += 1;
      }
    }
  }

  if (testRow === board[0].length * board.length && !isWin) {
    alert("Победила дружба");
  }
  return false;
}
function highlightWinningCells(coords) {
  for (let i = 0; i < coords.length; i++) {
    renderSymbolInCell(currentPlayer, coords[i][0], coords[i][1], "red");
  }
}
function checkWin(arr) {
  const rows = arr.length;
  const cols = arr[0].length;
  // Проверка строк
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols - 2; j++) {
      const element = arr[i][j];
      if (
        element !== " " &&
        element === arr[i][j + 1] &&
        element === arr[i][j + 2]
      ) {
        // alert(`Победил ${currentPlayer}`);
        highlightWinningCells([
          [i, j],
          [i, j + 1],
          [i, j + 2],
        ]);
        return {
          isWin: true,
          coordinates: [
            [i, j],
            [i, j + 1],
            [i, j + 2],
          ],
        };
      }
    }
  }

  // Проверка столбцов
  for (let i = 0; i < rows - 2; i++) {
    for (let j = 0; j < cols; j++) {
      const element = arr[i][j];
      if (
        element !== " " &&
        element === arr[i + 1][j] &&
        element === arr[i + 2][j]
      ) {
        // alert(`Победил ${currentPlayer}`);
        highlightWinningCells([
          [i, j],
          [i + 1, j],
          [i + 2, j],
        ]);
        return {
          isWin: true,
          coordinates: [
            [i, j],
            [i + 1, j],
            [i + 2, j],
          ],
        };
      }
    }
  }

  // Проверка главной диагонали (слева сверху вправо вниз)
  for (let i = 0; i < rows - 2; i++) {
    for (let j = 0; j < cols - 2; j++) {
      const element = arr[i][j];
      if (
        element !== " " &&
        element === arr[i + 1][j + 1] &&
        element === arr[i + 2][j + 2]
      ) {
        // alert(`Победил ${currentPlayer}`);
        highlightWinningCells([
          [i, j],
          [i + 1, j + 1],
          [i + 2, j + 2],
        ]);
        return {
          isWin: true,
          coordinates: [
            [i, j],
            [i + 1, j + 1],
            [i + 2, j + 2],
          ],
        };
      }
    }
  }
  // Проверка побочной диагонали (слева снизу вправо вверх)
  for (let i = rows - 1; i >= 2; i--) {
    for (let j = 0; j < cols - 2; j++) {
      const element = arr[i][j];
      if (
        element !== " " &&
        element === arr[i - 1][j + 1] &&
        element === arr[i - 2][j + 2]
      ) {
        // alert(`Победил ${currentPlayer}`);
        highlightWinningCells([
          [i, j],
          [i - 1, j + 1],
          [i - 2, j + 2],
        ]);
        return {
          isWin: true,
          coordinates: [
            [i, j],
            [i - 1, j + 1],
            [i - 2, j + 2],
          ],
        };
      }
    }
  }

  return {
    isWin: false,
    coordinates: [],
  };
}
function renderSymbolInCell(symbol, row, col, color = "#333") {
  const targetCell = findCell(row, col);

  targetCell.textContent = symbol;
  targetCell.style.color = color;
}

function findCell(row, col) {
  const targetRow = container.querySelectorAll("tr")[row];
  return targetRow.querySelectorAll("td")[col];
}
function removeEventListeners() {
  const cells = container.getElementsByTagName("td");
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const newCell = cell.cloneNode(true);
    cell.parentNode.replaceChild(newCell, cell);
  }
}
function addResetListener() {
  const resetButton = document.getElementById("reset");
  resetButton.addEventListener("click", resetClickHandler);
}

function resetClickHandler() {
  console.log("reset!");
  startGame();
}

/* Test Function */
/* Победа первого игрока */
function testWin() {
  clickOnCell(0, 2);
  clickOnCell(0, 0);
  clickOnCell(2, 0);
  clickOnCell(1, 1);
  clickOnCell(2, 2);
  clickOnCell(1, 2);
  clickOnCell(2, 1);
}

/* Ничья */
function testDraw() {
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

function clickOnCell(row, col) {
  findCell(row, col).click();
}
