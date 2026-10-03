const fs = require('fs');

const files = {
  'src/data/topics.ts': `export const topics = [];\nexport const questions = [];`,
  'src/pages/home.ts': `export function renderHome(el: HTMLElement) { el.innerHTML = '<h1>ray optics</h1>'; }`,
  'src/pages/cheatsheet.ts': `export function renderCheatSheet(el: HTMLElement) { el.innerHTML = '<h2>formula cheat sheet</h2>'; }`,
  'src/pages/topic.ts': `export function renderTopic(el: HTMLElement, id: string) { el.innerHTML = '<h2>topic: ' + id + '</h2>'; }`,
  'src/main.ts': `import './style.css';
import { renderHome } from './pages/home';
import { renderCheatSheet } from './pages/cheatsheet';
import { renderTopic } from './pages/topic';

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
    renderHome(container);
  } else if (hash === '/cheatsheet') {
    renderCheatSheet(container);
  } else if (hash.startsWith('/topic/')) {
    renderTopic(container, hash.replace('/topic/', ''));
  }
}

window.addEventListener('hashchange', route);
route();
`
};

const simulations = [
  'reflection', 'refraction', 'tir', 'spherical-mirror',
  'thin-lens', 'prism', 'lens-combo', 'microscope', 'telescope', 'dispersion'
];

simulations.forEach(sim => {
  files[`src/simulations/${sim}.ts`] = `export function initSim(container: HTMLElement) {
  container.innerHTML = '<div class="sim-container"><svg></svg><div class="formula-display">simulation: ${sim}</div></div>';
}`;
});

for (const [path, content] of Object.entries(files)) {
  fs.mkdirSync(path.split('/').slice(0, -1).join('/'), { recursive: true });
  fs.writeFileSync(path, content);
}
