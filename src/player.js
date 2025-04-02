import { Gameboard } from "./gameBoard.js";
import {Ship } from "./ship.js";

export class Player {
    constructor(name) {
        this.name = name;
        this.gameboard = new Gameboard();
    }
}


export const playerOne = new Player("Luca");
console.log(playerOne.gameboard);