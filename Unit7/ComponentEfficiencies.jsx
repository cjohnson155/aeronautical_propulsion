import { useState, useEffect, useCallback, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// ─────────────────────────────────────────────────────────────────────────────
//  Propulsion · Real Cycle & Component Efficiencies (Farokhi Ch. 4)
//  Rebuilt on the same presentation system as the Unit 4 Fluid Impulse deck:
//    • navy/cyan theme via CSS variables + <style>{CSS}
//    • type-driven slide renderers, KaTeX via the shared <Equation/>
//    • step-by-step reveals, click / arrow-key advance
//    • top bar · nav dots · progress bar
//
//  Slide types used: title · concept · diagram · equation · derive
//    'diagram' now also accepts an { image } (real photo) in place of a figure.
//
//  Signature figures (inline SVG, themed):
//    'station-map' – the turbojet gas path with numbered stations 0..9
//    'spool'       – turbine ↔ shaft ↔ compressor power balance
//
//  Diagrams re-play on hover/click and respect prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────────────────────

// ── real image assets (GitHub raw — build-independent) ───────────────────────
const IMG_SINGLE_SPOOL =
  'https://raw.githubusercontent.com/cjohnson155/aeronautical_propulsion/main/Images/Unit7/IMG_0057.jpeg'
const IMG_TWO_SPOOL =
  'https://raw.githubusercontent.com/cjohnson155/aeronautical_propulsion/main/Images/Unit7/IMG_0055.png'

export const meta = {
  courseId:  'Propulsion',
  deckTitle: 'Real Cycle & Component Efficiencies \u00b7 the losses that live in every station of a turbojet',
}

export const slides = [

  // ── TITLE ───────────────────────────────────────────────────────────────────
  {
    type: 'title',
    eyebrow: 'Propulsion \u00b7 Farokhi Ch. 4',
    title: 'Real Cycle &amp; Component Efficiencies',
    subtitle:
      'The ideal cycle pretends every component is perfect. Real hardware rubs, leaks, mixes, and burns imperfectly \u2014 and each shortfall is booked as an <strong>efficiency</strong> or a <strong>pressure ratio</strong>. This deck walks the gas path station by station and attaches the loss that lives at each one.',
    meta: [
      { label: 'Reference',  value: 'Farokhi \u00b7 Aircraft Propulsion, Ch. 4' },
      { label: 'Components', value: 'Inlet \u00b7 Compressor \u00b7 Burner \u00b7 Turbine \u00b7 Nozzle' },
      { label: 'Builds to',  value: 'Real turbojet thrust & TSFC' },
    ],
  },

  // ── SHARED LANGUAGE ──────────────────────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Shared Language',
    heading: 'Stagnation States, Stations &amp; Notation',
    intro:
      'Before any component, fix the vocabulary. Every state is a <strong>stagnation</strong> (total) state, every location is a numbered <strong>station</strong>, and every component is summarized by a temperature ratio &tau; and a pressure ratio &pi;.',
    figure: 'station-map',
    equation:
      'T_t = T\\left(1 + \\tfrac{\\gamma-1}{2}M^2\\right), \\qquad P_t = P\\left(1 + \\tfrac{\\gamma-1}{2}M^2\\right)^{\\gamma/(\\gamma-1)}',
    caption:
      'The turbojet gas path with its standard station numbers: 0 freestream, 2 compressor face, 3 compressor exit / burner inlet, 4 burner exit / turbine inlet, 5 turbine exit, 9 nozzle exit. Each labeled region below is one component \u2014 and one efficiency.',
    cards: [
      { tag: '\u03c4', accent: '#5ec8d8', label: 'Temperature Ratio',
        body: '&tau;<sub>x</sub> = T<sub>t,out</sub>&#8202;/&#8202;T<sub>t,in</sub> across a component: &tau;<sub>r</sub> ram, &tau;<sub>c</sub> compressor, &tau;<sub>b</sub> burner, &tau;<sub>t</sub> turbine. It tracks <strong>total temperature</strong> \u2014 i.e. energy.' },
      { tag: '\u03c0', accent: '#f0a93b', label: 'Pressure Ratio',
        body: '&pi;<sub>x</sub> = P<sub>t,out</sub>&#8202;/&#8202;P<sub>t,in</sub>: &pi;<sub>d</sub> diffuser, &pi;<sub>c</sub> compressor, &pi;<sub>b</sub> burner, &pi;<sub>n</sub> nozzle. It tracks <strong>total pressure</strong> \u2014 and every loss shows up as &pi; below its ideal value.' },
    ],
    bridge:
      'Walk the path in order. First the air has to get in and slow down.',
  },

  // ── INLET / DIFFUSER — PHYSICAL ──────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Inlet / Diffuser',
    heading: 'Inlet &amp; Diffuser',
    intro:
      'The first component the air meets. Its job is to <strong>decelerate</strong> the incoming stream and recover as much of its total pressure as possible before the compressor face at station 2.',
    cards: [
      { tag: 'Job', accent: '#5ec8d8', label: 'Purpose \u2014 Recover Ram Pressure',
        body: 'Slow the flow from flight Mach number to roughly M &asymp; 0.4\u20130.5 at the compressor face, turning kinetic energy into a <strong>total-pressure rise</strong> with no moving parts. Ideally P<sub>t</sub> is conserved: &pi;<sub>d</sub> = 1.' },
      { tag: 'Loss', accent: '#f0a93b', label: 'Physical Loss Mechanisms',
        body: 'Wall friction and <strong>boundary-layer growth</strong> in the adverse gradient of a diffusing duct; separation if diffused too fast; and, in supersonic flight, <strong>shock losses</strong>. All of it drops P<sub>t</sub>, so &pi;<sub>d</sub> &lt; 1.' },
      { tag: 'M&gt;1', accent: '#5ec8d8', label: 'Supersonic Inlets Are Different',
        body: 'Above M &asymp; 1 the recovery is dominated by the <strong>shock system</strong>, and a reference &pi;<sub>d,max</sub>(M<sub>0</sub>) is often specified. Subsonic diffusers are friction-limited; supersonic ones are shock-limited.' },
    ],
    bridge:
      'Whatever the mechanism, the loss collapses to one number. Define it.',
  },

  // ── INLET / DIFFUSER — DEFINITION ────────────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Inlet / Diffuser',
    heading: 'Diffuser Pressure Recovery',
    intro:
      'The diffuser is adiabatic \u2014 it adds no energy \u2014 so its total temperature is unchanged and the only thing left to track is the <strong>total-pressure recovery</strong>.',
    equation:
      '\\tau_d = 1, \\qquad \\pi_d = \\frac{P_{t2}}{P_{t0}}, \\qquad \\eta_d = \\frac{T_{t2s}-T_0}{T_{t2}-T_0}',
    equationLabel: 'Adiabatic: no work, no heat \u2014 only lost pressure',
    terms: [
      { sym: '\\tau_d = 1', def: 'No shaft work and no heat addition \u2014 total temperature is conserved through the inlet.' },
      { sym: '\\pi_d',      def: 'Total-pressure recovery; the headline diffuser figure of merit. Ideal &pi;<sub>d</sub> = 1.' },
      { sym: '\\eta_d',     def: 'Adiabatic efficiency: ideal vs actual temperature rise for the pressure recovery achieved.' },
      { sym: 'P_{t2}',      def: 'Compressor-face total pressure \u2014 the starting point for the compressor.' },
    ],
    cards: [
      { label: 'Why total temperature is the giveaway',
        body: 'Because &tau;<sub>d</sub> = 1, the inlet cannot change the flow\u2019s energy \u2014 only redistribute it between static and dynamic, and shed some P<sub>t</sub> to friction and shocks along the way.' },
    ],
    bridge:
      'Now the air is slow and dense at station 2. Time to do work on it.',
  },

  // ── SPOOL ARCHITECTURE (real image) ──────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Compressor \u00b7 Context First',
    heading: 'How Many Spools?',
    intro:
      'Before the compressor math, one architecture question. Real engines rarely compress on a single shaft.',
    image: {
      src: IMG_TWO_SPOOL,
      alt: 'Two-spool compressor: low-pressure (N1) and high-pressure (N2) rotors on concentric drive shafts',
      caption:
        'FAA, Pilot\u2019s Handbook of Aeronautical Knowledge (public domain). Two concentric spools \u2014 a low-pressure compressor (N<sub>1</sub>) and a high-pressure compressor (N<sub>2</sub>), each driven by its own turbine.',
    },
    cards: [
      { tag: 'Split', accent: '#5ec8d8', label: 'Real Engines Split the Compression',
        body: 'Large engines use two or three <strong>spools</strong> on concentric shafts. Each spool is driven by \u2014 and speed-matched to \u2014 its own turbine, so every stage can run near its <strong>best efficiency</strong>.' },
      { tag: '1', accent: '#f0a93b', label: 'Today: a Single Spool',
        body: 'Our worked engine is a <strong>single-spool turbojet</strong>: one compressor, one turbine, one shaft, and exactly <em>one</em> power balance. Everything that follows assumes this.' },
    ],
    bridge:
      'One shaft, one compressor. Look at what it is and why it is hard.',
  },

  // ── COMPRESSOR — PHYSICAL (real image) ───────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Compressor \u00b7 What &amp; Why',
    heading: 'Compressor',
    intro:
      'The compressor raises the total pressure of the air before combustion \u2014 and it is the hardest component in the engine to make efficient.',
    image: {
      src: IMG_SINGLE_SPOOL,
      alt: 'Single-spool axial compressor cutaway showing stator vanes, rotor blades, and the main shaft',
      caption:
        'Single-spool axial compressor cutaway \u2014 rotor rows add energy, stator rows diffuse it to pressure. [confirm source before publishing]',
    },
    cards: [
      { tag: 'Job', accent: '#5ec8d8', label: 'Purpose &amp; Source of Power',
        body: 'Raises the <strong>total pressure</strong> of the incoming air. Rotor rows add energy; stator rows diffuse it to pressure. The work is <strong>not free</strong> \u2014 it is supplied by the turbine through the shaft, closed by the power balance.' },
      { tag: 'Loss', accent: '#f0a93b', label: 'Physical Loss Mechanisms',
        body: 'Blade-profile and endwall friction, boundary-layer growth in the adverse gradient, <strong>tip-clearance leakage</strong>, wake mixing between rows, and shock losses in transonic stages. Together they make the compression non-isentropic: &eta;<sub>c</sub> &lt; 1.' },
    ],
    bridge:
      'Why does one compressor need sixteen stages when one turbine needs three?',
  },

  // ── WHY MULTI-STAGE (derivation) ─────────────────────────────────────────────
  {
    type: 'derive',
    sectionNumber: 'Compressor \u00b7 Key Constraint',
    heading: 'Why So Many Stages?',
    intro:
      'Compression runs <strong>uphill</strong>: the flow moves against an adverse pressure gradient, so each blade row can only diffuse it a little before the boundary layer separates.',
    steps: [
      { n: '1', tag: 'The physical limit', eq: '\\frac{W_2}{W_1} \\;\\gtrsim\\; 0.72',
        note: 'The de Haller criterion: decelerate the relative flow across a row by more than this and the blade boundary layer <strong>separates</strong> \u2014 stall and surge. Each row may diffuse only so much.' },
      { n: '2', tag: 'Consequence', eq: '\\pi_{\\text{stage}} \\approx 1.15\\text{\u2013}1.4',
        note: 'That diffusion limit caps the pressure rise <em>per stage</em>. Falling efficiency with stage loading is the consequence of this limit, not its root cause.' },
      { n: '3', tag: 'Small rises multiply', eq: '\\pi_c = \\prod_{i=1}^{N}\\pi_{s,i} = \\pi_s^{\\,N}',
        note: 'Stage pressure ratios <strong>multiply</strong>, not add. To build a large overall ratio you stack many small stages in series.' },
      { n: '4', tag: 'Count them', eq: 'N = \\frac{\\ln \\pi_c}{\\ln \\pi_s} \\;\\Rightarrow\\; \\frac{\\ln 20}{\\ln 1.2} \\approx 16',
        note: 'A useful &pi;<sub>c</sub> &asymp; 6\u201320 therefore needs <strong>~14\u201316 stages</strong> \u2014 exactly what real axial compressors run.' },
    ],
    result: {
      eq: '\\text{1\u20133 turbine stages} \\;\\longrightarrow\\; \\text{14\u201316 compressor stages}',
      label: 'The turbine runs the opposite gradient (favorable, dp/dx < 0), so its boundary layer stays attached and one turbine stage does the work of many compressor stages.',
    },
    closer:
      'The asymmetry is entirely about which way the pressure gradient points. <strong>Uphill is expensive; downhill is cheap.</strong>',
  },

  // ── COMPRESSOR — DEFINITION (filled η_c) ─────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Compressor \u00b7 Definitions',
    heading: 'Compressor Isentropic Efficiency',
    intro:
      'The efficiency is the <strong>ideal work over the actual work</strong> for the same pressure ratio \u2014 how much of the shaft work actually became useful compression.',
    equation:
      '\\eta_c = \\frac{h_{t3s}-h_{t2}}{h_{t3}-h_{t2}} = \\frac{T_{t3s}-T_{t2}}{T_{t3}-T_{t2}} = \\frac{\\pi_c^{(\\gamma-1)/\\gamma}-1}{\\tau_c-1}',
    equationLabel: 'Ideal (isentropic) work \u00f7 actual work',
    terms: [
      { sym: '\\pi_c',   def: 'Design compressor total-pressure ratio, P<sub>t3</sub>/P<sub>t2</sub>.' },
      { sym: '\\tau_c',  def: 'Actual compressor total-temperature ratio, T<sub>t3</sub>/T<sub>t2</sub>.' },
      { sym: '\\eta_c',  def: 'Measured isentropic efficiency \u2014 the gap between ideal and actual.' },
      { sym: '\\gamma',  def: 'Ratio of specific heats; &asymp; 1.4 for the cold compressor air.' },
    ],
    cards: [
      { label: 'Governing stagnation relations',
        body: '&tau;<sub>c</sub> = 1 + (&pi;<sub>c</sub><sup>(&gamma;\u22121)/&gamma;</sup> &minus; 1)&#8202;/&#8202;&eta;<sub>c</sub>, then T<sub>t3</sub> = &tau;<sub>c</sub>T<sub>t2</sub> and P<sub>t3</sub> = &pi;<sub>c</sub>P<sub>t2</sub>.' },
      { label: 'Depends on \u2192 sets up',
        body: 'Given T<sub>t2</sub>, P<sub>t2</sub> from the inlet plus design &pi;<sub>c</sub>, measured &eta;<sub>c</sub>, and &gamma;, it <strong>sets the burner-inlet state</strong> T<sub>t3</sub>, P<sub>t3</sub>.' },
    ],
    bridge:
      'Hand T<sub>t3</sub>, P<sub>t3</sub> to the burner and light it.',
  },

  // ── BURNER — PHYSICAL ────────────────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Burner',
    heading: 'Burner / Combustor',
    intro:
      'The burner adds energy by <strong>chemical release</strong> at nominally constant pressure, raising the total temperature from T<sub>t3</sub> to the turbine-inlet limit T<sub>t4</sub>.',
    cards: [
      { tag: 'Job', accent: '#5ec8d8', label: 'Purpose \u2014 Add Heat, Not Pressure',
        body: 'Burn fuel to drive T<sub>t4</sub> up to the material limit of the turbine \u2014 the hottest point in the engine. Ideally this happens with <strong>no pressure loss</strong>: &pi;<sub>b</sub> = 1.' },
      { tag: 'Loss', accent: '#f0a93b', label: 'Two Independent Losses',
        body: 'Incomplete combustion wastes a little fuel energy (&eta;<sub>b</sub> &lt; 1), while friction and <strong>heat-addition drag</strong> drop total pressure (&pi;<sub>b</sub> &lt; 1). <strong>Keep them separate</strong> \u2014 they are different physics.' },
    ],
    bridge:
      'Two losses, plus a new unknown that is born here: the fuel-air ratio.',
  },

  // ── BURNER — DEFINITION ──────────────────────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Burner \u00b7 Definitions',
    heading: 'Combustion Efficiency, Pressure Loss &amp; f',
    intro:
      'Three quantities \u2014 and it is essential not to blur the first two. One is about <strong>energy released</strong>; the other is about <strong>pressure kept</strong>.',
    equation:
      '\\eta_b = \\frac{\\dot{m}_a c_p (T_{t4}-T_{t3})}{\\dot{m}_f\\, Q_R}, \\qquad \\pi_b = \\frac{P_{t4}}{P_{t3}}, \\qquad f = \\frac{\\dot{m}_f}{\\dot{m}_a}',
    equationLabel: 'Energy efficiency \u00b7 pressure loss \u00b7 fuel-air ratio',
    terms: [
      { sym: '\\eta_b', def: 'Combustion efficiency: fraction of chemical energy actually released as enthalpy rise.' },
      { sym: '\\pi_b',  def: 'Burner total-pressure ratio; always slightly below 1 (friction + heat-addition loss).' },
      { sym: 'Q_R',     def: 'Fuel heating value \u2014 energy released per unit mass of fuel burned.' },
      { sym: 'f',       def: 'Fuel-air ratio; it is <em>born here</em>, from the burner energy balance.' },
    ],
    cards: [
      { label: 'Solve the energy balance for f',
        body: 'Rearranging: f = c<sub>p</sub>(T<sub>t4</sub> &minus; T<sub>t3</sub>)&#8202;/&#8202;(&eta;<sub>b</sub>Q<sub>R</sub> &minus; c<sub>p</sub>T<sub>t4</sub>). The T<sub>t4</sub> term in the denominator accounts for heating the added fuel mass too.' },
      { label: 'Convention flag \u2014 fix it now',
        body: 'Does the turbine mass flow include the added fuel, (1 + f)? Pick a convention at the burner and carry it consistently through the turbine and nozzle.' },
    ],
    bridge:
      'The hot, high-pressure gas at station 4 now pays the compressor back.',
  },

  // ── TURBINE — PHYSICAL ───────────────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Turbine',
    heading: 'Turbine',
    intro:
      'The turbine extracts shaft work from the hot gas to <strong>drive the compressor</strong>. It is the compressor\u2019s mirror image \u2014 and an easier one.',
    cards: [
      { tag: 'Job', accent: '#5ec8d8', label: 'Purpose \u2014 Power the Shaft',
        body: 'Expand the gas from station 4 to 5, turning total enthalpy into shaft work. That work exists for one reason: to <strong>turn the compressor</strong>. What it does not use leaves as pressure for the nozzle.' },
      { tag: 'Easy', accent: '#f0a93b', label: 'A Favorable Gradient',
        body: 'The flow <strong>accelerates</strong> through a turbine (dp/dx &lt; 0), so the boundary layer stays attached. One stage can do the work of many compressor stages \u2014 turbine efficiencies are high and stage counts are low.' },
    ],
    bridge:
      'Its efficiency looks like the compressor\u2019s, flipped.',
  },

  // ── TURBINE — DEFINITION ─────────────────────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Turbine \u00b7 Definitions',
    heading: 'Turbine Isentropic Efficiency',
    intro:
      'Now the ratio is <strong>actual work over ideal work</strong> \u2014 the reciprocal arrangement of the compressor, because the turbine gives work out instead of taking it in.',
    equation:
      '\\eta_t = \\frac{h_{t4}-h_{t5}}{h_{t4}-h_{t5s}} = \\frac{1-\\tau_t}{1-\\pi_t^{(\\gamma-1)/\\gamma}}',
    equationLabel: 'Actual work \u00f7 ideal (isentropic) work',
    terms: [
      { sym: '\\tau_t', def: 'Turbine total-temperature ratio T<sub>t5</sub>/T<sub>t4</sub> (&lt; 1 \u2014 the gas cools as it works).' },
      { sym: '\\pi_t',  def: 'Turbine total-pressure ratio P<sub>t5</sub>/P<sub>t4</sub> (&lt; 1).' },
      { sym: '\\eta_t', def: 'Turbine isentropic efficiency; typically higher than &eta;<sub>c</sub>.' },
      { sym: '\\gamma', def: 'Ratio of specific heats; &asymp; 1.33 for the hot combustion gas.' },
    ],
    cards: [
      { label: 'Invert for the temperature ratio',
        body: '&tau;<sub>t</sub> = 1 &minus; &eta;<sub>t</sub>(1 &minus; &pi;<sub>t</sub><sup>(&gamma;\u22121)/&gamma;</sup>). But &tau;<sub>t</sub> is not free to choose \u2014 the shaft decides it.' },
    ],
    bridge:
      'What sets &tau;<sub>t</sub>? The one constraint that ties the whole engine together.',
  },

  // ── POWER BALANCE (spool figure) ─────────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Closing the Cycle',
    heading: 'Turbine\u2013Compressor Power Balance',
    intro:
      'The compressor and turbine share a shaft, so the turbine <strong>must</strong> deliver exactly the compressor\u2019s work (less mechanical losses). This is the link that closes the cycle.',
    figure: 'spool',
    equation:
      '\\eta_m\\,\\dot{m}_t\\, c_p (T_{t4}-T_{t5}) = \\dot{m}_c\\, c_p (T_{t3}-T_{t2})',
    caption:
      'One shaft, two rotors. The turbine\u2019s extracted work, discounted by mechanical efficiency &eta;<sub>m</sub>, equals the compressor\u2019s required work. Solve this single equation and the turbine temperature ratio &tau;<sub>t</sub> falls out.',
    cards: [
      { tag: '\u03c4\u209c', accent: '#5ec8d8', label: 'Determined, Not Chosen',
        body: 'The compressor sets the work demand; the shaft transmits it; so <strong>&tau;<sub>t</sub> is fixed</strong> by the balance, not picked by the designer. Everything downstream follows from it.' },
      { tag: '\u03b7\u2098', accent: '#f0a93b', label: 'Mechanical Efficiency',
        body: 'Bearing and windage losses mean a little turbine work never reaches the compressor: &eta;<sub>m</sub> &lt; 1, usually above 0.98. Small, but it belongs in the balance.' },
    ],
    bridge:
      'With &tau;<sub>t</sub> known, only one component stands between the gas and the sky.',
  },

  // ── NOZZLE — PHYSICAL ────────────────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Nozzle',
    heading: 'Nozzle',
    intro:
      'The nozzle converts the leftover total pressure at station 5 into a <strong>high-velocity jet</strong> at station 9 \u2014 the momentum that becomes thrust.',
    cards: [
      { tag: 'Job', accent: '#5ec8d8', label: 'Purpose \u2014 Make Jet Velocity',
        body: 'Accelerate the gas by expanding it toward ambient pressure, trading total pressure for kinetic energy. The exit velocity u<sub>9</sub> is exactly what the thrust equation cares about.' },
      { tag: 'Easy', accent: '#f0a93b', label: 'A Favorable Gradient Again',
        body: 'Like the turbine, the nozzle <strong>accelerates</strong> the flow, so losses are small: some friction and, at high pressure ratio, under- or over-expansion. Recovery &pi;<sub>n</sub> stays close to 1.' },
    ],
    bridge:
      'One last figure of merit, then the whole chain assembles.',
  },

  // ── NOZZLE — DEFINITION ──────────────────────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Nozzle \u00b7 Definitions',
    heading: 'Nozzle Efficiency &amp; \u03c0<sub>n</sub>',
    intro:
      'Adiabatic again \u2014 &tau;<sub>n</sub> = 1 \u2014 so the nozzle is scored on how much of the ideal jet kinetic energy it actually delivers.',
    equation:
      '\\tau_n = 1, \\qquad \\pi_n = \\frac{P_{t9}}{P_{t7}}, \\qquad \\eta_n = \\frac{u_9^2}{u_{9s}^2} = \\frac{h_{t7}-h_9}{h_{t7}-h_{9s}}',
    equationLabel: 'Actual jet KE \u00f7 ideal jet KE',
    terms: [
      { sym: '\\tau_n = 1', def: 'Adiabatic and no work \u2014 total temperature is conserved to the exit.' },
      { sym: '\\pi_n',      def: 'Nozzle total-pressure ratio; close to 1 for a well-designed nozzle.' },
      { sym: '\\eta_n',     def: 'Nozzle efficiency: actual exit kinetic energy over the isentropic ideal.' },
      { sym: 'u_9',         def: 'Exit velocity \u2014 the quantity the thrust equation is built on.' },
    ],
    bridge:
      'Every component now carries its &tau; and &pi;. Multiply the chain.',
  },

  // ── ASSEMBLY ─────────────────────────────────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Putting It Together',
    heading: 'Real Turbojet Cycle Analysis',
    intro:
      'Chain the temperature and pressure ratios station by station \u2014 exactly the ideal-cycle walk, but with each perfect stage swapped for its <strong>efficiency-corrected</strong> version.',
    equation:
      '\\tau_\\lambda = \\tau_r\\,\\tau_d\\,\\tau_c\\,\\tau_b\\,\\tau_t\\,\\tau_n, \\qquad \\frac{P_{t9}}{P_0} = \\pi_r\\,\\pi_d\\,\\pi_c\\,\\pi_b\\,\\pi_t\\,\\pi_n',
    equationLabel: 'Station-by-station product of the component ratios',
    terms: [
      { sym: '\\tau_\\lambda', def: 'Overall total-temperature ratio, freestream through nozzle exit.' },
      { sym: '\\tau_r,\\ \\pi_r', def: 'Ram (flight) ratios carrying the freestream up to stagnation.' },
      { sym: '(1+f)',         def: 'Mass-flow bookkeeping if the fuel is carried through the turbine and nozzle.' },
      { sym: 'P_{t9}/P_0',    def: 'Nozzle-exit total pressure over ambient \u2014 sets whether the nozzle is choked.' },
    ],
    cards: [
      { label: 'Specific thrust',
        body: 'F/&#7745;<sub>0</sub> = (1 + f)u<sub>9</sub> &minus; u<sub>0</sub> + (p<sub>9</sub> &minus; p<sub>0</sub>)A<sub>9</sub>/&#7745;<sub>0</sub>. Every term traces back to a station state built from the &tau;/&pi; chain.' },
      { label: 'TSFC',
        body: 'TSFC = f&#8202;/&#8202;(F/&#7745;<sub>0</sub>). The fuel-air ratio born in the burner, divided by the specific thrust the chain produced \u2014 the number the customer actually pays for.' },
    ],
    bridge:
      'Same chain as the ideal cycle \u2014 each link now honest about its losses. <em>That</em> is the real cycle.',
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

