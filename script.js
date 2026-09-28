const outputScreen = document.getElementById('output-screen');
const userInput = document.getElementById('user-input');

// Focus input whenever clicking anywhere on the terminal window
document.addEventListener('click', () => userInput.focus());

// Function to handle clicks from the no-code button panel
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

    switch (lowerCmd) {
        case 'help':
            appendOutput(`AVAILABLE COMMANDS:
  help           - Show this help menu
  about          - Display system operator info
  boot           - Replay system initialization sequence
  clear          - Clear terminal screen
  play hack      - Launch automated cyber-heist simulation
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
            <p class="welcome-text">Type commands below or click a quick action:</p>
            <div class="quick-buttons">
                <button onclick="triggerCommand('help')">[ HELP ]</button>
                <button onclick="triggerCommand('about')">[ ABOUT ]</button>
                <button onclick="triggerCommand('socials')">[ SOCIALS ]</button>
                <button onclick="triggerCommand('play hack')">[ PLAY HACK ]</button>
                <button onclick="triggerCommand('clear')">[ CLEAR ]</button>
            </div>
            <br>`;
            break;

        case 'socials':
            appendOutput(`GITHUB:  github.com/i_am_squardii
PORTFOLIO: Active Web Platform & Game Repacks Storage`);
            break;

        case 'play hack':
            runAutomatedHack();
            break;

        default:
            appendOutput(`Command not recognized: '${cmd}'. Type 'help' for available commands.`);
    }
}

function runAutomatedHack() {
    appendOutput(`\n[SECURE FIREWALL ENGAGED]`);
    appendOutput(`Initiating automated brute-force bypass sequence...`);
    
    // Simulate steps automatically using timeouts so it looks like a real live hack
    setTimeout(() => {
        appendOutput(`[>] Scanning mainframe ports... [OK]`);
        outputScreen.scrollTop = outputScreen.scrollHeight;
    }, 600);

    setTimeout(() => {
        appendOutput(`[>] Injecting payload into node sector 7... [OK]`);
        outputScreen.scrollTop = outputScreen.scrollHeight;
    }, 1200);

    setTimeout(() => {
        appendOutput(`[ACCESS GRANTED] Mainframe successfully compromised! 🎉\n`, 'highlight');
        outputScreen.scrollTop = outputScreen.scrollHeight;
    }, 1800);
}
