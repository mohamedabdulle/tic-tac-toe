const gridBoard = document.querySelector(".grid-container");
const playerOneInput = document.querySelector("#player-1-input");
const playerOneScore = document.querySelector("#player-1-score");
const playerTwoInput = document.querySelector("#player-2-input");
const playerTwoScore = document.querySelector("#player-2-score");

const Player = (playerName, score, playerNameInput, playerScore) => {
  const getScore = () => score;
  const getPlayerName = () => playerName;
  const incrementScore = () => playerScore.textContent = ++score;
  const setPlayerName = (newName) => playerName = newName;
  const getPlayerInput = () => playerNameInput;

  return { setPlayerName, getPlayerName, getScore, incrementScore, getPlayerInput };
}

const PlayerFactory = (playerName, playerInput, playerScore) => {
  // const playerName = playerName;
  // const playerInput = playerInput;
  // const playerScore = playerScore;
  let score = 0;
  const { setPlayerName, getPlayerName, getScore, incrementScore, getPlayerInput } = Player(playerName, score, playerInput, playerScore);

  return { setPlayerName, getPlayerName, getScore, incrementScore, getPlayerInput };
}

let playerOne = PlayerFactory("Player 1", playerOneInput, playerOneScore);
let playerTwo = PlayerFactory("Player 2", playerTwoInput, playerTwoScore);

const gameGrid = ((playerOne, playerTwo) => {

  const gridArray = Array(10);
  const nextWinningMove = new Map();

  const GRID_SIZE = 3;
  const crossClass = document.querySelector("#player-1-mark");
  const circleClass = document.querySelector("#player-2-mark");
  const drawScore = document.querySelector("#draw-score");
  let playerOneTurn = true;
  const CROSS = "X";
  const CIRCLE = "O";
  const players = new Map([[CROSS, playerOne],[CIRCLE, playerTwo]]);
  let gameOver = false;
  let countingMoves = 0;

  const nextTurn = () => playerOneTurn = !playerOneTurn;

  const addToGridArray = (index) => {
    (playerOneTurn) ? gridArray[index] = CROSS : gridArray[index] = CIRCLE;
  }

  const setPlayerMove = (index, grid) => {
    return (gridArray[index] == CROSS) ?  grid.classList.add(crossClass.className) : grid.classList.add(circleClass.className);
  }

  const setNextWinningMove = (index, playerSymbol) => {
    const winningMove = nextWinningMove.get(index);

    if (winningMove == undefined)  {
      nextWinningMove.set(index, [playerSymbol]);
      return;
    }

    winningMove.push(playerSymbol);
  }

  const isNextWinningMove = (index, playerSymbol) => {
    let winningMove = nextWinningMove.get(index);
    return (winningMove != undefined) ? winningMove.includes(playerSymbol) : false;
  }

  const findWinningMove = (index, playerSymbol) => {
    const arg = [index, playerSymbol];
    rowCheck(...arg);
    columnCheck(...arg);
    diagonalCheck(...arg);
  }

  const rowCheck = (index, playerSymbol) => {
    const rowIndex = (Math.ceil(index / GRID_SIZE) * (GRID_SIZE) - (GRID_SIZE - 1));
    setWinningMove(playerSymbol, rowIndex, 1);
  }

  const columnCheck = (index, playerSymbol) => {
    let columnIndex = index % GRID_SIZE;

    // Column 3 remainder is 0.
    // Overwrite to 3 to use it as an index for column
    if (columnIndex === 0) columnIndex = 3;
    setWinningMove(playerSymbol, columnIndex, GRID_SIZE);
  }

  const diagonalCheck = (index, playerSymbol) => {
    const isRightDiagonalCheck = ((index - 1) % (GRID_SIZE + 1)) === 0;
    const isLeftDiagonalCheck = ((index - 1) % (GRID_SIZE - 1)) === 0;
    const diagonalCheck = isRightDiagonalCheck && isLeftDiagonalCheck;

    if (isRightDiagonalCheck) leftDiagonalCheck(playerSymbol);
    else if (isLeftDiagonalCheck) rightDiagonalCheck(playerSymbol);
    else if (diagonalCheck) {
      leftDiagonalCheck(playerSymbol);
      rightDiagonalCheck(playerSymbol);
    }
  }

  const leftDiagonalCheck = (playerSymbol) => {
    const startIndex = 1;
    const increment = GRID_SIZE + 1;
    setWinningMove(playerSymbol, startIndex, increment);
  }

  const rightDiagonalCheck = (playerSymbol) => {
    const startIndex = GRID_SIZE;
    const increment = GRID_SIZE - 1;
    setWinningMove(playerSymbol, startIndex, increment);
  }

  const setWinningMove = (playerSymbol, index, increment) => {
    let counter = 0;
    let emptyGridIndex = 0;
    let indexCheck = index;

    for (let i = 1; i <= GRID_SIZE; i++) {
      let gridSymbol = gridArray[indexCheck];

      if (gridSymbol === playerSymbol) ++counter;
      else if (gridSymbol == undefined) emptyGridIndex = indexCheck;

      if (counter === 2 && emptyGridIndex != 0) setNextWinningMove(emptyGridIndex, playerSymbol);
      indexCheck = indexCheck + increment;
    }
  }

  const processPlayerMove = (index, grid) => {
    if (gridArray[index] || gameOver) return;
    countingMoves++;
    addToGridArray(index);
    const playerSymbol = gridArray[index];

    setPlayerMove(index, grid);
    if (isNextWinningMove(index, playerSymbol)) {
      gameOver = true;
      let winner = players.get(playerSymbol);
      winner.incrementScore();
    } else if (countingMoves === GRID_SIZE ** 2) {
      let score = +drawScore.textContent;
      drawScore.textContent = ++score;
      gameOver = true;
    }

    findWinningMove(index, playerSymbol)
    nextTurn();
  }

  return { processPlayerMove };
})(playerOne, playerTwo);

gridBoard.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target === event.currentTarget) return;
  gameGrid.processPlayerMove(+event.target.dataset.grid, event.target); 
});

playerOneInput.onchange = function() { playerOne.setPlayerName(this.value); };
playerTwoInput.onchange = function() { playerTwo.setPlayerName(this.value); };