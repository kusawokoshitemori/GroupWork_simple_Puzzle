// script.js
const boardSize = 15;
let board = [];
let currentPlayer = "X";
const boardElement = document.getElementById("board");
const messageElement = document.getElementById("message");

function createBoard() {
  board = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(""));
  boardElement.innerHTML = "";
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener("click", onCellClick);
      boardElement.appendChild(cell);
    }
  }
  messageElement.textContent = `Player ${currentPlayer}'s turn`;
}

function onCellClick(event) {
  const row = event.target.dataset.row;
  const col = event.target.dataset.col;

  if (board[row][col] === "") {
    board[row][col] = currentPlayer;
    event.target.textContent = currentPlayer;
    if (checkWin(row, col)) {
      messageElement.textContent = `Player ${currentPlayer} wins!`;
      boardElement.removeEventListener("click", onCellClick);
    } else {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      messageElement.textContent = `Player ${currentPlayer}'s turn`;
    }
  }
}

function checkWin(row, col) {
  const directions = [
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
  ];

  for (const { x, y } of directions) {
    let count = 1;

    for (let i = 1; i < 5; i++) {
      const newRow = +row + i * y;
      const newCol = +col + i * x;
      if (
        newRow >= 0 &&
        newRow < boardSize &&
        newCol >= 0 &&
        newCol < boardSize &&
        board[newRow][newCol] === currentPlayer
      ) {
        count++;
      } else {
        break;
      }
    }

    for (let i = 1; i < 5; i++) {
      const newRow = +row - i * y;
      const newCol = +col - i * x;
      if (
        newRow >= 0 &&
        newRow < boardSize &&
        newCol >= 0 &&
        newCol < boardSize &&
        board[newRow][newCol] === currentPlayer
      ) {
        count++;
      } else {
        break;
      }
    }

    if (count >= 5) {
      return true;
    }
  }
  return false;
}

function resetGame() {
  currentPlayer = "X";
  createBoard();
}

document.addEventListener("DOMContentLoaded", () => {
  createBoard();
});
