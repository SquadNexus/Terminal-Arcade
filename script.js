const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameInstructions = document.getElementById('game-instructions');

let gameInterval = null;
let isPlaying = false;

// Bird / Character object
let bird = {
    x: 50,
    y: 150,
    radius: 12,
    gravity: 0.5,
    lift: -8,
    velocity: 0
};

// Barriers / Pipes array
let pipes = [];
let frameCount = 0;
let score = 0;

function startBirdGame() {
    canvas.style.display = 'block';
    gameInstructions.textContent = "Click canvas or press SPACEBAR to fly! Avoid barriers!";
    
    // Reset game variables
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frameCount = 0;
    score = 0;
    isPlaying = true;

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, 1000 / 60); // 60 FPS
}

function resetArcade() {
    isPlaying = false;
    if (gameInterval) clearInterval(gameInterval);
    canvas.style.display = 'none';
    gameInstructions.textContent = "Click '[ PLAY BIRD DODGE ]' above to start playing!";
}

// Controls: Click canvas or press Space
canvas.addEventListener('click', () => {
    if (isPlaying) bird.velocity = bird.lift;
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && isPlaying) {
        e.preventDefault();
        bird.velocity = bird.lift;
    }
});

function updateGame() {
    // Clear screen
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Apply gravity to bird
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Boundary checks (floor and ceiling)
    if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        endGame();
    }

    // Draw Bird
    ctx.fillStyle = '#00ffcc';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();

    // Generate Pipes / Barriers
    if (frameCount % 90 === 0) {
        let minHeight = 50;
        let maxHeight = canvas.height - 150;
        let gapHeight = 110;
        let topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;

        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: topHeight + gapHeight,
            width: 50,
            passed: false
        });
    }

    // Move and draw pipes
    ctx.fillStyle = '#ff007f';
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 3;

        // Draw top pipe
        ctx.fillRect(pipes[i].x, 0, pipes[i].width, pipes[i].top);
        // Draw bottom pipe
        ctx.fillRect(pipes[i].x, pipes[i].bottom, pipes[i].width, canvas.height - pipes[i].bottom);

        // Check collision
        if (
            bird.x + bird.radius > pipes[i].x &&
            bird.x - bird.radius < pipes[i].x + pipes[i].width &&
            (bird.y - bird.radius < pipes[i].top || bird.y + bird.radius > pipes[i].bottom)
        ) {
            endGame();
        }

        // Score points
        if (!pipes[i].passed && pipes[i].x + pipes[i].width < bird.x) {
            score++;
            pipes[i].passed = true;
        }

        // Remove off-screen pipes
        if (pipes[i].x + pipes[i].width < 0) {
            pipes.splice(i, 1);
        }
    }

    // Draw Score
    ctx.fillStyle = '#00ffcc';
    ctx.font = '16px "Courier New", monospace';
    ctx.fillText(`SCORE: ${score}`, 20, 30);

    frameCount++;
}

function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);

    ctx.fillStyle = 'rgba(5, 5, 8, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ff5f56';
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

    ctx.fillStyle = '#00ffcc';
    ctx.font = '16px "Courier New", monospace';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 15);
    ctx.fillText('Click [ PLAY BIRD DODGE ] to Retry', canvas.width / 2, canvas.height / 2 + 50);
    ctx.textAlign = 'left';
}
