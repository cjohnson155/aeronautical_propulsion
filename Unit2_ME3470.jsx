import { useState, useEffect, useCallback, useRef } from 'react'
import katex from 'katex'

// ─────────────────────────────────────────────────────────────────────────────
//  ME 3470 · Unit 2 — Compressible Flow (CANONICAL, CONSOLIDATED DECK)
//  Plugs into the same Presentation system as Unit 1.
//
//  This file now holds ALL of Unit 2 in lecture order. It merges:
//    • Section 1 (formerly Unit2slides.jsx) — intro + thrust/density connection
//    • Section 2 (this file's original content) — IDG, energy storage, cp/cv
//    • Sections 4 & 5 (NEW, from handwritten notes pp.12–14 + V-vs-a page) —
//      conservation principles, the conservation laws, speed of sound, shocks
//  Unit2slides.jsx and CompressibleFlowPresentation.jsx are now ARCHIVED and
//  superseded by this file (see App.jsx wiring).
//
//  Slide types:
//    'outline'     – Unit 2 lecture outline (six movements)
//    'compress'    – Section 1 intro: definition + compressibility eqn + CV/piston SVGs
//    'thrust'      – why a density error wrecks thrust (no ρ in the thrust eqn)
//    'idg'         – worked IDG density example + heat-addition lead-in to cp/cv
//    'energymodes' – four energy-storage modes as ANIMATED diatomic molecules
//    'dof'         – cp/R-vs-T step graph (3/2 → 5/2 plateau → 7/2)
//    'cpcv'        – why cp > cv (animated piston) + PG/CPG relations
//    'conserve'    – NEW: control mass vs. control volume (card style)
//    'conslaws'    – NEW: mass / momentum / energy conservation laws (card style)
//    'soundspeed'  – NEW: speed of sound a = √(γRT), what each term means (card style)
//    'shockform'   – NEW: V vs. a — can molecules get out of the way? shocks (card style)
//
//  Equations are real LaTeX via KaTeX. Animations are pure CSS keyframes on
//  inline SVG. Respects prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────────────────────

export const meta = {
  courseId:  'ME 3470',
  deckTitle: 'Unit 2 — Compressible Flow · Intro → Energy Storage → Conservation → Speed of Sound',
}

export const slides = [

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

  // ── PATH DEPENDENCE vs STATE VARIABLES (merged from ThermodynamicsPresentation) ─
  {
    type: '__path',
  },

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
      'Same vessel (V = 10 m³, <strong>m = 234.6 kg</strong>) is heated from '
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
        question: 'Note c<sub>p</sub> − R = c<sub>v</sub>: both Gibbs forms give the same result. Why must they?',
      },
      {
        label: 'Total entropy change',
        eq: '\\Delta S = m\\,\\Delta s = (234.6)(497.3)',
        result: '\\Delta S = 1.167\\times 10^5\\;\\mathrm{J/K}',
      },
    ],
  },

  // ── NEW · SECTION 5: SPEED OF SOUND ─────────────────────────────────────────
  {
    type: 'soundspeed',
    sectionNumber: 'Section 5 — Speed of Sound',
    heading: 'How the Gas Talks to Itself',
    intro:
      'How does one part of the gas know what is happening elsewhere? Information travels by <strong>collisions</strong>. A pressure wave is an infinitesimal compression then expansion — a <em>sound wave</em>. The wave itself is the pattern; collisions are the medium.',
    equation: 'a = \\sqrt{\\left(\\frac{\\partial p}{\\partial \\rho}\\right)_s} \\;=\\; \\sqrt{\\gamma R T}',
    equationLabel: 'Sound travels at the average molecular speed',
    terms: [
      { sym: 'a',        def: 'Speed at which mechanical information propagates' },
      { sym: '\\gamma',  def: 'How temperature is stored — bonds vs. translation' },
      { sym: 'R = \\tfrac{\\mathcal{R}}{MW}', def: 'Gas “size”: bigger, heavier molecules → slower sound' },
      { sym: 'T',        def: 'How fast the molecules’ random motion is' },
    ],
    cards: [
      { k: 'It depends on T, not bulk velocity', v: 'Random thermal motion is set by temperature, so a depends on T — independent of how fast the flow as a whole is moving.' },
      { k: 'γ can match across weights',          v: 'Diatomic molecules of different mass can share the same γ; molecular weight enters only through R.' },
    ],
    bridge:
      'So <strong>a</strong> sets the speed limit for “get out of the way” messages. What happens when the flow outruns that limit?',
  },

  // ── WORKED EXAMPLE: ACOUSTIC TRAVERSE (Anderson MCF Ex. 2 — Parts e, f) ─────
  {
    type: 'example',
    sectionNumber: 'Section 5 — Worked Example',
    heading: 'Acoustic Traverse: Air vs. Helium',
    scenario:
      'The vessel (V = 10 m³) has been heated to <strong>T = 600 K.</strong> '
      + 'Assume spherical geometry. How long does an acoustic wave take to cross it? '
      + 'How does helium compare to air at the same conditions?',
    steps: [
      {
        label: 'Find vessel diameter (spherical)',
        eq: 'V = \\tfrac{4}{3}\\pi r^3 '
          + '\\;\\Rightarrow\\; r = \\!\\left(\\frac{3V}{4\\pi}\\right)^{\\!1/3} '
          + '= \\!\\left(\\frac{30}{4\\pi}\\right)^{\\!1/3} = 1.337\\;\\mathrm{m}',
        result: 'D = 2r = 2.673\\;\\mathrm{m}',
        question: 'The geometry affects the distance, not the wave speed. '
          + 'Would a cylindrical vessel of the same volume give a longer or shorter traverse?',
      },
      {
        label: 'Speed of sound in air at 600 K',
        eq: 'a = \\sqrt{\\gamma RT} = \\sqrt{(1.4)(287)(600)}',
        result: 'a_{\\text{air}} = 491.0\\;\\mathrm{m/s}',
        question: 'At 300 K: a ≈ 347 m/s. The ratio 491/347 ≈ √2. Why? (a ∝ √T)',
      },
      {
        label: 'Traverse time for air',
        eq: 't = \\frac{D}{a} = \\frac{2.673}{491.0}',
        result: 't_{\\text{air}} = 5.44\\times 10^{-3}\\;\\mathrm{s}',
      },
      {
        label: 'Helium at same T — higher γ, much larger R',
        eq: 'R_{\\text{He}} = \\frac{8314}{4} = 2078.5\\;\\mathrm{J/(kg\\cdot K)}, '
          + '\\quad \\gamma_{\\text{He}} = \\tfrac{5}{3} = 1.667',
        note: 'a<sub>He</sub> = &radic;(1.667 &times; 2078.5 &times; 600) = 1442 m/s'
          + '&emsp;&rarr;&emsp;t<sub>He</sub> = 2.673 / 1442',
        result: 't_{\\text{He}} = 1.85\\times 10^{-3}\\;\\mathrm{s}',
        question: 'Helium is ~3× faster. Separate the two effects: '
          + 'what fraction of the speedup comes from the larger R, and what from the larger γ?',
      },
    ],
  },

  // ── NEW · SECTION 5: V vs a — SHOCK FORMATION ───────────────────────────────
  {
    type: 'shockform',
    sectionNumber: 'Section 5 — V vs. a',
    heading: 'Can the Molecules Get Out of the Way?',
    intro:
      'The core question: how fast is the <strong>bulk velocity V</strong> compared to the speed of the collision wave <strong>a</strong>? That single ratio — the Mach number — decides whether the flow stays smooth or slams into a shock.',
    regimes: [
      {
        tag: 'M < 1', label: 'Subsonic', accent: '#5ec8d8',
        head: 'Molecules collide faster than the flow moves',
        body: 'Information outruns the body. Molecules are told to “get out of the way” before it arrives, so the flow parts smoothly around it.',
      },
      {
        tag: 'M > 1', label: 'Supersonic', accent: '#f0a93b',
        head: 'The flow outruns the collisions',
        body: 'Molecules cannot respond in time — they “couldn’t move out of the way quick enough and get slammed.” Disturbances pile up all at once into a <strong>shock</strong>: a compression wave.',
      },
    ],
    closer: 'a also measures how quickly the collisions can respond to a change in density (a compression). When the flow is faster than that response, the response can’t keep up — and you get a shock.',
  },

]

// ─── KaTeX renderer ──────────────────────────────────────────────────────────
function Equation({ latex, display = true }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    try {
      katex.render(latex, ref.current, { displayMode: display, throwOnError: false })
    } catch (e) {
      ref.current.textContent = latex
    }
  }, [latex, display])
  return <span ref={ref} />
}

// ─── HTML-safe span (for <sub>, <sup>, <em>, <strong>, <br>) ─────────────────
function HTML({ children, className }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: children }} />
}

// ─── DRAWING 1 + 2: Control-volume boxes under pressure P ────────────────────
function CVDiagram({ label, pressureLabel, size = 'large', accent }) {
  const half = size === 'large' ? 34 : 22
  const cx = 100, cy = 90
  const x0 = cx - half, x1 = cx + half, y0 = cy - half, y1 = cy + half
  const len = size === 'large' ? 14 : 30
  const gap = 4
  const offs = [-half * 0.55, 0, half * 0.55]
  return (
    <svg viewBox="0 0 200 180" className="cv-svg" aria-hidden>
      {pressureLabel && (
        <text x="100" y="14" textAnchor="middle" className="cv-text">{pressureLabel}</text>
      )}
      <rect x={x0} y={y0} width={half * 2} height={half * 2} className="cv-box" />
      <text x={cx} y={cy + 5} textAnchor="middle" className="cv-text cv-text--lg">{label}</text>
      {offs.map((o, i) => (
        <g key={i}>
          <Arrow x1={cx + o} y1={y0 - gap - len} x2={cx + o} y2={y0 - gap} accent={accent} />
          <Arrow x1={cx + o} y1={y1 + gap + len} x2={cx + o} y2={y1 + gap} accent={accent} />
          <Arrow x1={x0 - gap - len} y1={cy + o} x2={x0 - gap} y2={cy + o} accent={accent} />
          <Arrow x1={x1 + gap + len} y1={cy + o} x2={x1 + gap} y2={cy + o} accent={accent} />
        </g>
      ))}
    </svg>
  )
}

