import { Gameboard } from "./gameBoard.js";
import { Ship } from "./ship.js";

export class Player {
  constructor(name) {
    this.name = name;
    this.gameboard = new Gameboard();
  }
}

//console.log(playerOne.gameboard.randomSpawn())

//each fieldGrid has an index, which guides to the equivalent object in the gameboard
