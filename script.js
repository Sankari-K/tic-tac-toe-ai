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

    // TODO: change or delete
    const findOptimalPlace = () => {
        let positions = [];
        for (let i = 0; i < board.length; i++)
        {
            if (board[i] === '') {
                positions.push(i);
            }
        }
        return positions[Math.floor(Math.random() * positions.length)];;

    }

    const maximize = (board) => {
        // returns a baord configuration and its utility
        if (board.isBoardFull() || board.isWon('X') || board.isWon('O')) {
            return null, calculateUtility(board)
        }
        let maxUtility = -Infinity;
        let moveMaxUtility = null;

        let children = findChildren(board, 'X');
        for (let possibility = 0; possibility < children.length; possibility++) {
            let move;
            let minUtility;
            move, minUtility = minimize(children[possibility]);
            if (minUtility > maxUtility) {
                moveMaxUtility = children[possibility];
                maxUtility = minUtility;
            }
        }
        return moveMaxUtility, maxUtility;
    }

    const minimize = (board) => {
        // returns a board configuration and its utility
        if (board.isBoardFull() || board.isWon('X') || board.isWon('O')) {
            return null, calculateUtility(board)
        }
        let minUtility = Infinity;
        let moveMinUtility = null;

        let children = findChildren(board, 'O');
        for (let possibility = 0; possibility < children.length; possibility++) {
            let move;
            let maxUtility;
            move, maxUtility = maximize(children[possibility]);
            if (maxUtility < minUtility) {
                moveMinUtility = children[possibility];
                minUtility = maxUtility;
            }
        }
        return moveMinUtility, minUtility;
    }

    const findChildren = (board, marker) => {
        let children = [];
        let blankIndices = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] == '') {
                blankIndices.push(i);
            }
        }

        for (let i = 0; i < blankIndices.length; i++) {
            let newBoard = board;
            newBoard[blankIndices[i]] = marker;
            children.push(newBoard);
        }
        return children;
    }

    return {
        board,
        placeMarker,
        isBoardFull,
        isWon,
        showWon,
        findOptimalPlace
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
    let player2 = Player("robot", "O");

    let currentPlayer; 

    function selectUserField(event) {
        if (currentPlayer.marker == player1.marker && event.composedPath()[0].innerText == '') {
            player1.placeMarker(event.composedPath()[0].id - 1);

            if (gameBoard.isBoardFull() || 
            gameBoard.isWon(currentPlayer.marker)) {
                gameOver();
                return;
            }

            currentPlayer = player2;
            setDescription("Robot is making a decision...");
            player2.placeMarker(gameBoard.findOptimalPlace());

            if (gameBoard.isBoardFull() || 
            gameBoard.isWon(currentPlayer.marker)) {
                gameOver();
                return;
            }
            
            currentPlayer = player1;
            setDescription(`${player1.name}'s turn!`);
            
        }
    }
    

    function gameOver() {
        if (gameBoard.isWon(currentPlayer.marker)) {
            gameBoard.showWon(currentPlayer.marker);
            setDescription(`${currentPlayer.name} wins!`);
        }
        else {
            setDescription("It's a tie!");
        }
        removeFieldEventListener();
    }

    function removeFieldEventListener() {
        boardElement.forEach((field) => {
            field.removeEventListener('click', selectUserField)  
        })
    }

    document.querySelector("#play-button").addEventListener('click', (e) => {
        e.preventDefault();
        if (document.querySelector("#name").value !== '') {
            player1 = Player(document.querySelector("#name").value, 'X');
            currentPlayer = player1;

            document.querySelector(".player-name").classList.add("hidden");
            setDescription("Start playing!");

            boardElement.forEach((field) => {
                field.addEventListener('click', selectUserField)  
            })
        }
        else {
            setDescription("Enter a valid name!");
        }
    })

    document.querySelector(".refresh").addEventListener('click', () => {
        window.location.href = "./index.html";
    })

    function setDescription(text) {
        let resultField = document.querySelector(".result");
        resultField.innerText = text;
    }
})

gameFlow();