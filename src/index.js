import "./style.css";
import { Player } from "./player.js";
import { Ship } from "./ship.js";
import { buildFields, startDialog } from "./DOMmanipulation.js";
import { startGame } from "./gameFlow.js";

//starts the very first dialog, in which you can chose the single- or multiplayermode
startDialog();