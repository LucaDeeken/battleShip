import { Gameboard } from "./gameBoard.js";
import { Ship } from "./ship.js";
import { Player } from "./player.js";
let startGameDialog = true;

export function startGame() {
  const mainArea = document.getElementById("mainArea");
  mainArea.classList.remove("hidden");
  const bothFields = mainArea.querySelector(".bothFields");
  bothFields.classList.remove("hidden");
  const name = "Luca";
  let player1 = new Player(name);
  player1.gameboard.buildFields();
  const savedFieldsPlaceArea = player1.gameboard.randomSpawn();
  const clonedFieldPlayerOne = savedFieldsPlaceArea.cloneNode(true);
  const clonedFieldPlayerOneRecolor = savedFieldsPlaceArea.cloneNode(true);

  let wholeFieldPlaceArea = document.querySelector(".fieldArea");
  let wholeFieldFireArea = document.querySelector(".fireArea");
  wholeFieldPlaceArea.innerHTML = "";
  wholeFieldFireArea.innerHTML = "";

  const nameTwo = "Lotta";
  let player2 = new Player(nameTwo);
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
    console.log("p22");
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
    console.log(player);
    const fieldBlockFire = fireFieldMarks.getElementsByClassName("fieldBlock");
    for (let i = 0; i < fieldBlockFire.length; i++) {
      fieldBlockFire[i].onclick = null;
      fieldBlockFire[i].onclick = () => {
        let dataIndex = fieldBlockFire[i].dataset.index;
        let objectClick = player.gameboard.findObjectFromGrid(dataIndex);
        player.gameboard.receiveAttack(objectClick, fireFieldMarks);
        
        playersTurnSwitch(player, player1, player2, clonedFieldPlayerOne, clonedFieldPlayerTwoRecolor, clonedFieldPlayerTwo, clonedFieldPlayerOneRecolor);
        // waits for two seconds to change playersTurn, so the markedField can be seen first
        
      };
    }
  }

  function refreshOwnBoard(player) {
    const ownBoard = document.querySelector(".fieldArea");
    player.gameboard.markHitShips(ownBoard);
  }

  function playersTurnSwitch(player, player1, player2, clonedFieldPlayerOne, clonedFieldPlayerTwoRecolor, clonedFieldPlayerTwo, clonedFieldPlayerOneRecolor) {
    const dialog = document.getElementById("playerTurns");
    dialog.showModal();
    dialog.classList.remove("hidden");
    dialog.classList.remove("opacity");
    const confirmBtn = document.querySelector("#confirmPlayerSwitch");
    
      confirmBtn.addEventListener("click", (e) => {
        e.preventDefault();
        dialog.classList.add("opacity"); // Start der opacity-Transition
        console.log("test2");
        dialog.close();
          setTimeout(() => {
            if (player.name === "Lotta") {
              playerTwoTurn(
                clonedFieldPlayerOne,
                player2,
                clonedFieldPlayerTwoRecolor
              );
            } else {
              playerOneTurn(
                clonedFieldPlayerTwo,
                player1,
                clonedFieldPlayerOneRecolor
              );
            }
            
          }, 2000);
        
        });
    
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
  const dialog = document.getElementById("givePlayerName");
  dialog.showModal();
  dialog.classList.remove("hidden");
  const confirmBtn = document.getElementById("confirmBtn");
  confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    dialog.classList.add("closing");
    dialog.classList.add("hidden");
    setTimeout(() => {
      dialog.close();
      dialogThatCallsFirstPlayer();
    }, 650); // 300ms = Dauer der Transition
  });
}




function dialogThatCallsFirstPlayer() {
  const dialog = document.getElementById("playerTurns");
  dialog.showModal();
  dialog.classList.remove("hidden");
  dialog.classList.remove("opacity");
  const confirmBtn = document.querySelector("#confirmPlayerSwitch"); // ID als String!

  function handleConfirmClick(e) {
  e.preventDefault();
  const dialog = document.getElementById("playerTurns");

  dialog.classList.add("opacity"); // Start der opacity-Transition
  dialog.classList.add("hidden");

  // EventListener entfernen
  confirmBtn.removeEventListener("click", handleConfirmClick);

  setTimeout(() => {
    dialog.close();
    startGame();
  }, 250); // 250ms = Dauer der Transition

}
confirmBtn.addEventListener("click", handleConfirmClick);

}

startDialog();
