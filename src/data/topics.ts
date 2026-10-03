export interface Topic {
  id: string;
  title: string;
  description: string;
  image?: string;
  simId?: string;
  questions: Array<{q: string, a: string}>;
}

export const topics: Topic[] = [
  {
    id: "reflection",
    title: "Reflection & Mirrors",
    description: "Light behaves as a ray in isotropic media. Reflection follows angle of incidence = angle of reflection.",
    image: "/media/reflection_mirrors_and_refraction_apparent_depth_tir.webp",
    simId: "spherical-mirror",
    questions: [
      {
        q: "A plano convex lens of refractive index 1.5 and radius of curvature 30 cm is silvered at the curved surface. Find distance for real image of same size.",
        a: "Focal length F=10cm (combination acts as converging mirror). u = 2F = 20cm."
      }
    ]
  },
  {
    id: "refraction",
    title: "Refraction & Snell's Law",
    description: "Light bends when entering a medium with different optical density.",
    image: "/media/refraction_at_spherical_surface_geometry.webp",
    simId: "refraction",
    questions: []
  },
  {
    id: "lenses",
    title: "Thin Lenses",
    description: "Lenses refract light to converge or diverge rays.",
    image: "/media/thin_lens_ray_diagram_and_displacement_method.webp",
    simId: "thin-lens",
    questions: [
      {
        q: "A thin glass lens (n=1.5) has power -5D in air. Power in liquid (n=1.6)?",
        a: "Pm = +1D (nature reverses)."
      }
    ]
  },
  {
    id: "prism",
    title: "Prisms & Dispersion",
    description: "Prisms deviate and disperse white light into its component colors.",
    image: "/media/prism_dispersion_and_spherical_lens_refraction.webp",
    simId: "prism",
    questions: []
  },
  {
    id: "instruments",
    title: "Optical Instruments",
    description: "Microscopes and telescopes combine lenses to magnify.",
    image: "/media/optical_instruments_microscopes_telescopes_and_defects.webp",
    simId: "microscope",
    questions: []
  }
];
