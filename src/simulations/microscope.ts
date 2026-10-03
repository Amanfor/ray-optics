import katex from 'katex';
export function initSim(container: HTMLElement) {
  container.innerHTML = `
    <svg viewBox="-150 -100 450 200">
      <defs><filter id="ray-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g id="mi-grid"></g><g id="mi-content"></g>
    </svg>
    <div class="controls">
      <div class="control-group"><label class="control-label">f_o</label><input type="range" id="m-fo" min="1" max="10" step="1" value="2"></div>
      <div class="control-group"><label class="control-label">f_e</label><input type="range" id="m-fe" min="2" max="20" step="1" value="5"></div>
      <div class="control-group"><label class="control-label">u_o</label><input type="range" id="m-uo" min="2.1" max="5" step="0.1" value="2.5"></div>
    </div>
    <div class="readout-grid" id="mi-readout"></div>
  `;
  
  let grid = '';
  for(let i=-150; i<=300; i+=50) grid += `<line x1="${i}" y1="-100" x2="${i}" y2="100" class="axis"/>`;
  for(let i=-100; i<=100; i+=50) grid += `<line x1="-150" y1="${i}" x2="300" y2="${i}" class="axis"/>`;
  container.querySelector('#mi-grid')!.innerHTML = grid;

  const content = container.querySelector('#mi-content') as any;
  const readout = container.querySelector('#mi-readout') as HTMLElement;
  
  function draw() {
    const fo = parseFloat((container.querySelector('#m-fo') as HTMLInputElement).value);
    const fe = parseFloat((container.querySelector('#m-fe') as HTMLInputElement).value);
    const uo = parseFloat((container.querySelector('#m-uo') as HTMLInputElement).value);
    
    const vo = 1 / (1/fo - 1/uo);
    const D = 25;
    const M = -(vo/uo) * (1 + D/fe);
    
    readout.innerHTML = `
      <div class="readout-cell"><span class="readout-key">v_o</span><span class="readout-val">${vo.toFixed(2)} cm</span></div>
      <div class="readout-cell"><span class="readout-key">Magnification M</span><span class="readout-val">${M.toFixed(1)}x</span></div>
    `;
    
    const form = document.getElementById('formula-display');
    if (form) katex.render(`M = -\\frac{v_o}{u_o}\\left(1 + \\frac{D}{f_e}\\right) = ${M.toFixed(1)}`, form, {throwOnError:false});
    
    let html = `<line x1="-150" y1="0" x2="300" y2="0" class="normal" />`;
    html += `<path d="M 0 -20 Q 5 0 0 20 Q -5 0 0 -20" class="lens-body" />`;
    html += `<path d="M ${vo + fe} -40 Q ${vo + fe + 10} 0 ${vo + fe} 40 Q ${vo + fe - 10} 0 ${vo + fe} -40" class="lens-body" />`;
    html += `<line x1="${-uo}" y1="0" x2="${-uo}" y2="-10" stroke="white" stroke-width="2"/>`; 
    html += `<line x1="${vo}" y1="0" x2="${vo}" y2="${10*(vo/uo)}" stroke="rgba(255,255,255,0.5)" stroke-width="2"/>`;
    
    content.innerHTML = html;
  }
  container.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  draw();
}
