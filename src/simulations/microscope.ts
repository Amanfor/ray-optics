export function initSim(container: HTMLElement) {
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
