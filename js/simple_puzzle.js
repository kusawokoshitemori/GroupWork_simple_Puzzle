const boardSize = 15;
let board = [];
//変更予定
const blackPlayer = "たろう"; // 先手
const whitePlayer = "はなこ"; // 後手
let currentPlayer = blackPlayer;
let waitingPlayer = whitePlayer;
// 観測回数の制限
let blackObservations = 3; 
let whiteObservations = 3; 

const boardElement = document.getElementById("board");
// boardsizeに対応したグリッドレイアウト
boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 40px)`;
boardElement.style.gridTemplateRows = `repeat(${boardSize}, 40px)`;
const copy_boardElement = document.getElementById("copy_board");
// boardsizeに対応したグリッドレイアウト
copy_boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 40px)`;
copy_boardElement.style.gridTemplateRows = `repeat(${boardSize}, 40px)`;
const messageElement = document.getElementById("message");

//ボード作成
function createBoard() {
  // 盤面の初期化
  boardElement.style.display = "grid";
  copy_boardElement.style.display = "none";

  // ボタンの無効化設定
  document.getElementById("observation").disabled = true;
  document.getElementById("no_observation").disabled = true;
  document.getElementById("switchBoard").disabled = true;

  // 5連判定のブール値初期化
  hFCC_b = false;
  hFCC_w = false;
  // 観測回数の制限
  blackObservations = 3; 
  whiteObservations = 3; 

  board = Array(boardSize)
    .fill(null)
    .map(() => Array(boardSize).fill(""));
  boardElement.innerHTML = ""; // 初期化
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      boardElement.appendChild(cell);
    }
  }
  enableClicks();
  //currentPlayerがplayersになってる。textの微変更
  messageElement.textContent = `${currentPlayer} さんの番です。（持ち駒：${players[currentPlayerIndex]}）`;

  // 残りの観測回数を表示するために呼び出し
  updateObservationCount();
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

    // プレイヤーの駒に対応するCSSクラスを追加
    event.target.classList.add(getPieceClass(players[currentPlayerIndex]));

    // 観測する・しないの選択待ちに入る。
    disableClicks();
    // ボタンの無効化設定
    // 「観測する」「観測しない」のボタンが有効。
    document.getElementById("observation").disabled = false;
    document.getElementById("no_observation").disabled = false;
    document.getElementById("switchBoard").disabled = true;
    // 次に置く駒を変更（観測の有無に関係しない）
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  }
}

// 駒の値に基づいて適切なCSSクラスを返す関数
function getPieceClass(value) { 
  switch (value) {
    case 90:
      return 'black-90';
    case 70:
      return 'black-70';
    case 30:
      return 'white-30';
    case 10:
      return 'white-10';
    default:
      return '';
  }
}

// 先手(blackPlayer)からゲームをリスタートする関数
function resetGame() {
  currentPlayerIndex = 0;
  currentPlayer = blackPlayer;
  waitingPlayer = whitePlayer;
  document.getElementById("switchBoard").textContent = "確率の盤面へ";
  createBoard();
}

// 残りの観測回数を表示する関数 
function updateObservationCount() {
  document.getElementById("blackObservations").textContent = `たろうさんの残り観測回数: ${blackObservations}`;
  document.getElementById("whiteObservations").textContent = `はなこさんの残り観測回数: ${whiteObservations}`;
}

//観測する関数
console.log("読み込み開始");

