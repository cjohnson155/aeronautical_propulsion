import { useState, useEffect, useCallback } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
//  ME 3470 · Unit 6 — Ideal Afterburning Turbojet · Full Station Walk (1→9)
//  Drop-in replacement for the rp=8 "Worked Example" slide in
//  Unit6CycleAnalysis2Deck. Same navy/cyan shell; equations rendered with plain
//  HTML sub/sup (no KaTeX), matching that deck.
//
//  Standardized on AIRCRAFT STATION NUMBERING 1–9:
//    0/1 freestream·inlet · 2 comp face · 3 comp exit/burner in · 4 burner exit/
//    turbine in · 5 turbine exit · 6 A/B in · 7 A/B exit/nozzle in · 8 throat ·
//    9 exit.  The 1-2-3-4 Brayton corners from the derivation slides map to
//    stations 2-3-4-5 (noted on the map slide).
//
//  Flight condition M0 = 0.85 (subsonic) → inlet is a plain diverging subsonic
//  diffuser, so "ideal / isentropic inlet" is honest (no shock losses).
//  Ideal assumptions: isentropic inlet/comp/turbine/nozzle, no burner/AB total-
//  pressure loss, calorically perfect gas (γ=1.4, cp=1.004), fuel mass ignored,
//  nozzle fully expanded (P9 = Pa). Turbine powers the compressor only.
// ─────────────────────────────────────────────────────────────────────────────

export const meta = {
  courseId:  'ME 3470',
  deckTitle: 'Ideal Afterburning Turbojet \u00b7 Full Station Walk (1\u20139)',
}

// ── numbers for the worked example (all totals unless noted) ──────────────────
const G = {
  gamma: 1.4, cp: 1.004, R: 0.287,
  Ta: 220, Pa: 25, M0: 0.85,
  pic: 8, Tt4: 1300, Tt7: 2000,
  V0: 253,
  Tt2: 252, Pt2: 40,
  Tt3: 456, Pt3: 321, wc: 205,
  qin: 847,
  Tt5: 1096, Pt5: 176,
  qab: 908,
  T9: 1144, V9: 1311,
  Fs: 1058,
  // no-afterburner comparison
  V9na: 970, Fsna: 718,
}

