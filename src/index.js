import "./style.css";
import { Player, playerOne } from "./player.js";
import {Ship } from "./ship.js";
import {buildFields } from "./DOMmanipulation.js";

playerOne.gameboard.buildFields();
playerOne.gameboard.randomSpawn();