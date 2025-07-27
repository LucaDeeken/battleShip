import { Ship } from "./ship.js";
import { player1, player2 } from "./gameFlow.js";
import { gameOverDialog } from "./DOMmanipulation.js";

export class Gameboard {
  constructor() {
    this.placeBoard = [];
    for (let i = 0; i < 10; i++) {
      let leftArray = [];
      for (let j = 0; j < 10; j++) {
        let cords = {
          coordinate: j,
          hit: false,
          ship: null,
          shipDetails: null,
          index: `${i}${j}`,
        };
        leftArray.push(cords);
      }
      this.placeBoard.push(leftArray);
    }
    this.fireBoard = [];
    for (let i = 0; i < 10; i++) {
      let leftArray = [];
      for (let j = 0; j < 10; j++) {
        let cords = {
          coordinate: j,
          hit: false,
          ship: null,
        };
        leftArray.push(cords);
      }
      this.fireBoard.push(leftArray);
    }
    this.ships = {
      verySmall: new Ship(2, "Destroyer", "#FF1493"),
      small: new Ship(3, "Cruiser", "#D75B3E"),
      smallTwo: new Ship(3, "Submarine", "#FFD700"),
      medium: new Ship(4, "Battleship", "#6B8E23"),
      massive: new Ship(5, "Carrier", "#00CFFF"),
    };
    this.arrayOfShips = [];
    this.firstIter = true;
    this.secondIter = true;
    this.threeGridShipUsed = false;
  }

  receiveAttack(gridObject, gameboard) {
    if (gridObject.hit === false) {
      gridObject.hit = true;
      console.log(gridObject);
      this.markHitShips(gameboard);
      if (gridObject.ship === true && gridObject.hit === true) {
        gridObject.shipDetails.hit();
        return true;
      }
    } else {
      return true;
    }
    return false;
  }

  findObjectFromGrid(dataIndex) {
    dataIndex = String(dataIndex);
    let objectGrid = 0;
    if (dataIndex.length < 2) {
      objectGrid = this.placeBoard[0][dataIndex[0]];
    } else {
      objectGrid = this.placeBoard[dataIndex[0]][dataIndex[1]];
    }
    return objectGrid;
  }

  buildFields() {
    const fieldArea = document.querySelector(".fieldArea");
    const fireArea = document.querySelector(".fireArea");
    console.log(fieldArea);
    console.log(fireArea);
    fieldArea.innerHTML = "";
    fireArea.innerHTML = "";

    for (let i = 0; i < 100; i++) {
      const fieldBlock = document.createElement("div");
      fieldBlock.classList.add("fieldBlock");
      fieldBlock.dataset.index = i;
      fieldArea.appendChild(fieldBlock);
      const dataIndex = fieldBlock.dataset.index;
      fieldBlock.addEventListener("click", () => {
        let objectClick = this.findObjectFromGrid(dataIndex);
        this.receiveAttack(objectClick);
        console.log(objectClick);
      });
    }
    for (let j = 0; j < 100; j++) {
      const fieldBlock = document.createElement("div");
      fieldBlock.classList.add("fieldBlock");
      fieldBlock.dataset.index = j;
      fireArea.appendChild(fieldBlock);
      const dataIndex = fieldBlock.dataset.index;
      fireArea.addEventListener("click", () => {
        this.findObjectFromGrid(dataIndex);
      });
    }
  }

  ownPlacementPhase() {
    const fieldArea = document.querySelector(".fieldArea");
    for (let i = 0; i < 100; i++) {
      const fieldBlock = document.createElement("div");
      fieldBlock.classList.add("fieldBlock");
      fieldBlock.dataset.index = i;
      fieldArea.appendChild(fieldBlock);
      const dataIndex = fieldBlock.dataset.index;
      fieldBlock.addEventListener("click", () => {
        let objectClick = this.findObjectFromGrid(dataIndex);
        console.log(objectClick);
      });
    }
  }

