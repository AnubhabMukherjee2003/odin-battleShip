import { Ship, Player } from "./factory.js";

function game() {
  let playerBoard;
  let computerBoard;
  let player;
  let computer;
  let gameStatus;

  const initializeGame = () => {
    playerBoard = document.querySelector(".player-board");
    computerBoard = document.querySelector(".computer-board");
    gameStatus = document.querySelector(".game-status");
    player = Player(false);
    computer = Player(true);

    document.querySelector('.reset-btn').addEventListener('click', resetGame);

    placeRandomShips(player);
    placeRandomShips(computer);
    renderBoard(player);
    renderBoard(computer);
    updateGameStatus("Your turn! Click on the computer's board to attack.");
  };

  function updateGameStatus(message) {
    gameStatus.textContent = message;
  }

  function resetGame() {
    window.location.reload();
  }

  function placeRandomShips(player) {
    const shipLengths = [1, 1, 1, 1, 1];
    shipLengths.forEach((length) => {
      let row, col;
      do {
        row = Math.floor(Math.random() * player.gameboard.board.length);
        col = Math.floor(Math.random() * player.gameboard.board[0].length);
      } while (
        !player.gameboard.placeShip(Ship(length), getRandomPositions(length))
      );
    });
  }

  function getRandomPositions(length) {
    const horizontal = Math.random() < 0.5;
    const row = Math.floor(Math.random() * 5);
    const col = Math.floor(Math.random() * 5);
    if (horizontal && col + length <= 5) {
      return Array.from({ length }, (_, i) => ({ row, col: col + i }));
    }
    if (!horizontal && row + length <= 5) {
      return Array.from({ length }, (_, i) => ({ row: row + i, col }));
    }
    return getRandomPositions(length);
  }

  function renderBoard(player) {
    console.log(player.gameboard.board);
    const displayBoard = player.isComputerPlayer ? computerBoard : playerBoard;
    displayBoard.innerHTML = '';
    player.gameboard.board.forEach((row, i) => {
      row.forEach((cell, j) => {
        const cellDiv = document.createElement("div");
        cellDiv.dataset.row = i;
        cellDiv.dataset.col = j;
        cellDiv.classList.add("cell");
        if (player.isComputerPlayer) {
          cellDiv.addEventListener("click", () => handleAttack(i, j));
        }
        if (!player.isComputerPlayer && typeof cell === 'object' && cell !== null) {
            cellDiv.classList.add("ship");
          }
        displayBoard.appendChild(cellDiv);
      });
    });
  }

  function handleAttack(row, col) {
    const cell = computerBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
      updateGameStatus('Cell already attacked! Choose another.');
      return;
    }

    if (computer.gameboard.receiveAttack(row, col)) {
      cell.classList.add("hit");
      updateGameStatus('Hit! Your turn again.');
      if (computer.gameboard.allSunk()) {
        updateGameStatus("You win! Click Reset to play again.");
        disableBoard();
        return;
      }
    } else {
      cell.classList.add("miss");
      updateGameStatus('Miss! Computer\'s turn...');
      disableBoard();
      setTimeout(() => {
        computerTurn();
        enableBoard();
      }, 2000);
    }
  }

  function computerTurn() {
    let rowAttack, colAttack;
    do {
      rowAttack = Math.floor(Math.random() * 5);
      colAttack = Math.floor(Math.random() * 5);
    } while (
      player.gameboard.board[rowAttack][colAttack] === "hit" ||
      player.gameboard.board[rowAttack][colAttack] === "miss"
    );

    const cell = playerBoard.querySelector(`[data-row="${rowAttack}"][data-col="${colAttack}"]`);
    if (player.gameboard.receiveAttack(rowAttack, colAttack)) {
      cell.classList.add("hit");
      updateGameStatus('Computer hit your ship!');
      if (player.gameboard.allSunk()) {
        updateGameStatus("Computer wins! Click Reset to play again.");
        disableBoard();
        return;
      }
    } else {
      cell.classList.add("miss");
      updateGameStatus('Computer missed! Your turn.');
    }
  }

  function disableBoard() {
    computerBoard.style.pointerEvents = 'none';
  }
  function enableBoard() {
    computerBoard.style.pointerEvents = 'auto';
  }
  return { initializeGame };
}

export { game };