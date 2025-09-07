import { Player } from "./player.js";
import {
  inputName,
  showDialogShipSunk,
} from "./DOMmanipulation.js";
import soundFile from "./sounds/water-splash.mp3";
import soundFileTwo from "./sounds/hit.mp3";
import soundFileThree from "./sounds/destroyed.mp3";
import soundFileFour from "./sounds/applause.mp3";
import soundFileFive from "./sounds/Daydream_firstHit.mp3";
import soundFileSix from "./sounds/Daydream_oneLeft.mp3";
import soundFileSeven from "./sounds/Daydream_gameOver.mp3";
import soundFileEight from "./sounds/Deadeye_firstHit.mp3";
import soundFileNine from "./sounds/Deadeye_oneLeft.mp3";
import soundFileTen from "./sounds/Deadeye_gameOver.mp3";
import soundFileEleven from "./sounds/Damned_firstHit.mp3";
import soundFileTwelve from "./sounds/Damned_oneLeft.mp3";
import soundFileThirteen from "./sounds/Damned_gameOver.mp3";

const audio = new Audio(soundFile);
const audioTwo = new Audio(soundFileTwo);
const audioThree = new Audio(soundFileThree);
const audioFour = new Audio(soundFileFour);
const Daydream_firstHit = new Audio(soundFileFive);
const Daydream_lastHit = new Audio(soundFileSix);
const Daydream_gameOver = new Audio(soundFileSeven);
const Deadeye_firstHit = new Audio(soundFileEight);
const Deadeye_lastHit = new Audio(soundFileNine);
const Deadeye_gameOver = new Audio(soundFileTen);
const Damned_firstHit = new Audio(soundFileEleven);
const Damned_lastHit = new Audio(soundFileTwelve);
const Damned_gameOver = new Audio(soundFileThirteen);

let playerNames = {};
let playerOneNameBoard = document.querySelector(".ownFleet");
let playerTwoNameBoard = document.querySelector(".enemyFleet");
export let playerChangeName = document.querySelector("#changePlayers");

let player1 = null;
let player2 = null;

