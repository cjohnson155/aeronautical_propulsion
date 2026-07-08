import { useState, useEffect, useCallback, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// ─────────────────────────────────────────────────────────────────────────────
//  ME 3470 · Fluid Impulse — Pressure, Shear, and the Force on an Engine
//  Same presentation system as the Unit 4 Rayleigh deck:
//    • navy/cyan theme via CSS variables + <style>{CSS}
//    • type-driven slide renderers, KaTeX via the shared <Equation/>
//    • step-by-step reveals, click / arrow-key advance
//    • top bar · nav dots · progress bar
//
//  New slide type added to the system:
//    'derive'  – numbered derivation steps + boxed result
//
//  Signature figures (inline SVG, themed):
//    'traction'         – surface traction split into normal (p) + tangential (tau)
//    'pressure-field'   – pressure distribution on a nacelle; forward vs aft surfaces
//    'shear-field'      – wall-shear distribution; every arrow points aft
//    'pshear-plot'      – p(x) - p0 and tau_w(x) along the engine axis
//    'cv-box'           – control volume: the wetted-surface integral disappears
//    'station'          – impulse at a station = pA + m_dot*u
//    'duct-force'       – axial force on a duct = I1 - I2
//    'impulse-fn'       – I/I* vs Mach (minimum at M = 1)
//    'rayleigh-impulse' – p/p* falls as (1 + gamma M^2)^-1 so that I stays flat
//
//  Diagrams re-play on hover/click and respect prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────────────────────

export const meta = {
  courseId:  'ME 3470',
  deckTitle: 'Fluid Impulse \u00b7 Pressure & Shear, the Momentum Theorem, and the Conserved Quantity Behind Thrust',
}

export const slides = [

  // ── TITLE ───────────────────────────────────────────────────────────────────
  {
    type: 'title',
    eyebrow: 'Undergraduate Course \u00b7 ME 3470',
    title: 'Fluid Impulse',
    subtitle:
      'A fluid has exactly two ways to touch an engine: it can push (pressure) and it can rub (shear). Everything we call thrust is the sum of those two tractions \u2014 and the fluid impulse is the bookkeeping device that lets us total them without ever solving the flowfield.',
    meta: [
      { label: 'Unit',      value: '04 \u2014 Fluid Impulse' },
      { label: 'Topics',    value: 'Surface traction \u00b7 Momentum theorem \u00b7 I = pA(1 + \u03b3M\u00b2) \u00b7 Duct forces \u00b7 Rayleigh & Fanno' },
      { label: 'Builds to', value: 'Rayleigh Flow \u00b7 Unit 5 Thrust Equation' },
    ],
  },

  // ── TWO HANDS ───────────────────────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Section 1',
    heading: 'Two Hands, and No Others',
    intro:
      'Set aside gravity. A fluid in contact with a solid surface transmits force through exactly one object \u2014 the <strong>stress tensor</strong>. Split it, and you get two physically distinct hands on the hardware.',
    cards: [
      { tag: 'p', accent: '#5ec8d8', label: 'Pressure \u2014 the Normal Hand',
        body: 'Acts <strong>perpendicular</strong> to the surface, always pushing inward. It does not care which way the flow is going. This is the only hand that can ever push the engine <strong>forward</strong>.' },
      { tag: '\u03c4', accent: '#f0a93b', label: 'Shear \u2014 the Tangential Hand',
        body: 'Acts <strong>along</strong> the surface, dragging it in the direction of the local flow. On a nacelle the flow runs aft everywhere, so shear can only ever <strong>subtract</strong> from thrust.' },
      { tag: '\u2205', accent: '#5ec8d8', label: 'There Is No Third Hand',
        body: 'Not combustion, not the turbine, not the fuel. Heat and work rearrange the flowfield \u2014 but they reach the metal only by changing <strong>p</strong> and <strong>\u03c4</strong>.' },
    ],
    bridge:
      'Both hands are contained in the traction vector on a single patch of wetted surface. Zoom in on one patch.',
  },

  // ── TRACTION ON A SURFACE ELEMENT ───────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 1',
    heading: 'Traction on a Surface Element',
    intro:
      'Take an element <em>dS</em> of the wetted surface with outward unit normal <strong>n\u0302</strong> (pointing into the fluid). The traction the fluid applies is <strong>t</strong> = <strong>&sigma;</strong>&middot;n\u0302, and the stress tensor splits cleanly.',
    figure: 'traction',
    equation: '\\mathbf{t} = \\boldsymbol{\\sigma}\\cdot\\hat{n} = \\underbrace{-p\\,\\hat{n}}_{\\text{pressure}} \\;+\\; \\underbrace{\\boldsymbol{\\tau}\\cdot\\hat{n}}_{\\text{shear}}',
    caption:
      'The traction on a wetted element resolves into a normal component (pressure, always compressive, directed into the wall) and a tangential component (wall shear, directed along the local flow). The dashed vector is the resultant \u2014 the only force the fluid can transmit at this point.',
    cards: [
      { tag: '\u22a5', accent: '#5ec8d8', label: 'Normal Component',
        body: 'Magnitude p&nbsp;dS, direction \u2212n\u0302. Its <strong>axial</strong> component depends entirely on how the surface is tilted \u2014 geometry decides whether this push helps or hurts.' },
      { tag: '\u2225', accent: '#f0a93b', label: 'Tangential Component',
        body: '&tau;<sub>w</sub>&nbsp;dS along the flow. Set by the boundary layer: &tau;<sub>w</sub> = &mu;(&part;u/&part;y)<sub>wall</sub>, roughly proportional to <strong>&rho;u&sup2;</strong> through a skin-friction coefficient.' },
    ],
    bridge:
      'Now paste that element over every square millimetre of an engine and watch which surfaces the pressure hand can actually push forward.',
  },

  // ── PRESSURE DISTRIBUTION ON A NACELLE ──────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 2',
    heading: 'The Pressure Distribution',
    intro:
      'Arrows drawn <strong>into the wall</strong>, length proportional to gauge pressure p&nbsp;\u2212&nbsp;p<sub>0</sub>. Subtracting ambient costs nothing \u2014 a uniform pressure over a closed surface produces zero net force \u2014 and it makes the imbalance visible.',
    figure: 'pressure-field',
    caption:
      'Upper half: internal pressure loading (inlet \u2192 compressor \u2192 burner \u2192 turbine \u2192 nozzle). Outer cowl: the flow accelerating around the lip drops p below p<sub>0</sub>, producing suction that pulls the nacelle forward. Forward force comes from every surface whose normal has an <strong>aft</strong>-pointing component.',
    cards: [
      { tag: '\u2190', accent: '#5ec8d8', label: 'Diverging Walls Push Forward',
        body: 'Inlet diffuser, combustor dome, turbine and compressor blades: high p on <strong>forward-facing</strong> area. This is where the thrust actually lives.' },
      { tag: '\u2192', accent: '#f0a93b', label: 'Converging Walls Push Aft',
        body: 'The nozzle contraction is loaded on <strong>aft-facing</strong> area. Its internal pressure load is a rearward force \u2014 real engines still net out positive.' },
      { tag: 'p\u2080', accent: '#5ec8d8', label: 'Why Gauge Pressure',
        body: '\u222e p<sub>0</sub> n\u0302 dS = 0 over any closed surface. Only <strong>differences</strong> from ambient can produce force \u2014 so work in p \u2212 p<sub>0</sub> and the ambient bookkeeping disappears.' },
    ],
    bridge:
      'Now the other hand. Its arrows are far less interesting, and that is exactly the point.',
  },

  // ── SHEAR DISTRIBUTION ──────────────────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 2',
    heading: 'The Shear Distribution',
    intro:
      'Wall shear acts on the metal in the direction of the local flow. Trace the wetted surface of a nacelle: internal duct, external cowl, blades \u2014 the flow runs <strong>aft</strong> along all of it.',
    figure: 'shear-field',
    caption:
      'Every wall-shear arrow points downstream. Magnitude tracks &rho;u&sup2;, so &tau;<sub>w</sub> spikes where the flow is fastest \u2014 the inlet throat and the nozzle. Internal skin friction and external nacelle drag are the same physics, differing only in which side of the cowl they act on.',
    cards: [
      { tag: 'Drag', accent: '#f0a93b', label: 'Shear Never Helps',
        body: 'Its axial component is always rearward. Thrust is produced by the <strong>pressure</strong> distribution; shear is the tax collected on the way.' },
      { tag: 'Rayleigh', accent: '#5ec8d8', label: 'Turn It Off and See',
        body: 'A frictionless model (&tau;<sub>w</sub> = 0) is not a cheat \u2014 it isolates what pressure alone does. That single assumption is what makes <strong>Rayleigh flow</strong> tractable.' },
    ],
    bridge:
      'Plot both distributions against axial station and the character of each becomes unmistakable.',
  },

  // ── p AND tau ALONG THE ENGINE ──────────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 2',
    heading: 'p and \u03c4 Along the Engine',
    intro:
      'The two distributions, station by station. Notice that they are qualitatively different animals: gauge pressure swings by orders of magnitude and <strong>changes sign</strong>; wall shear is small, strictly positive, and never stops taking.',
    figure: 'pshear-plot',
    caption:
      'Top: gauge pressure along the internal wall \u2014 rising through the compressor, drooping slightly across the burner even with zero friction, falling through turbine and nozzle. Bottom: wall shear \u2014 always positive, peaking where &rho;u&sup2; peaks. The shaded burner droop is a <strong>momentum</strong> pressure loss, not a friction loss; we will compute it later in this deck.',
    cards: [
      { tag: '\u0394p', accent: '#5ec8d8', label: 'Pressure Carries the Signal',
        body: 'Three orders of magnitude of variation, both signs, and the axial projection depends on wall slope. This is what the impulse function will summarize for us.' },
      { tag: '\u03c4<sub>w</sub>', accent: '#f0a93b', label: 'Shear Is a Small, Steady Loss',
        body: 'Never negative, never large \u2014 but integrated over a long duct it is exactly the <strong>impulse deficit</strong> we will meet in Fanno flow.' },
    ],
    bridge:
      'Both hands are now on the table. Write the total force they exert, exactly.',
  },

  // ── THE EXACT FORCE ─────────────────────────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Section 3',
    heading: 'The Exact Force \u2014 and Why We Never Use It',
    intro:
      'Integrate the traction over every wetted square millimetre of the engine, inside and out. This expression is <strong>exact</strong>. It is also, for design purposes, nearly useless.',
    equation: '\\mathbf{F} = \\oint_{S_{\\text{wet}}} \\left(-p\\,\\hat{n} + \\boldsymbol{\\tau}\\cdot\\hat{n}\\right) dS',
    equationLabel: 'The only force a fluid can exert on a body',
    terms: [
      { sym: 'S_{\\text{wet}}', def: 'Every wetted surface \u2014 cowl, spinner, all blade rows, liner, nozzle.' },
      { sym: '\\hat{n}',        def: 'Outward normal of the body, pointing into the fluid.' },
      { sym: '-p\\,\\hat{n}',   def: 'Pressure traction: normal, compressive, geometry-projected.' },
      { sym: '\\boldsymbol{\\tau}\\cdot\\hat{n}', def: 'Viscous traction: tangential, aft-directed, small.' },
    ],
    cards: [
      { label: 'What it demands of you',
        body: 'p(x) and &tau;<sub>w</sub>(x) at every point \u2014 which means you have already solved the entire viscous flowfield, in three dimensions, through rotating machinery and a reacting burner. If you had that, you would not need the equation.' },
      { label: 'What it demands of your CAD',
        body: 'The answer depends on the exact shape of every internal surface. Change a fillet, redo the integral. There is no such thing as a preliminary-design estimate from this expression.' },
    ],
    bridge:
      'So we cheat \u2014 legitimately. Newton lets us trade the surface we cannot compute for two stations we can.',
  },

  // ── THE CONTROL-VOLUME TRADE ────────────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 3',
    heading: 'The Control-Volume Trade',
    intro:
      'Draw a control volume whose boundary <strong>never touches the engine</strong> except where we cut the strut. The wetted-surface integral becomes an internal force, and Newton hands us its value in terms of flow at the boundary alone.',
    figure: 'cv-box',
    caption:
      'The engine becomes a black box. The control surface crosses the flow only at station 0 (capture) and station 9 (exit), and crosses metal only at the pylon, where the reaction force <strong>F</strong> appears \u2014 the thrust the airframe actually feels. Everything we refused to integrate is now inside the box.',
    cards: [
      { tag: 'In', accent: '#5ec8d8', label: 'What You Must Know',
        body: 'Only the state at the boundary: p, &rho;, u, A at stations <strong>0</strong> and <strong>9</strong>. Nothing about blade counts, liner geometry, or the flame.' },
      { tag: 'Out', accent: '#f0a93b', label: 'What You Get',
        body: 'The <strong>net</strong> axial force on everything inside \u2014 the sum of the two distributions we just drew, without ever drawing them.' },
    ],
    bridge:
      'Write the two conservation laws that make the trade work.',
  },

  // ── CONSERVATION LAWS ───────────────────────────────────────────────────────
  {
    type: 'system',
    sectionNumber: 'Section 3',
    heading: 'Steady Conservation Laws for the Control Volume',
    intro:
      'Steady flow, uniform one-dimensional properties at each station, no body forces. Two laws are all we need \u2014 energy stays out of it, which is why the result works with or without heat addition.',
    laws: [
      {
        tag: 'Mass', accent: '#5ec8d8',
        eq: '\\oint_{CS} \\rho\\,(\\mathbf{V}\\cdot\\hat{n})\\,dA = 0 \\quad\\Longrightarrow\\quad \\dot{m} = \\rho u A',
        note: 'Whatever crosses station 1 crosses station 2. In a duct with one inlet and one outlet, <strong>&#7745; is a constant</strong>.',
      },
      {
        tag: 'Momentum', accent: '#f0a93b',
        eq: '\\oint_{CS} \\rho\\,u\\,(\\mathbf{V}\\cdot\\hat{n})\\,dA = -\\oint_{CS} p\\,\\hat{n}_x\\,dA + F_{x,\\text{surf}}',
        note: 'Axial momentum flux out of the control surface equals the axial pressure force on it, plus whatever forces solid surfaces transmit across it. <strong>This is Newton\u2019s second law</strong>, nothing more.',
      },
    ],
    closer:
      'Note what is absent: no energy equation, no entropy, no gas model. The impulse we are about to define is a <em>mechanical</em> statement, and it survives combustion untouched.',
  },

  // ── DERIVATION ──────────────────────────────────────────────────────────────
  {
    type: 'derive',
    sectionNumber: 'Section 4',
    heading: 'Deriving the Fluid Impulse',
    intro:
      'Apply the axial momentum balance to a control volume bounded by station 1, station 2, and the duct wall between them. Let <em>R<sub>x</sub></em> be the axial force the wall exerts on the fluid.',
    steps: [
      { n: '1', tag: 'Momentum flux', eq: '\\dot{m}\\,u_2 - \\dot{m}\\,u_1 = \\sum F_x',
        note: 'Steady, one inlet, one outlet. The left side is the net rate at which axial momentum leaves the control volume.' },
      { n: '2', tag: 'Name the forces', eq: '\\sum F_x = p_1 A_1 - p_2 A_2 + R_x',
        note: 'Pressure pushes in on both end faces; the wall supplies everything else, including whatever friction and wall-pressure projection there is.' },
      { n: '3', tag: 'Combine', eq: '\\dot{m}u_2 + p_2 A_2 = \\dot{m}u_1 + p_1 A_1 + R_x',
        note: 'Move the flux and pressure terms together. Both sides are now the <strong>same combination</strong> evaluated at different stations.' },
      { n: '4', tag: 'Define', eq: 'I \\;\\equiv\\; \\dot{m}\\,u + pA \\;=\\; \\rho u^2 A + pA',
        note: 'Call it the <strong>fluid impulse</strong> (or impulse function). It has units of force, and it is a property of a <em>station</em>, not of a process.' },
      { n: '5', tag: 'Read it off', eq: 'R_x = I_2 - I_1 \\qquad\\Longrightarrow\\qquad F_{\\text{on wall},x} = I_1 - I_2',
        note: 'Newton\u2019s third law flips the sign. The axial force the fluid exerts on the hardware between two stations is simply the <strong>drop in impulse</strong> across it.' },
    ],
    result: {
      eq: 'I = pA + \\rho u^2 A = pA\\left(1 + \\gamma M^2\\right)',
      label: 'Calorically perfect gas: a\u00b2 = \u03b3p/\u03c1 and u = Ma, so \u03c1u\u00b2 = \u03b3pM\u00b2',
    },
    closer:
      'Read the last line again. <strong>Force is a difference in impulse.</strong> We never integrated p or &tau; \u2014 and yet their entire resultant is on the page.',
  },

  // ── THE IMPULSE FUNCTION ────────────────────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Section 4',
    heading: 'The Fluid Impulse',
    intro:
      'Three equivalent faces of the same quantity. Use whichever matches the data you have: primitive variables, mass flow, or Mach number.',
    equation: 'I \\;=\\; \\underbrace{pA}_{\\text{pressure force}} + \\underbrace{\\rho u^2 A}_{\\text{momentum flux}} \\;=\\; \\dot{m}u + pA \\;=\\; pA\\left(1 + \\gamma M^2\\right)',
    equationLabel: 'Impulse function \u00b7 units of newtons',
    terms: [
      { sym: 'pA',              def: 'Static pressure acting on the cross-section \u2014 the fluid pushing on the face.' },
      { sym: '\\rho u^2 A = \\dot{m}u', def: 'Axial momentum carried bodily through the face per unit time.' },
      { sym: '1 + \\gamma M^2', def: 'The CPG recast. Substitute a\u00b2 = \u03b3p/\u03c1 into \u03c1u\u00b2 = \u03c1M\u00b2a\u00b2 = \u03b3pM\u00b2.' },
      { sym: '\\gamma',         def: 'Ratio of specific heats. Take \u03b3 \u2248 1.3 for burnt gas, 1.4 for cold air.' },
    ],
    cards: [
      { label: 'Why both terms belong together',
        body: 'A control surface cannot distinguish momentum arriving by convection from momentum arriving by pressure \u2014 both change the fluid\u2019s momentum at the same rate. Newton adds them; so should you.' },
      { label: 'Mind the gauge',
        body: 'For an engine exposed to ambient, use the <strong>gauge</strong> form I = &#7745;u + (p \u2212 p<sub>0</sub>)A. The ambient part cancels around the closed surface, and the thrust equation falls out with the familiar (p<sub>9</sub> \u2212 p<sub>0</sub>)A<sub>9</sub> term.' },
    ],
    bridge:
      'Picture the two terms living on the same face.',
  },

  // ── IMPULSE AT A STATION ────────────────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 4',
    heading: 'Impulse at a Station',
    intro:
      'At any cut through the duct, the fluid downstream feels two things from the fluid upstream: it is <strong>pushed</strong> (pA) and it is <strong>fed</strong> momentum (&#7745;u). Their sum is the impulse of that station.',
    figure: 'station',
    caption:
      'The impulse of a station is a single number with units of force. A subsonic, high-pressure station is pressure-dominated; a supersonic exhaust station is momentum-dominated. At M = 1/\u221a\u03b3 \u2248 0.845 the two terms trade places (\u03c1u\u00b2 = \u03b3pM\u00b2 = p).',
    cards: [
      { tag: 'M\u226a1', accent: '#5ec8d8', label: 'Pressure-Dominated',
        body: 'At M = 0.2, &gamma;M&sup2; = 0.056 \u2014 the momentum flux is <strong>5%</strong> of the pressure term. Burner inlets live here.' },
      { tag: 'M\u226b1', accent: '#f0a93b', label: 'Momentum-Dominated',
        body: 'At M = 2.5, &gamma;M&sup2; = 8.75 \u2014 the momentum flux is <strong>nine times</strong> the pressure term. Nozzle exits live here.' },
    ],
    bridge:
      'One definition; four places you will use it before the end of this course.',
  },

  // ── WHAT IMPULSE BUYS YOU ───────────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Section 5',
    heading: 'What the Impulse Buys You',
    intro:
      'Impulse is not a curiosity. It is the shortest path between a flow solution and a <strong>force on hardware</strong> \u2014 which is the only thing a structures engineer, a test cell, or an airframe ever asks about.',
    cards: [
      { tag: 'Thrust', accent: '#5ec8d8', label: 'The Thrust Equation (Unit 5)',
        body: 'F = I<sub>9</sub> \u2212 I<sub>0</sub> in gauge form, which is exactly F = &#7745;<sub>9</sub>u<sub>9</sub> \u2212 &#7745;<sub>0</sub>u<sub>0</sub> + (p<sub>9</sub> \u2212 p<sub>0</sub>)A<sub>9</sub>. <strong>Gross thrust, ram drag, and pressure thrust are one equation.</strong>' },
      { tag: 'Loads', accent: '#f0a93b', label: 'Force on Any Component',
        body: 'Diffuser, combustor liner, nozzle, thrust reverser: the axial load is I<sub>in</sub> \u2212 I<sub>out</sub>. Size the bolts from two station states.' },
      { tag: 'Jumps', accent: '#5ec8d8', label: 'Jump Conditions',
        body: 'Across a normal shock (constant A, no wall force): I<sub>1</sub> = I<sub>2</sub>, i.e. p<sub>1</sub>(1+&gamma;M<sub>1</sub>&sup2;) = p<sub>2</sub>(1+&gamma;M<sub>2</sub>&sup2;). <strong>That is the shock momentum relation.</strong>' },
    ],
    bridge:
      'Take the second one seriously \u2014 it is the workhorse on Problem Set 1.',
  },

  // ── FORCE ON A DUCT ─────────────────────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 5',
    heading: 'Force on a Duct = Drop in Impulse',
    intro:
      'A converging nozzle, choked. You know p, A, M at the inlet and at the throat. Without touching the wall geometry between them, you know the axial load the flow puts on the metal.',
    figure: 'duct-force',
    equation: 'F_{\\text{on wall}} = I_1 - I_2 = p_1A_1(1+\\gamma M_1^2) - p_2A_2(1+\\gamma M_2^2)',
    caption:
      'The wall is a black box. Contours, fillets, cooling holes \u2014 none of it enters. Only the two end states. For a choked convergent nozzle I<sub>1</sub> &gt; I<sub>2</sub>, so the flow pushes the contraction <strong>aft</strong>; the forward thrust of that engine comes from surfaces upstream.',
    cards: [
      { tag: 'Sign', accent: '#5ec8d8', label: 'Reading the Sign',
        body: 'Positive means the fluid pushes the hardware <strong>downstream</strong>. A diverging passage (inlet diffuser, rocket bell) reverses it \u2014 impulse rises, and the wall is pushed forward.' },
      { tag: 'Check', accent: '#f0a93b', label: 'Farokhi P2.31, P2.33',
        body: 'Both problems are one line once you see them as impulse differences. If a problem asks for the force on a component, ask for its <strong>two stations</strong> first.' },
    ],
    bridge:
      'And when the wall exerts no force at all, the impulse cannot change. That is where Rayleigh flow begins.',
  },

  // ── WHAT BREAKS CONSERVATION ────────────────────────────────────────────────
  {
    type: 'compare',
    sectionNumber: 'Section 6',
    heading: 'What Conserves Impulse, and What Does Not',
    intro:
      'I is conserved along a duct exactly when the wall exerts <strong>no net axial force</strong> on the fluid. Two independent ways for the wall to push, and one famous non-way.',
    regimes: [
      { tag: 'A = const', label: 'Frictionless, Constant Area', accent: '#5ec8d8',
        head: 'I\u2081 = I\u2082 \u00b7 even with heat addition',
        body: 'No wall shear, and every wall normal is purely radial \u2014 zero axial projection. The wall cannot push. <strong>Heat has no hands:</strong> combustion raises h<sub>0</sub>, s, and T, but it cannot change the impulse. This is exactly <strong>Rayleigh flow</strong>.' },
      { tag: '\u03c4<sub>w</sub> \u2260 0', label: 'Friction (Fanno)', accent: '#f0a93b',
        head: 'I\u2082 \u2212 I\u2081 = \u2212F<sub>friction</sub>',
        body: 'Wall shear is a genuine axial force. The impulse <strong>deficit</strong> between two stations <em>is</em> the integrated wall friction. Measure the pressure drop in a constant-area pipe and you have measured &tau;<sub>w</sub> \u2014 no boundary-layer theory required.' },
      { tag: 'dA \u2260 0', label: 'Area Change', accent: '#5ec8d8',
        head: 'I\u2082 \u2212 I\u2081 = \u222b p dA<sub>x</sub>',
        body: 'A sloped wall gives pressure an axial component. Nozzles, diffusers, and shocked inlets all change impulse this way \u2014 and that is precisely the mechanism by which a nozzle makes thrust.' },
    ],
    closer:
      'Combustion, in this ledger, is <em>free</em>. That single fact is why a constant-area burner is analytically tractable, and why its exit Mach number is set by momentum rather than by the flame.',
  },

  // ── IMPULSE FUNCTION vs MACH ────────────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 6',
    heading: 'Impulse Function vs Mach Number',
    intro:
      'Hold mass flow and stagnation state fixed, let the area vary isentropically, and normalize by the sonic value. The impulse function has a <strong>minimum at M = 1</strong>.',
    figure: 'impulse-fn',
    caption:
      'I/I* = (1 + \u03b3M\u00b2) / [ (1+\u03b3) M \u221a( (2/(\u03b3+1))(1 + \u00bd(\u03b3\u22121)M\u00b2) ) ], \u03b3 = 1.4. Both branches fall toward M = 1. Sonic flow carries the <strong>least</strong> impulse for a given &#7745; and p<sub>0</sub> \u2014 the same extremal point that shows up as maximum entropy on the Rayleigh line and as the choking limit everywhere else.',
    cards: [
      { tag: 'Min', accent: '#5ec8d8', label: 'Why M = 1 Is Special \u2014 Again',
        body: 'Every 1-D compressible model puts an extremum at the sonic point. Here it is impulse; in Rayleigh flow it is entropy; in the area\u2013Mach relation it is area. <strong>Same point, three disguises.</strong>' },
      { tag: 'Use', accent: '#f0a93b', label: 'A Tabulated Column',
        body: 'Gas tables list I/I* beside A/A* and p/p<sub>0</sub>. Two stations, two table lookups, one subtraction \u2014 and you have the force on the duct.' },
    ],
    bridge:
      'Now hold the <em>area</em> fixed instead, and watch the impulse do nothing at all.',
  },

  // ── RAYLEIGH: CONSTANT IMPULSE ──────────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 7',
    heading: 'Constant Area: Pressure Pays for Mach Number',
    intro:
      'Fix A, kill friction, add all the heat you like. I = pA(1 + &gamma;M&sup2;) is nailed to a constant, so p and M are locked in a <strong>hyperbolic trade</strong>.',
    figure: 'rayleigh-impulse',
    equation: '\\frac{p}{p^*} = \\frac{1+\\gamma}{1+\\gamma M^2} \\qquad \\text{(constant-area duct, } I = I^*\\text{)}',
    caption:
      'The falling curve is static pressure, referenced to its sonic value; the flat line is the impulse, which does not move. Heating a subsonic flow drives M up the curve toward 1 and <strong>drops the static pressure</strong> \u2014 a pressure loss with no friction anywhere in the model. This single relation is the momentum backbone of the entire Rayleigh table.',
    cards: [
      { tag: '\u2193p', accent: '#5ec8d8', label: 'The Fundamental Loss',
        body: 'Accelerating a flow requires a pressure gradient, and in a constant-area duct there is nothing but static pressure to supply it. Every combustor pays this, frictionless or not.' },
      { tag: 'M\u21921', accent: '#f0a93b', label: 'Thermal Choking, Previewed',
        body: 'The trade has a hard stop. Heat drives both branches toward M = 1; at the sonic point the duct chokes and the upstream flow must adjust. <strong>Impulse tells you where; entropy tells you why.</strong>' },
    ],
    bridge:
      'Numbers make it concrete. One combustor, one impulse, thirty seconds of arithmetic.',
  },

  // ── WORKED EXAMPLE ──────────────────────────────────────────────────────────
  {
    type: 'derive',
    sectionNumber: 'Section 7',
    heading: 'Worked Example \u2014 Combustor Momentum Loss',
    intro:
      'A constant-area burner: A = 0.25 m\u00b2, p<sub>3</sub> = 1.20 MPa, M<sub>3</sub> = 0.20, &gamma; = 1.4. Combustion drives the exit to M<sub>4</sub> = 0.35. Find the exit static pressure \u2014 <em>with no friction and no gas tables.</em>',
    steps: [
      { n: '1', tag: 'Impulse at station 3', eq: 'I_3 = p_3 A\\,(1+\\gamma M_3^2) = (1.20\\times10^6)(0.25)(1.056) = 316.8\\ \\text{kN}',
        note: '&gamma;M&sub3;&sup2; = 1.4(0.04) = 0.056 \u2014 the momentum flux is barely 5% of pA. A burner inlet is a pressure-dominated station.' },
      { n: '2', tag: 'Impulse is conserved', eq: 'I_4 = I_3 \\qquad (A = \\text{const},\\ \\tau_w = 0)',
        note: 'Heat added, entropy up, T<sub>0</sub> up by a factor of 2.5 \u2014 and the impulse has not moved by one newton.' },
      { n: '3', tag: 'Solve for p\u2084', eq: 'p_4 = \\frac{I_4}{A\\,(1+\\gamma M_4^2)} = \\frac{316.8\\times10^3}{(0.25)(1.1715)} = 1.082\\ \\text{MPa}',
        note: '&gamma;M&sub4;&sup2; = 1.4(0.1225) = 0.1715. Notice we never needed q, T<sub>3</sub>, T<sub>4</sub>, or c<sub>p</sub>.' },
      { n: '4', tag: 'Interpret', eq: '\\frac{\\Delta p}{p_3} = \\frac{1.056}{1.1715} - 1 = -9.9\\%',
        note: 'A <strong>10% static-pressure loss</strong> from momentum alone. This is why real combustors are diffused down to M \u2248 0.05\u20130.1 before the flame \u2014 the loss scales roughly with &gamma;M&sup2;.' },
    ],
    result: {
      eq: '\\frac{p_4}{p_3} = \\frac{1+\\gamma M_3^2}{1+\\gamma M_4^2}',
      label: 'The Rayleigh pressure ratio \u2014 derived here from impulse alone',
    },
    closer:
      'That last box is a line in the Rayleigh table. You did not look it up; you <strong>derived</strong> it from a control volume and Newton\u2019s second law.',
  },

  // ── HAND-OFF ────────────────────────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Section 7',
    heading: 'Hand-Off to Rayleigh Flow',
    intro:
      'Everything in the next deck rests on two constants along a constant-area, frictionless duct. Both are mechanical; neither knows anything about the flame.',
    cards: [
      { tag: 'G', accent: '#5ec8d8', label: 'Mass Flux Is Constant',
        body: '&#7745;/A = &rho;u = G. Fixed by continuity, the moment the area stops changing.' },
      { tag: 'I', accent: '#f0a93b', label: 'Impulse Is Constant',
        body: 'p + &rho;u&sup2; = p + Gu = I/A. Fixed by momentum, the moment the wall stops pushing.' },
      { tag: 'Line', accent: '#5ec8d8', label: 'Together: the Rayleigh Line',
        body: 'Two constants, one curve. Every state the duct can reach lies on it \u2014 and the <strong>h\u2013s Rayleigh line</strong> is nothing more than that curve replotted in thermodynamic coordinates.' },
      { tag: 'Next', accent: '#f0a93b', label: 'What Heat Actually Does',
        body: 'It cannot move you off the line. It can only <strong>slide you along it</strong> \u2014 toward M = 1 from either side, and never past. That is the whole story of thermal choking.' },
    ],
    bridge:
      'The next deck plots that line, puts heat on it, and finds the nose. Bring the impulse with you \u2014 you will need it again in Unit 5, where the same subtraction becomes the thrust equation.',
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

