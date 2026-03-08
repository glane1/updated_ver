
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


const modeButtons = document.querySelectorAll('.mode-btn');
const modeProbLabel = document.getElementById('modeProbLabel'); 

const scores = {
  normal: { player: 0, computer: 0, result: "", status: "", rematch: "none", streak: 0, pChoice: "PLAYER: —", cChoice: "COMPUTER: —" },
  intermediate: { player: 0, computer: 0, result: "", status: "", rematch: "none", streak: 0, pChoice: "PLAYER: —", cChoice: "COMPUTER: —" },
  hard: { player: 0, computer: 0, result: "", status: "", rematch: "none", streak: 0, pChoice: "PLAYER: —", cChoice: "COMPUTER: —" }
};

let currentMode = 'normal';

let aiWinProb = 0.4;

let playerScore = 0;
let computerScore = 0;

let winStreak = 0;

let isGameOver = false;

function openHelp() { helpModal.style.display = "flex"; }

function closeHelp() { helpModal.style.display = "none"; }

window.onclick = function(event) { if (event.target == helpModal) closeHelp(); }

function moveThatBeats(move) {
  if (move === 'rock') return 'paper';
  if (move === 'paper') return 'scissors';
  return 'rock';
}

function updateMode() {
  
}

function setMode(mode) {
  if (!mode || mode === currentMode) return;
  
  scores[currentMode] = {
    player: playerScore,
    computer: computerScore,
    result: resultDisplay.textContent,
    status: matchStatus.textContent,
    rematch: resetBtn.style.display,
    streak: winStreak,
    pChoice: playerDisplay.textContent,
    cChoice: computerDisplay.textContent
  };

  modeButtons.forEach(btn => {
    const m = btn.dataset.mode;
    const active = m === mode;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  currentMode = mode;
  const state = scores[currentMode];
  
  playerScore = state.player;
  computerScore = state.computer;
  winStreak = state.streak;

  playerScoreDisplay.textContent = playerScore;
  computerScoreDisplay.textContent = computerScore;
  resultDisplay.textContent = state.result;
  matchStatus.textContent = state.status;
  resetBtn.style.display = state.rematch;
  playerDisplay.textContent = state.pChoice;
  computerDisplay.textContent = state.cChoice;

  isGameOver = (playerScore === 5 || computerScore === 5);
  toggleButtons(isGameOver);

  if (currentMode === 'intermediate') aiWinProb = 0.55;
  else if (currentMode === 'hard') aiWinProb = 0.7;
  else aiWinProb = 0.4;
  
  if (modeProbLabel) modeProbLabel.textContent = `~${Math.round(aiWinProb*100)}%`;

  updateStreakUI();
}

if (modeButtons && modeButtons.length) {
  modeButtons.forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.mode)));
  setMode(currentMode);
}

function playGame(playerChoice) {
  if (isGameOver) return;

  resultDisplay.textContent = "THINKING...";
  resultDisplay.classList.remove("greenText", "redText");
  resultDisplay.classList.add("shaking");
  toggleButtons(true);

  setTimeout(() => {
    resultDisplay.classList.remove("shaking");

    let computerChoice;
    const winningMove = moveThatBeats(playerChoice);

    if (Math.random() < aiWinProb) {
      computerChoice = winningMove;
    } else {
      const other = choices.filter(c => c !== winningMove);
      computerChoice = other[Math.floor(Math.random() * other.length)];
    }

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
      playerScore++; 
      winStreak++;
      playerScoreDisplay.textContent = playerScore;
    } else if (result === "YOU LOSE!") {
      resultDisplay.classList.add("redText");
      computerScore++;
      winStreak = 0;
      computerScoreDisplay.textContent = computerScore;
    } else {
      winStreak = 0;
    }

    scores[currentMode].player = playerScore;
    scores[currentMode].computer = computerScore;

    updateStreakUI();
    checkMatchWinner();

    if (!isGameOver) toggleButtons(false);
  }, 700);
}

function updateStreakUI() { 
  streakDisplay.textContent = winStreak >= 2 ? `🔥 ${winStreak} WIN STREAK` : ""; 
}

function checkMatchWinner() {
  if (playerScore === 5 || computerScore === 5) {
    isGameOver = true;
    matchStatus.textContent = playerScore === 5 ? "🏆 CHAMPION!" : "💀 DEFEATED!";
    resetBtn.style.display = "block";
    toggleButtons(true);
  }
}

function toggleButtons(disabled) { 
  document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = disabled); 
}

function resetGame() {
  playerScore = 0; 
  computerScore = 0; 
  winStreak = 0; 
  isGameOver = false;

  scores[currentMode].player = 0;
  scores[currentMode].computer = 0;

  playerScoreDisplay.textContent = 0;
  computerScoreDisplay.textContent = 0;
  resultDisplay.textContent = "";
  matchStatus.textContent = "";
  streakDisplay.textContent = "";
  playerDisplay.textContent = "PLAYER: —";
  computerDisplay.textContent = "COMPUTER: —";

  resetBtn.style.display = "none";
  toggleButtons(false);
}
