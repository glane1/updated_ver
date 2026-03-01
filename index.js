// ============================================
// DOM ELEMENT REFERENCES
// ============================================
// Game choices array
const choices = ["rock", "paper", "scissors"];

// Display element references
const playerDisplay = document.getElementById("playerDisplay"); // Shows player's choice
const computerDisplay = document.getElementById("computerDisplay"); // Shows AI's choice
const resultDisplay = document.getElementById("resultDisplay"); // Shows round result (WIN/LOSE/TIE)
const playerScoreDisplay = document.getElementById("playerScoreDisplay"); // Player score number
const computerScoreDisplay = document.getElementById("computerScoreDisplay"); // Computer score number
const matchStatus = document.getElementById("matchStatus"); // Shows match winner (CHAMPION/DEFEATED)
const streakDisplay = document.getElementById("streakDisplay"); // Shows win streak badge
const resetBtn = document.getElementById("resetBtn"); // Rematch button
const helpModal = document.getElementById("helpModal"); // Help dialog modal

// Mode selector elements
const modeButtons = document.querySelectorAll('.mode-btn'); // All difficulty mode buttons
const modeProbLabel = document.getElementById('modeProbLabel'); // Shows AI win probability percentage

// ============================================
// GAME STATE & MODE MANAGEMENT
// ============================================
// Stores scores separately for each difficulty mode
// When user switches modes, their previous scores are saved and restored
const scores = {
  normal: { player: 0, computer: 0 },
  intermediate: { player: 0, computer: 0 },
  hard: { player: 0, computer: 0 }
};

// Currently selected difficulty mode
let currentMode = 'normal';

// AI difficulty: probability (0-1) that the AI will pick the move that beats the player
// 0.4 = 40% (Normal), 0.55 = 55% (Intermediate), 0.7 = 70% (Hard)
let aiWinProb = 0.4;

// Current round scores (loaded from scores[currentMode])
let playerScore = 0;
let computerScore = 0;

// Win streak tracker: increments on consecutive wins, resets on loss/tie
let winStreak = 0;

// Game match status flag: true when someone reaches 5 points
let isGameOver = false;

// ============================================
// MODAL / HELP FUNCTIONS
// ============================================
// Opens the help modal
function openHelp() { helpModal.style.display = "flex"; }

// Closes the help modal
function closeHelp() { helpModal.style.display = "none"; }

// Close help when clicking outside the modal content
window.onclick = function(event) { if (event.target == helpModal) closeHelp(); }

// ============================================
// GAME LOGIC HELPERS
// ============================================
// Returns the move that beats the given move
// Used to determine AI's winning strategy based on player's choice
function moveThatBeats(move) {
  if (move === 'rock') return 'paper';
  if (move === 'paper') return 'scissors';
  return 'rock';
}

// ============================================
// MODE SWITCHING FUNCTIONS
// ============================================
// Placeholder function kept for backward compatibility
function updateMode() {
  // kept for backward compatibility (no-op)
}

// Handles switching between difficulty modes
// Saves current mode's scores before switching, then loads the new mode's scores
function setMode(mode) {
  // Ignore if invalid mode or already in that mode
  if (!mode || mode === currentMode) return;
  
  // STEP 1: Save current mode's scores
  scores[currentMode].player = playerScore;
  scores[currentMode].computer = computerScore;

  // STEP 2: Update UI buttons (highlight active mode)
  modeButtons.forEach(btn => {
    const m = btn.dataset.mode;
    const active = m === mode;
    btn.classList.toggle('active', active); // Add/remove active styling
    btn.setAttribute('aria-selected', active ? 'true' : 'false'); // Update accessibility
  });

  // STEP 3: Switch to new mode
  currentMode = mode;
  
  // STEP 4: Load scores for new mode (default to 0 if no prior scores)
  playerScore = scores[currentMode].player || 0;
  computerScore = scores[currentMode].computer || 0;
  playerScoreDisplay.textContent = playerScore;
  computerScoreDisplay.textContent = computerScore;

  // STEP 5: Update AI difficulty probability based on new mode
  if (currentMode === 'intermediate') aiWinProb = 0.55;  // AI wins ~55% of rounds
  else if (currentMode === 'hard') aiWinProb = 0.7;      // AI wins ~70% of rounds
  else aiWinProb = 0.4;                                    // AI wins ~40% of rounds (Normal)
  
  // Update the UI label showing AI win probability
  if (modeProbLabel) modeProbLabel.textContent = `~${Math.round(aiWinProb*100)}%`;

  // STEP 6: Reset temporary game state (streak, button disabled status)
  winStreak = 0; 
  updateStreakUI();
  toggleButtons(false); // Re-enable choice buttons
}

// ============================================
// INITIALIZE MODE SELECTOR
// ============================================
// Attach click handlers to all mode buttons and initialize UI
if (modeButtons && modeButtons.length) {
  // When user clicks a mode button, switch to that mode
  modeButtons.forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.mode)));
  // Initialize the UI with the default (normal) mode
  setMode(currentMode);
}

