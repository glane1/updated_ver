const choices = ["rock", "paper", "scissors"];
const playerDisplay = document.getElementById("playerDisplay");
const computerDisplay = document.getElementById("computerDisplay");
const resultDisplay = document.getElementById("resultDisplay");
const playerScoreDisplay = document.getElementById("playerScoreDisplay");
const computerScoreDisplay = document.getElementById("computerScoreDisplay");
const matchStatus = document.getElementById("matchStatus");
const streakDisplay = document.getElementById("streakDisplay");
const resetBtn = document.getElementById("resetBtn");
const helpModal = document.getElementById("helpModal");

let playerScore = 0;
let computerScore = 0;
let winStreak = 0;
let isGameOver = false;

// Modal Functions
function openHelp() { helpModal.style.display = "flex"; }
function closeHelp() { helpModal.style.display = "none"; }
window.onclick = function(event) { if (event.target == helpModal) closeHelp(); }

function playGame(playerChoice) {
  if (isGameOver) return;

  resultDisplay.textContent = "THINKING...";
  resultDisplay.classList.remove("greenText", "redText");
  resultDisplay.classList.add("shaking");
  toggleButtons(true);

  setTimeout(() => {
    resultDisplay.classList.remove("shaking");
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    let result;

    if (playerChoice === computerChoice) {
      result = "IT'S A TIE!";
      winStreak = 0;
    } else {
      switch (playerChoice) {
        case "rock": result = (computerChoice === "scissors") ? "YOU WIN!" : "YOU LOSE!"; break;
        case "paper": result = (computerChoice === "rock") ? "YOU WIN!" : "YOU LOSE!"; break;
        case "scissors": result = (computerChoice === "paper") ? "YOU WIN!" : "YOU LOSE!"; break;
      }
    }

    playerDisplay.textContent = `PLAYER: ${playerChoice.toUpperCase()}`;
    computerDisplay.textContent = `COMPUTER: ${computerChoice.toUpperCase()}`;
    resultDisplay.textContent = result;

    if (result === "YOU WIN!") {
      resultDisplay.classList.add("greenText");
      playerScore++; winStreak++;
      playerScoreDisplay.textContent = playerScore;
    } else if (result === "YOU LOSE!") {
      resultDisplay.classList.add("redText");
      computerScore++; winStreak = 0;
      computerScoreDisplay.textContent = computerScore;
    } else {
      winStreak = 0;
    }

    updateStreakUI();
    checkMatchWinner();
    if (!isGameOver) toggleButtons(false);
  }, 700);
}

function updateStreakUI() { streakDisplay.textContent = winStreak >= 2 ? `🔥 ${winStreak} WIN STREAK` : ""; }

function checkMatchWinner() {
  if (playerScore === 5 || computerScore === 5) {
    isGameOver = true;
    matchStatus.textContent = playerScore === 5 ? "🏆 CHAMPION!" : "💀 DEFEATED!";
    resetBtn.style.display = "block";
    toggleButtons(true);
  }
}

function toggleButtons(disabled) { document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = disabled); }

function resetGame() {
  playerScore = 0; computerScore = 0; winStreak = 0; isGameOver = false;
  playerScoreDisplay.textContent = 0; computerScoreDisplay.textContent = 0;
  resultDisplay.textContent = ""; matchStatus.textContent = ""; streakDisplay.textContent = "";
  playerDisplay.textContent = "PLAYER: —"; computerDisplay.textContent = "COMPUTER: —";
  resetBtn.style.display = "none"; toggleButtons(false);
}
