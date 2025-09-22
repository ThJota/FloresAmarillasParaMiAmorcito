const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ⭐ Estrellas de fondo
let stars = [];
for (let i = 0; i < 120; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5,
    opacity: Math.random()
  });
}

function drawStars() {
  ctx.save();
  ctx.fillStyle = "#fff";
  stars.forEach(s => {
    ctx.globalAlpha = s.opacity;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();

    // animación de parpadeo
    s.opacity += (Math.random() - 0.5) * 0.05;
    if (s.opacity < 0) s.opacity = 0;
    if (s.opacity > 1) s.opacity = 1;
  });
  ctx.restore();
}

// 🌼 Clase Flor
class Flower {
  constructor(x, y, radius, height, delay) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.height = height;
    this.growth = 0;
    this.maxGrowth = height;
    this.delay = delay; 
    this.start = Date.now();
    this.swingSpeed = 0.002 + Math.random() * 0.001; // velocidad viento
    this.swingAmount = 8 + Math.random() * 5; // amplitud viento
  }

  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  draw(time) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // calcular oscilación (solo cuando ya creció)
    let angle = 0;
    if (this.growth >= this.maxGrowth - 1) {
      angle = Math.sin(time * this.swingSpeed) * (this.swingAmount * Math.PI / 180);
    }

    ctx.rotate(angle);

    // Tallo
    let grad = ctx.createLinearGradient(0, 0, 0, -this.growth);
    grad.addColorStop(0, "#0f0");
    grad.addColorStop(1, "#064d06");
    ctx.beginPath();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -this.growth);
    ctx.stroke();

    // Flor en la punta
    if (this.growth >= this.maxGrowth - 1) {
      ctx.translate(0, -this.maxGrowth);

      // pétalos
      for (let i = 0; i < 8; i++) {
        ctx.rotate((Math.PI * 2) / 8);
        let petalGradient = ctx.createRadialGradient(
          0, this.radius, this.radius * 0.2,
          0, this.radius, this.radius
        );
        petalGradient.addColorStop(0, "#fff176");
        petalGradient.addColorStop(1, "#fbc02d");

        ctx.beginPath();
        ctx.ellipse(0, this.radius, this.radius * 0.8, this.radius * 1.3, 0, 0, Math.PI * 2);
        ctx.fillStyle = petalGradient;
        ctx.fill();
      }

      // centro
      let centerGradient = ctx.createRadialGradient(0, 0, 2, 0, 0, this.radius * 0.6);
      centerGradient.addColorStop(0, "#ffeb3b");
      centerGradient.addColorStop(1, "#ff8c00");

      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = centerGradient;
      ctx.fill();
    }

    ctx.restore();
  }

  update(time) {
    let elapsed = (Date.now() - this.start) / 2000;
    if (elapsed > this.delay) {
      let progress = Math.min((elapsed - this.delay) / 1.5, 1);
      this.growth = this.maxGrowth * this.easeOut(progress);
    }
    this.draw(time);
  }
}

const flowers = [];
function init() {
  const centerX = canvas.width / 2;
  const baseY = canvas.height;

  for (let i = -5; i <= 5; i++) {
    let x = centerX + i * 50;
    let radius = 14 + Math.random() * 10;
    let height = 220 + Math.random() * 120;
    let delay = Math.random();
    flowers.push(new Flower(x, baseY, radius, height, delay));
  }
}

function animate(time) {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 🌟 Estrellas primero
  drawStars();

  // 🌼 Flores después
  flowers.forEach((flower) => flower.update(time));
  requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
