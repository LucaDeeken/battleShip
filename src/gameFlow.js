import { Gameboard } from "./gameBoard.js";
import { Ship } from "./ship.js";
import { Player } from "./player.js";

const switchBtn = document.getElementById("switch");
const switchBtn2 = document.getElementById("switch2");

export function startGame() {
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

    let fieldBlock =
      clonedFieldPlayerOneRecolor.getElementsByClassName("fieldBlock");

    buildEventListenersplayers(player1, fieldBlock);


    

    let wholeFieldFireArea = document.querySelector(".fireArea");
    wholeFieldFireArea.replaceWith(clonedFieldPlayerTwo);

    fieldBlock = clonedFieldPlayerTwo.getElementsByClassName("fieldBlock");
    buildEventListenersplayers(player2, fieldBlock);
    //player1.gameboard.markHitShips();
    //player1.gameboard.hideShips();
  }

  function playerTwoTurn(
    clonedFieldPlayerOne,
    player2,
    clonedFieldPlayerTwoRecolor
  ) {
    clonedFieldPlayerTwoRecolor.classList.remove("fireArea");
    clonedFieldPlayerTwoRecolor.classList.add("fieldArea");
    clonedFieldPlayerOne.classList.remove("fieldArea");
    clonedFieldPlayerOne.classList.add("fireArea");
    let wholeFieldFireArea = document.querySelector(".fireArea");
    let wholeFieldPlaceArea = document.querySelector(".fieldArea");
    wholeFieldFireArea.replaceWith(clonedFieldPlayerOne);
    let fieldBlock =
    clonedFieldPlayerOne.getElementsByClassName("fieldBlock");
    buildEventListenersplayers(player1, fieldBlock);

    wholeFieldPlaceArea.replaceWith(clonedFieldPlayerTwoRecolor);
    fieldBlock =
    clonedFieldPlayerTwoRecolor.getElementsByClassName("fieldBlock");

    buildEventListenersplayers(player2, fieldBlock);
    
    //player2.gameboard.markHitShips();
    //player2.gameboard.hideShips();
  }


  switchBtn.addEventListener("click", () => {
    playerOneTurn(clonedFieldPlayerTwo, player1, clonedFieldPlayerOneRecolor);
  });

  switchBtn2.addEventListener("click", () => {
    playerTwoTurn(clonedFieldPlayerOne, player2, clonedFieldPlayerTwoRecolor);
  });

  function buildEventListenersplayers(player, fieldBlock) {

    for (let i = 0; i < fieldBlock.length; i++) {
      fieldBlock[i].addEventListener("click", () => {
        let dataIndex = fieldBlock[i].dataset.index;
        let objectClick = player.gameboard.findObjectFromGrid(dataIndex);
        player2.gameboard.receiveAttack(objectClick);
        console.log(objectClick);
        console.log("yo");
      });
    }
  }
}
startGame();
