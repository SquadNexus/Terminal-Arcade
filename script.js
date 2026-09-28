const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameInstructions = document.getElementById('game-instructions');

let gameInterval = null;
let activeGame = null; // 'bird' or 'river'

// ==================== BIRD GAME VARIABLES ====================
let bird = { x: 50, y: 150, radius: 12, gravity: 0.5, lift: -8, velocity: 0 };
let pipes = [];
let birdScore = 0;

// ==================== RIVER JUMP VARIABLES ====================
let runner = { x: 80, y: 220, width: 20, height: 30, gravity: 0.6, lift: -10, velocity: 0, grounded: false };
let stones = [];
let riverSpeed = 3;
let riverScore = 0;
let waterOffset = 0;

// Focus window / Controls
canvas.addEventListener('click', () => handlePlayerAction());
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        handlePlayerAction();
    }
});

function handlePlayerAction() {
    if (activeGame === 'bird') {
        bird.velocity = bird.lift;
    } else if (activeGame === 'river' && runner.grounded) {
        runner.velocity = runner.lift;
        runner.grounded = false;
    }
}

// ==================== GAME CONTROLLERS ====================
function startBirdGame() {
    canvas.style.display = 'block';
    activeGame = 'bird';
    gameInstructions.textContent = "Click canvas or press SPACEBAR to fly! Avoid barriers!";
    
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    birdScore = 0;

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateBirdGame, 1000 / 60);
}

function startRiverJumpGame() {
    canvas.style.display = 'block';
    activeGame = 'river';
    gameInstructions.textContent = "Click or SPACEBAR to jump across stones! Don't fall in the water!";
    
    runner.y = 200;
    runner.velocity = 0;
    runner.grounded = false;
    stones = [];
    riverScore = 0;
    waterOffset = 0;

    // Initial starting stone for safety
    stones.push({ x: 50, y: 250, width: 120, height: 80 });

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateRiverGame, 1000 / 60);
}

function resetArcade() {
    activeGame = null;
    if (gameInterval) clearInterval(gameInterval);
    canvas.style.display = 'none';
    gameInstructions.textContent = "Click an arcade game above to start playing!";
}

// ==================== BIRD GAME LOOP ====================
function updateBirdGame() {
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        endGame('bird', birdScore);
        return;
    }

    // Draw Bird
    ctx.fillStyle = '#00ffcc';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();

    // Pipes generator
    if (Math.random() < 0.018) {
        let topHeight = Math.floor(Math.random() * 150) + 40;
        let gap = 110;
        pipes.push({ x: canvas.width, top: topHeight, bottom: topHeight + gap, width: 50, passed: false });
    }

    ctx.fillStyle = '#ff007f';
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 3;
        ctx.fillRect(pipes[i].x, 0, pipes[i].width, pipes[i].top);
        ctx.fillRect(pipes[i].x, pipes[i].bottom, pipes[i].width, canvas.height - pipes[i].bottom);

        if (
            bird.x + bird.radius > pipes[i].x &&
            bird.x - bird.radius < pipes[i].x + pipes[i].width &&
            (bird.y - bird.radius < pipes[i].top || bird.y + bird.radius > pipes[i].bottom)
        ) {
            endGame('bird', birdScore);
            return;
        }

        if (!pipes[i].passed && pipes[i].x + pipes[i].width < bird.x) {
            birdScore++;
            pipes[i].passed = true;
        }

        if (pipes[i].x + pipes[i].width < 0) pipes.splice(i, 1);
    }

    ctx.fillStyle = '#00ffcc';
    ctx.font = '16px "Courier New", monospace';
    ctx.fillText(`SCORE: ${birdScore}`, 20, 30);
}

// ==================== RIVER JUMP GAME LOOP ====================
function updateRiverGame() {
    // 1. Draw Flowing Cyber River Background
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Animated water wave lines
    ctx.strokeStyle = '#00ffcc44';
    ctx.lineWidth = 2;
    waterOffset = (waterOffset - 2) % 40;
    for (let wx = waterOffset; wx < canvas.width; wx += 40) {
        ctx.beginPath();
        ctx.moveTo(wx, 260);
        ctx.lineTo(wx + 20, 275);
        ctx.lineTo(wx + 40, 260);
        ctx.stroke();
    }

    // Water base fill
    ctx.fillStyle = '#0369a1aa';
    ctx.fillRect(0, 270, canvas.width, canvas.height - 270);

    // 2. Apply Physics to Runner
    runner.velocity += runner.gravity;
    runner.y += runner.velocity;

    // 3. Move and Draw Stones
    ctx.fillStyle = '#475569';
    let onAnyStone = false;

    for (let i = stones.length - 1; i >= 0; i--) {
        stones[i].x -= riverSpeed;

        // Draw Stone Platform with retro detail
        ctx.fillRect(stones[i].x, stones[i].y, stones[i].width, stones[i].height);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(stones[i].x, stones[i].y, stones[i].width, 6); // Stone top edge highlight
        ctx.fillStyle = '#475569';

        // Collision Check: Is runner landing on this stone?
        if (
            runner.x + runner.width > stones[i].x &&
            runner.x < stones[i].x + stones[i].width &&
            runner.y + runner.height >= stones[i].y &&
            runner.y + runner.height <= stones[i].y + 15 &&
            runner.velocity >= 0
        ) {
            runner.y = stones[i].y - runner.height;
            runner.velocity = 0;
            runner.grounded = true;
            onAnyStone = true;
        }

        // Score tracking when passing stones
        if (!stones[i].passed && stones[i].x + stones[i].width < runner.x) {
            riverScore++;
            stones[i].passed = true;
        }

        // Remove off-screen stones
        if (stones[i].x + stones[i].width < 0) {
            stones.splice(i, 1);
        }
    }

    // If runner is not on a stone, they are airborne or falling
    if (!onAnyStone) {
        runner.grounded = false;
    }

    // Generate new stones dynamically
    if (stones.length === 0 || stones[stones.length - 1].x < canvas.width - 200) {
        let lastStone = stones[stones.length - 1];
        let nextX = lastStone ? lastStone.x + lastStone.width + Math.floor(Math.random() * 70) + 60 : canvas.width;
        let sWidth = Math.floor(Math.random() * 50) + 90; // Stone width
        stones.push({ x: nextX, y: 240, width: sWidth, height: 100, passed: false });
    }

    // 4. Fail Condition: Fell into the water!
    if (runner.y > 265) {
        endGame('river', riverScore);
        return;
    }

    // 5. Draw Runner (Cyber Character)
    ctx.fillStyle = '#ff007f';
    ctx.fillRect(runner.x, runner.y, runner.width, runner.height);
    ctx.fillStyle = '#00ffcc';
    // Runner visor glow
    ctx.fillRect(runner.x + 10, runner.y + 6, 8, 4);

    // 6. Draw Score
    ctx.fillStyle = '#00ffcc';
    ctx.font = '16px "Courier New", monospace';
    ctx.fillText(`STONES CROSSED: ${riverScore}`, 20, 30);
}

function endGame(gameType, finalScore) {
    if (gameInterval) clearInterval(gameInterval);

    ctx.fillStyle = 'rgba(5, 5, 8, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ff5f56';
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MISSION FAILED // PLUNGED INTO WATER', canvas.width / 2, canvas.height / 2 - 25);

    ctx.fillStyle = '#00ffcc';
    ctx.font = '16px "Courier New", monospace';
    ctx.fillText(`Final Score: ${finalScore}`, canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText('Click a game button above to Retry', canvas.width / 2, canvas.height / 2 + 45);
    ctx.textAlign = 'left';
}
