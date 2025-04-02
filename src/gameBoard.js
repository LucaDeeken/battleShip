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
    };
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
    console.log(objectGrid);
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
        this.findObjectFromGrid(dataIndex);
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
    console.log(this.ships);
    let startingObject = 0;
    let spawnLocation = 0;
    for (let key in this.ships) {
      const lengthOfShip = this.ships[key].length;

      let firstIter = true;
      let secondIter = true;
      let left = false;
      let up = false;
      let down = false;
      let right = false;
      const sailingShip = () => {
        if (firstIter === true) {
          spawnLocation = Math.floor(Math.random() * 100);
          console.log(spawnLocation);
          startingObject = this.findObjectFromGrid(spawnLocation);
          startingObject.ship = true;
          firstIter = false;
           left = false;
           up = false;
           down = false;
          right = false;
        }
        let randomCord =
          movements[Math.floor(Math.random() * movements.length)];
        if (randomCord + spawnLocation < 0 || randomCord + spawnLocation > 99) {
          firstIter = true;
          secondIter = true;
          return sailingShip();
        }

        if (secondIter === true) {
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
          spawnLocation = randomCord + spawnLocation;
          startingObject = this.findObjectFromGrid(spawnLocation);
          startingObject.ship = true;
        }
        for (let i = 0; i < lengthOfShip - 2; i++) {
          if (randomCord + spawnLocation < 0 || randomCord + spawnLocation > 99) {
            firstIter = true;
            secondIter = true;
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
          startingObject.ship = true;
        }
      }
      sailingShip();
    }

    // }
  }
}

// for (let i = 0; i < lengthOfShip; i++) {
//   let randomCord =
//     movements[Math.floor(Math.random() * movements.length)];
//   console.log(randomCord);
//   while (
//     spawnLocation + randomCord > 0 &&
//     spawnLocation + randomCord < 99
//   ) {
//     spawnLocation = spawnLocation + randomCord;
//      startingObject = this.findObjectFromGrid(spawnLocation);
//     startingObject.ship = true;
//   }
// }

// while((randomCord + spawnLocation)<0||(randomCord+spawnLocation)>99) {
//   randomCord = movements[Math.floor(Math.random() * movements.length)];
// }
// switch (randomCord) {
//   case -1:
//     left = true;
//   case 1:
//     right = true;
//   case 10:
//     down = true;
//   case -10:
//     up = true;
// }
// spawnLocation = randomCord + spawnLocation;
// startingObject = this.findObjectFromGrid(spawnLocation);
// startingObject.ship = true;
// for (let i = 0; i < lengthOfShip - 2; i++) {
//   if (left === true) {
//     spawnLocation = spawnLocation - 1;
//   } else if (right === true) {
//     spawnLocation = spawnLocation + 1;
//   } else if (down === true) {
//     spawnLocation = spawnLocation + 10;
//   } else if (up === true) {
//     spawnLocation = spawnLocation - 10;
//   }
//   startingObject = this.findObjectFromGrid(spawnLocation);
//   startingObject.ship = true;
// }
// }
