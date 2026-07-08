import { useState, useEffect, useCallback, useRef } from 'react'
import katex from 'katex'

// ─────────────────────────────────────────────────────────────────────────────
//  ME 3470 · Steady Quasi-1D Flow — Definition, Control Volume & Equations
//  Built from the handwritten lecture notes, in the Unit 3 presentation system:
//    • navy/cyan theme via CSS variables + <style>{CSS}
//    • type-driven slide renderers, KaTeX via the shared <Equation/>
//    • step-by-step reveals, click / arrow-key advance
//    • top bar · nav dots · progress bar
//
//  Slide types:
//    'title'    – opening title card
//    'concept'  – lead paragraph + comparison cards
//    'diagram'  – inline SVG figure + caption + supporting cards
//    'equation' – KaTeX equation + term glossary + supporting cards
//    'compare'  – two/three regime cards
//    'system'   – stacked list of governing equations
//
//  Diagrams are inline SVG, themed with the deck accents and re-playable on
//  hover/click. Respects prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────────────────────

export const meta = {
  courseId:  'ME 3470',
  deckTitle: 'Steady Quasi-1D Flow · Governing Equations, Nozzles & Diffusers, and the Area–Velocity Relation',
}

export const slides = [

  // ── TITLE ───────────────────────────────────────────────────────────────────
  {
    type: 'title',
    eyebrow: 'Undergraduate Course \u00b7 ME 3470',
    title: 'Steady Quasi-1D<br>Flow Equations',
    subtitle: 'What quasi-1D flow means, the streamtube control volume and conservation laws, why nozzles and diffusers are perfect quasi-1D ducts, and the area\u2013velocity relation that governs them.',
    meta: [
      { label: 'Unit',      value: '03 \u2014 Quasi-1D Flows' },
      { label: 'Topics',    value: 'Governing equations \u00b7 Nozzles & diffusers \u00b7 Area\u2013velocity relation \u00b7 CD (Laval) nozzles & the throat' },
      { label: 'Builds on', value: 'Unit 2 \u2014 Compressible Flow' },
    ],
  },

  // ── WHAT IS QUASI-1D FLOW ────────────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Section 2.1',
    heading: 'What Is Quasi-1D Flow?',
    intro:
      'An approximation for flow through a <strong>variable-area duct</strong>. Properties really vary with x, y, and z \u2014 but the changes across the section (y, z) are small compared with the change along the axis (x), so we neglect them.',
    cards: [
      { tag: 'x', accent: '#5ec8d8', label: 'Functions of x Alone',
        body: 'Keep only the axial dependence: <strong>u = u(x)</strong>, <strong>&rho; = &rho;(x)</strong>, <strong>p = p(x)</strong>.' },
      { tag: 'Avg', accent: '#f0a93b', label: 'Uniform Across Each Section',
        body: 'Equivalent to assuming properties are uniform over any cross-section of area A \u2014 a kind of <strong>mean value over the CS</strong>.' },
    ],
    bridge:
      'One representative value per station lets us apply conservation laws between an inlet and an exit station.',
  },

  // ── CONTROL VOLUME (streamtube) ──────────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 2.1',
    heading: 'The Control Volume: A Streamtube',
    intro:
      'Bound the flow between two stations. The <strong>control surface is a streamtube</strong> that follows the geometry of the duct, so no mass crosses the side walls.',
    figure: 'cv-streamtube',
    caption:
      'Inlet station \u2460 (u\u2081, &rho;\u2081, p\u2081, T\u2081, A\u2081) to exit station \u2461 (u\u2082, &rho;\u2082, p\u2082, T\u2082, A\u2082). Flow enters at \u2460 and leaves at \u2461; no mass crosses the walls.',
    bridge:
      'Applying conservation of mass, momentum, and energy across this CV gives the governing equations.',
  },

  // ── GOVERNING EQUATIONS (integral form) ──────────────────────────────────────
  {
    type: 'system',
    sectionNumber: 'Section 2.1',
    heading: 'Governing Equations \u2014 Integral Form',
    intro:
      'Mass, momentum, and energy applied to the streamtube between stations 1 and 2 (steady, adiabatic, no shaft work).',
    laws: [
      {
        tag: 'Continuity', accent: '#5ec8d8',
        eq: '\\rho_1 u_1 A_1 = \\rho_2 u_2 A_2',
        note: 'Mass in = mass out. The control surface is a streamtube, so all mass entering at station 1 leaves at station 2.',
      },
      {
        tag: 'Momentum', accent: '#f0a93b',
        eq: 'p_1 A_1 + \\rho_1 u_1^2 A_1 + \\int_{A_1}^{A_2} p\\,\\mathrm{d}A = p_2 A_2 + \\rho_2 u_2^2 A_2',
        note: 'Newton\u2019s 2nd law for a CV: pressure-area + momentum flux, plus the pressure acting on the sloped walls \u2014 the integral term.',
      },
      {
        tag: 'Energy', accent: '#5ec8d8',
        eq: 'h_1 + \\tfrac{u_1^2}{2} = h_2 + \\tfrac{u_2^2}{2}',
        note: 'Adiabatic, no shaft work: total enthalpy h_t is constant along a streamline. (h = e + pv.)',
      },
    ],
    bridge:
      'These are exact but integral. To expose how area drives velocity, convert them to differential form.',
  },

  // ── INTEGRAL \u2192 DIFFERENTIAL FORM ────────────────────────────────────────────
  {
    type: 'system',
    sectionNumber: 'Section 2.1',
    heading: 'From Integral to Differential Form',
    intro:
      'Take the integral (algebraic) equations and rewrite them differentially \u2014 working one thin slab of the duct at a time.',
    laws: [
      {
        tag: 'Continuity', accent: '#5ec8d8',
        eq: '\\rho_1 u_1 A_1 = \\rho_2 u_2 A_2 \\;\\Rightarrow\\; \\rho u A = \\text{const} \\;\\Rightarrow\\; \\mathrm{d}(\\rho u A) = 0',
        note: 'Constant along the streamtube, so its differential vanishes \u2014 the first differential relation.',
      },
      {
        tag: 'Momentum', accent: '#f0a93b',
        eq: 'p_1 A_1 + \\rho_1 u_1^2 A_1 + \\int_{A_1}^{A_2} p\\,\\mathrm{d}A = p_2 A_2 + \\rho_2 u_2^2 A_2',
        note: 'Trickier \u2014 the pressure integral over the wall resists a clean algebraic rewrite.',
      },
    ],
    closer:
      'The fix: cut the duct into very small chunks \u2014 <strong>slabs of thickness dx</strong>. Zoom in on a single slab and apply the same three laws.',
  },

  // ── THE DIFFERENTIAL SLAB ────────────────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 2.1',
    heading: 'The Differential Slab',
    intro:
      'Cut the duct into a thin slab of thickness dx. A property enters on the <strong>left face</strong> and leaves on the <strong>right face</strong> changed by a single differential.',
    figure: 'slab',
    caption:
      'Left face: &rho;, T, p, A. Right face: &rho;+d&rho;, T+dT, p+dp, A+dA. Flow passes left \u2192 right; velocity u \u2192 u+du across dx.',
    cards: [
      { tag: 'Left', accent: '#5ec8d8', label: 'Inlet Face',
        body: 'State entering the slab: <strong>&rho;, T, p, A</strong> (with velocity u).' },
      { tag: 'Right', accent: '#f0a93b', label: 'Outlet Face',
        body: 'Each property nudged by one differential: <strong>&rho;+d&rho;, T+dT, p+dp, A+dA</strong> (velocity u+du).' },
    ],
    bridge:
      'Apply mass, momentum, and energy to the slab and keep only first-order terms.',
  },

  // ── CONSERVATION ON THE SLAB ─────────────────────────────────────────────────
  {
    type: 'system',
    sectionNumber: 'Section 2.1',
    heading: 'Conservation on the Slab',
    intro:
      'Each integral balance becomes a differential relation between the two faces of the slab.',
    laws: [
      {
        tag: 'Continuity', accent: '#5ec8d8',
        eq: '\\frac{\\mathrm{d}\\rho}{\\rho} + \\frac{\\mathrm{d}u}{u} + \\frac{\\mathrm{d}A}{A} = 0',
        note: 'From d(&rho;uA) = 0: the fractional changes in density, velocity, and area sum to zero.',
      },
      {
        tag: 'Momentum', accent: '#f0a93b',
        eq: '\\rho u\\,\\mathrm{d}u = -\\,\\mathrm{d}p',
        note: 'On the slab the sloped-wall pressure term p dA cancels the cross-term, leaving A dp \u2014 so the awkward integral collapses to Euler\u2019s equation.',
      },
      {
        tag: 'Energy', accent: '#5ec8d8',
        eq: '\\mathrm{d}h + u\\,\\mathrm{d}u = 0 \\quad (\\mathrm{d}h_t = 0)',
        note: 'Adiabatic, no shaft work: total enthalpy is unchanged across the slab.',
      },
    ],
    closer:
      'These are <strong>exact</strong> for the quasi-1D model \u2014 the geometric neglect of y and z is our only compromise. Time to put them to work on real hardware: the nozzles and diffusers inside an engine.',
  },

  // ── NOZZLES & DIFFUSERS IN THE ENGINE ────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Application',
    heading: 'Nozzles & Diffusers in the Engine',
    intro:
      'Now put the governing equations to work. The two variable-area components in an engine flowpath are the <strong>inlet / diffuser</strong> and the <strong>exit / nozzle</strong>.',
    figure: 'engine-nd',
    caption:
      'Flow enters through the inlet/diffuser (area increases, flow slows) and leaves through the exit/nozzle (area decreases, flow speeds up).',
    cards: [
      { tag: 'In', accent: '#5ec8d8', label: 'Inlet / Diffuser',
        body: 'Purpose: <strong>slow the flow down</strong>, converting kinetic energy into pressure and thermal energy before the compressor.' },
      { tag: 'Out', accent: '#f0a93b', label: 'Exit / Nozzle',
        body: 'Purpose: <strong>speed the flow up</strong>, converting thermal energy into kinetic energy to make thrust.' },
    ],
    bridge:
      'Both are just variable-area ducts \u2014 ideal candidates for the quasi-1D model. But is that model trustworthy here?',
  },

  // ── IS QUASI-1D VALID HERE? ──────────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Application',
    heading: 'Is Quasi-1D Trustworthy Here?',
    intro:
      'Quasi-1D flow is reliable for nozzles and diffusers as long as three assumptions hold.',
    cards: [
      { tag: '1', accent: '#5ec8d8', label: 'Smooth Area Change',
        body: 'The cross-section varies gradually, so the flow stays attached and axial.' },
      { tag: '2', accent: '#5ec8d8', label: 'y, z Changes Negligible',
        body: 'Transverse variation is small next to the axial change \u2014 the core quasi-1D assumption.' },
      { tag: '3', accent: '#f0a93b', label: 'Adiabatic & Steady',
        body: 'Little heat crosses the walls, and conditions do not change in time.' },
    ],
    bridge:
      'Real inlets and nozzles are rarely insulated \u2014 but the flow moves so fast there is little time for heat transfer, so <strong>adiabatic</strong> stays a good approximation.',
  },

  // ── ONE MORE RELATION: TWO INGREDIENTS ───────────────────────────────────────
  {
    type: 'system',
    sectionNumber: 'Section 2.8',
    heading: 'One More Relation \u2014 Two Ingredients',
    intro:
      'We need one relationship that reveals a wealth of information about quasi-1D flow. Build it from two pieces.',
    laws: [
      {
        tag: 'Continuity (expanded)', accent: '#5ec8d8',
        eq: '\\frac{\\mathrm{d}A}{A} + \\frac{\\mathrm{d}u}{u} + \\frac{\\mathrm{d}\\rho}{\\rho} = 0',
        note: 'Product rule on d(&rho;uA) = 0 \u2014 differentiate one factor, hold the other two \u2014 then divide through by &rho;uA.',
      },
      {
        tag: 'Density\u2013Mach link', accent: '#f0a93b',
        eq: '\\frac{\\mathrm{d}\\rho}{\\rho} = -\\,M^2\\,\\frac{\\mathrm{d}u}{u}',
        note: 'Momentum gives dp/&rho; = &minus;u du; the isentropic flow gives a&sup2; = dp/d&rho;. Combine: d&rho;/&rho; = &minus;u du / a&sup2; = &minus;M&sup2; du/u.',
      },
    ],
    closer:
      'Substitute the density\u2013Mach link into expanded continuity to eliminate d&rho; \u2014 and one clean relation falls out.',
  },

  // ── THE AREA\u2013VELOCITY RELATION ──────────────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Section 2.8',
    heading: 'The Area\u2013Velocity Relation',
    intro:
      'Eliminating density leaves a single relation between area change and velocity change \u2014 governed entirely by the Mach number.',
    equation: '\\frac{\\mathrm{d}A}{A} = (M^2 - 1)\\,\\frac{\\mathrm{d}u}{u}',
    equationLabel: 'How area change drives velocity change',
    terms: [
      { sym: 'M',                        def: 'Mach number u/a \u2014 its value above or below 1 sets the sign.' },
      { sym: '\\tfrac{\\mathrm{d}A}{A}', def: 'Fractional area change along the duct.' },
      { sym: '\\tfrac{\\mathrm{d}u}{u}', def: 'Fractional velocity change of the flow.' },
    ],
    cards: [
      { label: 'Where it comes from',
        body: 'Put d&rho;/&rho; = &minus;M&sup2; du/u into dA/A + du/u + d&rho;/&rho; = 0. The velocity terms combine to (1 &minus; M&sup2;) du/u, leaving dA/A = (M&sup2; &minus; 1) du/u.' },
    ],
    bridge:
      'The factor (M&sup2;&minus;1) changes sign at Mach 1 \u2014 exactly why a diffuser and a nozzle take opposite shapes, and why the flow behaves oppositely below and above Mach 1.',
  },

  // ── FOUR MACH-NUMBER CASES ───────────────────────────────────────────────────
  {
    type: 'compare',
    sectionNumber: 'Section 2.8',
    heading: 'Four Mach-Number Cases',
    intro:
      'Read the boxed relation dA/A = (M&sup2;&minus;1) du/u for four values of the Mach number.',
    regimes: [
      { tag: 'M \u2192 0', label: 'Incompressible', accent: '#5ec8d8',
        head: 'Au = constant',
        body: 'Density barely changes, so area and velocity simply trade off: Au &asymp; const.' },
      { tag: '0 \u2264 M < 1', label: 'Subsonic', accent: '#5ec8d8',
        head: 'Converging speeds it up',
        body: '+du (faster) pairs with &minus;dA (smaller area). Decreasing area accelerates subsonic flow.' },
      { tag: 'M > 1', label: 'Supersonic', accent: '#f0a93b',
        head: 'Diverging speeds it up',
        body: '+du (faster) pairs with +dA (larger area). Increasing area accelerates supersonic flow.' },
      { tag: 'M = 1', label: 'Sonic', accent: '#f0a93b',
        head: 'dA/A = 0 \u2192 the throat',
        body: 'Velocity changes with zero area change \u2014 a local minimum (or maximum) area.' },
    ],
    closer:
      'Cases 2 and 3 flip at Mach 1, and case 4 pins M = 1 to the minimum area \u2014 the seed of the convergent\u2013divergent nozzle.',
  },

  // ── CD DUCTS & THE THROAT ────────────────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 2.8',
    heading: 'Convergent\u2013Divergent Ducts & the Throat',
    intro:
      'To expand a gas from <strong>subsonic to supersonic</strong>, it must pass through a <strong>convergent\u2013divergent (CD) duct</strong>. The minimum area between the two sections is the <strong>throat</strong>.',
    figure: 'cd-nozzle',
    caption:
      'Subsonic flow (M &lt; 1) accelerates through the converging section to M = 1 at the throat, then keeps accelerating supersonically (M &gt; 1) in the diverging section.',
    cards: [
      { tag: 'Nozzle', accent: '#5ec8d8', label: 'Subsonic \u2192 Supersonic',
        body: 'Converge to sonic at the throat, then diverge; velocity <strong>increases</strong> the whole way.' },
      { tag: 'Diffuser', accent: '#f0a93b', label: 'Supersonic \u2192 Subsonic',
        body: 'Run the same shape in reverse; velocity <strong>decreases</strong> the whole way, passing M = 1 at the throat.' },
    ],
    bridge:
      'The throat is sonic (M = 1) only if the flow goes supersonic on the far side \u2014 or vice versa. Otherwise it is just the point of maximum subsonic speed.',
  },

  // ── CD NOZZLE IN A ROCKET ENGINE ─────────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Application',
    heading: 'The CD Nozzle in a Rocket Engine',
    intro:
      'The rocket engine is the classic CD nozzle: burn propellant in the chamber, then accelerate the hot gas from subsonic, through sonic at the throat, to supersonic at the exit.',
    figure: 'rocket-cd',
    caption:
      'Fuel and oxidizer burn in the combustion chamber (M &lt; 1); the flow reaches M = 1 at the throat and expands to M &gt; 1 through the exhaust nozzle.',
    cards: [
      { tag: 'Chamber', accent: '#5ec8d8', label: 'Combustion Chamber',
        body: 'High-pressure, low-speed (M &lt; 1) combustion products feed the nozzle.' },
      { tag: 'Nozzle', accent: '#f0a93b', label: 'Exhaust Nozzle',
        body: 'Converges to the throat (M = 1), then diverges to supersonic exhaust (M &gt; 1) \u2014 that is the thrust.' },
    ],
    bridge:
      'Same physics as any CD duct \u2014 combustion just sets the upstream conditions.',
  },

  // ── CD (LAVAL) NOZZLE: HOW GENERAL ───────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Section 2.8',
    heading: 'CD (Laval) Nozzle \u2014 How General Is This?',
    intro:
      'The convergent\u2013divergent nozzle is also called a <strong>Laval nozzle</strong>, and the area\u2013velocity relation is more general than it looks.',
    cards: [
      { tag: '1', accent: '#5ec8d8', label: 'No Perfect-Gas Assumption',
        body: 'dA/A = (M&sup2;&minus;1) du/u was derived with <strong>no</strong> perfect-gas assumption.' },
      { tag: '2', accent: '#5ec8d8', label: 'Holds for Real Gases',
        body: 'It applies to real and even chemically reacting gases \u2014 as well as a perfect gas \u2014 as long as the flow is <strong>isentropic</strong>.' },
      { tag: '3', accent: '#f0a93b', label: 'Differential vs Integral',
        body: 'This differential form is less handy than the integral form \u2014 which we build next.' },
    ],
    bridge:
      'To get that integral form, anchor everything to the one special point every CD nozzle has: the sonic throat.',
  },

  // ── TOWARD THE AREA\u2013MACH RELATION ──────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 2.8',
    heading: 'Toward the Area\u2013Mach Relation',
    intro:
      'Anchor the flow to its <strong>sonic reference</strong> \u2014 the throat, where M = 1. Quantities at sonic conditions carry an <strong>asterisk</strong>: A*, u*, &rho;*.',
    figure: 'cd-throat',
    caption:
      'At the throat: A*, M* = 1, u* = a (the local speed of sound). Compare with any other section of the duct: A, M, u.',
    equation: '\\rho^{*} u^{*} A^{*} = \\rho\\, u\\, A',
    cards: [
      { tag: '*', accent: '#5ec8d8', label: 'Sonic Reference',
        body: 'The throat is where M = 1. Its starred properties are the reference for every other section of the duct.' },
      { tag: 'u*', accent: '#f0a93b', label: 'Throat Velocity',
        body: 'At the throat the gas moves at exactly the speed of sound: <strong>u* = a</strong> (and, being sonic, a gets a * too).' },
    ],
    bridge:
      'Continuity between the throat and a general section, together with the isentropic relations, gives the area ratio A/A* as a function of Mach number \u2014 the integral area\u2013Mach relation, coming next.',
  },

  // ── CONTINUITY \u2192 AREA RATIO ────────────────────────────────────────────────
  {
    type: 'system',
    sectionNumber: 'Section 2.8',
    heading: 'From Continuity to the Area Ratio',
    intro:
      'Apply continuity between the sonic throat and any section, then peel it into ratios we already know. At the throat u* = a* (the flow moves at the local speed of sound), so we write the throat velocity as a*.',
    laws: [
      {
        tag: 'Continuity', accent: '#5ec8d8',
        eq: '\\rho^{*} a^{*} A^{*} = \\rho\\, u\\, A',
        note: 'Mass flow at the throat equals mass flow at the section. Since M = 1 there, u* = a*.',
      },
      {
        tag: 'Divide by A* & \u03c1u', accent: '#f0a93b',
        eq: '\\frac{\\rho^{*}}{\\rho}\\,\\frac{a^{*}}{u} = \\frac{A}{A^{*}}',
        note: 'Divide by A*, then by &rho;u. The area ratio is now a density ratio times a velocity ratio.',
      },
      {
        tag: 'Insert stagnation density', accent: '#5ec8d8',
        eq: '\\frac{A}{A^{*}} = \\frac{\\rho^{*}}{\\rho_t}\\,\\frac{\\rho_t}{\\rho}\\,\\frac{a^{*}}{u}',
        note: 'Multiply and divide by the stagnation density &rho;<sub>t</sub>. Because the flow is isentropic, &rho;<sub>t</sub> is <strong>constant</strong> \u2014 identical at the throat, at our section, and everywhere between.',
      },
    ],
    closer:
      'Every one of these three ratios has a known isentropic form in M and &gamma;. Evaluate them next.',
  },

  // ── THREE ISENTROPIC INGREDIENTS ─────────────────────────────────────────────
  {
    type: 'system',
    sectionNumber: 'Section 2.8',
    heading: 'Three Isentropic Ingredients',
    intro:
      'Write each ratio in terms of M and &gamma;: the isentropic density ratio at a general section, the same relation at the sonic point (M = 1), and the characteristic-Mach relation for the velocity.',
    laws: [
      {
        tag: 'Density at a section', accent: '#5ec8d8',
        eq: '\\frac{\\rho_t}{\\rho} = \\left(1 + \\tfrac{\\gamma-1}{2}M^{2}\\right)^{\\frac{1}{\\gamma-1}}',
        note: 'Stagnation-to-static density anywhere in the duct, straight from isentropic flow.',
      },
      {
        tag: 'Density at the throat', accent: '#f0a93b',
        eq: '\\frac{\\rho_t}{\\rho^{*}} = \\left(1 + \\tfrac{\\gamma-1}{2}\\right)^{\\frac{1}{\\gamma-1}} = \\left(\\tfrac{\\gamma+1}{2}\\right)^{\\frac{1}{\\gamma-1}}',
        note: 'The same relation with M = 1 \u2014 isentropically slow the sonic flow to rest to reach &rho;<sub>t</sub>.',
      },
      {
        tag: 'Velocity ratio', accent: '#5ec8d8',
        eq: '\\left(\\frac{u}{a^{*}}\\right)^{2} = M^{*2} = \\frac{\\tfrac{\\gamma+1}{2}M^{2}}{1 + \\tfrac{\\gamma-1}{2}M^{2}}',
        note: 'The characteristic Mach number M* ties the local speed to the sonic speed a*.',
      },
    ],
    closer:
      'Square A/A*, substitute all three, and the powers of (1 + (&gamma;&minus;1)/2 M&sup2;) and (&gamma;+1)/2 collapse into one bracket.',
  },

  // ── THE AREA\u2013MACH RELATION ─────────────────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Section 2.8',
    heading: 'The Area\u2013Mach Relation',
    intro:
      'Squaring the area ratio and inserting the three ingredients gives one closed-form relation \u2014 the area ratio as a function of Mach number and &gamma; alone.',
    equation: '\\left(\\frac{A}{A^{*}}\\right)^{2} = \\frac{1}{M^{2}}\\left[\\frac{2}{\\gamma+1}\\left(1 + \\frac{\\gamma-1}{2}M^{2}\\right)\\right]^{\\frac{\\gamma+1}{\\gamma-1}}',
    equationLabel: 'Area ratio as a function of M and &gamma;',
    terms: [
      { sym: '\\tfrac{A}{A^{*}}', def: 'Local duct area referenced to the sonic throat area.' },
      { sym: 'M',                def: 'Local Mach number at that section.' },
      { sym: '\\gamma',          def: 'Ratio of specific heats \u2014 1.4 for air, ~1.3 for hot combustion gas.' },
    ],
    cards: [
      { label: 'Where the exponent comes from',
        body: 'Squaring gives (&rho;*/&rho;<sub>t</sub>)&sup2;(&rho;<sub>t</sub>/&rho;)&sup2;(a*/u)&sup2;. The density powers add to (&gamma;+1)/(&gamma;&minus;1) and the (&gamma;+1)/2 factors combine, leaving the single bracket raised to (&gamma;+1)/(&gamma;&minus;1).' },
      { label: 'How general is it',
        body: 'Continuity and the M* relation are exact; only the isentropic ratios assume a calorically perfect gas. Keep &gamma; symbolic and the result holds for any such gas.' },
    ],
    bridge:
      'Its real power: the relation can be turned inside out \u2014 solving for the Mach number from the area ratio alone.',
  },

  // ── TURN IT INSIDE OUT: TWO ROOTS ────────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 2.8',
    heading: 'Turn It Inside Out \u2014 Two Roots',
    intro:
      'Invert the relation to M = f(A/A*). The Mach number anywhere in the duct depends only on the ratio of the local area to the sonic throat area. Because A/A* comes from a square-root, each area ratio maps to <strong>two</strong> Mach numbers.',
    figure: 'area-mach-curve',
    caption:
      'For any A/A* &gt; 1 there are two solutions: one subsonic (lower branch) and one supersonic (upper branch). They meet at the throat, A/A* = 1, M = 1.',
    cards: [
      { tag: 'Two roots', accent: '#5ec8d8', label: 'Subsonic & Supersonic',
        body: 'A square-root function has two roots. The same area ratio serves a slow flow and a fast flow \u2014 which one occurs is set by the back pressure and the duct geometry.' },
      { tag: 'A \u2265 A*', accent: '#f0a93b', label: 'The Throat Is the Minimum',
        body: 'From dA/A = (M&sup2;&minus;1) du/u, isentropic flow needs <strong>A &ge; A*</strong>. An area below the throat has no solution \u2014 A &lt; A* is physically impossible.' },
    ],
    bridge:
      'To get numbers without solving the implicit equation every time, read A/A* from tabulated values.',
  },

  // ── ISENTROPIC TABLES ────────────────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Section 2.8',
    heading: 'Reading Off Values \u2014 Isentropic Tables',
    intro:
      'The area\u2013Mach relation is implicit in M, so solutions for A/A* are pre-computed and tabulated for specific values of &gamma;.',
    cards: [
      { tag: '\u03b3 = 1.4', accent: '#5ec8d8', label: 'Cold Air',
        body: 'The standard for inlets and cold-flow analysis \u2014 Farokhi tabulates the full isentropic set.' },
      { tag: '\u03b3 = 1.3', accent: '#f0a93b', label: 'Hot Gas',
        body: 'Represents high-temperature combustion products through the turbine and nozzle.' },
      { tag: 'App. B', accent: '#5ec8d8', label: 'Isentropic Table',
        body: 'Farokhi Appendix B lists A/A*, p/p<sub>t</sub>, &rho;/&rho;<sub>t</sub>, and T/T<sub>t</sub> versus M \u2014 pick the branch you need.' },
    ],
    bridge:
      'With the area\u2013Mach relation and its tables, you can march Mach number, pressure, and temperature through any isentropic nozzle or diffuser outward from the throat.',
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
  if (name === 'turbofan') {
    return (
      <svg viewBox="0 0 520 150" {...common}>
        <g key={run}>
          <path d="M40 40 L150 40 L300 52 L360 50 L520 30" className="q1d-cowl" />
          <path d="M40 110 L150 110 L300 98 L360 100 L520 120" className="q1d-cowl" />
          <path d="M150 60 L300 66 L360 66 L420 72" className="q1d-core" />
          <path d="M150 90 L300 84 L360 84 L420 78" className="q1d-core" />
          {[150, 200, 250, 300, 360].map((x) => (
            <line key={x} x1={x} y1="42" x2={x} y2="108" className="q1d-station" />
          ))}
          {[[160, 'a'], [180, 'a'], [210, 'c'], [228, 'c'], [246, 'c'], [310, 'r'], [330, 'r']].map(([x, c], i) => (
            <line key={i} x1={x} y1="58" x2={x} y2="92" className={`q1d-blade q1d-blade--${c}`} />
          ))}
          <rect x="265" y="70" width="28" height="10" className="q1d-burner" rx="2" />
          <line x1="6" y1="75" x2="38" y2="75" className="q1d-flow" markerEnd="url(#q1d-a)" />
          <text x="2" y="64" className="q1d-t q1d-t--sm">internal</text>
          <text x="2" y="92" className="q1d-t q1d-t--sm">energy</text>
          <text x="150" y="128" className="q1d-t q1d-t--a">fan · comp</text>
          <text x="262" y="128" className="q1d-t q1d-t--o">burner</text>
          <text x="305" y="128" className="q1d-t q1d-t--r">turbine</text>
          <text x="432" y="128" className="q1d-t q1d-t--sm">nozzle</text>
        </g>
        <defs>
          <marker id="q1d-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead" />
          </marker>
        </defs>
      </svg>
    )
  }
  if (name === 'boundary') {
    return (
      <svg viewBox="0 0 520 170" {...common}>
        <g key={run}>
          <line x1="20" y1="22" x2="500" y2="22" className="q1d-wall" />
          <line x1="20" y1="148" x2="500" y2="148" className="q1d-wall" />
          {[55, 75, 95, 115].map((y) => (
            <line key={y} x1="120" y1={y} x2="240" y2={y} className="q1d-core-arrow" markerEnd="url(#q1d-ac)" />
          ))}
          <text x="148" y="44" className="q1d-t q1d-t--a">uniform core · V&#8734;</text>
          {[[26, 8], [32, 18], [40, 34], [50, 54], [62, 74], [76, 92], [92, 104]].map(([y, len], i) => (
            <line key={i} x1="330" y1={y} x2={330 + len} y2={y} className="q1d-bl-arrow q1d-bl-grow"
                  style={{ animationDelay: `${i * 0.05}s` }} markerEnd="url(#q1d-ao)" />
          ))}
          <line x1="330" y1="22" x2="330" y2="104" className="q1d-bl-axis" />
          <text x="344" y="120" className="q1d-t q1d-t--o">no-slip &rarr; V&#8734;</text>
          <text x="300" y="14" className="q1d-t q1d-t--sm">boundary layer (&delta;)</text>
          <text x="430" y="60" className="q1d-t q1d-t--sm">&delta; &#8810; duct</text>
          <text x="430" y="74" className="q1d-t q1d-t--sm">&rarr; ignore</text>
        </g>
        <defs>
          <marker id="q1d-ac" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-a" />
          </marker>
          <marker id="q1d-ao" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-o" />
          </marker>
        </defs>
      </svg>
    )
  }
  if (name === 'decomp') {
    return (
      <svg viewBox="0 0 520 180" {...common}>
        <g key={run}>
          <path d="M30 30 C150 30 210 70 320 86 L500 96" className="q1d-wall" />
          <path d="M30 150 C150 150 210 110 320 94 L500 84" className="q1d-wall q1d-wall--faint" />
          <line x1="60" y1="90" x2="330" y2="90" className="q1d-axisline" />
          <line x1="120" y1="90" x2="250" y2="90" className="q1d-vax" markerEnd="url(#q1d-ag)" />
          <text x="150" y="106" className="q1d-t q1d-t--a">V_axial</text>
          <line x1="120" y1="90" x2="246" y2="72" className="q1d-vwall" markerEnd="url(#q1d-ar)" />
          <text x="252" y="66" className="q1d-t q1d-t--r">V_wall</text>
          <path d="M168 90 A 48 48 0 0 0 164 82" className="q1d-arc" />
          <text x="176" y="86" className="q1d-t q1d-t--sm">&theta;</text>
          <text x="150" y="150" className="q1d-t q1d-t--sm">&theta; small &rarr; V_wall &asymp; V_axial&middot;cos &theta; &asymp; V_axial</text>
        </g>
        <defs>
          <marker id="q1d-ag" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-a" />
          </marker>
          <marker id="q1d-ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-r" />
          </marker>
        </defs>
      </svg>
    )
  }
  if (name === 'cv-streamtube') {
    return (
      <svg viewBox="0 0 520 230" {...common}>
        <g key={run}>
          {/* streamtube walls (variable area) */}
          <path d="M150 70 C230 60 300 54 360 52" className="q1d-wall" />
          <path d="M150 170 C230 180 300 186 360 188" className="q1d-wall" />
          {/* station lines */}
          <line x1="150" y1="70" x2="150" y2="170" className="q1d-axisline" />
          <line x1="360" y1="52" x2="360" y2="188" className="q1d-axisline" />
          {/* inlet + exit flow arrows */}
          <line x1="96" y1="120" x2="144" y2="120" className="q1d-core-arrow" markerEnd="url(#cv-a)" />
          <line x1="366" y1="120" x2="470" y2="120" className="q1d-core-arrow" markerEnd="url(#cv-a)" />
          {/* station markers */}
          <text x="150" y="206" className="q1d-t q1d-t--a" textAnchor="middle">&#9312;</text>
          <text x="360" y="208" className="q1d-t q1d-t--r" textAnchor="middle">&#9313;</text>
          {/* inlet property stack */}
          <text className="q1d-t q1d-t--a" x="12" y="70">
            <tspan x="12" dy="0">u&#8321;</tspan>
            <tspan x="12" dy="20">&#961;&#8321;</tspan>
            <tspan x="12" dy="20">p&#8321;</tspan>
            <tspan x="12" dy="20">T&#8321;</tspan>
            <tspan x="12" dy="20">A&#8321;</tspan>
          </text>
          {/* exit property stack */}
          <text className="q1d-t q1d-t--r" x="486" y="70">
            <tspan x="486" dy="0">u&#8322;</tspan>
            <tspan x="486" dy="20">&#961;&#8322;</tspan>
            <tspan x="486" dy="20">p&#8322;</tspan>
            <tspan x="486" dy="20">T&#8322;</tspan>
            <tspan x="486" dy="20">A&#8322;</tspan>
          </text>
          {/* streamtube note */}
          <text x="255" y="38" className="q1d-t q1d-t--sm" textAnchor="middle">control surface = streamtube</text>
        </g>
        <defs>
          <marker id="cv-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-a" />
          </marker>
        </defs>
      </svg>
    )
  }
  if (name === 'slab') {
    return (
      <svg viewBox="0 0 540 220" {...common}>
        <g key={run}>
          {/* slab walls (slightly diverging) */}
          <path d="M200 72 L345 62" className="q1d-wall" />
          <path d="M200 166 L345 176" className="q1d-wall" />
          {/* faces */}
          <line x1="200" y1="72" x2="200" y2="166" className="q1d-vax" />
          <line x1="345" y1="62" x2="345" y2="176" className="q1d-vwall" />
          {/* flow through the slab */}
          <line x1="150" y1="119" x2="196" y2="119" className="q1d-core-arrow" markerEnd="url(#slab-a)" />
          <line x1="349" y1="119" x2="404" y2="119" className="q1d-bl-arrow" markerEnd="url(#slab-b)" />
          <text x="150" y="109" className="q1d-t q1d-t--a">u</text>
          <text x="352" y="109" className="q1d-t q1d-t--r">u+du</text>
          {/* dx dimension */}
          <line x1="200" y1="190" x2="345" y2="190" className="q1d-axisline" />
          <line x1="200" y1="185" x2="200" y2="195" className="q1d-station" />
          <line x1="345" y1="185" x2="345" y2="195" className="q1d-station" />
          <text x="272" y="207" className="q1d-t q1d-t--sm" textAnchor="middle">dx</text>
          {/* left face properties */}
          <text x="70" y="70" className="q1d-t q1d-t--sm" textAnchor="middle">left face</text>
          <text className="q1d-t q1d-t--a" x="70" y="86" textAnchor="middle">
            <tspan x="70" dy="0">ρ</tspan>
            <tspan x="70" dy="20">T</tspan>
            <tspan x="70" dy="20">p</tspan>
            <tspan x="70" dy="20">A</tspan>
          </text>
          {/* right face properties */}
          <text x="458" y="70" className="q1d-t q1d-t--sm" textAnchor="middle">right face</text>
          <text className="q1d-t q1d-t--r" x="458" y="86" textAnchor="middle">
            <tspan x="458" dy="0">ρ+dρ</tspan>
            <tspan x="458" dy="20">T+dT</tspan>
            <tspan x="458" dy="20">p+dp</tspan>
            <tspan x="458" dy="20">A+dA</tspan>
          </text>
        </g>
        <defs>
          <marker id="slab-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-a" />
          </marker>
          <marker id="slab-b" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-o" />
          </marker>
        </defs>
      </svg>
    )
  }
  if (name === 'engine-nd') {
    return (
      <svg viewBox="0 0 560 210" {...common}>
        <g key={run}>
          {/* nacelle top wall: inlet -> diffuser (diverge) -> core -> nozzle (converge) */}
          <path d="M55 80 C95 75 145 68 185 66 L360 66 C405 68 470 80 505 92" className="q1d-wall" />
          {/* nacelle bottom wall (mirror about y=110) */}
          <path d="M55 140 C95 145 145 152 185 154 L360 154 C405 152 470 140 505 128" className="q1d-wall" />
          {/* station lines */}
          <line x1="55" y1="80" x2="55" y2="140" className="q1d-axisline" />
          <line x1="185" y1="66" x2="185" y2="154" className="q1d-station" />
          <line x1="360" y1="66" x2="360" y2="154" className="q1d-station" />
          <line x1="505" y1="92" x2="505" y2="128" className="q1d-axisline" />
          {/* inlet + exit flow arrows */}
          <line x1="8" y1="110" x2="50" y2="110" className="q1d-core-arrow" markerEnd="url(#nd-a)" />
          <line x1="510" y1="110" x2="552" y2="110" className="q1d-bl-arrow" markerEnd="url(#nd-b)" />
          {/* region labels */}
          <text x="120" y="186" className="q1d-t q1d-t--a" textAnchor="middle">inlet · diffuser</text>
          <text x="272" y="186" className="q1d-t q1d-t--sm" textAnchor="middle">engine core</text>
          <text x="432" y="186" className="q1d-t q1d-t--r" textAnchor="middle">exit · nozzle</text>
          {/* behaviour cues */}
          <text x="120" y="112" className="q1d-t q1d-t--sm" textAnchor="middle">area ↑ · slows</text>
          <text x="432" y="112" className="q1d-t q1d-t--sm" textAnchor="middle">area ↓ · speeds</text>
        </g>
        <defs>
          <marker id="nd-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-a" />
          </marker>
          <marker id="nd-b" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-o" />
          </marker>
        </defs>
      </svg>
    )
  }
  if (name === 'cd-nozzle') {
    return (
      <svg viewBox="0 0 520 200" {...common}>
        <g key={run}>
          <path d="M40 55 C130 56 210 79 250 80 C295 81 400 52 480 45" className="q1d-wall" />
          <path d="M40 145 C130 144 210 121 250 120 C295 119 400 148 480 155" className="q1d-wall" />
          <line x1="8" y1="100" x2="38" y2="100" className="q1d-core-arrow" markerEnd="url(#cdn-a)" />
          <line x1="482" y1="100" x2="512" y2="100" className="q1d-bl-arrow" markerEnd="url(#cdn-b)" />
          <text x="250" y="30" className="q1d-t q1d-t--sm" textAnchor="middle">throat</text>
          <line x1="250" y1="36" x2="250" y2="76" className="q1d-axisline" />
          <text x="250" y="104" className="q1d-t q1d-t--sm" textAnchor="middle">u increasing →</text>
          <text x="140" y="186" className="q1d-t q1d-t--a" textAnchor="middle">M &lt; 1</text>
          <text x="250" y="186" className="q1d-t q1d-t--sm" textAnchor="middle">M = 1</text>
          <text x="395" y="186" className="q1d-t q1d-t--r" textAnchor="middle">M &gt; 1</text>
        </g>
        <defs>
          <marker id="cdn-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-a" /></marker>
          <marker id="cdn-b" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-o" /></marker>
        </defs>
      </svg>
    )
  }
  if (name === 'rocket-cd') {
    return (
      <svg viewBox="0 0 560 220" {...common}>
        <g key={run}>
          <rect x="95" y="72" width="150" height="76" rx="10" className="q1d-wall" fill="none" />
          <line x1="55" y1="40" x2="108" y2="72" className="q1d-core-arrow" markerEnd="url(#rk-a)" />
          <line x1="55" y1="180" x2="108" y2="148" className="q1d-core-arrow" markerEnd="url(#rk-a)" />
          <text x="46" y="34" className="q1d-t q1d-t--sm" textAnchor="middle">fuel</text>
          <text x="42" y="196" className="q1d-t q1d-t--sm" textAnchor="middle">oxidizer</text>
          <path d="M245 78 C300 80 332 96 360 98 C400 101 470 66 525 58" className="q1d-wall" />
          <path d="M245 142 C300 140 332 124 360 122 C400 119 470 154 525 162" className="q1d-wall" />
          <line x1="527" y1="110" x2="555" y2="110" className="q1d-bl-arrow" markerEnd="url(#rk-b)" />
          <text x="170" y="106" className="q1d-t q1d-t--a" textAnchor="middle">combustion</text>
          <text x="170" y="124" className="q1d-t q1d-t--sm" textAnchor="middle">chamber · M &lt; 1</text>
          <text x="360" y="44" className="q1d-t q1d-t--sm" textAnchor="middle">throat · M = 1</text>
          <line x1="360" y1="50" x2="360" y2="94" className="q1d-axisline" />
          <text x="474" y="198" className="q1d-t q1d-t--r" textAnchor="middle">exhaust · M &gt; 1</text>
        </g>
        <defs>
          <marker id="rk-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-a" /></marker>
          <marker id="rk-b" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-o" /></marker>
        </defs>
      </svg>
    )
  }
  if (name === 'cd-throat') {
    return (
      <svg viewBox="0 0 520 210" {...common}>
        <g key={run}>
          <path d="M40 55 C130 56 210 79 250 80 C295 81 400 52 480 45" className="q1d-wall" />
          <path d="M40 145 C130 144 210 121 250 120 C295 119 400 148 480 155" className="q1d-wall" />
          <line x1="8" y1="100" x2="38" y2="100" className="q1d-core-arrow" markerEnd="url(#cdt-a)" />
          <line x1="482" y1="100" x2="512" y2="100" className="q1d-bl-arrow" markerEnd="url(#cdt-b)" />
          <text x="120" y="28" className="q1d-t q1d-t--sm" textAnchor="middle">converging</text>
          <text x="405" y="28" className="q1d-t q1d-t--sm" textAnchor="middle">diverging</text>
          <text className="q1d-t q1d-t--a" x="250" y="140" textAnchor="middle">
            <tspan x="250" dy="0">A*</tspan>
            <tspan x="250" dy="16">M* = 1</tspan>
            <tspan x="250" dy="16">u* = a</tspan>
          </text>
          <line x1="372" y1="60" x2="372" y2="140" className="q1d-station" />
          <text className="q1d-t q1d-t--r" x="398" y="84">
            <tspan x="398" dy="0">A</tspan>
            <tspan x="398" dy="16">M</tspan>
            <tspan x="398" dy="16">u</tspan>
          </text>
          <text x="398" y="160" className="q1d-t q1d-t--sm">(any section)</text>
        </g>
        <defs>
          <marker id="cdt-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-a" /></marker>
          <marker id="cdt-b" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-o" /></marker>
        </defs>
      </svg>
    )
  }
  if (name === 'area-mach-curve') {
    return (
      <svg viewBox="0 0 520 292" {...common}>
        <g key={run}>
          {/* axes */}
          <line x1="70" y1="24" x2="70" y2="242" className="q1d-wall" />
          <line x1="70" y1="240" x2="502" y2="240" className="q1d-wall" />
          {/* y ticks + labels (Mach number) */}
          {[['4.0', 30], ['3.0', 82.5], ['2.0', 135], ['1.0', 187.5], ['0.1', 234.75]].map(([lbl, y]) => (
            <g key={lbl}>
              <line x1="66" y1={y} x2="70" y2={y} className="q1d-station" />
              <text x="60" y={y + 3.5} className="q1d-t q1d-t--sm" textAnchor="end">{lbl}</text>
            </g>
          ))}
          {/* x ticks + labels (area ratio) */}
          {[['1.0', 70], ['2.0', 148], ['4.0', 305], ['6.0', 461]].map(([lbl, x]) => (
            <g key={lbl}>
              <line x1={x} y1="240" x2={x} y2="244" className="q1d-station" />
              <text x={x} y="256" className="q1d-t q1d-t--sm" textAnchor="middle">{lbl}</text>
            </g>
          ))}
          {/* axis titles */}
          <text x="20" y="140" className="q1d-t q1d-t--sm" textAnchor="middle" transform="rotate(-90 20 140)">Mach number  M</text>
          <text x="286" y="276" className="q1d-t q1d-t--sm" textAnchor="middle">area ratio  A / A*</text>
          {/* throat guide line at M = 1 */}
          <line x1="70" y1="187.5" x2="128" y2="187.5" className="q1d-axisline" />
          <text x="134" y="191" className="q1d-t q1d-t--sm">M = 1</text>
          {/* supersonic branch (upper, cyan) */}
          <path d="M70 187.5 L72.3 177 L83.8 161.3 L104.3 145.5 L124 135 L163.4 119.3 L198 108.8 L265.5 93 L322.6 82.5 L392 72 L475 61.5"
                className="q1d-core-arrow" fill="none" />
          {/* subsonic branch (lower, orange) */}
          <path d="M70 187.5 L73 198 L84.7 208.5 L96.6 213.8 L116.1 219 L151 224.3 L179.6 226.9 L223.3 229.5 L297.6 232.1 L447 234.8"
                className="q1d-bl-arrow" fill="none" />
          {/* branch labels */}
          <text x="214" y="98" className="q1d-t q1d-t--a" textAnchor="middle">supersonic</text>
          <text x="150" y="223" className="q1d-t q1d-t--o" textAnchor="middle">subsonic</text>
          {/* vertex (throat) marker */}
          <circle cx="70" cy="187.5" r="3.2" className="q1d-ahead-a" />
        </g>
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
              <span className="cmp-tag" style={{ background: c.accent }}>{c.tag}</span>
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
  const cardStart = step
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
                <span className="cmp-tag" style={{ background: c.accent }}>{c.tag}</span>
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
              <span className="regime-tag" style={{ background: r.accent }}>{r.tag}</span>
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
        <span className="nav-hint">&larr; &rarr; or click · hover diagrams to replay</span>
      </div>
    </div>
  )
}

