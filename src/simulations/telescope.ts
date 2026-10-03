export function initSim(container: HTMLElement) {
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
