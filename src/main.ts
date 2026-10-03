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
  'dispersion': initSimDispersion,
};

const app = document.querySelector<HTMLDivElement>('#app')!;

// ── KaTeX auto-render ────────────────────────────────────────────────────────
// Scans root for:
//   - .math spans (cheat sheet) → rendered by textContent
//   - $...$ (inline) and $$...$$ (display) in question/solution text
function renderMath(root: Element) {
  // 1. Explicit .math spans
  root.querySelectorAll<HTMLElement>('.math').forEach(el => {
    try { katex.render(el.textContent || '', el, { throwOnError: false }); } catch (_) {}
  });

  // 2. Walk text nodes inside question/solution containers
  function processTextNode(node: Text) {
    const raw = node.textContent || '';
    const pattern = /\$\$([^$]+?)\$\$|\$([^$\n]+?)\$/g;
    if (!pattern.test(raw)) return;
    pattern.lastIndex = 0;

    const frag = document.createDocumentFragment();
    let last = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(raw)) !== null) {
      if (match.index > last) {
        frag.appendChild(document.createTextNode(raw.slice(last, match.index)));
      }
      const isDisplay = match[1] !== undefined;
      const latex = isDisplay ? match[1] : match[2];
      const span = document.createElement('span');
      try {
        katex.render(latex, span, { throwOnError: false, displayMode: isDisplay });
      } catch (_) {
        span.textContent = match[0];
      }
      frag.appendChild(span);
      last = match.index + match[0].length;
    }
    if (last < raw.length) frag.appendChild(document.createTextNode(raw.slice(last)));
    node.parentNode?.replaceChild(frag, node);
  }

  const scanSelectors = '.question-text, .solution-body, .concept-body, .formula-table td';
  root.querySelectorAll(scanSelectors).forEach(el => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    let n: Node | null;
    while ((n = walker.nextNode())) nodes.push(n as Text);
    nodes.forEach(processTextNode);
  });
}

function route() {
  const hash = window.location.hash.slice(1) || '/';
  app.innerHTML = '';

  const page = document.createElement('div');
  page.className = 'page-enter';

  const nav = `
    <nav class="nav-bar">
      <a href="#/" class="nav-logo">ray optics</a>
      <div class="nav-links">
        <a href="#/">home</a>
        <a href="#/cheatsheet">cheat sheet</a>
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
        <h1>formula cheat sheet</h1>
        <table class="formula-table">
          <thead><tr><th>topic</th><th>formula</th><th>variables</th></tr></thead>
          <tbody>
            <tr><td>Mirror equation</td><td><span class="math">\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f} = \\frac{2}{R}</span></td><td>u = object dist, v = image dist, f = focal length</td></tr>
            <tr><td>Mirror magnification</td><td><span class="math">m = -\\frac{v}{u}</span></td><td>m &lt; 0 → inverted; |m| &gt; 1 → enlarged</td></tr>
            <tr><td>Snell's law</td><td><span class="math">n_1 \\sin\\theta_1 = n_2 \\sin\\theta_2</span></td><td>n = refractive index, θ = angle with normal</td></tr>
            <tr><td>Critical angle</td><td><span class="math">\\sin\\theta_c = \\frac{n_2}{n_1}</span></td><td>valid when n₁ &gt; n₂ (denser → rarer)</td></tr>
            <tr><td>Apparent depth</td><td><span class="math">d_{\\text{app}} = \\frac{d}{\\mu}</span></td><td>μ = refractive index of medium</td></tr>
            <tr><td>Slab shift</td><td><span class="math">\\Delta = t\\left(1 - \\frac{1}{\\mu}\\right)</span></td><td>t = slab thickness</td></tr>
            <tr><td>Spherical surface</td><td><span class="math">\\frac{\\mu_2}{v} - \\frac{\\mu_1}{u} = \\frac{\\mu_2 - \\mu_1}{R}</span></td><td>single refracting surface; New Cartesian convention</td></tr>
            <tr><td>Lens formula</td><td><span class="math">\\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f}</span></td><td>object on left → u negative</td></tr>
            <tr><td>Lens maker's formula</td><td><span class="math">\\frac{1}{f} = (\\mu - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)</span></td><td>R₁, R₂ = radii of curvature</td></tr>
            <tr><td>Lens combination</td><td><span class="math">\\frac{1}{f_{\\text{eff}}} = \\frac{1}{f_1} + \\frac{1}{f_2} - \\frac{d}{f_1 f_2}</span></td><td>d = separation between lenses</td></tr>
            <tr><td>Prism deviation</td><td><span class="math">\\delta = i + e - A</span></td><td>i = incidence angle, e = emergence angle, A = prism angle</td></tr>
            <tr><td>Min deviation</td><td><span class="math">\\mu = \\frac{\\sin\\!\\left(\\tfrac{A+\\delta_m}{2}\\right)}{\\sin(A/2)}</span></td><td>symmetric ray path at minimum deviation</td></tr>
            <tr><td>Microscope M</td><td><span class="math">M = -\\frac{v_o}{u_o}\\left(1 + \\frac{D}{f_e}\\right)</span></td><td>D = 25 cm; v_o = image from objective</td></tr>
            <tr><td>Telescope M</td><td><span class="math">M = -\\frac{f_o}{f_e}</span></td><td>normal adjustment; object at ∞</td></tr>
          </tbody>
        </table>
        <div style="margin-top:2.5rem;">
          <p class="section-label">new cartesian sign convention</p>
          <p style="color:var(--muted);font-size:0.875rem;line-height:1.9;">
            All distances from pole (mirror) or optical centre (lens).<br>
            Along incident light direction → <strong style="color:#fff">positive</strong>.<br>
            Against incident light direction → <strong style="color:#fff">negative</strong>.<br>
            Heights above principal axis → positive. Below → negative.
          </p>
        </div>
      </div>
    `;
    app.appendChild(page);
    setTimeout(() => renderMath(page), 0);

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
                <span class="question-num">${String(i + 1).padStart(2, '0')}</span>
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

    // Render KaTeX AFTER DOM insertion
    setTimeout(() => renderMath(page), 0);

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
