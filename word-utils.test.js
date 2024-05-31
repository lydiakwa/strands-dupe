import { getCurrentWord } from "./word-utils";

describe("getCurrentWord", () => {
  const board = [
    ["H", "C", "R", "I", "T", "Y"],
    ["A", "R", "B", "E", "L", "E"],
    ["E", "D", "A", "T", "Y", "C"],
    ["S", "A", "R", "L", "T", "G"],
    ["P", "O", "E", "E", "A", "T"],
    ["N", "H", "P", "M", "W", "I"],
    ["E", "A", "I", "E", "R", "S"],
    ["M", "A", "F", "S", "E", "T"],
  ];

  it("returns a string based on coords on the board", () => {
    const coords = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ];

    expect(getCurrentWord(coords, board)).toEqual("HARD");
  });
});
