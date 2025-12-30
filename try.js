let easybutton = document.getElementById("easybt");
let medbutton = document.getElementById("mediumbt");
let hardbutton = document.getElementById("hardbt");
let startbutton = document.getElementById("st");
let resetbutton = document.getElementById("res");
let islevelclicked = false;
let numCellsToChange = 0;
var cells = Array.from(document.getElementsByClassName('box'));
var changedCells = [];
let duration = 0;
let randomIndex = 0;
let isStarted = false;
let isPaused = false;
let remainingSeconds = 10;
let timerdelay = false;
let alreadyclicked = [];
let timerDisplay = document.getElementById("timer");
let score = 0;
let isreset = false;
let isClickable = true;
let lastSelectedLevel = "easy";
let intervalId;
let gifContainer = document.getElementById("gifContainer");
let allButtons = document.getElementsByClassName("difficultyButton");

for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener("click", function () {
      for (let j = 0; j < allButtons.length; j++) {
        if (j !== i) {
          allButtons[j].classList.remove("active");
          allButtons[j].disabled = true;
        } else {
          allButtons[j].classList.add("active");
          allButtons[j].disabled = false;
          start.play();
          islevelclicked = true;
          lastSelectedLevel = allButtons[j].id.replace("bt", "");
        }
      }
    });
}   

if (lastSelectedLevel === "medium") {
  medbutton.click();
} else if (lastSelectedLevel === "hard") {
  hardbutton.click();
} else {
  easybutton.click();
}

function startInitialGame() {
  if (islevelclicked === true) {
    flip.play();

    let levelSettings = {
      easy: { numCellsToChange: 2, duration: 3 },
      medium: { numCellsToChange: 3, duration: 2 },
      hard: { numCellsToChange: 5, duration: 1 },
    };

    let { numCellsToChange, duration } = levelSettings[lastSelectedLevel];

    for (let i = 0; i < numCellsToChange; i++) {
      randomIndex = cells[Math.floor(Math.random() * cells.length)];
      if (!changedCells.includes(randomIndex)) {
        changeCellColor(randomIndex, duration);
        changedCells.push(randomIndex);
      } else {
        numCellsToChange += 1;
      }
    }
    setTimeout(() => {
      timerdelay = true;
    }, duration * 1000);
  }
  startgame();
}

startbutton.addEventListener("click", function () {
  if (!isStarted && islevelclicked) {
    isStarted = true;
    startbutton.innerText = "Pause";
    startInitialGame();
  } else if (isStarted && !isPaused) {
    isPaused = true;
    startbutton.innerText = "Resume";
    pausegame();
  } else if (isStarted && isPaused) {
    isPaused = false;
    startbutton.innerText = "Pause";
    resumegame();
  }
});

function changeCellColor(cell, duration) {
  cell.style.background = "#BDF6FE";
  setTimeout(() => {
    cell.style.background = "#98fb98";
  }, duration * 1000);
}

function updateTimer() {
  if (timerdelay == true) {
    timerDisplay.textContent = `Time remaining: ${remainingSeconds} seconds`;
    remainingSeconds--;
    countdownSound.play();
  }
  if (remainingSeconds <= 0) {
    clearInterval(intervalId);
    timerdelay = false;
    countdownSound.pause();
    timerDisplay.textContent = "Time's up!";
    ending.play();
  }
}

function startgame() {
  intervalId = setInterval(updateTimer, 1000);
  for (let i = 0; i < changedCells.length; i++) {
    changedCells[i].addEventListener("click", function () {
      if (timerdelay && isClickable && changedCells.includes(this)) {
        if (!alreadyclicked.includes(this)) {
          score++;
          document.getElementById("sc").innerText = "Score: " + score;
          this.style.background = "#BDF6FE";
          correct.play();
          alreadyclicked.push(this);
        }
        if (score === changedCells.length) {
          countdownSound.pause();
          winner.play();
          document.getElementById("sc").innerText = "WINNER!";
          document.getElementById("sc").style.background = "green";
          document.getElementById("winnerGif").style.visibility = "visible";
          score = 0;
          clearInterval(intervalId);
          timerDisplay.textContent = "";
          timerdelay = false;
          startbutton.disabled = true;
          setTimeout(() => {
            reset();
          }, 2000);
        }
      }
    });
  }

  for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener("click", function () {
      if (timerdelay && isClickable && !changedCells.includes(this)) {
        this.style.background = "#f44336";
        wrong.play();
      }
    });
  }
}

function pausegame() {
  countdownSound.pause();
  timerdelay = false;
  clearInterval(intervalId);
  isClickable = false;
}

function resumegame() {
  countdownSound.play();
  timerdelay = true;
  intervalId = setInterval(updateTimer, 1000);
  isClickable = true;
}

resetbutton.addEventListener("click", function () {
  reset();
});

function reset() {
  for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].disabled = false;
    // allButtons[i].classList.remove("active");
    // allButtons[i].style.backgroundColor = "#acf72a";
    // allButtons[i].style.fontSize = "30px";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].style.background = "#98fb98";
  }
  islevelclicked = false;
  isreset = true;
  score = 0;
  document.getElementById("sc").innerText = "Score: " + score;
  timerdelay = false;
  countdownSound.pause();
  alreadyclicked = [];
  changedCells = [];
  document.getElementById("sc").style.background = "#EAD1DC";
  isStarted = false;
  isPaused = false;
  startbutton.innerText = "Start";
  clearInterval(intervalId);
  timerDisplay.textContent = "";
  remainingSeconds = 10;
  isClickable = true;
  startbutton.disabled = false;
  lastSelectedLevel = "easy";
  document.getElementById("winnerGif").style.visibility = "hidden";
}
