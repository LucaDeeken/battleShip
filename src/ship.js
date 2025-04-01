export class Ship {
  constructor(length) {
    this.length = length;
    this.timesHit = 0;
    this.sunk = false;
    this.position = 0;
  }

  hit() {
    this.timesHit++;
  }

  isSunk() {
    if (this.timesHit === this.length) {
      this.sunk = true;
    }
  }

  positionShip(coordinate) {
    this.position = coordinate;
  }
}

export const testShip = new Ship(5);

console.log(testShip);
