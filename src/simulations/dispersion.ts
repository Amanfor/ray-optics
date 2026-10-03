export function initSim(container: HTMLElement) {
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
