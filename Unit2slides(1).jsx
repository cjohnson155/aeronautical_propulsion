import { useState, useEffect, useCallback, useRef } from 'react'
import katex from 'katex'

// ─────────────────────────────────────────────────────────────────────────────
//  ME 3470 · Unit 2 Slides — "Introduction to Compressible Flow"
//
//  Built to plug into the same Presentation system as Unit 1.
//  Two new slide types are added here on top of the originals:
//
//    'section'   – bold section divider  (reused from Unit 1)
//    'compress'  – the Section 1 intro: definition + compressibility eqn
//                  + the three hand-drawn control-volume diagrams (as SVG)
//
//  The control-volume drawings from the handwritten notes are reproduced
//  below as inline SVG (CVDiagram, FluidColumnDiagram). If you'd rather use
//  a crop of your photo, drop an <img> in place of the relevant <svg>.
// ─────────────────────────────────────────────────────────────────────────────

export const meta = {
  courseId:  'ME 3470',
  deckTitle: 'Unit 2 — Introduction to Compressible Flow',
}

export const slides = [

  // ── SECTION DIVIDER (the Unit 2 outline / opener) ──────────────────────────
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

function HTML({ children }) {
  return <span dangerouslySetInnerHTML={{ __html: children }} />
}

// ─── DRAWING 1 + 2: Control-volume boxes under pressure P ────────────────────
// Two CVs side by side illustrate a differential pressure increase:
//   • "v"      — larger box, low pressure → SHORT uniform arrows pressing in
//   • "v + dv" — smaller box, higher pressure → LONG arrows pressing in
// Arrows on all four faces are uniformly distributed and represent pressure P.
function CVDiagram({ label, pressureLabel, size = 'large', accent }) {
  // box geometry by size — larger box for low P, smaller box for high P
  const half = size === 'large' ? 34 : 22
  const cx = 100, cy = 90
  const x0 = cx - half, x1 = cx + half, y0 = cy - half, y1 = cy + half
  // arrow length: short when box is large (low P), long when box is small (high P)
  const len = size === 'large' ? 14 : 30
  const gap = 4 // space between arrowhead and box face

  // three uniformly spaced arrows per face
  const offs = [-half * 0.55, 0, half * 0.55]

  return (
    <svg viewBox="0 0 200 180" className="cv-svg" aria-hidden>
      {pressureLabel && (
        <text x="100" y="14" textAnchor="middle" className="cv-text">{pressureLabel}</text>
      )}
      {/* the control volume */}
      <rect x={x0} y={y0} width={half * 2} height={half * 2} className="cv-box" />
      <text x={cx} y={cy + 5} textAnchor="middle" className="cv-text cv-text--lg">{label}</text>

      {/* pressure arrows — uniform, pointing inward on all four faces */}
      {offs.map((o, i) => (
        <g key={i}>
          {/* top → down */}
          <Arrow x1={cx + o} y1={y0 - gap - len} x2={cx + o} y2={y0 - gap} accent={accent} />
          {/* bottom → up */}
          <Arrow x1={cx + o} y1={y1 + gap + len} x2={cx + o} y2={y1 + gap} accent={accent} />
          {/* left → right */}
          <Arrow x1={x0 - gap - len} y1={cy + o} x2={x0 - gap} y2={cy + o} accent={accent} />
          {/* right → left */}
          <Arrow x1={x1 + gap + len} y1={cy + o} x2={x1 + gap} y2={cy + o} accent={accent} />
        </g>
      ))}
    </svg>
  )
}

// ─── DRAWING 3 + 4: Animated piston compression ──────────────────────────────
// A piston descends from the top, compressing the gas column. Replays on
// hover or click (toggle the `playing` class to restart the CSS keyframes).
//   • isothermal — heat escapes: q_out arrow pulses outward, T = const
//   • isentropic — insulated wall (hatched), no heat out: q_out = 0, s = const
function PistonDiagram({ topLabel, midLabel, processLabel, qLabel, insulated, accent }) {
  const [run, setRun] = useState(0) // bump to restart animation
  const replay = () => setRun(r => r + 1)
  return (
    <svg
      viewBox="0 0 140 210" className="cv-svg piston-svg" aria-hidden
      onMouseEnter={replay} onClick={(e) => { e.stopPropagation(); replay() }}
    >
      <g key={run} className="piston-anim">
        {/* applied pressure label + arrow above piston */}
        <text x="70" y="12" textAnchor="middle" className="cv-text cv-text--sm">{topLabel}</text>
        <line x1="70" y1="16" x2="70" y2="30" className="press-arrow" />

        {/* cylinder walls (open top) */}
        {insulated ? (
          // insulated: double hatched wall
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

        {/* the gas — shrinks as the piston descends */}
        <rect className="gas" x="43" y="62" width="54" height="122" />

        {/* piston head — slides down */}
        <g className="piston">
          <rect x="40" y="50" width="60" height="10" className="piston-head" />
          <line x1="70" y1="40" x2="70" y2="50" className="piston-rod" />
        </g>

        {/* state label inside */}
        <text x="70" y="125" textAnchor="middle" className="cv-text gas-label">{midLabel}</text>

        {/* heat out — only when not insulated; pulses outward */}
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

// ─── Slide renderers ─────────────────────────────────────────────────────────

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
  // reveal order: question(0) → definition(1) → eqn(2) → cutoff(3) → diagrams(4)
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

// ─── Steps per slide ─────────────────────────────────────────────────────────
function totalSteps(slide) {
  switch (slide.type) {
    case 'outline':  return slide.items?.length || 0
    case 'compress': return 5 // question, def, eqn, note, diagrams
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
      case 'outline':  return <OutlineSlide slide={slide} revealed={revealed} />
      case 'compress': return <CompressSlide slide={slide} revealed={revealed} />
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
          disabled={slideIdx === 0 && revealed === 0}>← Prev</button>
        <div className="nav-dots">
          {slideData.map((_, i) => (
            <div key={i} className={`nav-dot${i === slideIdx ? ' active' : ''}`}
              onClick={(e) => { e.stopPropagation(); goTo(i) }} />
          ))}
        </div>
        <button className="nav-btn" onClick={advance}
          disabled={slideIdx === slideData.length - 1 && revealed >= steps}>Next →</button>
        <span className="nav-hint">← → or click</span>
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

/* outline */
.section-number{font-family:var(--display);color:var(--accent);
  font-size:15px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:10px}
.section-title{font-family:var(--display);font-size:54px;line-height:1.02;margin:0}
.section-divider-line{width:80px;height:3px;background:var(--accent);margin:18px 0 14px}
.section-sub{color:var(--muted);font-size:17px;max-width:640px;margin:0 0 22px}
.outline-list{list-style:none;padding:0;margin:0;display:grid;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px 36px;max-width:840px}
.outline-item{display:flex;align-items:baseline;gap:14px;font-size:18px;
  padding:8px 0;border-bottom:1px solid var(--rule);
  opacity:0;transform:translateX(-8px);transition:.4s ease}
.outline-item.revealed{opacity:1;transform:none}
.outline-num{font-family:var(--display);color:var(--accent-2);font-size:15px;
  min-width:22px}

/* compress slide */
.compress-slide{max-height:100%}
.slide-heading{font-family:var(--display);font-size:38px;margin:2px 0 0}
.heading-rule{width:70px;height:3px;background:var(--accent);margin:14px 0 18px}
.reveal-block{opacity:0;transform:translateY(10px);transition:.45s ease;margin-bottom:14px}
.reveal-block.revealed{opacity:1;transform:none}
.cf-tag{display:inline-block;font-family:var(--display);font-size:12px;
  font-weight:700;color:var(--bg);background:var(--accent);border-radius:5px;
  padding:2px 8px;margin-right:10px;vertical-align:1px}
.cf-tag--def{background:var(--accent-2)}
.cf-question,.cf-def{display:flex;gap:4px;font-size:18px;line-height:1.5;
  max-width:880px;margin:0}
.cf-def{color:var(--ink)}
.eq-row{display:flex;align-items:center;gap:28px;flex-wrap:wrap;margin:18px 0}
.eq-box{background:var(--panel);border:1px solid var(--rule);border-left:3px solid var(--accent);
  border-radius:8px;padding:14px 26px;font-size:20px}
.eq-aside{color:var(--muted);font-size:15px;display:flex;align-items:center;gap:8px}
.cf-note{font-size:15.5px;line-height:1.55;color:var(--muted);max-width:920px;margin:0}
.cf-note strong{color:var(--accent-2)}

/* diagrams */
.diagram-row{display:flex;gap:18px;flex-wrap:wrap;margin-top:20px}
.diagram{margin:0;background:var(--panel);border:1px solid var(--rule);
  border-radius:10px;padding:10px 12px 8px;display:flex;flex-direction:column;
  align-items:center;width:170px}
.cv-svg{width:130px;height:auto}
.cv-box{stroke:var(--ink);stroke-width:1.4;fill:rgba(94,200,216,.05)}
.cv-text{fill:var(--ink);font-family:var(--body);font-size:11px}
.cv-text--lg{font-size:14px;font-style:italic}
.cv-text--sm{font-size:9px;fill:var(--muted)}
.cv-hatch{stroke:var(--muted);stroke-width:.7;opacity:.5}
.diagram figcaption{font-size:11px;color:var(--muted);text-align:center;margin-top:6px;line-height:1.3}

/* animated piston compression */
.piston-svg{cursor:pointer}
.cyl-wall path{stroke:var(--ink);stroke-width:1.4;fill:none}
.ins-outline{stroke:var(--accent-2);stroke-width:1}
.ins-hatch{stroke:var(--accent-2);stroke-width:.8}
.press-arrow{stroke:var(--accent);stroke-width:1.4;marker-end:none}
.piston-head{fill:var(--muted);stroke:var(--ink);stroke-width:1}
.piston-rod{stroke:var(--ink);stroke-width:2}
.gas{fill:rgba(94,200,216,.14);stroke:var(--accent);stroke-width:.8}
.gas-label{fill:var(--ink);font-size:11px}

/* the animation: piston + gas top descend, gas compresses */
.piston-anim .piston{animation:pistonDrop 2.2s ease-in-out both}
.piston-anim .gas{animation:gasCompress 2.2s ease-in-out both;transform-origin:50% 100%}
.piston-anim .gas-label{animation:labelSettle 2.2s ease-in-out both}
.piston-anim .heat-out{animation:heatPulse 2.2s ease-in-out both}
@keyframes pistonDrop{
  0%{transform:translateY(0)} 100%{transform:translateY(58px)} }
@keyframes gasCompress{
  0%{transform:scaleY(1)} 100%{transform:scaleY(0.52)} }
@keyframes labelSettle{
  0%{transform:translateY(0);opacity:.9} 100%{transform:translateY(14px);opacity:1} }
@keyframes heatPulse{
  0%,30%{opacity:0;transform:translate(0,0)}
  55%{opacity:1;transform:translate(-3px,3px)}
  80%{opacity:1;transform:translate(-5px,5px)}
  100%{opacity:.4;transform:translate(-6px,6px)} }

/* nav */
.nav-bar{display:flex;align-items:center;gap:16px;padding:14px 26px;
  border-top:1px solid var(--rule)}
.nav-btn{background:var(--panel);color:var(--ink);border:1px solid var(--rule);
  border-radius:7px;padding:8px 16px;font-size:14px;cursor:pointer;transition:.2s}
.nav-btn:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}
.nav-btn:disabled{opacity:.35;cursor:default}
.nav-dots{flex:1;display:flex;gap:8px;justify-content:center}
.nav-dot{width:9px;height:9px;border-radius:50%;background:var(--rule);cursor:pointer;transition:.2s}
.nav-dot.active{background:var(--accent);transform:scale(1.25)}
.nav-hint{color:var(--muted);font-size:12px}

@media (max-width:720px){
  .outline-list{grid-template-columns:1fr}
  .section-title{font-size:38px}
  .slide-heading{font-size:28px}
  .diagram{width:140px}
}
@media (prefers-reduced-motion:reduce){
  .anim-in,.reveal-block,.outline-item{animation:none;transition:none}
  .piston-anim .piston,.piston-anim .gas,.piston-anim .gas-label,.piston-anim .heat-out{animation:none}
  .piston-anim .heat-out{opacity:1}
}
`