// ─── Styles (shared theme with Unit 1 / Unit 2) ──────────────────────────────
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
  border-radius:8px;padding:14px 26px;font-size:20px}
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

/* figures */
.q1d-fig{margin:0 0 14px;background:var(--panel);border:1px solid var(--rule);
  border-radius:12px;padding:16px 18px 12px}
.q1d-fig figcaption{font-size:12.5px;line-height:1.45;color:var(--muted);text-align:center;margin-top:10px}
.q1d-svg{width:100%;height:auto;cursor:pointer;display:block}

/* figure primitives */
.q1d-cowl{fill:none;stroke:var(--muted);stroke-width:1.6}
.q1d-core{fill:none;stroke:var(--rule);stroke-width:1.2}
.q1d-station{stroke:var(--rule);stroke-width:1;stroke-dasharray:3 3}
.q1d-blade{stroke-width:2}
.q1d-blade--a{stroke:var(--accent)}
.q1d-blade--c{stroke:#6fb6e8}
.q1d-blade--r{stroke:var(--accent-2)}
.q1d-burner{fill:var(--accent-2);opacity:.6}
.q1d-flow{stroke:var(--muted);stroke-width:1.4}
.q1d-wall{fill:none;stroke:var(--muted);stroke-width:2}
.q1d-wall--faint{opacity:.35}
.q1d-axisline{stroke:var(--rule);stroke-width:1;stroke-dasharray:4 4}
.q1d-core-arrow{stroke:var(--accent);stroke-width:2}
.q1d-bl-arrow{stroke:var(--accent-2);stroke-width:1.8}
.q1d-bl-axis{stroke:var(--accent-2);stroke-width:1;stroke-dasharray:2 3}
.q1d-vax{stroke:var(--accent);stroke-width:2.5}
.q1d-vwall{stroke:var(--accent-2);stroke-width:2.5}
.q1d-arc{fill:none;stroke:var(--muted);stroke-width:1}
.q1d-ahead{fill:var(--muted)}
.q1d-ahead-a{fill:var(--accent)}
.q1d-ahead-o{fill:var(--accent-2)}
.q1d-ahead-r{fill:var(--accent-2)}
.q1d-t{font-family:var(--body);font-size:11px;fill:var(--ink)}
.q1d-t--sm{font-size:9px;fill:var(--muted)}
.q1d-t--a{fill:var(--accent);font-size:10px}
.q1d-t--o{fill:var(--accent-2);font-size:9px}
.q1d-t--r{fill:var(--accent-2);font-size:11px}

/* boundary-layer grow-in (replays via key bump) */
.q1d-bl-grow{transform-box:view-box;transform-origin:330px center;
  animation:q1dGrow .7s ease both}
@keyframes q1dGrow{from{transform:scaleX(0)}to{transform:scaleX(1)}}

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

@media (max-width:720px){
  .slide-heading{font-size:26px}
  .main-title{font-size:46px}
  .term-grid{grid-template-columns:1fr}
  .cmp-row,.law-col{flex-direction:column}
  .title-meta{gap:24px}
}
@media (prefers-reduced-motion:reduce){
  .anim-in,.reveal-block,.cmp-card,.law-card,.regime-card{animation:none;transition:none}
  .q1d-bl-grow{animation:none;transform:none}
}
`
