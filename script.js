let secretNumber = Math.floor(Math.random() * 360) + 1;

if (secretNumber == 360) {
  secretNumber = 359.99
}
let attemptsLeft = 6;
let guesses = [];

const radius = 90;

function updateCircle() {
  const angle = secretNumber;
  const x = 100 + radius * Math.cos((angle - 90) * Math.PI / 180);
  const y = 100 + radius * Math.sin((angle - 90) * Math.PI / 180);
  const largeArc = angle > 180 ? 1 : 0;
  const pathData = `M100,100 L100,10 A90,90 0 ${largeArc} 1 ${x},${y} Z`;
  document.getElementById("arcPath").setAttribute("d", pathData);
  const randomRotation = Math.floor(Math.random() * 360);
  document.getElementById("arcPath").setAttribute("transform", `rotate(${randomRotation} 100 100)`);
}

updateCircle();

function makeGuess() {
  const userGuess = parseInt(document.getElementById("guessInput").value);
  const message = document.getElementById("message");
  const endmessage = document.getElementById("endmessage");
  const attempts = document.getElementById("attempts");
  const guessList = document.getElementById("guessList");

  if (isNaN(userGuess)) {
    message.textContent = "Please enter a valid number.";
    return;
  }
  if (userGuess == 360) {
    userGuess = 359.99
  }
  guesses.push(userGuess);
  guessList.textContent = `Your guesses: ${guesses.join(', ')}`;
  attemptsLeft--;

  if (userGuess === secretNumber) {
    endmessage.textContent = `Correct! The number was ${secretNumber}. You win!`;
    updateStats(true, guesses.length);
    endGame();
  } else if (attemptsLeft === 0) {
    endmessage.textContent = `Out of guesses! The number was ${secretNumber}.`;
    updateStats(false, guesses.length);
    endGame();
  } else {
    message.textContent = userGuess < secretNumber ? "⬆️" : "⬇️";
    attempts.textContent = `Guesses left: ${attemptsLeft}`;
  }
}

function updateStats(won, guessCount) {
  let stats = JSON.parse(localStorage.getItem("guessStats")) || {
    gamesPlayed: 0,
    gamesWon: 0,
    guessDistribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0 }
  };

  stats.gamesPlayed++;
  if (won) {
    stats.gamesWon++;
    if (guessCount >= 1 && guessCount <= 6) {
      stats.guessDistribution[guessCount]++;
    }
  }

  localStorage.setItem("guessStats", JSON.stringify(stats));
  showStats(stats);
}


const button = document.getElementById('resetbutton');
let holdTimer;

const startHold = () => {
  button.classList.add('holding');
  holdTimer = setTimeout(() => {
    alert('Stats have been reset!');
    resetStats()
    button.classList.remove('holding'); // Reset color after alert
  }, 3000);
};

const cancelHold = () => {
  clearTimeout(holdTimer);
  button.classList.remove('holding');
};

button.addEventListener('mousedown', startHold);
button.addEventListener('mouseup', cancelHold);
button.addEventListener('mouseleave', cancelHold);

button.addEventListener('touchstart', startHold);
button.addEventListener('touchend', cancelHold);
button.addEventListener('touchcancel', cancelHold);

function resetStats() {
  localStorage.clear();
  restartGame();
}


function showStats(stats) {
  const winRate = ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(1);
  let summary = `Games played: ${stats.gamesPlayed}\n`;
  summary += `Games won: ${stats.gamesWon}\n`;
  summary += `Win rate: ${winRate}%\n`;
  for (let i = 1; i <= 6; i++) {
    summary += `${i} guess: ${stats.guessDistribution[i]}\n`;
  }
  document.getElementById("statsText").textContent = summary;
  document.getElementById("gameStats").showModal();
}

function endGame() {
  document.querySelector("button").disabled = true;
}

function restartGame() {
  secretNumber = Math.floor(Math.random() * 100) + 1;
  attemptsLeft = 6;
  guesses = [];
  updateCircle();
  document.getElementById("gameStats").close();
  document.getElementById("message").textContent = "";
  document.getElementById("attempts").textContent = "";
  document.getElementById("guessList").textContent = "";
  document.querySelector("button").disabled = false;
  document.getElementById("guessInput").value = "";
}