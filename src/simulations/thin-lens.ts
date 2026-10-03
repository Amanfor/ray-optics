import katex from 'katex';
export function initSim(container: HTMLElement) {
  container.innerHTML = `
    <svg viewBox="-300 -180 600 360">
      <defs><filter id="ray-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g id="l-grid"></g><g id="l-content"></g>
    </svg>
    <div class="controls">
      <div class="control-group">
        <label class="control-label">Lens Type</label>
        <select id="l-type" style="background:transparent; color:white; border:1px solid rgba(255,255,255,0.25); padding:5px;"><option value="100">Convex (f=100)</option><option value="-100">Concave (f=-100)</option></select>
      </div>
    </div>
    <div class="readout-grid" id="l-readout"></div>
  `;
  
  let grid = '';
  for(let i=-300; i<=300; i+=50) grid += `<line x1="${i}" y1="-180" x2="${i}" y2="180" class="axis"/>`;
  for(let i=-180; i<=180; i+=50) grid += `<line x1="-300" y1="${i}" x2="300" y2="${i}" class="axis"/>`;
  container.querySelector('#l-grid')!.innerHTML = grid;

  const content = container.querySelector('#l-content') as any;
  const readout = container.querySelector('#l-readout') as HTMLElement;
  let u = -150; let f = 100; let isDragging = false;
  
  function draw() {
    const v = 1 / (1/f + 1/u);
    const m = v / u;
    
    readout.innerHTML = `
      <div class="readout-cell"><span class="readout-key">u (Object)</span><span class="readout-val">${u.toFixed(1)}</span></div>
      <div class="readout-cell"><span class="readout-key">v (Image)</span><span class="readout-val">${v.toFixed(1)}</span></div>
      <div class="readout-cell"><span class="readout-key">f (Focal)</span><span class="readout-val">${f.toFixed(1)}</span></div>
      <div class="readout-cell"><span class="readout-key">m (Mag)</span><span class="readout-val">${m.toFixed(2)}</span></div>
    `;
    
    const form = document.getElementById('formula-display');
    if (form) katex.render(`\\frac{1}{v} - \\frac{1}{${u.toFixed(1)}} = \\frac{1}{${f.toFixed(1)}} \\implies v = ${v.toFixed(1)} \\text{ cm}`, form, {throwOnError:false});
    
    let html = `<line x1="-300" y1="0" x2="300" y2="0" class="normal" />`;
    if (f > 0) {
      html += `<path d="M 0 -100 Q 30 0 0 100 Q -30 0 0 -100" class="lens-body" />`;
    } else {
      html += `<path d="M -20 -100 L 20 -100 Q 0 0 20 100 L -20 100 Q 0 0 -20 -100" class="lens-body" />`;
    }
    html += `<line x1="0" y1="-140" x2="0" y2="140" class="normal" />`;
    
    html += `<line x1="${u}" y1="0" x2="${u}" y2="-50" stroke="white" stroke-width="2" />`;
    html += `<circle cx="${u}" cy="-50" r="12" stroke="rgba(255,255,255,0.3)" stroke-width="2" fill="transparent" />`;
    html += `<circle cx="${u}" cy="-50" r="8" class="handle" id="obj-handle" />`;
    
    const imgY = -50 * m;
    html += `<line x1="${v}" y1="0" x2="${v}" y2="${imgY}" class="image-ray" />`;
    
    html += `<line x1="${u}" y1="-50" x2="0" y2="-50" class="ray-dim" />`;
    html += `<line x1="0" y1="-50" x2="${v}" y2="${imgY}" class="ray" filter="url(#ray-glow)" />`;
    html += `<line x1="${u}" y1="-50" x2="0" y2="0" class="ray-dim" />`;
    html += `<line x1="0" y1="0" x2="${v}" y2="${imgY}" class="ray" filter="url(#ray-glow)" />`;
    
    content.innerHTML = html;
    
    const svg = container.querySelector('svg');
    const handle: any = container.querySelector('#obj-handle');
    if(handle && svg) {
      handle.onpointerdown = (e: any) => { isDragging = true; svg.setPointerCapture(e.pointerId); };
      svg.onpointermove = (e: any) => {
        if(!isDragging) return;
        const rect = svg.getBoundingClientRect();
        u = Math.min((e.clientX - rect.left) / rect.width * 600 - 300, -10);
        draw();
      };
      svg.onpointerup = () => isDragging = false;
    }
  }
  (container.querySelector('#l-type') as HTMLSelectElement).onchange = (e:any) => { f = parseFloat(e.target.value); draw(); };
  draw();
}
