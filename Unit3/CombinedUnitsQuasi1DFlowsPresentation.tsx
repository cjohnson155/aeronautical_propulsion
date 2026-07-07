import { useState, useEffect, useCallback, useRef } from 'react'
import katex from 'katex'

// ─────────────────────────────────────────────────────────────────────────────
//  ME 3470 · Combined Units 3 & 4 + Quasi-1D Flows
//  Same deck as Unit 3 — Quasi-1D Flows, but slide 1 is now the handwritten
//  "Combined Units 3 & 4" agenda/notes card. Every following slide is the
//  original Quasi-1D content, untouched.
//
//  Built to match the Unit 1 / Unit 2 presentation system:
//    • navy/cyan theme via CSS variables + <style>{CSS}
//    • type-driven slide renderers, KaTeX via the shared <Equation/>
//    • step-by-step reveals, click / arrow-key advance
//    • top bar · nav dots · progress bar
//
//  Slide types:
//    'notes'    – handwritten agenda / notes card (self-contained, no Tailwind)
//    'title'    – opening title card
//    'concept'  – lead paragraph + comparison cards
//    'diagram'  – inline SVG figure + caption + supporting cards
//    'equation' – KaTeX equation + term glossary + supporting cards
//    'compare'  – two/three regime cards (Area–Mach behaviour)
//    'system'   – numbered list of governing equations
//
//  Diagrams are inline SVG, themed with the deck accents and re-playable on
//  hover/click. Respects prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────────────────────

export const meta = {
  courseId:  'ME 3470',
  deckTitle: 'Unit 3 — Quasi-1D Flows · Axial Flow, Boundary Layers & the Area–Mach Relation',
}

