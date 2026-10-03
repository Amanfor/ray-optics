
export interface Topic { id: string; title: string; simId?: string; }
export const topics: Topic[] = [
  { id: "reflection", title: "Spherical Mirror", simId: "spherical-mirror" },
  { id: "refraction", title: "Refraction & Snell's Law", simId: "refraction" },
  { id: "tir", title: "Total Internal Reflection", simId: "tir" },
  { id: "thin-lens", title: "Thin Lenses", simId: "thin-lens" },
  { id: "prism", title: "Prisms", simId: "prism" },
  { id: "lens-combo", title: "Lens Combination", simId: "lens-combo" },
  { id: "microscope", title: "Compound Microscope", simId: "microscope" },
  { id: "telescope", title: "Astronomical Telescope", simId: "telescope" },
  { id: "dispersion", title: "Dispersion", simId: "dispersion" }
];