// ─── HTML-safe span ──────────────────────────────────────────────────────────
function HTML({ children, className }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: children }} />
}

// ─── Diagrams (themed navy/cyan, re-play on hover/click) ─────────────────────
function Figure({ name }) {
  const [run, setRun] = useState(0)
  const replay = () => setRun(r => r + 1)
  const common = {
    className: 'q1d-svg',
    onMouseEnter: replay,
    onClick: (e) => { e.stopPropagation(); replay() },
    'aria-hidden': true,
  }

  // ── turbojet gas path with numbered stations ───────────────────────────────
  if (name === 'station-map') {
    const stations = [['0', 70], ['2', 150], ['3', 235], ['4', 300], ['5', 368], ['9', 470]]
    return (
      <svg viewBox="0 0 520 250" {...common}>
        <g key={run}>
          <line x1="40" y1="125" x2="500" y2="125" className="q1d-axisline" />
          {/* duct walls (symmetric about the axis) */}
          <path d="M64 96 L120 88 L235 100 L300 96 L368 100 L470 112" className="q1d-wall q1d-draw" />
          <path d="M64 154 L120 162 L235 150 L300 154 L368 150 L470 138" className="q1d-wall q1d-draw" />
          {/* compressor blade rows (cyan) */}
          {[132, 146, 160, 174, 188, 202].map((x, i) => (
            <line key={`c${i}`} x1={x} y1="92" x2={x} y2="158"
              className="q1d-blade q1d-blade--a q1d-grow" style={{ animationDelay: `${i * 40}ms` }} />
          ))}
          {/* burner */}
          <rect x="240" y="104" width="55" height="42" rx="4" className="q1d-burner" />
          <text x="267" y="129" className="q1d-t q1d-t--sm" textAnchor="middle">burner</text>
          {/* turbine blade rows (orange) */}
          {[308, 322, 336, 350].map((x, i) => (
            <line key={`t${i}`} x1={x} y1="98" x2={x} y2="152"
              className="q1d-blade q1d-blade--r q1d-grow" style={{ animationDelay: `${240 + i * 40}ms` }} />
          ))}
          {/* inlet flow + exhaust jet */}
          <line x1="28" y1="125" x2="60" y2="125" className="q1d-core-arrow" markerEnd="url(#sm-a)" />
          <line x1="474" y1="125" x2="502" y2="125" className="q1d-bl-arrow" markerEnd="url(#sm-b)" />
          <text x="28" y="112" className="q1d-t q1d-t--sm">u&#8320;, p&#8320;</text>
          <text x="500" y="112" className="q1d-t q1d-t--o" textAnchor="end">jet</text>
          {/* station cuts + badges */}
          {stations.map(([l, x]) => (
            <g key={l}>
              <line x1={x} y1="72" x2={x} y2="180" className="q1d-station" />
              <circle cx={x} cy="70" r="9" className="q1d-body" />
              <circle cx={x} cy="70" r="9" className="q1d-badge" />
              <text x={x} y="74" className="q1d-t q1d-t--sm" textAnchor="middle">{l}</text>
            </g>
          ))}
          {/* component regions */}
          <text x="107" y="206" className="q1d-t q1d-t--a" textAnchor="middle">inlet</text>
          <text x="192" y="206" className="q1d-t q1d-t--a" textAnchor="middle">compressor</text>
          <text x="267" y="206" className="q1d-t q1d-t--r" textAnchor="middle">burner</text>
          <text x="334" y="206" className="q1d-t q1d-t--r" textAnchor="middle">turbine</text>
          <text x="419" y="206" className="q1d-t q1d-t--a" textAnchor="middle">nozzle</text>
          <text x="70" y="30" className="q1d-t q1d-t--sm">stations number the gas path 0 &rarr; 9</text>
        </g>
        <defs>
          <marker id="sm-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-a" /></marker>
          <marker id="sm-b" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-o" /></marker>
        </defs>
      </svg>
    )
  }

  // ── turbine ↔ shaft ↔ compressor power balance ─────────────────────────────
  if (name === 'spool') {
    return (
      <svg viewBox="0 0 520 230" {...common}>
        <g key={run}>
          {/* shaft */}
          <line x1="150" y1="115" x2="370" y2="115" className="q1d-wall" />
          {/* compressor block (cyan) */}
          <path d="M120 72 L200 86 L200 144 L120 158 Z" className="q1d-body" />
          <path d="M120 72 L200 86 L200 144 L120 158 Z" className="q1d-cowl" />
          {[134, 150, 166, 182].map((x, i) => (
            <line key={`c${i}`} x1={x} y1="76" x2={x} y2="154"
              className="q1d-blade q1d-blade--a q1d-grow" style={{ animationDelay: `${i * 45}ms` }} />
          ))}
          <text x="160" y="52" className="q1d-t q1d-t--a" textAnchor="middle">compressor</text>
          <text x="160" y="182" className="q1d-t q1d-t--sm" textAnchor="middle">needs the work</text>

          {/* turbine block (orange) */}
          <path d="M320 86 L400 72 L400 158 L320 144 Z" className="q1d-body" />
          <path d="M320 86 L400 72 L400 158 L320 144 Z" className="q1d-cowl" />
          {[338, 354, 370, 386].map((x, i) => (
            <line key={`t${i}`} x1={x} y1="76" x2={x} y2="154"
              className="q1d-blade q1d-blade--r q1d-grow" style={{ animationDelay: `${180 + i * 45}ms` }} />
          ))}
          <text x="360" y="52" className="q1d-t q1d-t--r" textAnchor="middle">turbine</text>
          <text x="360" y="182" className="q1d-t q1d-t--sm" textAnchor="middle">supplies the work</text>

          {/* power transmitted along the shaft, turbine -> compressor */}
          <line x1="312" y1="102" x2="208" y2="102" className="q1d-sarrow" markerEnd="url(#sp-a)" />
          <text x="260" y="94" className="q1d-t q1d-t--o" textAnchor="middle">&eta;&#8344; &middot; shaft power</text>
          <text x="260" y="130" className="q1d-t q1d-t--sm" textAnchor="middle">one shaft</text>

          {/* the balance */}
          <text x="260" y="212" className="q1d-t q1d-t--sm" textAnchor="middle">&eta;&#8344; &middot; (turbine work) = (compressor work) &nbsp;&rarr;&nbsp; solves &tau;&#8348;</text>
        </g>
        <defs>
          <marker id="sp-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-o" /></marker>
        </defs>
      </svg>
    )
  }

  return null
}

