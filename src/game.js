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
    const shipLengths = [1,1, 1, 1, 1];
    let attempts = 0;
    const maxAttempts = 100;

    shipLengths.forEach((length) => {
        attempts = 0;
        while (attempts < maxAttempts) {
            const positions = getRandomPositions(length);
            if (player.gameboard.placeShip(Ship(length), positions)) {
                break;
            }
            attempts++;
        }
    });
  }

  function getRandomPositions(length) {
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
        const horizontal = Math.random() < 0.5;
        const row = Math.floor(Math.random() * 5);
        const col = Math.floor(Math.random() * 5);
        
        const positions = [];
        let valid = true;
        
        for (let i = 0; i < length; i++) {
            const pos = {
                row: horizontal ? row : row + i,
                col: horizontal ? col + i : col
            };
            
            if (pos.row >= 5 || pos.col >= 5) {
                valid = false;
                break;
            }
            positions.push(pos);
        }
        
        if (valid) return positions;
        attempts++;
    }
    return getRandomPositions(length); // Last resort recursion
  }

  return { initializeGame };
}

export { game };