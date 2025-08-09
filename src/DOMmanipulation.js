import { Gameboard } from "./gameBoard.js";
import { playerOne, findObjectFromGrid } from "./player.js";
import {
  dialogThatCallsFirstPlayer,
  playerNames,
  player1,
  player2,
  placeShips,
  createPlayers,
  playSoundApplause,
  startDialog,
} from "./gameFlow.js";
import confetti from "canvas-confetti";

//Displays the dialog for entering names. In AI mode, only one input field is editable.
export function inputName(twoPlayerModi) {
  const dialog = document.getElementById("givePlayerName");
  dialog.showModal();
  dialog.classList.remove("hidden");
  dialog.classList.remove("closing");

  if (twoPlayerModi===false) {
    const botNameLabel = document.getElementById("labelPlayerTwo");
    botNameLabel.textContent = "Computer Name:";
    const botNameValue = document.getElementById("playerTwoName");
    botNameValue.value = "Admiral Byte";
    botNameValue.readOnly = true; 
  }

  const confirmBtn = document.getElementById("confirmBtn");
  function handleConfirmClick(e) {
    e.preventDefault();
    createPlayers(playerNames);
    dialog.classList.add("closing");
    dialog.classList.add("hidden");
    setTimeout(() => {
      dialog.close();
      chosePlaceModeDialog(player1, randomSpawn, twoPlayerModi);
    }, 650);
    confirmBtn.removeEventListener("click", handleConfirmClick);
  }
  confirmBtn.addEventListener("click", handleConfirmClick);

  const returnBtn = document.getElementById("cancelBtn");
  function handleReturnClick(e) {
    e.preventDefault();
    dialog.classList.add("closing");
    dialog.classList.add("hidden");
    setTimeout(() => {
      dialog.close();
      startDialog();
    }, 650);
    returnBtn.removeEventListener("click", handleReturnClick);
  }
  returnBtn.addEventListener("click", handleReturnClick);

  return { playerNames };
}

//Displays the dialog, which pops up, when a ship sinks.
export function showDialogShipSunk(shipSunkName, player, shipSunkColor) {
  const dialog = document.getElementById("ShipSunkDialog");
  dialog.showModal();
  dialog.classList.remove("hidden");
  dialog.classList.remove("getSmall");
  dialog.classList.add("getBig");
  const confirmBtn = document.getElementById("confirmBtnShip");
  const shipSunkHeader = document.getElementById("shipSunkHeader");
  console.log(shipSunkColor);
  shipSunkHeader.innerHTML = `The <span style="color: ${shipSunkColor};">${shipSunkName}</span> just sunk!`;
  console.log(player);

  function handleConfirmClick(e) {
    e.preventDefault();
    dialog.classList.add("hidden");
    dialog.classList.remove("getBig");
    dialog.classList.add("getSmall");
    setTimeout(() => {
      dialog.close();
      player.gameboard.allShipsSunk(player);
    }, 650);
    confirmBtn.removeEventListener("click", handleConfirmClick);
  }
  confirmBtn.addEventListener("click", handleConfirmClick);
}

