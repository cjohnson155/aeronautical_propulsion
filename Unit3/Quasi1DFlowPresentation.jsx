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
  deckTitle: 'Steady Quasi-1D Flow · Definition, Control Volume & Governing Equations',
}

export const slides = [

  // ── TITLE ───────────────────────────────────────────────────────────────────
  {
    type: 'title',
    eyebrow: 'Undergraduate Course \u00b7 ME 3470',
    title: 'Steady Quasi-1D<br>Flow Equations',
    subtitle: 'What quasi-1D flow means, the streamtube control volume, and the integral conservation laws \u2014 set up for the jump to differential form.',
    meta: [
      { label: 'Unit',      value: '03 \u2014 Quasi-1D Flows' },
      { label: 'Topics',    value: 'Definition \u00b7 Control volume \u00b7 Continuity \u00b7 Momentum \u00b7 Energy' },
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
      'The fix: cut the duct into very small chunks \u2014 <strong>slabs of thickness dx</strong> \u2014 and take the limit. Each conservation law becomes a differential relation (momentum \u2192 <strong>&rho;u du = &minus;dp</strong>), and together they lead to the area&ndash;Mach relation.',
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
