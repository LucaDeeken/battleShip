import { Gameboard } from "./gameBoard.js";
import { Ship } from "./ship.js";
import { Player } from "./player.js";
import {showDialogShipSunk} from "./DOMmanipulation.js";
import soundFile from "./sounds/water-splash.mp3";
import soundFileTwo from "./sounds/hit.mp3";
const audio = new Audio(soundFile);
const audioTwo = new Audio(soundFileTwo);


let startGameDialog = true;
let playerOneNameBoard = document.querySelector(".ownFleet");
let playerTwoNameBoard = document.querySelector(".enemyFleet");
let playerChangeName = document.querySelector("#changePlayers");

export function startGame(playerNames) {
  const mainArea = document.getElementById("mainArea");
  mainArea.classList.remove("hidden");
  const bothFields = mainArea.querySelector(".bothFields");
  bothFields.classList.remove("hidden");
  const name = "Luca";
  let player1 = new Player(playerNames.playerOneName);
  player1.gameboard.buildFields();
  const savedFieldsPlaceArea = player1.gameboard.randomSpawn();
  const clonedFieldPlayerOne = savedFieldsPlaceArea.cloneNode(true);
  const clonedFieldPlayerOneRecolor = savedFieldsPlaceArea.cloneNode(true);

  let wholeFieldPlaceArea = document.querySelector(".fieldArea");
  let wholeFieldFireArea = document.querySelector(".fireArea");
  wholeFieldPlaceArea.innerHTML = "";
  wholeFieldFireArea.innerHTML = "";

  const nameTwo = "Lotta";
  let player2 = new Player(playerNames.playerTwoName);
  console.log(player2);
  player2.gameboard.buildFields();
  const savedFieldsP2 = player2.gameboard.randomSpawn();
  const clonedFieldPlayerTwo = savedFieldsP2.cloneNode(true);
  const clonedFieldPlayerTwoRecolor = savedFieldsP2.cloneNode(true);

  wholeFieldPlaceArea.innerHTML = "";
  wholeFieldFireArea.innerHTML = "";

  playerOneTurn(clonedFieldPlayerTwo, player1, clonedFieldPlayerOneRecolor);

  function playerOneTurn(
    clonedFieldPlayerTwo,
    player1,
    clonedFieldPlayerOneRecolor
  ) {
    console.log("HALLO");
    player1.gameboard.allShipsSunk();
    player1.gameboard.shipSunk();
    clonedFieldPlayerOneRecolor.classList.remove("fieldArea");
    clonedFieldPlayerOneRecolor.classList.add("fieldArea");
    clonedFieldPlayerTwo.classList.remove("fieldArea");
    clonedFieldPlayerTwo.classList.add("fireArea");
    let wholeFieldPlaceArea = document.querySelector(".fieldArea");
    wholeFieldPlaceArea.replaceWith(clonedFieldPlayerOneRecolor);
    let wholeFieldFireArea = document.querySelector(".fireArea");
    wholeFieldFireArea.replaceWith(clonedFieldPlayerTwo);
    const fireFieldMarks = document.querySelector(".fireArea");
    buildEventListenersplayers(player2, fireFieldMarks);
    refreshOwnBoard(player1);
    player1.gameboard.hideShips();
  }

  function playerTwoTurn(
    clonedFieldPlayerOne,
    player2,
    clonedFieldPlayerTwoRecolor
  ) {
    player2.gameboard.allShipsSunk();
    player2.gameboard.shipSunk();
    clonedFieldPlayerTwoRecolor.classList.remove("fireArea");
    clonedFieldPlayerTwoRecolor.classList.add("fieldArea");
    clonedFieldPlayerOne.classList.remove("fieldArea");
    clonedFieldPlayerOne.classList.add("fireArea");
    let wholeFieldFireArea = document.querySelector(".fireArea");
    let wholeFieldPlaceArea = document.querySelector(".fieldArea");
    wholeFieldFireArea.replaceWith(clonedFieldPlayerOne);
    const fireFieldMarks = document.querySelector(".fireArea");
    buildEventListenersplayers(player1, fireFieldMarks);
    wholeFieldPlaceArea.replaceWith(clonedFieldPlayerTwoRecolor);
    refreshOwnBoard(player2);
    player2.gameboard.hideShips();
  }

  function buildEventListenersplayers(player, fireFieldMarks) {
    const fieldBlockFire = fireFieldMarks.getElementsByClassName("fieldBlock");
    let playersDontShift = false;
    for (let i = 0; i < fieldBlockFire.length; i++) {
      fieldBlockFire[i].onclick = null;
      fieldBlockFire[i].onclick = () => {
        let dataIndex = fieldBlockFire[i].dataset.index;
        let objectClick = player.gameboard.findObjectFromGrid(dataIndex);
        playersDontShift = player.gameboard.receiveAttack(objectClick, fireFieldMarks);
        player.gameboard.allShipsSunk();
        console.log(playersDontShift);
        if(playersDontShift===true) {
          //playershifting doesnt happen
          playSoundHit();
          player.gameboard.allShipsSunk();
          const shipSunkName = player.gameboard.shipSunk();
          console.log(shipSunkName);
          if (shipSunkName!==false) {
            showDialogShipSunk(shipSunkName);
          }
        } else {
          playSoundWaterSplash();
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
              clonedFieldPlayerOneRecolor
            );
          }, 1500);
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
    clonedFieldPlayerOneRecolor
  ) {
    const dialog = document.getElementById("playerTurns");
    document.querySelector(".bothFields").style.pointerEvents = "auto";
    dialog.showModal();
    dialog.classList.remove("hidden");
    dialog.classList.remove("opacity");
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
      
      dialog.classList.add("opacity"); // Start der opacity-Transition
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
          clonedFieldPlayerTwoRecolor
        );
      } else {
        playerOneNameBoard.textContent = playerNames.playerOneName + "'s Fleet";
        playerTwoNameBoard.textContent = playerNames.playerTwoName + "'s Fleet";
        playerOneTurn(
          clonedFieldPlayerTwo,
          player1,
          clonedFieldPlayerOneRecolor
        );
      }
    }
  }
}
function startDialog() {
  const dialog = document.getElementById("chooseGameMode");
  dialog.showModal(); // Öffnet den Dialog
  dialog.classList.remove("hidden");
  const startBtn = document.getElementById("TwoPlayerMode");
  startBtn.addEventListener("click", () => {
    dialog.classList.add("closing");
    dialog.classList.add("hidden");
    setTimeout(() => {
      dialog.close();
      inputName();
    }, 650); // 300ms = Dauer der Transition
  });
}

