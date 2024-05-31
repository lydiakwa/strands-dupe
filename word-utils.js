const getCurrentWord = (coords, board) => {
  let string = "";
  for (const { x, y } of coords) {
    string += board[y][x];
  }
  return string;
};

export { getCurrentWord };