// legs of the walk, in click order; each fills one or more result rows
const LEGS = [
  { key: 'inlet',  active: 'inlet',  station: '1\u21922',
    title: 'Inlet / subsonic diffuser \u00b7 1\u21922',
    tag: '#a78bfa',
    lines: [
      'Subsonic diffuser: the passage diverges, the flow slows, and its speed becomes total temperature & pressure. No shocks, so an ideal (isentropic) inlet is honest here.',
      'T\u209c\u2082 = T\u2090(1 + 0.2\u00b7M\u2080\u00b2) = 220(1.145) = 252 K',
      'P\u209c\u2082 = P\u2090(1.145)^3.5 = 25(1.60) = 40 kPa',
    ],
    rows: [{ n: 2, Tt: 252, Pt: 40 }] },
  { key: 'comp',   active: 'comp',   station: '2\u21923',
    title: 'Compressor \u00b7 2\u21923',
    tag: '#5ec8d8',
    lines: [
      'Isentropic, pressure ratio \u03c0\u1d04 = 8.',
      'T\u209c\u2083 = T\u209c\u2082\u00b7\u03c0\u1d04^0.286 = 252(1.811) = 456 K',
      'P\u209c\u2083 = 8\u00b7P\u209c\u2082 = 321 kPa',
      'w\u1d04 = c\u209a(T\u209c\u2083 \u2212 T\u209c\u2082) = 1.004(204) = 205 kJ/kg',
    ],
    rows: [{ n: 3, Tt: 456, Pt: 321 }] },
  { key: 'burner', active: 'burner', station: '3\u21924',
    title: 'Burner \u00b7 3\u21924',
    tag: '#f0a93b',
    lines: [
      'Constant total pressure; T\u209c\u2084 set by turbine-inlet limit = 1300 K.',
      'P\u209c\u2084 = P\u209c\u2083 = 321 kPa',
      'q\u1d62\u2099 = c\u209a(T\u209c\u2084 \u2212 T\u209c\u2083) = 1.004(844) = 847 kJ/kg',
    ],
    rows: [{ n: 4, Tt: 1300, Pt: 321 }] },
  { key: 'turb',   active: 'turb',   station: '4\u21925',
    title: 'Turbine \u00b7 4\u21925',
    tag: '#f0a93b',
    lines: [
      'Turbine powers the compressor only \u2192 w\u209c = w\u1d04.',
      'T\u209c\u2085 = T\u209c\u2084 \u2212 (T\u209c\u2083 \u2212 T\u209c\u2082) = 1300 \u2212 204 = 1096 K',
      'P\u209c\u2085 = P\u209c\u2084(T\u209c\u2085/T\u209c\u2084)^3.5 = 176 kPa',
    ],
    rows: [{ n: 5, Tt: 1096, Pt: 176 }] },
  { key: 'ab',     active: 'ab',     station: '6\u21927',
    title: 'Afterburner \u00b7 6\u21927',
    tag: '#e2685c',
    lines: [
      'Second heat addition downstream of the turbine (5\u22486, ideal duct).',
      'Constant total pressure; T\u209c\u2087 = 2000 K.',
      'P\u209c\u2087 = P\u209c\u2085 = 176 kPa',
      'q\u2090\u1d47 = c\u209a(T\u209c\u2087 \u2212 T\u209c\u2085) = 1.004(904) = 908 kJ/kg',
    ],
    rows: [{ n: 7, Tt: 2000, Pt: 176 }] },
  { key: 'nozzle', active: 'nozzle', station: '7\u21929',
    title: 'Nozzle \u00b7 7\u21929 (throat = 8)',
    tag: '#5ec8d8',
    lines: [
      'Isentropic, fully expanded to ambient: P\u2089 = P\u2090 = 25 kPa.',
      'T\u2089 = T\u209c\u2087(P\u2090/P\u209c\u2087)^0.286 = 2000(0.572) = 1144 K',
      'V\u2089 = \u221a[2c\u209a(T\u209c\u2087 \u2212 T\u2089)] = \u221a[2\u00b71004\u00b7856] = 1311 m/s',
    ],
    rows: [{ n: 9, Tt: 2000, Pt: 25, note: 'T\u2089=1144, static' }] },
  { key: 'thrust', active: 'nozzle', station: 'F/\u1e41',
    title: 'Specific thrust',
    tag: '#5fd39a',
    lines: [
      'Fully expanded \u2192 pressure term is zero.',
      'F/\u1e41 = V\u2089 \u2212 V\u2080 = 1311 \u2212 253 = 1058 N\u00b7s/kg',
    ],
    rows: [] },
]

// ── engine schematic ─────────────────────────────────────────────────────────
// station x positions along the flow path
const SX = { 1: 46, 2: 120, 3: 236, 4: 300, 5: 366, 6: 404, 7: 500, 8: 556, 9: 606 }
// half-height (from centerline y=100) of the duct wall at each station
const SH = { 1: 50, 2: 40, 3: 26, 4: 30, 5: 34, 6: 34, 7: 34, 8: 22, 9: 42 }

function wallPath(sign) {
  const order = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  return order.map((n, i) =>
    `${i === 0 ? 'M' : 'L'}${SX[n]} ${100 - sign * SH[n]}`).join(' ')
}

const COMP_BLOCKS = [
  { key: 'inlet',  x0: 1, x1: 2, fill: '#a78bfa', label: 'Inlet' },
  { key: 'comp',   x0: 2, x1: 3, fill: '#5ec8d8', label: 'Compressor' },
  { key: 'burner', x0: 3, x1: 4, fill: '#f0a93b', label: 'Burner' },
  { key: 'turb',   x0: 4, x1: 5, fill: '#f0a93b', label: 'Turbine' },
  { key: 'ab',     x0: 6, x1: 7, fill: '#e2685c', label: 'A/B' },
  { key: 'nozzle', x0: 7, x1: 9, fill: '#5ec8d8', label: 'Nozzle' },
]

