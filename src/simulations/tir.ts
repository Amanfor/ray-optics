export function initSim(container: HTMLElement) {
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
