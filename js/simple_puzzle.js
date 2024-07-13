const boardSize = 15;
let board = [];
let copy_board = [];
//変更予定
let currentPlayer = "X";
const boardElement = document.getElementById("board");
const copy_boardElement = document.getElementById("copy_board");
const messageElement = document.getElementById("message");

//ボード作成
function createBoard() {
  board = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(""));
  console.log(board)
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
const players = [90, 10, 70, 30];
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
    //勝利判定&ターンを変更 ここcheckWin関数使用しないよう訂正する
    if (checkWin(row, col)) {
      //text後で変更
      messageElement.textContent = `Player ${currentPlayer} wins!`;
      boardElement.removeEventListener("click", onCellClick);
      //勝敗決定時クリックできないようにする(未デバッグ)
      const cells = document.querySelectorAll(".cell");
      cells.forEach((cell) => cell.removeEventListener("click", onCellClick));
    } else {
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
      //text後で変更
      messageElement.textContent = `Player ${currentPlayer}'s turn`;
    }
  }
}

//勝利判定の関数を作る(やってることあんまり理解できなかったから使わないがcheckWinを定義しないとエラーが出るので一応残してある)
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
  currentPlayerIndex = 0;
  createBoard();
}

//観測する関数
console.log("読み込み開始");

//判定後はこの関数の中に入れる
const board_result = [];
//観測する関数;
function observation() {
  //ここできなかったとこ(表示用)
  copy_board = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(""));

  //copy_boardElement.innerHTML = "";
  //let cell1 = document.getElementById('specificCell');

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell1 = document.createElement("div");
      cell1.classList.add("cell1");
      cell1.dataset.row = row;
      cell1.dataset.col = col;
      // 初期値に応じてマークを設定
      cell1.textContent = board[row][col] >= 70 ? "〇" : "×";
      copy_boardElement.appendChild(cell1);
    }
  }
  //ここまで

  //黒、白の判定 + 配列に保存
  //board_resultが観測後の要素が入っているやつ
  for (let row = 0; row < boardSize; row++) {
    const board_result_row = [];
    for (let col = 0; col < boardSize; col++) {
      //１までの乱数
      const randomDecimal = Math.random();
      if (board[row][col] === "") {
        console.log("何も入ってない");
        board_result_row.push("入ってない");
      } else if (board[row][col] / 100 >= randomDecimal) {
        console.log("黒です");
        board_result_row.push("黒");
      } else {
        console.log("白です");
        board_result_row.push("白");
      }
    }
    board_result.push(board_result_row);
  }

  console.log(board_result);

  console.log(hasFiveConsecutiveCircles("黒"));
  console.log(hasFiveConsecutiveCircles("白"));
}

//board_resultを使って勝利判定する

// "〇"が5個以上連続して並んでいるかどうかを判定する関数
function hasFiveConsecutiveCircles(targetSymbol) {
  const consecutiveCountNeeded = 5;

  // 横方向の判定
  for (let row = 0; row < boardSize; row++) {
    let consecutiveCount = 0;
    for (let col = 0; col < boardSize; col++) {
      if (board_result[row][col] === targetSymbol) {
        consecutiveCount++;
        if (consecutiveCount >= consecutiveCountNeeded) {
          return true; // 5個以上連続している場合はtrueを返す
        }
      } else {
        consecutiveCount = 0; // 連続していない場合はカウントをリセット
      }
    }
  }

  // 縦方向の判定
  for (let col = 0; col < boardSize; col++) {
    let consecutiveCount = 0;
    for (let row = 0; row < boardSize; row++) {
      if (board_result[row][col] === targetSymbol) {
        consecutiveCount++;
        if (consecutiveCount >= consecutiveCountNeeded) {
          return true; // 5個以上連続している場合はtrueを返す
        }
      } else {
        consecutiveCount = 0; // 連続していない場合はカウントをリセット
      }
    }
  }

  // 斜め方向（左上から右下）
  for (
    let startRow = 0;
    startRow <= boardSize - consecutiveCountNeeded;
    startRow++
  ) {
    for (
      let startCol = 0;
      startCol <= boardSize - consecutiveCountNeeded;
      startCol++
    ) {
      let consecutiveCount = 0;
      for (let i = 0; i < consecutiveCountNeeded; i++) {
        if (board_result[startRow + i][startCol + i] === targetSymbol) {
          consecutiveCount++;
          if (consecutiveCount >= consecutiveCountNeeded) {
            return true; // 5個以上連続している場合はtrueを返す
          }
        } else {
          consecutiveCount = 0; // 連続していない場合はカウントをリセット
        }
      }
    }
  }

  // 斜め方向（右上から左下）
  for (
    let startRow = 0;
    startRow <= boardSize - consecutiveCountNeeded;
    startRow++
  ) {
    for (
      let startCol = consecutiveCountNeeded - 1;
      startCol < boardSize;
      startCol++
    ) {
      let consecutiveCount = 0;
      for (let i = 0; i < consecutiveCountNeeded; i++) {
        if (board_result[startRow + i][startCol - i] === targetSymbol) {
          consecutiveCount++;
          if (consecutiveCount >= consecutiveCountNeeded) {
            return true; // 5個以上連続している場合はtrueを返す
          }
        } else {
          consecutiveCount = 0; // 連続していない場合はカウントをリセット
        }
      }
    }
  }

  return false; // 5個以上連続している場所が見つからない場合はfalseを返す
}

document.addEventListener("DOMContentLoaded", () => {
  createBoard();
});
