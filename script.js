const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameInstructions = document.getElementById('game-instructions');

let gameInterval = null;
let activeGame = null; // 'bird' or 'river'

// ==================== BIRD GAME VARIABLES ====================
let bird = { x: 80, y: 150, radius: 14, gravity: 0.5, lift: -8, velocity: 0 };
let pipes = [];
let birdScore = 0;

// ==================== RIVER JUMP VARIABLES ====================
let runner = { x: 90, y: 200, width: 22, height: 38, gravity: 0.6, lift: -10.5, velocity: 0, grounded: false };
let stones = [];
let riverSpeed = 3.2;
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

// Fullscreen API triggers
function requestGameFullscreen() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen().catch(err => console.log(err));
    } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
    }
}

function exitGameFullscreen() {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => console.log(err));
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

// ==================== GAME CONTROLLERS ====================
function startBirdGame() {
    canvas.style.display = 'block';
    requestGameFullscreen();
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
    requestGameFullscreen();
    activeGame = 'river';
    gameInstructions.textContent = "Click or SPACEBAR to jump across stones! Don't fall in the water!";
    
    runner.y = 190;
    runner.velocity = 0;
    runner.grounded = false;
    stones = [];
    riverScore = 0;
    waterOffset = 0;

    // Initial starting stone platform
    stones.push({ x: 40, y: 240, width: 140, height: 110 });

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateRiverGame, 1000 / 60);
}

function resetArcade() {
    activeGame = null;
    if (gameInterval) clearInterval(gameInterval);
    exitGameFullscreen();
    canvas.style.display = 'none';
    gameInstructions.textContent = "Click a game button above to start playing!";
}

// ==================== BIRD GAME LOOP (REALISTIC BIRD) ====================
function updateBirdGame() {
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        endGame('bird', birdScore);
        return;
    }

    // Draw Realistic Bird Asset
    ctx.save();
    ctx.translate(bird.x, bird.y);
    // Rotate slightly based on velocity
    let rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, bird.velocity * 0.08));
    ctx.rotate(rotation);

    // Bird Body
    ctx.fillStyle = '#00ffcc';
    ctx.beginPath();
    ctx.ellipse(0, 0, 14, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bird Wing (Flaps up and down depending on velocity)
    ctx.fillStyle = '#ff007f';
    ctx.beginPath();
    let wingOffset = bird.velocity < 0 ? -6 : 4;
    ctx.ellipse(-2, wingOffset, 7, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Bird Eye
    ctx.fillStyle = '#050508';
    ctx.beginPath();
    ctx.arc(6, -3, 2, 0, Math.PI * 2);
    ctx.fill();

    // Bird Beak
    ctx.fillStyle = '#ffbd2e';
    ctx.beginPath();
    ctx.moveTo(12, -2);
    ctx.lineTo(18, 0);
    ctx.lineTo(12, 3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

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

// ==================== RIVER JUMP GAME LOOP (REALISTIC RUNNER) ====================
function updateRiverGame() {
    // 1. Cyber River Background
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Animated water waves
    ctx.strokeStyle = '#00ffcc44';
    ctx.lineWidth = 2;
    waterOffset = (waterOffset - 2.5) % 40;
    for (let wx = waterOffset; wx < canvas.width; wx += 40) {
        ctx.beginPath();
        ctx.moveTo(wx, 260);
        ctx.lineTo(wx + 20, 275);
        ctx.lineTo(wx + 40, 260);
        ctx.stroke();
    }

    // Deep water fill
    ctx.fillStyle = '#0369a1aa';
    ctx.fillRect(0, 270, canvas.width, canvas.height - 270);

    // 2. Runner Physics
    runner.velocity += runner.gravity;
    runner.y += runner.velocity;

    // 3. Move and Draw Stone Platforms
    ctx.fillStyle = '#475569';
    let onAnyStone = false;

    for (let i = stones.length - 1; i >= 0; i--) {
        stones[i].x -= riverSpeed;

        // Draw textured stone platform
        ctx.fillRect(stones[i].x, stones[i].y, stones[i].width, stones[i].height);
        ctx.fillStyle = '#64748b';
        ctx.fillRect(stones[i].x, stones[i].y, stones[i].width, 6); // Stone top border highlight
        ctx.fillStyle = '#475569';

        // Collision Check: Runner landing precisely on stone surface
        if (
            runner.x + runner.width > stones[i].x + 4 &&
            runner.x < stones[i].x + stones[i].width - 4 &&
            runner.y + runner.height >= stones[i].y &&
            runner.y + runner.height <= stones[i].y + 18 &&
            runner.velocity >= 0
        ) {
            runner.y = stones[i].y - runner.height;
            runner.velocity = 0;
            runner.grounded = true;
            onAnyStone = true;
        }

        if (!stones[i].passed && stones[i].x + stones[i].width < runner.x) {
            riverScore++;
            stones[i].passed = true;
        }

        if (stones[i].x + stones[i].width < 0) {
            stones.splice(i, 1);
        }
    }

    if (!onAnyStone) {
        runner.grounded = false;
    }

    // Dynamic stone generation
    if (stones.length === 0 || stones[stones.length - 1].x < canvas.width - 220) {
        let lastStone = stones[stones.length - 1];
        let nextX = lastStone ? lastStone.x + lastStone.width + Math.floor(Math.random() * 80) + 70 : canvas.width;
        let sWidth = Math.floor(Math.random() * 60) + 100;
        stones.push({ x: nextX, y: 235, width: sWidth, height: 115, passed: false });
    }

    // 4. Fail Condition: Fell into the water!
    if (runner.y > 265) {
        endGame('river', riverScore);
        return;
    }

    // 5. Draw Realistic Human Runner Character
    let rx = runner.x;
    let ry = runner.y;

    // Head
    ctx.fillStyle = '#fbcfe8';
    ctx.beginPath();
    ctx.arc(rx + 11, ry + 6, 6, 0, Math.PI * 2);
    ctx.fill();

    // Torso (Cyber Suit Jacket)
    ctx.fillStyle = '#ff007f';
    ctx.fillRect(rx + 5, ry + 12, 12, 14);

    // Visor / Face Detail
    ctx.fillStyle = '#00ffcc';
    ctx.fillRect(rx + 10, ry + 5, 5, 3);

    // Legs (animated if grounded/jumping)
    ctx.fillStyle = '#38bdf8';
    if (!runner.grounded) {
        // Jumping pose (legs tucked)
        ctx.fillRect(rx + 4, ry + 26, 5, 8);
        ctx.fillRect(rx + 13, ry + 26, 5, 8);
    } else {
        // Running stance
        ctx.fillRect(rx + 3, ry + 26, 5, 12);
        ctx.fillRect(rx + 14, ry + 26, 5, 12);
    }

    // 6. Score Display
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
    ctx.fillText('GAME OVER // FINAL SCORE: ' + finalScore, canvas.width / 2, canvas.height / 2 - 15);

    ctx.fillStyle = '#00ffcc';
    ctx.font = '14px "Courier New", monospace';
    ctx.fillText('Press ESC to exit full screen or click HOME', canvas.width / 2, canvas.height / 2 + 20);
    ctx.textAlign = 'left';
}
