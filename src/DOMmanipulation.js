import { Gameboard } from "./gameBoard.js";
import { playerOne, findObjectFromGrid} from "./player.js";



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