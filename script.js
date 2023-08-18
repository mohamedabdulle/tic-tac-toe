const gridBoard = document.querySelector(".grid-container");
const playerOneInput = document.querySelector("#player-1-input");
const playerTwoInput = document.querySelector("#player-2-input");

const gameGrid = (() => {

  const gridArray = [];
  const crossClass = document.querySelector("#player-1-mark");
  const circleClass = document.querySelector("#player-2-mark");
  let playerOneTurn = true;
  const CROSS = "X";
  const CIRCLE = "O";

  const nextTurn = () => playerOneTurn = !playerOneTurn;

  const addToGridArray = (index) => {
    (playerOneTurn) ? gridArray[index] = CROSS : gridArray[index] = CIRCLE;
  }

  const setPlayerChoice = (index, grid) => {
    return (gridArray[index] == CROSS) ?  grid.classList.add(crossClass.className) : grid.classList.add(circleClass.className);
  }

  const processPlayerChoice = (index, grid) => {
    if (gridArray[index]) return;
    addToGridArray(index);
    nextTurn();
    setPlayerChoice(index, grid);
  }

  return { processPlayerChoice };
})();


const Player = (playerName, score) => {
  const getScore = () => score;
  const getPlayerName = () => playerName;
  const addScore = () => ++score;
  const setPlayerName = (newName) => playerName = newName;

  return { setPlayerName, getPlayerName, getScore, addScore };
}

const PlayerFactory = (name) => {
  const playerName = name;
  let score = 0;
  const { setPlayerName, getPlayerName, getScore, addScore } = Player(playerName, score);

  return { setPlayerName, getPlayerName, getScore, addScore };
}

let playerOne = PlayerFactory("Player 1");
let playerTwo = PlayerFactory("Player 2");

gridBoard.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target === event.currentTarget) return;
  gameGrid.processPlayerChoice(event.target.dataset.grid, event.target); 
});

playerOneInput.onchange = function() { playerOne.setPlayerName(this.value); };
playerTwoInput.onchange = function() { playerTwo.setPlayerName(this.value); };


