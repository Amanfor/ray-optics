import katex from 'katex';
export function initSim(container: HTMLElement) {
  container.innerHTML = `
    <svg viewBox="-300 -180 600 360">
      <defs>
        <filter id="ray-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <g id="r-grid"></g><g id="r-content"></g>
    </svg>
    <div class="controls">
      <div class="control-group"><label class="control-label">n1</label><input type="range" id="n1" min="1" max="2.5" step="0.1" value="1.0"></div>
      <div class="control-group"><label class="control-label">n2</label><input type="range" id="n2" min="1" max="2.5" step="0.1" value="1.5"></div>
    </div>
    <div class="readout-grid" id="r-readout"></div>
  `;
  
  let grid = '';
  for(let i=-300; i<=300; i+=50) grid += `<line x1="${i}" y1="-180" x2="${i}" y2="180" class="axis"/>`;
  for(let i=-180; i<=180; i+=50) grid += `<line x1="-300" y1="${i}" x2="300" y2="${i}" class="axis"/>`;
  container.querySelector('#r-grid')!.innerHTML = grid;

  const content = container.querySelector('#r-content') as any;
  const readout = container.querySelector('#r-readout') as HTMLElement;
  let theta1 = 45; let isDragging = false;
  
  function draw() {
    const n1 = parseFloat((container.querySelector('#n1') as HTMLInputElement).value);
    const n2 = parseFloat((container.querySelector('#n2') as HTMLInputElement).value);
    const rad1 = theta1 * Math.PI / 180;
    let sin2 = (n1 / n2) * Math.sin(rad1);
    
    let html = `<rect x="-300" y="0" width="600" height="180" fill="rgba(255,255,255,0.05)" />`;
    html += `<line x1="-300" y1="0" x2="300" y2="0" class="surface" />`;
    html += `<line x1="0" y1="-180" x2="0" y2="180" class="normal" />`;
    
    const x1 = -130 * Math.sin(rad1);
    const y1 = -130 * Math.cos(rad1);
    html += `<line x1="${x1}" y1="${y1}" x2="0" y2="0" class="ray-dim" />`;
    html += `<circle cx="${x1}" cy="${y1}" r="12" stroke="rgba(255,255,255,0.3)" stroke-width="2" fill="transparent" />`;
    html += `<circle cx="${x1}" cy="${y1}" r="8" class="handle" id="drag-handle" />`;
    
    let isTIR = Math.abs(sin2) > 1;
    let theta2 = isTIR ? theta1 : Math.asin(sin2) * 180 / Math.PI;
    
    readout.innerHTML = `
      <div class="readout-cell"><span class="readout-key">n1</span><span class="readout-val">${n1.toFixed(1)}</span></div>
      <div class="readout-cell"><span class="readout-key">n2</span><span class="readout-val">${n2.toFixed(1)}</span></div>
      <div class="readout-cell"><span class="readout-key">θ1</span><span class="readout-val">${theta1.toFixed(1)}°</span></div>
      <div class="readout-cell"><span class="readout-key">θ2</span><span class="readout-val">${isTIR ? 'TIR' : theta2.toFixed(1)+'°'}</span></div>
    `;
    
    const form = document.getElementById('formula-display');
    if (form) {
      if (isTIR) katex.render(`${n1.toFixed(1)} \\sin(${theta1.toFixed(1)}^\\circ) > ${n2.toFixed(1)} \\implies \\text{TIR}`, form, {throwOnError:false});
      else katex.render(`${n1.toFixed(1)} \\sin(${theta1.toFixed(1)}^\\circ) = ${n2.toFixed(1)} \\sin(\\theta_2) \\implies \\theta_2 = ${theta2.toFixed(1)}^\\circ`, form, {throwOnError:false});
    }
    
    if (isTIR) {
      html += `<line x1="0" y1="0" x2="${-x1}" y2="${-y1}" class="ray" filter="url(#ray-glow)" />`;
    } else {
      const rad2 = Math.asin(sin2);
      html += `<line x1="0" y1="0" x2="${130*Math.sin(rad2)}" y2="${130*Math.cos(rad2)}" class="ray" filter="url(#ray-glow)" />`;
    }
    
    content.innerHTML = html;
    
    const svg = container.querySelector('svg');
    const handle: any = container.querySelector('#drag-handle');
    if(handle && svg) {
      handle.onpointerdown = (e:any) => { isDragging = true; svg.setPointerCapture(e.pointerId); };
      svg.onpointermove = (e:any) => {
        if(!isDragging) return;
        const rect = svg.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width * 600 - 300;
        const cy = (e.clientY - rect.top) / rect.height * 360 - 180;
        if (cy < 0) {
          theta1 = Math.abs(Math.atan2(Math.abs(cx), Math.abs(cy)) * 180 / Math.PI);
          draw();
        }
      };
      svg.onpointerup = () => isDragging = false;
    }
  }
  container.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  draw();
}