// ── figure data: pressure loading on the inner wall (x, y_wall, arrow length) ──
const INNER_P = [
  [122, 150, 7], [150, 145, 13], [178, 142, 18], [206, 140, 23],
  [234, 140, 38], [262, 140, 56], [290, 140, 58], [318, 141, 41],
  [346, 144, 25], [374, 150, 15], [402, 159, 9], [426, 167, 5],
]
// external cowl: negative values are suction (arrow points away from the wall)
const OUTER_P = [
  [132, 133, -15], [158, 125, -19], [186, 122, -16], [214, 122, -11],
  [258, 124, -5], [316, 128, 4], [372, 134, 6], [420, 147, 7],
]
// wall shear samples: [x, y, length] along inner wall and outer cowl
const INNER_TAU = [
  [130, 147, 16], [162, 143, 22], [196, 141, 15], [232, 140, 11],
  [268, 140, 10], [304, 140, 12], [340, 143, 15], [372, 149, 20],
  [402, 158, 26], [424, 166, 30],
]
const OUTER_TAU = [
  [140, 129, 21], [172, 123, 24], [208, 122, 17], [250, 123, 13],
  [300, 126, 12], [350, 130, 13], [396, 140, 15], [438, 154, 17],
]

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

  // ── traction on a surface element ──────────────────────────────────────────
  if (name === 'traction') {
    return (
      <svg viewBox="0 0 520 240" {...common}>
        <g key={run}>
          {/* solid body below the curve */}
          <path d="M60 175 Q260 95 460 150 L460 232 L60 232 Z" className="q1d-body" />
          <path d="M60 175 Q260 95 460 150" className="q1d-wall" />
          {[80, 120, 160, 200, 240, 280, 320, 360, 400, 440].map((x, i) => (
            <line key={i} x1={x} y1="232" x2={x - 12} y2="220" className="q1d-hatch" />
          ))}
          <text x="120" y="222" className="q1d-t q1d-t--sm">engine surface (solid)</text>

          {/* freestream streamlines */}
          {[36, 56].map((y, i) => (
            <g key={i}>
              <path d={`M60 ${y} Q260 ${y - 8} 460 ${y + 4}`} className="q1d-flow" />
              <line x1="240" y1={y - 5} x2="268" y2={y - 6} className="q1d-flow" markerEnd="url(#tr-m)" />
            </g>
          ))}
          <text x="60" y="26" className="q1d-t q1d-t--sm">fluid</text>

          {/* surface element dS */}
          <line x1="240" y1="131" x2="282" y2="128" className="q1d-elem" />
          <text x="292" y="145" className="q1d-t q1d-t--sm">dS</text>

          {/* normal direction (dashed) */}
          <line x1="261" y1="129" x2="257" y2="62" className="q1d-axisline" markerEnd="url(#tr-n)" />
          <text x="247" y="56" className="q1d-t q1d-t--sm" textAnchor="end">n&#770; (into fluid)</text>

          {/* pressure traction: -p n, into the wall */}
          <line x1="205" y1="82" x2="209" y2="140" className="q1d-parrow" markerEnd="url(#tr-a)" />
          <text x="199" y="76" className="q1d-t q1d-t--a" textAnchor="end">
            <tspan x="199" dy="0">&minus;p n&#770; dS</tspan>
            <tspan x="199" dy="14" className="q1d-t q1d-t--sm">normal &middot; pushes in</tspan>
          </text>

          {/* shear traction: tangential, along the flow */}
          <line x1="300" y1="123" x2="368" y2="118" className="q1d-sarrow" markerEnd="url(#tr-o)" />
          <text x="378" y="112" className="q1d-t q1d-t--r">
            <tspan x="378" dy="0">&tau;<tspan dy="3" style={{ fontSize: '8px' }}>w</tspan><tspan dy="-3"> dS</tspan></tspan>
            <tspan x="378" dy="15" className="q1d-t q1d-t--sm">tangential &middot; along flow</tspan>
          </text>

          {/* resultant traction */}
          <line x1="240" y1="131" x2="272" y2="176" className="q1d-resultant" markerEnd="url(#tr-r)" />
          <text x="284" y="186" className="q1d-t q1d-t--sm">t = resultant traction</text>
        </g>
        <defs>
          <marker id="tr-m" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead" /></marker>
          <marker id="tr-n" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead" /></marker>
          <marker id="tr-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-a" /></marker>
          <marker id="tr-o" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-o" /></marker>
          <marker id="tr-r" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead" /></marker>
        </defs>
      </svg>
    )
  }

  // ── pressure distribution on a nacelle (upper half) ────────────────────────
  if (name === 'pressure-field') {
    return (
      <svg viewBox="0 0 520 250" {...common}>
        <g key={run}>
          <Nacelle />
          {/* internal pressure arrows: drawn from inside the duct into the wall */}
          {INNER_P.map(([x, y, L], i) => (
            <line key={`ip${i}`} x1={x} y1={y + L + 6} x2={x} y2={y + 3}
              className="q1d-parrow q1d-grow" style={{ animationDelay: `${i * 35}ms` }}
              markerEnd="url(#pf-a)" />
          ))}
          {/* external cowl: suction (negative) points away, compression points in */}
          {OUTER_P.map(([x, y, L], i) => (
            L < 0
              ? <line key={`op${i}`} x1={x} y1={y - 3} x2={x} y2={y + L - 3}
                  className="q1d-parrow--suck q1d-grow" style={{ animationDelay: `${i * 35}ms` }}
                  markerEnd="url(#pf-s)" />
              : <line key={`op${i}`} x1={x} y1={y - L - 6} x2={x} y2={y - 3}
                  className="q1d-parrow q1d-grow" style={{ animationDelay: `${i * 35}ms` }}
                  markerEnd="url(#pf-a)" />
          ))}

          {/* zone annotations */}
          <line x1="118" y1="218" x2="206" y2="218" className="q1d-bl-axis" />
          <text x="162" y="232" className="q1d-t q1d-t--a" textAnchor="middle">diverging &rarr; force forward</text>
          <line x1="352" y1="218" x2="432" y2="218" className="q1d-bl-axis" />
          <text x="392" y="232" className="q1d-t q1d-t--r" textAnchor="middle">converging &rarr; force aft</text>

          <text x="238" y="104" className="q1d-t q1d-t--o">suction: p &lt; p&#8320; pulls the cowl forward</text>
          <text x="70" y="30" className="q1d-t q1d-t--sm">arrow length &prop; (p &minus; p&#8320;)</text>

          {/* legend */}
          <g transform="translate(300,20)">
            <line x1="0" y1="0" x2="22" y2="0" className="q1d-parrow" markerEnd="url(#pf-a)" />
            <text x="30" y="4" className="q1d-t q1d-t--sm">pressure on wall (p &gt; p&#8320;)</text>
            <line x1="0" y1="16" x2="22" y2="16" className="q1d-parrow--suck" markerEnd="url(#pf-s)" />
            <text x="30" y="20" className="q1d-t q1d-t--sm">suction on wall (p &lt; p&#8320;)</text>
          </g>
        </g>
        <defs>
          <marker id="pf-a" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L5,2.5 L0,5 Z" className="q1d-ahead-a" /></marker>
          <marker id="pf-s" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L5,2.5 L0,5 Z" className="q1d-ahead-o" /></marker>
        </defs>
      </svg>
    )
  }

  // ── shear distribution on a nacelle ────────────────────────────────────────
  if (name === 'shear-field') {
    return (
      <svg viewBox="0 0 520 250" {...common}>
        <g key={run}>
          <Nacelle />
          {INNER_TAU.map(([x, y, L], i) => (
            <line key={`is${i}`} x1={x} y1={y + 6} x2={x + L} y2={y + 6}
              className="q1d-sarrow q1d-grow" style={{ animationDelay: `${i * 35}ms` }}
              markerEnd="url(#sf-o)" />
          ))}
          {OUTER_TAU.map(([x, y, L], i) => (
            <line key={`os${i}`} x1={x} y1={y - 6} x2={x + L} y2={y - 6}
              className="q1d-sarrow q1d-grow" style={{ animationDelay: `${i * 35}ms` }}
              markerEnd="url(#sf-o)" />
          ))}
          <text x="70" y="30" className="q1d-t q1d-t--sm">arrow length &prop; &tau;&#8339; &prop; &frac12;&rho;u&sup2;C&#8348;</text>

          <line x1="118" y1="222" x2="440" y2="222" className="q1d-bl-axis" markerEnd="url(#sf-o)" />
          <text x="272" y="238" className="q1d-t q1d-t--r" textAnchor="middle">
            every axial component points aft &mdash; shear can only subtract from thrust
          </text>
          <text x="148" y="102" className="q1d-t q1d-t--o" textAnchor="middle">&tau; peaks at the throat</text>
          <text x="452" y="188" className="q1d-t q1d-t--o" textAnchor="middle">and in the nozzle</text>
        </g>
        <defs>
          <marker id="sf-o" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L5,2.5 L0,5 Z" className="q1d-ahead-o" /></marker>
        </defs>
      </svg>
    )
  }

  // ── p(x) and tau_w(x) along the engine ─────────────────────────────────────
  if (name === 'pshear-plot') {
    const stations = [[70, '0'], [150, '2'], [230, '3'], [300, '4'], [370, '5'], [470, '9']]
    return (
      <svg viewBox="0 0 520 370" {...common}>
        <g key={run}>
          {/* ─ top panel: gauge pressure ─ */}
          <line x1="70" y1="30" x2="70" y2="175" className="q1d-wall" />
          <line x1="70" y1="170" x2="500" y2="170" className="q1d-wall" />
          <text x="34" y="100" className="q1d-t q1d-t--sm" textAnchor="middle" transform="rotate(-90 34 100)">p &minus; p&#8320;</text>
          <text x="60" y="174" className="q1d-t q1d-t--sm" textAnchor="end">0</text>
          <path d="M70 168 L110 166 L130 152 L160 146 L185 118 L200 100 L215 78 L230 60 L250 52 L275 58 L300 62 L320 92 L345 118 L370 136 L400 152 L435 164 L470 170"
            className="q1d-curve q1d-draw" />
          {/* burner droop highlight */}
          <path d="M230 60 L250 52 L275 58 L300 62 L300 170 L230 170 Z" className="q1d-shade" />
          <text x="266" y="86" className="q1d-t q1d-t--o" textAnchor="middle">burner droop</text>
          <text x="266" y="98" className="q1d-t q1d-t--sm" textAnchor="middle">momentum loss, &tau; = 0</text>
          <text x="196" y="52" className="q1d-t q1d-t--a" textAnchor="middle">compressor</text>
          <text x="352" y="86" className="q1d-t q1d-t--a" textAnchor="middle">turbine</text>
          <text x="436" y="130" className="q1d-t q1d-t--a" textAnchor="middle">nozzle</text>
          <text x="112" y="140" className="q1d-t q1d-t--a" textAnchor="middle">inlet</text>

          {/* ─ bottom panel: wall shear ─ */}
          <line x1="70" y1="215" x2="70" y2="340" className="q1d-wall" />
          <line x1="70" y1="335" x2="500" y2="335" className="q1d-wall" />
          <text x="34" y="278" className="q1d-t q1d-t--sm" textAnchor="middle" transform="rotate(-90 34 278)">&tau;&#8339; (wall)</text>
          <text x="60" y="339" className="q1d-t q1d-t--sm" textAnchor="end">0</text>
          <path d="M70 335 L100 322 L130 300 L150 292 L175 306 L200 312 L235 316 L270 319 L305 314 L340 304 L375 288 L405 268 L435 250 L460 258 L470 266 L470 335 Z"
            className="q1d-shade" />
          <path d="M70 335 L100 322 L130 300 L150 292 L175 306 L200 312 L235 316 L270 319 L305 314 L340 304 L375 288 L405 268 L435 250 L460 258 L470 266"
            className="q1d-curve--warm q1d-draw" />
          <text x="266" y="352" className="q1d-t q1d-t--r" textAnchor="middle">&tau;&#8339; &gt; 0 everywhere &mdash; a pure, monotone tax</text>

          {/* station ticks shared */}
          {stations.map(([x, l]) => (
            <g key={l}>
              <line x1={x} y1="30" x2={x} y2="335" className="q1d-station" />
              <text x={x} y="192" className="q1d-t q1d-t--sm" textAnchor="middle">{l}</text>
            </g>
          ))}
          <text x="500" y="192" className="q1d-t q1d-t--sm" textAnchor="end">axial station</text>
        </g>
      </svg>
    )
  }

  // ── control volume box ─────────────────────────────────────────────────────
  if (name === 'cv-box') {
    return (
      <svg viewBox="0 0 520 240" {...common}>
        <g key={run}>
          {/* control surface */}
          <rect x="96" y="46" width="330" height="150" rx="6" className="q1d-cv" />
          <text x="110" y="40" className="q1d-t q1d-t--sm">control surface</text>

          {/* engine silhouette (faint) */}
          <path d="M170 96 C190 84 240 82 300 88 L340 96 L358 116 L340 136 L300 144 C240 150 190 148 170 136 Z" className="q1d-blackbox" />
          <text x="262" y="122" className="q1d-t q1d-t--sm" textAnchor="middle">engine (black box)</text>
          <text x="262" y="136" className="q1d-t q1d-t--sm" textAnchor="middle">p, &tau; never evaluated</text>

          {/* station 0 */}
          <line x1="96" y1="46" x2="96" y2="196" className="q1d-vax" />
          <line x1="40" y1="116" x2="90" y2="116" className="q1d-core-arrow" markerEnd="url(#cv-a)" />
          <text x="64" y="106" className="q1d-t q1d-t--a" textAnchor="middle">u&#8320;</text>
          <text x="96" y="212" className="q1d-t q1d-t--a" textAnchor="middle">station 0</text>
          <text x="96" y="226" className="q1d-t q1d-t--sm" textAnchor="middle">I&#8320; = &#7745;u&#8320; + (p&#8320;&minus;p&#8320;)A&#8320;</text>

          {/* station 9 */}
          <line x1="426" y1="46" x2="426" y2="196" className="q1d-vwall" />
          <line x1="432" y1="116" x2="496" y2="116" className="q1d-bl-arrow" markerEnd="url(#cv-b)" />
          <text x="464" y="106" className="q1d-t q1d-t--r" textAnchor="middle">u&#8329;</text>
          <text x="426" y="212" className="q1d-t q1d-t--r" textAnchor="middle">station 9</text>
          <text x="426" y="226" className="q1d-t q1d-t--sm" textAnchor="middle">I&#8329; = &#7745;u&#8329; + (p&#8329;&minus;p&#8320;)A&#8329;</text>

          {/* pylon cut */}
          <line x1="262" y1="46" x2="262" y2="20" className="q1d-wall" />
          <line x1="238" y1="20" x2="286" y2="20" className="q1d-wall" />
          <line x1="290" y1="34" x2="336" y2="34" className="q1d-core-arrow" markerEnd="url(#cv-a)" />
          <text x="346" y="38" className="q1d-t q1d-t--a">F = I&#8329; &minus; I&#8320;</text>
          <text x="230" y="34" className="q1d-t q1d-t--sm" textAnchor="end">pylon cut</text>

          {/* ambient */}
          <text x="140" y="186" className="q1d-t q1d-t--sm">p&#8320; acts on the whole outer surface &rarr; contributes nothing</text>
        </g>
        <defs>
          <marker id="cv-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-a" /></marker>
          <marker id="cv-b" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-o" /></marker>
        </defs>
      </svg>
    )
  }

  // ── impulse at a station ───────────────────────────────────────────────────
  if (name === 'station') {
    return (
      <svg viewBox="0 0 520 230" {...common}>
        <g key={run}>
          {/* duct */}
          <line x1="60" y1="52" x2="460" y2="52" className="q1d-wall" />
          <line x1="60" y1="152" x2="460" y2="152" className="q1d-wall" />
          {/* the cut */}
          <line x1="260" y1="52" x2="260" y2="152" className="q1d-vax" />
          <text x="260" y="44" className="q1d-t q1d-t--a" textAnchor="middle">station cut, area A</text>

          {/* pressure force on the face */}
          {[70, 92, 114, 136].map((y, i) => (
            <line key={i} x1="224" y1={y} x2="256" y2={y} className="q1d-parrow" markerEnd="url(#st-a)" />
          ))}
          <text x="214" y="106" className="q1d-t q1d-t--a" textAnchor="end">
            <tspan x="214" dy="0">pA</tspan>
            <tspan x="214" dy="14" className="q1d-t q1d-t--sm">pressure on the face</tspan>
          </text>

          {/* momentum flux through the face */}
          <line x1="266" y1="102" x2="352" y2="102" className="q1d-sarrow" markerEnd="url(#st-o)" />
          <text x="362" y="98" className="q1d-t q1d-t--r">
            <tspan x="362" dy="0">&#7745;u = &rho;u&sup2;A</tspan>
            <tspan x="362" dy="14" className="q1d-t q1d-t--sm">momentum carried through</tspan>
          </text>

          {/* sum bar */}
          <line x1="120" y1="188" x2="360" y2="188" className="q1d-resultant" markerEnd="url(#st-r)" />
          <text x="120" y="208" className="q1d-t q1d-t--sm">I = pA + &rho;u&sup2;A = pA(1 + &gamma;M&sup2;)</text>
          <text x="378" y="192" className="q1d-t q1d-t--sm">newtons</text>
        </g>
        <defs>
          <marker id="st-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-a" /></marker>
          <marker id="st-o" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-o" /></marker>
          <marker id="st-r" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead" /></marker>
        </defs>
      </svg>
    )
  }

  // ── force on a duct ────────────────────────────────────────────────────────
  if (name === 'duct-force') {
    return (
      <svg viewBox="0 0 520 230" {...common}>
        <g key={run}>
          {/* converging duct, symmetric about y = 112 */}
          <path d="M120 52 L260 52 C310 52 330 76 380 84" className="q1d-wall" />
          <path d="M120 172 L260 172 C310 172 330 148 380 140" className="q1d-wall" />
          <line x1="120" y1="52" x2="120" y2="172" className="q1d-vax" />
          <line x1="380" y1="84" x2="380" y2="140" className="q1d-vwall" />

          {/* flow */}
          <line x1="60" y1="112" x2="114" y2="112" className="q1d-core-arrow" markerEnd="url(#df-a)" />
          <line x1="386" y1="112" x2="470" y2="112" className="q1d-bl-arrow" markerEnd="url(#df-b)" />
          <text x="120" y="42" className="q1d-t q1d-t--a" textAnchor="middle">I&#8321; = p&#8321;A&#8321;(1+&gamma;M&#8321;&sup2;)</text>
          <text x="392" y="74" className="q1d-t q1d-t--r">I&#8322; = p&#8322;A&#8322;(1+&gamma;M&#8322;&sup2;)</text>

          {/* wall loading arrows, normal into the wall */}
          {[[150, 52], [190, 52], [230, 52], [278, 55], [312, 66], [348, 76]].map(([x, y], i) => (
            <line key={i} x1={x} y1={y + 22} x2={x} y2={y + 3} className="q1d-parrow" markerEnd="url(#df-p)" />
          ))}
          {[[150, 172], [190, 172], [230, 172], [278, 169], [312, 158], [348, 148]].map(([x, y], i) => (
            <line key={i} x1={x} y1={y - 22} x2={x} y2={y - 3} className="q1d-parrow" markerEnd="url(#df-p)" />
          ))}

          {/* resultant on the wall */}
          <line x1="200" y1="198" x2="300" y2="198" className="q1d-resultant" markerEnd="url(#df-r)" />
          <text x="200" y="218" className="q1d-t q1d-t--sm">F on wall = I&#8321; &minus; I&#8322;  (positive &rarr; pushed aft)</text>
          <text x="248" y="112" className="q1d-t q1d-t--sm" textAnchor="middle">geometry irrelevant</text>
        </g>
        <defs>
          <marker id="df-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-a" /></marker>
          <marker id="df-b" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-o" /></marker>
          <marker id="df-p" markerWidth="7" markerHeight="7" refX="5" refY="2.5" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L5,2.5 L0,5 Z" className="q1d-ahead-a" /></marker>
          <marker id="df-r" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead" /></marker>
        </defs>
      </svg>
    )
  }

  // ── impulse function vs Mach ───────────────────────────────────────────────
  if (name === 'impulse-fn') {
    return (
      <svg viewBox="0 0 520 340" {...common}>
        <g key={run}>
          <line x1="70" y1="40" x2="70" y2="300" className="q1d-wall" />
          <line x1="70" y1="300" x2="500" y2="300" className="q1d-wall" />
          {[['0', 70], ['1', 213.3], ['2', 356.7], ['3', 500]].map(([l, x]) => (
            <g key={l}>
              <line x1={x} y1="300" x2={x} y2="305" className="q1d-station" />
              <text x={x} y="317" className="q1d-t q1d-t--sm" textAnchor="middle">{l}</text>
            </g>
          ))}
          {[['1.0', 300], ['1.5', 221.9], ['2.0', 143.8], ['2.5', 65.6]].map(([l, y]) => (
            <g key={l}>
              <line x1="66" y1={y} x2="70" y2={y} className="q1d-station" />
              <text x="60" y={Number(y) + 3} className="q1d-t q1d-t--sm" textAnchor="end">{l}</text>
            </g>
          ))}
          <text x="285" y="333" className="q1d-t q1d-t--sm" textAnchor="middle">Mach number M</text>
          <text x="30" y="170" className="q1d-t q1d-t--sm" textAnchor="middle" transform="rotate(-90 30 170)">I / I*</text>

          {/* subsonic branch */}
          <path d="M101.5 111.8 L110.1 175.8 L118.7 215.3 L127.3 241.4 L135.9 259.4 L144.5 272.1 L153.1 281.2 L161.7 287.7 L170.3 292.3 L178.9 295.6 L187.5 297.7 L196.1 299.1 L204.7 299.8 L213.3 300"
            className="q1d-curve q1d-draw" />
          {/* supersonic branch */}
          <path d="M213.3 300 L236.3 298.9 L259.2 296.2 L282.1 292.8 L305.1 289.1 L328 285.4 L350.9 281.7 L373.9 278.2 L396.8 275 L419.7 271.9 L442.7 269.1 L465.6 266.5 L488.5 264.1 L500 263"
            className="q1d-curve--dash" />

          {/* sonic minimum */}
          <line x1="213.3" y1="60" x2="213.3" y2="300" className="q1d-axisline" />
          <circle cx="213.3" cy="300" r="4" className="q1d-dot" />
          <text x="220" y="72" className="q1d-t q1d-t--o">M = 1: minimum impulse</text>
          <text x="130" y="100" className="q1d-t q1d-t--a">subsonic</text>
          <text x="400" y="252" className="q1d-t q1d-t--sm">supersonic</text>
          <line x1="150" y1="130" x2="192" y2="215" className="q1d-bl-arrow" markerEnd="url(#if-o)" />
          <line x1="380" y1="258" x2="250" y2="288" className="q1d-bl-arrow" markerEnd="url(#if-o)" />
        </g>
        <defs>
          <marker id="if-o" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-o" /></marker>
        </defs>
      </svg>
    )
  }

  // ── constant-area duct: p/p* falls while I stays flat ──────────────────────
  if (name === 'rayleigh-impulse') {
    return (
      <svg viewBox="0 0 520 300" {...common}>
        <g key={run}>
          <line x1="70" y1="40" x2="70" y2="260" className="q1d-wall" />
          <line x1="70" y1="260" x2="500" y2="260" className="q1d-wall" />
          {[['0', 70], ['1', 213.3], ['2', 356.7], ['3', 500]].map(([l, x]) => (
            <g key={l}>
              <line x1={x} y1="260" x2={x} y2="265" className="q1d-station" />
              <text x={x} y="277" className="q1d-t q1d-t--sm" textAnchor="middle">{l}</text>
            </g>
          ))}
          {[['0.5', 218], ['1.0', 176], ['1.5', 134], ['2.0', 92]].map(([l, y]) => (
            <g key={l}>
              <line x1="66" y1={y} x2="70" y2={y} className="q1d-station" />
              <text x="60" y={Number(y) + 3} className="q1d-t q1d-t--sm" textAnchor="end">{l}</text>
            </g>
          ))}
          <text x="285" y="293" className="q1d-t q1d-t--sm" textAnchor="middle">Mach number M</text>
          <text x="30" y="150" className="q1d-t q1d-t--sm" textAnchor="middle" transform="rotate(-90 30 150)">ratio to sonic value</text>

          {/* p/p* */}
          <path d="M70 58.4 L80.8 60 L91.5 64.6 L102.2 71.7 L113 81 L123.8 91.6 L134.5 102.9 L145.2 114.5 L156 126 L166.8 136.9 L177.5 147.2 L188.2 156.8 L199 165.5 L209.7 173.5 L220.5 180.7 L231.2 187.3 L242 193.2 L252.7 198.5 L263.5 203.2 L274.2 207.5 L285 211.4 L295.7 214.9 L306.5 218.1 L317.2 221 L328 223.6 L338.7 226 L349.5 228.1 L360.2 230.1 L371 231.9 L381.8 233.6 L392.5 235.1 L403.2 236.5 L414 237.8 L424.8 238.9 L435.5 240 L446.3 241.1 L457 242 L467.8 242.9 L478.5 243.7 L489.3 244.5 L500 245.2"
            className="q1d-curve q1d-draw" />
          <text x="112" y="70" className="q1d-t q1d-t--a">p / p*  =  (1+&gamma;) / (1+&gamma;M&sup2;)</text>

          {/* I/I* = 1 */}
          <line x1="70" y1="176" x2="500" y2="176" className="q1d-curve--warm" />
          <text x="366" y="168" className="q1d-t q1d-t--r">I / I* = 1  &mdash;  impulse does not move</text>

          {/* sonic point */}
          <line x1="213.3" y1="60" x2="213.3" y2="260" className="q1d-axisline" />
          <circle cx="213.3" cy="176" r="4" className="q1d-dot" />
          <text x="219" y="72" className="q1d-t q1d-t--o">M = 1</text>

          {/* heating direction */}
          <line x1="120" y1="96" x2="180" y2="150" className="q1d-bl-arrow" markerEnd="url(#ri-o)" />
          <text x="94" y="112" className="q1d-t q1d-t--sm">heat</text>
        </g>
        <defs>
          <marker id="ri-o" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-o" /></marker>
        </defs>
      </svg>
    )
  }

  return null
}

// ─── shared nacelle outline (upper half, axis at y = 205) ────────────────────
function Nacelle() {
  return (
    <g>
      <line x1="60" y1="205" x2="500" y2="205" className="q1d-axisline" />
      {/* outer cowl */}
      <path d="M112 152 C128 128 158 118 200 121 L300 125 C348 129 400 142 470 172" className="q1d-cowl" />
      {/* inner wall */}
      <path d="M112 152 C130 158 148 148 178 143 L206 140 L318 141 C346 144 388 156 430 168" className="q1d-cowl" />
      {/* hub */}
      <path d="M172 205 C196 196 214 190 240 188 L352 188 C382 191 402 197 420 205" className="q1d-core" />
      {/* compressor / turbine blade rows */}
      {[212, 222, 232].map(x => <line key={`c${x}`} x1={x} y1="141" x2={x - 4} y2="186" className="q1d-blade q1d-blade--a" />)}
      {[326, 338].map(x => <line key={`t${x}`} x1={x} y1="142" x2={x - 4} y2="188" className="q1d-blade q1d-blade--r" />)}
      <rect x="250" y="148" width="56" height="38" rx="4" className="q1d-burner" />
      <text x="278" y="201" className="q1d-t q1d-t--sm" textAnchor="middle">burner</text>
      <line x1="66" y1="176" x2="104" y2="170" className="q1d-flow" markerEnd="url(#na-m)" />
      <text x="70" y="162" className="q1d-t q1d-t--sm">u&#8320;, p&#8320;</text>
      <defs>
        <marker id="na-m" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead" /></marker>
      </defs>
    </g>
  )
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
  return (
    <div className="slide-inner compress-slide">
      <SlideHead slide={slide} />
      {slide.intro && (
        <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
          <p className="cf-note cf-note--lead"><HTML>{slide.intro}</HTML></p>
        </div>
      )}
      <figure className={`q1d-fig reveal-block${revealed >= figStep ? ' revealed' : ''}`}>
        <Figure name={slide.figure} />
        {slide.caption && <figcaption><HTML>{slide.caption}</HTML></figcaption>}
      </figure>
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

// ─── NEW: stepped derivation slide ───────────────────────────────────────────
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

// ─── Styles (shared theme with Unit 1 / Unit 3 / Rayleigh) ───────────────────
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
.q1d-bl-axis{stroke:var(--accent-2);stroke-width:1;stroke-dasharray:2 3}
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

/* impulse-deck extras */
.q1d-body{fill:var(--rule);opacity:.35}
.q1d-hatch{stroke:var(--rule);stroke-width:1.2}
.q1d-elem{stroke:var(--ink);stroke-width:3}
.q1d-parrow{stroke:var(--accent);stroke-width:1.8}
.q1d-parrow--suck{stroke:var(--accent-2);stroke-width:1.8;stroke-dasharray:3 2}
.q1d-sarrow{stroke:var(--accent-2);stroke-width:1.8}
.q1d-resultant{stroke:var(--ink);stroke-width:1.6;stroke-dasharray:5 3}
.q1d-cv{fill:none;stroke:var(--accent);stroke-width:1.6;stroke-dasharray:7 4}
.q1d-blackbox{fill:var(--rule);opacity:.55;stroke:var(--muted);stroke-width:1}
.q1d-shade{fill:var(--accent);opacity:.12}
.q1d-curve{fill:none;stroke:var(--accent);stroke-width:2.4}
.q1d-curve--warm{fill:none;stroke:var(--accent-2);stroke-width:2.2}
.q1d-curve--dash{fill:none;stroke:#6fb6e8;stroke-width:2.2;stroke-dasharray:6 4}
.q1d-dot{fill:var(--accent-2)}

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
