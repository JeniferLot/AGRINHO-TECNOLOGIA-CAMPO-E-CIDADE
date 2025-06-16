//Variáveis
let stage = 0;
let timeCounter = 0;

let personX = 50;
let tractorX = -200;

let cornPlants = [];
let cornGrowth = [];

let buyers = [];
let cornStock = [];
let sales = 0;
let beepTimer = 0;

function setup() {
  createCanvas(600, 400);
  frameRate(30);
  textAlign(CENTER, CENTER);
  textSize(32);
}

function draw() {
  background("#8ADDE7");
  timeCounter++;

  // Mudança de estágios
  if (timeCounter > 300 && stage == 0) stage = 1;
  if (timeCounter > 800 && stage == 1) stage = 2;
  if (timeCounter > 1000 && stage == 2) stage = 3;
  if (timeCounter > 1200 && stage == 3) stage = 4;
  if (timeCounter > 1400 && stage == 4) stage = 5;
  if (timeCounter > 1700 && stage == 5) stage = 6;

  // Campo
  if (stage <= 4) drawField();

  // Estágio 0: plantio manual
  if (stage == 0) {
    drawEmoji("👨‍🌾", personX, height / 2,5 - 40);
    if (frameCount % 60 == 0 && cornPlants.length < 5) {
      cornPlants.push(personX + 10);
      cornGrowth.push(2);
    }
    personX += 0.5;
  }

  // Milhos crescendo
  if (stage >= 1 && stage <= 4) {
    growCorn();
  }

  // Trator operando
  if (stage == 2 || stage == 3 || stage == 4) {
    drawEmoji("🚜", tractorX, height / 2 - 40);
    if (tractorX < width + 100) {
      tractorX += 4;
    }
  }

  // Trator plantando automaticamente
  if (stage == 2 && frameCount % 10 == 0 && tractorX < width) {
    cornPlants.push(tractorX + 30);
    cornGrowth.push(2);
  }

  if (stage == 3) {
    fill(0, 0, 255, 100);
    rect(tractorX, height / 2 - 50, 60, 20); // Pulverização
  }

  // Colheita
  if (stage == 4) {
    harvestCorn();
  }

  // Supermercado
  if (stage == 5 || stage == 6) {
    showSupermarket();
  }

  // Compradores comprando
  if (stage == 6) {
    showBuyers();
  }

  // Beep no caixa
  if (beepTimer > 0) {
    fill(0);
    textSize(16);
    text("Beep!", 650, 140);
    beepTimer--;
  }

  // Mostrar total de vendas
  if (stage >= 5) {
    fill(0);
    textSize(18);
    textAlign(LEFT);
    text("Total de Vendas: " + sales, 10, 30);
  }
}

function drawField() {
  fill(100, 200, 100);
  rect(0, height / 2, width, height / 2);
}

function drawEmoji(emoji, x, y) {
  text(emoji, x, y);
}

function growCorn() {
  for (let i = 0; i < cornPlants.length; i++) {
    let emoji = cornGrowth[i] < 20 ? "🌱" : "🌽";
    drawEmoji(emoji, cornPlants[i], height / 2 - cornGrowth[i]);
    if (cornGrowth[i] < 40) cornGrowth[i] += 0.1;
  }
}

function harvestCorn() {
  for (let i = cornPlants.length - 1; i >= 0; i--) {
    if (cornPlants[i] < tractorX + 60 && cornPlants[i] > tractorX) {
      cornPlants.splice(i, 1);
      cornGrowth.splice(i, 1);
    }
  }
}

function showSupermarket() {
  background(240);
  fill(100);
  rect(100, 100, 600, 200);

  fill(180);
  rect(600, 160, 60, 80); // caixa

  fill(255);
  textSize(24);
  textAlign(CENTER);
  text("🛒 Supermercado", width / 2, 130);

  if (cornStock.length === 0) {
    for (let i = 0; i < 6; i++) {
      cornStock.push({ x: 150 + i * 90, y: 200, bought: false });
    }
  }

  for (let c of cornStock) {
    if (!c.bought) {
      drawEmoji("🌽", c.x, c.y);
    }
  }
}

function showBuyers() {
  if (buyers.length < 6 && frameCount % 60 === 0) {
    buyers.push({
      x: 100,
      y: 320,
      stage: "walking",
      target: cornStock[buyers.length],
      hasCorn: false,
      armRaised: false,
      atCheckout: false,
    });
  }

  for (let b of buyers) {
    drawEmoji("🧍", b.x, b.y - 20);
    drawEmoji("🛒", b.x, b.y + 10);

    if (b.hasCorn) {
      drawEmoji("🌽", b.x + 15, b.y - 20);
    }

    if (b.stage === "walking" && b.target && b.x < b.target.x) {
      b.x += 2;
    } else if (b.stage === "walking" && b.target) {
      b.armRaised = true;
      b.hasCorn = true;
      b.target.bought = true;
      b.stage = "checkout";
    } else if (b.stage === "checkout" && b.x < 610) {
      b.armRaised = false;
      b.x += 2;
    } else if (b.stage === "checkout" && !b.atCheckout) {
      b.stage = "exit";
      b.atCheckout = true;
      sales++;
      beepTimer = 30;
    } else if (b.stage === "exit" && b.x < width + 30) {
      b.x += 3;
    }
  }
}
