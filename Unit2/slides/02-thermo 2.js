// ME 3470 . Unit 2 - Section 2 - Thermodynamic Foundations
// Slide DATA only. Rendered by ../engine.jsx; assembled in ./index.js.

export const thermoSlides = [


  // ── SECTION BREAK: THERMODYNAMIC FOUNDATIONS (merged from ThermodynamicsPresentation) ──
  {
    type: 'section',
    sectionNumber: 'Section 2',
    title: 'Thermodynamic Foundations',
    subtitle: 'Equation of state, internal energy, enthalpy, specific heats, and entropy.',
  },

  // ════════════════════════════════════════════════════════════════════════
  //  SECTION 2 — THERMO REVIEW / EQUATION OF STATE  (from handwritten notes)
  //  Reuses existing renderers only: soundspeed / equation / shockform.
  //  No new renderers, no new CSS, no totalSteps() changes.
  //  Insert at the START of Section 2, right after the
  //  "Thermodynamic Foundations" section break.
  // ════════════════════════════════════════════════════════════════════════

  // ── WHY THERMO? Treating compressible flow as incompressible ───────────────
  {
    type: 'soundspeed',
    sectionNumber: 'Section 2 — Thermo Review',
    heading: 'Treating Compressible Flow as Incompressible',
    intro:
      'The tempting shortcut is to drop density changes and treat the flow as incompressible. But density hides inside the quantities we actually care about &mdash; including thrust.',
    equation: 'T = \\dot{m}\\,(V_e - V_i) + (p_e - p_i)\\,A_e',
    equationLabel: 'Net thrust &mdash; notice no <em>&rho;</em> appears explicitly',
    terms: [
      { sym: '\\dot{m}', def: 'mass flow rate &mdash; &#7745; = &rho;AV, so density lives in here' },
      { sym: 'V_e,\\ V_i', def: 'exit and inlet velocities' },
      { sym: 'p_e,\\ p_i', def: 'exit and ambient pressures' },
    ],
    cards: [
      { k: '&rho; is hidden in &#7745;', v: 'Thrust shows no explicit &rho;, but &#7745; = &rho;AV does. Ignore compressibility and you mis-predict the mass flow that sets the thrust.' },
      { k: 'Work can leak into compression', v: 'Do work on the flow expecting it to speed up; if it compresses instead, that energy raises p and &rho; rather than V<sub>e</sub> &mdash; so the exit velocity falls short.' },
    ],
    bridge:
      'So we track the flow&rsquo;s energy &mdash; where it goes, how it transforms, and how much of what we started with we actually use. First we need a way to relate its properties: an <strong>equation of state</strong>.',
  },

  // ── WHEN THE IDEAL GAS LAW FAILS (high P: molecular volume; low T: forces) ─
  {
    type: 'realgas',
    sectionNumber: 'Section 2 — Equation of State',
    heading: 'When the Ideal Gas Law Fails',
    intro:
      'Z = 1 holds when molecules are far apart and moving fast. The law breaks down at <strong>high pressure</strong> or <strong>low temperature</strong> &mdash; the regime where a real-gas model such as <em>van der Waals</em> is needed.',
    regimes: [
      {
        tag: 'hi P', label: 'High Pressure', accent: '#5ec8d8', diagram: 'dense',
        head: 'Molecular volume matters',
        body: 'Squeeze the gas and the space the molecules themselves occupy becomes significant next to the total volume. They stop behaving like point particles with room to spare.',
      },
      {
        tag: 'lo T', label: 'Low Temperature', accent: '#f0a93b', diagram: 'forces',
        head: 'Intermolecular forces matter',
        body: 'Slow the molecules down and attractive forces have time to act &mdash; molecules pull on one another instead of flying past, so the pressure dips below the ideal prediction.',
      },
    ],
    closer:
      'Both effects are exactly what the van der Waals corrections capture. In this course they stay negligible for the air-storage conditions we use &mdash; but <em>these</em> are the regimes where you would reach for a real-gas equation of state.',
  },

  // ── VAN DER WAALS EQUATION OF STATE: correcting the ideal gas law ──────────
  {
    type: 'equation',
    sectionNumber: 'Section 2 — Real-Gas Equation of State',
    heading: 'Van der Waals: Patching the Ideal Gas Law',
    equationLabel:
      'Two correction terms, one for each effect on the previous slide: <em>b</em> removes the molecules&rsquo; own volume, and <em>a/v&sup2;</em> accounts for the attractive pull they exert on each other.',
    equation: '\\left(p + \\frac{a}{v^2}\\right)(v - b) = RT',
    terms: [
      { symbol: 'a', definition: 'corrects pressure for intermolecular attraction — larger a means stronger attraction' },
      { symbol: 'b', definition: 'corrects volume for the finite size of the molecules themselves' },
      { symbol: 'v', definition: 'molar (or specific) volume' },
    ],
    items: [
      {
        title: 'Worked comparison: CO₂ at v = 5×10⁻⁴ m³/mol, T = 300 K',
        body: 'Ideal gas law: p = RT/v = 49.2 atm. Van der Waals (a = 0.364 Pa·m⁶/mol², b = 4.267×10⁻⁵ m³/mol): '
          + 'p = RT/(v−b) − a/v² = 39.5 atm — about 25% lower than the ideal prediction.',
      },
      {
        title: 'Why the ideal law overshoots here',
        body: 'At this density CO₂&rsquo;s attractive forces are strong enough to noticeably pull the gas inward, lowering the pressure it actually exerts on the walls below what naive p = RT/v predicts.',
      },
    ],
  },

  // ── WHERE EXTREME PRESSURES SHOW UP: ROCKET COMBUSTION CHAMBER ─────────────
  {
    type: 'equation',
    sectionNumber: 'Section 2 — Practical Application',
    heading: 'Where You Actually Hit These Extremes: Rocket Engines',
    equationLabel:
      'A rocket&rsquo;s <strong>combustion chamber</strong> is exactly the high-pressure regime where the ideal gas law starts to strain &mdash; the <strong>nozzle exit</strong> is the opposite.',
    equation: '\\frac{p(x)}{p_c} = \\left(1 + \\frac{\\gamma-1}{2}M(x)^2\\right)^{\\!\\frac{\\gamma}{1-\\gamma}}',
    terms: [
      { symbol: 'p<sub>c</sub>', definition: 'combustion chamber (stagnation) pressure' },
      { symbol: 'p(x)', definition: 'static pressure at a point in the nozzle' },
    ],
    items: [
      {
        title: 'Chamber pressure: tens to hundreds of atm',
        body: 'Typical liquid-fuel rocket combustion chambers run roughly 20–300 atm (a small hobby engine might sit near 20 atm; large engines like the Space Shuttle Main Engine or Raptor reach 200–300 atm). That is squarely the high-pressure regime where van der Waals corrections become non-negligible for the hot combustion gases.',
      },
      {
        title: 'Exit pressure: deliberately driven back down to ~1 atm',
        body: 'The diverging nozzle expands and accelerates the flow, dropping pressure as Mach number climbs. Nozzles are designed so the exit pressure matches the surrounding atmosphere at the design altitude — for a sea-level-optimized nozzle, that means p<sub>exit</sub> &asymp; 1 atm, even though p<sub>chamber</sub> might be 100&times; higher.',
      },
      {
        title: 'For comparison: turbofan jet engine combustor',
        body: 'A turbofan&rsquo;s combustion chamber sits right after the compressor, so its pressure is set by the engine&rsquo;s overall pressure ratio (OPR). A GE90 (Boeing 777) at take-off has OPR &asymp; 40, giving a combustor inlet pressure of roughly 40 atm — high, but an order of magnitude below a rocket chamber, since a turbofan compresses with rotating machinery rather than relying on the combustion itself to build pressure.',
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
        revealResult: true,
      },
      {
        label: 'Isothermal compressibility for an IDG',
        eq: '\\tau_T = \\frac{1}{\\rho}\\!\\left(\\frac{\\partial\\rho}{\\partial p}\\right)_{\\!T} '
          + '= \\frac{1}{\\rho}\\cdot\\frac{1}{RT} = \\frac{1}{p}',
        result: '\\tau_T = 4.93\\times 10^{-7}\\;\\mathrm{m^2/N}',
        revealResult: true,
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
    heading: 'Why the Specific Heats Climb With Temperature',
    intro:
      'For a perfect gas, <em>e</em> and <em>h</em> depend on temperature alone: e&nbsp;=&nbsp;e(T), h&nbsp;=&nbsp;h(T). The rate of change defines the specific heats &mdash; and that rate jumps each time a new <strong>degree of freedom</strong> wakes up.',
    defs: [
      { eq: '\\frac{de}{dT} = c_v', note: 'specific heat at constant volume' },
      { eq: '\\frac{dh}{dT} = c_p', note: 'specific heat at constant pressure' },
    ],
    bands: [
      { key: 'trans', name: 'Translation', sub: 'cv/R = 3/2 \u00b7 cp/R = 5/2 \u00b7 3 trans DOF',            tLo: 1,   tHi: 3 },
      { key: 'flat',  name: '+ Rotation',  sub: 'cv/R = 5/2 \u00b7 cp/R = 7/2 \u00b7 flat CPG plateau', tLo: 3,   tHi: 600 },
      { key: 'vib',   name: '+ Vibration', sub: 'cv/R \u2192 7/2 \u00b7 cp/R \u2192 9/2 by ~2000 K',               tLo: 600, tHi: 2000 },
    ],
    cpg:
      'From ~3&nbsp;K to ~600&nbsp;K, c<sub>v</sub> and c<sub>p</sub> sit on a flat plateau &mdash; <strong>c<sub>v</sub>/R = 5/2 and c<sub>p</sub>/R = 7/2</strong> for diatomic air &mdash; so treat them as constant. That is the <strong>Calorically Perfect Gas (CPG)</strong>, where almost all of our cycle analysis lives. Above ~600&nbsp;K vibration switches on and both climb (c<sub>p</sub>/R toward 9/2).',
  },

  // ── WHY cp > cv + RELATIONS ─────────────────────────────────────────────────
  {
    type: 'cpcv',
    sectionNumber: 'Section 2 — c\u209A vs c\u1D65',
    heading: 'Why c<sub>p</sub> Is Bigger Than c<sub>v</sub>',
    setup:
      '<strong>Specific heat</strong> is the amount of energy required to raise the temperature of <strong>1 kg of gas by 1 K</strong>. The question is: when we add heat, where does that energy go?',
    temperature:
      '<strong>Temperature is physical.</strong> It is a measure of the molecules&rsquo; random translational motion. A thermometer reads temperature because fast-moving molecules collide with its bulb and exchange energy with it.',
    pressure:
      '<strong>Pressure is different.</strong> Pressure is the net force per area from molecular impacts on a surface. Temperature depends on molecular kinetic energy; pressure depends on both that molecular motion and how many impacts happen per area.',
    work:
      'If volume is fixed, the added energy mostly increases random molecular motion, so temperature rises. If pressure is fixed, the gas must also expand and push the piston, so some energy becomes boundary work. That is why more heat is required for the same 1 K rise: <strong>c<sub>p</sub> &gt; c<sub>v</sub></strong>.',
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
        revealResult: true,
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
        revealResult: true,
      },
    ],
  },
]
