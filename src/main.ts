import './style.css';
import katex from 'katex';
import { topics } from './data/topics';

// Simple Simulation registry
import { initSim as initSimSphericalMirror } from './simulations/spherical-mirror';
import { initSim as initSimRefraction } from './simulations/refraction';
import { initSim as initSimThinLens } from './simulations/thin-lens';
import { initSim as initSimPrism } from './simulations/prism';
import { initSim as initSimMicroscope } from './simulations/microscope';

const simMap: Record<string, any> = {
  'spherical-mirror': initSimSphericalMirror,
  'refraction': initSimRefraction,
  'thin-lens': initSimThinLens,
  'prism': initSimPrism,
  'microscope': initSimMicroscope,
};

const app = document.querySelector<HTMLDivElement>('#app')!

function route() {
  const hash = window.location.hash.slice(1) || '/';
  app.innerHTML = '';
  
  const nav = document.createElement('div');
  nav.className = 'nav-bar';
  nav.innerHTML = '<a href="#/">home</a> <a href="#/cheatsheet">cheat sheet</a>';
  app.appendChild(nav);

  const container = document.createElement('div');
  app.appendChild(container);

  if (hash === '/') {
    container.innerHTML = '<h1>ray optics concepts</h1><ul>' + 
      topics.map(t => `<li><a href="#/topic/${t.id}">${t.title}</a></li>`).join('') +
      '</ul>';
  } else if (hash === '/cheatsheet') {
    container.innerHTML = '<h2>formula cheat sheet</h2><p>Here are the key formulas:</p>' +
      '<div id="math-render"></div>';
    setTimeout(() => {
      katex.render('\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}', document.getElementById('math-render')!);
    }, 0);
  } else if (hash.startsWith('/topic/')) {
    const topicId = hash.replace('/topic/', '');
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    
    container.innerHTML = `<h2>${topic.title}</h2>
      <p>${topic.description}</p>
      ${topic.image ? `<img src="${topic.image}" class="media-image" alt="${topic.title}">` : ''}
      <div id="sim-container"></div>
      <h3>Practice Questions</h3>
      ${topic.questions.map((q, i) => `
        <div class="question-block">
          <p><strong>Q:</strong> ${q.q}</p>
          <button onclick="document.getElementById('sol-${i}').classList.toggle('visible')">Show Solution</button>
          <p id="sol-${i}" class="solution"><strong>A:</strong> ${q.a}</p>
        </div>
      `).join('')}
    `;
    
    if (topic.simId && simMap[topic.simId]) {
      simMap[topic.simId](document.getElementById('sim-container')!);
    }
  }
}

window.addEventListener('hashchange', route);
route();