// ─── DRAWING 3 + 4: Animated piston compression ──────────────────────────────
function PistonDiagram({ topLabel, midLabel, processLabel, qLabel, insulated, accent }) {
  const [run, setRun] = useState(0)
  const replay = () => setRun(r => r + 1)
  return (
    <svg
      viewBox="0 0 140 210" className="cv-svg piston-svg" aria-hidden
      onMouseEnter={replay} onClick={(e) => { e.stopPropagation(); replay() }}
    >
      <g key={run} className="piston-anim">
        <text x="70" y="12" textAnchor="middle" className="cv-text cv-text--sm">{topLabel}</text>
        <line x1="70" y1="16" x2="70" y2="30" className="press-arrow" />
        {insulated ? (
          <g className="cyl-wall cyl-wall--ins">
            <path d="M 42 38 L 42 185 L 98 185 L 98 38" fill="none" />
            <path d="M 38 38 L 38 189 L 102 189 L 102 38" fill="none" className="ins-outline" />
            {[50, 70, 90, 110, 130, 150, 170].map((y, i) => (
              <line key={i} x1="38" y1={y} x2="42" y2={y - 6} className="ins-hatch" />
            ))}
            {[50, 70, 90, 110, 130, 150, 170].map((y, i) => (
              <line key={`r${i}`} x1="98" y1={y} x2="102" y2={y - 6} className="ins-hatch" />
            ))}
          </g>
        ) : (
          <g className="cyl-wall">
            <path d="M 42 38 L 42 185 L 98 185 L 98 38" fill="none" />
          </g>
        )}
        <rect className="gas" x="43" y="62" width="54" height="122" />
        <g className="piston">
          <rect x="40" y="50" width="60" height="10" className="piston-head" />
          <line x1="70" y1="40" x2="70" y2="50" className="piston-rod" />
        </g>
        <text x="70" y="125" textAnchor="middle" className="cv-text gas-label">{midLabel}</text>
        {!insulated && (
          <g className="heat-out">
            <Arrow x1="42" y1="165" x2="14" y2="178" accent={accent} />
          </g>
        )}
        {qLabel && (
          <text x={insulated ? 6 : 2} y="200" className="cv-text cv-text--sm">{qLabel}</text>
        )}
        <text x="70" y="200" textAnchor="middle" className="cv-text cv-text--sm">{processLabel}</text>
      </g>
    </svg>
  )
}

function Arrow({ x1, y1, x2, y2, accent }) {
  const id = `ah-${Math.round(x1)}-${Math.round(y1)}-${Math.round(x2)}-${Math.round(y2)}`
  return (
    <g>
      <defs>
        <marker id={id} markerWidth="7" markerHeight="7" refX="5.5" refY="3"
          orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L6,3 L0,6 Z" fill={accent} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={accent} strokeWidth="1.4" markerEnd={`url(#${id})`} />
    </g>
  )
}

// ─── Animated molecular-motion diagrams ──────────────────────────────────────
//  Diatomic "dumbbell" animated per mode; replays on hover/click.
//    translational — rigid body drifts along its direction arrow
//    rotational    — whole molecule spins about its center
//    vibrational   — atoms oscillate; the spring scales about center so its
//                    ends stay glued to the moving atoms (true stretch)
//    electronic    — single atom; an electron hops between orbitals
function MotionDiagram({ kind, accent, accent2 }) {
  const [run, setRun] = useState(0)
  const replay = () => setRun(r => r + 1)
  return (
    <svg
      viewBox="0 0 200 120" className="em-svg" aria-hidden
      onMouseEnter={replay} onClick={(e) => { e.stopPropagation(); replay() }}
    >
      <g key={run} className={`em-anim em-${kind}`}>
        {kind === 'translational' && (
          <>
            <g className="em-body">
              <line x1="78" y1="60" x2="122" y2="60" className="em-bond" />
              <circle cx="78"  cy="60" r="15" className="em-atom" />
              <circle cx="122" cy="60" r="15" className="em-atom" />
            </g>
            <line x1="150" y1="60" x2="186" y2="60" stroke={accent} strokeWidth="2"
                  markerEnd="url(#em-arrow)" />
          </>
        )}
        {kind === 'rotational' && (
          <g className="em-spin">
            <line x1="70" y1="60" x2="130" y2="60" className="em-bond" />
            <circle cx="70"  cy="60" r="15" className="em-atom" />
            <circle cx="130" cy="60" r="15" className="em-atom" />
            <circle cx="100" cy="60" r="2" fill={accent2} />
          </g>
        )}
        {kind === 'vibrational' && (
          <>
            {/* spring spans the gap; scales about its center so its ends stay
                glued to the atoms as they move in/out (true stretch/compress) */}
            <g className="em-coil">
              <polyline className="em-spring"
                points="93,60 96,52 100,68 104,52 108,68 112,52 116,68 120,52 124,68 128,52 132,68 136,60" />
            </g>
            <g className="em-left">
              <circle cx="78" cy="60" r="15" className="em-atom" />
            </g>
            <g className="em-right">
              <circle cx="148" cy="60" r="15" className="em-atom" />
            </g>
          </>
        )}
        {kind === 'electronic' && (
          <g className="em-electronic">
            <circle cx="100" cy="60" r="14" className="em-atom" />
            <ellipse cx="100" cy="60" rx="30" ry="14" className="em-orbit" />
            <ellipse cx="100" cy="60" rx="52" ry="26" className="em-orbit em-orbit--outer" />
            <circle className="em-electron" r="4" fill={accent2} />
          </g>
        )}
        <defs>
          <marker id="em-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3"
                  orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" fill={accent} />
          </marker>
        </defs>
      </g>
    </svg>
  )
}

// ─── Animated cp/R step curve ─────────────────────────────────────────────────
function StepGraph({ lit, accent, accent2, ink, muted }) {
  const X0 = 56, X1 = 360, Y0 = 26, Y1 = 196
  const tx = { t1: 78, t3: 118, t600: 224, t2000: 320 }
  // map a cp/R value (1.5, 2.5, 3.5) to a y pixel
  const Y_AT = 1.2, Y_TOP = 4.0
  const yOf = (v) => Y1 - ((v - Y_AT) / (Y_TOP - Y_AT)) * (Y1 - Y0)
  const y32 = yOf(1.5)   // 3/2 — translation only
  const y52 = yOf(2.5)   // 5/2 — + rotation (flat CPG plateau)
  const y72 = yOf(3.5)   // 7/2 — + vibration (approached near 2000 K)

  // curve: 3/2 baseline → step to 5/2 near 3K → FLAT 3K→600K → climb 600K→2000K → 7/2
  const d = [
    `M ${X0} ${y32}`,
    `L ${tx.t1} ${y32}`,
    `C ${tx.t1+10} ${y32} ${tx.t3-12} ${y52} ${tx.t3} ${y52}`,
    `L ${tx.t600} ${y52}`,
    `C ${tx.t600+30} ${y52} ${tx.t2000-40} ${y72} ${tx.t2000} ${y72}`,
    `L ${X1} ${y72 - 6}`,
  ].join(' ')

  const pathRef = useRef(null)
  const [len, setLen] = useState(600)
  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength())
  }, [])

  const bands = [
    { x: tx.t1,   w: tx.t3 - tx.t1,    fill: accent,  on: lit > 0 }, // translation onset (→3/2)
    { x: tx.t3,   w: tx.t600 - tx.t3,  fill: accent2, on: lit > 1 }, // rotation / CPG flat (5/2)
    { x: tx.t600, w: tx.t2000-tx.t600, fill: accent,  on: lit > 2 }, // vibration climb (→7/2)
    { x: tx.t2000,w: X1 - tx.t2000,    fill: accent,  on: lit > 3 }, // beyond 2000K
  ]

  return (
    <svg viewBox="0 0 380 230" className="dof-svg" aria-hidden>
      {bands.map((b, i) => (
        <rect key={i} x={b.x} y={Y0} width={b.w} height={Y1 - Y0}
          fill={b.fill} className={`dof-band${b.on ? ' on' : ''}`} />
      ))}

      <line x1={X0} y1={Y0} x2={X0} y2={Y1} stroke={muted} strokeWidth="1" />
      <line x1={X0} y1={Y1} x2={X1} y2={Y1} stroke={muted} strokeWidth="1" />
      <text x={X0 - 30} y={Y0 - 8} textAnchor="start" className="dof-axis">c&#8345;/R</text>
      <text x={X1} y={Y1 + 16} textAnchor="end" className="dof-axis">T</text>

      {/* y-axis level markers: 3/2, 5/2, 7/2 with dashed guide lines */}
      {[['7/2', y72], ['5/2', y52], ['3/2', y32]].map(([lbl, y], i) => (
        <g key={i}>
          <line x1={X0} y1={y} x2={X1} y2={y} stroke={muted} strokeWidth="0.5"
            strokeDasharray="2 5" opacity="0.45" />
          <text x={X0 - 8} y={y + 4} textAnchor="end" className="dof-ymark">{lbl}</text>
        </g>
      ))}

      {/* x ticks */}
      {[['1K', tx.t1], ['3K', tx.t3], ['600K', tx.t600], ['2000K', tx.t2000]].map(([lbl, x], i) => (
        <g key={i}>
          <line x1={x} y1={Y0} x2={x} y2={Y1} stroke={muted} strokeWidth="0.5"
            strokeDasharray="2 4" opacity="0.5" />
          <text x={x} y={Y1 + 16} textAnchor="middle" className="dof-tick">{lbl}</text>
        </g>
      ))}

      <path ref={pathRef} d={d} fill="none" stroke={ink} strokeWidth="2.4"
        strokeLinejoin="round" strokeLinecap="round"
        className="dof-curve"
        style={{ strokeDasharray: len, strokeDashoffset: 0 }} />
    </svg>
  )
}