function inputName() {
  let playerNames = {};
  const dialog = document.getElementById("givePlayerName");
  dialog.showModal();
  dialog.classList.remove("hidden");
  const confirmBtn = document.getElementById("confirmBtn");
  confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const namePlayerOne = document.getElementById("playerOneName");
    const namePlayerTwo = document.getElementById("playerTwoName");
    playerNames.playerOneName = namePlayerOne.value;
    playerNames.playerTwoName = namePlayerTwo.value;
    playerOneNameBoard.textContent = playerNames.playerOneName + "'s Fleet";
    playerTwoNameBoard.textContent = playerNames.playerTwoName + "'s Fleet";
    dialog.classList.add("closing");
    dialog.classList.add("hidden");
    setTimeout(() => {
      dialog.close();
      dialogThatCallsFirstPlayer(playerNames);
    }, 650); // 300ms = Dauer der Transition
  });
  return { playerNames };
}

function dialogThatCallsFirstPlayer(playerNames) {
  const dialog = document.getElementById("playerTurns");
  dialog.showModal();
  dialog.classList.remove("hidden");
  dialog.classList.remove("opacity");
  const confirmBtn = document.querySelector("#confirmPlayerSwitch");
  playerChangeName.textContent =
    "It's " + playerNames.playerOneName + "'s turn!";

  function handleConfirmClick(e) {
    e.preventDefault();
    const dialog = document.getElementById("playerTurns");

    dialog.classList.add("opacity"); // Start der opacity-Transition
    dialog.classList.add("hidden");

    // EventListener entfernen
    confirmBtn.removeEventListener("click", handleConfirmClick);

    setTimeout(() => {
      dialog.close();
      startGame(playerNames);
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
 
startDialog();
