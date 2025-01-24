function createDisplay() {
    const playerBoard = document.querySelector(".player-board");
    const computerBoard = document.querySelector(".computer-board");
    const gameStatus = document.querySelector(".game-status");

    let playerRef;
    let computerRef;

    function initializeRefs(player, computer) {
        playerRef = player;
        computerRef = computer;
    }

    function updateGameStatus(message) {
        gameStatus.textContent = message;
    }

    function renderBoard(player) {
        const displayBoard = player.isComputerPlayer ? computerBoard : playerBoard;
        const container = player.isComputerPlayer ? 
            document.querySelector('.board-container:nth-child(2)') : 
            document.querySelector('.board-container:first-child');
        
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

    function toggleTurnIndicator() {
        document.querySelectorAll('.board-container').forEach(container => {
            container.classList.toggle('active');
        });
    }

    function handleAttack(row, col) {
        const cell = computerBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell.classList.contains('hit') || cell.classList.contains('miss')) {
            updateGameStatus('Cell already attacked! Choose another.');
            return;
        }

        if (computerRef.gameboard.receiveAttack(row, col)) {
            cell.classList.add("hit");
            updateGameStatus('Hit! Your turn again.');
            if (computerRef.gameboard.allSunk()) {
                updateGameStatus("You win! Click Reset to play again.");
                alert('You win! Click Reset to play again')
                disableBoard();
                return;
            }
        } else {
            cell.classList.add("miss");
            updateGameStatus('Miss! Computer\'s turn...');
            disableBoard();
            toggleTurnIndicator();
            setTimeout(() => {
                computerTurn();
                enableBoard();
                toggleTurnIndicator();
            }, 1000);
        }
    }

    function computerTurn() {
        const availableMoves = [];
        
        // Get all valid moves
        for(let i = 0; i < 5; i++) {
            for(let j = 0; j < 5; j++) {
                if (playerRef.gameboard.board[i][j] !== "hit" && 
                    playerRef.gameboard.board[i][j] !== "miss") {
                    availableMoves.push({row: i, col: j});
                }
            }
        }
        
        if (availableMoves.length === 0) return;
        
        const moveIndex = Math.floor(Math.random() * availableMoves.length);
        const {row, col} = availableMoves[moveIndex];
        
        const cell = playerBoard.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (playerRef.gameboard.receiveAttack(row, col)) {
            cell.classList.add("hit");
            updateGameStatus('Computer hit your ship!');
            if (playerRef.gameboard.allSunk()) {
                updateGameStatus("Computer wins! Click Reset to play again.");
                alert('Computer wins! Click Reset to play again.')
                disableBoard();
                return;
            }
            setTimeout(computerTurn, 1000);
        } else {
            cell.classList.add("miss");
            updateGameStatus('Computer missed! Your turn.');
            enableBoard();
        }
    }

    function disableBoard() {
        computerBoard.style.pointerEvents = 'none';
    }

    function enableBoard() {
        computerBoard.style.pointerEvents = 'auto';
    }

    function initialize(player, computer) {
        initializeRefs(player, computer);
        renderBoard(player);
        renderBoard(computer);
        updateGameStatus("Your turn! Click on the computer's board to attack, There are 5 ships of length 1.");
    }

    return {
        initialize,
    };
}

export { createDisplay };