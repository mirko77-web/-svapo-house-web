/* ============================================================
   SCRIPT.JS – Svapo House
   Fix: rimosso il doppio cloudCanvas, cleanup generale
============================================================ */

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
  const COUNT = 18;

  function randomBetween(a, b) { return a + Math.random() * (b - a); }

  // Colori: bianco/grigio chiaro con tocchi ciano e rosa
  const COLORS = [
    [220, 240, 255],  // bianco freddo
    [200, 230, 250],  // grigio azzurrino
    [0,   220, 240],  // ciano
    [255, 50,  120],  // rosa
    [180, 220, 255],  // grigio chiaro
    [240, 240, 255],  // bianco puro
  ];

  for (let i = 0; i < COUNT; i++) {
    const col = COLORS[Math.floor(Math.random() * COLORS.length)];
    particles.push({
      x:    randomBetween(0, 1),
      y:    randomBetween(0, 1),
      r:    randomBetween(0.12, 0.32),
      dx:   randomBetween(-0.00012, 0.00012),
      dy:   randomBetween(-0.00008, 0.00008),
      a:    randomBetween(0.04, 0.13),
      col:  col,
      phase: randomBetween(0, Math.PI * 2),
      speed: randomBetween(0.0004, 0.0012),
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

// ============================================================
// 5) SCROLL STACK – DISABILITATO
// ============================================================
/*(function initScrollStack() {
  const stacks = document.querySelectorAll('.scroll-stack-scroller');
  if (!stacks.length) return;

  const cfg = {
    itemDistance:     100,
    itemScale:        0.03,
    itemStackDistance: 30,
    stackPosition:    '20%',
    scaleEndPosition: '10%',
    baseScale:        0.85,
    rotationAmount:   3,
    blurAmount:       1.5
  };

  const parsePct = (val, h) =>
    typeof val === 'string' && val.includes('%')
      ? (parseFloat(val) / 100) * h
      : parseFloat(val);

  const calcProgress = (scroll, start, end) => {
    if (scroll < start) return 0;
    if (scroll > end)   return 1;
    return (scroll - start) / (end - start);
  };

  const getOffset = el => el.getBoundingClientRect().top + window.scrollY;

  const lastTransforms = new Map();
  let ticking = false;

  function update() {
    const scrollTop  = window.scrollY;
    const viewH      = window.innerHeight;
    const stackPosPx = parsePct(cfg.stackPosition, viewH);
    const scaleEndPx = parsePct(cfg.scaleEndPosition, viewH);

    stacks.forEach(stack => {
      const cards      = Array.from(stack.querySelectorAll('.scroll-stack-card'));
      const endEl      = stack.querySelector('.scroll-stack-end');
      const endElTop   = endEl ? getOffset(endEl) : 0;

      cards.forEach((card, i) => {
        const cardTop    = getOffset(card);
        const trigStart  = cardTop - stackPosPx - cfg.itemStackDistance * i;
        const trigEnd    = cardTop - scaleEndPx;
        const pinEnd     = endElTop - viewH / 2;

        const scaleProgress = calcProgress(scrollTop, trigStart, trigEnd);
        const targetScale   = cfg.baseScale + i * cfg.itemScale;
        const scale         = 1 - scaleProgress * (1 - targetScale);
        const rotation      = i * cfg.rotationAmount * scaleProgress;

        let blur = 0;
        if (cfg.blurAmount) {
          let topIdx = 0;
          cards.forEach((c, j) => {
            const jTop   = getOffset(c);
            const jStart = jTop - stackPosPx - cfg.itemStackDistance * j;
            if (scrollTop >= jStart) topIdx = j;
          });
          if (i < topIdx) blur = (topIdx - i) * cfg.blurAmount;
        }

        let translateY = 0;
        if (scrollTop >= trigStart && scrollTop <= pinEnd) {
          translateY = scrollTop - cardTop + stackPosPx + cfg.itemStackDistance * i;
        } else if (scrollTop > pinEnd) {
          translateY = pinEnd - cardTop + stackPosPx + cfg.itemStackDistance * i;
        }

        const next = {
          translateY: Math.round(translateY * 100) / 100,
          scale:      Math.round(scale * 1000) / 1000,
          rotation:   Math.round(rotation * 100) / 100,
          blur:       Math.round(blur * 100) / 100
        };

        const key  = stack.dataset.stackId + '-' + i;
        const prev = lastTransforms.get(key);
        const changed = !prev ||
          Math.abs(prev.translateY - next.translateY) > 0.1 ||
          Math.abs(prev.scale     - next.scale)      > 0.001 ||
          Math.abs(prev.rotation  - next.rotation)   > 0.1 ||
          Math.abs(prev.blur      - next.blur)        > 0.1;

        if (changed) {
          card.style.transform =
            `translate3d(0, ${next.translateY}px, 0) scale(${next.scale}) rotate(${next.rotation}deg)`;
          card.style.filter = next.blur > 0 ? `blur(${next.blur}px)` : '';
          lastTransforms.set(key, next);
        }
      });
    });

    ticking = false;
  }

  stacks.forEach((s, idx) => { s.dataset.stackId = idx; });

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  window.addEventListener('resize', () => { lastTransforms.clear(); update(); });

  update();
})() */;