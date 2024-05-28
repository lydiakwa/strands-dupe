import { getRelativeCenterCoords } from './utils.js'
import { drawLine } from './draw.js'

// Selectors
const container = document.querySelector("#container")
const svg = document.querySelector("#connections-overlay svg")
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
  for (let x = 0; x < board.length; x++) {
    let row = board[x];
    const createRow = document.createElement('div');
    gridContainer.appendChild(createRow);
    createRow.setAttribute('id', x);
    for (let y = 0; y < row.length; y++) {
      const button = document.createElement('button');
      createRow.appendChild(button);
      button.innerHTML = row[y];
      button.dataset.x = x
      button.dataset.y = y
    }
  }
};

const findButton = ({ x, y }) => {
  return document.querySelector(`button[data-x="${x}"][data-y="${y}"]`)
}

const updateCurrentWord = () => {
  const currentWordColor = 'rgb(219, 216, 197)'

  // Set background color for each button
  currentWord.forEach(({ x, y }) => {
    const button = findButton({ x, y })
    button.style.backgroundColor = currentWordColor
  })

  // Get button coordinates and draw lines to connect buttons
  const buttonCoordinates = currentWord.map(({ x, y }) => {
    const button = findButton({ x, y })
    return getRelativeCenterCoords(button, container)
  })

  drawLine(svg, buttonCoordinates, currentWordColor)
}

const updateTable = () => {
  // ensure svg box is same size as container
  const { width, height } = container.getBoundingClientRect()
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)

  // clear previous drawings
  for (const child of svg.children) { child.remove() }

  updateCurrentWord()
}

const canAddLetter = ({ x, y }) => {
  // TODO: implement this to check if the new letter is allowed based on the last letter in currentWord
  return true
}

document.addEventListener('click', e => {
  if (e.target.matches('#grid button')) {
    const button = e.target
    const [x, y] = [button.dataset.x, button.dataset.y].map(i => parseInt(i, 10))

    if (canAddLetter({ x, y })) {
      currentWord.push({ x, y })
      updateTable()
    }
  }
})

createTable();
