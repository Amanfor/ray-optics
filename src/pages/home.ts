
import { topics, type Topic } from '../data/topics';

function createHeroCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  let w = 0, h = 0;
  let animId: number;
  
  const rays = Array.from({length: 6}, (_, i) => ({
    x: 50 + Math.random() * 300,
    y: 30 + Math.random() * 200,
    angle: (Math.PI / 7) * (i + 1) + 0.1,
    speed: 0.8 + i * 0.25,
    len: 150 + i * 35,
  }));
  
  function resize() {
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * devicePixelRatio;
    canvas.height = h * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }
  
  function draw() {
    ctx.clearRect(0, 0, w, h);
    rays.forEach(ray => {
      ray.x += Math.cos(ray.angle) * ray.speed;
      ray.y += Math.sin(ray.angle) * ray.speed;
      if (ray.x < 0 || ray.x > w) ray.angle = Math.PI - ray.angle;
      if (ray.y < 0 || ray.y > h) ray.angle = -ray.angle;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1;
      ctx.moveTo(ray.x, ray.y);
      ctx.lineTo(ray.x + Math.cos(ray.angle) * ray.len, ray.y + Math.sin(ray.angle) * ray.len);
      ctx.stroke();
    });
    animId = requestAnimationFrame(draw);
  }
  
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  animId = requestAnimationFrame(draw);
  return () => { cancelAnimationFrame(animId); ro.disconnect(); };
}

export function renderHome(el: HTMLElement) {
  el.innerHTML = `
    <section class="hero">
      <canvas class="hero-canvas" id="hero-canvas"></canvas>
      <p class="hero-eyebrow">Physics · Class 12 · JEE</p>
      <h1>ray optics<br><em>visualised</em></h1>
      <p class="hero-desc">interactive simulations for every concept. drag rays, adjust parameters, see physics happen live.</p>
      <div class="search-wrap">
        <input type="text" id="search" placeholder="search concepts…" autocomplete="off" spellcheck="false">
      </div>
    </section>
    <section class="topics-section">
      <p class="section-label">concepts</p>
      <div class="topic-grid" id="topic-grid"></div>
    </section>
  `;

  // Hero canvas
  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
  if (canvas) createHeroCanvas(canvas);

  // Render cards
  const grid = document.getElementById('topic-grid')!;
  function renderCards(list: Topic[]) {
    grid.innerHTML = list.map((t, i) => `
      <div class="topic-card" data-id="${t.id}">
        <span class="card-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="card-title">${t.title}</span>
        <span class="card-desc">${t.description}</span>
        <span class="card-arrow">→</span>
      </div>
    `).join('');
    grid.querySelectorAll<HTMLElement>('.topic-card').forEach(card => {
      card.addEventListener('click', () => {
        window.location.hash = '/topic/' + card.dataset.id;
      });
    });
  }
  renderCards(topics);

  // Fuzzy search
  const searchInput = document.getElementById('search') as HTMLInputElement;
  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) { renderCards(topics); return; }
    const filtered = topics.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
    renderCards(filtered);
  });
}