//Starts the game and builds fields depending of playerCount and placementMethod.
//Also manages the playerTurnChanges and DOM-Building.
export function startGame(playerNames, kindOfSpawn, twoPlayerModi) {

  const mainArea = document.getElementById("mainArea");
  mainArea.classList.remove("hidden");
  const bothFields = mainArea.querySelector(".bothFields");
  bothFields.classList.remove("hidden");

  playerOneNameBoard.textContent = playerNames.playerOneName + "'s Fleet";
  playerTwoNameBoard.textContent = playerNames.playerTwoName + "'s Fleet";

  let wholeFieldFireArea = document.querySelector(".fireAreaHangar");
  wholeFieldFireArea.classList.add("fireArea");
  wholeFieldFireArea.classList.remove("fireAreaHangar");
  player1.gameboard.buildFields();
  let savedFieldsPlaceArea;
  let savedFieldsP2;
  if (kindOfSpawn === true) {
    savedFieldsPlaceArea = player1.gameboard.randomSpawn();
  } else {
    savedFieldsPlaceArea = player1.gameboard.getOwnPlacementsIntoStartingGame();
  }

  const clonedFieldPlayerOne = savedFieldsPlaceArea.cloneNode(true);
  const clonedFieldPlayerOneRecolor = savedFieldsPlaceArea.cloneNode(true);

  let wholeFieldPlaceArea = document.querySelector(".fieldArea");
  wholeFieldFireArea = document.querySelector(".fireArea");
  wholeFieldPlaceArea.innerHTML = "";
  wholeFieldFireArea.innerHTML = "";

  player2.gameboard.buildFields();
  if (kindOfSpawn === true || twoPlayerModi === false) {
    savedFieldsP2 = player2.gameboard.randomSpawn();
  } else {
    savedFieldsP2 = player2.gameboard.getOwnPlacementsIntoStartingGame();
  }
  const clonedFieldPlayerTwo = savedFieldsP2.cloneNode(true);
  const clonedFieldPlayerTwoRecolor = savedFieldsP2.cloneNode(true);

  wholeFieldPlaceArea.innerHTML = "";
  wholeFieldFireArea.innerHTML = "";

  playerOneTurn(
    clonedFieldPlayerTwo,
    player1,
    clonedFieldPlayerOneRecolor,
    twoPlayerModi,
  );

  function playerOneTurn(
    clonedFieldPlayerTwo,
    player1,
    clonedFieldPlayerOneRecolor,
    twoPlayerModi,
  ) {
    clonedFieldPlayerOneRecolor.classList.remove("fieldArea");
    clonedFieldPlayerOneRecolor.classList.add("fieldArea");
    clonedFieldPlayerTwo.classList.remove("fieldArea");
    clonedFieldPlayerTwo.classList.add("fireArea");
    let wholeFieldPlaceArea = document.querySelector(".fieldArea");
    wholeFieldPlaceArea.replaceWith(clonedFieldPlayerOneRecolor);
    let wholeFieldFireArea = document.querySelector(".fireArea");
    wholeFieldFireArea.replaceWith(clonedFieldPlayerTwo);
    const fireFieldMarks = document.querySelector(".fireArea");
    buildEventListenersplayers(player2, fireFieldMarks, twoPlayerModi);
    refreshOwnBoard(player1);
    player1.gameboard.hideShips();
  }

  function playerTwoTurn(
    clonedFieldPlayerOne,
    player2,
    clonedFieldPlayerTwoRecolor,
  ) {
    clonedFieldPlayerTwoRecolor.classList.remove("fireArea");
    clonedFieldPlayerTwoRecolor.classList.add("fieldArea");
    clonedFieldPlayerOne.classList.remove("fieldArea");
    clonedFieldPlayerOne.classList.add("fireArea");
    let wholeFieldFireArea = document.querySelector(".fireArea");
    let wholeFieldPlaceArea = document.querySelector(".fieldArea");
    wholeFieldFireArea.replaceWith(clonedFieldPlayerOne);
    const fireFieldMarks = document.querySelector(".fireArea");
    buildEventListenersplayers(player1, fireFieldMarks, twoPlayerModi);
    wholeFieldPlaceArea.replaceWith(clonedFieldPlayerTwoRecolor);
    refreshOwnBoard(player2);
    player2.gameboard.hideShips();
  }

  //rebuilds the EventListeners of the FieldBlocks and also manages the botTurns, depending of set difficulty.
  function buildEventListenersplayers(player, fireFieldMarks, twoPlayerModi) {
    const fieldBlockFire = fireFieldMarks.getElementsByClassName("fieldBlock");
    let playersDontShift = false;
    for (let i = 0; i < fieldBlockFire.length; i++) {
      fieldBlockFire[i].onclick = null;
      fieldBlockFire[i].onclick = () => {
        let dataIndex = fieldBlockFire[i].dataset.index;
        let objectClick = player.gameboard.findObjectFromGrid(dataIndex);
        playersDontShift = player.gameboard.receiveAttack(
          objectClick,
          fireFieldMarks,
        );
        if (playersDontShift === true) {
          //playershifting doesnt happen

          const shipSunk = player.gameboard.shipSunk();
          if (shipSunk !== false) {
            playSoundDestroyed();
            showDialogShipSunk(shipSunk.shipName, player, shipSunk.shipColor);
          } else {
            playSoundHit();
          }
        } else {
          playSoundWaterSplash();
          if (twoPlayerModi === false) {
            document.querySelector(".bothFields").style.pointerEvents = "none";
            setTimeout(() => {
              async function botPlay() {
                switch (player2.name) {
                  case "Sir Daydream":
                    await player1.gameboard.botTurnEasy("Sir Daydream");
                    break;
                  case "Miss Deadeye":
                    await player1.gameboard.botTurnMedium("Miss Deadeye");
                    break;
                  case "The Damned Captain":
                    await player1.gameboard.botTurnHard("The Damned Captain");
                    break;
                }
              }
              (async () => {
                await botPlay();
                setTimeout(() => {
                  document.querySelector(".bothFields").style.pointerEvents =
                    "auto";
                }, 1600);
              })();
            }, 100);
          } else {
            document.querySelector(".bothFields").style.pointerEvents = "none";
            setTimeout(() => {
              const bothFields = mainArea.querySelector(".bothFields");
              bothFields.classList.remove("opacityOn");
              bothFields.classList.add("opacity");
              playersTurnSwitch(
                player,
                player1,
                player2,
                clonedFieldPlayerOne,
                clonedFieldPlayerTwoRecolor,
                clonedFieldPlayerTwo,
                clonedFieldPlayerOneRecolor,
                twoPlayerModi,
              );
            }, 1500);
          }
        }
      };
    }
  }
  function refreshOwnBoard(player) {
    const ownBoard = document.querySelector(".fieldArea");
    player.gameboard.markHitShips(ownBoard);
  }

  //manages the playerTurnSwitch dialog
  function playersTurnSwitch(
    player,
    player1,
    player2,
    clonedFieldPlayerOne,
    clonedFieldPlayerTwoRecolor,
    clonedFieldPlayerTwo,
    clonedFieldPlayerOneRecolor,
    twoPlayerModi,
  ) {
    const dialog = document.getElementById("playerTurns");
    document.querySelector(".bothFields").style.pointerEvents = "auto";
    dialog.showModal();
    dialog.classList.remove("hidden");
    dialog.classList.remove("getSmall");
    dialog.classList.add("getBig");
    if (player.name === player2.name) {
      playerChangeName.textContent =
        "It's " + playerNames.playerTwoName + "'s turn!";
    } else {
      playerChangeName.textContent =
        "It's " + playerNames.playerOneName + "'s turn!";
    }

    const confirmBtn = document.querySelector("#confirmPlayerSwitch");
    confirmBtn.onclick = null;
    confirmBtn.onclick = () => {
      dialog.classList.add("hidden");
      dialog.classList.remove("getBig");
      dialog.classList.add("getSmall");
      dialog.close();
      const bothFields = mainArea.querySelector(".bothFields");
      bothFields.classList.remove("opacity");
      bothFields.classList.add("opacityOn");
      if (player.name === player2.name) {
        playerOneNameBoard.textContent = playerNames.playerTwoName + "'s Fleet";
        playerTwoNameBoard.textContent = playerNames.playerOneName + "'s Fleet";
        playerTwoTurn(
          clonedFieldPlayerOne,
          player2,
          clonedFieldPlayerTwoRecolor,
          twoPlayerModi,
        );
      } else {
        playerOneNameBoard.textContent = playerNames.playerOneName + "'s Fleet";
        playerTwoNameBoard.textContent = playerNames.playerTwoName + "'s Fleet";
        playerOneTurn(
          clonedFieldPlayerTwo,
          player1,
          clonedFieldPlayerOneRecolor,
          twoPlayerModi,
        );
      }
    };
  }
}


