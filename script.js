

document.addEventListener("DOMContentLoaded", () => {

  // ----------------------------------------------------------
  // 1) TOGGLE LIQUIDI
  // ----------------------------------------------------------
  setupToggle("btn-liquidi", "lista-liquidi");

  // ----------------------------------------------------------
  // 2) TOGGLE SIGARETTE ELETTRONICHE
  // ----------------------------------------------------------
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

    // Accessibilità: Enter / Space da tastiera
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  }

});

// ============================================================
// 3) SFONDO FUMO COLORATO
// ============================================================
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

  // Particelle di fumo
  const particles = [];
  const COUNT = 40; 


  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  // Colori: bianco/grigio chiaro con tocchi ciano e rosa
  const COLORS = [
  [255, 255, 255],  // bianco brillante
  [200, 230, 255],  // azzurro chiaro
  [0, 255, 255],    // ciano neon
  [255, 80, 160],   // rosa neon
  [180, 220, 255],  // ghiaccio
  [255, 255, 255],  // bianco puro
];


  for (let i = 0; i < COUNT; i++) {
    const col = COLORS[Math.floor(Math.random() * COLORS.length)];
    particles.push({
      x:    randomBetween(0, 1),
      y:    randomBetween(0, 1),
      r: randomBetween(0.22, 0.55),  
      dx:   randomBetween(-0.00012, 0.00012),
      dy:   randomBetween(-0.00008, 0.00008),
      a: randomBetween(0.12, 0.28), 
      col:  col,
      phase: randomBetween(0, Math.PI * 2),
      speed: randomBetween(0.0012, 0.0025), 

    });
  }

  let t = 0;

  function draw() {
    ctx.clearRect(0, 0, w, h);

    // Sfondo scuro base
    ctx.fillStyle = "#08090f";
    ctx.fillRect(0, 0, w, h);

    particles.forEach(p => {
      // Movimento sinusoidale morbido
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

// ============================================================
// 4) FUMO DAL LOGO (2 canvas separati)
// ============================================================
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
      Math.sin(x * 0.02  + t * 0.8) +
      Math.sin(y * 0.03  + t * 0.5) +
      Math.sin((x + y) * 0.015 + t * 0.3)
    ) * 0.33 + 0.5;
  }

  function drawSmoke() {
    const w = canvas.width;
    const h = canvas.height;
    const img  = ctx.createImageData(w, h);
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

