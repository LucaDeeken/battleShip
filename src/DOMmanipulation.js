import { Gameboard } from "./gameBoard.js";
import { playerOne, findObjectFromGrid} from "./player.js";
import {dialogThatCallsFirstPlayer, playerNames, player1, placeShips, createPlayers} from "./gameFlow.js";

export function inputName() {
  const dialog = document.getElementById("givePlayerName");
  dialog.showModal();
  dialog.classList.remove("hidden");
  const confirmBtn = document.getElementById("confirmBtn");
  confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    createPlayers(playerNames);
    dialog.classList.add("closing");
    dialog.classList.add("hidden");
    setTimeout(() => {
      dialog.close();
      //dialogThatCallsFirstPlayer(playerNames);
      chosePlaceModeDialog(player1);
    }, 650); // 300ms = Dauer der Transition
  });
  return { playerNames };
}

export function showDialogShipSunk(shipSunkName, player) {
    const dialog = document.getElementById("ShipSunkDialog");
    dialog.showModal();
    dialog.classList.remove("hidden");
    dialog.classList.remove("closing");
    const confirmBtn = document.getElementById("confirmBtnShip");
    const shipSunkHeader = document.getElementById("shipSunkHeader");
    shipSunkHeader.textContent = "The" +" "+ shipSunkName + " "+"just sunk!";
    console.log(player);
    confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    dialog.classList.add("closing");
    dialog.classList.add("hidden");
    setTimeout(() => {
      dialog.close();
      player.gameboard.allShipsSunk(player);
    }, 650); // 300ms = Dauer der Transition
  });
}

export function gameOverDialog(player) {
  const dialog = document.getElementById("WinnersDialog");
  dialog.showModal();
  dialog.classList.remove("hidden");
  dialog.classList.remove("closing");
  const confirmBtn = document.getElementById("confirmBtnWin");
  const headerWinner = document.getElementById("headerWinnersDialog");
  headerWinner.textContent = player.name + " "+"won the game!"

    confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    dialog.classList.add("closing");
    dialog.classList.add("hidden");
    setTimeout(() => {
      dialog.close();
      location.reload();
    }, 650); // 300ms = Dauer der Transition
  });
}

export function chosePlaceModeDialog(player1) {
  const dialog = document.getElementById("chosePlaceMode");
  dialog.showModal(); // Öffnet den Dialog
  dialog.classList.remove("hidden");

  const ownPlacement = document.getElementById("choseOwnPlacement");
  ownPlacement.addEventListener("click", () => {
    dialog.classList.add("closing");
    dialog.classList.add("hidden");
    setTimeout(() => {
      dialog.close();
      placeShipsDialog(player1);
    }, 650); // 300ms = Dauer der Transition
  });

  const randomPlacement = document.getElementById("choseRandomPlacement");
  randomPlacement.addEventListener("click", () => {
    dialog.classList.add("closing");
    dialog.classList.add("hidden");
    setTimeout(() => {
      dialog.close();
      dialogThatCallsFirstPlayer(playerNames);
    }, 650); // 300ms = Dauer der Transition
  });
}

export function placeShipsDialog(player1) {

  const mainArea = document.getElementById("mainArea");
  mainArea.classList.remove("hidden");
  const bothFields = mainArea.querySelector(".bothFields");
  bothFields.classList.remove("hidden");
  const fieldArea = document.querySelector(".fieldArea");
  const fireArea = document.querySelector(".fireArea");
  fieldArea.innerHTML = "";
  fireArea.classList.remove("fireArea");
  fireArea.classList.add("fireAreaHangar");
  const shipHangar = document.getElementById("shipHangar");
  shipHangar.classList.remove("hidden");
  console.log(player1);


    for (const key in player1.gameboard.ships) {

      const shipInHangarContainer = document.createElement("div");
      const fieldBlockHeader = document.createElement("h2");
      const fieldBlock = document.createElement("div");
      fieldBlockHeader.classList.add("fieldBlockHeader");
      fieldBlock.classList.add("shipInHangarContainer");

      shipHangar.appendChild(shipInHangarContainer);
      shipInHangarContainer.appendChild(fieldBlockHeader);
      shipInHangarContainer.appendChild(fieldBlock);

      fieldBlockHeader.textContent = player1.gameboard.ships[key].shipName;
      const shipLength = player1.gameboard.ships[key].length;
      const shipColor = player1.gameboard.ships[key].shipColor;
  
      
    for(let j=0; j< shipLength; j++) {
      console.log(j);
       const fieldBlockShip = document.createElement("div");
       fieldBlockShip.classList.add("fieldBlock");
       fieldBlockShip.style.backgroundColor = shipColor;
       fieldBlock.appendChild(fieldBlockShip);

       //Drag and Drop Effect

       
    }


  };

  placeShips(player1);

//     confirmBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     dialog.classList.add("closing");
//     dialog.classList.add("hidden");
//     setTimeout(() => {
//       dialog.close();
//     }, 650); // 300ms = Dauer der Transition
//   });
 }
