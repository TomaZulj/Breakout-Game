const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Brzina i smjer loptice
let dx = Math.random() * 8 - 4;
let dy = -5;

// LOPTICA

// Odredujemo velicinu i polozaj loptice
const ballRadius = 10;

let x = canvas.width / 2;
let y = canvas.height - 30;

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DE";
  ctx.fill();
  ctx.closePath();
}

// PALICA

// Odredujemo velicinu palice i njen polozaj
const paddleHeight = 10;
const paddleWidth = 320;
let paddleX = (canvas.width - paddleWidth) / 2;

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight - 5, paddleWidth, paddleHeight);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.strokeStyle = "#0095DE";
  ctx.lineWidth = 2;
  ctx.strokeRect(paddleX, canvas.height - paddleHeight - 5, paddleWidth, paddleHeight);
  ctx.closePath();
}

// Kretanje palice
function movePaddle() {
  if (rightPressed) {
    paddleX = Math.min(paddleX + 8, canvas.width - paddleWidth);
  } else if (leftPressed) {
    paddleX = Math.max(paddleX - 8, 0);
  }
}

//CIGLE

// Odredujemo velicinu, polozaj, broj i raspored cigli
const brickRows = 3;
const brickColumns = 3;
const brickWidth = 320;
const brickHeight = 60;
const brickPadding = 70;
const brickOffsetTop = 50;
const brickOffsetLeft = (canvas.width - (brickColumns * (brickWidth + brickPadding) - brickPadding)) / 2;

// Kreiramo dvodimenzionalno polje za cigle
const bricks = [];
for (let c = 0; c < brickColumns; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRows; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

// Slika cigle
const brickImage = new Image();
brickImage.src = "/images/brick.png";

// Crtamo cigle uz pomoc funkcije
function drawBricks() {
  for (let c = 0; c < brickColumns; c++) {
    for (let r = 0; r < brickRows; r++) {
      // Ako je cigla aktivna, nacrtaj je
      if (bricks[c][r].status === 1) {
        // Odredujemo polozaj cigle
        const brickXaxis = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickYaxis = r * (brickHeight + brickPadding) + brickOffsetTop;

        // Crtamo ciglu
        bricks[c][r].x = brickXaxis;
        bricks[c][r].y = brickYaxis;
        ctx.beginPath();
        ctx.drawImage(brickImage, brickXaxis, brickYaxis, brickWidth, brickHeight);
        ctx.strokeStyle = "#0095DE";
        ctx.lineWidth = 2;
        ctx.strokeRect(brickXaxis, brickYaxis, brickWidth, brickHeight);
        ctx.closePath();
      }
    }
  }
}

//TIPKE

// Namjestanje tipki za kretanje palice
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  // Ako je pritisnuta tipka lijevo ili desno, postavi varijablu na true
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  // Ako je tipka pustena, postavi varijablu na false
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

// REZULTAT

// Ispis rezultata i dohvat najboljeg rezultata
let score = 0;
let maxScore = localStorage.getItem("maxScore") || 0;
let gameOver = false;

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${score}`, 1420, 30);
  ctx.fillText(`Max Score: ${maxScore}`, 1420, 50);
}

function setMaxScore() {
  // Izracunaj najbolji rezultat
  maxScore = Math.max(score, maxScore);

  // Pohrana najboljeg rezultata
  localStorage.setItem("maxScore", maxScore);
}

// KOLIZIJA

// Provjera kolizije loptice i cigli
function collision() {
  for (let c = 0; c < brickColumns; c++) {
    for (let r = 0; r < brickRows; r++) {
      const active_brick = bricks[c][r];
      if (active_brick.status === 1) {
        // Ako se loptica sudari s ciglom
        if (x > active_brick.x && x < active_brick.x + brickWidth && y > active_brick.y && y < active_brick.y + brickHeight) {
          // Promjeni smjer loptice
          dy = -dy;
          active_brick.status = 0;

          // Povecaj rezultat
          score++;

          // Provjeri je li igra zavrsena
          if (score === brickRows * brickColumns) {
            // Pohrana najboljeg rezultata
            setMaxScore();

            gameOver = true;

            // Ispis poruke o pobjedi
            drawMessage("YOU WIN, CONGRATULATIONS!");
            drawButton();
            return;
          }
        }
      }
    }
  }
}

// PORUKA

// Ispis poruke
function drawMessage(message) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "48px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

// RELOAD

// Gumb za ponovno pokretanje igre
function drawButton() {
  const button = document.createElement("button");
  button.innerHTML = "Reload";
  button.style.position = "absolute";
  button.style.left = "50%";
  button.style.top = "60%";
  button.style.transform = "translate(-50%, -50%)";
  button.style.padding = "15px 25px";
  button.style.fontSize = "20px";
  button.style.cursor = "pointer";
  document.body.appendChild(button);
  button.addEventListener("click", () => {
    document.location.reload();
  });
}

// ANIMACIJA

function draw() {
  // Dok god igra nije zavrsena, nastavi s crtanjem
  if (!gameOver) {
    // Brisanje prethodnog stanja
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Crtanje svih elemenata i provodenje detekcije kolizije
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collision();

    x += dx;
    y += dy;

    // Promjena smjera loptice ako se sudari s desnim ili lijevim rubom
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }

    // Promjena smjera loptice ako se sudari s gornjim rubom ili palicom
    if (y + dy < ballRadius) {
      dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
      // Ako se loptica sudari s palicom promijeni smjer, inace igra zavrsava
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        // Pohrana najboljeg rezultata
        setMaxScore();

        // Ispis poruke o gubitku
        drawMessage("GAME OVER");
        drawButton();
        gameOver = true;
        return;
      }
    }

    // Funkcija za kretanje palice
    movePaddle();

    // Ponovno crtanje
    requestAnimationFrame(draw);
  }
}

// Pokretanje igre
draw();
