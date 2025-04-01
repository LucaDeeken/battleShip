import { Ship } from "./ship.js";

export class Gameboard {
  constructor() {
    this.placeBoard = [];
    for (let i = 0; i < 10; i++) {
      let leftArray = [];
      for (let j = 0; j < 10; j++) {
        let cords = {
          coordinate: i + j,
          hit: false,
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
          coordinate: i + j,
          hit: false,
        };
        leftArray.push(cords);
      }
      this.fireBoard.push(leftArray);
    }
    this.ships = {
        verySmall : new Ship(2),
        smallOne : new Ship(3),
        smallTwo : new Ship(3),
        big : new Ship(4),
        massive : new Ship(5),
    }
  }

  receiveAttack() {}
  
  positionShip(chosenShip) {

  }
}
