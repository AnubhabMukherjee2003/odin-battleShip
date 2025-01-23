import { Ship, Player } from "./factory.js";
import { createDisplay } from "./display.js";

function game() {
  let player;
  let computer;

  const initializeGame = () => {
    player = Player(false);
    computer = Player(true);
    document.querySelector('.reset-btn').addEventListener('click', resetGame);

    placeRandomShips(player);
    placeRandomShips(computer);
    createDisplay().initialize(player, computer);
  };

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

  return { initializeGame };
}

export { game };