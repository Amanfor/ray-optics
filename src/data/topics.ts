export interface Topic { id: string; title: string; description: string; simId?: string; image?: string; questions: Array<{q: string, a: string}>; }

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
