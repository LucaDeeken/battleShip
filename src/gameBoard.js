import { Ship } from "./ship.js";
import {
  player1,
  player2,
  playSoundWaterSplash,
  playSoundHit,
  playSoundDestroyed,
  playSoundFirstHit,
  playSoundOneLeftHit,
} from "./gameFlow.js";
import { gameOverDialog, showDialogShipSunk } from "./DOMmanipulation.js";

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
    this.left = false;
    this.right = false;
    this.up = false;
    ((this.down = false), (this.firstIter = true));
    this.secondIter = true;
    this.threeGridShipUsed = false;
    this.botHitFields = [];
    for (let i = 0; i < 100; i++) {
      this.botHitFields.push(i);
    }
    this.botHitShips = [];
    this.botKilledAShip = false;
    this.movements = [-1, 1, 10, -10];
    this.movementsBot = [-1, 1, 10, -10];
    this.botRightHittingDirectionValue = 0;
    this.botRightHittingDirectionName = "unknown";
    this.botEndingsAreWater = false;
    this.botHardModeFields = false;
    this.bothEndsAreWater = false;
    this.shipSunkButOthersStillHit = false;
    this.firstHit = true;
    this.shipSunkCounter = 0;
  }

  //manages the attackMechanism
  receiveAttack(gridObject, gameboard) {
    if (gridObject.hit === false) {
      gridObject.hit = true;
      this.markHitShips(gameboard);
      if (gridObject.ship === true && gridObject.hit === true) {
        gridObject.shipDetails.hit();
        return true;
      }
    } else {
      return false;
    }
    return false;
  }

  //finds the clicked gamefield Div in the gameboardObject
  findObjectFromGrid(dataIndex) {
    if (dataIndex > 99 || dataIndex < 0) {
      return false;
    } else {
      dataIndex = String(dataIndex);
      let objectGrid = 0;
      if (dataIndex.length < 2) {
        objectGrid = this.placeBoard[0][dataIndex[0]];
      } else {
        objectGrid = this.placeBoard[dataIndex[0]][dataIndex[1]];
      }
      return objectGrid;
    }
  }

  //builds the gameboard on the frontend.
  buildFields() {
    const fieldArea = document.querySelector(".fieldArea");
    const fireArea = document.querySelector(".fireArea");
    fieldArea.innerHTML = "";
    fireArea.innerHTML = "";

    for (let i = 0; i < 100; i++) {
      const fieldBlock = document.createElement("div");
      fieldBlock.classList.add("fieldBlock");
      fieldBlock.dataset.index = i;
      fieldArea.appendChild(fieldBlock);
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

  //builds the gameboard on the frontend for the ownPlacementMode
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
      });
    }
  }

  //spawns the shops randomly
  randomSpawn() {
    let startingObject = 0;
    let spawnLocation = 0;
    this.arrayOfShips = [];
    for (let key in this.ships) {
      const lengthOfShip = this.ships[key].length;
      this.firstIter = true;
      this.secondIter = true;
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
          this.left = false;
          this.up = false;
          this.down = false;
          this.right = false;
        }
        let randomCord =
          this.movements[Math.floor(Math.random() * this.movements.length)];
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
              this.left = true;
              break;
            case 1:
              this.right = true;
              break;
            case 10:
              this.down = true;
              break;
            case -10:
              this.up = true;
              break;
          }

          let numToString = String(spawnLocation);
          if (numToString.length < 2) {
            numToString = "0" + numToString;
          }
          if (
            (this.left === true && numToString[1] === "0") ||
            (this.right === true && numToString[1] === "9")
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
            (this.left === true && numToString[1] === "0") ||
            (this.right === true && numToString[1] === "9")
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
          if (this.left === true) {
            spawnLocation = spawnLocation - 1;
          } else if (this.right === true) {
            spawnLocation = spawnLocation + 1;
          } else if (this.down === true) {
            spawnLocation = spawnLocation + 10;
          } else if (this.up === true) {
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

  //logic for the easy bot
  async botTurnEasy(enemy) {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const randomIndex = Math.floor(Math.random() * this.botHitFields.length);
    let hitField = this.botHitFields[randomIndex];
    let hitGridObject = this.findObjectFromGrid(hitField);
    const ownFieldGrids = document.querySelector(".fieldArea");
    let attack = this.receiveAttack(hitGridObject, ownFieldGrids);
    this.botHitFields.splice(randomIndex, 1);

    const shipSunk = player1.gameboard.shipSunk();
    if (shipSunk !== false) {
      playSoundDestroyed();
      showDialogShipSunk(shipSunk.shipName, player1, shipSunk.shipColor);

      this.shipSunkCounter = this.shipSunkCounter + 1;
      if (this.shipSunkCounter === 4) {
        playSoundOneLeftHit(enemy);
      }
    }

    if (attack === true) {
      playSoundHit(enemy);

      if (this.firstHit) {
        setTimeout(() => {
          playSoundFirstHit(enemy);
          this.firstHit = false;
        }, 2000);
      }
      return this.botTurnEasy(enemy);
    } else {
      playSoundWaterSplash();
      return;
    }
  }

  //logic for the medium bot
  async botTurnMedium(enemy) {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (this.botHitShips.length < 1) {
      const randomIndex = Math.floor(Math.random() * this.botHitFields.length);

      // Zufälliges Element aus dem Array
      let hitField = this.botHitFields[randomIndex];
      let hitGridObject = this.findObjectFromGrid(hitField);
      const ownFieldGrids = document.querySelector(".fieldArea");
      let attack = this.receiveAttack(hitGridObject, ownFieldGrids);
      this.botHitFields.splice(randomIndex, 1);

      if (attack === true) {
        playSoundHit();
        if (this.firstHit) {
          setTimeout(() => {
            playSoundFirstHit(enemy);
            this.firstHit = false;
          }, 2000);
        }
        this.botHitShips.push(hitField);
        return this.botTurnMedium(enemy);
      } else {
        playSoundWaterSplash();
        return;
      }
    } else {
      let lastHitField = 0;
      if (this.shipSunkButOthersStillHit) {
        lastHitField = this.botHitShips[0];
        this.shipSunkButOthersStillHit = false;
      } else {
        lastHitField = this.botHitShips[this.botHitShips.length - 1];
      }

      if (this.movementsBot.length < 1) {
        lastHitField = this.botHitShips[0];
        this.movementsBot = [-1, 1, 10, -10];
      }

      if (this.bothEndsAreWater === true) {
        lastHitField = this.botHitShips[0];
      }

      let cordNextToHit = 0;
      if (this.botRightHittingDirectionValue !== 0) {
        cordNextToHit = this.botRightHittingDirectionValue;
        let nextFieldInLine = this.findObjectFromGrid(
          cordNextToHit + lastHitField,
        );

        let numToString = String(lastHitField);
        if (numToString.length < 2) {
          numToString = "0" + numToString;
        }

        if (
          nextFieldInLine === false ||
          nextFieldInLine.hit === true ||
          (this.left === true && numToString[1] === "0") ||
          (this.right === true && numToString[1] === "9")
        ) {
          lastHitField = this.botHitShips[0];
          if (this.botEndingsAreWater === false) {
            switch (this.botRightHittingDirectionName) {
              case "Left":
                cordNextToHit = 1;
                break;
              case "Right":
                cordNextToHit = -1;
                break;
              case "Down":
                cordNextToHit = -10;
                break;
              case "Up":
                cordNextToHit = 10;
                break;
            }
            this.botEndingsAreWater = true;
          } else {
            this.botRightHittingDirectionValue = 0;
            this.botRightHittingDirectionName = "unknown";
            this.movementsBot = [-1, 1, 10, -10];
            this.left = false;
            this.up = false;
            this.down = false;
            this.right = false;
            this.bothEndsAreWater = true;
          }
        }
      } else {
        cordNextToHit =
          this.movementsBot[
            Math.floor(Math.random() * this.movementsBot.length)
          ];

        switch (cordNextToHit) {
          case -1:
            this.left = true;
            break;
          case 1:
            this.right = true;
            break;
          case 10:
            this.down = true;
            break;
          case -10:
            this.up = true;
            break;
        }

        let numToString = String(lastHitField);
        if (numToString.length < 2) {
          numToString = "0" + numToString;
        }

        if (
          (this.left === true && numToString[1] === "0") ||
          (this.right === true && numToString[1] === "9")
        ) {
          const index = this.movementsBot.indexOf(cordNextToHit);
          this.movementsBot.splice(index, 1);
          this.left = false;
          this.right = false;
          this.up = false;
          this.down = false;
          return this.botTurnMedium(enemy);
        }

        if (
          cordNextToHit + lastHitField < 0 ||
          cordNextToHit + lastHitField > 99
        ) {
          const index = this.movementsBot.indexOf(cordNextToHit);
          this.movementsBot.splice(index, 1);
          this.left = false;
          this.right = false;
          this.up = false;
          this.down = false;
          return this.botTurnMedium(enemy);
        }
      }

      let hitGridObject = this.findObjectFromGrid(cordNextToHit + lastHitField);
      let gridAlreadyHit = hitGridObject.hit;
      const ownFieldGrids = document.querySelector(".fieldArea");
      let attack = this.receiveAttack(hitGridObject, ownFieldGrids);
      if (gridAlreadyHit === true) {
        const index = this.movementsBot.indexOf(cordNextToHit);
        this.movementsBot.splice(index, 1);
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        return this.botTurnMedium(enemy);
      }
      const indexOfGrid = Number(hitGridObject.index);
      const indexOfField = this.botHitFields.indexOf(indexOfGrid);
      if (indexOfField === -1) {
        //skip, because this may happen in hard mode - not all indexes are available inside the array.
      } else {
        this.botHitFields.splice(indexOfField, 1);
      }
      const shipSunk = player1.gameboard.shipSunk();
      if (shipSunk !== false) {
        playSoundDestroyed();
        showDialogShipSunk(shipSunk.shipName, player1, shipSunk.shipColor);

        this.shipSunkCounter = this.shipSunkCounter + 1;
        if (this.shipSunkCounter === 4) {
          playSoundOneLeftHit(enemy);
        }
      }

      if (attack === true && shipSunk !== false) {
        this.botEndingsAreWater = false;
        this.botHitShips.push(cordNextToHit + lastHitField);
        let lengthOfSunkShip = shipSunk.length;
        this.shipSunk();
        if (lengthOfSunkShip === this.botHitShips.length) {
          this.botHitShips = [];
          this.botRightHittingDirectionValue = 0;
          this.botRightHittingDirectionName = "unknown";
          this.movementsBot = [-1, 1, 10, -10];
          this.left = false;
          this.up = false;
          this.down = false;
          this.right = false;
          let botWonTheGame = this.allShipsSunk(player1);
          if (botWonTheGame === true) {
            return;
          } else {
            return this.botTurnMedium(enemy);
          }
        } else {
          let nameOfSunkShip = shipSunk.shipName;

          for (let i = 0; i < this.placeBoard.length; i++) {
            this.placeBoard[i].forEach((item) => {
              if (item.shipDetails?.shipName === nameOfSunkShip) {
                const indexOfShipInArr = this.botHitShips.indexOf(
                  Number(item.index),
                );
                this.botHitShips.splice(indexOfShipInArr, 1);
              }
            });
          }
          this.shipSunkButOthersStillHit = true;
          this.botRightHittingDirectionValue = 0;
          this.botRightHittingDirectionName = "unknown";
          this.movementsBot = [-1, 1, 10, -10];
          this.left = false;
          this.up = false;
          this.down = false;
          this.right = false;
          return this.botTurnMedium(enemy);
          //wenn andere getroffen wurden
        }
      } else if (attack === true) {
        if (this.bothEndsAreWater === true) {
          this.bothEndsAreWater = false;
        }
        playSoundHit();
        this.botHitShips.push(cordNextToHit + lastHitField);
        this.botRightHittingDirectionValue = cordNextToHit;

        switch (this.botRightHittingDirectionValue) {
          case -1:
            this.botRightHittingDirectionName = "Left";
            break;
          case 1:
            this.botRightHittingDirectionName = "Right";
            break;
          case 10:
            this.botRightHittingDirectionName = "Down";
            break;
          case -10:
            this.botRightHittingDirectionName = "Up";
            break;
        }

        return this.botTurnMedium(enemy);
      } else {
        const indexOfDirection = this.movementsBot.indexOf(cordNextToHit);
        this.movementsBot.splice(indexOfDirection, 1);
        playSoundWaterSplash();
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        return;
      }
    }
  }

  //logic for the hard bot
  async botTurnHard(enemy) {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (this.botHardModeFields === false) {
      this.botTurnHardHitFields();
      this.botHardModeFields = true;
    }
    if (this.botHitShips.length < 1) {
      const randomIndex = Math.floor(Math.random() * this.botHitFields.length);

      // Zufälliges Element aus dem Array
      let hitField = this.botHitFields[randomIndex];
      let hitGridObject = this.findObjectFromGrid(hitField);
      const ownFieldGrids = document.querySelector(".fieldArea");
      let attack = this.receiveAttack(hitGridObject, ownFieldGrids);
      this.botHitFields.splice(randomIndex, 1);

      if (attack === true) {
        playSoundHit();
        if (this.firstHit) {
          setTimeout(() => {
            playSoundFirstHit(enemy);
            this.firstHit = false;
          }, 2000);
        }
        this.botHitShips.push(hitField);
        return this.botTurnHard(enemy);
      } else {
        playSoundWaterSplash();
        return;
      }
    } else {
      let lastHitField = 0;
      if (this.shipSunkButOthersStillHit) {
        lastHitField = this.botHitShips[0];
        this.shipSunkButOthersStillHit = false;
      } else {
        lastHitField = this.botHitShips[this.botHitShips.length - 1];
      }

      if (this.movementsBot.length < 1) {
        lastHitField = this.botHitShips[0];
        this.movementsBot = [-1, 1, 10, -10];
      }

      if (this.bothEndsAreWater === true) {
        lastHitField = this.botHitShips[0];
      }

      let cordNextToHit = 0;
      if (this.botRightHittingDirectionValue !== 0) {
        cordNextToHit = this.botRightHittingDirectionValue;
        let nextFieldInLine = this.findObjectFromGrid(
          cordNextToHit + lastHitField,
        );

        let numToString = String(lastHitField);
        if (numToString.length < 2) {
          numToString = "0" + numToString;
        }

        if (
          nextFieldInLine === false ||
          nextFieldInLine.hit === true ||
          (this.left === true && numToString[1] === "0") ||
          (this.right === true && numToString[1] === "9")
        ) {
          lastHitField = this.botHitShips[0];
          if (this.botEndingsAreWater === false) {
            switch (this.botRightHittingDirectionName) {
              case "Left":
                cordNextToHit = 1;
                break;
              case "Right":
                cordNextToHit = -1;
                break;
              case "Down":
                cordNextToHit = -10;
                break;
              case "Up":
                cordNextToHit = 10;
                break;
            }
            this.botEndingsAreWater = true;
          } else {
            this.botRightHittingDirectionValue = 0;
            this.botRightHittingDirectionName = "unknown";
            this.movementsBot = [-1, 1, 10, -10];
            this.left = false;
            this.up = false;
            this.down = false;
            this.right = false;
            this.bothEndsAreWater = true;
          }
        }
      } else {
        cordNextToHit =
          this.movementsBot[
            Math.floor(Math.random() * this.movementsBot.length)
          ];

        switch (cordNextToHit) {
          case -1:
            this.left = true;
            break;
          case 1:
            this.right = true;
            break;
          case 10:
            this.down = true;
            break;
          case -10:
            this.up = true;
            break;
        }

        let numToString = String(lastHitField);
        if (numToString.length < 2) {
          numToString = "0" + numToString;
        }

        if (
          (this.left === true && numToString[1] === "0") ||
          (this.right === true && numToString[1] === "9")
        ) {
          const index = this.movementsBot.indexOf(cordNextToHit);
          this.movementsBot.splice(index, 1);
          this.left = false;
          this.right = false;
          this.up = false;
          this.down = false;
          return this.botTurnHard(enemy);
        }

        if (
          cordNextToHit + lastHitField < 0 ||
          cordNextToHit + lastHitField > 99
        ) {
          const index = this.movementsBot.indexOf(cordNextToHit);
          this.movementsBot.splice(index, 1);
          this.left = false;
          this.right = false;
          this.up = false;
          this.down = false;
          return this.botTurnHard(enemy);
        }
      }
      let hitGridObject = this.findObjectFromGrid(cordNextToHit + lastHitField);
      let gridAlreadyHit = hitGridObject.hit;
      const ownFieldGrids = document.querySelector(".fieldArea");
      let attack = this.receiveAttack(hitGridObject, ownFieldGrids);
      if (gridAlreadyHit === true) {
        const index = this.movementsBot.indexOf(cordNextToHit);
        this.movementsBot.splice(index, 1);
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        return this.botTurnHard(enemy);
      }
      const indexOfGrid = Number(hitGridObject.index);
      const indexOfField = this.botHitFields.indexOf(indexOfGrid);
      if (indexOfField === -1) {
        //skip, because this may happen in hard mode - not all indexes are available inside the array.
      } else {
        this.botHitFields.splice(indexOfField, 1);
      }
      const shipSunk = player1.gameboard.shipSunk();
      if (shipSunk !== false) {
        playSoundDestroyed();
        showDialogShipSunk(shipSunk.shipName, player1, shipSunk.shipColor);

        this.shipSunkCounter = this.shipSunkCounter + 1;
        if (this.shipSunkCounter === 4) {
          playSoundOneLeftHit(enemy);
        }
      }

      if (attack === true && shipSunk !== false) {
        this.botEndingsAreWater = false;
        this.botHitShips.push(cordNextToHit + lastHitField);
        let lengthOfSunkShip = shipSunk.length;
        this.shipSunk();
        if (lengthOfSunkShip === this.botHitShips.length) {
          this.botHitShips = [];
          this.botRightHittingDirectionValue = 0;
          this.botRightHittingDirectionName = "unknown";
          this.movementsBot = [-1, 1, 10, -10];
          this.left = false;
          this.up = false;
          this.down = false;
          this.right = false;
          let botWonTheGame = this.allShipsSunk(player1);
          if (botWonTheGame === true) {
            return;
          } else {
            return this.botTurnHard(enemy);
          }
        } else {
          let nameOfSunkShip = shipSunk.shipName;

          for (let i = 0; i < this.placeBoard.length; i++) {
            this.placeBoard[i].forEach((item) => {
              if (item.shipDetails?.shipName === nameOfSunkShip) {
                const indexOfShipInArr = this.botHitShips.indexOf(
                  Number(item.index),
                );
                this.botHitShips.splice(indexOfShipInArr, 1);
              }
            });
          }
          this.shipSunkButOthersStillHit = true;
          this.botRightHittingDirectionValue = 0;
          this.botRightHittingDirectionName = "unknown";
          this.movementsBot = [-1, 1, 10, -10];
          this.left = false;
          this.up = false;
          this.down = false;
          this.right = false;
          return this.botTurnHard(enemy);
          //wenn andere getroffen wurden
        }
      } else if (attack === true) {
        if (this.bothEndsAreWater === true) {
          this.bothEndsAreWater = false;
        }
        playSoundHit();
        this.botHitShips.push(cordNextToHit + lastHitField);
        this.botRightHittingDirectionValue = cordNextToHit;

        switch (this.botRightHittingDirectionValue) {
          case -1:
            this.botRightHittingDirectionName = "Left";
            break;
          case 1:
            this.botRightHittingDirectionName = "Right";
            break;
          case 10:
            this.botRightHittingDirectionName = "Down";
            break;
          case -10:
            this.botRightHittingDirectionName = "Up";
            break;
        }

        return this.botTurnHard(enemy);
      } else {
        const indexOfDirection = this.movementsBot.indexOf(cordNextToHit);
        this.movementsBot.splice(indexOfDirection, 1);
        playSoundWaterSplash();
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        return;
      }
    }
  }

  //stores the fields, which the hard bot only attacks (he skips every second field).
  botTurnHardHitFields() {
    this.botHitFields = [];
    let gamble = Math.floor(Math.random() * 2);

    for (let i = 0; i < 100; i++) {
      if (gamble === 0) {
        let stringI = String(i);
        if (stringI.length < 2) {
          if (i % 2 === 0) {
            this.botHitFields.push(i);
          }
          // else: skipped
        } else {
          if (stringI[0] % 2 === 0) {
            if (stringI[1] % 2 === 0) {
              this.botHitFields.push(i);
            }
          } else {
            if (stringI[1] % 2 === 1) {
              this.botHitFields.push(i);
            }
          }

          // else: skipped
        }
      } else {
        let stringI = String(i);
        if (stringI.length < 2) {
          if (i % 2 === 1) {
            this.botHitFields.push(i);
          }
          // else: skipped
        } else {
          if (stringI[0] % 2 === 0) {
            if (stringI[1] % 2 === 1) {
              this.botHitFields.push(i);
            }
          } else {
            if (stringI[1] % 2 === 0) {
              this.botHitFields.push(i);
            }
          }

          // else: skipped
        }
      }
    }
  }

  getOwnPlacementsIntoStartingGame() {
    for (let key in this.ships) {
      let color = this.ships[key].shipColor;
      this.printColorOnShipGrids(color);
    }
    let savedField = document.querySelector(".fieldArea");
    return savedField;
  }

  //resets the own placementStage
  resetPlacementProcess() {
    this.arrayOfShips.forEach(
      (item) => ((item.ship = null), (item.shipDetails = null)),
    );
    this.arrayOfShips = [];
    this.firstIter = true;
    this.secondIter = true;
  }

  //gets the right color for the equivalent ship.
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

  //Saves the coordinates of the ships, when self placed.
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

  //gets the right ship, if you enter the colorType.
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

  //prints the color of the ships on the board.
  printColorOnShipGrids(color) {
    let currentBackgroundColor = "rgb(40, 93, 172)";
    let element = "";

    for (let i = 0; i < this.placeBoard.length; i++) {
      let eleBackgroundColor = "";
      this.placeBoard[i].forEach((item) => {
        if (
          item.ship &&
          item.hit === false &&
          item.shipDetails.shipColor === color
        ) {
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

  //hides ships, when the active player switches
  hideShips() {
    const savedField = document.querySelector(".fireArea");
    const fireGrids = savedField.getElementsByClassName("fieldBlock");
    for (let i = 0; i < fireGrids.length; i++) {
      fireGrids[i].style.backgroundColor = "rgb(40, 93, 172)";
    }
  }

  //marks the hit field.
  markHitShips(gameBoard) {
    let element = "";
    for (let i = 0; i < this.placeBoard.length; i++) {
      this.placeBoard[i].forEach((item) => {
        if (item.ship && item.hit === true) {
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

  //marks if a ship completely sunk
  shipSunk() {
    const shipList = Object.values(this.ships);
    for (let item of shipList) {
      if (item.sunk === true && item.onSunkList === false) {
        item.onSunkList = true;
        return item;
      }
    }
    return false;
  }

  //checks if all ships sunk
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
      return true;
    } else {
      //ships are still there!
    }
  }
}
