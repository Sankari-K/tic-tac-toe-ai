const boardElement = document.querySelectorAll('.field');

// for each player
const Player = (name, marker) => {
    const placeMarker = position => {
        gameBoard.placeMarker(position, marker);
    };
   return { name, marker, placeMarker };
};

// the game board object
const gameBoard = (() => {
    let board = 
            [
            '', '', '',
            '', '', '',
            '', '', '',
            ]

    const placeMarker = (position, marker) => {
        if (board[position] === '') {
            board[position] = marker;
        }
        displayController.displayBoard(gameBoard.board);
    }

    const isBoardFull = () => {
        for (let i = 0; i < board.length; i++)
        {
            if (board[i] === '') {
                return false;
            }
        }
        return true;
    }

    const isWon = (marker) => {
        for (let i = 0; i < 3; i++) {
            if (board[i] == marker && board[i + 3] == marker && 
                board[i + 6] == marker) {
                    return true;
                }
        }
        for (let i = 0; i < 7; i = i + 3) {
            if (board[i] == marker && board[i + 1] == marker && 
                board[i + 2] == marker) {
                    return true;
                }
        }
        if (board[0] == marker && board[4] == marker && board[8] == marker) {
            return true;
        }
        if (board[2] == marker && board[4] == marker && board[6] == marker) {
            return true;
        }
        return false;
    }

    const showWon = (marker) => {
        for (let i = 0; i < 3; i++) {
            if (board[i] == marker && board[i + 3] == marker && 
                board[i + 6] == marker) {
                    displayController.displayWon([i, i + 3, i + 6]);
                }
        }
        for (let i = 0; i < 7; i = i + 3) {
            if (board[i] == marker && board[i + 1] == marker && 
                board[i + 2] == marker) {
                    displayController.displayWon([i, i + 1, i + 2]);
                }
        }
        if (board[0] == marker && board[4] == marker && board[8] == marker) {
            displayController.displayWon([0, 4, 8]);
        }
        if (board[2] == marker && board[4] == marker && board[6] == marker) {
            displayController.displayWon([2, 4, 6]);
        }
    }

    return {
        board,
        placeMarker,
        isBoardFull,
        isWon,
        showWon
    };
})();

const displayController = (() => {
    const displayBoard = (gameBoard) => {
        let index = 0;
        boardElement.forEach((field) => {
            field.innerText = gameBoard[index];
            index++;
        })
    }

    const displayWon = (indices) => {
        let index = 0;
        boardElement.forEach((field) => {
            if (indices.includes(index)) {
                field.classList.add("white");
            }
            index++;
        })
    }

    return {
        displayBoard,
        displayWon
    }
})();

const gameFlow = (() => {
    let player1; 
    document.querySelector(".refresh").addEventListener('click', () => {
        window.location.href = "./index.html";
    })

    function setDescription(text) {
        let resultField = document.querySelector(".result");
        resultField.innerText = text;
    }

    document.querySelector("#play-button").addEventListener('click', (e) => {
        e.preventDefault();
        
        if (document.querySelector("#name").value !== '') {
            player1 = Player(document.querySelector("#name").value, 'X');
            console.log(player1);
            document.querySelector(".player-name").classList.add("hidden");
            setDescription("Start playing!");
        }
        else {
            setDescription("Enter a valid name!");
        }
    })
})

gameFlow();