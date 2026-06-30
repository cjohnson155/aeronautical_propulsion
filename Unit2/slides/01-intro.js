// ME 3470 . Unit 2 - Section 1 (+ opener) - Intro to Compressible Flow
// Slide DATA only. Rendered by ../engine.jsx; assembled in ./index.js.

export const introSlides = [


  // ── DESIGN TASK HOOK ────────────────────────────────────────────────────────
  {
    type: 'hook',
    scenario:
      'We are an <strong>engineering team</strong> tasked with designing a supersonic wind tunnel '
      + 'to test our inlet geometries at realistic flight Mach numbers.',
    spec:
      'The tunnel needs a large reservoir of compressed air. '
      + 'We plan to store it in a 10&nbsp;m³ pressure vessel.',
    question: 'How much air can we get into that vessel?',
    bridge:
      'That depends on how <strong>compressible</strong> air is. '
      + 'So first — what is the definition of compressibility?',
  },

  // ── UNIT 2 OUTLINE ──────────────────────────────────────────────────────────
  {
    type: 'outline',
    sectionNumber: 'Unit 2',
    title: 'Compressible Flow',
    subtitle: 'Lecture outline — six movements from definition to stagnation properties.',
    items: [
      'Intro — what is compressible flow?',
      'Thermo review — Ideal Gas Law &amp; EoS principle',
      'Isentropic processes &amp; relations',
      'Conservation principles &amp; Newton\u2019s laws',
      'Speed of sound &amp; Mach number',
      'Stagnation properties',
    ],
  },

  // ── SECTION 1: INTRO TO COMPRESSIBLE FLOW ──────────────────────────────────
  {
    type: 'compress',
    sectionNumber: 'Section 1',
    heading: 'Intro to Compressible Flow',
    question: 'Which forms of matter are compressible?',
    questionAnswer: 'All of them — even solids. <em>How</em> compressible they are is the engineering question.',
    definition:
      'Compressibility — how much the density of something changes in response to an increase in pressure.',
    equation: '\\tau = \\frac{1}{\\rho}\\frac{d\\rho}{dp} \\;\\;\\Rightarrow\\;\\; d\\rho = \\rho\\,\\tau\\,dp',
    cutoff:
      'In the flows we deal with in aircraft airbreathing engines, gas should <strong>not</strong> always be treated as incompressible. For aerodynamics, <strong>M = 0.3</strong> is the usual cutoff: if density changes in response to a pressure change by 5% or more, it\u2019s important enough to consider compressible — and we therefore solve for both isothermal and isentropic compression.',
    specificVolume: 'v = m^{3}/kg = \\tfrac{1}{\\rho}',
  },

  // ── M < 0.3 IS A FLOW CRITERION, NOT A FLUID PROPERTY (from handwritten notes) ──
  {
    type: 'conserve',
    sectionNumber: 'Section 1 — Compressibility',
    heading: 'Incompressible Is About the Flow, Not the Fluid',
    intro:
      'The M &lt; 0.3 cutoff is easy to misread. It tells you when a <em>flow</em> can be treated as incompressible &mdash; it does <strong>not</strong> say the fluid itself is incompressible.',
    columns: [
      {
        tag: 'flow', label: 'A flow criterion', accent: '#5ec8d8',
        items: [
          { k: 'M &lt; 0.3', v: 'density changes stay under ~5%, so you may neglect them in <em>that flow</em>.' },
          { k: 'Pressure gradients drive it', v: 'like the balloon &mdash; the flow is set up by &Delta;p, and M tells you whether &Delta;&rho; matters.' },
        ],
      },
      {
        tag: 'fluid', label: 'A fluid property', accent: '#f0a93b',
        items: [
          { k: '&tau; &gt; 0 always', v: 'every gas is compressible; &tau; is a property of the fluid, never zero.' },
          { k: 'Piston&ndash;cylinder', v: 'M = 0 &mdash; no flow at all &mdash; yet the trapped air still compresses.' },
        ],
      },
    ],
    bridge:
      'So &ldquo;incompressible&rdquo; is a statement about a <em>process</em>, not the substance. The real question is always whether a given process produces a &Delta;&rho; big enough to matter.',
  },


  // ── CLASS POLL: Compressibility intuition ────────────────────────────────────
  {
    type: 'poll',
    sectionNumber: 'Section 1 — Class Poll',
    question: 'Which of the following gases is <em>most</em> compressible at room conditions (1 atm, ~300 K)?',
    choices: [
      { label: 'A', text: 'Helium (He)', correct: false },
      { label: 'B', text: 'Hydrogen (H₂)', correct: false },
      { label: 'C', text: 'Nitrogen (N₂)', correct: false },
      { label: 'D', text: 'Carbon dioxide (CO₂)', correct: true },
    ],
    explanation:
      'CO₂ is correct. At a given T and p, \u03c4 isn\u2019t set by molar mass — it\u2019s set by how far the gas departs from ideal-gas behavior, '
      + 'which intermolecular attractive forces drive. CO₂ has much stronger intermolecular forces (and a critical temperature of ~304 K — '
      + 'room temperature sits right near its critical point) than He, H₂, or N₂, so it deviates the most from ideal-gas behavior and is the most compressible of the four. '
      + 'He, H₂, and N₂ all behave very close to ideal gases at room conditions, each with \u03c4 \u2248 1/p.',
  },

  // ── NOTE: three equation slides that previously closed this section have been
  //  RELOCATED so the lecture stops jumping ahead of itself:
  //    • "Equation of State" (p = ZρRT)            → Section 2 (02-thermo_2.js)
  //    • "Internal Energy & Enthalpy" (e=cvT…)      → Section 2 (02-thermo_2.js)
  //    • "Temperature Ratio in Terms of Mach No."   → Section 6 (06-stagnation.js)
  //  The Mach-ratio slide needs a = √(γRT) (Section 5) and the energy equation
  //  (Section 6), so it could not be defended here in the intro.
]
