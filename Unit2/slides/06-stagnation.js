// ME 3470 . Unit 2 - Section 6 - Stagnation Properties
// Slide DATA only. Rendered by ../engine.jsx; assembled in ./index.js.

export const stagnationSlides = [


  // ════════════════════════════════════════════════════════════════════════
  //  SECTION 6 — STAGNATION PROPERTIES
  //  Ported into Unit 2 format. Reuses existing renderers only:
  //  section / conserve / example / equation / soundspeed / poll / tps.
  //  No new renderers, no new CSS, no totalSteps() changes required.
  //  (Outline slide already lists "Stagnation properties" as item 6.)
  // ════════════════════════════════════════════════════════════════════════

  // ── SECTION BREAK ──────────────────────────────────────────────────────────
  {
    type: 'section',
    sectionNumber: 'Section 6',
    title: 'Stagnation Properties',
    subtitle: 'Total conditions, the energy equation, and when isentropic relations apply.',
  },

  // ── WHAT IS STAGNATION? (definition + two states + intuition) ──────────────
  {
    type: 'conserve',
    sectionNumber: 'Section 6 — Total Conditions',
    heading: 'Stagnation: Bring the Flow to Rest',
    intro:
      'The <strong>stagnation</strong> (total) value of a property is what it would become if the flow were slowed <em>adiabatically and isentropically</em> to V&nbsp;=&nbsp;0. Same streamline, two states:',
    columns: [
      {
        tag: '1', label: 'Static / Freestream', accent: '#5ec8d8',
        items: [
          { k: 'V = V&infin;', v: 'the moving flow as it actually is.' },
          { k: 'T, p, &rho;', v: 'static properties — what travels with the fluid.' },
        ],
      },
      {
        tag: '0', label: 'Stagnation', accent: '#f0a93b',
        items: [
          { k: 'V = 0', v: 'flow brought isentropically to rest.' },
          { k: 'T<sub>t</sub>, p<sub>t</sub>, &rho;<sub>t</sub>', v: 'total properties at that imagined rest state.' },
        ],
      },
    ],
    bridge:
      'Slow a high-speed flow with no heat and the kinetic energy has nowhere to go but into the gas, so <strong>T<sub>t</sub> &gt; T</strong>. Stagnation temperature is essentially what a probe facing into the flow reads.',
  },

  // ── ENERGY EQUATION DERIVATION (static <-> stagnation temperature) ─────────
  {
    type: 'example',
    sectionNumber: 'Section 6 — Energy Equation',
    heading: 'Static &harr; Stagnation Temperature',
    scenario:
      'Steady, <strong>adiabatic</strong> flow with no shaft work. Relate a moving state (1) to the state brought to rest (0).',
    steps: [
      {
        label: 'Conservation of energy: enthalpy + kinetic energy',
        eq: '\\dot{m}\\,c_p T_1 + \\tfrac{1}{2}\\dot{m}V_1^2 = \\dot{m}\\,c_p T_0 + \\tfrac{1}{2}\\dot{m}V_0^2',
        note: 'c<sub>p</sub>T is the <strong>enthalpy</strong> h &mdash; <em>not</em> internal energy (that would be c<sub>v</sub>T). Flow work is exactly why c<sub>p</sub>, not c<sub>v</sub>, appears here.',
      },
      {
        label: 'Divide through by &#7745;c<sub>p</sub>',
        eq: 'T_1 + \\frac{V_1^2}{2c_p} = T_0 + \\frac{V_0^2}{2c_p}',
      },
      {
        label: 'At the stagnation state, V<sub>0</sub> = 0',
        eq: '\\frac{T_0}{T_1} = 1 + \\frac{V_1^2}{2\\,c_p\\,T_1}',
        question: 'This gives T<sub>0</sub> &gt; T<sub>1</sub> whenever the flow moves. Does bringing the flow to rest <em>add</em> energy, or just <em>convert</em> it?',
      },
    ],
  },

  // ── MACH-NUMBER FORM ───────────────────────────────────────────────────────
  //  RELOCATED from Section 1. Bridges the V-form derived on the previous slide
  //  (T0/T1 = 1 + V1^2/2cpT1) to the M-form applied in the Stop-and-Solve below.
  //  Note for the presenter: T0 (previous slide) and T_t here are the same
  //  stagnation/total temperature — say so out loud when this slide appears.
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

  // ── STOP AND SOLVE: Stagnation conditions back in the reservoir ────────────
  {
    type: 'example',
    sectionNumber: 'Section 6 — Stop and Solve',
    heading: 'Back to Our Wind Tunnel: Find the Reservoir&rsquo;s Job',
    scenario:
      'Last section we found the test-section flow reaches <strong>M = 2.4</strong> at static T&nbsp;=&nbsp;200&nbsp;K. '
      + 'That static state has to come from <em>somewhere</em> — it is what our reservoir air becomes after expanding through the nozzle. '
      + '<strong>Your turn:</strong> using T<sub>t</sub>/T = 1 + [(γ&minus;1)/2]M², find the stagnation temperature the reservoir must supply to produce that test-section state. Then use the matching pressure relation to find the required reservoir (stagnation) pressure if the test section needs to run at <strong>p = 0.5 atm</strong>. Set up each calculation and solve before revealing.',
    steps: [
      {
        label: 'Step 1 — required reservoir (stagnation) temperature',
        eq: '\\frac{T_t}{T} = 1 + \\frac{\\gamma - 1}{2}M^2',
        note: 'Plug in γ = 1.4, M = 2.4, T = 200 K. Solve for T<sub>t</sub> before revealing.',
        result: 'T_t = 200\\left[1 + 0.2(2.4)^2\\right] = 200(2.152) = 430\\;\\mathrm{K}',
        revealResult: true,
        question: 'Does this match the &ldquo;heated to 600 K&rdquo; scenario from the speed-of-sound section, or would that reservoir overshoot what this test section needs?',
      },
      {
        label: 'Step 2 — required reservoir (stagnation) pressure',
        eq: '\\frac{p_t}{p} = \\left(1 + \\frac{\\gamma-1}{2}M^2\\right)^{\\!\\frac{\\gamma}{\\gamma-1}}',
        note: 'Use the same M = 2.4 and the bracket value [1 + 0.2(2.4)²] = 2.152 you already computed. Raise it to γ/(γ&minus;1) = 3.5, then multiply by the test-section static pressure p = 0.5 atm.',
        result: 'p_t = 0.5\\,(2.152)^{3.5} = 0.5(14.6) = 7.3\\;\\mathrm{atm}',
        revealResult: true,
        question: 'Notice p<sub>t</sub>/p grew far more than T<sub>t</sub>/T for the same M. Why is the pressure ratio so much more sensitive to Mach number than the temperature ratio?',
      },
    ],
  },

  // ── CLASS POLL: static vs stagnation in adiabatic acceleration ─────────────
  {
    type: 'poll',
    sectionNumber: 'Section 6 — Class Poll',
    question:
      'Air flows through an <em>adiabatic</em> duct (no heat, no work) and speeds up as the passage narrows. Which is correct?',
    choices: [
      { label: 'A', text: 'Both static and stagnation temperature stay constant — the flow is adiabatic.', correct: false },
      { label: 'B', text: 'Stagnation temperature stays constant; static temperature drops.', correct: true },
      { label: 'C', text: 'Static temperature stays constant; stagnation temperature rises.', correct: false },
      { label: 'D', text: 'Both rise, because the gas does work to accelerate itself.', correct: false },
    ],
    explanation:
      '<strong>B.</strong> With no heat and no work, stagnation enthalpy is conserved, so T<sub>t</sub> = T + V&sup2;/2c<sub>p</sub> stays constant. As V increases, the <em>static</em> temperature T must fall to keep that sum fixed — the kinetic energy is drawn from the gas&rsquo;s own thermal energy. <strong>A</strong> is the classic error: &ldquo;adiabatic&rdquo; pins the <em>stagnation</em> temperature, not the static one. <strong>C</strong> and <strong>D</strong> reverse the energy bookkeeping — stagnation temperature cannot rise without heat or work.',
  },

  // ── PRESSURE & DENSITY + THE RESTRICTION ───────────────────────────────────
  {
    type: 'soundspeed',
    sectionNumber: 'Section 6 — Full Stagnation Set',
    heading: 'Pressure &amp; Density, and What They Require',
    intro:
      'With the temperature ratio in hand, the isentropic relations deliver pressure and density too &mdash; but they carry a stricter condition than temperature does.',
    equation: '\\frac{p_t}{p} = \\left(1 + \\frac{\\gamma-1}{2}M^2\\right)^{\\!\\frac{\\gamma}{\\gamma-1}} \\qquad \\frac{\\rho_t}{\\rho} = \\left(1 + \\frac{\\gamma-1}{2}M^2\\right)^{\\!\\gamma}',
    equationLabel: 'Isentropic stagnation relations',
    terms: [
      { sym: '\\frac{p_t}{p}', def: 'stagnation (total) pressure ratio' },
      { sym: '\\frac{\\rho_t}{\\rho}', def: 'stagnation (total) density ratio' },
    ],
    cards: [
      { k: 'p<sub>t</sub> and &rho;<sub>t</sub> need <em>isentropic</em>', v: 'adiabatic <strong>and</strong> reversible — both conditions must hold.' },
      { k: 'T<sub>t</sub> needs only <em>adiabatic</em>', v: 'no heat or work; reversibility not required. Strictly less restrictive.' },
    ],
    bridge:
      'That split &mdash; isentropic for p<sub>t</sub> and &rho;<sub>t</sub>, merely adiabatic for T<sub>t</sub> &mdash; is the crux of the topic. Let&rsquo;s test it.',
  },

  // ── StagnationQuestions.jsx integrated: p_t poll + T_t poll + define/conserve TPS ──
  // ── CLASS POLL: isentropic flow conserves p_t ──────────────────────────────
  {
    type: 'poll',
    sectionNumber: 'Section 6 — Class Poll',
    question:
      'A gas accelerates through an insulated, frictionless nozzle (an <em>isentropic</em> flow). As the Mach number rises from 0.3 to 0.9, what happens to the <em>stagnation</em> pressure p<sub>t</sub>?',
    choices: [
      { label: 'A', text: 'p<sub>t</sub> rises — the faster flow carries more total pressure.', correct: false },
      { label: 'B', text: 'p<sub>t</sub> stays constant.', correct: true },
      { label: 'C', text: 'p<sub>t</sub> falls — some pressure is spent accelerating the flow.', correct: false },
      { label: 'D', text: 'p<sub>t</sub> can&rsquo;t be found without knowing the area ratio.', correct: false },
    ],
    explanation:
      '<strong>B.</strong> The flow is isentropic — adiabatic <em>and</em> reversible — so stagnation pressure is conserved at every station, regardless of the area change. What drops is the <em>static</em> pressure p, because p<sub>t</sub>/p = [1 + (&gamma;&minus;1)/2 &middot; M&sup2;]<sup>&gamma;/(&gamma;&minus;1)</sup> grows with M. <strong>C</strong> mistakes that falling static pressure for the constant total pressure; <strong>A</strong> treats total pressure as if speed adds to it (there is no loss and no work to change p<sub>t</sub>); <strong>D</strong> assumes geometry sets p<sub>t</sub>, but in loss-free flow p<sub>t</sub> is simply carried through unchanged. A constant p<sub>t</sub> is the signature of isentropic flow — and the first thing to break once irreversibilities show up later.',
  },

  // ── WHEN CAN WE USE Tt, pt, rho_t? (heated duct vs insulated nozzle) ───────
  {
    type: 'example',
    sectionNumber: 'Section 6 — Applying the Conditions',
    heading: 'When Can We Use T<sub>t</sub>, p<sub>t</sub>, &rho;<sub>t</sub>?',
    scenario:
      'For each device, ask two separate questions: can you <em>define</em> the stagnation property, and is it <em>conserved</em> from inlet to exit?',
    steps: [
      {
        label: 'Duct with a resistance heater',
        note: '<strong>Define T<sub>t</sub>?</strong> Yes — it is a local property, definable at any point. <strong>Conserved?</strong> No — heat is added, so c<sub>p</sub>T<sub>t1</sub> + q<sub>in</sub> = c<sub>p</sub>T<sub>t2</sub> and T<sub>t</sub> rises.',
        question: 'You can still write p<sub>t</sub>/p at each station. So why is p<sub>t</sub> at the exit not equal to p<sub>t</sub> at the inlet?',
      },
      {
        label: 'Insulated subsonic nozzle (no shocks, no friction)',
        note: 'Adiabatic <strong>and</strong> reversible &rArr; <strong>isentropic</strong>. So T<sub>t</sub>, p<sub>t</sub>, and &rho;<sub>t</sub> are <strong>all conserved</strong> inlet to exit.',
        question: 'What single condition does this nozzle meet that the heater breaks?',
      },
    ],
  },

  // ── THINK · PAIR · SHARE: define vs conserve ───────────────────────────────
  {
    type: 'tps',
    sectionNumber: 'Section 6 — Think · Pair · Share',
    question:
      'Two flows: <strong>(1)</strong> an insulated converging nozzle, and <strong>(2)</strong> a duct with an electric resistance heater. For <em>each</em>: (i) can you <em>define</em> a stagnation temperature T<sub>t</sub> at the exit? (ii) is T<sub>t</sub> <em>conserved</em> from inlet to exit?',
    think: { minutes: 3, prompt: 'Work alone. Decide yes/no for <em>define</em> and for <em>conserve</em> in each case. Hint: defining T<sub>t</sub> just asks &ldquo;what would T be if I brought this flow to rest adiabatically?&rdquo; — when can you always ask that?' },
    pair:  { minutes: 3, prompt: 'Compare with your neighbour. Pin down the single condition that controls whether T<sub>t</sub> is <em>conserved</em> — and why it has nothing to do with whether you can <em>define</em> T<sub>t</sub>.' },
    share: { prompt: 'Report back: which case conserves T<sub>t</sub>, and why the other one still lets you define it.' },
    answer: 'c_p T_{t1} + q_{\\text{in}} = c_p T_{t2} \\;\\Rightarrow\\; T_{t2} > T_{t1}',
    answerNote:
      'You can <em>always</em> define T<sub>t</sub> at any point in any flow — it is a local property. T<sub>t</sub> is <em>conserved</em> only when the flow is adiabatic with no work. <strong>Nozzle (1):</strong> insulated, no work &rArr; T<sub>t2</sub> = T<sub>t1</sub>. <strong>Heater (2):</strong> T<sub>t</sub> is still perfectly well-defined everywhere, but <em>not</em> conserved — the added heat raises it. Defining is a <em>local</em> question; conserving is a <em>process</em> question. (And note p<sub>t</sub> is stricter still: it needs reversibility, not just adiabatic.)',
  },

  // ── CLOSING: WHAT YOU CAN NOW SOLVE ─────────────────────────────────────────
  {
    type: 'conserve',
    sectionNumber: 'Unit 2 — Wrap-Up',
    heading: 'What You Can Now Solve',
    intro:
      'Between compressibility, the equation of state, conservation laws, speed of sound, and stagnation properties, you now have everything needed for two classic problem types &mdash; and not yet enough for a third.',
    columns: [
      {
        tag: '\u2713', label: 'Ready Today', accent: '#5ec8d8',
        items: [
          { k: 'Anderson-style diffuser problems', v: 'Given M, p, T, A at the inlet (and a stagnation pressure ratio across the device), find mass flow rate, exit Mach number, and static pressure recovery &mdash; e.g. <strong>Problem 2.31, parts (a)&ndash;(c)</strong>.' },
          { k: 'Stagnation-data nozzle/diffuser problems', v: 'Given M<sub>1</sub>, M<sub>2</sub>, p<sub>t1</sub>, p<sub>t2</sub>, T<sub>t1</sub>, T<sub>t2</sub>, c<sub>p</sub>, and &gamma; at both stations, relate static and stagnation conditions &mdash; e.g. <strong>Problem 2.45</strong> (the version with full stagnation data given at both stations).' },
        ],
      },
      {
        tag: '\u2717', label: 'Not Yet', accent: '#f0a93b',
        items: [
          { k: 'Full momentum / impulse force-balance problems', v: 'Computing the axial force a fluid exerts on slanted or variable-area walls (e.g. <strong>2.31(d)</strong>, or the axial-force-on-a-component version of 2.45) needs a careful pressure-and-momentum control-volume treatment we have not yet worked through &mdash; that is coming in a later unit.' },
          { k: 'Heat-addition (Rayleigh-flow) problems', v: 'Problems with heat added along a constant-area duct (e.g. <strong>Problem 2.54</strong>) require Rayleigh-flow relations we have not covered. Skip these for now.' },
        ],
      },
    ],
    bridge:
      'Use this as your homework filter: if a problem gives you Mach number, pressure, and temperature at two stations and asks for the other one, you are ready. If it asks for a force on a wall or involves heat addition along the duct, hold off.',
  },
]
