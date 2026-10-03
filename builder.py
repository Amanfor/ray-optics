import os

sims = {
"src/simulations/spherical-mirror.ts": r'''export function initSim(container: HTMLElement) {
  container.innerHTML = `
    <div style="color:white; font-family:sans-serif;">
      <label>Type: <select id="m-type"><option value="-100">Concave (f=-100)</option><option value="100">Convex (f=100)</option></select></label>
      <div id="m-form" style="font-family:monospace; margin:10px 0; font-size:1.1em; background:#222; padding:10px; border-radius:5px;"></div>
      <svg id="m-svg" viewBox="-400 -200 800 400" style="width:100%; max-width:800px; height:400px; border:1px solid #444; background:#000; touch-action:none;"></svg>
    </div>
  `;
  const svg = container.querySelector('#m-svg') as any;
  const form = container.querySelector('#m-form') as HTMLElement;
  const select = container.querySelector('#m-type') as HTMLSelectElement;
  
  let u = -150;
  let f = -100;
  let isDragging = false;
  
  function draw() {
    const v = (u * f) / (u - f);
    const m = -v / u;
    const nature = v > 0 ? "Virtual, Erect" : "Real, Inverted";
    const size = Math.abs(m) > 1 ? "Enlarged" : "Diminished";
    
    form.innerHTML = `1/v + 1/(${u.toFixed(1)}) = 1/(${f}) <br> v = ${v.toFixed(1)} cm &nbsp;|&nbsp; m = ${m.toFixed(2)} <br> Nature: ${nature}, ${size}`;
    
    let html = `<line x1="-400" y1="0" x2="400" y2="0" stroke="gray" />`;
    const curve = f < 0 ? 'M -20 -100 Q 40 0 -20 100' : 'M 20 -100 Q -40 0 20 100';
    html += `<path d="${curve}" stroke="lightblue" fill="none" stroke-width="4" />`;
    
    html += `<line x1="${u}" y1="0" x2="${u}" y2="-50" stroke="yellow" stroke-width="3" />`;
    html += `<circle cx="${u}" cy="-50" r="15" fill="rgba(255,255,0,0.5)" id="obj-handle" style="cursor:ew-resize" />`;
    html += `<circle cx="${u}" cy="-50" r="5" fill="yellow" style="pointer-events:none;" />`;
    
    const imgY = -50 * m;
    html += `<line x1="${v}" y1="0" x2="${v}" y2="${imgY}" stroke="red" stroke-width="3" />`;
    
    html += `<line x1="${u}" y1="-50" x2="0" y2="-50" stroke="rgba(255,255,0,0.3)" stroke-width="2" />`;
    html += `<line x1="0" y1="-50" x2="${v}" y2="${imgY}" stroke="rgba(255,255,0,0.3)" stroke-width="2" />`;
    html += `<line x1="${u}" y1="-50" x2="0" y2="0" stroke="rgba(255,255,0,0.3)" stroke-width="2" />`;
    html += `<line x1="0" y1="0" x2="${v}" y2="${imgY}" stroke="rgba(255,255,0,0.3)" stroke-width="2" />`;
    
    svg.innerHTML = html;
    
    const handle = svg.querySelector('#obj-handle');
    handle.onpointerdown = (e: any) => { isDragging = true; svg.setPointerCapture(e.pointerId); };
    svg.onpointermove = (e: any) => {
      if(!isDragging) return;
      const rect = svg.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * 800 - 400;
      u = Math.min(x, -10);
      draw();
    };
    svg.onpointerup = () => isDragging = false;
  }
  
  select.onchange = () => { f = parseFloat(select.value); draw(); };
  draw();
}
''',
"src/simulations/refraction.ts": r'''export function initSim(container: HTMLElement) {
  container.innerHTML = `
    <div style="color:white; font-family:sans-serif;">
      <label>n1: <input type="range" id="n1" min="1" max="2.5" step="0.1" value="1.0"></label>
      <label>n2: <input type="range" id="n2" min="1" max="2.5" step="0.1" value="1.5"></label>
      <div id="r-form" style="font-family:monospace; margin:10px 0; font-size:1.1em; background:#222; padding:10px; border-radius:5px;"></div>
      <svg id="r-svg" viewBox="-200 -200 400 400" style="width:100%; max-width:600px; height:400px; border:1px solid #444; background:#000; touch-action:none;"></svg>
    </div>
  `;
  let theta1 = 45;
  const svg = container.querySelector('#r-svg') as any;
  const form = container.querySelector('#r-form') as HTMLElement;
  const in1 = container.querySelector('#n1') as HTMLInputElement;
  const in2 = container.querySelector('#n2') as HTMLInputElement;
  let isDragging = false;
  
  function draw() {
    const n1 = parseFloat(in1.value);
    const n2 = parseFloat(in2.value);
    const rad1 = theta1 * Math.PI / 180;
    let sin2 = (n1 / n2) * Math.sin(rad1);
    let html = '';
    
    html += `<rect x="-200" y="0" width="400" height="200" fill="rgba(0,100,255,0.2)" />`;
    html += `<line x1="-200" y1="0" x2="200" y2="0" stroke="white" stroke-width="2" />`;
    html += `<line x1="0" y1="-200" x2="0" y2="200" stroke="gray" stroke-dasharray="5,5" />`;
    
    const x1 = -150 * Math.sin(rad1);
    const y1 = -150 * Math.cos(rad1);
    html += `<line x1="${x1}" y1="${y1}" x2="0" y2="0" stroke="yellow" stroke-width="3" />`;
    html += `<circle cx="${x1}" cy="${y1}" r="20" fill="rgba(255,255,0,0.5)" id="drag-handle" style="cursor:pointer" />`;
    html += `<circle cx="${x1}" cy="${y1}" r="5" fill="yellow" style="pointer-events:none;" />`;
    
    if (Math.abs(sin2) > 1) {
      form.innerHTML = `n1 sin(θ1) = n2 sin(θ2) <br> ${n1.toFixed(1)} sin(${theta1.toFixed(1)}°) = ${n2.toFixed(1)} sin(θ2) <br> <strong style="color:red;">TIR Occurs!</strong>`;
      const x2 = -150 * Math.sin(rad1);
      const y2 = 150 * Math.cos(rad1);
      html += `<line x1="0" y1="0" x2="${x2}" y2="${-y2}" stroke="yellow" stroke-width="3" />`;
    } else {
      const rad2 = Math.asin(sin2);
      const theta2 = rad2 * 180 / Math.PI;
      form.innerHTML = `n1 sin(θ1) = n2 sin(θ2) <br> ${n1.toFixed(1)} sin(${theta1.toFixed(1)}°) = ${n2.toFixed(1)} sin(${theta2.toFixed(1)}°)`;
      const x2 = 150 * Math.sin(rad2);
      const y2 = 150 * Math.cos(rad2);
      html += `<line x1="0" y1="0" x2="${x2}" y2="${y2}" stroke="orange" stroke-width="3" />`;
    }
    
    svg.innerHTML = html;
    const handle = svg.querySelector('#drag-handle');
    handle.onpointerdown = (e:any) => { isDragging = true; svg.setPointerCapture(e.pointerId); };
    svg.onpointermove = (e:any) => {
      if(!isDragging) return;
      const rect = svg.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width * 400 - 200;
      const cy = (e.clientY - rect.top) / rect.height * 400 - 200;
      if (cy < 0) {
        theta1 = Math.atan2(Math.abs(cx), Math.abs(cy)) * 180 / Math.PI;
        if (cx > 0) theta1 = -theta1; 
        theta1 = Math.abs(theta1);
        draw();
      }
    };
    svg.onpointerup = () => isDragging = false;
  }
  
  in1.oninput = draw; in2.oninput = draw;
  draw();
}
''',
"src/simulations/tir.ts": r'''export function initSim(container: HTMLElement) {
  container.innerHTML = `
    <div style="color:white; font-family:sans-serif;">
      <label>n1 (denser): <input type="range" id="t-n1" min="1.0" max="2.5" step="0.1" value="1.5"></label>
      <label>n2 (rarer): <input type="range" id="t-n2" min="1.0" max="2.5" step="0.1" value="1.0"></label>
      <div id="t-form" style="font-family:monospace; margin:10px 0; font-size:1.1em; background:#222; padding:10px; border-radius:5px;"></div>
      <svg id="t-svg" viewBox="-200 -200 400 400" style="width:100%; max-width:600px; height:400px; border:1px solid #444; background:#000; touch-action:none;"></svg>
    </div>
  `;
  let theta1 = 30;
  const svg = container.querySelector('#t-svg') as any;
  const form = container.querySelector('#t-form') as HTMLElement;
  const in1 = container.querySelector('#t-n1') as HTMLInputElement;
  const in2 = container.querySelector('#t-n2') as HTMLInputElement;
  let isDragging = false;
  
  function draw() {
    let n1 = parseFloat(in1.value);
    let n2 = parseFloat(in2.value);
    if (n1 <= n2) {
      n1 = n2 + 0.1;
      in1.value = n1.toFixed(1);
    }
    const critRad = Math.asin(n2/n1);
    const critDeg = critRad * 180 / Math.PI;
    const rad1 = theta1 * Math.PI / 180;
    let sin2 = (n1 / n2) * Math.sin(rad1);
    
    let html = `<rect x="-200" y="0" width="400" height="200" fill="rgba(0,100,255,0.3)" />`;
    html += `<line x1="-200" y1="0" x2="200" y2="0" stroke="white" stroke-width="2" />`;
    html += `<line x1="0" y1="-200" x2="0" y2="200" stroke="gray" stroke-dasharray="5,5" />`;
    
    const cx1 = -150 * Math.sin(critRad);
    const cy1 = 150 * Math.cos(critRad);
    html += `<line x1="0" y1="0" x2="${cx1}" y2="${cy1}" stroke="rgba(255,255,255,0.5)" stroke-dasharray="4,4" />`;
    
    const x1 = -150 * Math.sin(rad1);
    const y1 = 150 * Math.cos(rad1);
    html += `<line x1="${x1}" y1="${y1}" x2="0" y2="0" stroke="yellow" stroke-width="3" />`;
    html += `<circle cx="${x1}" cy="${y1}" r="20" fill="rgba(255,255,0,0.5)" id="drag-handle" style="cursor:pointer" />`;
    html += `<circle cx="${x1}" cy="${y1}" r="5" fill="yellow" style="pointer-events:none;" />`;
    
    if (Math.abs(sin2) > 1) {
      form.innerHTML = `<strong style="color:red">TIR!</strong> θ_c = ${critDeg.toFixed(1)}° <br> Current θ1 = ${theta1.toFixed(1)}° > θ_c`;
      const x2 = -150 * Math.sin(rad1);
      const y2 = 150 * Math.cos(rad1);
      html += `<line x1="0" y1="0" x2="${-x2}" y2="${y2}" stroke="yellow" stroke-width="3" />`;
    } else {
      const rad2 = Math.asin(sin2);
      form.innerHTML = `θ_c = ${critDeg.toFixed(1)}° <br> Current θ1 = ${theta1.toFixed(1)}° <br> θ2 = ${(rad2*180/Math.PI).toFixed(1)}°`;
      const x2 = 150 * Math.sin(rad2);
      const y2 = -150 * Math.cos(rad2);
      html += `<line x1="0" y1="0" x2="${x2}" y2="${y2}" stroke="orange" stroke-width="3" />`;
    }
    
    svg.innerHTML = html;
    const handle = svg.querySelector('#drag-handle');
    handle.onpointerdown = (e:any) => { isDragging = true; svg.setPointerCapture(e.pointerId); };
    svg.onpointermove = (e:any) => {
      if(!isDragging) return;
      const rect = svg.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width * 400 - 200;
      const cy = (e.clientY - rect.top) / rect.height * 400 - 200;
      if (cy > 0 && cx < 0) {
        theta1 = Math.atan2(Math.abs(cx), Math.abs(cy)) * 180 / Math.PI;
        draw();
      }
    };
    svg.onpointerup = () => isDragging = false;
  }
  
  in1.oninput = draw; in2.oninput = draw;
  draw();
}
''',
"src/simulations/thin-lens.ts": r'''export function initSim(container: HTMLElement) {
  container.innerHTML = `
    <div style="color:white; font-family:sans-serif;">
      <label>Type: <select id="l-type"><option value="100">Convex (f=100)</option><option value="-100">Concave (f=-100)</option></select></label>
      <div id="l-form" style="font-family:monospace; margin:10px 0; font-size:1.1em; background:#222; padding:10px; border-radius:5px;"></div>
      <svg id="l-svg" viewBox="-400 -200 800 400" style="width:100%; max-width:800px; height:400px; border:1px solid #444; background:#000; touch-action:none;"></svg>
    </div>
  `;
  const svg = container.querySelector('#l-svg') as any;
  const form = container.querySelector('#l-form') as HTMLElement;
  const select = container.querySelector('#l-type') as HTMLSelectElement;
  
  let u = -200;
  let f = 100;
  let isDragging = false;
  
  function draw() {
    const v = 1 / (1/f + 1/u);
    const m = v / u;
    const nature = v > 0 ? "Real, Inverted" : "Virtual, Erect";
    const size = Math.abs(m) > 1 ? "Enlarged" : "Diminished";
    
    form.innerHTML = `1/v - 1/(${u.toFixed(1)}) = 1/(${f}) <br> v = ${v.toFixed(1)} cm &nbsp;|&nbsp; m = ${m.toFixed(2)} <br> Nature: ${nature}, ${size}`;
    
    let html = `<line x1="-400" y1="0" x2="400" y2="0" stroke="gray" />`;
    if (f > 0) {
      html += `<path d="M 0 -100 Q 30 0 0 100 Q -30 0 0 -100" fill="rgba(173,216,230,0.5)" stroke="lightblue" />`;
    } else {
      html += `<path d="M -20 -100 L 20 -100 Q 0 0 20 100 L -20 100 Q 0 0 -20 -100" fill="rgba(173,216,230,0.5)" stroke="lightblue" />`;
    }
    html += `<line x1="0" y1="-120" x2="0" y2="120" stroke="white" stroke-dasharray="4,4" />`;
    
    const objY = -50;
    html += `<line x1="${u}" y1="0" x2="${u}" y2="${objY}" stroke="yellow" stroke-width="3" />`;
    html += `<circle cx="${u}" cy="${objY}" r="20" fill="rgba(255,255,0,0.5)" id="obj-handle" style="cursor:ew-resize" />`;
    html += `<circle cx="${u}" cy="${objY}" r="5" fill="yellow" style="pointer-events:none;" />`;
    
    const imgY = objY * m;
    html += `<line x1="${v}" y1="0" x2="${v}" y2="${imgY}" stroke="red" stroke-width="3" />`;
    
    html += `<line x1="${u}" y1="${objY}" x2="0" y2="${objY}" stroke="rgba(255,255,0,0.4)" stroke-width="2" />`;
    html += `<line x1="0" y1="${objY}" x2="${v}" y2="${imgY}" stroke="rgba(255,255,0,0.4)" stroke-width="2" />`;
    html += `<line x1="${u}" y1="${objY}" x2="0" y2="0" stroke="rgba(255,255,0,0.4)" stroke-width="2" />`;
    html += `<line x1="0" y1="0" x2="${v}" y2="${imgY}" stroke="rgba(255,255,0,0.4)" stroke-width="2" />`;
    
    svg.innerHTML = html;
    
    const handle = svg.querySelector('#obj-handle');
    handle.onpointerdown = (e: any) => { isDragging = true; svg.setPointerCapture(e.pointerId); };
    svg.onpointermove = (e: any) => {
      if(!isDragging) return;
      const rect = svg.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width * 800 - 400;
      u = Math.min(x, -10);
      draw();
    };
    svg.onpointerup = () => isDragging = false;
  }
  
  select.onchange = () => { f = parseFloat(select.value); draw(); };
  draw();
}
''',
"src/simulations/prism.ts": r'''export function initSim(container: HTMLElement) {
  container.innerHTML = `
    <div style="color:white; font-family:sans-serif;">
      <label>Incidence i: <input type="range" id="p-i" min="30" max="80" step="1" value="45"></label>
      <label>Index μ: <input type="range" id="p-m" min="1.3" max="2.0" step="0.05" value="1.5"></label>
      <div id="p-form" style="font-family:monospace; margin:10px 0; font-size:1.1em; background:#222; padding:10px; border-radius:5px;"></div>
      <svg id="p-svg" viewBox="-200 -200 400 400" style="width:100%; max-width:600px; height:400px; border:1px solid #444; background:#000; touch-action:none;"></svg>
    </div>
  `;
  const svg = container.querySelector('#p-svg') as any;
  const form = container.querySelector('#p-form') as HTMLElement;
  const ini = container.querySelector('#p-i') as HTMLInputElement;
  const inm = container.querySelector('#p-m') as HTMLInputElement;
  
  function draw() {
    const iDeg = parseFloat(ini.value);
    const mu = parseFloat(inm.value);
    const A = 60; 
    const A_rad = A * Math.PI / 180;
    const i_rad = iDeg * Math.PI / 180;
    
    const r1_rad = Math.asin(Math.sin(i_rad) / mu);
    const r2_rad = A_rad - r1_rad;
    const sin_e = mu * Math.sin(r2_rad);
    
    let html = '';
    const side = 200;
    const h = side * Math.sqrt(3)/2;
    const p1 = {x: 0, y: -h/2};
    const p2 = {x: -side/2, y: h/2};
    const p3 = {x: side/2, y: h/2};
    html += `<polygon points="${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" fill="rgba(173,216,230,0.2)" stroke="lightblue" stroke-width="2" />`;
    
    if (Math.abs(sin_e) > 1) {
      form.innerHTML = `δ = TIR at second surface (A > 2θ_c or i too small)`;
    } else {
      const e_rad = Math.asin(sin_e);
      const eDeg = e_rad * 180 / Math.PI;
      const delta = iDeg + eDeg - A;
      form.innerHTML = `i = ${iDeg}° &nbsp;|&nbsp; e = ${eDeg.toFixed(1)}° <br> δ = i + e - A = ${delta.toFixed(1)}°`;
    }
    
    html += `<text x="-190" y="-170" fill="white" font-size="14">Prism deviation δ curve (schematic raytrace)</text>`;
    svg.innerHTML = html;
  }
  
  ini.oninput = draw; inm.oninput = draw;
  draw();
}
''',
"src/simulations/lens-combo.ts": r'''export function initSim(container: HTMLElement) {
  container.innerHTML = `
    <div style="color:white; font-family:sans-serif;">
      <label>d (cm): <input type="range" id="c-d" min="0" max="150" step="5" value="50"></label>
      <label>f1: <input type="range" id="c-f1" min="20" max="200" step="10" value="100"></label>
      <label>f2: <input type="range" id="c-f2" min="20" max="200" step="10" value="100"></label>
      <div id="c-form" style="font-family:monospace; margin:10px 0; font-size:1.1em; background:#222; padding:10px; border-radius:5px;"></div>
      <svg id="c-svg" viewBox="-200 -200 400 400" style="width:100%; max-width:600px; height:400px; border:1px solid #444; background:#000; touch-action:none;"></svg>
    </div>
  `;
  const svg = container.querySelector('#c-svg') as any;
  const form = container.querySelector('#c-form') as HTMLElement;
  const ind = container.querySelector('#c-d') as HTMLInputElement;
  const inf1 = container.querySelector('#c-f1') as HTMLInputElement;
  const inf2 = container.querySelector('#c-f2') as HTMLInputElement;
  
  function draw() {
    const d = parseFloat(ind.value);
    const f1 = parseFloat(inf1.value);
    const f2 = parseFloat(inf2.value);
    const invF = 1/f1 + 1/f2 - d/(f1*f2);
    const f_eff = invF === 0 ? Infinity : 1/invF;
    
    form.innerHTML = `1/F = 1/f1 + 1/f2 - d/(f1*f2) <br> F_eff = ${f_eff === Infinity ? 'Infinity' : f_eff.toFixed(1)} cm`;
    
    let html = `<line x1="-200" y1="0" x2="200" y2="0" stroke="gray" />`;
    const x1 = -d/2;
    const x2 = d/2;
    html += `<path d="M ${x1} -80 Q ${x1+20} 0 ${x1} 80 Q ${x1-20} 0 ${x1} -80" fill="rgba(173,216,230,0.4)" stroke="lightblue"/>`;
    html += `<path d="M ${x2} -80 Q ${x2+20} 0 ${x2} 80 Q ${x2-20} 0 ${x2} -80" fill="rgba(144,238,144,0.4)" stroke="lightgreen"/>`;
    
    const y1 = -40;
    html += `<line x1="-200" y1="${y1}" x2="${x1}" y2="${y1}" stroke="yellow" stroke-width="2" />`;
    const angle1 = Math.atan(-y1/f1);
    const y2 = y1 + d * Math.tan(angle1);
    html += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="yellow" stroke-width="2" />`;
    
    if (invF !== 0) {
      const focus_x = x2 + 1 / (1/f2 + 1/(f1-d));
      html += `<line x1="${x2}" y1="${y2}" x2="${focus_x}" y2="0" stroke="yellow" stroke-width="2" />`;
    } else {
      html += `<line x1="${x2}" y1="${y2}" x2="200" y2="${y2}" stroke="yellow" stroke-width="2" />`;
    }
    
    svg.innerHTML = html;
  }
  
  ind.oninput = draw; inf1.oninput = draw; inf2.oninput = draw;
  draw();
}
''',
"src/simulations/microscope.ts": r'''export function initSim(container: HTMLElement) {
  container.innerHTML = `<div style="color:white; font-family:sans-serif;">
    <label>f_o: <input type="range" id="m-fo" min="1" max="10" step="1" value="2"></label>
    <label>f_e: <input type="range" id="m-fe" min="2" max="20" step="1" value="5"></label>
    <label>u_o: <input type="range" id="m-uo" min="2.1" max="5" step="0.1" value="2.5"></label>
    <div id="m-form" style="font-family:monospace; margin:10px 0; font-size:1.1em; background:#222; padding:10px; border-radius:5px;"></div>
    <svg id="m-svg" viewBox="-20 -50 150 100" style="width:100%; max-width:600px; height:300px; border:1px solid #444; background:#000;"></svg>
  </div>`;
  
  const form = container.querySelector('#m-form') as HTMLElement;
  const svg = container.querySelector('#m-svg') as any;
  
  function draw() {
    const fo = parseFloat((container.querySelector('#m-fo') as HTMLInputElement).value);
    const fe = parseFloat((container.querySelector('#m-fe') as HTMLInputElement).value);
    const uo = parseFloat((container.querySelector('#m-uo') as HTMLInputElement).value);
    
    const vo = 1 / (1/fo - 1/uo);
    const D = 25;
    const M = -(vo/uo) * (1 + D/fe);
    
    form.innerHTML = `v_o = ${vo.toFixed(2)} cm <br> M = -(v_o/u_o)(1 + D/f_e) = ${M.toFixed(1)}x`;
    
    svg.innerHTML = `
      <line x1="-20" y1="0" x2="150" y2="0" stroke="gray"/>
      <path d="M 0 -20 Q 5 0 0 20 Q -5 0 0 -20" fill="lightblue" /> 
      <path d="M ${vo + fe} -40 Q ${vo + fe + 10} 0 ${vo + fe} 40 Q ${vo + fe - 10} 0 ${vo + fe} -40" fill="lightgreen" />
      <line x1="${-uo}" y1="0" x2="${-uo}" y2="-10" stroke="yellow" stroke-width="1.5"/> 
      <line x1="${vo}" y1="0" x2="${vo}" y2="${10*(vo/uo)}" stroke="orange" stroke-width="1.5"/> 
    `;
  }
  container.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  draw();
}
''',
"src/simulations/telescope.ts": r'''export function initSim(container: HTMLElement) {
  container.innerHTML = `<div style="color:white; font-family:sans-serif;">
    <label>f_o: <input type="range" id="t-fo" min="50" max="200" step="10" value="100"></label>
    <label>f_e: <input type="range" id="t-fe" min="5" max="40" step="5" value="10"></label>
    <div id="t-form" style="font-family:monospace; margin:10px 0; font-size:1.1em; background:#222; padding:10px; border-radius:5px;"></div>
    <svg id="t-svg" viewBox="-20 -50 250 100" style="width:100%; max-width:600px; height:300px; border:1px solid #444; background:#000;"></svg>
  </div>`;
  
  const form = container.querySelector('#t-form') as HTMLElement;
  const svg = container.querySelector('#t-svg') as any;
  
  function draw() {
    const fo = parseFloat((container.querySelector('#t-fo') as HTMLInputElement).value);
    const fe = parseFloat((container.querySelector('#t-fe') as HTMLInputElement).value);
    const M = -fo/fe;
    const L = fo + fe;
    
    form.innerHTML = `Tube Length L = f_o + f_e = ${L} cm <br> M = -f_o / f_e = ${M.toFixed(1)}x`;
    
    svg.innerHTML = `
      <line x1="-20" y1="0" x2="250" y2="0" stroke="gray"/>
      <path d="M 0 -40 Q 10 0 0 40 Q -10 0 0 -40" fill="lightblue" />
      <path d="M ${L} -20 Q ${L+5} 0 ${L} 20 Q ${L-5} 0 ${L} -20" fill="lightgreen" />
      <line x1="-20" y1="-10" x2="0" y2="0" stroke="yellow" stroke-width="1.5"/>
      <line x1="-20" y1="-20" x2="0" y2="-10" stroke="yellow" stroke-width="1.5"/>
      <line x1="0" y1="0" x2="${fo}" y2="0" stroke="yellow" stroke-width="1.5"/>
      <line x1="0" y1="-10" x2="${fo}" y2="0" stroke="yellow" stroke-width="1.5"/>
    `;
  }
  container.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  draw();
}
''',
"src/simulations/dispersion.ts": r'''export function initSim(container: HTMLElement) {
  container.innerHTML = `<div style="color:white; font-family:sans-serif;">
    <label>Dispersive Power: <input type="range" id="d-p" min="0.01" max="0.3" step="0.01" value="0.1"></label>
    <div id="d-form" style="font-family:monospace; margin:10px 0; font-size:1.1em; background:#222; padding:10px; border-radius:5px;"></div>
    <svg id="d-svg" viewBox="-100 -100 200 200" style="width:100%; max-width:600px; height:300px; border:1px solid #444; background:#000;"></svg>
  </div>`;
  
  const form = container.querySelector('#d-form') as HTMLElement;
  const svg = container.querySelector('#d-svg') as any;
  
  function draw() {
    const w = parseFloat((container.querySelector('#d-p') as HTMLInputElement).value);
    const delta_y = 30; 
    const delta_v = delta_y + w * delta_y;
    const delta_r = delta_y - w * delta_y;
    
    form.innerHTML = `Angular spread (δ_V - δ_R) = ${(delta_v - delta_r).toFixed(2)}°`;
    
    let html = `
      <polygon points="0,-50 -50,36.6 50,36.6" fill="rgba(173,216,230,0.2)" stroke="lightblue"/>
      <line x1="-100" y1="10" x2="-25" y2="10" stroke="white" stroke-width="3"/>
    `;
    
    const colors = ['#8A2BE2', '#4B0082', '#0000FF', '#00FF00', '#FFFF00', '#FFA500', '#FF0000'];
    colors.forEach((c, i) => {
      const d = delta_v - (i/6)*(delta_v - delta_r);
      const rad = d * Math.PI / 180;
      const ex = 25; const ey = 10;
      const nx = ex + 100 * Math.cos(rad);
      const ny = ey + 100 * Math.sin(rad);
      html += `<line x1="${ex}" y1="${ey}" x2="${nx}" y2="${ny}" stroke="${c}" stroke-width="2"/>`;
      html += `<line x1="-25" y1="10" x2="${ex}" y2="${ey}" stroke="${c}" stroke-width="0.5"/>`;
    });
    
    svg.innerHTML = html;
  }
  container.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
  draw();
}
''',
"src/main.ts": r'''
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
''',
"src/data/topics.ts": r'''
export interface Topic { id: string; title: string; simId?: string; }
export const topics: Topic[] = [
  { id: "reflection", title: "Spherical Mirror", simId: "spherical-mirror" },
  { id: "refraction", title: "Refraction & Snell's Law", simId: "refraction" },
  { id: "tir", title: "Total Internal Reflection", simId: "tir" },
  { id: "thin-lens", title: "Thin Lenses", simId: "thin-lens" },
  { id: "prism", title: "Prisms", simId: "prism" },
  { id: "lens-combo", title: "Lens Combination", simId: "lens-combo" },
  { id: "microscope", title: "Compound Microscope", simId: "microscope" },
  { id: "telescope", title: "Astronomical Telescope", simId: "telescope" },
  { id: "dispersion", title: "Dispersion", simId: "dispersion" }
];
'''
}

for path, content in sims.items():
    with open(path, "w") as f:
        f.write(content)
