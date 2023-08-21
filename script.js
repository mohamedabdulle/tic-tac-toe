const gridBoard = document.querySelector(".grid-container");
const playerOneInput = document.querySelector("#player-1-input");
const playerOneScore = document.querySelector("#player-1-score");
const playerTwoInput = document.querySelector("#player-2-input");
const playerTwoScore = document.querySelector("#player-2-score");
const resetBoardButton = document.querySelector("#reset-board");
const resetScoreButton = document.querySelector("#reset-score");
const drawScore = document.querySelector("#draw-score");

const Player = (playerName, score, playerNameInput, playerScore) => {
  const getScore = () => score;
  const getPlayerName = () => playerName;
  const incrementScore = () => playerScore.textContent = ++score;
  const setPlayerName = (newName) => playerName = newName;
  const getPlayerInput = () => playerNameInput;
  const getPlayerScore = () => playerScore;
  return { setPlayerName, getPlayerName, getScore, incrementScore, getPlayerInput, getPlayerScore };
}

const PlayerFactory = (playerName, playerInput, playerScore) => {
  let score = 0;
  const { setPlayerName, getPlayerName, getScore, incrementScore, getPlayerInput, getPlayerScore } = Player(playerName, score, playerInput, playerScore);
  return { setPlayerName, getPlayerName, getScore, incrementScore, getPlayerInput, getPlayerScore };
}

let playerOne = PlayerFactory("Player 1", playerOneInput, playerOneScore);
let playerTwo = PlayerFactory("Player 2", playerTwoInput, playerTwoScore);

