export function initSim(container: HTMLElement) {
  const SVG_W = 600, SVG_H = 360;
  let u = -180; // object distance (negative = left)
  let R = 100;  // radius of curvature (positive = centre on right)
  let mu1 = 1.0, mu2 = 1.5;

  container.innerHTML = `
    <svg id="srs-svg" viewBox="0 0 ${SVG_W} ${SVG_H}" style="width:100%;height:auto;display:block;">
      <defs>
        <filter id="srs-glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <!-- axis -->
      <line x1="0" y1="180" x2="600" y2="180" stroke="rgba(255,255,255,0.12)" stroke-width="1" stroke-dasharray="6 4"/>
      <!-- media label left -->
      <text x="30" y="30" fill="rgba(255,255,255,0.35)" font-family="JetBrains Mono,monospace" font-size="11">medium 1 (n₁)</text>
      <!-- media label right -->
      <text x="360" y="30" fill="rgba(255,255,255,0.35)" font-family="JetBrains Mono,monospace" font-size="11">medium 2 (n₂)</text>
    </svg>
    <div class="controls">
      <div class="control-group">
        <span class="control-label">object distance |u|</span>
        <input type="range" id="srs-u" min="50" max="280" value="180">
        <span class="control-value" id="srs-u-val">180 cm</span>
      </div>
      <div class="control-group">
        <span class="control-label">radius R</span>
        <input type="range" id="srs-r" min="30" max="200" value="100">
        <span class="control-value" id="srs-r-val">100 cm</span>
      </div>
      <div class="control-group">
        <span class="control-label">n₁ (left medium)</span>
        <input type="range" id="srs-n1" min="10" max="20" value="10">
        <span class="control-value" id="srs-n1-val">1.0</span>
      </div>
      <div class="control-group">
        <span class="control-label">n₂ (right medium)</span>
        <input type="range" id="srs-n2" min="10" max="25" value="15">
        <span class="control-value" id="srs-n2-val">1.5</span>
      </div>
    </div>
    <div class="readout-grid" id="srs-readout"></div>
    <div class="formula-live" id="srs-formula"></div>
  `;

  async function draw() {
    const svg = document.getElementById('srs-svg')!;
    // Remove old dynamic elements
    svg.querySelectorAll('.dyn').forEach(e => e.remove());
    
    // Pole at x=300 (center)
    const pole = 300;
    const cy = 180;
    const scale = 0.6; // 1 cm = 0.6 px
    
    // Draw spherical surface arc
    const arcR = Math.abs(R) * scale;
    const arcH = 80;
    // Simple arc approximation: parabolic curve
    const ns = document.createElementNS('http://www.w3.org/2000/svg','path');
    let arcD = `M ${pole} ${cy - arcH}`;
    for (let y = -arcH; y <= arcH; y += 4) {
      const x = pole + (R > 0 ? 1 : -1) * (arcR - Math.sqrt(Math.max(0, arcR*arcR - y*y)));
      arcD += ` L ${x} ${cy + y}`;
    }
    ns.setAttribute('d', arcD);
    ns.setAttribute('class', 'dyn');
    ns.setAttribute('stroke', 'rgba(255,255,255,0.6)');
    ns.setAttribute('stroke-width', '2');
    ns.setAttribute('fill', 'rgba(255,255,255,0.04)');
    svg.appendChild(ns);

    // Draw media boundary (vertical dashed at pole)
    const bd = document.createElementNS('http://www.w3.org/2000/svg','line');
    bd.setAttribute('x1', String(pole)); bd.setAttribute('y1','10');
    bd.setAttribute('x2', String(pole)); bd.setAttribute('y2','350');
    bd.setAttribute('stroke','rgba(255,255,255,0.12)'); bd.setAttribute('stroke-dasharray','4 4');
    bd.setAttribute('class','dyn'); svg.appendChild(bd);

    // Compute image using μ₂/v - μ₁/u = (μ₂-μ₁)/R
    const uVal = -Math.abs(u); // object on left → negative
    let v: number;
    if (R === 0) { v = Infinity; }
    else { v = 1 / ((mu2 - mu1) / R / mu2 + mu1 / (mu2 * uVal)); }
    
    // Object position in SVG x
    const objX = pole + uVal * scale;
    
    // Draw object arrow
    const oa = document.createElementNS('http://www.w3.org/2000/svg','line');
    oa.setAttribute('x1', String(objX)); oa.setAttribute('y1',String(cy));
    oa.setAttribute('x2', String(objX)); oa.setAttribute('y2',String(cy - 40));
    oa.setAttribute('stroke','rgba(255,255,255,0.8)'); oa.setAttribute('stroke-width','2');
    oa.setAttribute('class','dyn'); oa.setAttribute('marker-end','url(#arrowhead)');
    svg.appendChild(oa);
    
    // Label object
    const ol = document.createElementNS('http://www.w3.org/2000/svg','text');
    ol.setAttribute('x', String(objX - 8)); ol.setAttribute('y', String(cy - 45));
    ol.setAttribute('fill','rgba(255,255,255,0.7)'); ol.setAttribute('font-size','11');
    ol.setAttribute('font-family','JetBrains Mono,monospace'); ol.setAttribute('class','dyn');
    ol.textContent = 'O';
    svg.appendChild(ol);
    
    // Draw incident ray (parallel to axis)
    const ir = document.createElementNS('http://www.w3.org/2000/svg','line');
    ir.setAttribute('x1', String(objX)); ir.setAttribute('y1', String(cy - 35));
    ir.setAttribute('x2', String(pole)); ir.setAttribute('y2', String(cy - 35));
    ir.setAttribute('stroke','rgba(255,255,255,0.9)'); ir.setAttribute('stroke-width','1.5');
    ir.setAttribute('filter','url(#srs-glow)'); ir.setAttribute('class','dyn');
    svg.appendChild(ir);

    // Draw refracted ray
    if (isFinite(v) && v > 0) {
      const imgX = pole + v * scale;
      const ref = document.createElementNS('http://www.w3.org/2000/svg','line');
      ref.setAttribute('x1', String(pole)); ref.setAttribute('y1', String(cy - 35));
      ref.setAttribute('x2', String(Math.min(590, imgX))); ref.setAttribute('y2', String(cy));
      ref.setAttribute('stroke','rgba(255,255,255,0.9)'); ref.setAttribute('stroke-width','1.5');
      ref.setAttribute('filter','url(#srs-glow)'); ref.setAttribute('class','dyn');
      svg.appendChild(ref);
      
      // Image arrow
      if (imgX < 590) {
        const im = document.createElementNS('http://www.w3.org/2000/svg','line');
        const imgH = -40 * (v / uVal) * (mu1 / mu2); // transverse magnification
        im.setAttribute('x1', String(imgX)); im.setAttribute('y1', String(cy));
        im.setAttribute('x2', String(imgX)); im.setAttribute('y2', String(cy + imgH));
        im.setAttribute('stroke','rgba(255,255,255,0.5)'); im.setAttribute('stroke-width','2');
        im.setAttribute('stroke-dasharray','4 3'); im.setAttribute('class','dyn');
        svg.appendChild(im);
        
        const il = document.createElementNS('http://www.w3.org/2000/svg','text');
        il.setAttribute('x', String(imgX + 6)); il.setAttribute('y', String(cy + imgH - 4));
        il.setAttribute('fill','rgba(255,255,255,0.55)'); il.setAttribute('font-size','11');
        il.setAttribute('font-family','JetBrains Mono,monospace'); il.setAttribute('class','dyn');
        il.textContent = 'I';
        svg.appendChild(il);
      }
    } else if (isFinite(v) && v < 0) {
      // Virtual image
      const ref = document.createElementNS('http://www.w3.org/2000/svg','line');
      ref.setAttribute('x1', String(pole)); ref.setAttribute('y1', String(cy - 35));
      ref.setAttribute('x2', String(Math.max(10, pole))); ref.setAttribute('y2', String(cy - 20));
      ref.setAttribute('stroke','rgba(255,255,255,0.4)'); ref.setAttribute('stroke-dasharray','5 3');
      ref.setAttribute('stroke-width','1.5'); ref.setAttribute('class','dyn');
      svg.appendChild(ref);
    }

    // Readout
    const vDisplay = isFinite(v) ? v.toFixed(1) : '∞';
    const m = isFinite(v) ? (mu1 * v / (mu2 * uVal)).toFixed(3) : '—';
    document.getElementById('srs-readout')!.innerHTML = `
      <div class="readout-cell"><span class="readout-key">u</span><span class="readout-val">${uVal.toFixed(0)} cm</span></div>
      <div class="readout-cell"><span class="readout-key">v</span><span class="readout-val">${vDisplay} cm</span></div>
      <div class="readout-cell"><span class="readout-key">R</span><span class="readout-val">${R} cm</span></div>
      <div class="readout-cell"><span class="readout-key">n₁/n₂</span><span class="readout-val">${mu1.toFixed(1)}/${mu2.toFixed(1)}</span></div>
      <div class="readout-cell"><span class="readout-key">m</span><span class="readout-val">${m}</span></div>
      <div class="readout-cell"><span class="readout-key">nature</span><span class="readout-val">${isFinite(v) ? (v > 0 ? 'real' : 'virtual') : '∞'}</span></div>
    `;
    
    // Formula
    const formulaEl = document.getElementById('srs-formula')!;
    try {
      const katex = (window as any).katex || await import('katex').then(m => m.default);
      formulaEl.innerHTML = `<div style="margin-bottom:0.5rem;"></div>`;
      katex.render(
        `\\frac{\\mu_2}{v} - \\frac{\\mu_1}{u} = \\frac{\\mu_2 - \\mu_1}{R} \\quad\\Rightarrow\\quad \\frac{${mu2.toFixed(1)}}{v} - \\frac{${mu1.toFixed(1)}}{${uVal.toFixed(0)}} = \\frac{${(mu2-mu1).toFixed(1)}}{${R}}`,
        formulaEl.firstElementChild,
        {throwOnError: false, displayMode: true}
      );
    } catch(e) {}
  }

  // Wire up sliders
  const uSlider = document.getElementById('srs-u') as HTMLInputElement;
  const rSlider = document.getElementById('srs-r') as HTMLInputElement;
  const n1Slider = document.getElementById('srs-n1') as HTMLInputElement;
  const n2Slider = document.getElementById('srs-n2') as HTMLInputElement;
  
  function update() {
    u = parseInt(uSlider.value);
    R = parseInt(rSlider.value);
    mu1 = parseInt(n1Slider.value) / 10;
    mu2 = parseInt(n2Slider.value) / 10;
    document.getElementById('srs-u-val')!.textContent = u + ' cm';
    document.getElementById('srs-r-val')!.textContent = R + ' cm';
    document.getElementById('srs-n1-val')!.textContent = mu1.toFixed(1);
    document.getElementById('srs-n2-val')!.textContent = mu2.toFixed(1);
    draw();
  }
  
  [uSlider, rSlider, n1Slider, n2Slider].forEach(s => s.addEventListener('input', update));
  draw();
}
