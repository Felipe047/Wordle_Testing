import { testDictionary, realDictionary } from './dictionary.js';

// for testing purposes, make sure to use the test dictionary
console.log('test dictionary:', testDictionary);

const dictionary = realDictionary;
const state = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)],
  grid: Array(6)
    .fill()
    .map(() => Array(5).fill('')),
  currentRow: 0,
  currentCol: 0,
};


function drawGrid(container) {
  const grid = document.createElement('div');
  grid.className = 'grid';

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      drawBox(grid, i, j);
    }
  }

  container.appendChild(grid);
}

function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`);
      box.textContent = state.grid[i][j];
    }
  }
}

function drawBox(container, row, col, letter = '') {
  const box = document.createElement('div');
  box.className = 'box';
  box.textContent = letter;
  box.id = `box${row}${col}`;

  container.appendChild(box);
  return box;
}

function registerKeyboardEvents() {
  document.body.onkeydown = (e) => {
    const key = e.key;
    if (key === 'Enter') {
      if (state.currentCol === 5) {
        const word = getCurrentWord();
        if (isWordValid(word)) {
          revealWord(word);
          state.currentRow++;
          state.currentCol = 0;
        } else {
          alert('Not a valid word.');
        }
      }
    }
    if (key === 'Backspace') {
      removeLetter();
    }
    if (isLetter(key)) {
      addLetter(key);
    }

    updateGrid();
  };
}

function getCurrentWord() {
  return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
}

function isWordValid(word) {
  return dictionary.includes(word);
}

function getNumOfOccurrencesInWord(word, letter) {
  let result = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

function getPositionOfOccurrence(word, letter, position) {
  let result = 0;
  for (let i = 0; i <= position; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

function revealWord(guess) {
  const row = state.currentRow;
  const animation_duration = 500; // ms

  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`box${row}${i}`);
    const letter = box.textContent;
    const numOfOccurrencesSecret = getNumOfOccurrencesInWord(
      state.secret,
      letter
    );
    const numOfOccurrencesGuess = getNumOfOccurrencesInWord(guess, letter);
    const letterPosition = getPositionOfOccurrence(guess, letter, i);

    setTimeout(() => {
      if (
        numOfOccurrencesGuess > numOfOccurrencesSecret &&
        letterPosition > numOfOccurrencesSecret
      ) {
        box.classList.add('empty');
      } else {
        if (letter === state.secret[i]) {
          box.classList.add('right');
        } else if (state.secret.includes(letter)) {
          box.classList.add('wrong');
        } else {
          box.classList.add('empty');
        }
      }
    }, ((i + 1) * animation_duration) / 2);

    box.classList.add('animated');
    box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
  }

  const isWinner = state.secret === guess;
  const isGameOver = state.currentRow === 5;

  setTimeout(() => {
    if (isWinner) {
      alert('Congratulations!');
    } else if (isGameOver) {
      alert(`Better luck next time! The word was ${state.secret}.`);
    }
  }, 3 * animation_duration);
}

function isLetter(key) {
  return key.length === 1 && key.match(/[a-z]/i);
}

function addLetter(letter) {
  if (state.currentCol === 5) return;
  state.grid[state.currentRow][state.currentCol] = letter;
  state.currentCol++;
}

function removeLetter() {
  if (state.currentCol === 0) return;
  state.grid[state.currentRow][state.currentCol - 1] = '';
  state.currentCol--;
}

function startup() {
  const game = document.getElementById('game');
  drawGrid(game);

  registerKeyboardEvents();
}

startup();

// Function to start a new game
function startNewGame() {
  fetch('wordle.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'action=new_game'
  })
  .then(response => response.json())
  .then(data => {
      console.log('New game started:', data);
      // Update UI to display initial game state
      updateGameState(data.state);
      updateLeaderboard(data.leaderboard);
  })
  .catch(error => {
      console.error('Error starting new game:', error);
  });
}

// Function to submit a guess
function submitGuess(guess) {
  fetch('wordle.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `action=submit_guess&guess=${guess}`
  })
  .then(response => response.json())
  .then(data => {
      console.log('Guess submitted:', data);
      // Update UI to reflect game state and leaderboard
      updateGameState(data.state);
      updateLeaderboard(data.leaderboard);
  })
  .catch(error => {
      console.error('Error submitting guess:', error);
  });
}

// Function to update game state on UI
function updateGameState(state) {
  // Update your UI elements based on the game state
  console.log('Updating game state on UI:', state);
}

// Function to update leaderboard on UI
function updateLeaderboard(leaderboard) {
  // Update your UI elements to display the leaderboard
  console.log('Updating leaderboard on UI:', leaderboard);
}

// Function to get current game state and leaderboard
function getCurrentState() {
  fetch('wordle.php?action=get_state')
  .then(response => response.json())
  .then(data => {
      console.log('Current game state:', data.state);
      console.log('Current leaderboard:', data.leaderboard);
      // Update UI to display current game state and leaderboard
      updateGameState(data.state);
      updateLeaderboard(data.leaderboard);
  })
  .catch(error => {
      console.error('Error fetching current state:', error);
  });
}

// Call getCurrentState on startup to initialize the UI
getCurrentState();