// ─── Animated piston pair (const V vs const P) ───────────────────────────────
function PistonPair({ accent, accent2, ink, muted }) {
  const [run, setRun] = useState(0)
  const replay = () => setRun(r => r + 1)
  return (
    <svg viewBox="0 0 300 190" className="cpcv-svg" aria-hidden
      onMouseEnter={replay} onClick={(e) => { e.stopPropagation(); replay() }}>
      <g key={run}>
        {/* constant volume: sealed rigid box, piston cannot move */}
        <g>
          <rect x="34" y="48" width="86" height="96" fill="rgba(94,200,216,.07)"
            stroke={ink} strokeWidth="2.4" />
          <text x="77" y="170" textAnchor="middle" className="cpcv-cap">Constant V</text>
          <line x1="6" y1="120" x2="32" y2="110" stroke={accent} strokeWidth="2"
            markerEnd="url(#cp-arrow)" />
          <text x="2" y="138" className="cpcv-q">q&#8336;&#8345;</text>
          <g className="cv-shimmer">
            <circle cx="60" cy="115" r="3" fill={accent} />
            <circle cx="86" cy="100" r="3" fill={accent} />
            <circle cx="95" cy="125" r="3" fill={accent} />
          </g>
        </g>

        {/* constant pressure: free piston rises against load */}
        <g>
          <path d="M 196 40 L 196 144 L 268 144 L 268 40" fill="rgba(94,200,216,.07)"
            stroke={ink} strokeWidth="2.4" />
          {[206, 220, 234, 248, 258].map((x, i) => (
            <line key={i} x1={x} y1="20" x2={x} y2="34" stroke={accent} strokeWidth="1.4"
              markerEnd="url(#cp-load)" />
          ))}
          <text x="232" y="14" textAnchor="middle" className="cpcv-cap">P = const</text>
          <g className="cp-piston">
            <rect x="196" y="60" width="72" height="9" fill={muted} stroke={ink} strokeWidth="1" />
          </g>
          <rect className="cp-gas" x="197" y="70" width="70" height="74"
            fill="rgba(94,200,216,.16)" stroke={accent} strokeWidth="0.8" />
          <text x="232" y="170" textAnchor="middle" className="cpcv-cap">Constant P</text>
          <line x1="168" y1="125" x2="194" y2="118" stroke={accent} strokeWidth="2"
            markerEnd="url(#cp-arrow)" />
          <text x="150" y="142" className="cpcv-q">q&#8336;&#8345;</text>
        </g>

        <defs>
          <marker id="cp-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3"
            orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" fill={accent} />
          </marker>
          <marker id="cp-load" markerWidth="8" markerHeight="8" refX="5" refY="3"
            orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" fill={accent} />
          </marker>
        </defs>
      </g>
    </svg>
  )
}

// ─── Slide renderers ─────────────────────────────────────────────────────────
function IdgSlide({ slide, revealed }) {
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">{slide.sectionNumber}</div>
      <h2 className="slide-heading anim-in"><HTML>{slide.heading}</HTML></h2>
      <div className="heading-rule anim-in" />

      <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
        <p className="cf-note cf-note--lead"><HTML>{slide.prompt}</HTML></p>
      </div>

      <div className={`reveal-block eq-row${revealed > 1 ? ' revealed' : ''}`}>
        <div className="eq-box"><Equation latex={slide.equation} /></div>
        <div className="eq-aside"><Equation latex={slide.rconst} display={false} /></div>
      </div>

      <div className={`reveal-block case-row${revealed > 2 ? ' revealed' : ''}`}>
        {slide.cases.map((c, i) => (
          <div className="case-card" key={i}>
            <div className="case-label">{c.label}</div>
            <div className="case-givens"><Equation latex={c.givens} display={false} /></div>
            <div className="case-result"><Equation latex={c.result} display={false} /></div>
          </div>
        ))}
      </div>

      <div className={`reveal-block${revealed > 3 ? ' revealed' : ''}`}>
        <p className="cf-note"><HTML>{slide.takeaway}</HTML></p>
      </div>

      <div className={`reveal-block${revealed > 4 ? ' revealed' : ''}`}>
        <p className="cf-bridge"><HTML>{slide.bridge}</HTML></p>
      </div>
    </div>
  )
}

function EnergyModesSlide({ slide, revealed }) {
  const accent  = '#5ec8d8'
  const accent2 = '#f0a93b'
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">{slide.sectionNumber}</div>
      <h2 className="slide-heading anim-in"><HTML>{slide.heading}</HTML></h2>
      <div className="heading-rule anim-in" />

      <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
        <p className="cf-note cf-note--lead"><HTML>{slide.intro}</HTML></p>
      </div>

      <div className="em-row">
        {slide.modes.map((m, i) => (
          <figure key={i} className={`em-fig${i < revealed - 1 ? ' revealed' : ''}`}>
            <div className="em-mode-title">{m.title}</div>
            <MotionDiagram kind={m.kind} accent={accent} accent2={accent2} />
            <div className="em-formula"><Equation latex={m.formula} display={false} /></div>
            <figcaption><HTML>{m.note}</HTML></figcaption>
          </figure>
        ))}
      </div>

      <div className={`reveal-block em-payoff${revealed > 5 ? ' revealed' : ''}`}>
        <svg viewBox="0 0 120 60" className="em-mono" aria-hidden>
          <circle cx="36" cy="30" r="15" className="em-atom" />
          <line x1="58" y1="30" x2="104" y2="30" stroke={accent} strokeWidth="2"
                markerEnd="url(#mono-arrow)" />
          <defs>
            <marker id="mono-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3"
                    orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L6,3 L0,6 Z" fill={accent} />
            </marker>
          </defs>
        </svg>
        <p className="cf-note"><HTML>{slide.payoff}</HTML></p>
      </div>

      <div className={`reveal-block${revealed > 6 ? ' revealed' : ''}`}>
        <p className="cf-bridge"><HTML>{slide.measure}</HTML></p>
      </div>
    </div>
  )
}

function DofSlide({ slide, revealed }) {
  const accent = '#5ec8d8', accent2 = '#f0a93b', ink = '#eaf1f8', muted = '#8da4be'
  const lit = Math.max(0, revealed - 1)
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">{slide.sectionNumber}</div>
      <h2 className="slide-heading anim-in"><HTML>{slide.heading}</HTML></h2>
      <div className="heading-rule anim-in" />

      <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
        <p className="cf-note cf-note--lead"><HTML>{slide.intro}</HTML></p>
      </div>

      <div className="dof-layout">
        <div className={`reveal-block dof-graph-wrap${revealed > 1 ? ' revealed' : ''}`}>
          <StepGraph lit={lit} accent={accent} accent2={accent2} ink={ink} muted={muted} />
        </div>

        <div className="dof-side">
          <div className={`reveal-block${revealed > 1 ? ' revealed' : ''}`}>
            {slide.defs.map((d, i) => (
              <div className="dof-def" key={i}>
                <span className="dof-def-eq"><Equation latex={d.eq} display={false} /></span>
                <span className="dof-def-note">{d.note}</span>
              </div>
            ))}
          </div>
          <ul className="dof-band-key">
            {slide.bands.map((b, i) => (
              <li key={i} className={`dof-band-item${revealed > i + 1 ? ' revealed' : ''}`}>
                <span className={`dof-chip dof-chip--${b.key}`} />
                <span className="dof-band-name">{b.name}</span>
                <span className="dof-band-sub">{b.sub}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`reveal-block cf-bridge${revealed > 4 ? ' revealed' : ''}`}>
        <HTML>{slide.cpg}</HTML>
      </div>
    </div>
  )
}

function CpCvSlide({ slide, revealed }) {
  const accent = '#5ec8d8', accent2 = '#f0a93b', ink = '#eaf1f8', muted = '#8da4be'
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">{slide.sectionNumber}</div>
      <h2 className="slide-heading anim-in"><HTML>{slide.heading}</HTML></h2>
      <div className="heading-rule anim-in" />

      <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
        <p className="cf-note cf-note--lead"><HTML>{slide.setup}</HTML></p>
      </div>

      <div className="cpcv-layout">
        <div className={`reveal-block cpcv-fig${revealed > 1 ? ' revealed' : ''}`}>
          <PistonPair accent={accent} accent2={accent2} ink={ink} muted={muted} />
        </div>
        <div className={`reveal-block cpcv-work${revealed > 2 ? ' revealed' : ''}`}>
          <p className="cf-note"><HTML>{slide.work}</HTML></p>
        </div>
      </div>

      <div className="rel-row">
        {slide.relations.map((r, i) => (
          <div key={i} className={`rel-card${revealed > i + 3 ? ' revealed' : ''}`}>
            <div className="rel-head">
              <span className={`rel-tag rel-tag--${r.tag.toLowerCase()}`}>{r.tag}</span>
              <span className="rel-label">{r.label}</span>
            </div>
            <div className="rel-eqs">
              {r.eqs.map((e, j) => <span key={j} className="rel-eq"><Equation latex={e} display={false} /></span>)}
            </div>
          </div>
        ))}
      </div>

      <div className={`reveal-block cf-bridge${revealed > 5 ? ' revealed' : ''}`}>
        <HTML>{slide.note}</HTML>
      </div>
    </div>
  )
}

// ─── Design task hook (opening slide) ────────────────────────────────────────
function HookSlide({ slide, revealed }) {
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">Design Task</div>
      <h2 className="slide-heading anim-in">Supersonic Wind Tunnel</h2>
      <div className="heading-rule anim-in" />

      <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
        <p className="cf-note cf-note--lead"><HTML>{slide.scenario}</HTML></p>
      </div>

      <div className={`reveal-block${revealed > 1 ? ' revealed' : ''}`}>
        <p className="cf-note" style={{ marginTop: '10px' }}><HTML>{slide.spec}</HTML></p>
      </div>

      <div className={`reveal-block hook-q-wrap${revealed > 2 ? ' revealed' : ''}`}>
        <div className="hook-q">
          <span className="hook-q-mark">?</span>
          <span className="hook-q-text"><HTML>{slide.question}</HTML></span>
        </div>
      </div>

      <div className={`reveal-block cf-bridge${revealed > 3 ? ' revealed' : ''}`}>
        <HTML>{slide.bridge}</HTML>
      </div>
    </div>
  )
}

