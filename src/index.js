import "./styles.css";
import { setTheme } from "./setTheme";
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.className = theme;
}
document.querySelector('.theme-toggle').addEventListener('click', setTheme);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const theme = e.matches ? 'dark' : 'light';
    document.documentElement.className = theme;
});
initializeTheme();


import { Ship, Gameboard, Player } from "./factory.js";

const playerBoard= document.querySelector('.player-board');
const computerBoard= document.querySelector('.computer-board');

const player = Player(true);
const computer = Player(false);

placeRandomShips(player);
placeRandomShips(computer);
renderBoard(player);
renderBoard(computer);

function placeRandomShips(player) {
    const shipLengths = [1,1,1,1,1];
    shipLengths.forEach(length => {
        let row, col
        do {
            row = Math.floor(Math.random() * player.gameboard.board.length);
            col = Math.floor(Math.random() * player.gameboard.board[0].length);
        } while (!player.gameboard.placeShip(Ship(length), getRandomPositions(length)));
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
    // console.log(player.gameboard.board);
    const displayBoard = player.isComputerPlayer ? computerBoard : playerBoard;
    player.gameboard.board.forEach((row, i) => {
        row.forEach((_, j) => {
            const cellDiv = document.createElement('div');
            cellDiv.dataset.row = i;
            cellDiv.dataset.col = j;
            cellDiv.classList.add('cell');
            if (!player.isComputerPlayer && player.gameboard.board[i][j] !== null) {
                cellDiv.classList.add('ship');
            }
            if (player.isComputerPlayer) {
                cellDiv.addEventListener('click', () => handleAttack(i, j));
            }
            displayBoard.appendChild(cellDiv);
        });
    });
}

function handleAttack(row, col) {
    if (computer.gameboard.receiveAttack(row, col)) {
        computerBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`).classList.add('hit');
    } else {
        computerBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`).classList.add('miss');
    }
    if (computer.gameboard.allSunk()) {
        alert('You win!');
        return;
    }

    let rowAttack, colAttack;
    do {
        rowAttack = Math.floor(Math.random() * player.gameboard.board.length);
        colAttack = Math.floor(Math.random() * player.gameboard.board[0].length);
    } while (player.gameboard.board[rowAttack][colAttack] === 'hit' || player.gameboard.board[rowAttack][colAttack] === 'miss');

    // console.log(`Computer attacks ${rowAttack}, ${colAttack}`);
    if (player.gameboard.receiveAttack(rowAttack, colAttack)) {
        playerBoard.querySelector(`[data-row="${rowAttack}"][data-col="${colAttack}"]`).classList.add('hit');
    } else {
        playerBoard.querySelector(`[data-row="${rowAttack}"][data-col="${colAttack}"]`).classList.add('miss');
    }
    if (player.gameboard.allSunk()) {
        alert('You lose!');
    }
}