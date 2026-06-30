// ME 3470 . Unit 2 - Section 3 - First Law & Path Dependence
// Slide DATA only. Rendered by ../engine.jsx; assembled in ./index.js.

export const firstLawSlides = [


  // ── PATH DEPENDENCE vs STATE VARIABLES (merged from ThermodynamicsPresentation) ─
  {
    type: '__path',
  },


  // ── CLASS POLL: Free expansion ────────────────────────────────────────────────
  {
    type: 'poll',
    sectionNumber: 'Section 3 — Class Poll',
    question: 'A sealed ideal gas expands freely into a vacuum (unrestrained expansion). Which statement is correct?',
    choices: [
      { label: 'A', text: 'Q = 0, W > 0 — no heat transfer but the gas does work on surroundings', correct: false },
      { label: 'B', text: 'Q > 0, W = 0 — heat flows in but no work done', correct: false },
      { label: 'C', text: 'Q = 0, W = 0, \u0394U = 0 — no heat, no work, temperature unchanged (ideal gas)', correct: true },
      { label: 'D', text: '\u0394U > 0 — internal energy rises because volume increases', correct: false },
    ],
    explanation:
      'C is correct. External pressure is zero (vacuum), so W = \u222bp dV<sub>ext</sub> = 0. '
      + 'Insulated walls mean Q = 0. By the 1st Law \u0394U = Q \u2212 W = 0, so temperature is unchanged for an ideal gas. '
      + 'Yet entropy <em>increases</em> — the process is irreversible. This is a vivid example of path dependence: \u0394U = 0 but \u0394S > 0.',
  },
]
