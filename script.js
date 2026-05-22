/* ============================================================
   1) TOGGLE LISTE PRODOTTI
============================================================ */
document.addEventListener("DOMContentLoaded", () => {

  setupToggle("btn-liquidi", "lista-liquidi");
  setupToggle("btn-sige", "lista-sige");

  function setupToggle(btnId, listId) {
    const btn  = document.getElementById(btnId);
    const list = document.getElementById(listId);
    if (!btn || !list) return;

    function toggle() {
      const isOpen = list.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }

    btn.addEventListener("click", toggle);

    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  }

});


/* ============================================================
   2) SFONDO FUMO COLORATO
============================================================ */
(function initCloud() {
  const canvas = document.getElementById("cloudCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let w, h;
  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = [];
  const COUNT = 40;

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  const COLORS = [
    [255, 255, 255],
    [200, 230, 255],
    [0, 255, 255],
    [255, 80, 160],
    [180, 220, 255],
    [255, 255, 255],
  ];

  for (let i = 0; i < COUNT; i++) {
    const col = COLORS[Math.floor(Math.random() * COLORS.length)];
    particles.push({
      x: randomBetween(0, 1),
      y: randomBetween(0, 1),
      r: randomBetween(0.22, 0.55),
      dx: randomBetween(-0.00012, 0.00012),
      dy: randomBetween(-0.00008, 0.00008),
      a: randomBetween(0.12, 0.28),
      col: col,
      phase: randomBetween(0, Math.PI * 2),
      speed: randomBetween(0.0012, 0.0025),
    });
  }

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = "#08090f";
    ctx.fillRect(0, 0, w, h);

    particles.forEach(p => {
      const px = (p.x + Math.sin(t * p.speed + p.phase) * 0.08 + 1) % 1;
      const py = (p.y + Math.cos(t * p.speed * 0.7 + p.phase) * 0.05 + 1) % 1;

      const gx = px * w;
      const gy = py * h;
      const gr = p.r * Math.min(w, h);

      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
      const [r, g, b] = p.col;
      const alpha = p.a * (0.8 + 0.2 * Math.sin(t * 0.0008 + p.phase));

      grad.addColorStop(0,   `rgba(${r},${g},${b},${alpha})`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},${alpha * 0.4})`);
      grad.addColorStop(1,   `rgba(${r},${g},${b},0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, gr, 0, Math.PI * 2);
      ctx.fill();
    });

    t++;
    requestAnimationFrame(draw);
  }

  draw();
})();


/* ============================================================
   3) FUMO DAL LOGO (2 CANVAS)
============================================================ */
function createSmoke(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resizeSmoke() {
    canvas.width  = canvas.offsetWidth  || 60;
    canvas.height = canvas.offsetHeight || 120;
  }
  resizeSmoke();
  window.addEventListener("resize", resizeSmoke);

  let t = 0;

  function noiseSmoke(x, y, t) {
    return (
      Math.sin(x * 0.02 + t * 0.8) +
      Math.sin(y * 0.03 + t * 0.5) +
      Math.sin((x + y) * 0.015 + t * 0.3)
    ) * 0.33 + 0.5;
  }

  function drawSmoke() {
    const w = canvas.width;
    const h = canvas.height;
    const img = ctx.createImageData(w, h);
    const data = img.data;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const n = noiseSmoke(x, y, t);
        const v = n * 255;
        const i = (y * w + x) * 4;
        data[i]     = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = v * 0.35;
      }
    }

    ctx.putImageData(img, 0, 0);
    t += 0.01;
    requestAnimationFrame(drawSmoke);
  }

  drawSmoke();
}

createSmoke("smokeLeft");
createSmoke("smokeRight");


/* ============================================================
   4) PARTICELLE LUMINOSE LENTE
============================================================ */
(function initParticles() {
  const canvas = document.getElementById("backgroundParticles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = [];
  const COUNT = 60;

  function random(a, b) { return a + Math.random() * (b - a); }

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: random(0, canvas.width),
      y: random(0, canvas.height),
      r: random(1.2, 3.5),
      dx: random(-0.15, 0.15),
      dy: random(-0.15, 0.15),
      alpha: random(0.2, 0.7),
      pulse: random(0.002, 0.006)
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

      p.alpha += p.pulse;
      if (p.alpha > 0.8 || p.alpha < 0.2) p.pulse *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
})();


/* ============================================================
   5) POLVERE CHE SALE
============================================================ */
(function initDust() {
  const canvas = document.getElementById("dustParticles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const particles = [];
  const COUNT = 120;

  function random(a, b) { return a + Math.random() * (b - a); }

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: random(0, canvas.width),
      y: random(0, canvas.height),
      r: random(0.6, 2.2),
      speed: random(0.2, 0.7),
      alpha: random(0.1, 0.45)
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.y -= p.speed;

      if (p.y < -5) {
        p.y = canvas.height + random(0, 40);
        p.x = random(0, canvas.width);
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
})();
