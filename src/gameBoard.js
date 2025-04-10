import { Ship } from "./ship.js";

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
      verySmall: new Ship(2),
      massive: new Ship(5),
      small: new Ship(3),
      smallTwo: new Ship(3),
      medium: new Ship(4),
    };
    this.arrayOfShips = [];
    this.firstIter = true;
    this.secondIter = true;
  }

  receiveAttack(gridObject) {
    if (gridObject.ship != null && gridObject.hit === false) {
      gridObject.hit = true;
    }
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

  randomSpawn() {
    const movements = [-1, 1, 10, -10];
    let startingObject = 0;
    let spawnLocation = 0;
    this.arrayOfShips = [];
    let threeGridShipColorAlreadyThere = false;
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
          spawnLocation + randomCord
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
            spawnLocation + randomCord
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
        }
      };

      this.arrayOfShips = [];
      sailingShip();
      let color = "";
      switch (lengthOfShip) {
        case 2:
          color = "#FF00FF";
          break;
        case 3:
          if(threeGridShipColorAlreadyThere===true) {
            color = "#FF2E63";
          } else {
            color = "#FFD700";
            threeGridShipColorAlreadyThere = true;
          }
          break;
        case 4:
          color = "#39FF14";
          break;
        case 5:
          color = "#00CFFF";
          break;
      }
      this.printColorOnShipGrids(color);
    }
  }

  resetPlacementProcess() {
    this.arrayOfShips.forEach((item) => (item.ship = null));
    this.arrayOfShips = [];
    this.firstIter = true;
    this.secondIter = true;
  }

  printColorOnShipGrids(color) {
    let currentBackgroundColor = "rgb(255, 255, 255)";
    let element = "";

    for (let i = 0; i < this.placeBoard.length; i++) {
      let eleBackgroundColor = "";
      this.placeBoard[i].forEach((item) => {
        if (item.ship) {
          let firstNum = item.index[0];
          if (firstNum === "0") {
             element = document.querySelector(
              `[data-index="${item.index[1]}"]`
            );
            eleBackgroundColor =
              window.getComputedStyle(element).backgroundColor;             
            if (eleBackgroundColor === currentBackgroundColor) {
              element.style.backgroundColor = color;
            }
          } else {
             element = document.querySelector(
              `[data-index="${item.index}"]`
            );
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
}
