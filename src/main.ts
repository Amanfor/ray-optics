import './style.css';
import katex from 'katex';
import Lenis from 'lenis';
import { topics } from './data/topics';
import { renderHome } from './pages/home';

import { initSim as initSimSphericalMirror } from './simulations/spherical-mirror';
import { initSim as initSimRefraction } from './simulations/refraction';
import { initSim as initSimTir } from './simulations/tir';
import { initSim as initSimSphericalRefraction } from './simulations/spherical-refraction';
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
  'spherical-refraction': initSimSphericalRefraction,
  'thin-lens': initSimThinLens,
  'prism': initSimPrism,
  'lens-combo': initSimLensCombo,
  'microscope': initSimMicroscope,
  'telescope': initSimTelescope,
  'dispersion': initSimDispersion
};

const app = document.querySelector<HTMLDivElement>('#app')!

function route() {
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
    page.innerHTML = nav + `<div id="home-container"></div>`;
    app.appendChild(page);
    renderHome(document.getElementById('home-container')!);
    
  } else if (hash === '/cheatsheet') {
    page.innerHTML = nav + `
      <div class="cheatsheet-page">
        <h1>Formula Cheat Sheet</h1>
        <table class="formula-table">
          <tr><th>Topic</th><th>Formula</th></tr>
          <tr><td>Mirror Equation</td><td><span class="math">\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}</span></td></tr>
          <tr><td>Snell's Law</td><td><span class="math">n_1 \\sin i = n_2 \\sin r</span></td></tr>
          <tr><td>Lens Maker</td><td><span class="math">\\frac{1}{f} = (n-1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)</span></td></tr>
          <tr><td>Spherical Surface</td><td><span class="math">\\frac{\\mu_2}{v} - \\frac{\\mu_1}{u} = \\frac{\\mu_2 - \\mu_1}{R}</span></td></tr>
        </table>
      </div>
    `;
    app.appendChild(page);
    setTimeout(() => {
       document.querySelectorAll('.math').forEach(el => {
         try {
           katex.render(el.textContent||'', el as HTMLElement, {throwOnError:false});
         } catch(e) {}
       });
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
        
        ${topic.simId ? `
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
        ` : ''}
        
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
