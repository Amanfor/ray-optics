
export interface Topic { id: string; title: string; description: string; simId?: string; image?: string; questions: Array<{q: string, a: string}>; }
export const topics: Topic[] = [
  { id: "reflection", title: "Spherical Mirror", description: "Reflection on curved surfaces forming real or virtual images.", simId: "spherical-mirror", image: "/media/reflection_mirrors_and_refraction_apparent_depth_tir.webp", questions: [
    {q: "Find the focal length of a concave mirror with radius 20cm.", a: "f = R/2 = 10cm (Concave mirrors have negative f depending on convention, usually -10cm)."}
  ] },
  { id: "refraction", title: "Refraction & Snell's Law", description: "Bending of light across media with different refractive indices.", simId: "refraction", image: "/media/refraction_at_spherical_surface_geometry.webp", questions: [] },
  { id: "tir", title: "Total Internal Reflection", description: "Complete reflection when light in denser medium exceeds critical angle.", simId: "tir", image: "/media/optical_fiber_total_internal_reflection.webp", questions: [] },
  { id: "thin-lens", title: "Thin Lenses", description: "Lenses that can be treated with the thin lens approximation.", simId: "thin-lens", image: "/media/thin_lens_ray_diagram_and_displacement_method.webp", questions: [] },
  { id: "prism", title: "Prisms", description: "Deviation and dispersion of light through an angled transparent block.", simId: "prism", image: "/media/prism_dispersion_and_spherical_lens_refraction.webp", questions: [] },
  { id: "lens-combo", title: "Lens Combination", description: "Equivalent focal length of two separated lenses.", simId: "lens-combo", image: "/media/lens_combinations_cutting_and_silvering.webp", questions: [] },
  { id: "microscope", title: "Compound Microscope", description: "Two convex lenses combining to produce highly magnified images.", simId: "microscope", image: "/media/optical_instruments_microscopes_telescopes_and_defects.webp", questions: [] },
  { id: "telescope", title: "Astronomical Telescope", description: "Lenses capturing light from distant objects for angular magnification.", simId: "telescope", questions: [] },
  { id: "dispersion", title: "Dispersion", description: "Separation of white light into colors due to index variation by wavelength.", simId: "dispersion", questions: [] }
];
