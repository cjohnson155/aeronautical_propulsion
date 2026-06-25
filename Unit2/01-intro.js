// ME 3470 · Unit 2 — Section 1 — Intro to Compressible Flow
// Slide DATA only. Rendered by ../engine.jsx; assembled in ./index.js.

export const introSlides = [
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
]
