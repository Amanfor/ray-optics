import os

# 1. src/pages/home.ts
home_ts = r'''import katex from 'katex';
import { topics, Topic } from '../data/topics';

function createHeroCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  let w = 0, h = 0;
  let animId: number;
  
  const rays = Array.from({length: 6}, (_, i) => ({
    x: 50 + Math.random() * 300,
    y: 30 + Math.random() * 200,
    angle: (Math.PI / 7) * (i + 1) + 0.1,
    speed: 0.8 + i * 0.25,
    len: 150 + i * 35,
  }));
  
  function resize() {
    w = canvas.offsetWidth;
    h = canvas.offsetHeight;
    canvas.width = w * devicePixelRatio;
    canvas.height = h * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }
  
  function draw() {
    ctx.clearRect(0, 0, w, h);
    rays.forEach(ray => {
      ray.x += Math.cos(ray.angle) * ray.speed;
      ray.y += Math.sin(ray.angle) * ray.speed;
      if (ray.x < 0 || ray.x > w) ray.angle = Math.PI - ray.angle;
      if (ray.y < 0 || ray.y > h) ray.angle = -ray.angle;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 1;
      ctx.moveTo(ray.x, ray.y);
      ctx.lineTo(ray.x + Math.cos(ray.angle) * ray.len, ray.y + Math.sin(ray.angle) * ray.len);
      ctx.stroke();
    });
    animId = requestAnimationFrame(draw);
  }
  
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  animId = requestAnimationFrame(draw);
  return () => { cancelAnimationFrame(animId); ro.disconnect(); };
}

export function renderHome(el: HTMLElement) {
  el.innerHTML = `
    <section class="hero">
      <canvas class="hero-canvas" id="hero-canvas"></canvas>
      <p class="hero-eyebrow">Physics · Class 12 · JEE</p>
      <h1>ray optics<br><em>visualised</em></h1>
      <p class="hero-desc">interactive simulations for every concept. drag rays, adjust parameters, see physics happen live.</p>
      <div class="search-wrap">
        <input type="text" id="search" placeholder="search concepts…" autocomplete="off" spellcheck="false">
      </div>
    </section>
    <section class="topics-section">
      <p class="section-label">concepts</p>
      <div class="topic-grid" id="topic-grid"></div>
    </section>
  `;

  // Hero canvas
  const canvas = document.getElementById('hero-canvas') as HTMLCanvasElement;
  if (canvas) createHeroCanvas(canvas);

  // Render cards
  const grid = document.getElementById('topic-grid')!;
  function renderCards(list: Topic[]) {
    grid.innerHTML = list.map((t, i) => `
      <div class="topic-card" data-id="${t.id}">
        <span class="card-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="card-title">${t.title}</span>
        <span class="card-desc">${t.description}</span>
        <span class="card-arrow">→</span>
      </div>
    `).join('');
    grid.querySelectorAll<HTMLElement>('.topic-card').forEach(card => {
      card.addEventListener('click', () => {
        window.location.hash = '/topic/' + card.dataset.id;
      });
    });
  }
  renderCards(topics);

  // Fuzzy search
  const searchInput = document.getElementById('search') as HTMLInputElement;
  searchInput?.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (!q) { renderCards(topics); return; }
    const filtered = topics.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
    renderCards(filtered);
  });
}
'''

# 2. src/simulations/spherical-refraction.ts
spherical_refraction_ts = r'''export function initSim(container: HTMLElement) {
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
      const imgX = pole + v * scale;
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
'''