//観測する関数
var hFCC_b, hFCC_w; // 5連判定のブール値は、switchBoardで参照したいからグローバル変数。
function observation() {
  // 観測可能かチェック
  if (currentPlayer === blackPlayer && blackObservations > 0) {
    blackObservations--; // 観測回数を1減らす
  } else if (currentPlayer === whitePlayer && whiteObservations > 0) {
    whiteObservations--; // 観測回数を1減らす
  } else {
    return;
  }
  updateObservationCount(); // 残りの観測回数を表示するために呼び出し

  //判定後はこの配列の中に入れる
  const board_result = []; // 初期化

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

  // 観測結果の盤面へ切り替え
  switchBoard();

  copy_boardElement.innerHTML = ""; // 初期化
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell1 = document.createElement("div");
      cell1.classList.add("cell1");
      cell1.dataset.row = row;
      cell1.dataset.col = col;
      // 観測結果に応じてマークを設定
      switch (board_result[row][col]){
        case "黒":
          cell1.textContent = "●";
          cell1.style.fontSize = "64px"; // 丸だけ個別にサイズ設定
          break;
        case "白":
          cell1.textContent = "○";
          cell1.style.fontSize = "64px"; // 丸だけ個別にサイズ設定
          break;
        case "入ってない":
          cell1.textContent = "";
          break;
        default:
          cell1.textContent = "error";
          console.log("board_result[" + row + "][" + col + "]に不適切な文字列が格納されています。");
      }
      copy_boardElement.appendChild(cell1);
    }
  }

  console.log(board_result);

  // 処理時間短縮のため5連判定のブール値は保存(グローバル変数)
  hFCC_b = hasFiveConsecutiveCircles(board_result, "黒");
  hFCC_w = hasFiveConsecutiveCircles(board_result, "白");
  console.log(hFCC_b);
  console.log(hFCC_w);
  // ブール値から勝者を判定
  if (hFCC_b && hFCC_w){ // 両者同時：観測した方の勝ち
    messageElement.textContent = `${currentPlayer} さんの勝ち！`;
  }else if (hFCC_b && !hFCC_w){
    messageElement.textContent = `${blackPlayer} さんの勝ち！`;
  }else if (!hFCC_b && hFCC_w){
    messageElement.textContent = `${whitePlayer} さんの勝ち！`;
  } else if (blackObservations === 0 && whiteObservations === 0) { //　残りの観測回数が両者0
    messageElement.textContent = `引き分け・・・`;
  }else{
    messageElement.textContent = `並ばず・・・`;
    enableClicks();
    // 「確率の盤面へ」のボタンが有効。
    document.getElementById("observation").disabled = true;
    document.getElementById("no_observation").disabled = true;
    document.getElementById("switchBoard").disabled = false;
  }
  // ボタンの無効化設定
  // ゲームが終了した時は、最終盤面を切り替えて見れるようにする。
  if (hFCC_b || hFCC_w){
    document.getElementById("observation").disabled = true;
    document.getElementById("no_observation").disabled = true;
    document.getElementById("switchBoard").disabled = false;
    document.getElementById("switchBoard").textContent = "確率・観測結果切り替え";
  }
}

// 観測なしでターンが変わる関数
// 「観測しない」ボタンが無ければ、両者がそれぞれ次の手を打つ可能性と観測する可能性が同時に存在して、ターン表示が難しい。
function no_observation(){
  // 現在のプレイヤーと待機プレイヤーを入れ替え
  [currentPlayer, waitingPlayer] = [waitingPlayer, currentPlayer];
  messageElement.textContent = `${currentPlayer} さんの番です。（持ち駒：${players[currentPlayerIndex]}）`;
  enableClicks();
  // ボタンの無効化設定
  document.getElementById("observation").disabled = true;
  document.getElementById("no_observation").disabled = true;
  document.getElementById("switchBoard").disabled = true;
}

//board_resultを使って勝利判定する
// 対象のシンボルが5個以上連続して並んでいるかどうかを判定する関数
function hasFiveConsecutiveCircles(board_result, targetSymbol) {
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

// 盤面のクリックを阻止する関数
function disableClicks(){
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => cell.removeEventListener("click", onCellClick));
}

// 盤面のクリックを許可する関数
function enableClicks(){
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => cell.addEventListener("click", onCellClick));
}

// 確率の盤面と観測結果の盤面を行き来する関数
function switchBoard(){
  if (getComputedStyle(boardElement).display === "grid"){
    boardElement.style.display = "none";
    copy_boardElement.style.display = "grid";
  }else{
    boardElement.style.display = "grid";
    copy_boardElement.style.display = "none";
    // ボタンの無効化設定
    if (!hFCC_b && !hFCC_w) {
      // 観測するも5連続が無く、確率の盤面へ戻る場合。
      [currentPlayer, waitingPlayer] = [waitingPlayer, currentPlayer];
      messageElement.textContent = `${currentPlayer} さんの番です。（持ち駒：${players[currentPlayerIndex]}）`;
      document.getElementById("observation").disabled = true;
      document.getElementById("no_observation").disabled = true;
      document.getElementById("switchBoard").disabled = true;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  createBoard();
});
