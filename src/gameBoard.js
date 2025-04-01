export  class Gameboard {
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
  }
}

export const initGameboard = new Gameboard();
console.log(initGameboard);