// ============================================
// MAIN GAME ROUND EXECUTION
// ============================================
// Executes a single round of Rock-Paper-Scissors
function playGame(playerChoice) {
  // Prevent playing if match is already over
  if (isGameOver) return;

  // Show "thinking" animation while AI decides
  resultDisplay.textContent = "THINKING...";
  resultDisplay.classList.remove("greenText", "redText");
  resultDisplay.classList.add("shaking"); // Add shake animation
  toggleButtons(true); // Disable choice buttons during AI decision

  // Delay to simulate AI thinking (700ms)
  setTimeout(() => {
    resultDisplay.classList.remove("shaking");
    
    // ========== AI DECISION LOGIC ==========
    let computerChoice;
    const winningMove = moveThatBeats(playerChoice); // What beats the player's choice
    
    // Use aiWinProb to determine if AI tries to win
    // Example: aiWinProb = 0.4 means 40% chance AI picks winning move
    if (Math.random() < aiWinProb) {
      // AI plays to WIN: pick the move that beats player
      computerChoice = winningMove;
    } else {
      // AI plays randomly from remaining moves (either tie or player wins)
      const other = choices.filter(c => c !== winningMove);
      computerChoice = other[Math.floor(Math.random() * other.length)];
    }
    // ========== END AI LOGIC ==========
    
    // Determine round outcome (TIE / WIN / LOSE)
    let result;
    if (playerChoice === computerChoice) {
      result = "IT'S A TIE!";
      winStreak = 0; // Reset streak on tie
    } else {
      // Use switch to check each move combination
      switch (playerChoice) {
        case "rock": result = (computerChoice === "scissors") ? "YOU WIN!" : "YOU LOSE!"; break;
        case "paper": result = (computerChoice === "rock") ? "YOU WIN!" : "YOU LOSE!"; break;
        case "scissors": result = (computerChoice === "paper") ? "YOU WIN!" : "YOU LOSE!"; break;
      }
    }

    // Display both choices and the result
    playerDisplay.textContent = `PLAYER: ${playerChoice.toUpperCase()}`;
    computerDisplay.textContent = `COMPUTER: ${computerChoice.toUpperCase()}`;
    resultDisplay.textContent = result;

    // Update scores based on outcome
    if (result === "YOU WIN!") {
      resultDisplay.classList.add("greenText"); // Green text for win
      playerScore++; 
      winStreak++; // Increment win streak
      playerScoreDisplay.textContent = playerScore;
    } else if (result === "YOU LOSE!") {
      resultDisplay.classList.add("redText"); // Red text for loss
      computerScore++;
      winStreak = 0; // Reset streaks on loss
      computerScoreDisplay.textContent = computerScore;
    } else {
      // Tie: neutral, streak resets
      winStreak = 0;
    }

    // Save scores to the current mode's score storage
    scores[currentMode].player = playerScore;
    scores[currentMode].computer = computerScore;

    // Update UI elements
    updateStreakUI(); // Show/hide streak badge
    checkMatchWinner(); // Check if someone reached 5 points
    
    // Re-enable buttons for next round (if match not over)
    if (!isGameOver) toggleButtons(false);
  }, 700); // 700ms delay
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================
// Updates the win streak badge display
// Shows badge only when streak is 2 or more
function updateStreakUI() { 
  streakDisplay.textContent = winStreak >= 2 ? `🔥 ${winStreak} WIN STREAK` : ""; 
}

// Checks if the match is won (first to 5 points)
function checkMatchWinner() {
  // Match ends when someone reaches 5 points
  if (playerScore === 5 || computerScore === 5) {
    isGameOver = true; // Stop accepting new plays
    // Display match result
    matchStatus.textContent = playerScore === 5 ? "🏆 CHAMPION!" : "💀 DEFEATED!";
    resetBtn.style.display = "block"; // Show rematch button
    toggleButtons(true); // Disable choice buttons
  }
}

// Enables or disables all choice buttons (Rock/Paper/Scissors)
// Disabled = true during AI thinking or when match is over
function toggleButtons(disabled) { 
  document.querySelectorAll('.choice-btn').forEach(btn => btn.disabled = disabled); 
}

// ============================================
// MATCH RESET FUNCTION
// ============================================
// Resets the current match/mode back to 0-0
// Only affects the currently selected mode (other modes keep their scores)
function resetGame() {
  // Reset scores for current mode only
  playerScore = 0; 
  computerScore = 0; 
  winStreak = 0; 
  isGameOver = false;
  
  // Save reset scores to current mode
  scores[currentMode].player = 0;
  scores[currentMode].computer = 0;
  
  // Update UI displays
  playerScoreDisplay.textContent = 0;
  computerScoreDisplay.textContent = 0;
  resultDisplay.textContent = ""; // Clear result text
  matchStatus.textContent = ""; // Clear winner message
  streakDisplay.textContent = ""; // Clear streak badge
  playerDisplay.textContent = "PLAYER: —"; // Reset choice displays
  computerDisplay.textContent = "COMPUTER: —";
  
  // Hide rematch button and enable choice buttons
  resetBtn.style.display = "none";
  toggleButtons(false);
}
