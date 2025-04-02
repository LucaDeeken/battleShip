import { Gameboard } from "./gameBoard.js";
import { playerOne } from "./player.js";

export { buildFields };

//build field
function buildFields() {
  const fieldArea = document.querySelector(".fieldArea");
  const fireArea = document.querySelector(".fireArea");
  for (let i = 0; i < 100; i++) {
    const fieldBlock = document.createElement("div");
    fieldBlock.classList.add("fieldBlock");
    fieldBlock.dataset.index = i;
    fieldArea.appendChild(fieldBlock);

    fieldBlock.addEventListener("click", () => {
        findObjectFromGrid (fieldBlock);
    });
  }
  for (let j = 0; j < 100; j++) {
    const fieldBlock = document.createElement("div");
    fieldBlock.classList.add("fieldBlock");
    fieldBlock.dataset.index = j;
    fireArea.appendChild(fieldBlock);
  }
}

buildFields();

function findObjectFromGrid (fieldBlock) {
    const dataIndex = fieldBlock.dataset.index;
    let arrayField = 0;
    if (dataIndex.length < 2) {
      arrayField = playerOne.gameboard.placeBoard[0][dataIndex[0]];
    } else {
      arrayField = playerOne.gameboard.placeBoard[dataIndex[0]][dataIndex[1]];
    }
    console.log(arrayField);
    return arrayField;
}