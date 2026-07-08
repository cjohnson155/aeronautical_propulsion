import { useState, useEffect, useCallback, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// ─────────────────────────────────────────────────────────────────────────────
//  ME 3470 · Rayleigh Flow — Constant-Area Flow with Heat Addition
//  Built from the Unit 4 lecture notes, in the shared Unit 3 presentation system:
//    • navy/cyan theme via CSS variables + <style>{CSS}
//    • type-driven slide renderers, KaTeX via the shared <Equation/>
//    • step-by-step reveals, click / arrow-key advance
//    • top bar · nav dots · progress bar
//
//  Signature figures (inline SVG, re-themed to the deck):
//    'rayleigh-hs'      – Rayleigh line on an h–s diagram (accurate CPG curve)
//    'domain-influence' – elliptic vs hyperbolic wavefront propagation
//    'tts-curve'        – T/T* vs Mach number (non-monotonic subsonic branch)
//    'rayleigh-duct'    – constant-area, frictionless duct with heat addition
//
//  Diagrams re-play on hover/click and respect prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────────────────────

export const meta = {
  courseId:  'ME 3470',
  deckTitle: 'Rayleigh Flow · Constant-Area Flow with Heat Addition, Combustor Modeling & Thermal Choking',
}

export const slides = [

  // ── TITLE ───────────────────────────────────────────────────────────────────
  {
    type: 'title',
    eyebrow: 'Undergraduate Course \u00b7 ME 3470',
    title: 'Rayleigh Flow<br>with Heat Addition',
    subtitle: 'What Rayleigh flow models, the conservation laws that carry a heat term, the conserved impulse of a constant-area duct, how heat drives subsonic and supersonic flow in opposite directions, and why both branches choke at Mach 1.',
    meta: [
      { label: 'Unit',      value: '04 \u2014 Rayleigh Flow' },
      { label: 'Topics',    value: 'Governing equations \u00b7 Combustor gas models \u00b7 Fluid impulse \u00b7 h\u2013s Rayleigh line \u00b7 Thermal choking' },
      { label: 'Builds on', value: 'Unit 3 \u2014 Quasi-1D Flow' },
    ],
  },

  // ── WHAT IS RAYLEIGH FLOW ────────────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Unit 4',
    heading: 'What Is Rayleigh Flow?',
    intro:
      'Rayleigh flow is <strong>one-dimensional flow with heat transfer</strong> in a constant-area duct. The classic propulsion example is the burner in a turbojet or ramjet, where fuel\u2013air combustion dumps heat into the stream.',
    cards: [
      { tag: '1D + q', accent: '#5ec8d8', label: 'Flow With Heat Addition',
        body: 'Steady, inviscid, constant-area flow where heat <strong>q</strong> is added per unit mass \u2014 no area change, no friction, just heating (or cooling).' },
      { tag: 'Burner', accent: '#f0a93b', label: 'The Combustor Model',
        body: 'Models the combustion chamber of a turbojet or ramjet: the heat of combustion is exactly the <strong>q</strong> added to the flow.' },
      { tag: 'Est', accent: '#5ec8d8', label: 'Preliminary-Design Tool',
        body: 'A simple, good model for early combustion-chamber estimates \u2014 especially <strong>choking</strong> behavior and Mach-number trends.' },
    ],
    bridge:
      'Start where every control-volume analysis starts \u2014 the conservation laws, now carrying a heat term.',
  },

  // ── GOVERNING EQUATIONS ──────────────────────────────────────────────────────
  {
    type: 'system',
    sectionNumber: 'Section 1',
    heading: 'Governing Equations',
    intro:
      'For a steady, inviscid, constant-area control volume with heat added per unit mass, write mass, momentum, and energy between inlet (1) and outlet (2).',
    laws: [
      {
        tag: 'Continuity', accent: '#5ec8d8',
        eq: '\\rho_1 u_1 = \\rho_2 u_2',
        note: 'Constant area, so mass conservation reduces to &rho;u = const \u2014 no area terms survive.',
      },
      {
        tag: 'Momentum', accent: '#f0a93b',
        eq: 'p_1 + \\rho_1 u_1^2 = p_2 + \\rho_2 u_2^2',
        note: 'Constant-area and frictionless: pressure plus momentum flux is balanced across the duct.',
      },
      {
        tag: 'Energy', accent: '#5ec8d8',
        eq: 'h_1 + \\tfrac{u_1^2}{2} + q = h_2 + \\tfrac{u_2^2}{2}',
        note: 'The heat added per unit mass <strong>q</strong> raises the total enthalpy \u2014 the one term that makes this Rayleigh flow.',
      },
    ],
    closer:
      'Here u is axial speed, h static enthalpy, q heat added per unit mass; subscripts 1 and 2 are inlet and outlet. These three, plus an equation of state, close the problem.',
  },

  // ── SOLVING INLET -> OUTLET ──────────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Section 1',
    heading: 'Solving Inlet \u2192 Outlet',
    intro:
      'Know the inlet state and the heat added, and the outlet state follows from these balances plus an equation of state \u2014 but <strong>how</strong> you solve depends on the gas model.',
    cards: [
      { tag: 'Set', accent: '#5ec8d8', label: 'What Closes the Problem',
        body: 'Given state 1 and q, the conservation equations plus an equation of state determine <strong>state 2</strong> completely.' },
      { tag: 'Real', accent: '#f0a93b', label: 'General Gas \u2192 Numerical',
        body: 'For a general gas model, there is usually no closed form \u2014 the solution is <strong>numerical</strong>.' },
      { tag: 'CPG', accent: '#5ec8d8', label: 'Perfect Gas \u2192 Closed Form',
        body: 'Approximate the gas as <strong>calorically perfect</strong> (CPG) and closed-form analytical Rayleigh-flow relations become available.' },
    ],
    bridge:
      'The CPG shortcut is tempting \u2014 but a real combustor is a hostile place for that assumption.',
  },

  // ── GAS MODEL IN A REAL COMBUSTOR ────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Section 2',
    heading: 'The Gas Model in a Real Combustor',
    intro:
      'The CPG assumption is <strong>not physically exact</strong> inside a real combustor, so it is worth knowing what you trade away when you use it.',
    cards: [
      { tag: '\u26a0', accent: '#f0a93b', label: 'Where CPG Breaks Down',
        body: 'Combustor temperatures are very high, so c<sub>p</sub> and c<sub>v</sub> shift with temperature and composition; extra species and dissociation / reaction effects can matter too.' },
      { tag: 'Use', accent: '#5ec8d8', label: 'Use It for Estimates',
        body: 'Lean on CPG Rayleigh relations for <strong>preliminary design</strong> and rough estimates of choking, Mach number, and trends \u2014 not final numbers.' },
      { tag: '\u03b3 \u2248 1.3', accent: '#f0a93b', label: 'Tune \u03b3, or Go TPG',
        body: 'A thermally perfect gas (TPG) allows variable specific heats but usually removes the analytical solution. An average &gamma; offsets some error \u2014 for hot products, <strong>&gamma; \u2248 1.3</strong> beats 1.4.' },
    ],
    bridge:
      'With a gas model chosen, specialize the momentum balance to the constant-area, frictionless duct \u2014 where a single quantity stays fixed.',
  },

  // ── THE CONSTANT-AREA RAYLEIGH DUCT ──────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 3',
    heading: 'The Constant-Area Rayleigh Duct',
    intro:
      'Picture the hardware: a straight duct of <strong>constant cross-section</strong> with frictionless walls. Heat is added between an upstream region 1 and a downstream region 2.',
    figure: 'rayleigh-duct',
    caption:
      'Constant-area, frictionless duct with heat addition q. Region 1 is upstream, region 2 downstream; the area A never changes, and the mass flow rate &#7745; = &rho;uA stays constant along the duct.',
    cards: [
      { tag: '\u2460\u2192\u2461', accent: '#5ec8d8', label: 'Heat Between Two Stations',
        body: 'The flow enters at region 1, receives heat <strong>q</strong>, and leaves at region 2 \u2014 same area, changed state.' },
      { tag: 'A = const', accent: '#f0a93b', label: 'Why Constant Area Matters',
        body: 'With A fixed and no wall friction, the momentum balance simplifies dramatically \u2014 leading to a conserved <strong>impulse</strong>.' },
    ],
    bridge:
      'For a CPG in this duct, one combination of pressure, area, and Mach number stays constant along the whole length.',
  },

  // ── THE FLUID IMPULSE ────────────────────────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Section 3',
    heading: 'The Fluid Impulse',
    intro:
      'In a constant-area, frictionless duct with a CPG, the <strong>fluid impulse</strong> is constant along the duct \u2014 the momentum balance written as a single conserved quantity.',
    equation: 'I = pA + \\rho u^2 A = pA\\,(1 + \\gamma M^2)',
    equationLabel: 'Conserved along a constant-area Rayleigh duct',
    terms: [
      { sym: 'pA',            def: 'Pressure force acting on the cross-section of area A.' },
      { sym: '\\rho u^2 A',   def: 'Momentum flux carried through that section.' },
      { sym: '1 + \\gamma M^2', def: 'Recasts the momentum flux using a = \u221a(&gamma;RT): &rho;u&sup2; = &gamma;pM&sup2;.' },
    ],
    cards: [
      { label: 'Why it is conserved',
        body: 'With constant area and no friction, the momentum equation p + &rho;u&sup2; = const, multiplied by A, is exactly I = const from region 1 to region 2.' },
      { label: 'What it buys you',
        body: 'Because pA(1 + &gamma;M&sup2;) is fixed, a rise in pressure must be met by a fall in Mach number and velocity \u2014 the mechanism behind supersonic compression under heating.' },
    ],
    bridge:
      'Now let heat act on this duct and track the state on an enthalpy\u2013entropy diagram \u2014 the single most revealing picture in Rayleigh flow.',
  },

  // ── THE RAYLEIGH LINE (h–s)  · SIGNATURE ─────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 4',
    heading: 'The Rayleigh Line on an h\u2013s Diagram',
    intro:
      'Plot every state the duct can reach at fixed mass flux and momentum flux, and they trace a single curve \u2014 the <strong>Rayleigh line</strong>. Heating and cooling just slide the state along it.',
    figure: 'rayleigh-hs',
    caption:
      'Subsonic (solid) and supersonic (dashed) branches meet at the sonic point M = 1 \u2014 the rightmost, maximum-entropy state and the choking limit. Static T (\u221d h/h*) peaks slightly earlier, at M = 1/\u221a&gamma; \u2248 0.845, still on the subsonic branch. Heating moves either branch toward M = 1; cooling moves it away.',
    cards: [
      { tag: 'Sub', accent: '#5ec8d8', label: 'Subsonic Branch',
        body: 'The upper branch. Heating climbs it toward the sonic point; the very top of the curve is the <strong>maximum static temperature</strong> at M = 1/\u221a&gamma;.' },
      { tag: 'Sup', accent: '#f0a93b', label: 'Supersonic Branch',
        body: 'The lower dashed branch. Heating drives it up toward the same sonic point, <strong>compressing and slowing</strong> the gas along the way.' },
      { tag: 'M=1', accent: '#5ec8d8', label: 'Sonic Point = Choking',
        body: 'The nose is the maximum entropy reachable on this line. Heat can push a flow to it but <strong>never past it</strong> \u2014 that limit is thermal choking.' },
    ],
    bridge:
      'Both branches head to M = 1, but the way temperature behaves along the subsonic branch is surprising \u2014 worth its own plot.',
  },

  // ── HEAT ADDITION ON EACH BRANCH ─────────────────────────────────────────────
  {
    type: 'compare',
    sectionNumber: 'Section 4',
    heading: 'Heat Addition on Each Branch',
    intro:
      'At a fixed mass flow rate, continuity &#7745; = &rho;uA forces density and velocity to adjust as heat is added \u2014 and the subsonic and supersonic branches respond oppositely.',
    regimes: [
      { tag: 'M < 1', label: 'Subsonic', accent: '#5ec8d8',
        head: 'Density falls \u00b7 velocity rises',
        body: 'Density &rho; falls monotonically and the flow speeds up (u rises) to hold &#7745; = &rho;uA. Static T rises only to M = 1/\u221a&gamma; \u2248 0.845, then <strong>falls</strong> even as T<sub>0</sub> keeps climbing \u2014 the added energy turns into kinetic energy. Heating drives M \u2192 1.' },
      { tag: 'M > 1', label: 'Supersonic', accent: '#f0a93b',
        head: 'Gas compresses \u00b7 flow slows',
        body: 'Static T rises monotonically, density &rho; <strong>rises</strong>, and the flow decelerates. With u falling, &rho; must rise to keep &#7745; = &rho;uA. Heating still drives M \u2192 1 \u2014 from the other side.' },
    ],
    closer:
      'The subsonic and supersonic responses are mirror images, and both march toward sonic flow \u2014 but the subsonic temperature reversal deserves a closer look.',
  },

  // ── T/T* vs MACH NUMBER ──────────────────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 4b',
    heading: 'T/T* vs Mach Number',
    intro:
      'The temperature story on the subsonic branch is <strong>not monotonic</strong>. Track static temperature, referenced to its sonic value, as heating pushes the Mach number toward 1 (CPG, &gamma; = 1.4).',
    figure: 'tts-curve',
    caption:
      'T/T* rises from 0 at M = 0, peaks at M = 1/\u221a&gamma; \u2248 0.845, then falls back through 1 at M = 1. In the shaded window (0.845 < M < 1), heating actually lowers static T even though the stagnation temperature T<sub>0</sub> keeps rising. On the supersonic side, T/T* rises as M falls toward 1 under heating.',
    cards: [
      { tag: 'Peak', accent: '#5ec8d8', label: 'Maximum Static T',
        body: 'Static temperature is highest at M = 1/\u221a&gamma; \u2248 0.845 \u2014 still subsonic, and short of the sonic point.' },
      { tag: 'Cools', accent: '#f0a93b', label: 'Heating That Cools',
        body: 'Past the peak, added heat goes into kinetic energy: static T <strong>drops</strong> while T<sub>0</sub> rises. Density keeps falling and velocity keeps rising the whole way.' },
    ],
    bridge:
      'So why does the flow behave so oppositely once it is supersonic? It comes down to what a pressure signal can and cannot reach.',
  },

  // ── WHY SUPERSONIC HEATING COMPRESSES & SLOWS ────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Section 4a',
    heading: 'Why Supersonic Heating Compresses & Slows',
    intro:
      'The deciding factor is how fast pressure information travels versus how fast the gas moves \u2014 the speed of sound a = \u221a(&gamma;RT) against the flow speed u, i.e. the Mach number M = u/a.',
    cards: [
      { tag: 'a \u221d \u221aT', accent: '#5ec8d8', label: 'Heating Speeds the Messenger',
        body: 'Random thermal molecular speed scales with \u221aT, and so does a. Hotter gas communicates pressure changes faster \u2014 but that local rise in a is only <strong>part</strong> of the story.' },
      { tag: 'M > 1', accent: '#f0a93b', label: 'Signals Can\u2019t Outrun the Flow',
        body: 'Supersonic flow moves faster than disturbances can travel upstream. A heated parcel can\u2019t warn the incoming gas \u2014 it keeps arriving and piles into the heated region, so the attempted expansion shows up as <strong>compression</strong>: p and &rho; rise.' },
      { tag: 'I', accent: '#5ec8d8', label: 'Momentum Ties It Together',
        body: 'The impulse I = pA(1 + &gamma;M&sup2;) is fixed, so if p and &rho; rise, u must <strong>fall</strong>. The deceleration is not separate \u2014 it is the direct consequence of the pressure rise. On this branch a rises and u falls, so M drops toward 1 fast.' },
    ],
    bridge:
      'Below Mach 1 the flow can \u201canticipate\u201d and expand smoothly; above it, the flow responds through compression \u2014 much like the front of a normal shock. The same elliptic-vs-hyperbolic split governs all compressible flow.',
  },

  // ── DOMAIN OF INFLUENCE (elliptic vs hyperbolic) ─────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 4a',
    heading: 'Domain of Influence \u2014 Elliptic vs Hyperbolic',
    intro:
      'Why subsonic and supersonic flow respond so differently to heat comes down to <strong>where a disturbance can reach</strong>. A point source moves right at Mach M; each wavefront is a sphere expanding at the speed of sound from where the source was when it fired.',
    figure: 'domain-influence',
    caption:
      'M = 0.5: wavefronts reach every direction, including upstream (elliptic). M = 1: they pile up at the source \u2014 nothing gets upstream (parabolic). M = 2: confined to a downstream Mach cone of half-angle &mu;, sin &mu; = 1/M; everything outside is a zone of silence (hyperbolic).',
    cards: [
      { tag: 'M<1', accent: '#5ec8d8', label: 'Reaches Upstream',
        body: 'Disturbances travel in every direction. The flow feels what is coming and adjusts smoothly \u2014 <strong>elliptic</strong> behavior.' },
      { tag: 'M>1', accent: '#f0a93b', label: 'Zone of Silence',
        body: 'Signals are trapped in the Mach cone behind the source. Upstream gas gets no warning, so heat release forces <strong>compression</strong> instead \u2014 hyperbolic behavior.' },
    ],
    bridge:
      'This is exactly why heating compresses and decelerates a supersonic stream: the flow literally cannot be told to get out of the way.',
  },

  // ── THERMAL CHOKING ──────────────────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Section 4',
    heading: 'Thermal Choking',
    intro:
      'For frictionless heat addition, ds = &delta;q/T, so heating always <strong>increases entropy</strong> \u2014 moving the state toward higher s on either branch. But the sonic point M = 1 is the single state of maximum entropy reachable at a fixed mass flux and momentum flux.',
    cards: [
      { tag: 'M\u21921', accent: '#5ec8d8', label: 'Both Branches Head to Sonic',
        body: 'Heating pushes subsonic flow up toward M = 1 and supersonic flow down toward M = 1. Cooling reverses it. Neither branch can be heated <strong>past</strong> the sonic point.' },
      { tag: 'Stop', accent: '#f0a93b', label: 'Reaching M = 1 Locks the Flow',
        body: 'Adding more heat once M = 1 is impossible without violating the 2nd law. This is <strong>thermal choking</strong> \u2014 the heat the flow can accept is capped for the given inlet.' },
      { tag: 'Adjust', accent: '#5ec8d8', label: 'The Duct Responds Upstream',
        body: 'Forced with more heat, the flow re-adjusts upstream: the mass flow rate drops, or on the supersonic branch a <strong>normal shock</strong> forms upstream, jumping the flow onto a new, less-demanding Rayleigh line.' },
    ],
    bridge:
      'Thermal choking is the combustor\u2019s version of the area choking seen in nozzles \u2014 a hard ceiling set by the physics, not the hardware.',
  },

  // ── KEY TAKEAWAY ─────────────────────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Key Takeaway',
    heading: 'Key Takeaway',
    intro:
      'Rayleigh flow captures the <strong>first-order effect</strong> of heat addition in a constant-area combustor \u2014 enough to size choking and Mach trends before a full reacting-gas calculation.',
    cards: [
      { tag: 'Sub', accent: '#5ec8d8', label: 'Subsonic Heating',
        body: 'Density falls and velocity rises. Static T peaks at M = 1/\u221a&gamma;, then falls even as T<sub>0</sub> keeps rising \u2014 energy shifts into kinetic form.' },
      { tag: 'Sup', accent: '#f0a93b', label: 'Supersonic Heating',
        body: 'The gas compresses and decelerates \u2014 pressure and density rise as the flow slows, because signals cannot propagate upstream.' },
      { tag: 'Choke', accent: '#5ec8d8', label: 'Both Choke at M = 1',
        body: 'Heat drives either branch toward sonic flow and no further. Use CPG relations for quick estimates; refine with variable &gamma; (\u2248 1.3) for hot products.' },
    ],
    bridge:
      'A fast, honest first model for a burner \u2014 good enough to pin down choking and trends, and to know when a fuller reacting-gas analysis is required.',
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

  if (name === 'rayleigh-duct') {
    return (
      <svg viewBox="0 0 520 220" {...common}>
        <g key={run}>
          {/* constant-area duct: parallel walls */}
          <line x1="120" y1="72" x2="404" y2="72" className="q1d-wall" />
          <line x1="120" y1="150" x2="404" y2="150" className="q1d-wall" />
          {/* stations */}
          <line x1="120" y1="72" x2="120" y2="150" className="q1d-axisline" />
          <line x1="404" y1="72" x2="404" y2="150" className="q1d-axisline" />
          {/* flow in / out */}
          <line x1="70" y1="111" x2="116" y2="111" className="q1d-core-arrow" markerEnd="url(#rd-a)" />
          <line x1="408" y1="111" x2="470" y2="111" className="q1d-bl-arrow" markerEnd="url(#rd-b)" />
          <text x="80" y="103" className="q1d-t q1d-t--a" textAnchor="middle">u&#8321;</text>
          <text x="440" y="103" className="q1d-t q1d-t--r" textAnchor="middle">u&#8322;</text>
          {/* heat wavy arrows from below */}
          {[236, 262, 288].map((x, i) => (
            <path key={i}
              d={`M${x} 205 C${x + 5} 197 ${x - 5} 191 ${x} 183 C${x + 5} 176 ${x - 5} 170 ${x} 153`}
              className="q1d-heat" markerEnd="url(#rd-h)" />
          ))}
          <text x="262" y="216" className="q1d-t q1d-t--o" textAnchor="middle">q &mdash; heat added</text>
          {/* region labels */}
          <text x="160" y="134" className="q1d-t q1d-t--a" textAnchor="middle">region &#9312;</text>
          <text x="342" y="134" className="q1d-t q1d-t--r" textAnchor="middle">region &#9313;</text>
          {/* header note */}
          <text x="262" y="42" className="q1d-t q1d-t--sm" textAnchor="middle">constant area A &middot; frictionless walls</text>
          {/* inlet / outlet property stacks */}
          <text className="q1d-t q1d-t--a" x="24" y="122" textAnchor="middle">
            <tspan x="24" dy="0">&#961;&#8321;, p&#8321;</tspan>
            <tspan x="24" dy="16">T&#8321;, M&#8321;</tspan>
          </text>
          <text className="q1d-t q1d-t--r" x="490" y="122" textAnchor="middle">
            <tspan x="490" dy="0">&#961;&#8322;, p&#8322;</tspan>
            <tspan x="490" dy="16">T&#8322;, M&#8322;</tspan>
          </text>
        </g>
        <defs>
          <marker id="rd-a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-a" /></marker>
          <marker id="rd-b" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-o" /></marker>
          <marker id="rd-h" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-o" /></marker>
        </defs>
      </svg>
    )
  }

  if (name === 'rayleigh-hs') {
    return (
      <svg viewBox="0 0 520 382" {...common}>
        <g key={run}>
          {/* axes */}
          <line x1="70" y1="42" x2="70" y2="352" className="q1d-wall" />
          <line x1="70" y1="352" x2="500" y2="352" className="q1d-wall" />
          {/* x ticks */}
          {[['-3', 99.5], ['-2', 221.9], ['-1', 344.3], ['0', 466.6]].map(([l, x]) => (
            <g key={l}>
              <line x1={x} y1="352" x2={x} y2="357" className="q1d-station" />
              <text x={x} y="368" className="q1d-t q1d-t--sm" textAnchor="middle">{l}</text>
            </g>
          ))}
          {/* y ticks */}
          {[['0.2', 293.2], ['0.4', 241.4], ['0.6', 189.6], ['0.8', 137.9], ['1.0', 86.1]].map(([l, y]) => (
            <g key={l}>
              <line x1="66" y1={y} x2="70" y2={y} className="q1d-station" />
              <text x="60" y={Number(y) + 3} className="q1d-t q1d-t--sm" textAnchor="end">{l}</text>
            </g>
          ))}
          {/* axis titles */}
          <text x="30" y="200" className="q1d-t q1d-t--sm" textAnchor="middle" transform="rotate(-90 30 200)">h / h*  (&#8733; T / T*)</text>
          <text x="285" y="380" className="q1d-t q1d-t--sm" textAnchor="middle">(s &#8722; s*) / R</text>
          {/* max-entropy vertical line */}
          <line x1="466.6" y1="50" x2="466.6" y2="352" className="q1d-axisline" />
          <text x="463" y="48" className="q1d-t q1d-t--sm" textAnchor="end">s = s*</text>
          {/* supersonic branch (dashed) */}
          <path d="M466.6 86.1 L463.4 96.3 L449.4 115.6 L420.3 143.4 L375.5 175.7 L317.6 208 L240.9 240.4 L151 268.1" className="q1d-curve--dash" />
          {/* subsonic branch (solid) */}
          <path d="M176.1 185.7 L295.3 140.4 L372.2 107.6 L420.4 87.9 L444.2 80.4 L456.4 78.7 L462.6 79.7 L465.7 82.3 L466.6 86.1" className="q1d-curve" />
          {/* heating arrows toward the nose */}
          <line x1="330" y1="123" x2="382" y2="102" className="q1d-bl-arrow" markerEnd="url(#hs-h)" />
          <line x1="352" y1="184" x2="408" y2="153" className="q1d-bl-arrow" markerEnd="url(#hs-h)" />
          <text x="322" y="118" className="q1d-t q1d-t--o">heating</text>
          <text x="318" y="178" className="q1d-t q1d-t--o">heating</text>
          {/* cooling hints */}
          <text x="150" y="176" className="q1d-t q1d-t--sm">&#8592; cooling</text>
          <text x="150" y="262" className="q1d-t q1d-t--sm">&#8592; cooling</text>
          {/* branch labels */}
          <text x="235" y="126" className="q1d-t q1d-t--a">subsonic branch</text>
          <text x="225" y="230" className="q1d-t" fill="#6fb6e8">supersonic branch</text>
          {/* max static T marker */}
          <rect x="453.9" y="76.2" width="5" height="5" className="q1d-sq" />
          <line x1="456.4" y1="76.2" x2="456.4" y2="62" className="q1d-station" />
          <text x="452" y="58" className="q1d-t q1d-t--sm" textAnchor="end">max static T &middot; M = 1/&#8730;&#947; &#8776; 0.845</text>
          {/* sonic point */}
          <circle cx="466.6" cy="86.1" r="4.4" className="q1d-dot" />
          <line x1="466.6" y1="86.1" x2="500" y2="76" className="q1d-axisline" />
          <text x="512" y="70" className="q1d-t q1d-t--r" textAnchor="end">M = 1 &middot; sonic</text>
          <text x="512" y="82" className="q1d-t q1d-t--sm" textAnchor="end">max entropy &rarr; choking</text>
        </g>
        <defs>
          <marker id="hs-h" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-o" /></marker>
        </defs>
      </svg>
    )
  }

  if (name === 'tts-curve') {
    return (
      <svg viewBox="0 0 520 300" {...common}>
        <g key={run}>
          {/* shaded cooling window (0.845 < M < 1) */}
          <path d="M188.9 262 L188.9 63.6 L189.6 63.6 L193.1 63.9 L196.6 64.4 L200.1 65.2 L203.6 66.3 L207.2 67.6 L210.7 69.1 L210.7 262 Z" className="q1d-shade" />
          {/* axes */}
          <line x1="70" y1="40" x2="70" y2="262" className="q1d-wall" />
          <line x1="70" y1="262" x2="500" y2="262" className="q1d-wall" />
          {/* x ticks */}
          {[['0', 70], ['0.5', 140.3], ['1.0', 210.7], ['1.5', 281], ['2.0', 351.3], ['2.5', 421.7], ['3.0', 492]].map(([l, x]) => (
            <g key={l}>
              <line x1={x} y1="262" x2={x} y2="267" className="q1d-station" />
              <text x={x} y="278" className="q1d-t q1d-t--sm" textAnchor="middle">{l}</text>
            </g>
          ))}
          {/* y ticks */}
          {[['0.2', 223.4], ['0.4', 184.9], ['0.6', 146.3], ['0.8', 107.7], ['1.0', 69.1]].map(([l, y]) => (
            <g key={l}>
              <line x1="66" y1={y} x2="70" y2={y} className="q1d-station" />
              <text x="60" y={Number(y) + 3} className="q1d-t q1d-t--sm" textAnchor="end">{l}</text>
            </g>
          ))}
          {/* axis titles */}
          <text x="30" y="150" className="q1d-t q1d-t--sm" textAnchor="middle" transform="rotate(-90 30 150)">T / T*</text>
          <text x="285" y="296" className="q1d-t q1d-t--sm" textAnchor="middle">Mach number  M</text>
          {/* M = 1 line */}
          <line x1="210.7" y1="48" x2="210.7" y2="262" className="q1d-axisline" />
          <text x="214" y="256" className="q1d-t q1d-t--sm">M = 1</text>
          {/* curve */}
          <path d="M70 262 L73.5 261.3 L77 259.2 L80.5 255.8 L84.1 251.2 L87.6 245.4 L91.1 238.5 L94.6 230.7 L98.1 222.2 L101.7 213 L105.2 203.3 L108.7 193.3 L112.2 183.1 L115.7 172.9 L119.2 162.8 L122.8 153 L126.3 143.4 L129.8 134.2 L133.3 125.5 L136.8 117.3 L140.3 109.6 L143.9 102.6 L147.4 96.2 L150.9 90.4 L154.4 85.2 L157.9 80.7 L161.4 76.7 L164.9 73.3 L168.5 70.5 L172 68.2 L175.5 66.4 L179 65.1 L182.5 64.2 L186 63.7 L189.6 63.6 L193.1 63.9 L196.6 64.4 L200.1 65.2 L203.6 66.3 L207.2 67.6 L210.7 69.1 L214.2 70.8 L217.7 72.7 L221.2 74.7 L224.7 76.8 L228.2 79 L231.8 81.3 L235.3 83.7 L238.8 86.1 L242.3 88.6 L245.8 91.2 L249.3 93.7 L252.9 96.3 L256.4 98.9 L259.9 101.5 L263.4 104.1 L266.9 106.7 L270.5 109.3 L274 111.8 L277.5 114.4 L281 116.9 L284.5 119.4 L288 121.8 L291.6 124.3 L295.1 126.7 L298.6 129 L302.1 131.4 L305.6 133.7 L309.1 135.9 L312.7 138.1 L316.2 140.3 L319.7 142.5 L323.2 144.6 L326.7 146.6 L330.2 148.7 L333.8 150.6 L337.3 152.6 L340.8 154.5 L344.3 156.4 L347.8 158.2 L351.3 160 L354.8 161.8 L358.4 163.5 L361.9 165.2 L365.4 166.8 L368.9 168.4 L372.4 170 L375.9 171.6 L379.5 173.1 L383 174.6 L386.5 176 L390 177.4 L393.5 178.8 L397.1 180.2 L400.6 181.5 L404.1 182.8 L407.6 184.1 L411.1 185.4 L414.6 186.6 L418.2 187.8 L421.7 189 L425.2 190.1 L428.7 191.2 L432.2 192.3 L435.7 193.4 L439.2 194.5 L442.8 195.5 L446.3 196.5 L449.8 197.5 L453.3 198.5 L456.8 199.4 L460.3 200.4 L463.9 201.3 L467.4 202.2 L470.9 203 L474.4 203.9 L477.9 204.7 L481.4 205.6 L485 206.4 L488.5 207.2 L492 207.9" className="q1d-curve" />
          {/* peak marker */}
          <rect x="186.4" y="61.1" width="5" height="5" className="q1d-sq" />
          <line x1="188.9" y1="61.1" x2="188.9" y2="48" className="q1d-station" />
          <text x="184" y="44" className="q1d-t q1d-t--sm" textAnchor="end">max static T &middot; M = 1/&#8730;&#947; &#8776; 0.845</text>
          {/* region labels */}
          <text x="128" y="150" className="q1d-t q1d-t--a" textAnchor="middle">subsonic</text>
          <text x="370" y="120" className="q1d-t" fill="#6fb6e8" textAnchor="middle">supersonic</text>
          {/* shaded-window note */}
          <text x="200" y="205" className="q1d-t q1d-t--sm" textAnchor="middle">heating cools here</text>
          <text x="200" y="217" className="q1d-t q1d-t--sm" textAnchor="middle">(T&#8320; still &#8593;)</text>
        </g>
      </svg>
    )
  }

  if (name === 'domain-influence') {
    const panels = [
      { id: 'a', x0: 8,   x1: 180, sx: 150, M: 0.5, title: 'M = 0.5', sub: 'subsonic',   ks: [1, 2, 3, 4, 5] },
      { id: 'b', x0: 184, x1: 356, sx: 326, M: 1.0, title: 'M = 1.0', sub: 'sonic',       ks: [1, 2, 3, 4, 5] },
      { id: 'c', x0: 360, x1: 532, sx: 502, M: 2.0, title: 'M = 2.0', sub: 'supersonic',  ks: [1, 2, 3, 4] },
    ]
    const cy = 130, s = 14
    return (
      <svg viewBox="0 0 540 262" {...common}>
        <defs>
          {panels.map(p => (
            <clipPath key={p.id} id={`di-${p.id}`}>
              <rect x={p.x0} y={42} width={p.x1 - p.x0} height={188} />
            </clipPath>
          ))}
          <marker id="di-arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L6,3 L0,6 Z" className="q1d-ahead-a" /></marker>
        </defs>
        <g key={run}>
          {panels.map(p => (
            <g key={p.id}>
              {/* panel titles */}
              <text x={(p.x0 + p.x1) / 2} y="26" className="q1d-t q1d-t--a" textAnchor="middle">{p.title}</text>
              <text x={(p.x0 + p.x1) / 2} y="38" className="q1d-t q1d-t--sm" textAnchor="middle">{p.sub}</text>
              {/* clipped wavefronts + axis + cone */}
              <g clipPath={`url(#di-${p.id})`}>
                <line x1={p.x0} y1={cy} x2={p.x1} y2={cy} className="q1d-axisline" />
                {p.ks.map(k => (
                  <circle key={k} cx={p.sx - p.M * k * s} cy={cy} r={k * s} className="q1d-wave" />
                ))}
                {p.id === 'c' && (
                  <g>
                    <line x1={p.sx} y1={cy} x2={p.sx - 158} y2={cy - 91.2} className="q1d-bl-arrow" />
                    <line x1={p.sx} y1={cy} x2={p.sx - 158} y2={cy + 91.2} className="q1d-bl-arrow" />
                  </g>
                )}
              </g>
              {/* source dot (unclipped) */}
              <circle cx={p.sx} cy={cy} r="4" className="q1d-dot" />
            </g>
          ))}
          {/* panel A: reaches upstream */}
          <line x1="44" y1="130" x2="20" y2="130" className="q1d-core-arrow" markerEnd="url(#di-arr)" />
          <text x="62" y="218" className="q1d-t q1d-t--sm" textAnchor="middle">reaches upstream</text>
          {/* panel B: piles up */}
          <text x="270" y="218" className="q1d-t q1d-t--sm" textAnchor="middle">piles up at source</text>
          {/* panel C: cone + zone of silence */}
          <text x="452" y="72" className="q1d-t q1d-t--o" textAnchor="middle">Mach cone</text>
          <text x="452" y="84" className="q1d-t q1d-t--o" textAnchor="middle">&#956; = 30&deg;</text>
          <text x="470" y="218" className="q1d-t q1d-t--sm" textAnchor="middle">zone of silence</text>
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

/* rayleigh figure extras */
.q1d-wave{fill:none;stroke:var(--muted);stroke-width:1.1;opacity:.7}
.q1d-shade{fill:var(--accent);opacity:.13}
.q1d-heat{fill:none;stroke:var(--accent-2);stroke-width:1.8}
.q1d-curve{fill:none;stroke:var(--accent);stroke-width:2.4}
.q1d-curve--dash{fill:none;stroke:#6fb6e8;stroke-width:2.2;stroke-dasharray:6 4}
.q1d-dot{fill:var(--accent-2)}
.q1d-sq{fill:var(--ink)}

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
