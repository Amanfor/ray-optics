
import './style.css';
import katex from 'katex';
import Lenis from 'lenis';
import { topics } from './data/topics';

import { initSim as initSimSphericalMirror } from './simulations/spherical-mirror';
import { initSim as initSimRefraction } from './simulations/refraction';
import { initSim as initSimTir } from './simulations/tir';
import { initSim as initSimThinLens } from './simulations/thin-lens';
import { initSim as initSimPrism } from './simulations/prism';
import { initSim as initSimLensCombo } from './simulations/lens-combo';
import { initSim as initSimMicroscope } from './simulations/microscope';
import { initSim as initSimTelescope } from './simulations/telescope';
import { initSim as initSimDispersion } from './simulations/dispersion';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

const simMap: Record<string, any> = {
  'spherical-mirror': initSimSphericalMirror,
  'refraction': initSimRefraction,
  'tir': initSimTir,
  'thin-lens': initSimThinLens,
  'prism': initSimPrism,
  'lens-combo': initSimLensCombo,
  'microscope': initSimMicroscope,
  'telescope': initSimTelescope,
  'dispersion': initSimDispersion
};

const app = document.querySelector<HTMLDivElement>('#app')!

function createHeroCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  let w = 0, h = 0; let animId: number;
  function resize() { w = canvas.offsetWidth; h = canvas.offsetHeight; canvas.width = w; canvas.height = h; }
  const rays = Array.from({length: 5}, (_, i) => ({
    x: Math.random() * 400, y: Math.random() * 300,
    angle: (Math.PI / 8) * (i + 1), speed: 1.2 + i * 0.3, len: 180 + i * 40,
  }));
  function draw() {
    ctx.clearRect(0, 0, w, h);
    rays.forEach(ray => {
      ray.x += Math.cos(ray.angle) * ray.speed; ray.y += Math.sin(ray.angle) * ray.speed;
      if (ray.x < 0 || ray.x > w) ray.angle = Math.PI - ray.angle;
      if (ray.y < 0 || ray.y > h) ray.angle = -ray.angle;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1;
      ctx.moveTo(ray.x, ray.y);
      ctx.lineTo(ray.x + Math.cos(ray.angle) * ray.len, ray.y + Math.sin(ray.angle) * ray.len);
      ctx.stroke();
    });
    animId = requestAnimationFrame(draw);
  }
  resize(); window.addEventListener('resize', resize);
  animId = requestAnimationFrame(draw);
  return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
}

function renderTopicCard(topic: any, index: number): string {
  return `<a class="topic-card" href="#/topic/${topic.id}">
    <span class="card-num">${String(index + 1).padStart(2, '0')}</span>
    <span class="card-title">${topic.title}</span>
    <span class="card-desc">${topic.description || ''}</span>
    <span class="card-arrow">→</span>
  </a>`;
}

let canvasCleanup: any = null;

function route() {
  if(canvasCleanup) { canvasCleanup(); canvasCleanup = null; }
  const hash = window.location.hash.slice(1) || '/';
  app.innerHTML = '';
  
  const page = document.createElement('div');
  page.className = 'page-enter';
  
  const nav = `
    <nav class="nav-bar">
      <a href="#/" class="nav-logo">ray optics</a>
      <div class="nav-links">
        <a href="#/">Home</a>
        <a href="#/cheatsheet">Cheat Sheet</a>
      </div>
    </nav>
  `;

  if (hash === '/') {
    page.innerHTML = nav + `
      <section class="hero">
        <canvas class="hero-canvas" id="hero-canvas"></canvas>
        <p class="hero-eyebrow">Physics · Class 12 · JEE</p>
        <h1>ray optics<br><em>visualised</em></h1>
        <p class="hero-desc">interactive simulations for every concept. drag rays, adjust parameters, see physics happen live.</p>
        <div class="search-wrap">
          <input type="text" id="search" placeholder="search concepts..." autocomplete="off" spellcheck="false">
        </div>
      </section>
      <section class="topics-section">
        <p class="section-label">concepts</p>
        <div class="topic-grid" id="topic-grid">
          ${topics.map((t, i) => renderTopicCard(t, i)).join('')}
        </div>
      </section>
    `;
    app.appendChild(page);
    canvasCleanup = createHeroCanvas(document.getElementById('hero-canvas') as HTMLCanvasElement);
    
    const search = document.getElementById('search') as HTMLInputElement;
    search.addEventListener('input', (e: any) => {
      const v = e.target.value.toLowerCase();
      const filtered = topics.filter(t => t.title.toLowerCase().includes(v) || t.description.toLowerCase().includes(v));
      document.getElementById('topic-grid')!.innerHTML = filtered.map((t, i) => renderTopicCard(t, i)).join('');
    });
    
  } else if (hash === '/cheatsheet') {
    page.innerHTML = nav + `
      <div class="cheatsheet-page">
        <h1>Formula Cheat Sheet</h1>
        <table class="formula-table">
          <tr><th>Topic</th><th>Formula</th></tr>
          <tr><td>Mirror Equation</td><td><span class="math">\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}</span></td></tr>
          <tr><td>Snell's Law</td><td><span class="math">n_1 \\sin i = n_2 \\sin r</span></td></tr>
          <tr><td>Lens Maker</td><td><span class="math">\\frac{1}{f} = (n-1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)</span></td></tr>
        </table>
      </div>
    `;
    app.appendChild(page);
    setTimeout(() => {
       document.querySelectorAll('.math').forEach(el => katex.render(el.textContent||'', el as HTMLElement, {throwOnError:false}));
    }, 0);
    
  } else if (hash.startsWith('/topic/')) {
    const topicId = hash.replace('/topic/', '');
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    
    page.innerHTML = nav + `
      <div class="topic-page">
        <p class="breadcrumb"><a href="#/">home</a> / ${topic.title}</p>
        <h1>${topic.title}</h1>
        <div class="concept-body"><p>${topic.description}</p></div>
        
        <div class="sim-wrapper">
          <div class="sim-header">
            <span class="sim-label">interactive simulation</span>
            <span class="sim-label">drag to explore</span>
          </div>
          <div class="sim-body">
            <div id="sim-container" class="sim-container"></div>
          </div>
        </div>
        
        <div class="formula-live" id="formula-display"></div>
        
        ${topic.image ? `<img class="ref-image" src="${topic.image}" alt="${topic.title}" loading="lazy">` : ''}
        
        <div class="questions-section">
          <p class="section-label">jee practice</p>
          ${topic.questions.map((q, i) => `
            <div class="question-card">
              <div class="question-head">
                <span class="question-num">0${i+1}</span>
                <span class="question-text">${q.q}</span>
                <span class="question-toggle">+</span>
              </div>
              <div class="question-solution">
                <div class="solution-body">${q.a}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    app.appendChild(page);
    
    page.querySelectorAll('.question-head').forEach(head => {
      head.addEventListener('click', () => head.closest('.question-card')!.classList.toggle('open'));
    });
    
    if (topic.simId && simMap[topic.simId]) {
      simMap[topic.simId](document.getElementById('sim-container')!);
    }
  }
}

window.addEventListener('hashchange', route);
route();
