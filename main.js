import { getRelativeCenterCoords } from './utils.js';
import { drawLine } from './draw.js';

// Selectors
const container = document.querySelector('#container');
const svg = document.querySelector('#connections-overlay svg');
const gridContainer = document.querySelector('#grid');
const table = document.querySelector('table');
const currentWordContainer = document.querySelector('#current-word');

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
  for (let y = 0; y < board.length; y++) {
    let row = board[y];
    const createRow = document.createElement('div');
    gridContainer.appendChild(createRow);
    createRow.setAttribute('id', y);
    for (let x = 0; x < row.length; x++) {
      const button = document.createElement('button');
      createRow.appendChild(button);
      button.innerHTML = row[x];
      button.dataset.x = x;
      button.dataset.y = y;
    }
  }
};

const findButton = ({ x, y }) => {
  return document.querySelector(`button[data-x="${x}"][data-y="${y}"]`);
};

const updateCurrentWord = () => {
  const currentWordColor = 'rgb(219, 216, 197)';

  // Set background color for each button
  currentWord.forEach(({ x, y }) => {
    const button = findButton({ x, y });
    button.style.backgroundColor = currentWordColor;
  });

  // Get button coordinates and draw lines to connect buttons
  const buttonCoordinates = currentWord.map(({ x, y }) => {
    const button = findButton({ x, y });
    return getRelativeCenterCoords(button, container);
  });

  drawLine(svg, buttonCoordinates, currentWordColor);
};

const updateTable = () => {
  // ensure svg box is same size as container
  const { width, height } = container.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

  // clear previous drawings
  for (const child of svg.children) {
    child.remove();
  }

  updateCurrentWord();
};

const canAddLetter = ({ x, y }) => {
  // TODO: implement this to check if the new letter is allowed based on the last letter in currentWord
  // first letter always gets added, possibly should move this check into event listener?
  if (currentWord.length === 0) {
    return true;
  }
  const lastLetterX = currentWord[currentWord.length - 1]['x'];
  const lastLetterY = currentWord[currentWord.length - 1]['y'];

  const alreadyIn = currentWord.some((letter) => {
    return letter.x === x && letter.y === y;
  });

  if (alreadyIn) {
    return false;
  }

  if (Math.abs(lastLetterX - x) > 1) {
    return false;
  }
  if (Math.abs(lastLetterY - y) > 1) {
    return false;
  }
  return true;
};

const isWordValid = () => {};

const isSubmittingWord = ({ x, y }) => {
  //length > 1
  //clicking (again) last letter in currentword
};

const displayCurrentWord = (x, y) => {
  const letter = document.createElement('span');
  currentWordContainer.appendChild(letter);
  letter.innerHTML += board[y][x];
};

document.addEventListener('click', (e) => {
  if (e.target.matches('#grid button')) {
    const button = e.target;
    const [x, y] = [button.dataset.x, button.dataset.y].map((i) =>
      parseInt(i, 10)
    );

    if (canAddLetter({ x, y })) {
      currentWord.push({ x, y });
      updateTable();
      displayCurrentWord(x, y);
    }
  }
});

createTable();
