import katex from 'katex';
export function initSim(container: HTMLElement) {
  container.innerHTML = `
    <svg viewBox="-300 -180 600 360">
      <defs><filter id="ray-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g id="p-grid"></g><g id="p-content"></g>
    </svg>
    <div class="controls">
      <div class="control-group"><label class="control-label">Incidence i</label><input type="range" id="p-i" min="30" max="80" step="1" value="45"></div>
      <div class="control-group"><label class="control-label">Index μ</label><input type="range" id="p-m" min="1.3" max="2.0" step="0.05" value="1.5"></div>
    </div>
    <div class="readout-grid" id="p-readout"></div>
  `;
  
  let grid = '';
  for(let i=-300; i<=300; i+=50) grid += `<line x1="${i}" y1="-180" x2="${i}" y2="180" class="axis"/>`;
  for(let i=-180; i<=180; i+=50) grid += `<line x1="-300" y1="${i}" x2="300" y2="${i}" class="axis"/>`;
  container.querySelector('#p-grid')!.innerHTML = grid;

  const content = container.querySelector('#p-content') as any;
  const readout = container.querySelector('#p-readout') as HTMLElement;
  
  function draw() {
    const iDeg = parseFloat((container.querySelector('#p-i') as HTMLInputElement).value);
    const mu = parseFloat((container.querySelector('#p-m') as HTMLInputElement).value);
    const A = 60; 
    const A_rad = A * Math.PI / 180;
    const i_rad = iDeg * Math.PI / 180;
    
    const r1_rad = Math.asin(Math.sin(i_rad) / mu);
    const r2_rad = A_rad - r1_rad;
    const sin_e = mu * Math.sin(r2_rad);
    
    let isTIR = Math.abs(sin_e) > 1;
    let eDeg = isTIR ? 0 : Math.asin(sin_e) * 180 / Math.PI;
    let delta = isTIR ? 0 : iDeg + eDeg - A;
    
    readout.innerHTML = `
      <div class="readout-cell"><span class="readout-key">i (Incidence)</span><span class="readout-val">${iDeg.toFixed(1)}°</span></div>
      <div class="readout-cell"><span class="readout-key">μ (Index)</span><span class="readout-val">${mu.toFixed(2)}</span></div>
      <div class="readout-cell"><span class="readout-key">e (Exit)</span><span class="readout-val">${isTIR ? 'TIR' : eDeg.toFixed(1)+'°'}</span></div>
      <div class="readout-cell"><span class="readout-key">δ (Deviation)</span><span class="readout-val">${isTIR ? '-' : delta.toFixed(1)+'°'}</span></div>
    `;
    
    const form = document.getElementById('formula-display');
    if (form) {
      if (isTIR) katex.render(`\\text{TIR at second surface}`, form, {throwOnError:false});
      else katex.render(`\\delta = i + e - A = ${iDeg.toFixed(1)}^\\circ + ${eDeg.toFixed(1)}^\\circ - ${A}^\\circ = ${delta.toFixed(1)}^\\circ`, form, {throwOnError:false});
    }
    
    let html = '';
    const side = 200; const h = side * Math.sqrt(3)/2;
    html += `<polygon points="0,${-h/2} ${-side/2},${h/2} ${side/2},${h/2}" class="lens-body" />`;
    html += `<text x="-190" y="-150" class="label label-bright">Schematic raytrace (math is exact)</text>`;
    content.innerHTML = html;
  }
  
  container.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  draw();
}
