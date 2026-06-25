// ME 3470 · Unit 2 — Section 6 — Stagnation Properties
// Slide DATA only. Rendered by ../engine.jsx; assembled in ./index.js.
// Merged in from the standalone StagnationProperties deck and re-authored to the
// Unit 2 engine's slide-data format (section / equation / example).

export const stagnationSlides = [
  // ── SECTION BREAK: STAGNATION PROPERTIES ────────────────────────────────────
  {
    type: 'section',
    sectionNumber: 'Section 6',
    title: 'Stagnation Properties',
    subtitle: 'Isentropic relations &middot; total conditions &middot; Mach number',
  },

  // ── WHAT IS A STAGNATION PROPERTY? ──────────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Section 6 — Definition',
    heading: 'What Is a Stagnation Property?',
    equationLabel:
      'The hypothetical value a property would take if the flow were slowed '
      + '<em>adiabatically and isentropically</em> to V&nbsp;&rarr;&nbsp;0.',
    equation:
      '\\underbrace{V=V_\\infty,\\;T_1,\\;P_1}_{\\text{freestream}}'
      + '\\quad\\longrightarrow\\quad'
      + '\\underbrace{V=0,\\;T_0,\\;P_0}_{\\text{stagnation}}',
    items: [
      {
        title: 'Physical intuition',
        body:
          'Slow a high-kinetic-energy flow with <strong>no heat transfer</strong> and the '
          + 'kinetic energy has nowhere to go but into heating the gas &mdash; so the '
          + 'temperature rises to T<sub>0</sub> &gt; T<sub>1</sub>.',
      },
    ],
  },

  // ── ISENTROPIC STAGNATION RELATIONS ─────────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Section 6 — Total Conditions',
    heading: 'Isentropic Stagnation Relations',
    equationLabel:
      'Total and static states are linked by the isentropic relation across all three properties.',
    equation:
      '\\frac{T_0}{T_1} = \\left(\\frac{P_0}{P_1}\\right)^{\\!\\frac{\\gamma-1}{\\gamma}} '
      + '= \\left(\\frac{\\rho_0}{\\rho_1}\\right)^{\\gamma-1}',
    items: [
      {
        title: 'Notation',
        body:
          'Subscript <strong>0</strong> (or <strong>t</strong>, Fanno notation) both denote '
          + 'total / stagnation conditions.',
      },
    ],
  },

  // ── DERIVATION: ENERGY EQUATION → T0/T ──────────────────────────────────────
  {
    type: 'example',
    sectionNumber: 'Section 6 — Derivation',
    heading: 'From the Energy Equation to T<sub>0</sub>/T',
    scenario:
      'An adiabatic flow is brought to rest. Conserve energy between the freestream and the '
      + 'stagnation point (internal energy + kinetic energy = constant).',
    steps: [
      {
        label: 'Conservation of energy',
        eq: '\\dot{m}c_p T_1 + \\tfrac{1}{2}\\dot{m}V_1^2 = \\dot{m}c_p T_0 + \\tfrac{1}{2}\\dot{m}V_0^2',
      },
      {
        label: 'Divide through by the mass flow and c<sub>p</sub>',
        eq: 'T_1 + \\frac{V_1^2}{2c_p} = T_0 + \\frac{V_0^2}{2c_p}',
      },
      {
        label: 'At the stagnation point V<sub>0</sub> = 0',
        eq: '\\frac{T_0}{T_1} = 1 + \\frac{V_1^2}{2\\,c_p\\,T_1}',
        note: 'Only <strong>adiabatic</strong> flow is needed to define T<sub>0</sub> &mdash; '
          + 'no reversibility required yet.',
      },
    ],
  },

  // ── DERIVATION: MACH-NUMBER FORM ────────────────────────────────────────────
  {
    type: 'example',
    sectionNumber: 'Section 6 — Derivation',
    heading: 'Temperature Ratio in Terms of Mach Number',
    scenario:
      'Replace velocity with Mach number using c<sub>p</sub> = &gamma;R/(&gamma;&minus;1), '
      + 'a&sup2; = &gamma;RT, and M = u/a.',
    steps: [
      {
        label: 'Gas relations',
        eq: 'c_p = \\frac{\\gamma R}{\\gamma-1}, \\qquad a^2 = \\gamma R T',
      },
      {
        label: 'Mach number',
        eq: 'M = \\frac{u}{a} \\;\\Rightarrow\\; u^2 = M^2\\,\\gamma R T',
      },
      {
        label: 'Substitute into T<sub>0</sub>/T and simplify',
        eq: '\\frac{T_0}{T} = 1 + \\frac{(\\gamma-1)\\,M^2\\,\\gamma R T}{2\\,\\gamma R T}',
        result: '\\frac{T_0}{T} = 1 + \\frac{\\gamma-1}{2}M^2',
        question: 'This result needs only adiabatic flow. Which stagnation properties will demand more?',
      },
    ],
  },

  // ── PRESSURE & DENSITY RELATIONS ────────────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Section 6 — Full Set',
    heading: 'Isentropic Pressure &amp; Density Relations',
    equationLabel: 'The full stagnation set &mdash; all three driven by the same Mach factor.',
    equation:
      '\\frac{P_0}{P} = \\left(1 + \\frac{\\gamma-1}{2}M^2\\right)^{\\!\\frac{\\gamma}{\\gamma-1}} '
      + '\\qquad '
      + '\\frac{\\rho_0}{\\rho} = \\left(1 + \\frac{\\gamma-1}{2}M^2\\right)^{\\!\\frac{1}{\\gamma-1}}',
    items: [
      {
        title: 'Mind the restriction',
        body:
          'P<sub>0</sub> and &rho;<sub>0</sub> require <strong>isentropic</strong> flow (adiabatic '
          + '<em>and</em> reversible). T<sub>0</sub> needs only <strong>adiabatic</strong> &mdash; '
          + 'the least restrictive of the three.',
      },
    ],
  },

  // ── WORKED CASES: WHEN CAN WE USE THEM? ─────────────────────────────────────
  {
    type: 'example',
    sectionNumber: 'Section 6 — Worked Cases',
    heading: 'When Can We Use T<sub>0</sub>, P<sub>0</sub>, &rho;<sub>0</sub>?',
    scenario:
      'Three flows. For each, decide whether the total properties are <em>defined</em> '
      + 'and whether they are <em>conserved</em>.',
    steps: [
      {
        label: 'Duct with a resistance heater',
        note: 'Define T<sub>0</sub>? <strong>Yes.</strong> Use it? <strong>Yes.</strong> '
          + 'But T<sub>0,2</sub> = T<sub>0,1</sub>? <strong>No</strong> &mdash; heat is added.',
        eq: 'c_p T_{0,1} + q_{\\text{in}} = c_p T_{0,2}',
      },
      {
        label: 'Insulated subsonic nozzle',
        note: 'P<sub>0</sub> constant? <strong>Yes.</strong> Adiabatic with no shocks '
          + '&rArr; isentropic &rArr; P<sub>0</sub> is conserved.',
      },
      {
        label: 'Nozzle goes supersonic &mdash; shock present',
        note: 'P<sub>0</sub> constant? <strong>No.</strong> A shock is irreversible &rArr; '
          + '&Delta;s &gt; 0 &rArr; P<sub>0</sub> drops. T<sub>0</sub> is <strong>still conserved</strong> '
          + '(the shock is adiabatic).',
      },
    ],
  },
]
