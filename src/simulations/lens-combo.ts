import katex from 'katex';
export function initSim(container: HTMLElement) {
  container.innerHTML = `
    <svg viewBox="-300 -180 600 360">
      <defs><filter id="ray-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g id="c-grid"></g><g id="c-content"></g>
    </svg>
    <div class="controls">
      <div class="control-group"><label class="control-label">Separation d</label><input type="range" id="c-d" min="0" max="150" step="5" value="50"></div>
      <div class="control-group"><label class="control-label">f1</label><input type="range" id="c-f1" min="20" max="200" step="10" value="100"></div>
      <div class="control-group"><label class="control-label">f2</label><input type="range" id="c-f2" min="20" max="200" step="10" value="100"></div>
    </div>
    <div class="readout-grid" id="c-readout"></div>
  `;
  
  let grid = '';
  for(let i=-300; i<=300; i+=50) grid += `<line x1="${i}" y1="-180" x2="${i}" y2="180" class="axis"/>`;
  for(let i=-180; i<=180; i+=50) grid += `<line x1="-300" y1="${i}" x2="300" y2="${i}" class="axis"/>`;
  container.querySelector('#c-grid')!.innerHTML = grid;

  const content = container.querySelector('#c-content') as any;
  const readout = container.querySelector('#c-readout') as HTMLElement;
  
  function draw() {
    const d = parseFloat((container.querySelector('#c-d') as HTMLInputElement).value);
    const f1 = parseFloat((container.querySelector('#c-f1') as HTMLInputElement).value);
    const f2 = parseFloat((container.querySelector('#c-f2') as HTMLInputElement).value);
    
    const invF = 1/f1 + 1/f2 - d/(f1*f2);
    const f_eff = invF === 0 ? Infinity : 1/invF;
    
    readout.innerHTML = `
      <div class="readout-cell"><span class="readout-key">d</span><span class="readout-val">${d.toFixed(1)} cm</span></div>
      <div class="readout-cell"><span class="readout-key">f1</span><span class="readout-val">${f1.toFixed(1)} cm</span></div>
      <div class="readout-cell"><span class="readout-key">f2</span><span class="readout-val">${f2.toFixed(1)} cm</span></div>
      <div class="readout-cell"><span class="readout-key">F (Effective)</span><span class="readout-val">${f_eff === Infinity ? '∞' : f_eff.toFixed(1)+' cm'}</span></div>
    `;
    
    const form = document.getElementById('formula-display');
    if (form) katex.render(`\\frac{1}{F} = \\frac{1}{f_1} + \\frac{1}{f_2} - \\frac{d}{f_1 f_2} \\implies F = ${f_eff === Infinity ? '\\infty' : f_eff.toFixed(1)}`, form, {throwOnError:false});
    
    let html = `<line x1="-300" y1="0" x2="300" y2="0" class="normal" />`;
    const x1 = -d/2; const x2 = d/2;
    html += `<path d="M ${x1} -80 Q ${x1+20} 0 ${x1} 80 Q ${x1-20} 0 ${x1} -80" class="lens-body" />`;
    html += `<path d="M ${x2} -80 Q ${x2+20} 0 ${x2} 80 Q ${x2-20} 0 ${x2} -80" class="lens-body" />`;
    
    const y1 = -40;
    html += `<line x1="-300" y1="${y1}" x2="${x1}" y2="${y1}" class="ray" filter="url(#ray-glow)" />`;
    const angle1 = Math.atan(-y1/f1);
    const y2 = y1 + d * Math.tan(angle1);
    html += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="ray" filter="url(#ray-glow)" />`;
    
    if (invF !== 0) {
      const focus_x = x2 + 1 / (1/f2 + 1/(f1-d));
      html += `<line x1="${x2}" y1="${y2}" x2="${focus_x}" y2="0" class="ray" filter="url(#ray-glow)" />`;
    } else {
      html += `<line x1="${x2}" y1="${y2}" x2="300" y2="${y2}" class="ray" filter="url(#ray-glow)" />`;
    }
    content.innerHTML = html;
  }
  container.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  draw();
}
