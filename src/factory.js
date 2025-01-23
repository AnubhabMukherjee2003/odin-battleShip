function Ship(length) {
    let _hits = 0;
    let _sunk = false;
    const Hit = () => {
        _hits++;
        if (_hits === length) {
            _sunk = true;
        }
    };
    return {
        length,
        get numberofhits() { return _hits; },
        get isSunk() { return _sunk; },
        Hit
    };
}

function Gameboard() {
    const board = Array.from({ length: 5 }, () => Array(5).fill(null));
    const ships = [];
    const missedAttacks = [];
    const isValidPlacement = (positions) => {
        return positions.every(pos =>
            pos.row >= 0 && pos.row < 5 &&
            pos.col >= 0 && pos.col < 5 &&
            board[pos.row][pos.col] === null
        );
    };
    const placeShip = (ship, positions) => {
        if (!isValidPlacement(positions)) return false;
        positions.forEach(pos => board[pos.row][pos.col] = ship);
        ships.push({ ship, positions });
        return true;
    };
    const receiveAttack = (row, col) => {
        if (board[row][col] === null) {
            missedAttacks.push({ row, col });
            board[row][col] = 'miss';
            return false;
        }
        if (typeof board[row][col] === 'object') {
            board[row][col].Hit();
            board[row][col] = 'hit';
            return true;
        }
        return false;
    };
    const allSunk = () => ships.every(({ ship }) => ship.isSunk);
    return { board, ships, missedAttacks, placeShip, receiveAttack, allSunk };
}

function Player(bool) {
    const gameboard = Gameboard();
    const isComputerPlayer = bool;
    return { gameboard ,isComputerPlayer};
}

export { Ship, Gameboard, Player };