export function initSim(container: HTMLElement) {
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
