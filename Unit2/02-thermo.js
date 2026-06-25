// ME 3470 · Unit 2 — Section 2 — Thermodynamic Foundations
// Slide DATA only. Rendered by ../engine.jsx; assembled in ./index.js.

export const thermoSlides = [
  // ── SECTION BREAK: THERMODYNAMIC FOUNDATIONS (merged from ThermodynamicsPresentation) ──
  {
    type: 'section',
    sectionNumber: 'Section 2',
    title: 'Thermodynamic Foundations',
    subtitle: 'Internal energy, enthalpy, specific heats, and entropy.',
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
        title: 'Worked example — room of air',
        body: 'ρ = 1.181 kg/m³, V = 5×7×3.3 m = 115.5 m³ → m = 136.4 kg, T ≈ 293 K.<br>'
          + 'E = c<sub>v</sub>Tm = 717.5 × 293 × 136.4 ≈ <strong>29.2 MJ</strong>'
          + '&emsp;H = c<sub>p</sub>Tm ≈ <strong>40.8 MJ</strong>.<br>'
          + 'Check: H/E = c<sub>p</sub>/c<sub>v</sub> = γ = 1.4 ✓',
      },
      {
        title: 'Why does H/E = γ?',
        body: 'H = c<sub>p</sub>Tm and E = c<sub>v</sub>Tm, so H/E = c<sub>p</sub>/c<sub>v</sub> = γ exactly. A fast sanity check you can always use.',
      },
    ],
  },

  // ── WORKED EXAMPLE: WIND TUNNEL RESERVOIR (Anderson MCF Ex. 2 — Parts a, b) ─
  {
    type: 'example',
    sectionNumber: 'Section 2 — Worked Example',
    heading: 'Supersonic Wind Tunnel: Reservoir Air',
    scenario:
      'Pressure vessel: <strong>V = 10 m³, P = 20 atm, T = 300 K.</strong> '
      + 'Stores compressed air for a supersonic wind tunnel. '
      + 'Find <em>(a)</em> the stored mass and <em>(b)</em> the isothermal compressibility.',
    steps: [
      {
        label: 'Check IDG validity',
        note: 'P = 20 atm is elevated but not extreme; T = 300 K is well above condensation. '
          + 'Intermolecular forces negligible &rarr; treat as an ideal gas.',
        question: 'At what conditions (very high P or very low T) would we need a real-gas equation of state instead?',
      },
      {
        label: 'Write the IDG law in mass form',
        eq: 'P = \\frac{m}{V}\\,RT \\quad\\Longrightarrow\\quad m = \\frac{PV}{RT}',
        question: 'R<sub>air</sub> = 287 J/(kg·K). How would R change if the reservoir contained CO₂ or helium?',
      },
      {
        label: 'Convert pressure and solve',
        eq: 'm = \\frac{(20 \\times 101\\,325)(10)}{(287)(300)}',
        result: 'm = 234.6\\;\\mathrm{kg}',
      },
      {
        label: 'Isothermal compressibility for an IDG',
        eq: '\\tau_T = \\frac{1}{\\rho}\\!\\left(\\frac{\\partial\\rho}{\\partial p}\\right)_{\\!T} '
          + '= \\frac{1}{\\rho}\\cdot\\frac{1}{RT} = \\frac{1}{p}',
        result: '\\tau_T = 4.93\\times 10^{-7}\\;\\mathrm{m^2/N}',
        question: 'τ₁ = 1/p: the gas gets <em>less</em> compressible as pressure rises. '
          + 'What does this imply for the structural design of the vessel as it is charged?',
      },
    ],
  },

  // ── ENERGY-STORAGE MODES (animated molecules) ───────────────────────────────
  {
    type: 'energymodes',
    sectionNumber: 'Section 2 — Internal Energy',
    heading: 'Where a Molecule Stores Energy',
    intro:
      'Internal energy <em>e</em> is the energy a kilogram of gas holds at a given temperature. A diatomic molecule like O<sub>2</sub> (modeled as a dumbbell) can park that energy in several <strong>modes</strong> &mdash; and the number of active modes sets c<sub>v</sub>, c<sub>p</sub>, and &gamma;.',
    modes: [
      {
        kind: 'translational',
        title: 'Translational',
        formula: '\\tfrac{1}{2} m V^2',
        note: 'Whole molecule moves through space. This is the only mode tied directly to temperature.',
      },
      {
        kind: 'rotational',
        title: 'Rotational',
        formula: '\\tfrac{1}{2} I \\omega^2',
        note: 'Dumbbell spins about its center. Two axes contribute for a diatomic.',
      },
      {
        kind: 'vibrational',
        title: 'Vibrational',
        formula: '\\tfrac{1}{2} k x^2',
        note: 'Bond stretches and compresses like a spring. Activates only at high temperature.',
      },
      {
        kind: 'electronic',
        title: 'Electronic',
        formula: '\\text{(orbitals)}',
        note: 'Electrons occupy higher orbitals. Negligible until very high temperatures.',
      },
    ],
    payoff:
      'Helium is a single atom &mdash; no bond to stretch, nothing to spin. <strong>All</strong> its energy lives in translational motion, i.e. directly in <em>T</em>.',
    measure:
      'Temperature is what our instruments actually read: particles in translational motion striking the sensor.',
  },

  // ── DEGREES OF FREEDOM: the cp/R step graph ─────────────────────────────────
  {
    type: 'dof',
    sectionNumber: 'Section 2 — Specific Heats',
    heading: 'Why c<sub>p</sub> Climbs With Temperature',
    intro:
      'For a perfect gas, <em>e</em> and <em>h</em> depend on temperature alone: e&nbsp;=&nbsp;e(T), h&nbsp;=&nbsp;h(T). The rate of change defines the specific heats &mdash; and that rate jumps each time a new <strong>degree of freedom</strong> wakes up.',
    defs: [
      { eq: '\\frac{de}{dT} = c_v', note: 'specific heat at constant volume' },
      { eq: '\\frac{dh}{dT} = c_p', note: 'specific heat at constant pressure' },
    ],
    bands: [
      { key: 'trans', name: 'Translation', sub: 'c\u209A/R = 3/2 \u00b7 3 DOF',            tLo: 1,   tHi: 3 },
      { key: 'flat',  name: '+ Rotation',  sub: 'c\u209A/R = 5/2 \u00b7 flat CPG plateau', tLo: 3,   tHi: 600 },
      { key: 'vib',   name: '+ Vibration', sub: 'climbs to 7/2 by ~2000 K',               tLo: 600, tHi: 2000 },
    ],
    cpg:
      'From 3&nbsp;K to ~600&nbsp;K, c<sub>p</sub> and c<sub>v</sub> sit on the flat 5/2 plateau &mdash; treat them as constant. That is the <strong>Calorically Perfect Gas (CPG)</strong>, where almost all of our cycle analysis lives. Above ~600&nbsp;K vibration switches on and c<sub>p</sub>/R climbs toward 7/2.',
  },

  // ── WHY cp > cv + RELATIONS ─────────────────────────────────────────────────
  {
    type: 'cpcv',
    sectionNumber: 'Section 2 — c\u209A vs c\u1D65',
    heading: 'The Piston Pays Extra: Why c<sub>p</sub> &gt; c<sub>v</sub>',
    setup:
      'Add the same heat q<sub>in</sub> two ways. At constant volume every joule raises temperature. At constant pressure the gas must <em>also</em> push the piston out &mdash; so some heat becomes work, and you need <strong>more</strong> heat for the same &Delta;T.',
    work:
      'That extra work is pv: &nbsp; pV = F&middot;d, so per unit area pv = (F/A)&middot;d. Enthalpy bundles it in: h = e + pv, c<sub>p</sub> = dh/dT.',
    relations: [
      { tag: 'PG',  label: 'Perfect gas',         eqs: ['pv = R T', 'h = e + R T', 'c_p = c_v + R', '\\gamma = \\frac{c_p}{c_v}'] },
      { tag: 'CPG', label: 'Calorically perfect', eqs: ['c_p,\\, c_v \\;\\text{const}', 'e = c_v T', 'h = c_p T'] },
    ],
    note:
      '<strong>State variables.</strong> e and h depend only on the state, not the path &mdash; so you may use c<sub>v</sub> even when volume changes, and c<sub>p</sub> even when pressure is not constant.',
  },


  // ── THINK · PAIR · SHARE: cv for helium ─────────────────────────────────────
  {
    type: 'tps',
    sectionNumber: 'Section 2 — Think \u00b7 Pair \u00b7 Share',
    question:
      'Helium has \u03b3 = 5/3 and R<sub>He</sub> = 2077 J/(kg\u00b7K). '
      + 'Use c<sub>v</sub> = R / (\u03b3 \u2212 1) to find c<sub>v,He</sub>. '
      + 'Is it larger or smaller than c<sub>v,air</sub> = 717.5 J/(kg\u00b7K)? Explain why.',
    think: { minutes: 3, prompt: 'Work alone. Plug in the numbers, then think: helium has <em>fewer</em> active degrees of freedom than diatomic air — so why might the result surprise you?' },
    pair:  { minutes: 3, prompt: 'Compare answers with your neighbour. Agree on the number, then explain the physical reason for the difference in terms of molecular weight.' },
    share: { prompt: 'What did pairs find? Key idea: R = \u211c / MW — helium\u2019s small molar mass (4 vs 29 g/mol) makes R per unit mass ~7\u00d7 larger, which dominates.' },
    answer: 'c_{v,\\text{He}} = \\frac{R_{\\text{He}}}{\\gamma - 1} = \\frac{2077}{5/3 - 1} = \\frac{2077}{2/3} = 3116\\;\\mathrm{J/(kg\\cdot K)}',
    answerNote: 'c<sub>v,He</sub> = 3116 J/(kg\u00b7K) \u2014 more than 4\u00d7 c<sub>v,air</sub>, despite helium having only 3 translational degrees of freedom vs 5 for diatomic air. The difference is entirely driven by R: lighter molecules carry more energy per kilogram at the same temperature.',
  },

  // ── WORKED EXAMPLE: INTERNAL ENERGY (Anderson MCF Ex. 2 — Part c) ───────────
  {
    type: 'example',
    sectionNumber: 'Section 2 — Worked Example',
    heading: 'Internal Energy of the Stored Air',
    scenario:
      'Same vessel: <strong>m = 234.6 kg, T = 300 K.</strong> '
      + 'Find the total internal energy E stored in the gas.',
    steps: [
      {
        label: 'Derive c<sub>v</sub> from γ and R',
        eq: 'c_p = c_v + R,\\quad \\gamma = \\frac{c_p}{c_v} '
          + '\\;\\Rightarrow\\; c_v = \\frac{R}{\\gamma - 1} = \\frac{287}{1.4 - 1}',
        result: 'c_v = 717.5\\;\\mathrm{J/(kg\\cdot K)}',
        question: 'For helium (γ = 5/3, monatomic), what is c<sub>v</sub>? '
          + 'Does a higher γ give a higher or lower c<sub>v</sub>?',
      },
      {
        label: 'Why c<sub>v</sub> and not c<sub>p</sub>?',
        note: 'c<sub>v</sub> gives internal energy <em>directly</em>: E = mc<sub>v</sub>T. '
          + 'You can also reach E via c<sub>p</sub> — compute enthalpy H = mc<sub>p</sub>T, '
          + 'then subtract the pv term (= mRT for an ideal gas): E = H − mRT = m(c<sub>p</sub> − R)T = mc<sub>v</sub>T. '
          + 'Both routes give the same answer; c<sub>v</sub> is just one step instead of two.',
        question: 'Compute H = mc<sub>p</sub>T. What is the ratio H/E, and why does it equal exactly γ?',
      },
      {
        label: 'Compute total internal energy',
        eq: 'E = mc_v T = (234.6)(717.5)(300)',
        result: 'E = 5.05\\times 10^7\\;\\mathrm{J}',
      },
    ],
  },
]
