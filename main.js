import { getRelativeCenterCoords } from './utils.js';
import { drawLine } from './draw.js';

// Selectors
const container = document.querySelector('#container');
const svg = document.querySelector('#connections-overlay svg');
const gridContainer = document.querySelector('#grid');
const table = document.querySelector('table');
const currentWordContainer = document.querySelector('#current-word');
const foundCount = document.querySelector('#found');
const totalCount = document.querySelector('#total');
const themeHeader = document.querySelector('#theme-box');
const main = document.querySelector('main');
const popupWindow = document.querySelector('#win-popup');
const popupButton = document.querySelector('#win-popup button');

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

let currentWord = [];
let answers = []; //[[{x,y}], [{x,y}]] ?
let currentAnswer = []; //[{x,y}] -- like currentWord?

const themer = 'No Dice!';
const totalWords = words.length;
let wordsFound = 0;

//style and dynamic theme stuff
themeHeader.querySelector(':scope > h1').innerText = themer;
totalCount.innerText = totalWords;
foundCount.innerText = wordsFound;
totalCount.style.fontWeight = 600;
foundCount.style.fontWeight = 600;

//methods and behaviours yada
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

const updateWordCount = () => {
  wordsFound += 1;
  foundCount.innerText = wordsFound;
};

const canAddLetter = ({ x, y }) => {
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

const isSubmittingWord = ({ x, y }) => {
  //length > 1
  //clicking (again) last letter in currentword
  if (currentWord.length !== 0) {
    let lastLetterX = currentWord[currentWord.length - 1].x;
    let lastLetterY = currentWord[currentWord.length - 1].y;

    if (lastLetterX === x && lastLetterY === y) {
      return true;
    }
  }
};

const isWordValid = (word) => {
  let string = '';
  for (const coords of word) {
    string += board[coords.y][coords.x];
  }
  if (string.length < 4) {
    return false;
  }
  const check = words.some((word) => {
    return string === word;
  });
  if (check) {
    return true;
  } else {
    return false;
  }
};

const displayCurrentWord = (x, y) => {
  const letter = document.createElement('span');
  currentWordContainer.appendChild(letter);
  letter.innerText += board[y][x];
};

const resetButtonColours = () => {
  currentWord.forEach(({ x, y }) => {
    const button = findButton({ x, y });
    button.style.backgroundColor = null;
  });
};

const setAnswerColour = () => {
  const answerColour = 'rgb(175 223 239)';

  // Set background color for each button
  currentAnswer.forEach(({ x, y }) => {
    const button = findButton({ x, y });
    button.style.backgroundColor = answerColour;
  });

  // Get button coordinates and draw lines to connect buttons
  const buttonCoordinates = currentAnswer.map(({ x, y }) => {
    const button = findButton({ x, y });
    return getRelativeCenterCoords(button, container);
  });

  drawLine(svg, buttonCoordinates, answerColour);
};

const storeAnswers = () => {
  //current answer
  currentAnswer = currentWord;
  //all answers
  answers.push(currentWord);
};

const checkIfWon = () => {
  if (wordsFound === words.length) {
    console.log('You won');
    const popupHtml = `
    <div id="win-popup">
    <button>X</button>
    <h1>You Win!</h1>
    <div>No Dice!</div>
  </div>
    `;
    main.innerHTML += popupHtml;
    return;
  }
};

if (popupWindow !== null) {
  popupButton.addEventListener('click', (e) => {
    if (e.target.matches('#popupWindow button')) {
      console.log('hi');
      popupWindow.remove();
    }
  });
}

document.addEventListener('click', (e) => {
  if (e.target.matches('#grid button')) {
    const button = e.target;
    const [x, y] = [button.dataset.x, button.dataset.y].map((i) =>
      parseInt(i, 10)
    );

    if (isSubmittingWord({ x, y })) {
      if (isWordValid(currentWord)) {
        resetButtonColours();
        storeAnswers();
        setAnswerColour();
        currentWord = [];
        updateWordCount();
        updateTable();
        checkIfWon();
        return;
      } else {
        if (currentWord.length <= 1) {
          resetButtonColours();
          currentWord = [];
          updateTable();
          currentWordContainer.innerText = '';
          return;
        } else if (currentWord.length > 1 && currentWord.length < 4) {
          console.log('too short');
          resetButtonColours();
          currentWord = [];
          updateTable();
          currentWordContainer.innerText = 'Too short';
          return;
        } else {
          resetButtonColours();
          currentWord = [];
          updateTable();
          currentWordContainer.innerText = 'Not in word list';
          return;
        }
      }
    }
    if (canAddLetter({ x, y })) {
      if (currentWord.length === 0) {
        currentWordContainer.innerText = '';
      }
      currentWord.push({ x, y });
      updateTable();
      displayCurrentWord(x, y);
    }
  } else {
    return;
  }
  console.log({ currentWord });
});

createTable();