//Confetti Animation, which shows up, when one Player wins.
function startConfetti() {
  const duration = 3 * 1000; // 3 Sekunden
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 9,
      startVelocity: 30,
      spread: 360,
      origin: { x: Math.random(), y: Math.random() - 0.2 },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

//Displays the Dialog, which shows, when one Player or the Bot wins
export function gameOverDialog(player) {
  const dialog = document.getElementById("WinnersDialog");
  dialog.showModal();
  dialog.classList.remove("hidden");
  dialog.classList.remove("getSmall");
  dialog.classList.add("getBig");
  const confirmBtn = document.getElementById("confirmBtnWin");
  const headerWinner = document.getElementById("headerWinnersDialog");
  headerWinner.textContent = player.name + " " + "won the game!";
  startConfetti();
  playSoundApplause();

  function handleConfirmClick(e) {
    e.preventDefault();
    dialog.classList.add("hidden");
    dialog.classList.remove("getBig");
    dialog.classList.add("getSmall");

    setTimeout(() => {
      dialog.close();
      window.location.replace(window.location.href);
    }, 650);

    confirmBtn.removeEventListener("click", handleConfirmClick);
  }

  confirmBtn.addEventListener("click", handleConfirmClick);
}

let randomSpawn = false;
export function chosePlaceModeDialog(player1, placementKind, twoPlayerModi) {
  const dialog = document.getElementById("chosePlaceMode");
  dialog.showModal(); // Öffnet den Dialog
  dialog.classList.remove("hidden");

  function handleOwnPlacementClick() {
    dialog.classList.add("closing");
    dialog.classList.add("hidden");
    setTimeout(() => {
      dialog.close();
      console.log(twoPlayerModi);
      placeShipsDialog(player1, placementKind, secondPlayerDone, twoPlayerModi);
    }, 650);
  }
  const ownPlacement = document.getElementById("choseOwnPlacement");
  ownPlacement.removeEventListener("click", handleOwnPlacementClick);
  ownPlacement.addEventListener("click", handleOwnPlacementClick);

  function handleRandomPlacementClick() {
    const confirmBtnPlacement = document.getElementById("confirmPlacementBtn");
    const resetBtn = document.getElementById("resetPlacementBtn");
    resetBtn.classList.add("hidden");
    confirmBtnPlacement.classList.add("hidden");
    dialog.classList.add("closing");
    dialog.classList.add("hidden");
    setTimeout(() => {
      dialog.close();
      placementKind = true;
      dialogThatCallsFirstPlayer(playerNames, placementKind, twoPlayerModi);
    }, 650);
  }

  const randomPlacement = document.getElementById("choseRandomPlacement");
  randomPlacement.removeEventListener("click", handleRandomPlacementClick);
  randomPlacement.addEventListener("click", handleRandomPlacementClick);
}

let beforeFirstReset = true;
let horizontalRotation = true;
let secondPlayerDone = false;
export function placeShipsDialog(
  player,
  placementKindParameter,
  secondPlayerBol,
  twoPlayerModi,
) {
  console.log(twoPlayerModi);
  const mainArea = document.getElementById("mainArea");
  mainArea.classList.remove("hidden");
  const bothFields = mainArea.querySelector(".bothFields");
  bothFields.classList.remove("hidden");
  const fieldArea = document.querySelector(".fieldArea");

  fieldArea.innerHTML = "";
  const shipHangar = document.getElementById("shipHangar");
  shipHangar.classList.remove("hidden");
  shipHangar.innerHTML = "";
  console.log(player);
  buildShipHangar("shipInHangarContainer");

  //rotateButton
  if (beforeFirstReset === true) {
    const rotateBtn = document.getElementById("rotateHangar");
    rotateBtn.addEventListener("click", () => {
      console.log(horizontalRotation);
      if (horizontalRotation === true) {
        console.log(document);
        const shipHangar = document.getElementById("shipHangar");
        console.log(shipHangar);
        shipHangar.innerHTML = "";
        shipHangar.id = "shipHangarRotated";
        buildShipHangar("shipInHangarContainerRotated");
        addDragEventsToShips("shipInHangarContainerRotated");
        horizontalRotation = false;
      } else {
        const shipHangar = document.getElementById("shipHangarRotated");
        shipHangar.innerHTML = "";
        shipHangar.id = "shipHangar";
        buildShipHangar("shipInHangarContainer");
        addDragEventsToShips("shipInHangarContainer");
        horizontalRotation = true;
      }
      console.log(horizontalRotation);
    });
    beforeFirstReset = false;
  }

  placeShips(player);
  const fieldBlockField = fieldArea.getElementsByClassName("fieldBlock");
  for (let i = 0; i < fieldBlockField.length; i++) {
    const block = fieldBlockField[i];

    block.addEventListener("dragover", function (e) {
      e.preventDefault(); // Drop erlauben
    });

    block.addEventListener("drop", function (e) {
      e.preventDefault();
      const data = e.dataTransfer.getData("text/plain");
      console.log(data);
      const parsed = JSON.parse(data);
      console.log(parsed);
      console.log(block.dataset.index);
      console.log(horizontalRotation);
      checkIfShipHasSpaceForPlacement(
        block,
        parsed.indexClicked,
        parsed.lastChildIndex,
        parsed.colorOfShip,
        horizontalRotation,
      );

      document.querySelectorAll("[data-index-clicked]").forEach((e) => {
        e.removeAttribute("data-index-clicked");
      });
    });
  }

  //rotation-bool
  function addDragEventsToShips(direction) {
    const shipInHangarContainer = document.getElementsByClassName(direction);

    console.log(shipInHangarContainer);
    for (let k = 0; k < shipInHangarContainer.length; k++) {
      const ship = shipInHangarContainer[k];
      ship.addEventListener("dragstart", (e) => {
        console.log("Drag started:", ship);
        const lastChildIndex = ship.children.length - 1;
        const clickedSegment = ship.querySelector("[data-index-clicked]");
        if (!clickedSegment) return; // Schutz

        const value = clickedSegment.dataset.indexClicked;
        const shipColor = clickedSegment.dataset.color;

        const payload = JSON.stringify({
          lastChildIndex,
          indexClicked: value,
          colorOfShip: shipColor,
        });
        console.log(payload);
        e.dataTransfer.setData("text/plain", payload);
      });
    }
  }
  addDragEventsToShips("shipInHangarContainer");

  function checkIfShipHasSpaceForPlacement(
    fieldBlock,
    shipIndexClicked,
    shipBlockLength,
    colorOfShip,
    horizontalRotation,
  ) {
    let blockIndex = fieldBlock.dataset.index;
    console.log(blockIndex);
    let firstIndex = null;
    if (blockIndex.length > 1) {
      firstIndex = blockIndex[0];
    } else {
      blockIndex = "0" + String(blockIndex);
      firstIndex = blockIndex[0];
    }
    const letzterIndex = blockIndex.length - 1;
    console.log(letzterIndex);
    blockIndex = blockIndex[letzterIndex];
    firstIndex = Number(firstIndex);
    blockIndex = Number(blockIndex);
    shipIndexClicked = Number(shipIndexClicked);
    shipBlockLength = Number(shipBlockLength);
    console.log(horizontalRotation);

    if (horizontalRotation === true) {
      if (
        blockIndex >= shipIndexClicked &&
        blockIndex + (shipBlockLength - shipIndexClicked) <= 9
      ) {
        const shipThere = checkIfFieldIsTaken(
          blockIndex,
          shipIndexClicked,
          shipBlockLength,
          firstIndex,
          horizontalRotation,
        );
        if (shipThere === false) {
          printShipOnBoard(
            blockIndex,
            shipIndexClicked,
            shipBlockLength,
            firstIndex,
            horizontalRotation,
            colorOfShip,
          );
        }
      }
    } else {
      if (
        firstIndex >= shipIndexClicked &&
        firstIndex + (shipBlockLength - shipIndexClicked) <= 9
      ) {
        const shipThere = checkIfFieldIsTaken(
          blockIndex,
          shipIndexClicked,
          shipBlockLength,
          firstIndex,
          horizontalRotation,
        );
        if (shipThere === false) {
          printShipOnBoard(
            blockIndex,
            shipIndexClicked,
            shipBlockLength,
            firstIndex,
            horizontalRotation,
            colorOfShip,
          );
        }
      }
    }
  }

  function checkIfFieldIsTaken(
    fieldBlock,
    shipIndexClicked,
    shipBlockLength,
    firstIndex,
    horizontalRotation,
  ) {
    if (firstIndex != null) {
      fieldBlock = String(fieldBlock);
      fieldBlock = Number(firstIndex + fieldBlock);
    }

    if (horizontalRotation === true) {
      let startBlockIndex = fieldBlock - shipIndexClicked;
      let endBlock = startBlockIndex + shipBlockLength;
      endBlock = endBlock + 1;
      for (startBlockIndex; startBlockIndex < endBlock; startBlockIndex++) {
        const blockToPrint = document.querySelector(
          `[data-index="${startBlockIndex}"]`,
        );
        if (blockToPrint.dataset.shipIsHere === "true") {
          return true;
        }
      }
      return false;
    } else {
      let startBlockIndex = firstIndex - shipIndexClicked;
      fieldBlock = String(fieldBlock);
      startBlockIndex = String(startBlockIndex) + fieldBlock[1];
      let endBlock = Number(startBlockIndex[0]) + Number(shipBlockLength);
      endBlock = String(endBlock + 1) + fieldBlock[1];
      startBlockIndex = Number(startBlockIndex);
      endBlock = Number(endBlock);
      for (startBlockIndex; startBlockIndex < endBlock; startBlockIndex += 10) {
        const blockToPrint = document.querySelector(
          `[data-index="${startBlockIndex}"]`,
        );
        if (blockToPrint.dataset.shipIsHere === "true") {
          return true;
        }
      }
      return false;
    }
  }

  function printShipOnBoard(
    fieldBlock,
    shipIndexClicked,
    shipBlockLength,
    firstIndex,
    horizontalRotation,
    colorOfShip,
  ) {
    if (firstIndex != null) {
      fieldBlock = String(fieldBlock);
      fieldBlock = Number(firstIndex + fieldBlock);
    }
    if (horizontalRotation === true) {
      let startBlockIndex = fieldBlock - shipIndexClicked;
      let endBlock = startBlockIndex + shipBlockLength;
      endBlock = endBlock + 1;
      for (startBlockIndex; startBlockIndex < endBlock; startBlockIndex++) {
        const blockToPrint = document.querySelector(
          `[data-index="${startBlockIndex}"]`,
        );
        blockToPrint.dataset.shipIsHere = "true";
        blockToPrint.style.backgroundColor = colorOfShip;
        blockToPrint.dataset.color = colorOfShip;
      }
      clearShipFromHangar(colorOfShip);
    } else {
      let startBlockIndex = firstIndex - shipIndexClicked;
      fieldBlock = String(fieldBlock);

      if (fieldBlock.length < 2) {
        fieldBlock = "0" + fieldBlock;
      }
      startBlockIndex = String(startBlockIndex) + fieldBlock[1];
      let endBlock = Number(startBlockIndex[0]) + Number(shipBlockLength);
      endBlock = String(endBlock + 1) + fieldBlock[1];
      startBlockIndex = Number(startBlockIndex);
      endBlock = Number(endBlock);
      for (startBlockIndex; startBlockIndex < endBlock; startBlockIndex += 10) {
        console.log(startBlockIndex);
        const blockToPrint = document.querySelector(
          `[data-index="${startBlockIndex}"]`,
        );
        blockToPrint.dataset.shipIsHere = "true";
        blockToPrint.style.backgroundColor = colorOfShip;
        blockToPrint.dataset.color = colorOfShip;
      }
      clearShipFromHangar(colorOfShip);
    }
  }

  function clearShipFromHangar(colorOfShip) {
    const hangar = document.querySelector(".fireAreaHangar");
    const blockToPrint = hangar.querySelectorAll(
      `[data-color="${colorOfShip}"]`,
    );
    for (let i = 0; i < blockToPrint.length; i++) {
      blockToPrint[i].remove();
    }
  }

  function buildShipHangar(direction) {
    for (const key in player.gameboard.ships) {
      const shipInHangarContainer = document.createElement("div");
      const fieldBlockHeader = document.createElement("h2");
      const fieldBlock = document.createElement("div");
      fieldBlockHeader.classList.add("fieldBlockHeader");
      fieldBlock.classList.add(direction);
      fieldBlock.setAttribute("draggable", "true");
      fieldBlock.style.width = "fit-content";
      fieldBlock.style.alignSelf = "center";
      shipHangar.appendChild(shipInHangarContainer);
      shipInHangarContainer.appendChild(fieldBlockHeader);
      shipInHangarContainer.appendChild(fieldBlock);
      shipInHangarContainer.style.display = "flex";
      shipInHangarContainer.style.flexDirection = "column";
      fieldBlockHeader.textContent = player.gameboard.ships[key].shipName;
      const shipLength = player.gameboard.ships[key].length;
      const shipColor = player.gameboard.ships[key].shipColor;

      for (let j = 0; j < shipLength; j++) {
        const fieldBlockShip = document.createElement("div");
        fieldBlockShip.classList.add("fieldBlock");
        fieldBlockShip.dataset.index = j;
        fieldBlockShip.dataset.color = shipColor;
        fieldBlockShip.style.backgroundColor = shipColor;

        fieldBlockShip.addEventListener("mousedown", function (e) {
          const clickedSegmentIndex = fieldBlockShip.dataset.index;
          this.dataset.indexClicked = clickedSegmentIndex;
        });

        fieldBlockShip.addEventListener("mouseup", function (e) {
          this.removeAttribute("data-index-clicked");
        });

        fieldBlock.appendChild(fieldBlockShip);

        //check if ship is already on the field - if yes, it gets deleted inside the hangar
        const placementArea = document.querySelector(".fieldArea");
        const shipAlreadyOnField = placementArea.querySelectorAll(
          `[data-color="${shipColor}"]`,
        );
        if (shipAlreadyOnField.length > 0) {
          fieldBlockShip.remove();
        }
      }
    }
  }

  const resetBtn = document.getElementById("resetPlacementBtn");

  function handleResetClick() {
    resetPlacementProcess(player);
    resetBtn.removeEventListener("click", handleResetClick);
    confirmBtnPlacement.removeEventListener("click", handlePlacementClick);
  }

  resetBtn.addEventListener("click", handleResetClick);

  function resetPlacementProcess(player) {
    if (horizontalRotation === false) {
      const shipHangar = document.getElementById("shipHangarRotated");
      shipHangar.innerHTML = "";
      shipHangar.id = "shipHangar";
      horizontalRotation = true;
    }
    player.gameboard.clearPlaceBoard();
    placeShipsDialog(player, placementKindParameter, secondPlayerBol, twoPlayerModi);
  }

  const confirmBtnPlacement = document.getElementById("confirmPlacementBtn");

  function handlePlacementClick() {
    console.log(player);
    player.gameboard.saveOwnPlacementGameboard();

    setTimeout(() => {
      const mainArea = document.getElementById("mainArea");
      mainArea.classList.add("hidden");
      const bothFields = mainArea.querySelector(".bothFields");
      bothFields.classList.add("hidden");
      console.log(twoPlayerModi);
      if (secondPlayerDone === true || twoPlayerModi===false) {
        resetBtn.classList.add("hidden");
        confirmBtnPlacement.classList.add("hidden");
        secondPlayerDone = false;
        setTimeout(() => {
          dialogThatCallsFirstPlayer(playerNames, placementKindParameter, twoPlayerModi);
        }, 650);
      } else {
        placeShipsDialog(player2, placementKindParameter, secondPlayerBol, twoPlayerModi);
        secondPlayerDone = true;
      }

      confirmBtnPlacement.removeEventListener("click", handlePlacementClick);
    }, 650);
  }

  confirmBtnPlacement.addEventListener("click", handlePlacementClick);
}
