import os

sims = {
"src/simulations/spherical-mirror.ts": r'''import katex from 'katex';
export function initSim(container: HTMLElement) {
  container.innerHTML = `
    <svg viewBox="-300 -180 600 360">
      <defs>
        <filter id="ray-glow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g id="m-grid"></g><g id="m-content"></g>
    </svg>
    <div class="controls">
      <div class="control-group">
        <label class="control-label">Mirror Type</label>
        <select id="m-type" style="background:transparent; color:white; border:1px solid rgba(255,255,255,0.25); padding:5px;"><option value="-100">Concave (f=-100)</option><option value="100">Convex (f=100)</option></select>
      </div>
    </div>
    <div class="readout-grid" id="m-readout"></div>
  `;
  
  let grid = '';
  for(let i=-300; i<=300; i+=50) grid += `<line x1="${i}" y1="-180" x2="${i}" y2="180" class="axis"/>`;
  for(let i=-180; i<=180; i+=50) grid += `<line x1="-300" y1="${i}" x2="300" y2="${i}" class="axis"/>`;
  container.querySelector('#m-grid')!.innerHTML = grid;

  const content = container.querySelector('#m-content') as any;
  const readout = container.querySelector('#m-readout') as HTMLElement;
  const select = container.querySelector('#m-type') as HTMLSelectElement;
  
  let u = -150; let f = -100; let isDragging = false;
  
  function draw() {
    const v = (u * f) / (u - f);
    const m = -v / u;
    
    readout.innerHTML = `
      <div class="readout-cell"><span class="readout-key">u (Object)</span><span class="readout-val">${u.toFixed(1)}</span></div>
      <div class="readout-cell"><span class="readout-key">v (Image)</span><span class="readout-val">${v.toFixed(1)}</span></div>
      <div class="readout-cell"><span class="readout-key">f (Focal)</span><span class="readout-val">${f.toFixed(1)}</span></div>
      <div class="readout-cell"><span class="readout-key">m (Mag)</span><span class="readout-val">${m.toFixed(2)}</span></div>
    `;
    
    const form = document.getElementById('formula-display');
    if (form) katex.render(`\\frac{1}{v} + \\frac{1}{${u.toFixed(1)}} = \\frac{1}{${f.toFixed(1)}} \\implies v = ${v.toFixed(1)} \\text{ cm}`, form, {throwOnError:false});
    
    let html = `<line x1="-300" y1="0" x2="300" y2="0" class="normal" />`;
    const curve = f < 0 ? 'M -20 -100 Q 40 0 -20 100' : 'M 20 -100 Q -40 0 20 100';
    html += `<path d="${curve}" class="mirror" />`;
    
    // object
    html += `<line x1="${u}" y1="0" x2="${u}" y2="-50" class="ray" />`;
    html += `<circle cx="${u}" cy="-50" r="12" stroke="rgba(255,255,255,0.3)" stroke-width="2" fill="transparent" />`;
    html += `<circle cx="${u}" cy="-50" r="8" class="handle" id="obj-handle" />`;
    
    // image
    const imgY = -50 * m;
    html += `<line x1="${v}" y1="0" x2="${v}" y2="${imgY}" class="image-ray" />`;
    
    html += `<line x1="${u}" y1="-50" x2="0" y2="-50" class="ray-dim" />`;
    html += `<line x1="0" y1="-50" x2="${v}" y2="${imgY}" class="ray" filter="url(#ray-glow)" />`;
    html += `<line x1="${u}" y1="-50" x2="0" y2="0" class="ray-dim" />`;
    html += `<line x1="0" y1="0" x2="${v}" y2="${imgY}" class="ray" filter="url(#ray-glow)" />`;
    
    content.innerHTML = html;
    
    const svg = container.querySelector('svg');
    const handle = container.querySelector('#obj-handle');
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
  select.onchange = () => { f = parseFloat(select.value); draw(); };
  draw();
}
''',
"src/simulations/refraction.ts": r'''import katex from 'katex';
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
    const handle = container.querySelector('#drag-handle');
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
''',
"src/simulations/tir.ts": r'''import katex from 'katex';
export function initSim(container: HTMLElement) {
  container.innerHTML = `
    <svg viewBox="-300 -180 600 360">
      <defs><filter id="ray-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <g id="t-grid"></g><g id="t-content"></g>
    </svg>
    <div class="controls">
      <div class="control-group"><label class="control-label">n1 (denser)</label><input type="range" id="t-n1" min="1.0" max="2.5" step="0.1" value="1.5"></div>
      <div class="control-group"><label class="control-label">n2 (rarer)</label><input type="range" id="t-n2" min="1.0" max="2.5" step="0.1" value="1.0"></div>
    </div>
    <div class="readout-grid" id="t-readout"></div>
  `;
  
  let grid = '';
  for(let i=-300; i<=300; i+=50) grid += `<line x1="${i}" y1="-180" x2="${i}" y2="180" class="axis"/>`;
  for(let i=-180; i<=180; i+=50) grid += `<line x1="-300" y1="${i}" x2="300" y2="${i}" class="axis"/>`;
  container.querySelector('#t-grid')!.innerHTML = grid;

  const content = container.querySelector('#t-content') as any;
  const readout = container.querySelector('#t-readout') as HTMLElement;
  let theta1 = 30; let isDragging = false;
  
  function draw() {
    let n1 = parseFloat((container.querySelector('#t-n1') as HTMLInputElement).value);
    let n2 = parseFloat((container.querySelector('#t-n2') as HTMLInputElement).value);
    if(n1 <= n2) { n1 = n2 + 0.1; (container.querySelector('#t-n1') as any).value = n1.toFixed(1); }
    
    const critRad = Math.asin(n2/n1);
    const critDeg = critRad * 180 / Math.PI;
    const rad1 = theta1 * Math.PI / 180;
    let sin2 = (n1 / n2) * Math.sin(rad1);
    
    let html = `<rect x="-300" y="0" width="600" height="180" fill="rgba(255,255,255,0.05)" />`;
    html += `<line x1="-300" y1="0" x2="300" y2="0" class="surface" />`;
    html += `<line x1="0" y1="-180" x2="0" y2="180" class="normal" />`;
    
    const cx1 = -130 * Math.sin(critRad);
    const cy1 = 130 * Math.cos(critRad);
    html += `<line x1="0" y1="0" x2="${cx1}" y2="${cy1}" class="angle-arc" stroke-dasharray="3,3" />`;
    
    const x1 = -130 * Math.sin(rad1);
    const y1 = 130 * Math.cos(rad1);
    html += `<line x1="${x1}" y1="${y1}" x2="0" y2="0" class="ray-dim" />`;
    html += `<circle cx="${x1}" cy="${y1}" r="12" stroke="rgba(255,255,255,0.3)" stroke-width="2" fill="transparent" />`;
    html += `<circle cx="${x1}" cy="${y1}" r="8" class="handle" id="drag-handle" />`;
    
    let isTIR = Math.abs(sin2) > 1;
    let theta2 = isTIR ? theta1 : Math.asin(sin2) * 180 / Math.PI;
    
    readout.innerHTML = `
      <div class="readout-cell"><span class="readout-key">θ_c (Critical)</span><span class="readout-val">${critDeg.toFixed(1)}°</span></div>
      <div class="readout-cell"><span class="readout-key">θ1</span><span class="readout-val">${theta1.toFixed(1)}°</span></div>
      <div class="readout-cell"><span class="readout-key">θ2</span><span class="readout-val">${isTIR ? 'TIR' : theta2.toFixed(1)+'°'}</span></div>
    `;
    
    const form = document.getElementById('formula-display');
    if (form) {
      if (isTIR) katex.render(`\\theta_c = \\sin^{-1}(\\frac{${n2.toFixed(1)}}{${n1.toFixed(1)}}) = ${critDeg.toFixed(1)}^\\circ \\implies \\text{TIR}`, form, {throwOnError:false});
      else katex.render(`\\theta_1 < \\theta_c \\implies \\theta_2 = ${theta2.toFixed(1)}^\\circ`, form, {throwOnError:false});
    }
    
    if (isTIR) {
      html += `<line x1="0" y1="0" x2="${-x1}" y2="${y1}" class="ray" filter="url(#ray-glow)" />`;
      html += `<text x="20" y="40" class="tir-flash">TIR!</text>`;
    } else {
      const rad2 = Math.asin(sin2);
      html += `<line x1="0" y1="0" x2="${130*Math.sin(rad2)}" y2="${-130*Math.cos(rad2)}" class="ray" filter="url(#ray-glow)" />`;
    }
    
    content.innerHTML = html;
    
    const svg = container.querySelector('svg');
    const handle = container.querySelector('#drag-handle');
    if(handle && svg) {
      handle.onpointerdown = (e:any) => { isDragging = true; svg.setPointerCapture(e.pointerId); };
      svg.onpointermove = (e:any) => {
        if(!isDragging) return;
        const rect = svg.getBoundingClientRect();
        const cx = (e.clientX - rect.left) / rect.width * 600 - 300;
        const cy = (e.clientY - rect.top) / rect.height * 360 - 180;
        if (cy > 0 && cx < 0) {
          theta1 = Math.atan2(Math.abs(cx), Math.abs(cy)) * 180 / Math.PI;
          draw();
        }
      };
      svg.onpointerup = () => isDragging = false;
    }
  }
  container.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  draw();
}
''',
"src/simulations/thin-lens.ts": r'''import katex from 'katex';
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
    const handle = container.querySelector('#obj-handle');
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
''',
"src/simulations/prism.ts": r'''import katex from 'katex';
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
''',
"src/simulations/lens-combo.ts": r'''import katex from 'katex';
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
''',
"src/simulations/microscope.ts": r'''import katex from 'katex';
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
''',
"src/simulations/telescope.ts": r'''import katex from 'katex';
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
''',
"src/simulations/dispersion.ts": r'''import katex from 'katex';
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
''',
"src/data/topics.ts": r'''
export interface Topic { id: string; title: string; description: string; simId?: string; image?: string; questions: Array<{q: string, a: string}>; }
export const topics: Topic[] = [
  { id: "reflection", title: "Spherical Mirror", description: "Reflection on curved surfaces forming real or virtual images.", simId: "spherical-mirror", image: "/media/reflection_mirrors_and_refraction_apparent_depth_tir.webp", questions: [
    {q: "Find the focal length of a concave mirror with radius 20cm.", a: "f = R/2 = 10cm (Concave mirrors have negative f depending on convention, usually -10cm)."}
  ] },
  { id: "refraction", title: "Refraction & Snell's Law", description: "Bending of light across media with different refractive indices.", simId: "refraction", image: "/media/refraction_at_spherical_surface_geometry.webp", questions: [] },
  { id: "tir", title: "Total Internal Reflection", description: "Complete reflection when light in denser medium exceeds critical angle.", simId: "tir", image: "/media/optical_fiber_total_internal_reflection.webp", questions: [] },
  { id: "thin-lens", title: "Thin Lenses", description: "Lenses that can be treated with the thin lens approximation.", simId: "thin-lens", image: "/media/thin_lens_ray_diagram_and_displacement_method.webp", questions: [] },
  { id: "prism", title: "Prisms", description: "Deviation and dispersion of light through an angled transparent block.", simId: "prism", image: "/media/prism_dispersion_and_spherical_lens_refraction.webp", questions: [] },
  { id: "lens-combo", title: "Lens Combination", description: "Equivalent focal length of two separated lenses.", simId: "lens-combo", image: "/media/lens_combinations_cutting_and_silvering.webp", questions: [] },
  { id: "microscope", title: "Compound Microscope", description: "Two convex lenses combining to produce highly magnified images.", simId: "microscope", image: "/media/optical_instruments_microscopes_telescopes_and_defects.webp", questions: [] },
  { id: "telescope", title: "Astronomical Telescope", description: "Lenses capturing light from distant objects for angular magnification.", simId: "telescope", questions: [] },
  { id: "dispersion", title: "Dispersion", description: "Separation of white light into colors due to index variation by wavelength.", simId: "dispersion", questions: [] }
];
''',
"src/main.ts": r'''
import './style.css';
import katex from 'katex';
import Lenis from 'lenis';
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

const lenis = new Lenis({
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

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

function createHeroCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  let w = 0, h = 0; let animId: number;
  function resize() { w = canvas.offsetWidth; h = canvas.offsetHeight; canvas.width = w; canvas.height = h; }
  const rays = Array.from({length: 5}, (_, i) => ({
    x: Math.random() * 400, y: Math.random() * 300,
    angle: (Math.PI / 8) * (i + 1), speed: 1.2 + i * 0.3, len: 180 + i * 40,
  }));
  function draw() {
    ctx.clearRect(0, 0, w, h);
    rays.forEach(ray => {
      ray.x += Math.cos(ray.angle) * ray.speed; ray.y += Math.sin(ray.angle) * ray.speed;
      if (ray.x < 0 || ray.x > w) ray.angle = Math.PI - ray.angle;
      if (ray.y < 0 || ray.y > h) ray.angle = -ray.angle;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1;
      ctx.moveTo(ray.x, ray.y);
      ctx.lineTo(ray.x + Math.cos(ray.angle) * ray.len, ray.y + Math.sin(ray.angle) * ray.len);
      ctx.stroke();
    });
    animId = requestAnimationFrame(draw);
  }
  resize(); window.addEventListener('resize', resize);
  animId = requestAnimationFrame(draw);
  return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
}

function renderTopicCard(topic: any, index: number): string {
  return `<a class="topic-card" href="#/topic/${topic.id}">
    <span class="card-num">${String(index + 1).padStart(2, '0')}</span>
    <span class="card-title">${topic.title}</span>
    <span class="card-desc">${topic.description || ''}</span>
    <span class="card-arrow">→</span>
  </a>`;
}

let canvasCleanup: any = null;

function route() {
  if(canvasCleanup) { canvasCleanup(); canvasCleanup = null; }
  const hash = window.location.hash.slice(1) || '/';
  app.innerHTML = '';
  
  const page = document.createElement('div');
  page.className = 'page-enter';
  
  const nav = `
    <nav class="nav-bar">
      <a href="#/" class="nav-logo">ray optics</a>
      <div class="nav-links">
        <a href="#/">Home</a>
        <a href="#/cheatsheet">Cheat Sheet</a>
      </div>
    </nav>
  `;

  if (hash === '/') {
    page.innerHTML = nav + `
      <section class="hero">
        <canvas class="hero-canvas" id="hero-canvas"></canvas>
        <p class="hero-eyebrow">Physics · Class 12 · JEE</p>
        <h1>ray optics<br><em>visualised</em></h1>
        <p class="hero-desc">interactive simulations for every concept. drag rays, adjust parameters, see physics happen live.</p>
        <div class="search-wrap">
          <input type="text" id="search" placeholder="search concepts..." autocomplete="off" spellcheck="false">
        </div>
      </section>
      <section class="topics-section">
        <p class="section-label">concepts</p>
        <div class="topic-grid" id="topic-grid">
          ${topics.map((t, i) => renderTopicCard(t, i)).join('')}
        </div>
      </section>
    `;
    app.appendChild(page);
    canvasCleanup = createHeroCanvas(document.getElementById('hero-canvas') as HTMLCanvasElement);
    
    const search = document.getElementById('search') as HTMLInputElement;
    search.addEventListener('input', (e: any) => {
      const v = e.target.value.toLowerCase();
      const filtered = topics.filter(t => t.title.toLowerCase().includes(v) || t.description.toLowerCase().includes(v));
      document.getElementById('topic-grid')!.innerHTML = filtered.map((t, i) => renderTopicCard(t, i)).join('');
    });
    
  } else if (hash === '/cheatsheet') {
    page.innerHTML = nav + `
      <div class="cheatsheet-page">
        <h1>Formula Cheat Sheet</h1>
        <table class="formula-table">
          <tr><th>Topic</th><th>Formula</th></tr>
          <tr><td>Mirror Equation</td><td><span class="math">\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}</span></td></tr>
          <tr><td>Snell's Law</td><td><span class="math">n_1 \\sin i = n_2 \\sin r</span></td></tr>
          <tr><td>Lens Maker</td><td><span class="math">\\frac{1}{f} = (n-1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)</span></td></tr>
        </table>
      </div>
    `;
    app.appendChild(page);
    setTimeout(() => {
       document.querySelectorAll('.math').forEach(el => katex.render(el.textContent||'', el as HTMLElement, {throwOnError:false}));
    }, 0);
    
  } else if (hash.startsWith('/topic/')) {
    const topicId = hash.replace('/topic/', '');
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    
    page.innerHTML = nav + `
      <div class="topic-page">
        <p class="breadcrumb"><a href="#/">home</a> / ${topic.title}</p>
        <h1>${topic.title}</h1>
        <div class="concept-body"><p>${topic.description}</p></div>
        
        <div class="sim-wrapper">
          <div class="sim-header">
            <span class="sim-label">interactive simulation</span>
            <span class="sim-label">drag to explore</span>
          </div>
          <div class="sim-body">
            <div id="sim-container" class="sim-container"></div>
          </div>
        </div>
        
        <div class="formula-live" id="formula-display"></div>
        
        ${topic.image ? `<img class="ref-image" src="${topic.image}" alt="${topic.title}" loading="lazy">` : ''}
        
        <div class="questions-section">
          <p class="section-label">jee practice</p>
          ${topic.questions.map((q, i) => `
            <div class="question-card">
              <div class="question-head">
                <span class="question-num">0${i+1}</span>
                <span class="question-text">${q.q}</span>
                <span class="question-toggle">+</span>
              </div>
              <div class="question-solution">
                <div class="solution-body">${q.a}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    app.appendChild(page);
    
    page.querySelectorAll('.question-head').forEach(head => {
      head.addEventListener('click', () => head.closest('.question-card')!.classList.toggle('open'));
    });
    
    if (topic.simId && simMap[topic.simId]) {
      simMap[topic.simId](document.getElementById('sim-container')!);
    }
  }
}

window.addEventListener('hashchange', route);
route();
'''
}

for path, content in sims.items():
    with open(path, "w") as f:
        f.write(content)
