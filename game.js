const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game dimensions
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle dimensions
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const PADDLE_SPEED = 6;

// Ball dimensions
const BALL_SIZE = 14;
const BALL_SPEED = 5;

// Game objects
let leftPaddle = {
  x: 20,
  y: (HEIGHT - PADDLE_HEIGHT) / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT
};

let rightPaddle = {
  x: WIDTH - 20 - PADDLE_WIDTH,
  y: (HEIGHT - PADDLE_HEIGHT) / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT
};

let ball = {
  x: WIDTH / 2 - BALL_SIZE / 2,
  y: HEIGHT / 2 - BALL_SIZE / 2,
  size: BALL_SIZE,
  dx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
  dy: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1)
};

// Score
let leftScore = 0;
let rightScore = 0;

// Mouse paddle control
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  leftPaddle.y = mouseY - PADDLE_HEIGHT / 2;

  // Clamp paddle position
  if (leftPaddle.y < 0) leftPaddle.y = 0;
  if (leftPaddle.y > HEIGHT - PADDLE_HEIGHT) leftPaddle.y = HEIGHT - PADDLE_HEIGHT;
});

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
  // Ball movement
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Wall collision
  if (ball.y <= 0 || ball.y + BALL_SIZE >= HEIGHT) {
    ball.dy *= -1;
  }

  // Left paddle collision
  if (ball.x <= leftPaddle.x + leftPaddle.width &&
      ball.y + BALL_SIZE >= leftPaddle.y &&
      ball.y <= leftPaddle.y + leftPaddle.height) {
    ball.dx = Math.abs(ball.dx);
    // Add a bit of spin based on hit position
    let hitPos = (ball.y + BALL_SIZE / 2) - (leftPaddle.y + PADDLE_HEIGHT / 2);
    ball.dy += hitPos * 0.05;
  }

  // Right paddle collision
  if (ball.x + BALL_SIZE >= rightPaddle.x &&
      ball.y + BALL_SIZE >= rightPaddle.y &&
      ball.y <= rightPaddle.y + rightPaddle.height) {
    ball.dx = -Math.abs(ball.dx);
    let hitPos = (ball.y + BALL_SIZE / 2) - (rightPaddle.y + PADDLE_HEIGHT / 2);
    ball.dy += hitPos * 0.05;
  }

  // Score check
  if (ball.x < 0) {
    rightScore += 1;
    resetBall(-1);
  } else if (ball.x + BALL_SIZE > WIDTH) {
    leftScore += 1;
    resetBall(1);
  }

  // AI for right paddle (basic)
  let target = ball.y + BALL_SIZE / 2 - PADDLE_HEIGHT / 2;
  if (rightPaddle.y < target) {
    rightPaddle.y += PADDLE_SPEED;
  } else if (rightPaddle.y > target) {
    rightPaddle.y -= PADDLE_SPEED;
  }
  // Clamp AI paddle position
  if (rightPaddle.y < 0) rightPaddle.y = 0;
  if (rightPaddle.y > HEIGHT - PADDLE_HEIGHT) rightPaddle.y = HEIGHT - PADDLE_HEIGHT;
}

// Draw game objects
function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Draw middle line
  ctx.strokeStyle = '#fffafaff';
  ctx.beginPath();
  ctx.setLineDash([10, 10]);
  ctx.moveTo(WIDTH / 2, 0);
  ctx.lineTo(WIDTH / 2, HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

  // Draw ball as circle
  ctx.beginPath();
  ctx.arc(ball.x + BALL_SIZE / 2, ball.y + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
  ctx.fillStyle = '#ff9901fb';
  ctx.fill();
  ctx.closePath();

  // Draw scores
  ctx.font = '32px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText(leftScore, WIDTH / 4, 50);
  ctx.fillText(rightScore, WIDTH * 3 / 4, 50);
}


// Reset ball after score
function resetBall(direction) {
  ball.x = WIDTH / 2 - BALL_SIZE / 2;
  ball.y = HEIGHT / 2 - BALL_SIZE / 2;
  ball.dx = BALL_SPEED * direction;
  ball.dy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
}

gameLoop();