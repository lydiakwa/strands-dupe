// Selectors
const gridContainer = document.querySelector('#grid');
const table = document.querySelector('table');

//data
const board = [
  ['H', 'C', 'R', 'I', 'T', 'Y'],
  ['A', 'R', 'B', 'E', 'L', 'E'],
  ['E', 'D', 'A', 'T', 'Y', 'C'],
  ['S', 'A', 'R', 'L', 'T', 'G'],
  ['P', 'O', 'E', 'E', 'A', 'T'],
  ['N', 'H', 'P', 'M', 'W', 'I'],
  ['E', 'A', 'I', 'E', 'R', 'S'],
  ['M', 'A', 'F', 'S', 'E', 'T'],
];

const words = [
  'CHARADES',
  'CELEBRITY',
  'PARTYGAMES',
  'TELEPHONE',
  'TWISTER',
  'MAFIA',
];

const theme = 'No Dice!';
const totalWords = words.length;

const currentWord = [];

const createTable = () => {
  for (let i = 0; i < board.length; i++) {
    let row = board[i];
    const createRow = document.createElement('div');
    gridContainer.appendChild(createRow);
    createRow.setAttribute('id', i);
    for (let j = 0; j < row.length; j++) {
      const createCell = document.createElement('button');
      createRow.appendChild(createCell);
      createCell.innerHTML = row[j];
      createCell.setAttribute('id', `${i}${j}`);
    }
  }
};

createTable();
