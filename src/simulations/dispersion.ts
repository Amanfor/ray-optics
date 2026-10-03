import katex from 'katex';
export function initSim(container: HTMLElement) {
  container.innerHTML = `
    <svg viewBox="-150 -100 450 200">
      <defs><filter id="ray-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g id="d-grid"></g><g id="d-content"></g>
    </svg>
    <div class="controls">
      <div class="control-group"><label class="control-label">Dispersive Power</label><input type="range" id="d-p" min="0.01" max="0.3" step="0.01" value="0.1"></div>
    </div>
    <div class="readout-grid" id="d-readout"></div>
  `;
  
  let grid = '';
  for(let i=-150; i<=300; i+=50) grid += `<line x1="${i}" y1="-100" x2="${i}" y2="100" class="axis"/>`;
  for(let i=-100; i<=100; i+=50) grid += `<line x1="-150" y1="${i}" x2="300" y2="${i}" class="axis"/>`;
  container.querySelector('#d-grid')!.innerHTML = grid;

  const content = container.querySelector('#d-content') as any;
  const readout = container.querySelector('#d-readout') as HTMLElement;
  
  function draw() {
    const w = parseFloat((container.querySelector('#d-p') as HTMLInputElement).value);
    const delta_y = 30; 
    const delta_v = delta_y + w * delta_y;
    const delta_r = delta_y - w * delta_y;
    
    readout.innerHTML = `
      <div class="readout-cell"><span class="readout-key">Angular Spread</span><span class="readout-val">${(delta_v - delta_r).toFixed(2)}°</span></div>
    `;
    
    const form = document.getElementById('formula-display');
    if (form) katex.render(`\\omega = \\frac{\\delta_V - \\delta_R}{\\delta_y} \\implies \\text{Spread} = ${(delta_v - delta_r).toFixed(2)}^\\circ`, form, {throwOnError:false});
    
    let html = `
      <polygon points="0,-50 -50,36.6 50,36.6" class="lens-body" />
      <line x1="-150" y1="10" x2="-25" y2="10" stroke="white" stroke-width="3" filter="url(#ray-glow)" />
    `;
    
    const colors = ['#8A2BE2', '#4B0082', '#0000FF', '#00FF00', '#FFFF00', '#FFA500', '#FF0000'];
    colors.forEach((c, i) => {
      const d = delta_v - (i/6)*(delta_v - delta_r);
      const rad = d * Math.PI / 180;
      const ex = 25; const ey = 10;
      const nx = ex + 150 * Math.cos(rad);
      const ny = ey + 150 * Math.sin(rad);
      html += `<line x1="${ex}" y1="${ey}" x2="${nx}" y2="${ny}" stroke="${c}" stroke-width="2" filter="url(#ray-glow)" />`;
      html += `<line x1="-25" y1="10" x2="${ex}" y2="${ey}" stroke="${c}" stroke-width="0.5"/>`;
    });
    
    content.innerHTML = html;
  }
  container.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  draw();
}
