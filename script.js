<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SQUADNEXUS // Terminal Arcade</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="crt-overlay"></div>
    <div class="terminal-container">
        <header class="terminal-header">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
            <span class="title">i_am_squardii@SquadNexus:~</span>
        </header>
        
        <div id="output-screen" class="output-screen">
            <p class="welcome-text">
  ███████╗ ██████╗ ██╗   ██╗ █████╗ ██████╗ 
  ██╔════╝██╔═══██╗██║   ██║██╔══██╗██╔══██╗
  ███████╗██║   ██║██║   ██║███████║██║  ██║
  ╚════██║██║   ██║██║   ██║██╔══██║██║  ██║
  ███████║╚██████╔╝╚██████╔╝██║  ██║██████╔╝
  ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═════╝ 
            </p>
            <p class="welcome-text">INITIALIZING SYSTEM KERNEL (SquadNexus OS v1.0)...</p>
            <p class="welcome-text">Type <span class="highlight">'help'</span> to view available commands and arcade protocols.</p>
            <br>
        </div>

        <div class="input-line">
            <span class="prompt">guest@SquadNexus:~$</span>
            <input type="text" id="user-input" autofocus autocomplete="off" spellcheck="false">
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
```[cite: 6]

---

### 2. `script.js`
```javascript
const outputScreen = document.getElementById('output-screen');
const userInput = document.getElementById('user-input');

let gameState = null; // Used for interactive games like number guessing
let secretCode = null;

// Focus input whenever clicking anywhere on the terminal window
document.addEventListener('click', () => userInput.focus());

userInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const command = userInput.value.trim();
        if (command === '') return;

        // Print user command to screen
        appendOutput(`guest@SquadNexus:~$ ${command}`, 'user-cmd');
        
        // Process command
        processCommand(command);
        
        // Clear input field
        userInput.value = '';
        
        // Scroll to bottom
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

    // Handle active mini-game states first
    if (gameState === 'HACKING') {
        handleHackingGame(lowerCmd);
        return;
    }

    switch (lowerCmd) {
        case 'help':
            appendOutput(`AVAILABLE COMMANDS:
  help           - Show this help menu
  about          - Display system operator info
  boot           - Replay system initialization sequence
  clear          - Clear terminal screen
  play hack      - Launch cyber-heist hacking mini-game
  socials        - Display network profiles & links
`);
            break;

        case 'about':
            appendOutput(`OPERATOR: Yona Laurent Anthony (i_am_squardii)
CLASS:    Computer Engineering @ MUST (Tanzania)
HANDLE:   SquadNexus
STACK:    HTML, CSS, JavaScript, MySQL, Linux
STATUS:   Active Developer & Game Modder`);
            break;

        case 'boot':
            appendOutput(`[ OK ] mounting identity ..................... yona laurent anthony
[ OK ] handle ................................ SquadNexus
[ OK ] establishing secure socket link ........ [ONLINE]`);
            break;

        case 'clear':
            outputScreen.innerHTML = '';
            break;

        case 'socials':
            appendOutput(`GITHUB:  github.com/SquadNexus
PORTFOLIO: Active Web Platform & Game Repacks Storage`);
            break;

        case 'play hack':
            startHackingGame();
            break;

        default:
            appendOutput(`Command not recognized: '${cmd}'. Type 'help' for available commands.`);
    }
}

function startHackingGame() {
    gameState = 'HACKING';
    secretCode = Math.floor(1000 + Math.random() * 9000); // Generates 4-digit code
    appendOutput(`\n[SECURE FIREWALL ENGAGED]`);
    appendOutput(`A 4-digit mainframe security code has been generated.`);
    appendOutput(`Type a 4-digit number to crack the firewall (or type 'exit' to abort):`);
}

function handleHackingGame(input) {
    if (input === 'exit') {
        gameState = null;
        appendOutput(`[ABORTED] Exiting hacking protocol.\n`);
        return;
    }

    const guess = parseInt(input);
    if (isNaN(guess) || input.length !== 4) {
        appendOutput(`[ERROR] Invalid input. Please enter a 4-digit number or 'exit'.`);
        return;
    }

    if (guess === secretCode) {
        appendOutput(`[ACCESS GRANTED] Firewall bypassed successfully! You win! 🎉\n`, 'highlight');
        gameState = null;
    } else if (guess < secretCode) {
        appendOutput(`[ACCESS DENIED] Target code is HIGHER than ${guess}. Try again:`);
    } else {
        appendOutput(`[ACCESS DENIED] Target code is LOWER than ${guess}. Try again:`);
    }
}
```[cite: 5]

---

### 3. `style.css`
```css
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    background-color: #050508;
    color: #00ffcc;
    font-family: 'Courier New', Courier, monospace;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

/* CRT Scanline and Flicker Effect */
.crt-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    background-size: 100% 4px, 6px 100%;
    pointer-events: none;
    z-index: 10;
}

.terminal-container {
    width: 90%;
    max-width: 800px;
    height: 550px;
    background: rgba(10, 14, 20, 0.95);
    border: 2px solid #00ffcc;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0, 255, 204, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    z-index: 5;
}

.terminal-header {
    background: #111827;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #00ffcc;
}

.dot {
    height: 12px;
    width: 12px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 6px;
}
.red { background-color: #ff5f56; }
.yellow { background-color: #ffbd2e; }
.green { background-color: #27c93f; }

.title {
    margin-left: 10px;
    font-size: 13px;
    color: #9ca3af;
}

.output-screen {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
}

.highlight {
    color: #ff007f;
    font-weight: bold;
}

.input-line {
    display: flex;
    padding: 15px 20px;
    background: #080c14;
    border-top: 1px solid #1f2937;
    align-items: center;
}

.prompt {
    color: #3b82f6;
    margin-right: 10px;
    font-weight: bold;
}

#user-input {
    flex: 1;
    background: transparent;
    border: none;
    color: #00ffcc;
    font-family: 'Courier New', Courier, monospace;
    font-size: 15px;
    outline: none;
}
```[cite: 4]