const gameGrid = ((playerOne, playerTwo, drawScore) => {

  let gridArray = Array(10);
  let nextWinningMove = new Map();
  const GRID_SIZE = 3;
  const crossClass = document.querySelector("#player-1-mark");
  const circleClass = document.querySelector("#player-2-mark");
  let playerOneTurn = true;
  const CROSS = "X";
  const CIRCLE = "O";
  const players = new Map([[CROSS, playerOne],[CIRCLE, playerTwo]]);
  let gameOver = false;
  let countingMoves = 0;

  const nextTurn = () => playerOneTurn = !playerOneTurn;
  const addToGridArray = (index) => (playerOneTurn) ? gridArray[index] = CROSS : gridArray[index] = CIRCLE;
  const setPlayerMove = (index, grid) => (gridArray[index] == CROSS) ?  grid.classList.add(crossClass.className) : grid.classList.add(circleClass.className);
  
  const setNextWinningMoveMap = (index, playerSymbol) => {
    const winningMove = nextWinningMove.get(index);

    if (winningMove == undefined)  {
      nextWinningMove.set(index, [playerSymbol]);
      return;
    }

    winningMove.push(playerSymbol);
  }

  const isNextWinningMove = (index, playerSymbol) => {
    let winningMove = nextWinningMove.get(index);
    if (winningMove != undefined && winningMove.includes(playerSymbol)) {
      gameOver = true;
      
      let winner = players.get(playerSymbol);
      winner.incrementScore();
      (winner.getPlayerScore()).classList.add((playerSymbol === CROSS) ? "player-1-color" : "player-2-color");

      const grid = document.querySelector(`.grid-container > div[data-grid="${index}"]`);
      grid.classList.add("winning-grid");
    } else if (countingMoves === GRID_SIZE ** 2) {
      let score = +drawScore.textContent;
      drawScore.textContent = ++score;
      gameOver = true;
    }
  } 

  const findWinningMove = (index, playerSymbol) => {
    const arg = [index, playerSymbol];
    rowCheck(...arg);
    columnCheck(...arg);
    diagonalCheck(...arg);
  }

  const rowCheck = (index, playerSymbol) => {
    //Figure out which row to travel through, based on the grid,
    //to find the next winning move.
    const rowIndex = (Math.ceil(index / GRID_SIZE) * (GRID_SIZE) - (GRID_SIZE - 1));
    setNextWinningMove(playerSymbol, rowIndex, 1);
  }

  const columnCheck = (index, playerSymbol) => {
    //Figure out which column to travel through, based on the grid,
    //to find the next winning move.
    let columnIndex = index % GRID_SIZE;

    // Column 3 remainder is 0.
    // Overwrite to 3 to use it as an index for column
    if (columnIndex === 0) columnIndex = 3;
    setNextWinningMove(playerSymbol, columnIndex, GRID_SIZE);
  }

  const diagonalCheck = (index, playerSymbol) => {
    const isRightDiagonalCheck = ((index - 1) % (GRID_SIZE + 1)) === 0;
    const isLeftDiagonalCheck = ((index - 1) % (GRID_SIZE - 1)) === 0;
    const diagonalCheck = isRightDiagonalCheck && isLeftDiagonalCheck;

    if (diagonalCheck) {
      leftDiagonalCheck(playerSymbol);
      rightDiagonalCheck(playerSymbol);
    }
    else if (isRightDiagonalCheck) rightDiagonalCheck(playerSymbol);
    else if (isLeftDiagonalCheck) leftDiagonalCheck(playerSymbol);
  }

  const rightDiagonalCheck = (playerSymbol) => {
    const startIndex = 1;
    const increment = GRID_SIZE + 1;
    setNextWinningMove(playerSymbol, startIndex, increment);
  }

  const leftDiagonalCheck = (playerSymbol) => {
    const startIndex = GRID_SIZE;
    const increment = GRID_SIZE - 1;
    setNextWinningMove(playerSymbol, startIndex, increment);
  }

  const setNextWinningMove = (playerSymbol, index, increment) => {
    let counter = 0;
    let emptyGridIndex = 0;
    let indexCheck = index;

    for (let i = 1; i <= GRID_SIZE; i++) {
      let gridSymbol = gridArray[indexCheck];

      if (gridSymbol === playerSymbol) ++counter;
      else if (gridSymbol == undefined) emptyGridIndex = indexCheck;

      if (counter === 2 && emptyGridIndex != 0) setNextWinningMoveMap(emptyGridIndex, playerSymbol);
      indexCheck = indexCheck + increment;
    }
  }

  const processPlayerMove = (index, grid) => {
    if (gridArray[index] || gameOver) return;
    countingMoves++;
    addToGridArray(index);
    const playerSymbol = gridArray[index];
    setPlayerMove(index, grid);
    isNextWinningMove(index, playerSymbol);
    findWinningMove(index, playerSymbol)
    nextTurn();
  }

  const resetScores = () => {
    playerOne.getPlayerScore().textContent = 0;
    playerOne.getPlayerScore().classList.remove("player-1-color");
  
    playerTwo.getPlayerScore().textContent = 0;
    playerTwo.getPlayerScore().classList.remove("player-2-color");
  
    drawScore.textContent = 0;
  }
  
  const resetBoard = () => {
    Array.from(gridBoard.children).forEach(grid => grid.className = "");
    playerOne.getPlayerScore().classList.remove("player-1-color");
    playerTwo.getPlayerScore().classList.remove("player-2-color");
    gameOver = false;
    gridArray = Array(10);
    nextWinningMove = new Map();
    playerOneTurn = true;
    countingMoves = 0;
  }

  return { processPlayerMove, resetScores, resetBoard  };
  
})(playerOne, playerTwo, drawScore);

gridBoard.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target === event.currentTarget) return;
  gameGrid.processPlayerMove(+event.target.dataset.grid, event.target); 
});

playerOneInput.onchange = function() { playerOne.setPlayerName(this.value); };
playerTwoInput.onchange = function() { playerTwo.setPlayerName(this.value); };
resetBoardButton.onclick = function() { gameGrid.resetBoard(); };
resetScoreButton.onclick = function() { gameGrid.resetScores(); };