//creates the playerClasses
export function createPlayers(playerNames, twoPlayerModi) {
  const namePlayerOne = document.getElementById("playerOneName");
  playerNames.playerOneName = namePlayerOne.value;
  player1 = new Player(playerNames.playerOneName);
  playerOneNameBoard.textContent = playerNames.playerOneName + "'s Fleet";

  if (twoPlayerModi === true) {
    const namePlayerTwo = document.getElementById("playerTwoName");
    playerNames.playerTwoName = namePlayerTwo.value;
    player2 = new Player(playerNames.playerTwoName);
    playerTwoNameBoard.textContent = playerNames.playerTwoName + "'s Fleet";
  } else {
    playerNames.playerTwoName = "Sir Daydream";
    player2 = new Player(playerNames.playerTwoName);
    playerTwoNameBoard.textContent = playerNames.playerTwoName + "'s Fleet";
  }
  return {
    player1,
    player2,
    playerNames,
    playerOneNameBoard,
    playerTwoNameBoard,
  };
}

export function placeShips(player) {
  player.gameboard.ownPlacementPhase();
  playerOneNameBoard.textContent = player.name + "'s Ocean";
  playerTwoNameBoard.textContent = player.name + "'s Ship Hangar";
}

//This one is unique, because it manages the very first dialog, that calls the beginning player.

function playSoundWaterSplash() {
  audio.currentTime = 0;
  audio.play();
}

function playSoundHit() {
  audioTwo.currentTime = 0;
  audioTwo.play();
}

function playSoundDestroyed() {
  audioThree.currentTime = 0;
  audioThree.play();
}

function playSoundApplause() {
  audioFour.currentTime = 0;
  audioFour.play();
}

export function playSoundFirstHit(enemy) {
  switch (enemy) {
    case "Sir Daydream":
      Daydream_firstHit.currentTime = 0;
      Daydream_firstHit.play();
      break;
    case "Miss Deadeye":
      Deadeye_firstHit.currentTime = 0;
      Deadeye_firstHit.play();
      break;
    case "The Damned Captain":
      Damned_firstHit.currentTime = 0;
      Damned_firstHit.play();
      break;
  }
}

export function playSoundOneLeftHit(enemy) {
  switch (enemy) {
    case "Sir Daydream":
      Daydream_lastHit.currentTime = 0;
      Daydream_lastHit.play();
      break;
    case "Miss Deadeye":
      Deadeye_lastHit.currentTime = 0;
      Deadeye_lastHit.play();
      break;
    case "The Damned Captain":
      Damned_lastHit.currentTime = 0;
      Damned_lastHit.play();
      break;
  }
}

export function playSoundGameover(enemy) {
  switch (enemy) {
    case "Sir Daydream":
      Daydream_gameOver.currentTime = 0;
      Daydream_gameOver.play();
      break;
    case "Miss Deadeye":
      Deadeye_gameOver.currentTime = 0;
      Deadeye_gameOver.play();
      break;
    case "The Damned Captain":
      Damned_gameOver.currentTime = 0;
      Damned_gameOver.play();
      break;
  }
}






export {
  player1,
  player2,
  playerNames,
  playSoundApplause,
  playSoundWaterSplash,
  playSoundHit,
  playSoundDestroyed,
};
