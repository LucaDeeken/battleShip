import { Gameboard } from "./gameBoard.js";
import { Ship } from "./ship.js";
import { Player } from "./player.js";
import {
  inputName,
  showDialogShipSunk,
  randomSpawn,
} from "./DOMmanipulation.js";
import soundFile from "./sounds/water-splash.mp3";
import soundFileTwo from "./sounds/hit.mp3";
import soundFileThree from "./sounds/destroyed.mp3";
import soundFileFour from "./sounds/applause.mp3";
const audio = new Audio(soundFile);
const audioTwo = new Audio(soundFileTwo);
const audioThree = new Audio(soundFileThree);
const audioFour = new Audio(soundFileFour);

let startGameDialog = true;

let playerNames = {};
let playerOneNameBoard = document.querySelector(".ownFleet");
let playerTwoNameBoard = document.querySelector(".enemyFleet");
let playerChangeName = document.querySelector("#changePlayers");

let player1 = null;
let player2 = null;

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
              async function botPlayEasy() {
                await player1.gameboard.botTurnHard();
                document.querySelector(".bothFields").style.pointerEvents =
                  "auto";
              }
              botPlayEasy();
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
    console.log(player.name);
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
      console.log(player1);
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
function startDialog() {
  const dialog = document.getElementById("chooseGameMode");
  dialog.showModal(); // Öffnet den Dialog
  dialog.classList.remove("hidden");
  dialog.classList.remove("closing");

  let twoPlayerMode = false;
  const startBtnTwoPlayerMode = document.getElementById("TwoPlayerMode");
  function handleTwoPlayerClick(e) {
    e.preventDefault();
    dialog.classList.add("closing");
    dialog.classList.add("hidden");
    setTimeout(() => {
      dialog.close();
      twoPlayerMode = true;
      inputName(twoPlayerMode);
    }, 650);
    startBtnTwoPlayerMode.removeEventListener("click", handleTwoPlayerClick);
  }
  startBtnTwoPlayerMode.addEventListener("click", handleTwoPlayerClick);

  const startBtnKiMode = document.getElementById("KiIcon");

  function handleKIClick(e) {
    e.preventDefault();
    dialog.classList.add("closing");
    dialog.classList.add("hidden");
    setTimeout(() => {
      dialog.close();
      twoPlayerMode = false;
      inputName(twoPlayerMode);
    }, 650);
    startBtnKiMode.removeEventListener("click", handleKIClick);
  }
  startBtnKiMode.addEventListener("click", handleKIClick);
}

export function createPlayers(playerNames) {
  const namePlayerOne = document.getElementById("playerOneName");
  const namePlayerTwo = document.getElementById("playerTwoName");
  playerNames.playerOneName = namePlayerOne.value;
  playerNames.playerTwoName = namePlayerTwo.value;
  player1 = new Player(playerNames.playerOneName);
  player2 = new Player(playerNames.playerTwoName);
  playerOneNameBoard.textContent = playerNames.playerOneName + "'s Fleet";
  playerTwoNameBoard.textContent = playerNames.playerTwoName + "'s Fleet";
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
export function dialogThatCallsFirstPlayer(
  playerNames,
  kindOfSpawn,
  twoPlayerModi,
) {
  const dialog = document.getElementById("playerTurns");
  dialog.showModal();
  dialog.classList.remove("hidden");

  const confirmBtn = document.querySelector("#confirmPlayerSwitch");
  playerChangeName.textContent =
    "It's " + playerNames.playerOneName + "'s turn!";

  function handleConfirmClick(e) {
    e.preventDefault();
    const dialog = document.getElementById("playerTurns");

    dialog.classList.add("hidden");

    // EventListener entfernen
    confirmBtn.removeEventListener("click", handleConfirmClick);

    setTimeout(() => {
      dialog.close();
      startGame(playerNames, kindOfSpawn, twoPlayerModi);
    }, 250); // 250ms = Dauer der Transition
  }
  confirmBtn.addEventListener("click", handleConfirmClick);
}

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

startDialog();

export {
  player1,
  player2,
  playerNames,
  playSoundApplause,
  startDialog,
  playSoundWaterSplash,
  playSoundHit,
  playSoundDestroyed,
};
