import katex from 'katex';
export function initSim(container: HTMLElement) {
  container.innerHTML = `
    <svg viewBox="-50 -100 250 200">
      <defs><filter id="ray-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g id="te-grid"></g><g id="te-content"></g>
    </svg>
    <div class="controls">
      <div class="control-group"><label class="control-label">f_o</label><input type="range" id="t-fo" min="50" max="200" step="10" value="100"></div>
      <div class="control-group"><label class="control-label">f_e</label><input type="range" id="t-fe" min="5" max="40" step="5" value="10"></div>
    </div>
    <div class="readout-grid" id="te-readout"></div>
  `;
  
  let grid = '';
  for(let i=-50; i<=250; i+=50) grid += `<line x1="${i}" y1="-100" x2="${i}" y2="100" class="axis"/>`;
  for(let i=-100; i<=100; i+=50) grid += `<line x1="-50" y1="${i}" x2="250" y2="${i}" class="axis"/>`;
  container.querySelector('#te-grid')!.innerHTML = grid;

  const content = container.querySelector('#te-content') as any;
  const readout = container.querySelector('#te-readout') as HTMLElement;
  
  function draw() {
    const fo = parseFloat((container.querySelector('#t-fo') as HTMLInputElement).value);
    const fe = parseFloat((container.querySelector('#t-fe') as HTMLInputElement).value);
    const M = -fo/fe;
    const L = fo + fe;
    
    readout.innerHTML = `
      <div class="readout-cell"><span class="readout-key">L (Tube Length)</span><span class="readout-val">${L} cm</span></div>
      <div class="readout-cell"><span class="readout-key">M (Magnification)</span><span class="readout-val">${M.toFixed(1)}x</span></div>
    `;
    
    const form = document.getElementById('formula-display');
    if (form) katex.render(`M = -\\frac{f_o}{f_e} = ${M.toFixed(1)}`, form, {throwOnError:false});
    
    let html = `<line x1="-50" y1="0" x2="250" y2="0" class="normal" />`;
    html += `<path d="M 0 -40 Q 10 0 0 40 Q -10 0 0 -40" class="lens-body" />`;
    html += `<path d="M ${L} -20 Q ${L+5} 0 ${L} 20 Q ${L-5} 0 ${L} -20" class="lens-body" />`;
    html += `<line x1="-50" y1="-10" x2="0" y2="0" class="ray-dim" />`;
    html += `<line x1="-50" y1="-20" x2="0" y2="-10" class="ray-dim" />`;
    html += `<line x1="0" y1="0" x2="${fo}" y2="0" class="ray" filter="url(#ray-glow)" />`;
    html += `<line x1="0" y1="-10" x2="${fo}" y2="0" class="ray" filter="url(#ray-glow)" />`;
    
    content.innerHTML = html;
  }
  container.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  draw();
}
