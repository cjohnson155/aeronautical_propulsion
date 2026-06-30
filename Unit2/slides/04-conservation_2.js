// ME 3470 . Unit 2 - Section 4 - Conservation Principles
// Slide DATA only. Rendered by ../engine.jsx; assembled in ./index.js.

export const conservationSlides = [


  // ── NEW · SECTION 4: CONTROL MASS vs CONTROL VOLUME ─────────────────────────
  {
    type: 'conserve',
    sectionNumber: 'Section 4 — Conservation Principles',
    heading: 'Two Ways to Keep the Books',
    intro:
      'Before we can write conservation laws we must choose <em>what</em> we are accounting for. Two bookkeeping systems &mdash; pick the one that makes the problem easy.',
    columns: [
      {
        tag: 'CM', label: 'Control Mass',
        accent: '#5ec8d8',
        items: [
          { k: 'No mass crosses the boundary', v: 'The system follows a fixed packet of fluid — no flux in or out.' },
          { k: 'Boundary moves with the flow',  v: 'The volume stretches as the mass drifts apart; we just keep track of it.' },
          { k: 'Energy may still cross',         v: 'Heat δq and work δw cross the boundary even though mass does not.' },
        ],
      },
      {
        tag: 'CV', label: 'Control Volume',
        accent: '#f0a93b',
        items: [
          { k: 'Mass fluxes in and out',   v: 'The region is fixed in space; fluid passes through it. Best for engines.' },
          { k: 'Conserved by accounting',  v: 'Track what crosses the walls and what remains stored inside.' },
          { k: 'Energy crosses two ways',  v: 'Across the boundary as δq / δw, <strong>and</strong> carried in/out by the mass itself.' },
        ],
      },
    ],
    bridge:
      'For an airbreathing engine the <strong>control volume</strong> wins: air streams through it continuously, so we count what crosses the inlet and nozzle rather than chasing one packet of air.',
  },

  // ── NEW · SECTION 4: THE CONSERVATION LAWS (CV FORM) ────────────────────────
  {
    type: 'conslaws',
    sectionNumber: 'Section 4 — Conservation Laws',
    heading: 'Mass, Momentum &amp; Energy in CV Form',
    intro:
      'Each law has the same shape: an <em>unsteady storage</em> term inside the CV plus a <em>flux</em> term across the control surface. Outflow is positive by convention.',
    laws: [
      {
        tag: 'Mass', accent: '#5ec8d8',
        eq: '\\frac{\\partial}{\\partial t}\\iiint_{CV}\\rho\\,d\\mathcal{V} + \\iint_{CS}\\rho(\\vec{V}\\cdot\\hat{n})\\,dS = 0',
        note: 'If mass leaving is (+) and the equation sums to zero, the storage term must accumulate (+) or deplete (−) to balance it.',
      },
      {
        tag: 'Momentum', accent: '#f0a93b',
        eq: '\\frac{\\partial}{\\partial t}\\iiint_{CV}\\rho\\vec{V}\\,d\\mathcal{V} + \\iint_{CS}\\rho\\vec{V}(\\vec{V}\\cdot\\hat{n})\\,dS = \\vec{F}_{net}',
        note: 'A positive force depends on how you define your axes — but the momentum flux is <strong>always (+) outward</strong> (Leibniz rule). This term becomes the thrust equation.',
      },
      {
        tag: 'Energy', accent: '#5ec8d8',
        eq: '\\dot{Q} = \\frac{dE}{dt} + \\dot{W}, \\quad E = \\iiint_{CV}\\rho\\left(e + \\tfrac{V^2}{2}\\right)d\\mathcal{V}',
        note: 'First law for a CV: heat in equals the change in stored energy plus work out. The flux carries e + V²/2 per unit mass across the surface.',
      },
    ],
    bridge:
      'These three are the engine of every cycle analysis. Next we ask a different question — not how much mass or momentum crosses, but <em>how fast the gas can pass information to itself</em>.',
  },

  // ── ENTROPY EXAMPLES (merged from ThermodynamicsPresentation) ────────────────
  {
    type: '__entropy',
  },

  // ── WORKED EXAMPLE: ENTROPY CHANGE (Anderson MCF Ex. 2 — Part d) ─────────────
  {
    type: 'example',
    sectionNumber: 'Section 4 — Worked Example',
    heading: 'Entropy Change: Constant-Volume Heating',
    scenario:
      'Same vessel (V = 10 m³, <strong>m = 235.4 kg</strong>) is heated from '
      + '<strong>T₁ = 300 K → T₂ = 600 K</strong> at fixed volume. '
      + 'Find the specific entropy change Δs and the total ΔS.',
    steps: [
      {
        label: 'Two forms of the Gibbs equation — pick the right one',
        note: 'Form 1: ds = c<sub>p</sub> dT/T &minus; R dp/p &emsp;'
          + 'Form 2: ds = c<sub>v</sub> dT/T + R dv/v. '
          + 'Fixed volume (sealed vessel) &rarr; dv = 0 &rarr; Form 2 collapses to one term. '
          + 'We can also use Form 1 if we first find p₂/p₁.',
        question: 'Try Form 2 directly (ds = c<sub>v</sub> dT/T, dv = 0). Does it give the same answer?',
      },
      {
        label: 'Find the pressure ratio using IDG + fixed ρ',
        eq: '\\frac{p_2}{p_1} = \\frac{\\rho R T_2}{\\rho R T_1} = \\frac{T_2}{T_1} = \\frac{600}{300} = 2',
        question: 'Why is ρ constant here? (Hint: fixed volume V and fixed mass m.)',
      },
      {
        label: 'Compute c<sub>p</sub>',
        eq: 'c_p = c_v + R = 717.5 + 287 = 1004.5\\;\\mathrm{J/(kg\\cdot K)}',
      },
      {
        label: 'Apply Form 1 of the Gibbs equation',
        eq: '\\Delta s = c_p \\ln\\!\\frac{T_2}{T_1} - R\\ln\\!\\frac{p_2}{p_1} '
          + '= 1004.5\\ln 2 - 287\\ln 2',
        result: '\\Delta s = (c_p - R)\\ln 2 = c_v \\ln 2 = 497.3\\;\\mathrm{J/(kg\\cdot K)}',
        revealResult: true,
        question: 'Note c<sub>p</sub> − R = c<sub>v</sub>: both Gibbs forms give the same result. Why must they?',
      },
      {
        label: 'Total entropy change',
        eq: '\\Delta S = m\\,\\Delta s = (235.4)(497.3)',
        result: '\\Delta S = 1.171\\times 10^5\\;\\mathrm{J/K}',
        revealResult: true,
      },
    ],
  },
]