export const slides = [

  // ── COMBINED UNITS 3 & 4 — handwritten agenda / notes card ───────────────────
  {
    type: 'notes',
  },

  // ── TITLE ───────────────────────────────────────────────────────────────────
  {
    type: 'title',
    eyebrow: 'Undergraduate Course · ME 3470',
    title: 'Quasi-1D<br>Flows',
    subtitle: 'Why flow goes axial, why we can ignore the walls, and how area drives the Mach number.',
    meta: [
      { label: 'Unit',      value: '03 — Quasi-1D Flows' },
      { label: 'Topics',    value: 'Axial flow · Boundary layers · Area–Mach' },
      { label: 'Builds on', value: 'Unit 2 — Compressible Flow' },
    ],
  },

  // ── WHY FLOW FOLLOWS THE AXIS ────────────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Unit 3 — Setup',
    heading: 'Why Flow Follows the Axis',
    intro:
      'Most flows we study run through engines, ducts, or other enclosed spaces. The walls constrain the transverse and sideways directions, so the flow naturally follows the <strong>axial direction</strong> — and that axis is where almost all the action happens.',
    figure: 'turbofan',
    caption:
      'Example — flow through a turbofan. Internal energy enters and is passed station-to-station along the axis: fan &rarr; compressor &rarr; burner &rarr; turbine &rarr; nozzle.',
    bridge:
      'So we can treat the engine as a <em>sequence of axial stations</em>. But what about the velocity profile across each station?',
  },

  // ── UNIFORM CORE vs BOUNDARY LAYER ───────────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Unit 3 — Setup',
    heading: 'Uniform Core, Thin Boundary Layer',
    intro:
      'Look at a cross-section of the streamtube. The flow is <strong>basically uniform</strong> in the center, but near the walls it is not.',
    figure: 'boundary',
    caption:
      'Uniform core (one representative velocity V<sub>&infin;</sub>) versus the wall boundary layer: no-slip at the wall climbing to V<sub>&infin;</sub>.',
    cards: [
      {
        tag: 'Core', accent: '#5ec8d8', label: 'Core Flow',
        body: 'Basically uniform in the center of the streamtube — represented by a single velocity V<sub>&infin;</sub>.',
      },
      {
        tag: 'Wall', accent: '#f0a93b', label: 'At the Walls',
        body: 'A boundary layer: no-slip at the wall rising to V<sub>&infin;</sub>. Non-uniform.',
      },
    ],
    bridge:
      '★ The simplifying move: for most applications the BL thickness <strong>&delta; &ll; cross-section size</strong>, so we <strong>ignore it</strong>. This inviscid assumption makes our lives easier and doesn\u2019t punish us too much — the gap between inviscid and \u201Cviscous\u201D thrust stays small.',
  },

  // ── AXIAL-VELOCITY ASSUMPTION (decomp + Taylor) ──────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Unit 3 — Setup',
    heading: 'The Axial-Velocity Assumption',
    intro:
      'On a smooth contoured nozzle the flow goes from straight to only <em>slightly angled</em>. Decompose the wall velocity into axial and normal parts — when the turn angle &theta; is small, the normal term drops.',
    figure: 'decomp',
    equation: 'V_{\\text{wall}} = V_{\\text{axial}}\\cos\\theta + V_{\\text{normal}}\\sin\\theta \\;\\approx\\; V_{\\text{axial}}\\cos\\theta',
    cards: [
      {
        tag: 'Slab', accent: '#5ec8d8', label: 'Chop Into a Slab',
        body: 'Cut the duct into a thin slab of thickness dx. Each property at the exit is the inlet value plus a small change: V&rarr;V+dV, p&rarr;p+dp, &rho;&rarr;&rho;+d&rho;, A&rarr;A+dA.',
      },
      {
        tag: 'Taylor', accent: '#f0a93b', label: 'Taylor\u2019s Theorem',
        body: 'f(x+dx) &approx; f(x) + f\u2032(x)dx + &frac12;f\u2033(x)dx&sup2; + &hellip; — keep first order; higher terms vanish as dx&rarr;0.',
      },
    ],
    bridge:
      'With one axial velocity per slab, mass conservation reduces to <strong>&rho;VA = const</strong> — the starting point for everything that follows.',
  },

  // ── QUASI-1D ASSUMPTIONS ─────────────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Section 2.1',
    heading: 'Quasi-1D Flow — Key Assumptions',
    intro:
      'A diffuser or nozzle with an attached boundary layer, analyzed one axial coordinate at a time.',
    cards: [
      { tag: '1', accent: '#5ec8d8', label: 'Streamwise direction dominates',
        body: 'Uniform flow with a pressure gradient along the duct axis; transverse variation is neglected.' },
      { tag: '2', accent: '#5ec8d8', label: 'High Reynolds number',
        body: 'The boundary layer is thin relative to the duct size.' },
      { tag: '3', accent: '#f0a93b', label: 'Inviscid core',
        body: 'Gives an accurate estimate of p, T, and u(x) in the core flow.' },
      { tag: '4', accent: '#f0a93b', label: 'Attached boundary layers',
        body: 'Valid only for slow variation in duct area — no separation.' },
    ],
    bridge:
      'Under these assumptions we can write the governing equations for the slab.',
  },

  // ── GOVERNING EQUATIONS ──────────────────────────────────────────────────────
  {
    type: 'system',
    sectionNumber: 'Section 2.1',
    heading: 'Governing Equations',
    intro:
      'Continuity, momentum, and energy for the differential slab (steady, adiabatic, no shaft work).',
    laws: [
      {
        tag: 'Continuity', accent: '#5ec8d8',
        eq: '\\rho u A = \\text{const}\\quad[\\mathrm{kg/s}]',
        note: 'All mass in must come out at the same rate (steady flow).',
      },
      {
        tag: 'Momentum', accent: '#f0a93b',
        eq: '\\rho u\\,\\mathrm{d}u = -\\,\\mathrm{d}p',
        note: 'Inviscid (Euler) form: the pressure force opposes acceleration.',
      },
      {
        tag: 'Energy', accent: '#5ec8d8',
        eq: '\\mathrm{d}h_t = \\mathrm{d}h + u\\,\\mathrm{d}u = 0',
        note: 'Adiabatic, no shaft work: total enthalpy is constant along the duct.',
      },
    ],
    bridge:
      'Differentiate continuity and bring in the isentropic relation to close the system.',
  },

  // ── DIFFERENTIAL RELATIONS / CLOSED SYSTEM ──────────────────────────────────
  {
    type: 'system',
    sectionNumber: 'Section 2.1',
    heading: 'Differential Relations &amp; Closure',
    intro:
      'Logarithmically differentiating continuity gives the link between fractional changes; the isentropic relation supplies the fourth equation.',
    laws: [
      {
        tag: 'Continuity (diff.)', accent: '#5ec8d8',
        eq: '\\frac{\\mathrm{d}\\rho}{\\rho} + \\frac{\\mathrm{d}A}{A} + \\frac{\\mathrm{d}u}{u} = 0',
        note: 'If area increases, density times velocity must fall to keep rho-u-A fixed.',
      },
      {
        tag: 'Isentropic', accent: '#f0a93b',
        eq: '\\frac{\\mathrm{d}\\rho}{\\rho} = \\frac{1}{a^2}\\,\\mathrm{d}p, \\qquad \\frac{p}{\\rho^{\\gamma}} = \\text{const}',
        note: 'ds = 0 ties density change to pressure change through the speed of sound a.',
      },
    ],
    closer: '<strong>4 equations, 4 unknowns.</strong> Given the area change dA/A, solve for d&rho;, dT, du, and dp.',
  },

  // ── AREA–MACH RELATION ───────────────────────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Section 2.8',
    heading: 'The Area&ndash;Mach Relation',
    intro:
      'Combining the differential relations collapses the whole system into one statement linking area change to velocity change through the Mach number.',
    equation: '(M^2 - 1)\\,\\frac{\\mathrm{d}u}{u} = \\frac{\\mathrm{d}A}{A}',
    equationLabel: 'Links area change to velocity change via M',
    terms: [
      { sym: 'M',                       def: 'Mach number, V / a — the sign of (M&sup2;&minus;1) flips the behaviour' },
      { sym: '\\tfrac{\\mathrm{d}A}{A}', def: 'Fractional area change along the duct' },
      { sym: '\\tfrac{\\mathrm{d}u}{u}', def: 'Fractional velocity change of the core flow' },
    ],
    bridge:
      'The factor (M&sup2;&minus;1) is the whole story: below Mach 1 it is negative, above Mach 1 it is positive — so the same nozzle does opposite things.',
  },

  // ── SUBSONIC vs SUPERSONIC BEHAVIOUR ────────────────────────────────────────
  {
    type: 'compare',
    sectionNumber: 'Section 2.8',
    heading: 'Converging vs. Diverging — Why It Flips',
    intro:
      'Because (M&sup2;&minus;1) changes sign at Mach 1, area and velocity relate oppositely in the two regimes.',
    regimes: [
      {
        tag: 'M < 1', label: 'Subsonic', accent: '#5ec8d8',
        head: 'Converging duct accelerates the flow',
        body: 'dA/A &lt; 0 forces du/u &gt; 0. Increasing area slows subsonic flow; decreasing area speeds it up.',
      },
      {
        tag: 'M > 1', label: 'Supersonic', accent: '#f0a93b',
        head: 'Diverging duct accelerates the flow',
        body: 'dA/A &gt; 0 forces du/u &gt; 0. The counter-intuitive case: a widening duct speeds supersonic flow up.',
      },
    ],
    closer:
      'This sign flip is exactly why a <strong>converging&ndash;diverging (de Laval) nozzle</strong> is needed to push flow from subsonic, through Mach 1 at the throat, to supersonic at the exit.',
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

// Handwritten "Combined Units 3 & 4" agenda card. Faithful port of the standalone
// slide, restyled with scoped CSS (see .notes-* rules) so it needs no Tailwind.
function NotesSlide() {
  return (
    <div className="notes-slide anim-in">
      <div className="note-paper note-hand">
        <div className="circled-one">1</div>
        <svg className="scribble" viewBox="0 0 100 70" aria-hidden="true">
          <path d="M4 35 C18 8 44 66 62 10 C72 -5 88 61 96 20" fill="none" stroke="#242635" strokeWidth="5" strokeLinecap="round" />
          <path d="M8 48 C25 30 47 58 68 28 C78 14 88 48 97 35" fill="none" stroke="#242635" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <svg className="right-brace" viewBox="0 0 70 280" aria-hidden="true">
          <path d="M54 2 C28 20 51 66 25 84 C52 100 27 153 54 174 C30 194 50 244 18 278" fill="none" stroke="#242635" strokeWidth="3" />
        </svg>

        <div className="u" style={{ fontSize: 33, lineHeight: 1.1, marginBottom: 8 }}>Combined Units 3 &amp; 4</div>

        <div style={{ fontSize: 28, lineHeight: 1.18, maxWidth: 990, marginBottom: 24 }}>
          Objectives: master the area-mach relation; understand<br />
          Sonic throat &amp; choking; analyze 1D flows w/<br />
          heat addition, understand thermal choking
        </div>

        <div className="schedule" style={{ fontSize: 27, lineHeight: 1.32, marginLeft: 4 }}>
          <div className="schedule-line"><span>1:00 - 1:10</span><span>Quiz</span></div>
          <div className="schedule-line"><span>1:10 - 1:40</span><span>1D flow w/ area change &rarr; Quasi 1D-flow<br /><span style={{ marginLeft: 88 }}>mach-area</span></span></div>
          <div className="schedule-line"><span>1:40 - 1:45</span><span>break</span></div>
          <div className="schedule-line"><span>1:45 - 2:00</span><span>Using all our tools to solve CD nozzle</span></div>
          <div className="schedule-line"><span>2:00 - 2:15</span><span>Rayleigh flow</span></div>
          <div className="schedule-line"><span>2:15 - 2:40</span><span>Using all our tools to solve Rayleigh<br /><span style={{ marginLeft: 74 }}>Problem</span></span></div>
        </div>

        <svg className="wave" viewBox="0 0 1000 50" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 27 C22 2 43 52 67 27 S112 2 135 27 S180 52 202 27 S247 2 270 27 S315 52 337 27 S382 2 405 27 S450 52 472 27 S517 2 540 27 S585 52 607 27 S652 2 675 27 S720 52 742 27 S787 2 810 27 S855 52 877 27 S922 2 945 27 S990 52 1000 27" fill="none" stroke="#242635" strokeWidth="3" />
        </svg>

        <div className="two-col">
          <div className="col-left" style={{ fontSize: 27, lineHeight: 1.16 }}>
            <div className="u" style={{ marginBottom: 4 }}>What is Quasi 1D flow?</div>
            <div style={{ paddingLeft: 8 }}>↳ an approximation for flow through a variable area duct</div>
            <div style={{ paddingLeft: 44 }}>(in which flow properties vary as functions of x,y,z)</div>
            <div style={{ paddingLeft: 44 }}>which assumes changes in the y &amp; z directions are</div>
            <div style={{ paddingLeft: 44 }}>very small with respect to the changes in x, and</div>
            <div style={{ paddingLeft: 44 }}>therefore can be neglected.</div>

            <div style={{ textAlign: 'center', marginTop: 16, lineHeight: 1.35, fontSize: 29 }}>
              <div>u = u(x)</div>
              <div>&rho; = &rho;(x)</div>
              <div>p = p(x)</div>
            </div>
          </div>

          <div className="callout" style={{ fontSize: 24, marginTop: 112 }}>
            Equivalent to assuming the<br />
            properties are uniform over<br />
            any given cross-section of<br />
            area A (represent a kind<br />
            of mean value over the CS)
          </div>
        </div>
      </div>
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
      case 'notes':    return <NotesSlide />
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
/* ── notes slide (Combined Units 3 & 4 handwritten agenda card) ─────────────── */
.notes-slide{width:100%;display:flex;justify-content:center;align-items:flex-start}
.note-hand{font-family:"Comic Sans MS","Bradley Hand","Segoe Print",cursive;letter-spacing:.01em}
.note-paper{width:min(1080px,90vw);aspect-ratio:16/9;background:#f5f1e7;
  border:3px solid #1f2937;box-shadow:0 24px 80px rgba(0,0,0,.45);
  position:relative;overflow:hidden;padding:32px 40px;color:#242635}
.note-paper::before{content:"";position:absolute;inset:0;
  background:
    linear-gradient(90deg, rgba(148,163,184,.08) 1px, transparent 1px),
    linear-gradient(rgba(148,163,184,.08) 1px, transparent 1px);
  background-size:74px 74px,74px 74px;opacity:.55;pointer-events:none}
.notes-slide .u{text-decoration:underline;text-underline-offset:8px;text-decoration-thickness:2px}
.notes-slide .schedule{display:flex;flex-direction:column;gap:8px}
.notes-slide .schedule-line{display:grid;grid-template-columns:150px 1fr;column-gap:22px;align-items:start}
.notes-slide .two-col{display:flex;gap:40px;align-items:flex-start;margin-top:4px}
.notes-slide .col-left{flex:1}
.notes-slide .circled-one{position:absolute;top:22px;right:118px;width:34px;height:34px;
  border:3px solid #242635;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:24px}
.notes-slide .scribble{position:absolute;top:25px;right:54px;width:45px;height:35px}
.notes-slide .right-brace{position:absolute;top:52px;right:-8px;width:70px;height:280px}
.notes-slide .wave{width:96%;height:42px;margin:15px auto 5px}
.notes-slide .callout{border:2px solid #242635;padding:12px 14px;width:385px;line-height:1.05;transform:rotate(-.5deg)}

@media (prefers-reduced-motion:reduce){
  .anim-in,.reveal-block,.cmp-card,.law-card,.regime-card{animation:none;transition:none}
  .q1d-bl-grow{animation:none;transform:none}
}
`