// ─── Slide renderers ─────────────────────────────────────────────────────────
function TitleSlide({ slide }) {
  return (
    <div className="slide-inner title-slide anim-in">
      {slide.eyebrow && <div className="eyebrow">{slide.eyebrow}</div>}
      <h1 className="main-title" dangerouslySetInnerHTML={{ __html: slide.title }} />
      <div className="title-divider" />
      {slide.subtitle && <p className="title-subtitle"><HTML>{slide.subtitle}</HTML></p>}
      {slide.meta && (
        <div className="title-meta">
          {slide.meta.map((m, i) => (
            <div className="meta-item" key={i}>
              <div className="meta-label">{m.label}</div>
              <div className="meta-value">{m.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SlideHead({ slide }) {
  return (
    <>
      <div className="section-number anim-in">{slide.sectionNumber}</div>
      <h2 className="slide-heading anim-in"><HTML>{slide.heading}</HTML></h2>
      <div className="heading-rule anim-in" />
    </>
  )
}

function ConceptSlide({ slide, revealed }) {
  return (
    <div className="slide-inner compress-slide">
      <SlideHead slide={slide} />
      {slide.intro && (
        <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
          <p className="cf-note cf-note--lead"><HTML>{slide.intro}</HTML></p>
        </div>
      )}
      <div className="cmp-row">
        {(slide.cards || []).map((c, i) => (
          <div key={i} className={`cmp-card reveal-block${revealed > i + 1 ? ' revealed' : ''}`}
               style={{ borderTopColor: c.accent }}>
            <div className="cmp-head">
              <span className="cmp-tag" style={{ background: c.accent }}><HTML>{c.tag}</HTML></span>
              <span className="cmp-label">{c.label}</span>
            </div>
            <div className="cmp-item"><span><HTML>{c.body}</HTML></span></div>
          </div>
        ))}
      </div>
      {slide.bridge && (
        <div className={`reveal-block cf-bridge${revealed > (slide.cards?.length || 0) + 1 ? ' revealed' : ''}`}>
          <HTML>{slide.bridge}</HTML>
        </div>
      )}
    </div>
  )
}

function DiagramSlide({ slide, revealed }) {
  const cards = slide.cards || []
  let step = 1
  const figStep = ++step
  const eqStep  = slide.equation ? ++step : null
  const cardStart = step + 1
  const bridgeStep = cardStart + cards.length
  const caption = slide.image?.caption || slide.caption
  return (
    <div className="slide-inner compress-slide">
      <SlideHead slide={slide} />
      {slide.intro && (
        <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
          <p className="cf-note cf-note--lead"><HTML>{slide.intro}</HTML></p>
        </div>
      )}
      {(slide.figure || slide.image) && (
        <figure className={`q1d-fig reveal-block${revealed >= figStep ? ' revealed' : ''}`}>
          {slide.image
            ? <div className="q1d-imgwrap"><img className="q1d-img" src={slide.image.src} alt={slide.image.alt || ''} /></div>
            : <Figure name={slide.figure} />}
          {caption && <figcaption><HTML>{caption}</HTML></figcaption>}
        </figure>
      )}
      {slide.equation && (
        <div className={`reveal-block eq-row${revealed >= eqStep ? ' revealed' : ''}`}>
          <div className="eq-box"><Equation latex={slide.equation} /></div>
        </div>
      )}
      {cards.length > 0 && (
        <div className="cmp-row cmp-row--tight">
          {cards.map((c, i) => (
            <div key={i} className={`cmp-card reveal-block${revealed >= cardStart + i ? ' revealed' : ''}`}
                 style={{ borderTopColor: c.accent }}>
              <div className="cmp-head">
                <span className="cmp-tag" style={{ background: c.accent }}><HTML>{c.tag}</HTML></span>
                <span className="cmp-label">{c.label}</span>
              </div>
              <div className="cmp-item"><span><HTML>{c.body}</HTML></span></div>
            </div>
          ))}
        </div>
      )}
      {slide.bridge && (
        <div className={`reveal-block cf-bridge${revealed >= bridgeStep ? ' revealed' : ''}`}>
          <HTML>{slide.bridge}</HTML>
        </div>
      )}
    </div>
  )
}

function EquationSlide({ slide, revealed }) {
  const cards = slide.cards || []
  return (
    <div className="slide-inner compress-slide">
      <SlideHead slide={slide} />
      {slide.intro && (
        <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
          <p className="cf-note cf-note--lead"><HTML>{slide.intro}</HTML></p>
        </div>
      )}
      <div className={`reveal-block eq-row${revealed > 1 ? ' revealed' : ''}`}>
        <div className="eq-box"><Equation latex={slide.equation} /></div>
        <div className="eq-aside">{slide.equationLabel && <HTML>{slide.equationLabel}</HTML>}</div>
      </div>
      {slide.terms && (
        <div className={`reveal-block term-grid${revealed > 2 ? ' revealed' : ''}`}>
          {slide.terms.map((t, i) => (
            <div className="term-item" key={i}>
              <span className="term-sym"><Equation latex={t.sym} display={false} /></span>
              <span className="term-def"><HTML>{t.def}</HTML></span>
            </div>
          ))}
        </div>
      )}
      {cards.map((c, i) => (
        <div key={i} className={`reveal-block mini-card${revealed > i + 3 ? ' revealed' : ''}`}>
          <strong><HTML>{c.label}</HTML></strong>
          <span><HTML>{c.body}</HTML></span>
        </div>
      ))}
      {slide.bridge && (
        <div className={`reveal-block cf-bridge${revealed > 2 + cards.length + 1 ? ' revealed' : ''}`}>
          <HTML>{slide.bridge}</HTML>
        </div>
      )}
    </div>
  )
}

function SystemSlide({ slide, revealed }) {
  return (
    <div className="slide-inner compress-slide">
      <SlideHead slide={slide} />
      {slide.intro && (
        <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
          <p className="cf-note cf-note--lead"><HTML>{slide.intro}</HTML></p>
        </div>
      )}
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
      {(slide.closer || slide.bridge) && (
        <div className={`reveal-block cf-bridge${revealed > slide.laws.length + 1 ? ' revealed' : ''}`}>
          <HTML>{slide.closer || slide.bridge}</HTML>
        </div>
      )}
    </div>
  )
}

function CompareSlide({ slide, revealed }) {
  return (
    <div className="slide-inner compress-slide">
      <SlideHead slide={slide} />
      {slide.intro && (
        <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
          <p className="cf-note cf-note--lead"><HTML>{slide.intro}</HTML></p>
        </div>
      )}
      <div className="cmp-row">
        {slide.regimes.map((r, i) => (
          <div key={i} className={`regime-card reveal-block${revealed > i + 1 ? ' revealed' : ''}`}
               style={{ borderTopColor: r.accent }}>
            <div className="regime-head">
              <span className="regime-tag" style={{ background: r.accent }}><HTML>{r.tag}</HTML></span>
              <span className="regime-label">{r.label}</span>
            </div>
            <strong className="regime-headline" style={{ color: r.accent }}><HTML>{r.head}</HTML></strong>
            <p className="regime-body"><HTML>{r.body}</HTML></p>
          </div>
        ))}
      </div>
      {slide.closer && (
        <div className={`reveal-block cf-bridge${revealed > slide.regimes.length + 1 ? ' revealed' : ''}`}>
          <HTML>{slide.closer}</HTML>
        </div>
      )}
    </div>
  )
}

// ─── stepped derivation slide ────────────────────────────────────────────────
function DeriveSlide({ slide, revealed }) {
  const steps = slide.steps || []
  const resultStep = steps.length + 1
  const closerStep = resultStep + (slide.result ? 1 : 0)
  return (
    <div className="slide-inner compress-slide">
      <SlideHead slide={slide} />
      {slide.intro && (
        <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
          <p className="cf-note cf-note--lead"><HTML>{slide.intro}</HTML></p>
        </div>
      )}
      <div className="drv-col">
        {steps.map((s, i) => (
          <div key={i} className={`drv-row reveal-block${revealed > i + 1 ? ' revealed' : ''}`}>
            <span className="drv-num">{s.n}</span>
            <div className="drv-body">
              {s.tag && <div className="drv-tag">{s.tag}</div>}
              <div className="drv-eq"><Equation latex={s.eq} /></div>
              {s.note && <p className="drv-note"><HTML>{s.note}</HTML></p>}
            </div>
          </div>
        ))}
      </div>
      {slide.result && (
        <div className={`reveal-block drv-result${revealed > resultStep ? ' revealed' : ''}`}>
          <div className="drv-result-eq"><Equation latex={slide.result.eq} /></div>
          {slide.result.label && <div className="drv-result-label"><HTML>{slide.result.label}</HTML></div>}
        </div>
      )}
      {slide.closer && (
        <div className={`reveal-block cf-bridge${revealed > closerStep ? ' revealed' : ''}`}>
          <HTML>{slide.closer}</HTML>
        </div>
      )}
    </div>
  )
}

// ─── Steps per slide ─────────────────────────────────────────────────────────
function totalSteps(slide) {
  switch (slide.type) {
    case 'concept':  return 1 + (slide.cards?.length || 0) + (slide.bridge ? 1 : 0)
    case 'diagram': {
      let s = 1
      if (slide.equation) s += 1
      s += (slide.cards?.length || 0)
      if (slide.bridge) s += 1
      return 1 + s
    }
    case 'equation': return 3 + (slide.cards?.length || 0) + (slide.bridge ? 1 : 0)
    case 'system':   return 1 + (slide.laws?.length || 0) + ((slide.closer || slide.bridge) ? 1 : 0)
    case 'compare':  return 1 + (slide.regimes?.length || 0) + (slide.closer ? 1 : 0)
    case 'derive':   return 1 + (slide.steps?.length || 0) + (slide.result ? 1 : 0) + (slide.closer ? 1 : 0)
    default:         return 0
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
      case 'title':    return <TitleSlide slide={slide} />
      case 'concept':  return <ConceptSlide slide={slide} revealed={revealed} />
      case 'diagram':  return <DiagramSlide slide={slide} revealed={revealed} />
      case 'equation': return <EquationSlide slide={slide} revealed={revealed} />
      case 'system':   return <SystemSlide slide={slide} revealed={revealed} />
      case 'compare':  return <CompareSlide slide={slide} revealed={revealed} />
      case 'derive':   return <DeriveSlide slide={slide} revealed={revealed} />
      default:         return null
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
          disabled={slideIdx === 0 && revealed === 0}>&larr; Prev</button>
        <div className="nav-dots">
          {slideData.map((_, i) => (
            <div key={i} className={`nav-dot${i === slideIdx ? ' active' : ''}`}
              onClick={(e) => { e.stopPropagation(); goTo(i) }} />
          ))}
        </div>
        <button className="nav-btn" onClick={advance}
          disabled={slideIdx === slideData.length - 1 && revealed >= steps}>Next &rarr;</button>
        <span className="nav-hint">&larr; &rarr; or click &middot; hover diagrams to replay</span>
      </div>
    </div>
  )
}

// ─── Styles (shared navy/cyan theme) ─────────────────────────────────────────
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

/* title slide */
.title-slide{display:flex;flex-direction:column;align-items:flex-start;
  padding-top:20px;min-height:420px;justify-content:center}
.eyebrow{font-family:var(--display);color:var(--accent);font-size:14px;
  letter-spacing:.2em;text-transform:uppercase;margin-bottom:18px}
.main-title{font-family:var(--display);font-size:72px;line-height:1.02;margin:0;color:var(--ink)}
.title-divider{width:90px;height:3px;background:var(--accent);margin:24px 0}
.title-subtitle{font-size:18px;line-height:1.5;color:var(--muted);max-width:680px;margin:0 0 30px}
.title-meta{display:flex;gap:42px;flex-wrap:wrap}
.meta-label{font-family:var(--display);font-size:12px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--accent);margin-bottom:6px}
.meta-value{font-size:15px;color:var(--ink)}

/* equation rows */
.eq-row{display:flex;align-items:center;gap:28px;flex-wrap:wrap;margin:16px 0}
.eq-box{background:var(--panel);border:1px solid var(--rule);border-left:3px solid var(--accent);
  border-radius:8px;padding:14px 26px;font-size:20px;overflow-x:auto;max-width:100%}
.eq-aside{color:var(--muted);font-size:15px;display:flex;align-items:center;gap:8px}

/* comparison / concept cards */
.cmp-row{display:flex;gap:18px;flex-wrap:wrap;margin:16px 0 18px}
.cmp-row--tight{margin:10px 0 14px}
.cmp-card{flex:1 1 320px;min-width:300px;background:var(--panel);border:1px solid var(--rule);
  border-top:3px solid var(--accent);border-radius:10px;padding:14px 18px;
  opacity:0;transform:translateY(8px);transition:.42s ease}
.cmp-card.revealed{opacity:1;transform:none}
.cmp-head{display:flex;align-items:center;gap:10px;margin-bottom:10px}
.cmp-tag{font-family:var(--display);font-size:12px;font-weight:700;color:var(--bg);
  border-radius:5px;padding:2px 9px}
.cmp-label{font-family:var(--display);font-size:18px;font-weight:700;color:var(--ink)}
.cmp-item{display:flex;flex-direction:column;gap:2px}
.cmp-item span{font-size:13.5px;line-height:1.5;color:var(--muted)}
.cmp-item span strong{color:var(--accent-2)}

/* governing-equation list */
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

/* term glossary */
.term-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 26px;margin:6px 0 12px;max-width:920px}
.term-item{display:flex;align-items:baseline;gap:10px}
.term-sym{color:var(--accent);min-width:54px}
.term-def{font-size:13.5px;color:var(--muted);line-height:1.45}

.mini-card{background:var(--panel);border:1px solid var(--rule);
  border-radius:10px;padding:12px 16px;display:flex;flex-direction:column;gap:4px;max-width:980px}
.mini-card strong{font-size:14.5px;color:var(--accent)}
.mini-card span{font-size:13.5px;line-height:1.5;color:var(--muted)}

/* regime cards */
.regime-card{flex:1 1 300px;min-width:280px;background:var(--panel);border:1px solid var(--rule);
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

/* derivation slide */
.drv-col{display:flex;flex-direction:column;gap:10px;margin:12px 0 14px;max-width:1000px}
.drv-row{display:flex;gap:14px;align-items:flex-start;background:var(--panel);
  border:1px solid var(--rule);border-radius:10px;padding:10px 16px}
.drv-num{flex:0 0 26px;height:26px;border-radius:50%;background:var(--accent);color:var(--bg);
  font-family:var(--display);font-weight:700;font-size:13px;display:flex;
  align-items:center;justify-content:center;margin-top:4px}
.drv-body{flex:1;min-width:0}
.drv-tag{font-family:var(--display);font-size:11px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--accent-2);margin-bottom:2px}
.drv-eq{font-size:16px;overflow-x:auto;padding:2px 0}
.drv-note{font-size:13px;line-height:1.5;color:var(--muted);margin:4px 0 0}
.drv-note strong{color:var(--accent-2)}
.drv-note em{color:var(--accent)}
.drv-result{background:var(--panel);border:1px solid var(--rule);
  border-left:3px solid var(--accent-2);border-radius:10px;padding:12px 22px;max-width:1000px;
  display:flex;align-items:center;gap:24px;flex-wrap:wrap}
.drv-result-eq{font-size:20px;overflow-x:auto}
.drv-result-label{font-size:13px;color:var(--muted);line-height:1.45}

/* figures */
.q1d-fig{margin:0 0 14px;background:var(--panel);border:1px solid var(--rule);
  border-radius:12px;padding:16px 18px 12px}
.q1d-fig figcaption{font-size:12.5px;line-height:1.45;color:var(--muted);text-align:center;margin-top:10px}
.q1d-svg{width:100%;height:auto;cursor:pointer;display:block;max-height:44vh}

/* real-image figures */
.q1d-imgwrap{width:100%;max-height:42vh;display:flex;align-items:center;justify-content:center;
  background:rgba(0,0,0,.22);border-radius:8px;overflow:hidden}
.q1d-img{max-width:100%;max-height:42vh;object-fit:contain;display:block}

/* figure primitives */
.q1d-cowl{fill:none;stroke:var(--muted);stroke-width:1.6}
.q1d-core{fill:none;stroke:var(--rule);stroke-width:1.4}
.q1d-station{stroke:var(--rule);stroke-width:1;stroke-dasharray:3 3}
.q1d-blade{stroke-width:2}
.q1d-blade--a{stroke:var(--accent)}
.q1d-blade--r{stroke:var(--accent-2)}
.q1d-burner{fill:var(--accent-2);opacity:.22;stroke:var(--accent-2);stroke-width:1}
.q1d-flow{fill:none;stroke:var(--muted);stroke-width:1.2}
.q1d-wall{fill:none;stroke:var(--muted);stroke-width:2}
.q1d-axisline{stroke:var(--rule);stroke-width:1;stroke-dasharray:4 4}
.q1d-core-arrow{stroke:var(--accent);stroke-width:2}
.q1d-bl-arrow{stroke:var(--accent-2);stroke-width:1.8}
.q1d-vax{stroke:var(--accent);stroke-width:2.5}
.q1d-vwall{stroke:var(--accent-2);stroke-width:2.5}
.q1d-ahead{fill:var(--muted)}
.q1d-ahead-a{fill:var(--accent)}
.q1d-ahead-o{fill:var(--accent-2)}
.q1d-t{font-family:var(--body);font-size:11px;fill:var(--ink)}
.q1d-t--sm{font-size:9px;fill:var(--muted)}
.q1d-t--a{fill:var(--accent);font-size:10px}
.q1d-t--o{fill:var(--accent-2);font-size:9px}
.q1d-t--r{fill:var(--accent-2);font-size:11px}

/* figure extras */
.q1d-body{fill:var(--rule);opacity:.35}
.q1d-badge{fill:none;stroke:var(--accent);stroke-width:1.4}
.q1d-parrow{stroke:var(--accent);stroke-width:1.8}
.q1d-sarrow{stroke:var(--accent-2);stroke-width:1.8}
.q1d-resultant{stroke:var(--ink);stroke-width:1.6;stroke-dasharray:5 3}

/* arrow grow-in + curve draw-in (replay via key bump) */
.q1d-grow{animation:q1dPop .45s ease both}
@keyframes q1dPop{from{opacity:0}to{opacity:1}}
.q1d-draw{stroke-dasharray:1400;stroke-dashoffset:1400;animation:q1dDraw 1.2s ease forwards}
@keyframes q1dDraw{to{stroke-dashoffset:0}}

/* nav */
.nav-bar{display:flex;align-items:center;gap:16px;padding:14px 26px;border-top:1px solid var(--rule)}
.nav-btn{background:var(--panel);color:var(--ink);border:1px solid var(--rule);
  border-radius:7px;padding:8px 16px;font-size:14px;cursor:pointer;transition:.2s}
.nav-btn:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}
.nav-btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.nav-btn:disabled{opacity:.35;cursor:default}
.nav-dots{flex:1;display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.nav-dot{width:9px;height:9px;border-radius:50%;background:var(--rule);cursor:pointer;transition:.2s}
.nav-dot.active{background:var(--accent);transform:scale(1.25)}
.nav-hint{color:var(--muted);font-size:12px}
.progress-bar{position:absolute;left:0;bottom:-12px;height:2px;background:var(--accent);transition:width .3s ease}

@media (max-width:720px){
  .slide-heading{font-size:26px}
  .main-title{font-size:46px}
  .term-grid{grid-template-columns:1fr}
  .cmp-row,.law-col{flex-direction:column}
  .title-meta{gap:24px}
  .drv-result{gap:10px}
  .nav-hint{display:none}
}
@media (prefers-reduced-motion:reduce){
  .anim-in,.reveal-block,.cmp-card,.law-card,.regime-card{animation:none;transition:none}
  .q1d-grow,.q1d-draw{animation:none;stroke-dashoffset:0}
}
`
