import { Gameboard } from "./gameBoard.js";
import { playerOne, findObjectFromGrid} from "./player.js";



export function showDialogShipSunk(shipSunkName) {
    const dialog = document.getElementById("ShipSunkDialog");
    dialog.showModal();
    dialog.classList.remove("hidden");
    const confirmBtn = document.getElementById("confirmBtn");
    const shipSunkHeader = document.getElementById("shipSunkHeader");
    shipSunkHeader.textContent = "The" +" "+ shipSunkName + " "+"just sunk!";

    confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    dialog.classList.add("closing");
    dialog.classList.add("hidden");
    setTimeout(() => {
      dialog.close();
    }, 650); // 300ms = Dauer der Transition
  });
}