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

    const minimax = (board, isRobot) => {
        let marker = isRobot ? 'X': 'O';
        if (isBoardFull(board) || isWon(board, 'O') || isWon(board, 'X')) {
            return [calculateUtility(board, marker), board];
        }
 
        if (isRobot) {
            let bestVal = -Infinity;
            let moves = findChildren(board, 'O');

            // if (isEqual(board, ['','','X','X','O','O','O','O','X'])) {
            //     console.log("mooves", moves, "isrobot");
            // }

            let bestBoard;
            for (let i = 0; i < moves.length; i++) {
                let value = minimax(moves[i], false);
                bestVal = bestVal >= value[0] ? bestVal : value[0];
                if (bestVal == value[0]) {
                    bestBoard = moves[i]
                }
            }
            return [bestVal, bestBoard];
        }
        else {
            let bestVal = Infinity;
            let moves = findChildren(board, 'X');
            let bestBoard;

            // if (isEqual(board, ['','','X','X','O','O','O','O','X'])) {
            //     console.log("marker is", marker);
            //     console.log("mooves", moves);
            // }

            for (let i = 0; i < moves.length; i++) {
                let value = minimax(moves[i], true);
                bestVal = bestVal <= value[0] ? bestVal : value[0];
                if (bestVal == value[0]) {
                    bestBoard = moves[i];
                }
            }
            return [bestVal, bestBoard];
        }
    }


    const calculateUtility = (board, currentMarker) => {
        // if (isEqual(board, ['X','O','X','X','O','O','O','O','X'])) {
        //     console.log("found!!", currentMarker);
        // }
        let utility = 0;
        if (!isBoardFull(board)) {
            let space = 0;
            for (let i = 0; i < board.length; i++)
            {
                if (board[i] === '') {
                    space++;
                }
            }
            if (isWon(board, 'O')) {
                return space * 10;
            }
            else {
                return -1 * space * 10;
            }
        }
        if (board[4] == currentMarker) {
            utility += 5;
        }
        if (isWon(board, currentMarker)) {
            utility += 10;
            return utility;
        }
        else if (isWon(board, currentMarker == 'X'? 'O': 'X')) {
            utility += -10;
            return utility;
        }

        //check if two places are occupied by player
        let offensive = -3;  // 3
        let defensive = 3; // -3
        for (let i = 0; i < 3; i++) {
            if (board[i] == board[i + 3] && board[i] != board[i + 6]) {
                utility += board[i] == currentMarker ? offensive : defensive;
            }
            if (board[i + 3] == board[i + 6] && board[i + 6] != board[i]) {
                utility += board[i + 3] == currentMarker ? offensive : defensive;
            }
            if (board[i] == board[i + 6] && board[i] != board[i + 3]) {
                utility += board[i] == currentMarker ? offensive : defensive;
            }
        }
        for (let i = 0; i < 7; i = i + 3) {
            if (board[i] == board[i + 1] && board[i] != board[i + 2]) {
                utility += board[i] == currentMarker ? offensive : defensive;
            }
            if (board[i + 1] == board[i + 2] && board[i + 1] != board[i]) {
                utility += board[i + 1] == currentMarker ? offensive : defensive;
            }
            if (board[i + 2] == board[i]&& board[i] != board[i + 1]) {
                utility += board[i] == currentMarker ? offensive : defensive;
            }
        }

        if (board[0] == board[4] && board[0] != board[8]) {
            utility += board[0] == currentMarker ? offensive : defensive;
        }
        if (board[4] == board[8] && board[4] != board[0]) {
            utility += board[4] == currentMarker ? offensive : defensive;
        }
        if (board[8] == board[0] && board[8] != board[4]) {
            utility += board[0] == currentMarker ? offensive : defensive;
        }

        if (board[2] == board[4] && board[2] != board[6]) {
            utility += board[2] == currentMarker ? offensive : defensive;
        }
        if (board[4] == board[6]&& board[4] != board[2]) {
            utility += board[4] == currentMarker ? offensive : defensive;
        }
        if (board[6] == board[2] && board[6] != board[4]) {
            utility += board[2] == currentMarker ? offensive : defensive;
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
        minimax,
        calculateUtility
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

    async function selectUserField(event) {
        // console.log("umm so", gameBoard.calculateUtility(['X','','X','X','O','O','O','O',"X"], 'O'));  -
        // console.log("whyy", gameBoard.calculateUtility(['','X','X','X','O','O','O','O',"X"], 'O'));

        //console.log("umm so", gameBoard.calculateUtility(['X','O','X','X','O','O','O','O',"X"], 'O')); // 15
        //console.log("whyy", gameBoard.calculateUtility(['O','X','X','X','O','O','O','O',"X"], 'O')); // 17

        if (currentPlayer.marker == player1.marker && event.composedPath()[0].innerText == '') {
            player1.placeMarker(event.composedPath()[0].id - 1);

            if (gameBoard.isBoardFull(gameBoard.board) || 
            gameBoard.isWon(gameBoard.board, currentPlayer.marker)) {
                gameOver();
                return;
            }
            setDescription("Robot is making a decision...");
            currentPlayer = player2;
            
            const sleep = ms => new Promise(r => setTimeout(r, ms));
            await sleep(2000);

            let move = gameBoard.minimax(gameBoard.board);
            
            gameBoard.board = move[1];
            displayController.displayBoard(move[1]);
            
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
            document.querySelector("#name1").innerText = player1.name;

            document.querySelector("#player1").classList.remove("hidden");
            document.querySelector("#player2").classList.remove("hidden");

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
        gameBoard.board = [
                     '', '', '',
                     '', '', '', 
                     '', '', '',
                    ];
        displayController.displayBoard(gameBoard.board);
        boardElement.forEach((field) => {
            field.addEventListener('click', selectUserField)  
        })
        setDescription("Start playing!");
        currentPlayer = player1;
        boardElement.forEach((field) => {
                field.classList.remove("white");
            })
    })

    function setDescription(text) {
        let resultField = document.querySelector(".result");
        resultField.innerText = text;
    }
})

// function isEqual(arr1, arr2) {
//     for (i = 0; i < arr1.length - 1; i++) {
//         if (arr1[i] !== arr2[i]) {
//             return false;
//         }
//     }
//     return true;
// }

gameFlow();
