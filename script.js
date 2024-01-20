// Canvas
const { body } = document;
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
const width = 500;
const height = 700;
const screenWidth = window.innerWidth;
const canvasPosition = screenWidth / 2 - width / 2;
const isMobile = window.matchMedia('(max-width: 600px)');
const mainMenu = document.createElement('div'); // A main menu
const gameOverEl = document.createElement('div');

// Paddle
const paddleHeight = 10;
const paddleWidth = 50;
const paddleDiff = 25;
let paddleBottomX = 225;
let paddleTopX = 225;
let playerMoved = false;
let paddleContact = false;

// Ball
let ballX = 250;
let ballY = 350;
const ballRadius = 5;

// Speed
let speedY;
let speedX;
let trajectoryX;
let computerSpeed;

// Random numbers
const rnd = []
rndCurrent = 0
rndNext = 1

function rndArray() {
  for (i = 0; i < 200; i++) {
    rnd.push(Math.floor(Math.random()*10))
  }
}

// Phone number array

phone = ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_']
phoneAux = 0
phoneNumber = ''

// Change Mobile Settings
if (isMobile.matches) {
  speedY = -2;
  speedX = speedY;
  computerSpeed = 4;
} else {
  speedY = -1;
  speedX = speedY;
  computerSpeed = 3;
}

// Score
let isGameOver = false;
let isNewGame = true;

// Render Everything on Canvas
function renderCanvas() {
  // Canvas Background
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);

  // Paddle Color
  context.fillStyle = 'white';

  // Player Paddle (Bottom)
  context.fillRect(paddleBottomX, height - 20, paddleWidth, paddleHeight);

  // Computer Paddle (Top)
  context.fillRect(paddleTopX, 10, paddleWidth, paddleHeight);

  // Dashed Center Line
  context.beginPath();
  context.setLineDash([4]);
  context.moveTo(0, 350);
  context.lineTo(500, 350);
  context.strokeStyle = 'grey';
  context.stroke();

  // Ball
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false);
  context.fillStyle = 'white';
  context.fill();

  // Score
  context.font = '32px Courier New';
  context.fillText(rnd[rndNext], 20, canvas.height / 2 + 50);
  context.fillText(rnd[rndCurrent], 20, canvas.height / 2 - 30);
  context.fillText('Next', 60, canvas.height / 2 + 50);
  context.fillText('Current', 60, canvas.height / 2 - 30);
  context.fillText('+', 20, canvas.height / 2 + 10);
  context.fillText(phone[0], 40, canvas.height / 2 + 10);
  context.fillText(phone[1], 60, canvas.height / 2 + 10);
  context.fillText(phone[2], 100, canvas.height / 2 + 10);
  context.fillText(phone[3], 140, canvas.height / 2 + 10);
  context.fillText(phone[4], 180, canvas.height / 2 + 10);
  context.fillText(phone[5], 220, canvas.height / 2 + 10);
  context.fillText(phone[6], 260, canvas.height / 2 + 10);
  context.fillText(phone[7], 300, canvas.height / 2 + 10);
  context.fillText(phone[8], 340, canvas.height / 2 + 10);
  context.fillText(phone[9], 380, canvas.height / 2 + 10);
  context.fillText(phone[10], 420, canvas.height / 2 + 10);
  context.fillText(phone[11], 460, canvas.height / 2 + 10);
}

// Create Canvas Element
function createCanvas() {
  canvas.width = width;
  canvas.height = height;
  body.appendChild(canvas);
  renderCanvas();
}

// Reset Ball to Center
function ballReset() {
  ballX = width / 2;
  ballY = height / 2;
  speedY = -3;
  paddleContact = false;
}

// Adjust Ball Movement
function ballMove() {
  // Vertical Speed
  ballY += -speedY;
  // Horizontal Speed
  if (playerMoved && paddleContact) {
    ballX += speedX;
  }
}

