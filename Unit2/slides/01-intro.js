// ME 3470 . Unit 2 - Section 1 (+ opener) - Intro to Compressible Flow
// Slide DATA only. Rendered by ../engine.jsx; assembled in ./index.js.

export const introSlides = [


  // ── DESIGN TASK HOOK ────────────────────────────────────────────────────────
  {
    type: 'hook',
    scenario:
      'We are <strong>propulsion engineers</strong>. '
      + 'Our job: design a supersonic wind tunnel to test our inlet geometries at realistic flight Mach numbers.',
    spec:
      'The tunnel needs a large reservoir of compressed air. '
      + 'We plan to store it at <strong>P&nbsp;=&nbsp;20&nbsp;atm, T&nbsp;=&nbsp;300&nbsp;K</strong> '
      + 'in a 10&nbsp;m³ pressure vessel.',
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
    question: 'Which of the following is <em>most</em> compressible at room conditions?',
    choices: [
      { label: 'A', text: 'Steel rod', correct: false },
      { label: 'B', text: 'Liquid water', correct: false },
      { label: 'C', text: 'Air at 1 atm', correct: true },
      { label: 'D', text: 'Rubber foam (the solid rubber itself)', correct: false },
    ],
    explanation:
      'Air wins by a wide margin — \u03c4 for air at 1 atm \u2248 10\u207b\u2075 Pa\u207b\u00b9, '
      + 'while water is ~4.5\u00d710\u207b\u00b9\u2070 Pa\u207b\u00b9 (10\u2074\u00d7 less compressible) '
      + 'and steel ~10\u207b\u00b9\u00b9 Pa\u207b\u00b9. '
      + 'Foam feels soft because the <em>trapped air pockets</em> compress — the rubber matrix itself is nearly incompressible.',
  },

  // ── EQUATION OF STATE: P = Z rho R T  ->  ideal gas law ────────────────────
  {
    type: 'equation',
    heading: 'Equation of State: Relating Fluid Properties',
    equationLabel:
      'The equation of state connects the thermodynamic properties we can measure or specify: p, &rho;, and T. A general fluid carries a compressibility factor Z; set Z = 1 and you recover the ideal gas law:',
    equation: 'p = Z\\,\\rho R T \\;\\;\\overset{Z\\,=\\,1}{\\Longrightarrow}\\;\\; p = \\rho R T',
    terms: [
      { symbol: 'Z', definition: 'compressibility factor — how far the gas departs from ideal' },
      { symbol: 'R', definition: 'specific gas constant (287 J/kg&middot;K for air)' },
    ],
    items: [
      { title: 'Perfect gas: Z = 1', body: 'p = &rho;RT &mdash; the property model we will use for the air calculations in this unit.' },
      { title: 'This course: assume IDG applies', body: 'At our operating pressures and temperatures, P is low enough and T high enough that Z &asymp; 1.' },
    ],
  },


  // ── INTERNAL ENERGY & ENTHALPY EQUATIONS (merged from ThermodynamicsPresentation) ──
  {
    type: 'equation',
    heading: 'Internal Energy &amp; Enthalpy of a Calorically Perfect Gas',
    equationLabel: 'Key relations — calorically perfect gas (constant c<sub>p</sub>, c<sub>v</sub>)',
    equation: 'e = c_v T \\qquad h = c_p T \\qquad \\gamma = \\frac{c_p}{c_v} \\qquad c_v = \\frac{R}{\\gamma - 1}',
    terms: [
      { symbol: 'e', definition: 'Specific internal energy (J/kg)' },
      { symbol: 'h = e + pv', definition: 'Specific enthalpy (J/kg)' },
      { symbol: 'R = 287 J/kg·K', definition: 'Specific gas constant for air' },
      { symbol: 'γ = 1.4', definition: 'Ratio of specific heats (air, calorically perfect)' },
      { symbol: 'c<sub>v</sub> = 717.5 J/kg·K', definition: 'From R/(γ−1) = 287/0.4' },
      { symbol: 'c<sub>p</sub> = c<sub>v</sub> + R', definition: '= 1004.5 J/kg·K' },
    ],
    items: [
      {
        title: 'Why does H/E = γ?',
        body: 'H = c<sub>p</sub>Tm and E = c<sub>v</sub>Tm, so H/E = c<sub>p</sub>/c<sub>v</sub> = γ exactly. A fast sanity check you can always use.',
      },
    ],
  },

  // ── MACH-NUMBER FORM ───────────────────────────────────────────────────────
  {
    type: 'equation',
    heading: 'Temperature Ratio in Terms of Mach Number',
    equationLabel: 'Substitute c<sub>p</sub> = &gamma;R/(&gamma;&minus;1), a&sup2; = &gamma;RT, and M = V/a into the energy equation',
    equation: '\\frac{T_t}{T} = 1 + \\frac{\\gamma-1}{2}M^2',
    terms: [
      { symbol: 'T<sub>t</sub>/T', definition: 'stagnation-to-static temperature ratio' },
      { symbol: 'M = V/a', definition: 'local Mach number' },
      { symbol: '&gamma;', definition: 'ratio of specific heats (1.4 for air)' },
    ],
    items: [
      { title: 'Set entirely by M and &gamma;', body: 'For a given gas the ratio depends on nothing but the Mach number.' },
      { title: 'Always &ge; 1', body: 'T<sub>t</sub> &ge; T, with equality only at M = 0 (no motion, nothing to recover).' },
    ],
  },
]
