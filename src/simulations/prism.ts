export function initSim(container: HTMLElement) {
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