function EngineSchematic({ active, revealedStations }) {
  return (
    <svg viewBox="0 0 640 200" className="tj-svg" aria-hidden>
      {/* component fills */}
      {COMP_BLOCKS.map((b) => {
        const on = active === b.key
        const mid = (SX[b.x0] + SX[b.x1]) / 2
        return (
          <g key={b.key} opacity={on ? 1 : 0.35} style={{ transition: '.3s' }}>
            <polygon
              points={`${SX[b.x0]},${100 - SH[b.x0]} ${SX[b.x1]},${100 - SH[b.x1]} ${SX[b.x1]},${100 + SH[b.x1]} ${SX[b.x0]},${100 + SH[b.x0]}`}
              fill={b.fill} opacity={on ? 0.28 : 0.12} />
            <text x={mid} y={100} className="tj-comp"
              fill={on ? b.fill : 'var(--muted)'} textAnchor="middle"
              style={{ fontWeight: on ? 700 : 400 }}>{b.label}</text>
          </g>
        )
      })}

      {/* duct walls */}
      <path d={wallPath(1)} className="tj-wall" />
      <path d={wallPath(-1)} className="tj-wall" />
      <line x1={SX[1]} y1="100" x2={SX[9]} y2="100" className="tj-center" />

      {/* station planes + numbers */}
      {Object.keys(SX).map((k) => {
        const n = Number(k)
        const lit = revealedStations.includes(n)
        return (
          <g key={n}>
            <line x1={SX[n]} y1={100 - SH[n] - 4} x2={SX[n]} y2={100 + SH[n] + 4}
              className="tj-plane" />
            <circle cx={SX[n]} cy={100 + SH[n] + 16} r="9"
              className={`tj-stn${lit ? ' tj-stn-on' : ''}`} />
            <text x={SX[n]} y={100 + SH[n] + 19.5} className="tj-stn-t"
              textAnchor="middle">{n}</text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Slide 1 — station map + given ─────────────────────────────────────────────
function MapSlide({ revealed }) {
  const on = revealed >= 1
  return (
    <div className="slide-inner">
      <div className="section-number anim-in">Section 5 · 5.11 · Example</div>
      <h2 className="slide-heading anim-in">The Engine, Station by Station (1→9)</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 12 }}>
        One control volume per component, bounded by numbered station planes. Air enters at the
        left as freestream and leaves at station 9 as the jet. We&rsquo;ll compute the total temperature
        and pressure at every plane, then the exhaust velocity and thrust.
      </p>

      <div className="tj-fig anim-in">
        <EngineSchematic active={null} revealedStations={[1,2,3,4,5,6,7,8,9]} />
      </div>

      <div className="gibbs-grid gibbs-grid-2" style={{ marginTop: 12 }}>
        <div className="gibbs-card">
          <div className="gibbs-card-h">Given</div>
          <div className="gibbs-eq" style={{ fontSize: 13.5, lineHeight: 1.7 }}>
            M\u2080 = 0.85 &nbsp; T\u2090 = 220 K &nbsp; P\u2090 = 25 kPa<br />
            \u03c0\u1d04 = 8 &nbsp; T\u209c\u2084 = 1300 K &nbsp; T\u209c\u2087 = 2000 K<br />
            \u03b3 = 1.4 &nbsp; c\u209a = 1.004 kJ/kg\u00b7K
          </div>
        </div>
        <div className="gibbs-card">
          <div className="gibbs-card-h" style={{ color: 'var(--accent-2)' }}>Reading the numbers</div>
          <div className="gibbs-q" style={{ lineHeight: 1.6 }}>
            The 1-2-3-4 corners from the efficiency derivation are stations <b>2-3-4-5</b> here.
            Stations 1 and 6\u20139 (inlet, afterburner, nozzle) are the extra physics a real jet adds
            on top of the closed Brayton loop.
          </div>
        </div>
      </div>

      <p className="cyc-cap" style={{ marginTop: 12 }}>
        {on
          ? <><b style={{ color: 'var(--accent)' }}>Idealizations</b> \u2014 every component isentropic, no
             burner/afterburner pressure loss, fuel mass neglected, nozzle fully expanded (P\u2089 = P\u2090).</>
          : <b>Click / → for the modeling assumptions before we start.</b>}
      </p>
    </div>
  )
}

// ── Slide 2 — the station-by-station walk ─────────────────────────────────────
const RESULT_ROWS = [2, 3, 4, 5, 7, 9]
const ROW_LABEL = {
  2: 'Comp face', 3: 'Comp exit', 4: 'Turb in', 5: 'Turb exit', 7: 'A/B exit', 9: 'Nozzle exit',
}

function WalkSlide({ revealed }) {
  // revealed 0 = only given; 1..7 = legs of LEGS
  const legsShown = LEGS.slice(0, revealed)
  const activeLeg = revealed > 0 ? LEGS[revealed - 1] : null

  // accumulate result rows
  const results = {}
  legsShown.forEach((lg) => lg.rows.forEach((r) => { results[r.n] = r }))
  const litStations = [1, ...Object.keys(results).map(Number)]

  return (
    <div className="slide-inner">
      <div className="section-number anim-in">Section 5 · 5.11 · Example</div>
      <h2 className="slide-heading anim-in">Walk the Flow Path — One Station at a Time</h2>
      <div className="heading-rule anim-in" />

      <div className="tj-fig" style={{ marginBottom: 12 }}>
        <EngineSchematic active={activeLeg ? activeLeg.active : null}
          revealedStations={litStations} />
      </div>

      <div className="tj-cols">
        {/* running results table */}
        <div className="gibbs-card tj-tablecard">
          <div className="gibbs-card-h">Totals along the flow path</div>
          <table className="tj-table">
            <thead>
              <tr><th>Stn</th><th></th><th>T<sub>t</sub> (K)</th><th>P<sub>t</sub> (kPa)</th></tr>
            </thead>
            <tbody>
              <tr className="tj-given-row">
                <td>0</td><td>Freestream</td><td>252*</td><td>40*</td>
              </tr>
              {RESULT_ROWS.map((n) => {
                const r = results[n]
                return (
                  <tr key={n} className={r ? 'tj-row-on' : ''}>
                    <td>{n}</td>
                    <td>{ROW_LABEL[n]}</td>
                    <td>{r ? (n === 9 ? '1144' : r.Tt) : '—'}</td>
                    <td>{r ? r.Pt : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="tj-foot">*totals; ideal inlet ⇒ equal at stations 0, 1, 2.  V₀ = 253 m/s.</div>
        </div>

        {/* current-leg worked math */}
        <div className="tj-legcard">
          {activeLeg ? (
            <div className="gibbs-card" style={{ borderLeft: `3px solid ${activeLeg.tag}` }}>
              <div className="gibbs-card-h" style={{ color: activeLeg.tag, textAlign: 'left' }}>
                {activeLeg.title}
              </div>
              {activeLeg.lines.map((ln, i) => (
                <div key={i} className={i === 0 ? 'tj-leg-lead' : 'tj-leg-eq'}>{ln}</div>
              ))}
            </div>
          ) : (
            <div className="gibbs-card tj-startcard">
              <div className="gibbs-q" style={{ textAlign: 'center' }}>
                <b>Click / →</b> to send the air through the engine.<br />
                Each step fills in one station.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Slide 3 — summary + afterburner payoff ────────────────────────────────────
function SummarySlide({ revealed }) {
  const on = revealed >= 1
  return (
    <div className="slide-inner">
      <div className="section-number anim-in">Section 5 · 5.11 · Example</div>
      <h2 className="slide-heading anim-in">Results — and Why the Afterburner Earns Its Fuel</h2>
      <div className="heading-rule anim-in" />

      <div className="gibbs-grid gibbs-grid-2">
        <div className="gibbs-card">
          <div className="gibbs-card-h" style={{ color: 'var(--accent)' }}>Key answers</div>
          <div className="gibbs-eq" style={{ fontSize: 13.5, lineHeight: 1.8, textAlign: 'left' }}>
            Compressor exit &nbsp;T\u209c\u2083 = <b>456 K</b><br />
            Turbine exit &nbsp;&nbsp;&nbsp;&nbsp;T\u209c\u2085 = <b>1096 K</b><br />
            A/B exit &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;T\u209c\u2087 = <b>2000 K</b><br />
            Exhaust speed &nbsp;&nbsp;V\u2089 = <b>1311 m/s</b><br />
            Specific thrust &nbsp;F/\u1e41 = <b>1058 N·s/kg</b>
          </div>
        </div>
        <div className="gibbs-card">
          <div className="gibbs-card-h" style={{ color: 'var(--accent-2)' }}>Converging–diverging nozzle</div>
          <div className="gibbs-q" style={{ lineHeight: 1.6 }}>
            Nozzle pressure ratio P\u209c\u2087/P\u2090 = 176/25 \u2248 <b>7</b> \u2014 well above the choking value (\u22481.9),
            so the flow must go <b>sonic at the throat (station 8)</b> and keep accelerating in the diverging
            section to reach P\u2089 = P\u2090 at station 9. A plain converging nozzle would choke and waste the pressure.
          </div>
        </div>
      </div>

      <div className="gibbs-card" style={{ maxWidth: 820, margin: '14px auto 0' }}>
        <div className="gibbs-card-h">Afterburner on vs. off (same core)</div>
        <div className="tj-cmp">
          <div className="tj-cmp-col">
            <div className="tj-cmp-h" style={{ color: 'var(--muted)' }}>A/B off</div>
            <div className="tj-cmp-v">V₉ = 970 m/s</div>
            <div className="tj-cmp-v">F/ṁ = 718 N·s/kg</div>
          </div>
          <div className="tj-cmp-arrow">→</div>
          <div className="tj-cmp-col">
            <div className="tj-cmp-h" style={{ color: 'var(--bad)' }}>A/B on</div>
            <div className="tj-cmp-v" style={{ color: 'var(--ink)' }}>V₉ = 1311 m/s</div>
            <div className="tj-cmp-v" style={{ color: 'var(--ink)' }}>F/ṁ = 1058 N·s/kg</div>
          </div>
        </div>
      </div>

      <p className="cyc-cap" style={{ marginTop: 12 }}>
        {on
          ? <><b style={{ color: 'var(--bad)' }}>+47% specific thrust</b> \u2014 the afterburner adds nearly half
             again as much by raising T\u209c\u2087, without touching the turbine\u2013compressor balance. The cost is fuel
             flow and efficiency, which is why it&rsquo;s used in bursts.</>
          : <b>Click / → for the payoff.</b>}
      </p>
    </div>
  )
}

// ── router + step counts ─────────────────────────────────────────────────────
const SLIDES = [
  { render: (r) => <MapSlide revealed={r} />,     steps: 1 },
  { render: (r) => <WalkSlide revealed={r} />,    steps: LEGS.length },
  { render: (r) => <SummarySlide revealed={r} />, steps: 1 },
]

export default function Presentation() {
  const [slideIdx, setSlideIdx] = useState(0)
  const [revealed, setRevealed] = useState(0)
  const [direction, setDirection] = useState(null)
  const [animKey, setAnimKey] = useState(0)

  const steps = SLIDES[slideIdx].steps

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= SLIDES.length) return
    setDirection('exit')
    setTimeout(() => { setSlideIdx(idx); setRevealed(0); setAnimKey((k) => k + 1); setDirection('enter') }, 240)
  }, [])

  const advance = useCallback(() => {
    if (revealed < steps) setRevealed((r) => r + 1); else goTo(slideIdx + 1)
  }, [revealed, steps, slideIdx, goTo])
  const retreat = useCallback(() => {
    if (revealed > 0) setRevealed((r) => r - 1); else goTo(slideIdx - 1)
  }, [revealed, slideIdx, goTo])

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); advance() }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); retreat() }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [advance, retreat])

  const stage = (e) => { if (e.target.closest('.nav-btn') || e.target.closest('.nav-dot')) return; advance() }
  const progress = ((slideIdx + revealed / Math.max(steps, 1)) / (SLIDES.length - 1)) * 100

  return (
    <div className="app">
      <style>{CSS}</style>
      <div className="top-bar">
        <span className="course-id">{meta.courseId}</span>
        <div className="top-bar-divider" />
        <span className="deck-title">{meta.deckTitle}</span>
        <div className="top-bar-spacer" />
        <span className="slide-counter">{slideIdx + 1} / {SLIDES.length}</span>
      </div>

      <div className="stage" onClick={stage}>
        <div className="slide-wrapper">
          <div className={`slide active${direction === 'exit' ? ' exit' : ''}`} key={animKey}>
            {SLIDES[slideIdx].render(revealed)}
          </div>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="nav-bar">
        <button className="nav-btn" onClick={retreat} disabled={slideIdx === 0 && revealed === 0}>&larr; Prev</button>
        <div className="nav-dots">
          {SLIDES.map((_, i) => (
            <div key={i} className={`nav-dot${i === slideIdx ? ' active' : ''}`}
              onClick={(e) => { e.stopPropagation(); goTo(i) }} />
          ))}
        </div>
        <button className="nav-btn" onClick={advance} disabled={slideIdx === SLIDES.length - 1 && revealed >= steps}>Next &rarr;</button>
        <span className="nav-hint">&larr; &rarr; or click · walk the stations</span>
      </div>
    </div>
  )
}

// ── styles (ME 3470 navy/cyan theme, matched to Unit6CycleAnalysis2Deck) ──────
const CSS = `
:root{
  --bg:#0d1b2a; --panel:#13243a; --ink:#eaf1f8; --muted:#8da4be;
  --accent:#5ec8d8; --accent-2:#f0a93b; --bad:#e2685c; --rule:#27405e;
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
  padding:24px 40px;cursor:pointer;overflow:auto}
.slide-wrapper{margin:auto;position:relative;width:100%;max-width:1180px}
.slide{width:100%}
.slide.exit .slide-inner{opacity:0;transform:translateY(-10px);transition:.22s ease}
.slide-inner{width:100%}
.anim-in{animation:fadeUp .5s ease both}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.section-number{font-family:var(--display);color:var(--accent);
  font-size:14px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:8px}
.slide-heading{font-family:var(--display);font-size:31px;margin:2px 0 0}
.slide-heading sub{font-size:.62em}
.heading-rule{width:70px;height:3px;background:var(--accent);margin:12px 0 12px}
.cf-note{font-size:14.5px;line-height:1.5;color:var(--muted);max-width:1120px;margin:0}
.cf-note strong{color:var(--accent-2)}
.cf-note--lead{color:var(--ink)}
.cyc-cap{font-size:15px;color:var(--ink);margin:2px 0 8px;min-height:20px}
.cyc-cap b{font-weight:700}

.nav-bar{display:flex;align-items:center;gap:16px;padding:14px 26px;border-top:1px solid var(--rule)}
.nav-btn{background:var(--panel);color:var(--ink);border:1px solid var(--rule);
  border-radius:7px;padding:8px 16px;font-size:14px;cursor:pointer;transition:.2s}
.nav-btn:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}
.nav-btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.nav-btn:disabled{opacity:.35;cursor:default}
.nav-dots{flex:1;display:flex;gap:8px;justify-content:center}
.nav-dot{width:9px;height:9px;border-radius:50%;background:var(--rule);cursor:pointer;transition:.2s}
.nav-dot.active{background:var(--accent);transform:scale(1.25)}
.nav-hint{color:var(--muted);font-size:12px}
.progress-bar{position:absolute;left:0;bottom:-12px;height:2px;background:var(--accent);transition:width .3s ease}

/* cards */
.gibbs-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.gibbs-grid-2{max-width:900px;margin-left:auto;margin-right:auto}
.gibbs-card{background:var(--panel);border:1px solid var(--rule);border-radius:12px;padding:10px 14px 12px}
.gibbs-card-h{font-size:12.5px;font-weight:700;color:var(--accent);margin-bottom:4px;text-align:center}
.gibbs-eq{font-size:13px;color:var(--ink);text-align:center;margin-top:2px;font-weight:600}
.gibbs-q{font-size:12.5px;color:var(--muted);margin-top:2px;line-height:1.5}

/* engine schematic */
.tj-fig{background:var(--panel);border:1px solid var(--rule);border-radius:12px;
  padding:8px 14px 4px}
.tj-svg{width:100%;height:auto;display:block;max-height:30vh}
.tj-wall{fill:none;stroke:var(--muted);stroke-width:2;stroke-linejoin:round}
.tj-center{stroke:var(--rule);stroke-width:1;stroke-dasharray:5 5}
.tj-plane{stroke:var(--rule);stroke-width:1}
.tj-comp{font-family:var(--body);font-size:11px}
.tj-stn{fill:var(--panel);stroke:var(--rule);stroke-width:1.4;transition:.25s}
.tj-stn-on{fill:var(--accent);stroke:var(--accent)}
.tj-stn-t{font:700 10px var(--body);fill:var(--ink)}

/* walk layout */
.tj-cols{display:grid;grid-template-columns:0.95fr 1.15fr;gap:14px}
.tj-tablecard{align-self:start}
.tj-table{width:100%;border-collapse:collapse;font-size:13px;margin-top:2px}
.tj-table th{font-family:var(--display);font-size:10.5px;letter-spacing:.08em;
  text-transform:uppercase;color:var(--muted);text-align:right;padding:3px 8px;
  border-bottom:1px solid var(--rule);font-weight:400}
.tj-table th:nth-child(2){text-align:left}
.tj-table td{padding:5px 8px;text-align:right;color:var(--muted);
  border-bottom:1px solid var(--rule);font-variant-numeric:tabular-nums}
.tj-table td:first-child{font-weight:700;color:var(--ink)}
.tj-table td:nth-child(2){text-align:left;color:var(--muted)}
.tj-row-on td{color:var(--ink)}
.tj-row-on td:nth-child(2){color:var(--accent)}
.tj-given-row td{color:var(--muted);opacity:.75}
.tj-foot{font-size:11px;color:var(--muted);margin-top:8px;line-height:1.4;font-style:italic}
.tj-legcard{align-self:start}
.tj-leg-lead{font-size:13px;color:var(--muted);line-height:1.5;margin:2px 0 8px}
.tj-leg-eq{font-size:14px;color:var(--ink);font-weight:600;line-height:1.7;
  padding:2px 0;font-variant-numeric:tabular-nums}
.tj-startcard{display:flex;align-items:center;justify-content:center;min-height:150px}

/* A/B comparison */
.tj-cmp{display:flex;align-items:center;justify-content:center;gap:26px;margin-top:4px}
.tj-cmp-col{text-align:center}
.tj-cmp-h{font-family:var(--display);font-size:13px;font-weight:700;margin-bottom:6px}
.tj-cmp-v{font-size:13.5px;color:var(--muted);line-height:1.7;font-variant-numeric:tabular-nums}
.tj-cmp-arrow{font-size:24px;color:var(--accent-2)}

@media (max-width:900px){
  .gibbs-grid{grid-template-columns:1fr}
  .tj-cols{grid-template-columns:1fr}
}
@media (max-width:720px){ .slide-heading{font-size:25px} .nav-hint{display:none} }
@media (prefers-reduced-motion:reduce){ .anim-in{animation:none} }
`
