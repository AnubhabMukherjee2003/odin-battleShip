import { Ship, Gameboard, Player } from './factory.js';

describe('Ship Factory', () => {
    test('Ship initializes correctly', () => {
        const ship = Ship(3);
        expect(ship.length).toBe(3);
        expect(ship.numberofhits).toBe(0);
        expect(ship.isSunk).toBe(false);
    });

    test('Hit method increases hits', () => {
        const ship = Ship(3);
        ship.Hit();
        expect(ship.numberofhits).toBe(1);
        expect(ship.isSunk).toBe(false);
    });

    test('isSunk returns true when hits equal length', () => {
        const ship = Ship(2);
        ship.Hit();
        ship.Hit();
        expect(ship.numberofhits).toBe(2);
        expect(ship.isSunk).toBe(true);
    });

    test('isSunk returns false when hits less than length', () => {
        const ship = Ship(4);
        ship.Hit();
        ship.Hit();
        expect(ship.numberofhits).toBe(2);
        expect(ship.isSunk).toBe(false);
    });
});

describe('Gameboard Factory', () => {
    let gameboard;
    let ship;

    beforeEach(() => {
        gameboard = Gameboard();
        ship = Ship(3);
    });

    test('Gameboard initializes correctly', () => {
        expect(gameboard.board.length).toBe(5);
        expect(gameboard.board[0].length).toBe(5);
        expect(gameboard.ships).toEqual([]);
        expect(gameboard.missedAttacks).toEqual([]);
    });

    test('Ship is placed correctly on the board', () => {
        const positions = [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }];
        const result = gameboard.placeShip(ship, positions);
        expect(result).toBe(true);
        expect(gameboard.ships.length).toBe(1);
        expect(gameboard.board[0][0]).toBe(ship);
        expect(gameboard.board[0][1]).toBe(ship);
        expect(gameboard.board[0][2]).toBe(ship);
    });

    test('Ship placement fails for overlapping positions', () => {
        const positions1 = [{ row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }];
        const positions2 = [{ row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 }];
        gameboard.placeShip(ship, positions1);
        const ship2 = Ship(2);
        const result = gameboard.placeShip(ship2, positions2);
        expect(result).toBe(false);
        expect(gameboard.ships.length).toBe(1);
    });

    test('receiveAttack records a miss correctly', () => {
        const result = gameboard.receiveAttack(2, 2);
        expect(result).toBe(false);
        expect(gameboard.missedAttacks).toContainEqual({ row: 2, col: 2 });
        expect(gameboard.board[2][2]).toBe('miss');
    });

    test('receiveAttack records a hit correctly', () => {
        const positions = [{ row: 3, col: 3 }, { row: 3, col: 4 }, { row: 3, col: 2 }];
        gameboard.placeShip(ship, positions);
        const result = gameboard.receiveAttack(3, 3);
        expect(result).toBe(true);
        expect(ship.numberofhits).toBe(1);
        expect(gameboard.board[3][3]).toBe('hit');
    });

    test('allSunk returns true when all ships are sunk', () => {
        const positions = [{ row: 4, col: 0 }, { row: 4, col: 1 }, { row: 4, col: 2 }];
        gameboard.placeShip(ship, positions);
        gameboard.receiveAttack(4, 0);
        gameboard.receiveAttack(4, 1);
        gameboard.receiveAttack(4, 2);
        expect(gameboard.allSunk()).toBe(true);
    });

    test('allSunk returns false when at least one ship is not sunk', () => {
        const positions = [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }];
        gameboard.placeShip(ship, positions);
        gameboard.receiveAttack(2, 0);
        gameboard.receiveAttack(2, 1);
        expect(gameboard.allSunk()).toBe(false);
    });
});

describe('Player Factory', () => {
    test('Player initializes with a gameboard', () => {
        const player = Player();
        expect(player.gameboard).toBeDefined();
        expect(player.gameboard.board.length).toBe(5);
    });

    test('Computer player is identified correctly', () => {
        const computerPlayer = Player(true);
        expect(computerPlayer.isComputerPlayer).toBe(true);

        const humanPlayer = Player(false);
        expect(humanPlayer.isComputerPlayer).toBe(false);
    });
});