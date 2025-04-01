export class Ship {
  constructor(length) {
    this.length = length;
    this.timesHit = 0;
    this.sunk = false;
  }

  hit() {
    this.timesHit++;
  }

  isSunk() {
    if (this.timesHit === this.length) {
      this.sunk = true;
    }
  }
}

export const testShip = new Ship(5);

console.log(testShip);
