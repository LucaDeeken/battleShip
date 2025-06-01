export class Ship {
  constructor(length) {
    this.length = length;
    this.timesHit = 0;
    this.sunk = false;
    this.position = 0;
    this.shipName = this.getShipname(this.length);
    this.onSunkList = false;
  }

  hit() {
    console.log(this.timesHit);
    this.timesHit++;
    this.isSunk();
  }

  isSunk() {
    if (this.timesHit === this.length) {
      this.sunk = true;
      return true;
    }
  }

  positionShip(coordinate) {
    this.position = coordinate;
  }

  getShipname(length) {
    switch(length) {
      case(2):
      return this.shipName="Submarine";
      case(3):
      return this.shipName = "Destroyer";
      case(4):
      return this.shipName ="Battleship";
      case(5):
      return this.shipName ="Carrier";
    }
  }
}

export const testShip = new Ship(5);

console.log(testShip);