  randomSpawn() {
    const movements = [-1, 1, 10, -10];
    let startingObject = 0;
    let spawnLocation = 0;
    this.arrayOfShips = [];
    for (let key in this.ships) {
      const lengthOfShip = this.ships[key].length;
      this.firstIter = true;
      this.secondIter = true;
      let left = false;
      let up = false;
      let down = false;
      let right = false;
      const sailingShip = () => {
        if (this.firstIter === true) {
          spawnLocation = Math.floor(Math.random() * 100);
          startingObject = this.findObjectFromGrid(spawnLocation);
          this.arrayOfShips.push(startingObject);
          if (startingObject.ship === true) {
            this.arrayOfShips = [];
            return sailingShip();
          }
          startingObject.ship = true;
          startingObject.shipDetails = this.ships[key];
          this.firstIter = false;
          left = false;
          up = false;
          down = false;
          right = false;
        }
        let randomCord =
          movements[Math.floor(Math.random() * movements.length)];
        if (randomCord + spawnLocation < 0 || randomCord + spawnLocation > 99) {
          this.resetPlacementProcess();
          return sailingShip();
        }
        let testIfPlaceIsAlreadTaken = this.findObjectFromGrid(
          spawnLocation + randomCord,
        );
        if (testIfPlaceIsAlreadTaken.ship === true) {
          this.resetPlacementProcess();
          return sailingShip();
        }

        if (this.secondIter === true) {
          switch (randomCord) {
            case -1:
              left = true;
              break;
            case 1:
              right = true;
              break;
            case 10:
              down = true;
              break;
            case -10:
              up = true;
              break;
          }

          let numToString = String(spawnLocation);
          if (numToString.length < 2) {
            numToString = "0" + numToString;
          }
          if (
            (left === true && numToString[1] === "0") ||
            (right === true && numToString[1] === "9")
          ) {
            this.resetPlacementProcess();
            return sailingShip();
          }
          spawnLocation = randomCord + spawnLocation;
          startingObject = this.findObjectFromGrid(spawnLocation);
          this.arrayOfShips.push(startingObject);
          startingObject.ship = true;
          startingObject.shipDetails = this.ships[key];
        }
        for (let i = 0; i < lengthOfShip - 2; i++) {
          startingObject = 0;
          let numToString = String(spawnLocation);
          if (numToString.length < 2) {
            numToString = "0" + numToString;
          }

          if (
            (left === true && numToString[1] === "0") ||
            (right === true && numToString[1] === "9")
          ) {
            this.resetPlacementProcess();
            return sailingShip();
          }

          if (
            randomCord + spawnLocation < 0 ||
            randomCord + spawnLocation > 99
          ) {
            this.resetPlacementProcess();
            return sailingShip();
          }
          testIfPlaceIsAlreadTaken = this.findObjectFromGrid(
            spawnLocation + randomCord,
          );
          if (testIfPlaceIsAlreadTaken.ship === true) {
            this.resetPlacementProcess();
            return sailingShip();
          }
          if (left === true) {
            spawnLocation = spawnLocation - 1;
          } else if (right === true) {
            spawnLocation = spawnLocation + 1;
          } else if (down === true) {
            spawnLocation = spawnLocation + 10;
          } else if (up === true) {
            spawnLocation = spawnLocation - 10;
          }
          startingObject = this.findObjectFromGrid(spawnLocation);
          this.arrayOfShips.push(startingObject);
          startingObject.ship = true;
          startingObject.shipDetails = this.ships[key];
        }
      };

      this.arrayOfShips = [];
      sailingShip();
      this.printColorOnShipGrids(this.ships[key].shipColor);
    }
    let savedField = document.querySelector(".fieldArea");
    return savedField;
  }

  getOwnPlacementsIntoStartingGame() {
    for (let key in this.ships) {
      let color = this.ships[key].shipColor;
      console.log(color);
      this.printColorOnShipGrids(color);
     }
    let savedField = document.querySelector(".fieldArea");
    return savedField;
  }
  resetPlacementProcess() {
    this.arrayOfShips.forEach(
      (item) => ((item.ship = null), (item.shipDetails = null)),
    );
    this.arrayOfShips = [];
    this.firstIter = true;
    this.secondIter = true;
  }

  getShipColor(lengthOfShip) {
    let color = "";
    switch (lengthOfShip) {
      case 2:
        color = "#FF1493";
        break;
      case 3:
        if (this.threeGridShipColorAlreadyThere === true) {
          color = "#D75B3E";
        } else {
          color = "#FFD700";
          this.threeGridShipColorAlreadyThere = true;
        }
        break;
      case 4:
        color = "#6B8E23";
        break;
      case 5:
        color = "#00CFFF";
        break;
    }
    return color;
  }

