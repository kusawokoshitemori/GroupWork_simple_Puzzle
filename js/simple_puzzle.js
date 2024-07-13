const boardSize = 15;
let board = [];
//変更予定
let currentPlayer = "X";
const boardElement = document.getElementById("board");
const messageElement = document.getElementById("message");

//ボード作成
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
  //currentPlayerがplayersになってる。textの微変更
  messageElement.textContent = `Player ${currentPlayer}'s turn`;
}

//置く駒の配列&初期化
const players = ["90", "10", "70", "30"];
let currentPlayerIndex = 0;

//クリックしたときの処理
function onCellClick(event) {
  //rowとcolが縦と横の変数
  const row = event.target.dataset.row;
  const col = event.target.dataset.col;

  //空なら今のプレイヤーの記号を置く
  if (board[row][col] === "") {
    board[row][col] = players[currentPlayerIndex];
    event.target.textContent = players[currentPlayerIndex];
    //勝利判定&ターンを変更
    if (checkWin(row, col)) {
      //text後で変更
      messageElement.textContent = `Player ${currentPlayer} wins!`;
      boardElement.removeEventListener("click", onCellClick);
      //勝敗決定時クリックできないようにする
      const cells = document.querySelectorAll(".cell");
      cells.forEach((cell) => cell.removeEventListener("click", onCellClick));
    } else {
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
      //text後で変更
      messageElement.textContent = `Player ${currentPlayer}'s turn`;
    }
  }
}

//勝利判定の関数を作る
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
        //変更予定
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
        //変更予定
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

//Xからゲームをリスタートする関数
function resetGame() {
  //変更予定
  currentPlayer = "X";
  createBoard();
}

document.addEventListener("DOMContentLoaded", () => {
  createBoard();
});