# 3. src/data/topics.ts
topics_ts = r'''export interface Topic { id: string; title: string; description: string; simId?: string; image?: string; questions: Array<{q: string, a: string}>; }

export const topics: Topic[] = [
  {
    id: "reflection",
    title: "Spherical Mirrors",
    description: "Reflection on curved surfaces forming real or virtual images.",
    simId: "spherical-mirror",
    image: "/media/reflection_mirrors_and_refraction_apparent_depth_tir.webp",
    questions: [
      {q: "A concave mirror has focal length 15 cm. An object is placed 45 cm in front. Find image distance, magnification, and nature of image.", a: "Using 1/v + 1/u = 1/f. u = -45 cm, f = -15 cm. 1/v = 1/f - 1/u = -1/15 + 1/45 = (-3+1)/45 = -2/45. v = -22.5 cm. Real, inverted. m = -v/u = -(-22.5)/(-45) = -0.5. Diminished."},
      {q: "A convex mirror of focal length 20 cm forms an image 1/3 the size of object. Find object distance.", a: "m = 1/3 (erect virtual for convex). m = -v/u → v = -u/3. Using mirror formula: 1/v + 1/u = 1/f = +1/20. 1/(-u/3) + 1/u = 1/20. -3/u + 1/u = 1/20. -2/u = 1/20. u = -40 cm."},
      {q: "An object is placed between focus and pole of a concave mirror. Describe the image.", a: "When u < f for a concave mirror, the image is virtual, erect, and magnified. Located behind the mirror. This is the principle of a shaving/makeup mirror."}
    ]
  },
  {
    id: "refraction",
    title: "Refraction & Snell's Law",
    description: "Bending of light across media with different refractive indices.",
    simId: "refraction",
    image: "/media/optical_slab_shift_lloyd_mirror_thin_film.webp",
    questions: [
      {q: "Light travels from air into glass (μ = 1.5) at an angle of incidence of 45°. Find the angle of refraction.", a: "Snell's Law: n1 sin(i) = n2 sin(r). 1 * sin(45°) = 1.5 * sin(r). 0.707 = 1.5 sin(r) => sin(r) = 0.471. r = arcsin(0.471) = 28.1°."},
      {q: "An object is placed at the bottom of a 15 cm deep water tank (μ = 4/3). Find the apparent depth of the object when viewed normally.", a: "Apparent depth = Real depth / μ. d_app = 15 / (4/3) = 15 * 3 / 4 = 11.25 cm."},
      {q: "A glass slab of thickness 6 cm and refractive index 1.5 is placed over a point object. Calculate the apparent shift.", a: "Shift = t(1 - 1/μ) = 6(1 - 1/1.5) = 6(1 - 2/3) = 6(1/3) = 2 cm."}
    ]
  },
  {
    id: "tir",
    title: "Total Internal Reflection",
    description: "Complete reflection when light in denser medium exceeds critical angle.",
    simId: "tir",
    image: "/media/optical_fiber_total_internal_reflection.webp",
    questions: [
      {q: "Calculate critical angle for glass (μ = 1.5) – air interface.", a: "sin θc = n₂/n₁ = 1/1.5 = 2/3. θc = arcsin(2/3) ≈ 41.8°."},
      {q: "A ray strikes a glass-water interface (μ_glass=1.5, μ_water=1.33) at 62°. Does TIR occur?", a: "sin θc = μ_water/μ_glass = 1.33/1.5 = 0.887. θc = arcsin(0.887) ≈ 62.5°. Since 62° < 62.5°, TIR does NOT occur."},
      {q: "Why does diamond sparkle so brightly?", a: "The critical angle for diamond is very small (~24.4°). Light entering the diamond is likely to strike facets at angles greater than this, undergoing multiple internal reflections before exiting, creating the sparkle."}
    ]
  },
  {
    id: "spherical-refraction",
    title: "Refraction at Spherical Surfaces",
    description: "Snell's law applied at a single curved refracting surface.",
    simId: "spherical-refraction",
    image: "/media/refraction_at_spherical_surface_geometry.webp",
    questions: [
      {q: "A goldfish is in a spherical bowl of radius 10 cm. If the goldfish is at a distance of 4 cm from the center towards the observer, where does the observer see the fish? (μ_water = 4/3)", a: "Here u = -6 cm (from surface), R = -10 cm (convex to observer but center is behind fish). Formula: μ2/v - μ1/u = (μ2-μ1)/R. 1/v - (4/3)/(-6) = (1 - 4/3)/(-10). 1/v + 2/9 = 1/30. 1/v = 1/30 - 2/9 = -17/90. v = -5.29 cm. Virtual image 5.29 cm from the surface."},
      {q: "A point object is placed in air at 20 cm from a convex glass surface (μ=1.5, R=10 cm). Find the image position.", a: "μ1=1, μ2=1.5, R=+10, u=-20. μ2/v - μ1/u = (μ2-μ1)/R. 1.5/v - 1/(-20) = (1.5-1)/10 = 0.5/10 = 1/20. 1.5/v + 1/20 = 1/20. 1.5/v = 0. Image forms at infinity."},
      {q: "A parallel beam of light in air enters a solid glass sphere of radius 5 cm and μ=1.5. Find the position of the image formed by the first surface.", a: "u = -∞, R = +5 cm, μ1=1, μ2=1.5. 1.5/v - 1/-∞ = (1.5-1)/5. 1.5/v = 0.1. v = 15 cm. Image forms 15 cm behind the first surface."}
    ]
  },
  {
    id: "thin-lens",
    title: "Thin Lenses",
    description: "Lenses that can be treated with the thin lens approximation.",
    simId: "thin-lens",
    image: "/media/thin_lens_ray_diagram_and_displacement_method.webp",
    questions: [
      {q: "A plano convex lens of refractive index 1.5 and radius of curvature 30 cm. Is silvered at the curved surface. Now this lens has been used to form the image of an object. At what distance from this lens an object be placed in order to have a real image of size of the object?", a: "KEY CONCEPT: The focal length of the final mirror is 1/F = 2/fl + 1/fm. Here 1/fl = (1.5 - 1)[1/∞ - 1/-30] = 1/60. 1/F = 2/60 + 1/15 = 1/10. F=10cm. The combination acts as a converging mirror. For same size, u = 2F = 20cm."},
      {q: "A thin glass (refractive index 1.5) lens has optical power of -5 D in air. Its optical power in a liquid medium with refractive index 1.6 will be:", a: "1/f_a = (1.5 - 1)(1/R1 - 1/R2). 1/f_m = (1.5/1.6 - 1)(1/R1 - 1/R2). Dividing gives f_m/f_a = -8. P_a = -5 => f_a = -1/5. f_m = -8 * (-1/5) = 8/5. P_m = 1.6 / (8/5) = 1 D."},
      {q: "In an optics experiment... A graph between |v| and |u| is plotted. A straight line at 45° meets the curve at P. Coordinates of P?", a: "Here u = -2f, v = 2f. The graph meets the y=x line when |v| = |u|. This occurs at 2f. So P is (2f, 2f)."},
      {q: "An object 2.4 m in front of a lens forms a sharp image on a film 12 cm behind the lens. A glass plate 1 cm thick, of refractive index 1.50 is interposed... At what distance should object be shifted?", a: "1/f = 1/12 + 1/240 = 21/240. f = 240/21 cm. Shift due to plate = t(1 - 1/μ) = 1(1-2/3) = 1/3 cm. New v = 12 - 1/3 = 35/3 cm. 1/u = 1/v - 1/f = 3/35 - 21/240 = -1/560. u = -5.6 m."}
    ]
  },
  {
    id: "lens-maker",
    title: "Lens Maker's Formula",
    description: "Determining focal length from radii of curvature and refractive indices.",
    questions: [
      {q: "A biconvex lens has radii of curvature 20 cm each. If μ=1.5, what is its focal length?", a: "1/f = (μ-1)(1/R1 - 1/R2). R1 = +20, R2 = -20. 1/f = (1.5-1)(1/20 - (-1/20)) = 0.5(2/20) = 1/20. f = +20 cm."},
      {q: "If the lens in the previous question is immersed in water (μ=4/3), find the new focal length.", a: "1/f' = (μ_g/μ_w - 1)(1/R1 - 1/R2) = (1.5/(4/3) - 1)(2/20) = (9/8 - 1)(1/10) = 1/80. f' = 80 cm. Focal length increases by a factor of 4."},
      {q: "What is the focal length of a plano-concave lens with R=30 cm and μ=1.5?", a: "R1 = ∞, R2 = +30 (or vice versa). 1/f = (1.5 - 1)(1/∞ - 1/30) = 0.5(-1/30) = -1/60. f = -60 cm."}
    ]
  },
  {
    id: "lens-combo",
    title: "Lens Combination",
    description: "Equivalent focal length of two separated lenses.",
    simId: "lens-combo",
    image: "/media/lens_combinations_cutting_and_silvering.webp",
    questions: [
      {q: "Two lenses of power -15 D and +5 D are in contact with each other. The focal length of the combination is:", a: "Power of combination P = P1 + P2 = -15 + 5 = -10 D. f = 1/P = -1/10 m = -10 cm."},
      {q: "Two convex lenses of focal lengths 10 cm and 20 cm are separated by 5 cm. Find the equivalent focal length.", a: "1/F = 1/f1 + 1/f2 - d/(f1 f2) = 1/10 + 1/20 - 5/(200) = 0.1 + 0.05 - 0.025 = 0.125 = 1/8. F = 8 cm."},
      {q: "A convex lens (f=10cm) and a concave lens (f=-10cm) are separated by d. What is the equivalent power?", a: "P = P1 + P2 - d P1 P2 = (10) + (-10) - d(10)(-10) = 100d. Power depends only on separation."}
    ]
  },
  {
    id: "prism",
    title: "Prisms & Dispersion",
    description: "Deviation and dispersion of light through an angled transparent block.",
    simId: "prism",
    image: "/media/prism_dispersion_and_spherical_lens_refraction.webp",
    questions: [
      {q: "A prism has refracting angle 60° and refractive index 1.5. Find the angle of minimum deviation.", a: "μ = sin((A+δ_m)/2) / sin(A/2). 1.5 = sin((60+δ_m)/2) / 0.5. sin((60+δ_m)/2) = 0.75. (60+δ_m)/2 ≈ 48.6°. δ_m = 97.2 - 60 = 37.2°."},
      {q: "What is the condition for no emergence from a prism?", a: "For no ray to emerge, the critical angle must be less than A/2. Thus, A > 2θc."},
      {q: "For a small angled prism A, what is the deviation produced?", a: "For small A, sin(x) ≈ x. μ = ((A+δ)/2) / (A/2) = (A+δ)/A. μA = A + δ. Therefore, δ = (μ - 1)A."}
    ]
  },
  {
    id: "microscope",
    title: "Compound Microscope",
    description: "Two convex lenses combining to produce highly magnified images.",
    simId: "microscope",
    image: "/media/optical_instruments_microscopes_telescopes_and_defects.webp",
    questions: [
      {q: "A compound microscope has objective focal length 1 cm and eyepiece 5 cm. Object is 1.1 cm from objective. Find magnifying power for normal adjustment.", a: "1/vo - 1/-1.1 = 1/1 => 1/vo = 1/11. vo = 11 cm. Normal adjustment M = -(vo/uo)(D/fe) = -(11/1.1)(25/5) = -10 * 5 = -50."},
      {q: "What happens to the resolving power of a microscope if the wavelength of light is decreased?", a: "Resolving power = 2 μ sin(θ) / 1.22 λ. If wavelength λ decreases, resolving power increases."},
      {q: "Why is the objective of a microscope of short focal length and small aperture?", a: "Short focal length allows the object to be kept very close, producing highly magnified real image. Small aperture reduces spherical aberration."}
    ]
  },
  {
    id: "telescope",
    title: "Astronomical Telescope",
    description: "Lenses capturing light from distant objects for angular magnification.",
    simId: "telescope",
    questions: [
      {q: "An astronomical telescope has objective focal length 100 cm and eyepiece 5 cm. Find magnifying power and tube length in normal adjustment.", a: "M = -fo/fe = -100/5 = -20. Tube length L = fo + fe = 100 + 5 = 105 cm."},
      {q: "If the final image is formed at the least distance of distinct vision (25 cm), what is the magnifying power?", a: "M = -fo/fe * (1 + fe/D) = -20 * (1 + 5/25) = -20 * (1 + 0.2) = -24."},
      {q: "Why does a telescope objective have a large aperture?", a: "A large aperture gathers more light from faint distant objects, increasing image brightness, and improves resolving power."}
    ]
  }
];
'''

