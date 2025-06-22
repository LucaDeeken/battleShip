export class Ship {
  constructor(length, shipName, shipColor) {
    this.length = length;
    this.timesHit = 0;
    this.sunk = false;
    this.position = 0;
    this.shipName = shipName;
    this.onSunkList = false;
    this.shipColor = shipColor;
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
}

export const testShip = new Ship(5);

console.log(testShip);
