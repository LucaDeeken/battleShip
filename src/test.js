import { Ship } from "./ship.js";
import { Gameboard } from "./gameBoard.js";

describe("Test Ship-Object", () => {
  test("check if length-constructor works", () => {
    const spyDummy = new Ship(5);
    expect(spyDummy.length).toBe(5);
  });
  test("check if hit and sunk mechanism works", () => {
    const spyDummy = new Ship(5);
    expect(spyDummy.timesHit).toBe(0);
    expect(spyDummy.sunk).toBe(false);
    spyDummy.hit();
    spyDummy.hit();
    spyDummy.hit();
    spyDummy.hit();
    spyDummy.hit();
    expect(spyDummy.timesHit).toBe(5);
    spyDummy.isSunk();
    expect(spyDummy.sunk).toBe(true);
  });
});

describe("Test Gameboard-Object", () => {
  test("check if array/object generation works", () => {
    const spyDummy = new Gameboard();
    expect(spyDummy.placeBoard.length).toBe(10);
  });
});
