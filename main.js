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
const popupTheme = document.querySelector('#win-popup-theme');
const winPuzzleCount = document.querySelector('#puzzle-count');
const dateHeader = document.querySelector('header h2');

// Colours
const blue = '#afdfef';
const darkBlue = '#0f7ea0';
const grey = 'rgb(219 216 197)';
const yellow = '#f8cc2d';

// Data
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
const spangram = 'PARTYGAMES';

let currentWord = [];
let answers = []; //[[{x,y}], [{x,y}]] ?
let currentAnswer = []; //[{x,y}] -- like currentWord?

const themer = 'No Dice!';
const totalWords = words.length;
let wordsFound = 0;
const puzzleNumber = 1;

//static date for header
const today = new Date();
let formattedDate = `${today.toLocaleString('default', {
  month: 'long',
})} ${today.getDate()}, ${today.getFullYear()}`;

let midnight = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate(),
  23,
  59
).getTime();

//count down stuff
let countDown = setInterval(function () {
  //need to call for new date today for this to work!
  const today2 = new Date().getTime();
  const difference = midnight - today2;

  let hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((difference % (1000 * 60)) / 1000);

  document.querySelector('#count-down').innerHTML = `${hours
    .toString()
    .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  if (difference < 0) {
    clearInterval(x);
    document.getElementById('count-down').innerHTML = 'Whoops :)';
  }
}, 1000);

//style and dynamic theme stuff
dateHeader.innerHTML = formattedDate;
themeHeader.querySelector(':scope > h1').innerText = themer;
popupTheme.innerText = themer;
winPuzzleCount.innerText = `Lydia's Strands Dupe #${puzzleNumber}`;
totalCount.innerText = totalWords;
foundCount.innerText = wordsFound;

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
  // Set background color for each button
  currentWord.forEach(({ x, y }) => {
    const button = findButton({ x, y });
    button.style.backgroundColor = grey;
  });

  // Get button coordinates and draw lines to connect buttons
  const buttonCoordinates = currentWord.map(({ x, y }) => {
    const button = findButton({ x, y });
    return getRelativeCenterCoords(button, container);
  });

  drawLine(svg, buttonCoordinates, grey);
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

//should check if the letter is adjacent or not
const isLetterAdjacent = ({ x, y }) => {
  console.log({ x, y });
  const lastLetterX = currentWord[currentWord.length - 1]['x'];
  const lastLetterY = currentWord[currentWord.length - 1]['y'];

  if (Math.abs(lastLetterX - x) > 1 || Math.abs(lastLetterY - y) > 1) {
    return false;
  } else {
    return true;
  }
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

const isSpangram = (word) => {
  let string = '';
  for (const coords of word) {
    string += board[coords.y][coords.x];
  }
  if (string === spangram) return true;
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

const setAnswerColour = (color) => {
  // Set background color for each button
  currentAnswer.forEach(({ x, y }) => {
    const button = findButton({ x, y });
    button.style.backgroundColor = color;
  });

  // Get button coordinates and draw lines to connect buttons
  const buttonCoordinates = currentAnswer.map(({ x, y }) => {
    const button = findButton({ x, y });
    return getRelativeCenterCoords(button, container);
  });

  drawLine(svg, buttonCoordinates, blue);
};

const storeAnswers = () => {
  //current answer
  currentAnswer = currentWord;
  //all answers
  answers.push(currentWord);
};

const checkIfWon = () => {
  if (wordsFound === words.length) {
    return true;
  }
};

//MODALS

const createWinModal = () => {
  popupWindow.style.display = 'flex';
};

// EVENT LISTENERS

popupButton.addEventListener('click', (e) => {
  // console.log('please close me');
  popupWindow.remove();
});

document.addEventListener('click', (e) => {
  if (e.target.matches('#grid button')) {
    const button = e.target;
    const [x, y] = [button.dataset.x, button.dataset.y].map((i) =>
      parseInt(i, 10)
    );

    //first check if a guess has been started (i.e. fresh word, first letter)
    if (currentWord.length === 0) {
      //reset after a successful answer, but you still want the previous correct answer to display before you proceed to the next guess
      resetButtonColours();
      currentWordContainer.style.color = 'black';
      currentWordContainer.innerText = '';
      //proceed with the new guess
      currentWord.push({ x, y });
      updateTable();
      displayCurrentWord(x, y);
    } else {
      //guess has already started, now check for two things, is the button being clicked the same as the last letter added or adjacent
      if (isSubmittingWord({ x, y })) {
        //the last letter has been selected
        //check if word  is valid
        if (isWordValid(currentWord)) {
          //check if it is the spangram
          if (isSpangram(currentWord)) {
            currentWordContainer.style.color = yellow;
            resetButtonColours();
            storeAnswers();
            setAnswerColour(yellow);
            currentWord = [];
            updateWordCount();
            updateTable();
          } else {
            currentWordContainer.style.color = darkBlue;
            resetButtonColours();
            storeAnswers();
            setAnswerColour(blue);
            currentWord = [];
            updateWordCount();
            updateTable();
          }
          console.log({ currentWord });
          console.log(currentWordContainer.innerText);
          //check if the game is won
          if (checkIfWon()) {
            console.log('You win!');
          }
        } else {
          //word is not valid
          //lose condittions
          if (currentWord.length <= 1) {
            resetButtonColours();
            currentWord = [];
            updateTable();
            currentWordContainer.innerText = '';
            return;
          } else if (currentWord.length > 1 && currentWord.length < 4) {
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
      } else if (isLetterAdjacent({ x, y })) {
        //check is letter is adjacent or not
        console.log('adjacent');
        currentWord.push({ x, y });
        updateTable();
        displayCurrentWord(x, y);
        return;
      } else {
        //letter is not adjacent
        console.log('not adjacent');
        resetButtonColours();
        currentWord = [];
        updateTable();
        currentWordContainer.innerText = '';
        return;
      }
    }
  } else {
    return;
  }
});

createTable();
