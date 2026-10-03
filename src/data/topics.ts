export interface Topic {
  id: string;
  title: string;
  description: string;
  simId?: string;
  image?: string;
  questions: Array<{ q: string; a: string }>;
}

export const topics: Topic[] = [
  {
    id: 'reflection',
    title: 'Spherical Mirrors',
    description: 'Reflection on curved surfaces forming real or virtual images.',
    simId: 'spherical-mirror',
    image: '/media/reflection_mirrors_and_refraction_apparent_depth_tir.webp',
    questions: [
      {
        q: 'A concave mirror has focal length $f = 15$ cm. An object is placed $u = 45$ cm in front. Find image distance $v$, magnification $m$, and nature of image.',
        a: 'Using mirror formula $\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}$. Here $u = -45$ cm, $f = -15$ cm (concave).\n\n$\\frac{1}{v} = \\frac{1}{f} - \\frac{1}{u} = \\frac{1}{-15} - \\frac{1}{-45} = \\frac{-3+1}{45} = \\frac{-2}{45}$\n\n$v = -22.5$ cm (real, in front of mirror).\n\nMagnification $m = -\\frac{v}{u} = -\\frac{-22.5}{-45} = -0.5$. Inverted, diminished.',
      },
      {
        q: 'A convex mirror of focal length $f = 20$ cm forms an image $\\frac{1}{3}$ the size of the object. Find the object distance.',
        a: 'For a convex mirror the image is always erect and virtual, so $m = +\\frac{1}{3}$.\n\n$m = -\\frac{v}{u} \\Rightarrow v = -\\frac{u}{3}$\n\nMirror formula: $\\frac{1}{v} + \\frac{1}{u} = \\frac{1}{f}$, with $f = +20$ cm.\n\n$\\frac{-3}{u} + \\frac{1}{u} = \\frac{1}{20} \\Rightarrow \\frac{-2}{u} = \\frac{1}{20} \\Rightarrow u = -40$ cm.',
      },
      {
        q: 'An object is placed between the focus $F$ and the pole $P$ of a concave mirror. Describe the image.',
        a: 'When $|u| < |f|$ for a concave mirror, the image is virtual, erect, and magnified — located behind the mirror. This is why concave mirrors are used as shaving/makeup mirrors.',
      },
    ],
  },
  {
    id: 'refraction',
    title: "Refraction & Snell's Law",
    description: 'Bending of light across media with different refractive indices.',
    simId: 'refraction',
    image: '/media/optical_slab_shift_lloyd_mirror_thin_film.webp',
    questions: [
      {
        q: 'Light travels from air into glass ($\\mu = 1.5$) at an angle of incidence $i = 45°$. Find the angle of refraction.',
        a: "Snell's Law: $n_1 \\sin i = n_2 \\sin r$\n\n$1 \\times \\sin 45° = 1.5 \\times \\sin r$\n\n$\\sin r = \\frac{0.707}{1.5} = 0.471 \\Rightarrow r = \\arcsin(0.471) \\approx 28.1°$",
      },
      {
        q: 'An object is at the bottom of a $15$ cm deep water tank ($\\mu = \\frac{4}{3}$). Find the apparent depth when viewed normally.',
        a: 'Apparent depth $= \\frac{\\text{real depth}}{\\mu} = \\frac{15}{4/3} = 15 \\times \\frac{3}{4} = 11.25$ cm.',
      },
      {
        q: 'A glass slab of thickness $t = 6$ cm and $\\mu = 1.5$ is placed over a point object. Calculate the apparent shift.',
        a: 'Shift $= t\\left(1 - \\frac{1}{\\mu}\\right) = 6\\left(1 - \\frac{1}{1.5}\\right) = 6 \\times \\frac{1}{3} = 2$ cm.',
      },
    ],
  },
  {
    id: 'tir',
    title: 'Total Internal Reflection',
    description: 'Complete reflection when light in denser medium exceeds critical angle.',
    simId: 'tir',
    image: '/media/optical_fiber_total_internal_reflection.webp',
    questions: [
      {
        q: 'Calculate the critical angle for a glass–air interface where $\\mu_{\\text{glass}} = 1.5$.',
        a: '$\\sin\\theta_c = \\frac{n_2}{n_1} = \\frac{1}{1.5} = \\frac{2}{3}$\n\n$\\theta_c = \\arcsin\\!\\left(\\frac{2}{3}\\right) \\approx 41.8°$',
      },
      {
        q: 'A ray strikes a glass–water interface ($\\mu_{\\text{glass}} = 1.5$, $\\mu_{\\text{water}} = 1.33$) at $62°$. Does TIR occur?',
        a: '$\\sin\\theta_c = \\frac{\\mu_{\\text{water}}}{\\mu_{\\text{glass}}} = \\frac{1.33}{1.5} = 0.887$\n\n$\\theta_c = \\arcsin(0.887) \\approx 62.5°$\n\nSince $62° < 62.5°$, TIR does **not** occur — the ray partially refracts.',
      },
      {
        q: 'Why does a diamond sparkle so brilliantly?',
        a: 'Diamond has $\\mu \\approx 2.42$, giving a very small critical angle $\\theta_c \\approx 24.4°$. Light entering the diamond strikes facets at angles greater than $\\theta_c$ and undergoes multiple total internal reflections before finally emerging, producing the characteristic sparkle.',
      },
    ],
  },
  {
    id: 'spherical-refraction',
    title: 'Refraction at Spherical Surfaces',
    description: "Snell's law applied at a single curved refracting surface.",
    simId: 'spherical-refraction',
    image: '/media/refraction_at_spherical_surface_geometry.webp',
    questions: [
      {
        q: 'A point object in air is $20$ cm from a convex glass surface ($\\mu = 1.5$, $R = 10$ cm). Find the image position.',
        a: 'Formula: $\\frac{\\mu_2}{v} - \\frac{\\mu_1}{u} = \\frac{\\mu_2 - \\mu_1}{R}$\n\nHere $\\mu_1 = 1$, $\\mu_2 = 1.5$, $u = -20$ cm, $R = +10$ cm.\n\n$\\frac{1.5}{v} - \\frac{1}{-20} = \\frac{0.5}{10}$\n\n$\\frac{1.5}{v} + \\frac{1}{20} = \\frac{1}{20}$\n\n$\\frac{1.5}{v} = 0 \\Rightarrow v = \\infty$. Image at infinity.',
      },
      {
        q: 'A parallel beam of light in air enters a solid glass sphere of radius $5$ cm and $\\mu = 1.5$. Find the image formed by refraction at the first surface.',
        a: 'Object at $u = -\\infty$, $R = +5$ cm, $\\mu_1 = 1$, $\\mu_2 = 1.5$.\n\n$\\frac{1.5}{v} - \\frac{1}{-\\infty} = \\frac{1.5 - 1}{5} = \\frac{0.5}{5} = 0.1$\n\n$v = \\frac{1.5}{0.1} = 15$ cm inside the glass.',
      },
      {
        q: 'Derive the condition for image formation at the same point as the object for a spherical surface.',
        a: 'Using $\\frac{\\mu_2}{v} - \\frac{\\mu_1}{u} = \\frac{\\mu_2 - \\mu_1}{R}$, set $v = u$. Then:\n\n$\\frac{\\mu_2 - \\mu_1}{u} = \\frac{\\mu_2 - \\mu_1}{R}$\n\nThis gives $u = R$ — the object must be at the centre of curvature.',
      },
    ],
  },
  {
    id: 'thin-lens',
    title: 'Thin Lenses',
    description: 'Lenses treated with the thin lens approximation.',
    simId: 'thin-lens',
    image: '/media/thin_lens_ray_diagram_and_displacement_method.webp',
    questions: [
      {
        q: 'A plano-convex lens ($\\mu = 1.5$, $R = 30$ cm) is silvered at the curved surface. At what distance should an object be placed to get a real image of the same size?',
        a: 'The silvered lens acts as a mirror with effective focal length $\\frac{1}{F} = \\frac{2}{f_\\ell} + \\frac{1}{f_m}$.\n\n$\\frac{1}{f_\\ell} = (1.5-1)\\left(\\frac{1}{\\infty} - \\frac{1}{-30}\\right) = \\frac{0.5}{30} = \\frac{1}{60}$, so $f_\\ell = 60$ cm.\n\n$f_m = \\frac{R}{2} = 15$ cm.\n\n$\\frac{1}{F} = \\frac{2}{60} + \\frac{1}{15} = \\frac{1}{30} + \\frac{1}{15} = \\frac{1}{10}$, so $F = 10$ cm.\n\nFor same-size real image, $u = 2F = 20$ cm.',
      },
      {
        q: 'A glass lens ($\\mu = 1.5$) has power $P = -5$ D in air. Find its power in a liquid of $\\mu_L = 1.6$.',
        a: '$\\frac{1}{f_a} = (\\mu_g - 1)\\left(\\frac{1}{R_1}-\\frac{1}{R_2}\\right)$\n\n$\\frac{1}{f_m} = \\left(\\frac{\\mu_g}{\\mu_L}-1\\right)\\left(\\frac{1}{R_1}-\\frac{1}{R_2}\\right)$\n\n$\\frac{f_m}{f_a} = \\frac{\\mu_g - 1}{\\mu_g/\\mu_L - 1} = \\frac{0.5}{1.5/1.6 - 1} = \\frac{0.5}{-0.0625} = -8$\n\n$f_a = -\\frac{1}{5}$ m, so $f_m = -8 \\times (-\\frac{1}{5}) = \\frac{8}{5}$ m.\n\n$P_m = \\frac{\\mu_L}{f_m} = \\frac{1.6}{8/5} = 1$ D',
      },
      {
        q: 'In a $u$-$v$ graph, a $45°$ line through the origin meets the lens curve at $P$. What are the coordinates of $P$?',
        a: 'The line $|v| = |u|$ meets the curve when the object and image distances are equal. Using the lens formula with $|u| = |v|$:\n\n$\\frac{1}{v} - \\frac{1}{u} = \\frac{1}{f}$ with $v = -u$ gives $\\frac{-2}{u} = \\frac{1}{f}$... but on the $|v|$ vs $|u|$ graph this occurs at $|u| = |v| = 2f$.\n\n$\\boxed{P = (2f,\\; 2f)}$',
      },
      {
        q: 'An object $2.4$ m in front of a lens forms a sharp image $12$ cm behind. A glass slab ($t = 1$ cm, $\\mu = 1.5$) is placed between lens and film. Where must the object be shifted?',
        a: 'Slab shift $= t\\left(1 - \\frac{1}{\\mu}\\right) = 1 \\times \\frac{1}{3} = \\frac{1}{3}$ cm. New effective $v = 12 - \\frac{1}{3} = \\frac{35}{3}$ cm.\n\n$\\frac{1}{f} = \\frac{1}{12} + \\frac{1}{240} = \\frac{21}{240}$ cm$^{-1}$\n\n$\\frac{1}{u} = \\frac{1}{v} - \\frac{1}{f} = \\frac{3}{35} - \\frac{21}{240} \\approx -\\frac{1}{560}$\n\n$u = -560$ cm $= -5.6$ m. Shift object from $2.4$ m to $5.6$ m.',
      },
    ],
  },
  {
    id: 'lens-maker',
    title: "Lens Maker's Formula",
    description: 'Determining focal length from radii of curvature and refractive index.',
    questions: [
      {
        q: 'A biconvex lens has $R_1 = R_2 = 20$ cm and $\\mu = 1.5$. Find its focal length.',
        a: '$\\frac{1}{f} = (\\mu - 1)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right) = (0.5)\\left(\\frac{1}{20} - \\frac{1}{-20}\\right) = 0.5 \\times \\frac{2}{20} = \\frac{1}{20}$\n\n$f = +20$ cm',
      },
      {
        q: 'The lens above is immersed in water ($\\mu_w = \\frac{4}{3}$). Find the new focal length.',
        a: '$\\frac{1}{f\'} = \\left(\\frac{\\mu_g}{\\mu_w} - 1\\right)\\left(\\frac{1}{R_1} - \\frac{1}{R_2}\\right) = \\left(\\frac{1.5}{4/3} - 1\\right) \\times \\frac{1}{10} = \\frac{1}{8} \\times \\frac{1}{10} = \\frac{1}{80}$\n\n$f\' = 80$ cm — focal length increases fourfold in water.',
      },
      {
        q: 'Find the focal length of a plano-concave lens with $R = 30$ cm and $\\mu = 1.5$.',
        a: 'For a plano-concave lens: $R_1 = \\infty$, $R_2 = +30$ cm (concave surface faces the incoming light).\n\n$\\frac{1}{f} = (1.5-1)\\left(0 - \\frac{1}{30}\\right) = -\\frac{0.5}{30} = -\\frac{1}{60}$\n\n$f = -60$ cm (diverging lens, as expected).',
      },
    ],
  },
  {
    id: 'lens-combo',
    title: 'Lens Combination',
    description: 'Equivalent focal length of two separated lenses.',
    simId: 'lens-combo',
    image: '/media/lens_combinations_cutting_and_silvering.webp',
    questions: [
      {
        q: 'Two lenses of power $P_1 = -15$ D and $P_2 = +5$ D are in contact. Find the focal length of the combination.',
        a: '$P = P_1 + P_2 = -15 + 5 = -10$ D\n\n$f = \\frac{1}{P} = -0.1$ m $= -10$ cm (diverging combination)',
      },
      {
        q: 'Two convex lenses of $f_1 = 10$ cm and $f_2 = 20$ cm are separated by $d = 5$ cm. Find the equivalent focal length.',
        a: '$\\frac{1}{f} = \\frac{1}{f_1} + \\frac{1}{f_2} - \\frac{d}{f_1 f_2} = \\frac{1}{10} + \\frac{1}{20} - \\frac{5}{200} = 0.1 + 0.05 - 0.025 = 0.125$\n\n$f = 8$ cm',
      },
      {
        q: 'A convex lens ($f = 10$ cm) and a concave lens ($f = -10$ cm) are separated by $d$. Find the equivalent power.',
        a: '$P = P_1 + P_2 - dP_1P_2$\n\nWith $P_1 = 10$ D and $P_2 = -10$ D: $P_1 + P_2 = 0$.\n\n$P = 0 - d(10)(-10) = 100d$ D, where $d$ is in metres.\n\nSo power depends entirely on their separation.',
      },
    ],
  },
  {
    id: 'prism',
    title: 'Prisms & Dispersion',
    description: 'Deviation and dispersion of light through an angled transparent block.',
    simId: 'prism',
    image: '/media/prism_dispersion_and_spherical_lens_refraction.webp',
    questions: [
      {
        q: "A prism with $A = 60°$ and $\\mu = 1.5$. Find the angle of minimum deviation $\\delta_m$.",
        a: '$\\mu = \\dfrac{\\sin\\!\\left(\\frac{A+\\delta_m}{2}\\right)}{\\sin(A/2)}$\n\n$1.5 = \\dfrac{\\sin\\!\\left(\\frac{60+\\delta_m}{2}\\right)}{\\sin 30°} = \\dfrac{\\sin\\!\\left(30 + \\delta_m/2\\right)}{0.5}$\n\n$\\sin\\!\\left(30 + \\delta_m/2\\right) = 0.75 \\Rightarrow 30 + \\delta_m/2 \\approx 48.6°$\n\n$\\delta_m \\approx 37.2°$',
      },
      {
        q: 'State the condition for a ray NOT to emerge from a prism.',
        a: 'A ray cannot emerge from the second face if it strikes at angle $\\geq \\theta_c$ at that face. This happens when $A > 2\\theta_c$, where $\\theta_c = \\arcsin(1/\\mu)$.',
      },
      {
        q: 'For a small-angle prism of angle $A$, show that the deviation $\\delta = (\\mu - 1)A$.',
        a: 'For small $A$, $\\sin x \\approx x$. Snell\'s law at first surface: $i_1 \\approx \\mu r_1$. At second surface: $\\mu r_2 \\approx i_2$. With $r_1 + r_2 = A$ and $\\delta = i_1 + i_2 - A$:\n\n$\\delta \\approx \\mu r_1 + \\mu r_2 - A = \\mu A - A = (\\mu - 1)A$',
      },
    ],
  },
  {
    id: 'microscope',
    title: 'Compound Microscope',
    description: 'Two convex lenses combining to produce highly magnified images.',
    simId: 'microscope',
    image: '/media/optical_instruments_microscopes_telescopes_and_defects.webp',
    questions: [
      {
        q: 'A microscope has $f_o = 1$ cm, $f_e = 5$ cm. Object is $1.1$ cm from the objective. Find magnifying power (image at $\\infty$).',
        a: 'Lens formula for objective: $\\frac{1}{v_o} - \\frac{1}{-1.1} = \\frac{1}{1}$\n\n$\\frac{1}{v_o} = 1 - \\frac{1}{1.1} = \\frac{0.1}{1.1} \\Rightarrow v_o = 11$ cm\n\n$M = -\\frac{v_o}{u_o} \\times \\frac{D}{f_e} = -\\frac{11}{1.1} \\times \\frac{25}{5} = -10 \\times 5 = -50$',
      },
      {
        q: 'What happens to the resolving power if the wavelength of light used is decreased?',
        a: 'Resolving power $= \\frac{2\\mu\\sin\\theta}{1.22\\lambda}$. Since $\\lambda$ is in the denominator, decreasing wavelength **increases** resolving power — finer details can be resolved.',
      },
      {
        q: 'Why should the objective of a microscope have a short focal length?',
        a: 'Short $f_o$ keeps the object just beyond $f_o$, producing a highly magnified real intermediate image. Also, short $f_o$ lenses typically have small apertures which reduce spherical aberration.',
      },
    ],
  },
  {
    id: 'telescope',
    title: 'Astronomical Telescope',
    description: 'Lenses capturing light from distant objects for angular magnification.',
    simId: 'telescope',
    questions: [
      {
        q: 'A telescope has $f_o = 100$ cm and $f_e = 5$ cm. Find magnifying power and tube length in normal adjustment.',
        a: '$M = -\\frac{f_o}{f_e} = -\\frac{100}{5} = -20$ (inverted image)\n\nTube length $L = f_o + f_e = 100 + 5 = 105$ cm',
      },
      {
        q: 'Find the magnifying power when the final image forms at the least distance of distinct vision $D = 25$ cm.',
        a: '$M = -\\frac{f_o}{f_e}\\left(1 + \\frac{f_e}{D}\\right) = -20\\left(1 + \\frac{5}{25}\\right) = -20 \\times 1.2 = -24$',
      },
      {
        q: 'Why does a telescope objective have a large aperture?',
        a: 'A large aperture:\n1. Gathers more light — essential for dim/distant objects.\n2. Increases resolving power: $\\text{RP} \\propto \\frac{D}{\\lambda}$, so larger $D$ resolves closer angular separations.',
      },
    ],
  },
];