// ─── Section title slide (merging from ThermodynamicsPresentation) ───────────
function SectionSlide({ slide }) {
  return (
    <div className="slide-inner section-slide anim-in">
      {slide.sectionNumber && (
        <div className="section-number">{slide.sectionNumber}</div>
      )}
      <h2 className="section-title"><HTML>{slide.title}</HTML></h2>
      <div className="section-divider-line" />
      {slide.subtitle && (
        <p className="section-sub" dangerouslySetInnerHTML={{ __html: slide.subtitle }} />
      )}
    </div>
  )
}

// ─── Equation + stepped worked-example slide ─────────────────────────────────
function EquationSlide({ slide, revealed }) {
  return (
    <div className="slide-inner compress-slide">
      <h2 className="slide-heading anim-in"><HTML>{slide.heading}</HTML></h2>
      <div className="heading-rule anim-in" />
      {slide.equationLabel && (
        <div className="eq-label anim-in"><HTML>{slide.equationLabel}</HTML></div>
      )}
      {slide.equation && (
        <div className="eq-box anim-in"><Equation latex={slide.equation} /></div>
      )}
      {slide.terms && slide.terms.length > 0 && (
        <div className="eq-terms anim-in">
          {slide.terms.map((t, i) => (
            <div className="eq-term" key={i}>
              <span className="sym"><HTML>{t.symbol}</HTML></span>
              <span className="def"> — <HTML>{t.definition}</HTML></span>
            </div>
          ))}
        </div>
      )}
      {slide.items && (
        <ul className="bullet-list">
          {slide.items.map((item, i) => (
            <li key={i} className={`bullet-item${i < revealed ? ' revealed' : ''}`}>
              <span className="bullet-marker">◆</span>
              <div className="bullet-text">
                <strong><HTML>{item.title}</HTML></strong>
                {item.body && (
                  <span className="bullet-sub"><HTML>{item.body}</HTML></span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ─── Path-dependence slide (from ThermodynamicsPresentation) ─────────────────
function PathDependenceSlide({ revealed }) {
  const items = [
    {
      category: 'PATH-DEPENDENT',
      color: '#f87171',
      vars: [
        { sym: 'q', label: 'Heat transfer',
          body: 'The heat exchanged depends entirely on the process. '
            + 'Isothermal compression rejects heat to the surroundings throughout; '
            + 'adiabatic compression transfers none (Q = 0) — yet both can reach the same final (P, T).' },
        { sym: 'w', label: 'Work',
          body: 'Boundary work ∫p dV depends on the p–V trajectory. '
            + 'Reversible isothermal compression requires more work input than a fast adiabatic compression '
            + 'between identical endpoints — same states, different paths, different w. '
            + 'In free expansion into vacuum, external pressure is zero, so W = 0 entirely.' },
      ],
    },
    {
      category: 'PATH-INDEPENDENT (State Variables)',
      color: '#4ade80',
      vars: [
        { sym: 'e', label: 'Internal energy',
          body: 'e = c<sub>v</sub>T for a calorically perfect gas. Fixed once the state (T, p, ρ) is known — regardless of path.' },
        { sym: 'h', label: 'Enthalpy',
          body: 'h = e + pv = c<sub>p</sub>T. State variable; only the endpoints matter when computing Δh.' },
        { sym: 'S', label: 'Entropy',
          body: 'S is a state variable. dS = δq<sub>rev</sub>/T — integrate along any reversible path; the result is path-independent.' },
      ],
    },
  ]

  const paths = [
    {
      label: 'Path A — Slow isothermal compression',
      color: '#5ec8d8',
      body: 'Vessel stays in thermal contact with the environment. T = 300 K throughout. '
        + 'Compressor does large W<sub>in</sub>; large Q<sub>out</sub> flows to surroundings to hold T constant.',
    },
    {
      label: 'Path B — Fast adiabatic compression, then cool',
      color: '#f0a93b',
      body: 'Insulated vessel charged quickly: Q = 0, so T spikes well above 300 K. '
        + 'Vessel is then sealed and left to cool back to 300 K: W = 0 during cooling, Q<sub>out</sub> flows to environment. '
        + 'Different split of Q and W — identical final state.',
    },
    {
      label: 'Path C — Staged compression with intercooling',
      color: '#a78bfa',
      body: 'Multiple compression stages; heat is rejected between each stage. '
        + 'Intermediate Q and W values at every step — yet P = 20 atm, T = 300 K, m = 234.6 kg at the end, exactly as before.',
    },
  ]

  let revealCount = 0
  return (
    <div className="slide-inner compress-slide" style={{ overflowY: 'auto' }}>
      <h2 className="slide-heading anim-in">Path Dependence vs. State Variables</h2>
      <div className="heading-rule anim-in" />
      <p className="anim-in cf-note" style={{ marginBottom: '0.8rem' }}>
        The 1st Law <strong style={{ color: 'var(--accent-2)' }}>de = δq + δw</strong> uses δ (not d)
        for heat and work — a reminder that they are <em>not</em> exact differentials.
        Only state variables have exact differentials.
      </p>
      <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '1rem' }}>
        {items.map((group, gi) => (
          <div key={gi} style={{ flex: 1 }}>
            <div style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
              color: group.color, borderBottom: `1px solid ${group.color}40`,
              paddingBottom: '6px', marginBottom: '10px',
            }}>
              {group.category}
            </div>
            {group.vars.map((v, vi) => {
              const idx = revealCount++
              const show = idx < revealed
              return (
                <div key={vi} className={`col-item${show ? ' revealed' : ''}`}
                  style={{ borderLeft: `2px solid ${group.color}60`, paddingLeft: '10px', marginBottom: '8px' }}>
                  <strong style={{ color: group.color, fontSize: '16px', fontStyle: 'italic' }}>{v.sym}</strong>
                  <span style={{ color: 'var(--ink)', fontWeight: 600, fontSize: '13px', marginLeft: '6px' }}>{v.label}</span>
                  <span className="bullet-sub" style={{ display: 'block', marginTop: '3px' }}><HTML>{v.body}</HTML></span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
      {/* Wind tunnel charging example */}
      <div className={`reveal-block${revealed >= 6 ? ' revealed' : ''}`}>
        <div style={{
          fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent)',
          borderBottom: '1px solid var(--rule)', paddingBottom: '6px', marginBottom: '10px',
        }}>
          APPLIED EXAMPLE — THREE WAYS TO CHARGE THE WIND TUNNEL VESSEL TO P = 20 atm, T = 300 K
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          {paths.map((p, i) => {
            const show = revealed >= 6 + i
            return (
              <div key={i} className={`col-item${show ? ' revealed' : ''}`}
                style={{ flex: 1, borderLeft: `2px solid ${p.color}60`, paddingLeft: '10px' }}>
                <span style={{ color: p.color, fontWeight: 700, fontSize: '12px' }}>{p.label}</span>
                <span className="bullet-sub" style={{ display: 'block', marginTop: '4px' }}><HTML>{p.body}</HTML></span>
              </div>
            )
          })}
        </div>
        <p className="cf-note" style={{ marginTop: '10px', fontSize: '12px' }}>
          <strong style={{ color: 'var(--accent-2)' }}>Takeaway:</strong> e, h, and S at the final state are the same for all three paths.
          The <em>mix</em> of Q and W differs completely — that is path dependence.
        </p>
      </div>
    </div>
  )
}

// ─── Entropy examples slide (from ThermodynamicsPresentation) ────────────────
function EntropySlide({ revealed }) {
  const examples = [
    {
      icon: '🔥', title: 'Heat addition (combustor)',
      body: 'Adding heat δq to a gas at temperature T increases entropy by dS = δq/T. In a real combustor, '
        + 'additional irreversibilities (viscous dissipation, mixing) raise entropy further — hence stagnation '
        + 'pressure is always lost across the burner.',
    },
    {
      icon: '🌊', title: 'Normal shock',
      body: 'Across a shock, T₀ is conserved but p₀ drops. Since Δs = c<sub>p</sub> ln(T₀₂/T₀₁) − R ln(p₀₂/p₀₁), '
        + 'the p₀ loss directly increases entropy. This is why inlets that swallow shocks pay a pressure-recovery penalty.',
    },
    {
      icon: '💨', title: 'Unrestrained (free) expansion',
      body: 'Gas expands into a vacuum: no work done, no heat transfer, yet ΔS &gt; 0. The same particles now '
        + 'have more volume to occupy — more microstates, higher entropy.',
    },
    {
      icon: '🔀', title: 'Irreversible mixing',
      body: 'Mixing two streams at different temperatures is irreversible. Even if total energy is conserved, '
        + 'the process cannot be undone without external work — ΔS<sub>universe</sub> &gt; 0.',
    },
    {
      icon: '⚙️', title: 'Viscous friction in ducts',
      body: 'In Fanno flow, friction converts ordered kinetic energy to thermal energy, raising entropy '
        + 'monotonically along the duct in both subsonic and supersonic branches — Mach → 1 is the entropy maximum.',
    },
  ]
  return (
    <div className="slide-inner compress-slide">
      <h2 className="slide-heading anim-in">Entropy: Ways It Increases</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note anim-in" style={{ marginBottom: '14px' }}>
        <strong style={{ color: 'var(--accent-2)' }}>dS ≥ δq/T</strong>&nbsp;(2nd Law).
        Equality holds for reversible processes; strict inequality for all real ones.
        S is a <em>state variable</em> — but what actually drives it up?
      </p>
      <ul className="bullet-list">
        {examples.map((ex, i) => (
          <li key={i} className={`bullet-item${i < revealed ? ' revealed' : ''}`}>
            <span className="bullet-marker" style={{ fontSize: '1rem' }}>{ex.icon}</span>
            <div className="bullet-text">
              <strong>{ex.title}</strong>
              <span className="bullet-sub"><HTML>{ex.body}</HTML></span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Example slide (wind-tunnel worked examples) ─────────────────────────────
function ExampleSlide({ slide, revealed }) {
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">{slide.sectionNumber}</div>
      <h2 className="slide-heading anim-in"><HTML>{slide.heading}</HTML></h2>
      <div className="heading-rule anim-in" />

      <div className="ex-scenario anim-in">
        <span className="ex-scenario-lbl">Given</span>
        <HTML>{slide.scenario}</HTML>
      </div>

      <div className="ex-steps">
        {(slide.steps || []).map((step, i) => (
          <div key={i} className={`ex-step${i < revealed ? ' revealed' : ''}`}>
            <div className="ex-step-hd">
              <span className="ex-step-num">{i + 1}</span>
              <span className="ex-step-lbl"><HTML>{step.label}</HTML></span>
            </div>
            {step.eq && <div className="ex-eq"><Equation latex={step.eq} /></div>}
            {step.result && (
              <div className="ex-result">
                <Equation latex={step.result} display={false} />
              </div>
            )}
            {step.note && <div className="ex-note"><HTML>{step.note}</HTML></div>}
            {step.question && (
              <div className="ex-question">
                <span className="ex-q-mark">?</span>
                <HTML>{step.question}</HTML>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Section 1 renderers (ported from Unit2slides) ───────────────────────────
function OutlineSlide({ slide, revealed }) {
  return (
    <div className="slide-inner section-slide anim-in">
      {slide.sectionNumber && <div className="section-number">{slide.sectionNumber}</div>}
      <h2 className="section-title">{slide.title}</h2>
      <div className="section-divider-line" />
      {slide.subtitle && (
        <p className="section-sub" dangerouslySetInnerHTML={{ __html: slide.subtitle }} />
      )}
      <ol className="outline-list">
        {(slide.items || []).map((it, i) => (
          <li key={i} className={`outline-item${i < revealed ? ' revealed' : ''}`}>
            <span className="outline-num">{i + 1}</span>
            <span className="outline-text"><HTML>{it}</HTML></span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function CompressSlide({ slide, revealed }) {
  const accent = 'var(--accent)'
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">{slide.sectionNumber}</div>
      <h2 className="slide-heading anim-in">{slide.heading}</h2>
      <div className="heading-rule anim-in" />

      <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
        <p className="cf-question">
          <span className="cf-tag">Q</span>
          <span><strong><HTML>{slide.question}</HTML></strong>{' '}
            <HTML>{slide.questionAnswer}</HTML></span>
        </p>
      </div>

      <div className={`reveal-block${revealed > 1 ? ' revealed' : ''}`}>
        <p className="cf-def">
          <span className="cf-tag cf-tag--def">Def</span>
          <span><HTML>{slide.definition}</HTML></span>
        </p>
      </div>

      <div className={`reveal-block eq-row${revealed > 2 ? ' revealed' : ''}`}>
        <div className="eq-box"><Equation latex={slide.equation} /></div>
        <div className="eq-aside">
          specific volume <Equation latex={slide.specificVolume} display={false} />
        </div>
      </div>

      <div className={`reveal-block${revealed > 3 ? ' revealed' : ''}`}>
        <p className="cf-note"><HTML>{slide.cutoff}</HTML></p>
      </div>

      <div className={`reveal-block diagram-row${revealed > 4 ? ' revealed' : ''}`}>
        <figure className="diagram">
          <CVDiagram label="v" size="large" accent={accent} />
          <figcaption>Low pressure — larger volume</figcaption>
        </figure>
        <figure className="diagram">
          <CVDiagram label="v + dv" size="small" pressureLabel="P + dp" accent={accent} />
          <figcaption>Higher pressure — compressed</figcaption>
        </figure>
        <figure className="diagram">
          <PistonDiagram
            topLabel="P + dp" midLabel="T = const"
            processLabel="isothermal" qLabel="q_out" insulated={false} accent={accent} />
          <figcaption>Isothermal — heat escapes (q&#8202;<sub>out</sub> &ne; 0)</figcaption>
        </figure>
        <figure className="diagram">
          <PistonDiagram
            topLabel="P + dp" midLabel="s = const"
            processLabel="isentropic" qLabel="q_out = 0" insulated={true} accent={accent} />
          <figcaption>Isentropic — insulated, no heat out (q&#8202;<sub>out</sub> = 0)</figcaption>
        </figure>
      </div>
    </div>
  )
}

function ThrustSlide({ slide, revealed }) {
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">{slide.sectionNumber}</div>
      <h2 className="slide-heading anim-in">{slide.heading}</h2>
      <div className="heading-rule anim-in" />

      <div className={`reveal-block eq-row${revealed > 0 ? ' revealed' : ''}`}>
        <div className="eq-box"><Equation latex={slide.equation} /></div>
        <div className="eq-aside">
          {slide.equationLabel && <HTML>{slide.equationLabel}</HTML>}
        </div>
        {slide.hiddenLabel && (
          <div className="eq-aside eq-aside--hidden">
            density hides in <Equation latex={slide.hiddenLabel} display={false} />
          </div>
        )}
      </div>

      <ul className="thrust-list">
        {(slide.items || []).map((item, i) => (
          <li key={i} className={`thrust-item${i < revealed - 1 ? ' revealed' : ''}`}>
            <span className="thrust-marker">◆</span>
            <div className="thrust-text">
              <strong><HTML>{item.title}</HTML></strong>
              {item.body && <span className="thrust-sub"><HTML>{item.body}</HTML></span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── NEW card-style renderers (Sections 4 & 5) ───────────────────────────────
function ConserveSlide({ slide, revealed }) {
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">{slide.sectionNumber}</div>
      <h2 className="slide-heading anim-in"><HTML>{slide.heading}</HTML></h2>
      <div className="heading-rule anim-in" />

      <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
        <p className="cf-note cf-note--lead"><HTML>{slide.intro}</HTML></p>
      </div>

      <div className="cmp-row">
        {slide.columns.map((col, i) => (
          <div key={i} className={`cmp-card reveal-block${revealed > i + 1 ? ' revealed' : ''}`}
               style={{ borderTopColor: col.accent }}>
            <div className="cmp-head">
              <span className="cmp-tag" style={{ background: col.accent }}>{col.tag}</span>
              <span className="cmp-label">{col.label}</span>
            </div>
            {col.items.map((it, j) => (
              <div className="cmp-item" key={j}>
                <strong style={{ color: col.accent }}><HTML>{it.k}</HTML></strong>
                <span><HTML>{it.v}</HTML></span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className={`reveal-block cf-bridge${revealed > 3 ? ' revealed' : ''}`}>
        <HTML>{slide.bridge}</HTML>
      </div>
    </div>
  )
}

function ConsLawsSlide({ slide, revealed }) {
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">{slide.sectionNumber}</div>
      <h2 className="slide-heading anim-in"><HTML>{slide.heading}</HTML></h2>
      <div className="heading-rule anim-in" />

      <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
        <p className="cf-note cf-note--lead"><HTML>{slide.intro}</HTML></p>
      </div>

      <div className="law-col">
        {slide.laws.map((law, i) => (
          <div key={i} className={`law-card reveal-block${revealed > i + 1 ? ' revealed' : ''}`}
               style={{ borderLeftColor: law.accent }}>
            <div className="law-head">
              <span className="law-tag" style={{ background: law.accent }}>{law.tag}</span>
            </div>
            <div className="law-eq"><Equation latex={law.eq} /></div>
            <p className="law-note"><HTML>{law.note}</HTML></p>
          </div>
        ))}
      </div>

      <div className={`reveal-block cf-bridge${revealed > 4 ? ' revealed' : ''}`}>
        <HTML>{slide.bridge}</HTML>
      </div>
    </div>
  )
}

function SoundSpeedSlide({ slide, revealed }) {
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">{slide.sectionNumber}</div>
      <h2 className="slide-heading anim-in"><HTML>{slide.heading}</HTML></h2>
      <div className="heading-rule anim-in" />

      <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
        <p className="cf-note cf-note--lead"><HTML>{slide.intro}</HTML></p>
      </div>

      <div className={`reveal-block eq-row${revealed > 1 ? ' revealed' : ''}`}>
        <div className="eq-box"><Equation latex={slide.equation} /></div>
        <div className="eq-aside">{slide.equationLabel && <HTML>{slide.equationLabel}</HTML>}</div>
      </div>

      <div className={`reveal-block term-grid${revealed > 2 ? ' revealed' : ''}`}>
        {slide.terms.map((t, i) => (
          <div className="term-item" key={i}>
            <span className="term-sym"><Equation latex={t.sym} display={false} /></span>
            <span className="term-def"><HTML>{t.def}</HTML></span>
          </div>
        ))}
      </div>

      <div className="cmp-row cmp-row--tight">
        {slide.cards.map((c, i) => (
          <div key={i} className={`mini-card reveal-block${revealed > i + 3 ? ' revealed' : ''}`}>
            <strong><HTML>{c.k}</HTML></strong>
            <span><HTML>{c.v}</HTML></span>
          </div>
        ))}
      </div>

      <div className={`reveal-block cf-bridge${revealed > 5 ? ' revealed' : ''}`}>
        <HTML>{slide.bridge}</HTML>
      </div>
    </div>
  )
}

function ShockFormSlide({ slide, revealed }) {
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">{slide.sectionNumber}</div>
      <h2 className="slide-heading anim-in"><HTML>{slide.heading}</HTML></h2>
      <div className="heading-rule anim-in" />

      <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
        <p className="cf-note cf-note--lead"><HTML>{slide.intro}</HTML></p>
      </div>

      <div className="cmp-row">
        {slide.regimes.map((r, i) => (
          <div key={i} className={`regime-card reveal-block${revealed > i + 1 ? ' revealed' : ''}`}
               style={{ borderTopColor: r.accent }}>
            <div className="regime-head">
              <span className="regime-tag" style={{ background: r.accent }}>{r.tag}</span>
              <span className="regime-label">{r.label}</span>
            </div>
            <strong className="regime-headline" style={{ color: r.accent }}><HTML>{r.head}</HTML></strong>
            <p className="regime-body"><HTML>{r.body}</HTML></p>
          </div>
        ))}
      </div>

      <div className={`reveal-block cf-bridge${revealed > 3 ? ' revealed' : ''}`}>
        <HTML>{slide.closer}</HTML>
      </div>
    </div>
  )
}

// ─── How many "steps" does each slide have? ──────────────────────────────────
function totalSteps(slide) {
  switch (slide.type) {
    case 'hook':        return 4 // scenario, spec, question, bridge
    case 'outline':     return slide.items?.length || 0
    case 'section':     return 0
    case 'equation':    return slide.items?.length || 0
    case '__path':      return 8 // 2 path-dep + 3 state vars + 3 wind-tunnel charging paths
    case '__entropy':   return 5
    case 'compress':    return 5 // question, def, eqn, note, diagrams
    case 'thrust':      return (slide.items?.length || 0) + 1 // equation + each point
    case 'idg':         return 5 // (legacy renderer kept for reference)
    case 'example':     return slide.steps?.length || 0
    case 'energymodes': return 7 // intro, 4 modes, payoff, measure
    case 'dof':         return 6 // intro, defs+graph, 3 bands, cpg note
    case 'cpcv':        return 6 // setup, pistons, work, PG, CPG, note
    case 'conserve':    return 4 // intro, 2 columns, bridge
    case 'conslaws':    return 5 // intro, 3 laws, bridge
    case 'soundspeed':  return 6 // intro, eqn, terms, 2 cards, bridge
    case 'shockform':   return 4 // intro, 2 regimes, closer
    default:            return 0
  }
}

// ─── Main Presentation component ─────────────────────────────────────────────
export default function Presentation({ slides: slideData = slides, meta: metaData = meta }) {
  const [slideIdx, setSlideIdx] = useState(0)
  const [revealed, setRevealed] = useState(0)
  const [direction, setDirection] = useState(null)
  const [animKey, setAnimKey] = useState(0)

  const current = slideData[slideIdx]
  const steps = totalSteps(current)

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= slideData.length) return
    setDirection('exit')
    setTimeout(() => {
      setSlideIdx(idx); setRevealed(0); setAnimKey(k => k + 1); setDirection('enter')
    }, 260)
  }, [slideData.length])

  const advance = useCallback(() => {
    if (revealed < steps) setRevealed(r => r + 1)
    else goTo(slideIdx + 1)
  }, [revealed, steps, slideIdx, goTo])

  const retreat = useCallback(() => {
    if (revealed > 0) setRevealed(r => r - 1)
    else goTo(slideIdx - 1)
  }, [revealed, slideIdx, goTo])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault(); advance()
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); retreat() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [advance, retreat])

  const handleStageClick = (e) => {
    if (e.target.closest('.nav-btn') || e.target.closest('.nav-dot')) return
    advance()
  }

  const progress = slideData.length > 1
    ? ((slideIdx + (revealed / Math.max(steps, 1))) / (slideData.length - 1)) * 100
    : 100

  function renderSlide(slide) {
    switch (slide.type) {
      case 'hook':        return <HookSlide slide={slide} revealed={revealed} />
      case 'outline':     return <OutlineSlide slide={slide} revealed={revealed} />
      case 'section':     return <SectionSlide slide={slide} />
      case 'equation':    return <EquationSlide slide={slide} revealed={revealed} />
      case '__path':      return <PathDependenceSlide revealed={revealed} />
      case '__entropy':   return <EntropySlide revealed={revealed} />
      case 'compress':    return <CompressSlide slide={slide} revealed={revealed} />
      case 'thrust':      return <ThrustSlide slide={slide} revealed={revealed} />
      case 'idg':         return <IdgSlide slide={slide} revealed={revealed} />
      case 'example':     return <ExampleSlide slide={slide} revealed={revealed} />
      case 'energymodes': return <EnergyModesSlide slide={slide} revealed={revealed} />
      case 'dof':         return <DofSlide slide={slide} revealed={revealed} />
      case 'cpcv':        return <CpCvSlide slide={slide} revealed={revealed} />
      case 'conserve':    return <ConserveSlide slide={slide} revealed={revealed} />
      case 'conslaws':    return <ConsLawsSlide slide={slide} revealed={revealed} />
      case 'soundspeed':  return <SoundSpeedSlide slide={slide} revealed={revealed} />
      case 'shockform':   return <ShockFormSlide slide={slide} revealed={revealed} />
      default:            return null
    }
  }

  return (
    <div className="app">
      <style>{CSS}</style>
      <div className="top-bar">
        <span className="course-id">{metaData?.courseId}</span>
        <div className="top-bar-divider" />
        <span className="deck-title">{metaData?.deckTitle}</span>
        <div className="top-bar-spacer" />
        <span className="slide-counter">{slideIdx + 1} / {slideData.length}</span>
      </div>

      <div className="stage" onClick={handleStageClick}>
        <div className="slide-wrapper">
          <div className={`slide active${direction === 'exit' ? ' exit' : ''}`} key={animKey}>
            {renderSlide(current)}
          </div>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="nav-bar">
        <button className="nav-btn" onClick={retreat}
          disabled={slideIdx === 0 && revealed === 0}>← Prev</button>
        <div className="nav-dots">
          {slideData.map((_, i) => (
            <div key={i} className={`nav-dot${i === slideIdx ? ' active' : ''}`}
              onClick={(e) => { e.stopPropagation(); goTo(i) }} />
          ))}
        </div>
        <button className="nav-btn" onClick={advance}
          disabled={slideIdx === slideData.length - 1 && revealed >= steps}>Next →</button>
        <span className="nav-hint">← → or click · hover diagrams to replay</span>
      </div>
    </div>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const CSS = `
:root{
  --bg:#0d1b2a; --panel:#13243a; --ink:#eaf1f8; --muted:#8da4be;
  --accent:#5ec8d8; --accent-2:#f0a93b; --rule:#27405e;
  --display:'Georgia','Times New Roman',serif;
  --body:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
}
*{box-sizing:border-box}
html,body,#root{height:100%;margin:0}
.app{height:100vh;height:100dvh;width:100%;display:flex;flex-direction:column;
  background:radial-gradient(1200px 700px at 70% -10%,#163152 0%,var(--bg) 55%);
  color:var(--ink);font-family:var(--body)}
.top-bar{display:flex;align-items:center;gap:12px;padding:14px 26px;
  border-bottom:1px solid var(--rule);font-size:13px;letter-spacing:.04em}
.course-id{color:var(--accent);font-weight:600}
.top-bar-divider{width:1px;height:14px;background:var(--rule)}
.deck-title{color:var(--muted)}
.top-bar-spacer{flex:1}
.slide-counter{color:var(--muted);font-variant-numeric:tabular-nums}
.stage{flex:1;min-height:0;display:flex;align-items:flex-start;justify-content:center;
  padding:30px 40px;cursor:pointer;overflow:auto}
.slide-wrapper{margin:auto;position:relative;width:100%;max-width:1100px}
.slide{width:100%}
.slide.exit .slide-inner{opacity:0;transform:translateY(-10px);transition:.24s ease}
.slide-inner{width:100%}
.anim-in{animation:fadeUp .5s ease both}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}

.compress-slide{max-height:100%}
.section-number{font-family:var(--display);color:var(--accent);
  font-size:15px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:10px}
.slide-heading{font-family:var(--display);font-size:34px;margin:2px 0 0}
.slide-heading sub{font-size:.62em}
.heading-rule{width:70px;height:3px;background:var(--accent);margin:14px 0 16px}
.reveal-block{opacity:0;transform:translateY(10px);transition:.45s ease;margin-bottom:12px}
.reveal-block.revealed{opacity:1;transform:none}
.cf-note{font-size:15px;line-height:1.55;color:var(--muted);max-width:980px;margin:0}
.cf-note strong{color:var(--accent-2)}
.cf-note--lead{color:var(--ink);font-size:16px}
.cf-note--lead em{color:var(--accent)}
.cf-bridge{font-size:15px;line-height:1.55;color:var(--ink);max-width:980px;margin:0;
  border-left:3px solid var(--accent-2);padding-left:14px}
.cf-bridge strong{color:var(--accent)}
.cf-bridge em{color:var(--accent-2);font-style:italic}

/* equation rows */
.eq-row{display:flex;align-items:center;gap:28px;flex-wrap:wrap;margin:16px 0}
.eq-box{background:var(--panel);border:1px solid var(--rule);border-left:3px solid var(--accent);
  border-radius:8px;padding:14px 26px;font-size:20px}
.eq-aside{color:var(--muted);font-size:15px;display:flex;align-items:center;gap:8px}

/* idg case cards */
.case-row{display:flex;gap:18px;flex-wrap:wrap;margin:6px 0 4px}
.case-card{background:var(--panel);border:1px solid var(--rule);border-radius:10px;
  padding:14px 18px;min-width:280px;flex:1}
.case-label{font-family:var(--display);font-size:14px;font-weight:700;letter-spacing:.04em;
  color:var(--accent-2);margin-bottom:10px}
.case-givens{font-size:14px;color:var(--muted);margin-bottom:8px}
.case-result{font-size:17px;color:var(--ink);border-top:1px solid var(--rule);padding-top:8px}

/* energy-modes grid */
.em-row{display:flex;gap:16px;flex-wrap:wrap;margin:16px 0 18px}
.em-fig{margin:0;background:var(--panel);border:1px solid var(--rule);border-radius:10px;
  padding:12px 14px 14px;width:230px;flex:1;min-width:200px;display:flex;flex-direction:column;
  align-items:center;opacity:0;transform:translateY(10px);transition:.42s ease}
.em-fig.revealed{opacity:1;transform:none}
.em-mode-title{align-self:flex-start;font-family:var(--display);font-size:15px;font-weight:700;
  color:var(--accent);margin-bottom:6px}
.em-svg{width:100%;height:auto;cursor:pointer}
.em-formula{font-size:16px;margin:8px 0 6px;color:var(--ink)}
.em-fig figcaption{font-size:12.5px;line-height:1.45;color:var(--muted);text-align:left}

/* molecule primitives */
.em-atom{fill:rgba(94,200,216,.18);stroke:var(--accent);stroke-width:1.6}
.em-bond{stroke:var(--ink);stroke-width:2}
.em-spring{fill:none;stroke:var(--ink);stroke-width:1.8}
.em-orbit{fill:none;stroke:var(--accent-2);stroke-width:1;stroke-dasharray:3 4;opacity:.55}
.em-orbit--outer{opacity:.4}

/* mode animations */
.em-translational .em-body{animation:emDrift 2.2s ease-in-out both}
@keyframes emDrift{0%{transform:translateX(-26px)}100%{transform:translateX(20px)}}
.em-rotational .em-spin{transform-box:view-box;transform-origin:100px 60px;
  animation:emSpin 2.4s linear infinite}
@keyframes emSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.em-vibrational .em-left{transform-box:view-box;animation:emVibL 1.2s ease-in-out infinite}
.em-vibrational .em-right{transform-box:view-box;animation:emVibR 1.2s ease-in-out infinite}
.em-vibrational .em-coil{transform-box:view-box;transform-origin:114.5px 60px;
  animation:emCoil 1.2s ease-in-out infinite}
@keyframes emVibL{0%,100%{transform:translateX(0)}50%{transform:translateX(20px)}}
@keyframes emVibR{0%,100%{transform:translateX(0)}50%{transform:translateX(-20px)}}
@keyframes emCoil{0%,100%{transform:scaleX(1)}50%{transform:scaleX(.42)}}
.em-electronic .em-electron{animation:emHop 2.6s ease-in-out infinite}
@keyframes emHop{
  0%,15%{transform:translate(130px,60px)}
  35%,50%{transform:translate(152px,60px)}
  70%,85%{transform:translate(48px,60px)}
  100%{transform:translate(70px,60px)}
}

/* monatomic payoff */
.em-payoff{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.em-mono{width:120px;height:auto;flex-shrink:0}

/* DOF slide */
.dof-layout{display:flex;gap:26px;flex-wrap:wrap;align-items:flex-start;margin:8px 0 12px}
.dof-graph-wrap{flex:1 1 420px;min-width:340px;background:var(--panel);
  border:1px solid var(--rule);border-radius:12px;padding:14px 16px 8px}
.dof-svg{width:100%;height:auto}
.dof-axis{fill:var(--muted);font-size:11px;font-family:var(--display);font-style:italic}
.dof-ymark{fill:var(--accent-2);font-size:11px;font-family:var(--display);font-style:italic;
  font-variant-numeric:tabular-nums}
.dof-tick{fill:var(--muted);font-size:10px}
.dof-curve{transition:stroke-dashoffset 1.4s ease}
.dof-band{opacity:0;transition:opacity .5s ease}
.dof-band.on{opacity:.14}

.dof-side{flex:1 1 300px;min-width:260px}
.dof-def{display:flex;align-items:baseline;gap:12px;margin-bottom:8px}
.dof-def-eq{background:var(--panel);border:1px solid var(--rule);border-left:3px solid var(--accent);
  border-radius:7px;padding:6px 14px;font-size:16px}
.dof-def-note{color:var(--muted);font-size:13px}
.dof-band-key{list-style:none;padding:0;margin:14px 0 0;display:flex;flex-direction:column;gap:8px}
.dof-band-item{display:flex;align-items:center;gap:10px;font-size:14px;
  opacity:0;transform:translateX(-6px);transition:.4s ease}
.dof-band-item.revealed{opacity:1;transform:none}
.dof-chip{width:14px;height:14px;border-radius:4px;flex-shrink:0}
.dof-chip--trans{background:rgba(94,200,216,.6)}
.dof-chip--rot{background:rgba(94,200,216,.4)}
.dof-chip--flat{background:rgba(240,169,59,.5)}
.dof-chip--vib{background:rgba(94,200,216,.25)}
.dof-band-name{color:var(--ink);font-weight:600;min-width:96px}
.dof-band-sub{color:var(--muted);font-size:12.5px}

/* cp vs cv slide */
.cpcv-layout{display:flex;gap:24px;flex-wrap:wrap;align-items:center;margin:6px 0 10px}
.cpcv-fig{flex:1 1 320px;min-width:300px;background:var(--panel);border:1px solid var(--rule);
  border-radius:12px;padding:10px}
.cpcv-svg{width:100%;height:auto;cursor:pointer}
.cpcv-work{flex:1 1 320px;min-width:280px}
.cpcv-cap{fill:var(--muted);font-size:11px;font-family:var(--display)}
.cpcv-q{fill:var(--accent);font-size:12px}

.cp-piston{animation:pistonLift 2.6s ease-in-out both}
.cp-gas{transform-box:fill-box;transform-origin:50% 100%;animation:gasExpand 2.6s ease-in-out both}
@keyframes pistonLift{0%{transform:translateY(34px)}55%{transform:translateY(34px)}100%{transform:translateY(0)}}
@keyframes gasExpand{0%{transform:scaleY(.55)}55%{transform:scaleY(.55)}100%{transform:scaleY(1)}}
.cv-shimmer circle{animation:shimmer 1.4s ease-in-out infinite alternate}
.cv-shimmer circle:nth-child(2){animation-delay:.3s}
.cv-shimmer circle:nth-child(3){animation-delay:.6s}
@keyframes shimmer{from{opacity:.3;transform:translateY(2px)}to{opacity:.9;transform:translateY(-2px)}}

.rel-row{display:flex;gap:18px;flex-wrap:wrap;margin:4px 0 12px}
.rel-card{flex:1 1 300px;min-width:280px;background:var(--panel);border:1px solid var(--rule);
  border-radius:10px;padding:12px 16px;opacity:0;transform:translateY(8px);transition:.42s ease}
.rel-card.revealed{opacity:1;transform:none}
.rel-head{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.rel-tag{font-family:var(--display);font-size:12px;font-weight:700;color:var(--bg);
  border-radius:5px;padding:2px 9px}
.rel-tag--pg{background:var(--accent)}
.rel-tag--cpg{background:var(--accent-2)}
.rel-label{color:var(--muted);font-size:13px}
.rel-eqs{display:flex;flex-wrap:wrap;gap:8px 18px}
.rel-eq{font-size:16px;color:var(--ink)}

/* nav */
.nav-bar{display:flex;align-items:center;gap:16px;padding:14px 26px;border-top:1px solid var(--rule)}
.nav-btn{background:var(--panel);color:var(--ink);border:1px solid var(--rule);
  border-radius:7px;padding:8px 16px;font-size:14px;cursor:pointer;transition:.2s}
.nav-btn:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}
.nav-btn:disabled{opacity:.35;cursor:default}
.nav-dots{flex:1;display:flex;gap:8px;justify-content:center}
.nav-dot{width:9px;height:9px;border-radius:50%;background:var(--rule);cursor:pointer;transition:.2s}
.nav-dot.active{background:var(--accent);transform:scale(1.25)}
.nav-hint{color:var(--muted);font-size:12px}
.progress-bar{position:absolute;left:0;bottom:-12px;height:2px;background:var(--accent);transition:width .3s ease}

/* ── Section 1: outline ─────────────────────────────────────────────────── */
.section-slide{max-height:100%}
.section-title{font-family:var(--display);font-size:54px;line-height:1.02;margin:0}
.section-divider-line{width:80px;height:3px;background:var(--accent);margin:18px 0 14px}
.section-sub{color:var(--muted);font-size:17px;max-width:640px;margin:0 0 22px}
.outline-list{list-style:none;padding:0;margin:0;display:grid;
  grid-template-columns:1fr 1fr;gap:12px 30px;max-width:880px}
.outline-item{display:flex;align-items:baseline;gap:14px;font-size:18px;
  opacity:0;transform:translateY(8px);transition:.4s ease}
.outline-item.revealed{opacity:1;transform:none}
.outline-num{font-family:var(--display);color:var(--accent-2);font-size:15px;
  font-variant-numeric:tabular-nums;min-width:18px}
.outline-text{color:var(--ink)}

/* ── Section 1: compress + thrust ───────────────────────────────────────── */
.cf-tag{display:inline-block;font-family:var(--display);font-size:12px;font-weight:700;
  color:var(--bg);background:var(--accent);border-radius:5px;padding:2px 9px;flex-shrink:0}
.cf-tag--def{background:var(--accent-2)}
.cf-question,.cf-def{display:flex;gap:10px;font-size:18px;line-height:1.5;
  color:var(--ink);max-width:920px;margin:0}
.cf-question strong{color:var(--accent)}
.cf-question em,.cf-def em{color:var(--accent-2);font-style:italic}
.eq-aside--hidden{color:var(--accent-2)}
.thrust-list{list-style:none;padding:0;margin:18px 0 0;display:flex;flex-direction:column;gap:12px;max-width:940px}
.thrust-item{display:flex;gap:12px;align-items:baseline;
  opacity:0;transform:translateY(8px);transition:.42s ease}
.thrust-item.revealed{opacity:1;transform:none}
.thrust-marker{color:var(--accent);font-size:11px;line-height:1.6;flex-shrink:0}
.thrust-text{display:flex;flex-direction:column;gap:3px}
.thrust-text strong{font-size:17px;color:var(--ink)}
.thrust-sub{font-size:15px;line-height:1.5;color:var(--muted)}
.thrust-sub strong{color:var(--accent-2)}

/* ── Section 1: SVG diagrams ────────────────────────────────────────────── */
.diagram-row{display:flex;gap:18px;flex-wrap:wrap;margin-top:20px}
.diagram{margin:0;background:var(--panel);border:1px solid var(--rule);
  border-radius:10px;padding:10px 12px 8px;display:flex;flex-direction:column;
  align-items:center;width:170px}
.cv-svg{width:130px;height:auto}
.cv-box{stroke:var(--ink);stroke-width:1.4;fill:rgba(94,200,216,.05)}
.cv-text{fill:var(--ink);font-family:var(--body);font-size:11px}
.cv-text--lg{font-size:14px;font-style:italic}
.cv-text--sm{font-size:9px;fill:var(--muted)}
.diagram figcaption{font-size:11px;color:var(--muted);text-align:center;margin-top:6px;line-height:1.3}
.piston-svg{cursor:pointer}
.cyl-wall path{stroke:var(--ink);stroke-width:1.4;fill:none}
.ins-outline{stroke:var(--accent-2);stroke-width:1}
.ins-hatch{stroke:var(--accent-2);stroke-width:.8}
.press-arrow{stroke:var(--accent);stroke-width:1.4;marker-end:none}
.piston-head{fill:var(--muted);stroke:var(--ink);stroke-width:1}
.piston-rod{stroke:var(--ink);stroke-width:2}
.gas{fill:rgba(94,200,216,.14);stroke:var(--accent);stroke-width:.8}
.gas-label{fill:var(--ink);font-size:11px}
.piston-anim .piston{animation:pistonDrop 2.2s ease-in-out both}
.piston-anim .gas{animation:gasCompress 2.2s ease-in-out both;transform-box:fill-box;transform-origin:50% 100%}
.piston-anim .gas-label{animation:labelSettle 2.2s ease-in-out both}
.piston-anim .heat-out{animation:heatPulse 2.2s ease-in-out both}
@keyframes pistonDrop{0%{transform:translateY(0)}100%{transform:translateY(58px)}}
@keyframes gasCompress{0%{transform:scaleY(1)}100%{transform:scaleY(0.52)}}
@keyframes labelSettle{0%{transform:translateY(0);opacity:.9}100%{transform:translateY(14px);opacity:1}}
@keyframes heatPulse{
  0%,30%{opacity:0;transform:translate(0,0)}
  55%{opacity:1;transform:translate(-3px,3px)}
  80%{opacity:1;transform:translate(-5px,5px)}
  100%{opacity:.4;transform:translate(-6px,6px)}}

/* ── NEW card styles (Sections 4 & 5) ───────────────────────────────────── */
.cmp-row{display:flex;gap:18px;flex-wrap:wrap;margin:16px 0 18px}
.cmp-row--tight{margin:10px 0 14px}
.cmp-card{flex:1 1 320px;min-width:300px;background:var(--panel);border:1px solid var(--rule);
  border-top:3px solid var(--accent);border-radius:10px;padding:14px 18px;
  opacity:0;transform:translateY(8px);transition:.42s ease}
.cmp-card.revealed{opacity:1;transform:none}
.cmp-head{display:flex;align-items:center;gap:10px;margin-bottom:12px}
.cmp-tag{font-family:var(--display);font-size:12px;font-weight:700;color:var(--bg);
  border-radius:5px;padding:2px 9px}
.cmp-label{font-family:var(--display);font-size:18px;font-weight:700;color:var(--ink)}
.cmp-item{display:flex;flex-direction:column;gap:2px;margin-bottom:10px}
.cmp-item strong{font-size:14.5px}
.cmp-item span{font-size:13.5px;line-height:1.5;color:var(--muted)}
.cmp-item span strong{color:var(--accent-2)}

.law-col{display:flex;flex-direction:column;gap:12px;margin:14px 0 16px;max-width:980px}
.law-card{background:var(--panel);border:1px solid var(--rule);border-left:3px solid var(--accent);
  border-radius:10px;padding:12px 18px;display:flex;flex-direction:column;gap:6px;
  opacity:0;transform:translateY(8px);transition:.42s ease}
.law-card.revealed{opacity:1;transform:none}
.law-head{display:flex;align-items:center;gap:10px}
.law-tag{font-family:var(--display);font-size:12px;font-weight:700;color:var(--bg);
  border-radius:5px;padding:2px 10px}
.law-eq{font-size:17px;overflow-x:auto;padding:2px 0}
.law-note{font-size:13.5px;line-height:1.5;color:var(--muted);margin:0}
.law-note strong{color:var(--accent-2)}

.term-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 26px;margin:6px 0 12px;max-width:920px}
.term-item{display:flex;align-items:baseline;gap:10px}
.term-sym{color:var(--accent);min-width:54px}
.term-def{font-size:13.5px;color:var(--muted);line-height:1.45}

.mini-card{flex:1 1 320px;min-width:300px;background:var(--panel);border:1px solid var(--rule);
  border-radius:10px;padding:12px 16px;display:flex;flex-direction:column;gap:4px}
.mini-card strong{font-size:14.5px;color:var(--accent)}
.mini-card span{font-size:13.5px;line-height:1.5;color:var(--muted)}

.regime-card{flex:1 1 320px;min-width:300px;background:var(--panel);border:1px solid var(--rule);
  border-top:3px solid var(--accent);border-radius:10px;padding:14px 18px;
  opacity:0;transform:translateY(8px);transition:.42s ease}
.regime-card.revealed{opacity:1;transform:none}
.regime-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.regime-tag{font-family:var(--display);font-size:12px;font-weight:700;color:var(--bg);
  border-radius:5px;padding:2px 9px;font-variant-numeric:tabular-nums}
.regime-label{font-family:var(--display);font-size:17px;font-weight:700;color:var(--ink)}
.regime-headline{display:block;font-size:15px;margin-bottom:6px}
.regime-body{font-size:13.5px;line-height:1.55;color:var(--muted);margin:0}
.regime-body strong{color:var(--accent-2)}

@media (max-width:720px){
  .outline-list,.term-grid{grid-template-columns:1fr}
  .section-title{font-size:38px}
  .diagram{width:140px}
  .cmp-row,.law-col{flex-direction:column}
}
@media (prefers-reduced-motion:reduce){
  .outline-item,.thrust-item,.cmp-card,.law-card,.regime-card{animation:none;transition:none}
  .piston-anim .piston,.piston-anim .gas,.piston-anim .gas-label,.piston-anim .heat-out{animation:none}
  .piston-anim .heat-out{opacity:1}
}

@media (max-width:720px){
  .slide-heading{font-size:26px}
  .em-fig{width:100%}
  .dof-layout,.cpcv-layout{flex-direction:column}
}
/* ── Hook slide ─────────────────────────────────────────────────────────── */
.hook-q-wrap{margin:18px 0 6px}
.hook-q{display:flex;align-items:center;gap:14px;background:var(--panel);
  border:1px solid var(--rule);border-left:3px solid var(--accent-2);
  border-radius:10px;padding:16px 22px}
.hook-q-mark{font-size:32px;color:var(--accent-2);font-weight:700;line-height:1;flex-shrink:0}
.hook-q-text{font-size:20px;font-family:var(--display);color:var(--ink);line-height:1.3}

/* ── Merged from ThermodynamicsPresentation ────────────────────────────── */
.eq-label{font-size:12px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px}
.eq-terms{display:flex;flex-wrap:wrap;gap:5px 20px;margin-bottom:12px}
.eq-term{font-size:13px}
.sym{color:var(--accent);font-weight:700;font-style:italic}
.def{color:var(--muted)}
.bullet-list{list-style:none;display:flex;flex-direction:column;gap:8px}
.bullet-item{display:flex;gap:12px;align-items:flex-start;
  opacity:0;transform:translateX(-10px);transition:.35s ease}
.bullet-item.revealed{opacity:1;transform:none}
.bullet-marker{color:var(--accent);font-size:9px;margin-top:5px;flex-shrink:0}
.bullet-text{font-size:14px;line-height:1.5}
.bullet-text strong{color:var(--ink);display:block;font-size:15px}
.bullet-sub{color:var(--muted);font-size:13px;margin-top:3px;display:block}
.col-item{font-size:13px;line-height:1.5;color:var(--muted);padding:6px 0;
  border-bottom:1px solid var(--panel);opacity:0;transform:translateY(6px);
  transition:opacity .3s,transform .3s}
.col-item.revealed{opacity:1;transform:none}

/* ── Example slides (wind-tunnel worked examples) ───────────────────────── */
.ex-scenario{background:var(--panel);border:1px solid var(--rule);border-left:3px solid var(--accent);
  border-radius:8px;padding:10px 16px;margin-bottom:14px;font-size:14.5px;color:var(--ink);line-height:1.5}
.ex-scenario-lbl{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
  color:var(--accent);margin-right:8px}
.ex-steps{display:flex;flex-direction:column;gap:9px}
.ex-step{background:var(--bg);border:1px solid var(--rule);border-radius:8px;padding:10px 14px;
  opacity:0;transform:translateY(10px);transition:.38s ease}
.ex-step.revealed{opacity:1;transform:none}
.ex-step-hd{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.ex-step-num{width:22px;height:22px;border-radius:50%;background:var(--panel);
  border:1.5px solid var(--accent);color:var(--accent);font-size:12px;font-weight:700;
  display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ex-step-lbl{font-size:14px;font-weight:600;color:var(--ink)}
.ex-step-lbl sub,.ex-step-lbl sup{font-size:.7em}
.ex-eq{font-size:15px;margin:4px 0 6px;overflow-x:auto}
.ex-result{display:inline-block;background:var(--panel);border:1px solid var(--accent);
  border-radius:6px;padding:4px 16px;font-size:16px;color:var(--ink);margin:4px 0}
.ex-note{font-size:13.5px;color:var(--muted);line-height:1.45;margin:4px 0}
.ex-note em{color:var(--accent)}
.ex-note strong{color:var(--accent-2)}
.ex-question{display:flex;align-items:flex-start;gap:7px;margin-top:7px;padding:7px 10px;
  background:rgba(240,169,59,.07);border-left:2.5px solid var(--accent-2);
  border-radius:0 6px 6px 0;font-size:13px;color:var(--accent-2);font-style:italic;line-height:1.4}
.ex-q-mark{flex-shrink:0;font-weight:700;font-style:normal;font-size:14px;color:var(--accent-2)}

@media (prefers-reduced-motion:reduce){
  .anim-in,.reveal-block,.em-fig,.dof-band-item,.rel-card{animation:none;transition:none}
  .em-translational .em-body,.em-rotational .em-spin,
  .em-vibrational .em-left,.em-vibrational .em-right,.em-vibrational .em-coil,
  .em-electronic .em-electron{animation:none}
  .em-electronic .em-electron{transform:translate(130px,60px)}
  .dof-curve{transition:none}
  .cp-piston,.cp-gas,.cv-shimmer circle{animation:none}
  .cp-piston{transform:translateY(0)} .cp-gas{transform:scaleY(1)}
}
`
