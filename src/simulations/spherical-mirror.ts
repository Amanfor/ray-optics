export function initSim(container: HTMLElement) {
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
