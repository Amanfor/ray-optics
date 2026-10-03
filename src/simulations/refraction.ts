export function initSim(container: HTMLElement) {
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
