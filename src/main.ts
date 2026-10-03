
import './style.css';
import katex from 'katex';
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
    container.innerHTML = '<h1>ray optics concepts</h1><ul style="line-height:2;">' + 
      topics.map(t => `<li><a href="#/topic/${t.id}">${t.title}</a></li>`).join('') +
      '</ul>';
  } else if (hash === '/cheatsheet') {
    container.innerHTML = '<h2>formula cheat sheet</h2><div id="math-render" style="font-size:1.5em; margin:20px;"></div>';
    setTimeout(() => katex.render('\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}', document.getElementById('math-render')!), 0);
  } else if (hash.startsWith('/topic/')) {
    const topicId = hash.replace('/topic/', '');
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    
    container.innerHTML = `<h2>${topic.title}</h2>
      <div id="sim-container" style="margin:20px 0;"></div>
    `;
    
    if (topic.simId && simMap[topic.simId]) {
      simMap[topic.simId](document.getElementById('sim-container')!);
    }
  }
}

window.addEventListener('hashchange', route);
route();
