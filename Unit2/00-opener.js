// ME 3470 · Unit 2 — Opener — design-task hook + unit outline (spans all of Unit 2)
// Slide DATA only. Rendered by ../engine.jsx; assembled in ./index.js.

export const openerSlides = [
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
]