  saveOwnPlacementGameboard() {
    const placementField = document.querySelector(".fieldArea");
    const fieldBlocks = placementField.querySelectorAll(".fieldBlock");
    for (let i = 0; fieldBlocks.length > i; i++) {
      if (fieldBlocks[i].dataset.shipIsHere === "true") {
        const dataIndex = fieldBlocks[i].dataset.index;
        const objectGrid = this.findObjectFromGrid(dataIndex);
        objectGrid.ship = true;
        const dataColor = fieldBlocks[i].dataset.color;
        objectGrid.shipDetails = this.getShipNameByColor(dataColor);
      }
    }
  }
  getShipNameByColor(color) {
    for (const key in this.ships) {
      if (this.ships[key].shipColor === color) {
        return this.ships[key];
      }
    }
    return null; // Falls keine Übereinstimmung gefunden wird
  }

  clearPlaceBoard() {
     const placementField = document.querySelector(".fieldArea");
    const fieldBlocks = placementField.querySelectorAll(".fieldBlock");
    for (let i = 0; fieldBlocks.length > i; i++) {
        const dataIndex = fieldBlocks[i].dataset.index;
        const objectGrid = this.findObjectFromGrid(dataIndex);
        objectGrid.ship = null;
        objectGrid.shipDetails = null;

    }
  }

   printColorOnShipGrids(color) {
    let currentBackgroundColor = "rgb(40, 93, 172)";
    let element = "";

    for (let i = 0; i < this.placeBoard.length; i++) {
      let eleBackgroundColor = "";
      this.placeBoard[i].forEach((item) => {
        if (item.ship && item.hit === false && item.shipDetails.shipColor === color) {
          let firstNum = item.index[0];
          if (firstNum === "0") {
            element = document.querySelector(`[data-index="${item.index[1]}"]`);
            eleBackgroundColor =
              window.getComputedStyle(element).backgroundColor;
            if (eleBackgroundColor === currentBackgroundColor) {
              element.style.backgroundColor = color;
            }
          } else {
            element = document.querySelector(`[data-index="${item.index}"]`);
            eleBackgroundColor =
              window.getComputedStyle(element).backgroundColor;
            if (eleBackgroundColor === currentBackgroundColor) {
              element.style.backgroundColor = color;
            }
          }
        }
      });
    }
  }

  hideShips() {
    const savedField = document.querySelector(".fireArea");
    const fireGrids = savedField.getElementsByClassName("fieldBlock");
    for (let i = 0; i < fireGrids.length; i++) {
      fireGrids[i].style.backgroundColor = "rgb(40, 93, 172)";
    }
  }

  markHitShips(gameBoard) {
    let element = "";
    for (let i = 0; i < this.placeBoard.length; i++) {
      this.placeBoard[i].forEach((item) => {
        if (item.ship && item.hit === true) {
          console.log(this.placeBoard[i]);
          let firstNum = item.index[0];
          if (firstNum === "0") {
            element = gameBoard.querySelector(
              `[data-index="${item.index[1]}"]`,
            );
            element.textContent = "💥";
            element.classList.add("hitEmoji");
          } else {
            element = gameBoard.querySelector(`[data-index="${item.index}"]`);
            element.textContent = "💥";
            element.classList.add("hitEmoji");
          }
        }
        if (item.ship === null && item.hit === true) {
          let firstNum = item.index[0];
          if (firstNum === "0") {
            element = gameBoard.querySelector(
              `[data-index="${item.index[1]}"]`,
            );
            element.textContent = "🌊";
            element.classList.add("waterEmoji");
          } else {
            element = gameBoard.querySelector(`[data-index="${item.index}"]`);
            element.classList.add("waterEmoji");
            element.textContent = "🌊";
          }
        }
      });
    }
  }

  shipSunk() {
    const shipList = Object.values(this.ships);
    for (let item of shipList) {
      if (item.sunk === true && item.onSunkList === false) {
        console.log(item.shipName + "just Sunk!");
        item.onSunkList = true;
        return item.shipName;
      }
    }
    return false;
  }

  allShipsSunk(player) {
    let shipStillThere = false;
    for (let i = 0; i < this.placeBoard.length; i++) {
      this.placeBoard[i].forEach((item) => {
        if (item.ship && item.hit === false) {
          shipStillThere = true;
        }
      });
    }
    if (shipStillThere === false) {
      if (player.name === player1.name) {
        gameOverDialog(player2);
      } else {
        gameOverDialog(player1);
      }
    } else {
      //ships are still there!
    }
  }
}
