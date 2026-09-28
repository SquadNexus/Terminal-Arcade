const outputScreen = document.getElementById('output-screen');
const userInput = document.getElementById('user-input');

let gameState = null; // Can be 'HACKING', 'GUESSING', or null
let secretCode = null;
let targetNumber = null;

// Focus input whenever clicking anywhere on the terminal window
document.addEventListener('click', () => userInput.focus());

// Function to handle clicks from the button panel
function triggerCommand(cmd) {
    appendOutput(`guest@i_am_squardii:~$ ${cmd}`, 'user-cmd');
    processCommand(cmd);
    outputScreen.scrollTop = outputScreen.scrollHeight;
}

userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const command = userInput.value.trim();
        if (command === '') return;

        appendOutput(`guest@i_am_squardii:~$ ${command}`, 'user-cmd');
        processCommand(command);
        userInput.value = '';
        outputScreen.scrollTop = outputScreen.scrollHeight;
    }
});

function appendOutput(text, className = '') {
    const p = document.createElement('p');
    p.textContent = text;
    if (className) p.className = className;
    outputScreen.appendChild(p);
}

function processCommand(cmd) {
    const lowerCmd = cmd.toLowerCase();

    // Allow exiting active games
    if (lowerCmd === 'exit' && gameState !== null) {
        gameState = null;
        appendOutput(`[ABORTED] Exited current game protocol.\n`);
        return;
    }

    // Route inputs based on active game mode
    if (gameState === 'HACKING') {
        handleHackingGame(lowerCmd);
        return;
    }
    if (gameState === 'GUESSING') {
        handleGuessingGame(lowerCmd);
        return;
    }

    switch (lowerCmd) {
        case 'help':
            appendOutput(`AVAILABLE COMMANDS:
  help           - Show this help menu
  about          - Display system operator info
  boot           - Replay system initialization sequence
  clear          - Clear terminal screen
  play hack      - Launch 4-digit code cracking mini-game
  play guess     - Launch 1-100 number guessing game
  socials        - Display network profiles & links
`);
            break;

        case 'about':
            appendOutput(`OPERATOR: Yona Laurent Anthony (i_am_squardii)
CLASS:    Computer Engineering @ MUST (Tanzania)
STACK:    HTML, CSS, JavaScript, MySQL, Linux
STATUS:   Active Developer & Game Modder`);
            break;

        case 'boot':
            appendOutput(`[ OK ] mounting identity ..................... yona laurent anthony
[ OK ] handle ................................ i_am_squardii
[ OK ] establishing secure socket link ........ [ONLINE]`);
            break;

        case 'clear':
            outputScreen.innerHTML = `
            <h1 class="brand-title">SquadNexus</h1>
            <p class="welcome-text">INITIALIZING SYSTEM KERNEL (SquadNexus OS v1.0)...</p>
            <p class="welcome-text">Select an arcade protocol or type commands below:</p>
            <div class="quick-buttons">
                <button onclick="triggerCommand('help')">[ HELP ]</button>
                <button onclick="triggerCommand('about')">[ ABOUT ]</button>
                <button onclick="triggerCommand('socials')">[ SOCIALS ]</button>
                <button onclick="triggerCommand('play hack')">[ PLAY HACK ]</button>
                <button onclick="triggerCommand('play guess')">[ NUMBER GUESS ]</button>
                <button onclick="triggerCommand('clear')">[ CLEAR ]</button>
            </div>
            <br>`;
            break;

        case 'socials':
            appendOutput(`GITHUB:  github.com/i_am_squardii
PORTFOLIO: Active Web Platform & Game Repacks Storage`);
            break;

        case 'play hack':
            startHackingGame();
            break;

        case 'play guess':
            startGuessingGame();
            break;

        default:
            appendOutput(`Command not recognized: '${cmd}'. Type 'help' for available commands.`);
    }
}

// --- MINI GAME 1: 4-Digit Code Cracking ---
function startHackingGame() {
    gameState = 'HACKING';
    secretCode = Math.floor(1000 + Math.random() * 9000);
    appendOutput(`\n[SECURE FIREWALL ENGAGED]`);
    appendOutput(`A 4-digit mainframe passcode has been generated.`);
    appendOutput(`Type your 4-digit guess below (or type 'exit' to quit):`);
}

function handleHackingGame(input) {
    const guess = parseInt(input);
    if (isNaN(guess) || input.length !== 4) {
        appendOutput(`[ERROR] Invalid input. Enter a 4-digit number or type 'exit'.`);
        return;
    }

    if (guess === secretCode) {
        appendOutput(`[ACCESS GRANTED] Mainframe successfully compromised! You win! 🎉\n`, 'highlight');
        gameState = null;
    } else if (guess < secretCode) {
        appendOutput(`[ACCESS DENIED] Target code is HIGHER than ${guess}. Try again:`);
    } else {
        appendOutput(`[ACCESS DENIED] Target code is LOWER than ${guess}. Try again:`);
    }
}

// --- MINI GAME 2: Number Guessing (1 to 100) ---
function startGuessingGame() {
    gameState = 'GUESSING';
    targetNumber = Math.floor(Math.random() * 100) + 1;
    appendOutput(`\n[NUMBER GUESSING PROTOCOL ACTIVE]`);
    appendOutput(`I have picked a secret number between 1 and 100.`);
    appendOutput(`Type your guess below (or type 'exit' to quit):`);
}

function handleGuessingGame(input) {
    const guess = parseInt(input);
    if (isNaN(guess)) {
        appendOutput(`[ERROR] Please enter a valid number or type 'exit'.`);
        return;
    }

    if (guess === targetNumber) {
        appendOutput(`[CORRECT] You guessed the secret number! Arcade stage cleared! 🏆\n`, 'highlight');
        gameState = null;
    } else if (guess < targetNumber) {
        appendOutput(`Too low! Try a higher number:`);
    } else {
        appendOutput(`Too high! Try a lower number:`);
    }
}