# 4. src/main.ts
main_ts = r'''import './style.css';
import katex from 'katex';
import Lenis from 'lenis';
import { topics } from './data/topics';
import { renderHome } from './pages/home';

import { initSim as initSimSphericalMirror } from './simulations/spherical-mirror';
import { initSim as initSimRefraction } from './simulations/refraction';
import { initSim as initSimTir } from './simulations/tir';
import { initSim as initSimSphericalRefraction } from './simulations/spherical-refraction';
import { initSim as initSimThinLens } from './simulations/thin-lens';
import { initSim as initSimPrism } from './simulations/prism';
import { initSim as initSimLensCombo } from './simulations/lens-combo';
import { initSim as initSimMicroscope } from './simulations/microscope';
import { initSim as initSimTelescope } from './simulations/telescope';
import { initSim as initSimDispersion } from './simulations/dispersion';

const lenis = new Lenis({
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});
function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

const simMap: Record<string, any> = {
  'spherical-mirror': initSimSphericalMirror,
  'refraction': initSimRefraction,
  'tir': initSimTir,
  'spherical-refraction': initSimSphericalRefraction,
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
  
  const page = document.createElement('div');
  page.className = 'page-enter';
  
  const nav = `
    <nav class="nav-bar">
      <a href="#/" class="nav-logo">ray optics</a>
      <div class="nav-links">
        <a href="#/">Home</a>
        <a href="#/cheatsheet">Cheat Sheet</a>
      </div>
    </nav>
  `;

  if (hash === '/') {
    page.innerHTML = nav + `<div id="home-container"></div>`;
    app.appendChild(page);
    renderHome(document.getElementById('home-container')!);
    
  } else if (hash === '/cheatsheet') {
    page.innerHTML = nav + `
      <div class="cheatsheet-page">
        <h1>Formula Cheat Sheet</h1>
        <table class="formula-table">
          <tr><th>Topic</th><th>Formula</th></tr>
          <tr><td>Mirror Equation</td><td><span class="math">\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}</span></td></tr>
          <tr><td>Snell's Law</td><td><span class="math">n_1 \\sin i = n_2 \\sin r</span></td></tr>
          <tr><td>Lens Maker</td><td><span class="math">\\frac{1}{f} = (n-1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right)</span></td></tr>
          <tr><td>Spherical Surface</td><td><span class="math">\\frac{\\mu_2}{v} - \\frac{\\mu_1}{u} = \\frac{\\mu_2 - \\mu_1}{R}</span></td></tr>
        </table>
      </div>
    `;
    app.appendChild(page);
    setTimeout(() => {
       document.querySelectorAll('.math').forEach(el => {
         try {
           katex.render(el.textContent||'', el as HTMLElement, {throwOnError:false});
         } catch(e) {}
       });
    }, 0);
    
  } else if (hash.startsWith('/topic/')) {
    const topicId = hash.replace('/topic/', '');
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    
    page.innerHTML = nav + `
      <div class="topic-page">
        <p class="breadcrumb"><a href="#/">home</a> / ${topic.title}</p>
        <h1>${topic.title}</h1>
        <div class="concept-body"><p>${topic.description}</p></div>
        
        ${topic.simId ? `
        <div class="sim-wrapper">
          <div class="sim-header">
            <span class="sim-label">interactive simulation</span>
            <span class="sim-label">drag to explore</span>
          </div>
          <div class="sim-body">
            <div id="sim-container" class="sim-container"></div>
          </div>
        </div>
        <div class="formula-live" id="formula-display"></div>
        ` : ''}
        
        ${topic.image ? `<img class="ref-image" src="${topic.image}" alt="${topic.title}" loading="lazy">` : ''}
        
        <div class="questions-section">
          <p class="section-label">jee practice</p>
          ${topic.questions.map((q, i) => `
            <div class="question-card">
              <div class="question-head">
                <span class="question-num">0${i+1}</span>
                <span class="question-text">${q.q}</span>
                <span class="question-toggle">+</span>
              </div>
              <div class="question-solution">
                <div class="solution-body">${q.a}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    app.appendChild(page);
    
    page.querySelectorAll('.question-head').forEach(head => {
      head.addEventListener('click', () => head.closest('.question-card')!.classList.toggle('open'));
    });
    
    if (topic.simId && simMap[topic.simId]) {
      simMap[topic.simId](document.getElementById('sim-container')!);
    }
  }
}

window.addEventListener('hashchange', route);
route();
'''

os.makedirs('src/pages', exist_ok=True)
with open('src/pages/home.ts', 'w') as f:
    f.write(home_ts)
with open('src/simulations/spherical-refraction.ts', 'w') as f:
    f.write(spherical_refraction_ts)
with open('src/data/topics.ts', 'w') as f:
    f.write(topics_ts)
with open('src/main.ts', 'w') as f:
    f.write(main_ts)