// Determine What Ball Bounces Off, Score Points, Reset Ball
function ballBoundaries() {
  // Bounce off Left Wall
  if (ballX < 0 && speedX < 0) {
    speedX = -speedX;
  }
  // Bounce off Right Wall
  if (ballX > width && speedX > 0) {
    speedX = -speedX;
  }
  // Bounce off player paddle (bottom)
  if (ballY > height - paddleDiff) {
    if (ballX > paddleBottomX && ballX < paddleBottomX + paddleWidth) {
      paddleContact = true;
      // Add Speed on Hit
      if (playerMoved) {
        speedY -= 1;
        // Max Speed
        if (speedY < -5) {
          speedY = -5;
          computerSpeed = 3;
        }
      }
      speedY = -speedY;
      trajectoryX = ballX - (paddleBottomX + paddleDiff);
      speedX = trajectoryX * 0.3;
    } else if (ballY > height) {
      // Reset Ball, ignore current
      ballReset();
      rndNext ++  // Increment auxiliary to display the next random number
      rndCurrent ++ // Increment auxiliary to display the current number
    }
  }
  // Bounce off computer paddle (top)
  if (ballY < paddleDiff) {
    if (ballX > paddleTopX && ballX < paddleTopX + paddleWidth) {
      // Add Speed on Hit
      if (playerMoved) {
        speedY += 1;
        // Max Speed
        if (speedY > 5) {
          speedY = 5;
        }
      }
      speedY = -speedY;
    } else if (ballY < 0) {
      // Reset Ball, add current
      ballReset();
      phone[phoneAux] = rnd[rndCurrent]; // Add number to phone array
      phoneAux ++ // Increment auxiliary to go through the phone array
      rndNext ++  // Increment auxiliary to display the next random number
      rndCurrent ++ // Increment auxiliary to display the current number
    }
  }
}

// Computer Movement
function computerAI() {
  if (playerMoved) {
    if (paddleTopX + paddleDiff < ballX) {
      paddleTopX += computerSpeed;
    } else {
      paddleTopX -= computerSpeed;
    }
  }
}

function showGameOverEl() {
  // Hide Canvas
  canvas.hidden = true;
  // Container
  gameOverEl.textContent = '';
  gameOverEl.classList.add('game-over-container');
  // Title
  const title = document.createElement('h1');
  title.style.width = '300px'
  title.textContent = `Your number is \n+${phone[0]}${phone[1]} ${phone.splice(2).join('')}!`;
  // Button
  const playAgainBtn = document.createElement('button');
  playAgainBtn.setAttribute('onclick', 'startGame()');
  playAgainBtn.textContent = 'Type another number';
  // Append
  gameOverEl.append(title, playAgainBtn);
  body.appendChild(gameOverEl);
}

// Check if the number is complete, End Game
function gameOver() {
  if (phoneAux === phone.length) {
    isGameOver = true;
    showGameOverEl();
  }
}

// Called Every Frame
function animate() {
  renderCanvas();
  ballMove();
  ballBoundaries();
  computerAI();
  gameOver();
  if (!isGameOver) {
    window.requestAnimationFrame(animate);
  }
}

// Start Game, Reset Everything
function startGame() {
  if (isGameOver && !isNewGame) { // Changed this to accommodate the Main Menu
    body.removeChild(gameOverEl);
    canvas.hidden = false;
  } else {
    body.removeChild(mainMenu);
    canvas.hidden = false;
  }
  isGameOver = false;
  isNewGame = false;
  playerScore = 0;
  computerScore = 0;

  rndCurrent = 0
  rndNext = 1

  phone = ['_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_', '_']
  phoneAux = 0
  rndArray()

  ballReset();
  createCanvas();
  animate();
  canvas.addEventListener('mousemove', (e) => {
    playerMoved = true;
    // Compensate for canvas being centered
    paddleBottomX = e.clientX - canvasPosition - paddleDiff;
    if (paddleBottomX < paddleDiff) {
      paddleBottomX = 0;
    }
    if (paddleBottomX > width - paddleWidth) {
      paddleBottomX = width - paddleWidth;
    }
    // Hide Cursor
    canvas.style.cursor = 'none';
  });
}

function showMainMenu() {
  // Hide Canvas
  canvas.hidden = true;
  // Container
  mainMenu.textContent = '';
  mainMenu.classList.add('game-over-container');
  // Title
  const title = document.createElement('h1');
  title.style.width = '400px'
  title.textContent = `BAD UIs - Pongalong`;
  const text = document.createElement('p')
  text.style.width = '90%'
  text.textContent = "In this adventure you have to type your phone number's digits one by one. To do so you will see the current and the next number in a random array and you have to score to add the current number or let the computer score to ignore the current number. Good luck!"
  // Button
  const playBtn = document.createElement('button');
  playBtn.setAttribute('onclick', 'startGame()');
  playBtn.textContent = "Let's suffer";
  // Append
  mainMenu.append(title, text, playBtn);
  body.appendChild(mainMenu);
}

// On Load
showMainMenu();