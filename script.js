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
        if (gameBoard.board[position] === '') {
            gameBoard.board[position] = marker;
        }
        // console.log(board, gameBoard.board);
        displayController.displayBoard(gameBoard.board);
    }

    const isBoardFull = (board) => {
        for (let i = 0; i < board.length; i++)
        {
            if (board[i] === '') {
                return false;
            }
        }
        return true;
    }

    const isWon = (board, marker) => {
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
            if (gameBoard.board[i] == marker && gameBoard.board[i + 3] == marker && 
                gameBoard.board[i + 6] == marker) {
                    displayController.displayWon([i, i + 3, i + 6]);
                }
        }
        for (let i = 0; i < 7; i = i + 3) {
            if (gameBoard.board[i] == marker && gameBoard.board[i + 1] == marker && 
                gameBoard.board[i + 2] == marker) {
                    displayController.displayWon([i, i + 1, i + 2]);
                }
        }
        if (gameBoard.board[0] == marker && gameBoard.board[4] == marker && gameBoard.board[8] == marker) {
            displayController.displayWon([0, 4, 8]);
        }
        if (gameBoard.board[2] == marker && gameBoard.board[4] == marker && gameBoard.board[6] == marker) {
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
        // returns a board configuration and its utility
        if (isBoardFull(board) || isWon(board, 'X') || isWon(board, 'O')) {
            return [null, calculateUtility(board, 'O')];
        }
        let maxUtility = -10000;
        let moveMaxUtility = null;

        let children = findChildren(board, 'X');
        for (let possibility = 0; possibility < children.length; possibility++) {
            let move;
            move = minimize(children[possibility]);
            if (move[1] > maxUtility) {
                moveMaxUtility = children[possibility];
                maxUtility = move[1];
            }
        }
        return [moveMaxUtility, maxUtility];
    }

    const minimize = (board) => {
        // returns a board configuration and its utility
        if (isBoardFull(board) || isWon(board, 'X') || isWon(board, 'O')) {
            return [null, calculateUtility(board, 'X')];
        }
        let minUtility = 10000;
        let moveMinUtility = null;

        let children = findChildren(board, 'O');
        for (let possibility = 0; possibility < children.length; possibility++) {
            let move;
            move = maximize(children[possibility]);
            if (move[1] < minUtility) {
                moveMinUtility = children[possibility];
                minUtility = move[1];
            }
        }
        return [moveMinUtility, minUtility];
    }

    const calculateUtility = (board, currentMarker) => {
        let utility = 0;
        if (isWon(board, currentMarker)) {
            return 10;
        }
        else if (board, isWon(currentMarker == 'X'? 'O': 'X')) {
            return -10;
        }
        //check if two places are occupied by player

        for (let i = 0; i < 3; i++) {
            if (board[i] == board[i + 3] && board[i] != '') {
                utility += board[i] == currentMarker ? 0.5 : -0.5;
            }
            if (board[i + 3] == board[i + 6] && board[i + 3] != '') {
                utility += board[i + 3] == currentMarker ? 0.5 : -0.5;
            }
            if (board[i] == board[i + 6] && board[i] != '') {
                utility += board[i] == currentMarker ? 0.5 : -0.5;
            }
        }
        for (let i = 0; i < 7; i = i + 3) {
            if (board[i] == board[i + 1] && board[i] != '') {
                utility += board[i] == currentMarker ? 0.5 : -0.5;
            }
            if (board[i + 1] == board[i + 2] && board[i + 1] != '') {
                utility += board[i + 1] == currentMarker ? 0.5 : -0.5;
            }
            if (board[i + 2] == board[i] && board[i] != '') {
                utility += board[i] == currentMarker ? 0.5 : -0.5;
            }
        }

        if (board[0] == board[4] && board[0] != '') {
            utility += board[0] == currentMarker ? 0.5 : -0.5;
        }
        if (board[4] == board[8] && board[4] != '') {
            utility += board[4] == currentMarker ? 0.5 : -0.5;
        }
        if (board[8] == board[0] && board[0] != '') {
            utility += board[0] == currentMarker ? 0.5 : -0.5;
        }

        if (board[2] == board[4] && board[2] != '') {
            utility += board[2] == currentMarker ? 0.5 : -0.5;
        }
        if (board[4] == board[6] && board[4] != '') {
            utility += board[4] == currentMarker ? 0.5 : -0.5;
        }
        if (board[6] == board[2] && board[2] != '') {
            utility += board[2] == currentMarker ? 0.5 : -0.5;
        }
        return utility;        
    }

    const findChildren = (board, marker) => {
        let children = [];
        let blankIndices = [];
        for (let i = 0; i < gameBoard.board.length; i++) {
            if (board[i] == '') {
                blankIndices.push(i);
            }
        }
        for (let i = 0; i < blankIndices.length; i++) {
            let newBoard = [...board];
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
        findOptimalPlace, // del?
        maximize
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
    let player2 = Player("robot", "X");

    let currentPlayer; 

    function selectUserField(event) {
        if (currentPlayer.marker == player1.marker && event.composedPath()[0].innerText == '') {
            player1.placeMarker(event.composedPath()[0].id - 1);

            if (gameBoard.isBoardFull(gameBoard.board) || 
            gameBoard.isWon(gameBoard.board, currentPlayer.marker)) {
                gameOver();
                return;
            }

            currentPlayer = player2;
            setDescription("Robot is making a decision...");
            
            let move = gameBoard.maximize(gameBoard.board);
            // displayController.displayBoard(move);
            gameBoard.board = move[0];
            displayController.displayBoard(move[0]);
            
            // player2.placeMarker(gameBoard.findOptimalPlace());

            if (gameBoard.isBoardFull(gameBoard.board) || 
            gameBoard.isWon(gameBoard.board, currentPlayer.marker)) {
                gameOver();
                return;
            }
            
            currentPlayer = player1;
            setDescription(`${player1.name}'s turn!`);
            
        }
    }
    

    function gameOver() {
        if (gameBoard.isWon(gameBoard.board, currentPlayer.marker)) {
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
            player1 = Player(document.querySelector("#name").value, 'O');
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