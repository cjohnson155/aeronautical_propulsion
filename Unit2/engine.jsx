// ME 3470 · Unit 2 — presentation ENGINE
// All reusable renderers (KaTeX, SVG diagrams, every slide-type component),
// the totalSteps() map, and the <Presentation> shell.
// Content lives in ./slides/*; styles live in ./styles.js.
// NOTE: <Presentation> now REQUIRES `slides` and `meta` props (see App.jsx).
import { useState, useEffect, useCallback, useRef } from 'react'
import katex from 'katex'
import { CSS } from './styles'
import HomeScreen from './HomeScreen'

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

// ─── Click-to-reveal cover block ─────────────────────────────────────────────
// Renders children invisibly (so the block sizes correctly), overlays a solid
// coloured panel, and removes the panel on click.
function CoverBlock({ children, color = 'var(--accent)' }) {
  const [hidden, setHidden] = useState(true)
  return (
    <span
      style={{ position: 'relative', display: 'inline-block', cursor: hidden ? 'pointer' : 'default' }}
      onClick={hidden ? (e) => { e.stopPropagation(); setHidden(false) } : undefined}
    >
      <span style={{ visibility: hidden ? 'hidden' : 'visible' }}>{children}</span>
      {hidden && (
        <span style={{
          position: 'absolute', inset: 0,
          background: color,
          borderRadius: '5px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', fontFamily: 'monospace',
          color: 'rgba(0,0,0,0.45)',
          letterSpacing: '0.08em',
          userSelect: 'none',
          boxShadow: '0 1px 6px rgba(0,0,0,0.35)',
        }}>
          ▶ click to reveal
        </span>
      )}
    </span>
  )
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


// ─── Poll slide ───────────────────────────────────────────────────────────────
function PollSlide({ slide }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">{slide.sectionNumber}</div>
      <div className="activity-badge activity-badge--poll anim-in">CLASS POLL &nbsp;✋</div>
      <h2 className="slide-heading anim-in" style={{ marginTop: '6px' }}><HTML>{slide.question}</HTML></h2>
      <div className="heading-rule anim-in" />
      <div className="poll-choices">
        {slide.choices.map((c, i) => {
          const state = revealed
            ? c.correct ? 'correct' : selected === i ? 'wrong' : 'dim'
            : selected === i ? 'selected' : 'idle'
          return (
            <button key={i}
              className={`poll-choice poll-choice--${state}`}
              onClick={() => !revealed && setSelected(i)}
            >
              <span className="poll-choice-label">{c.label}</span>
              <span className="poll-choice-text"><HTML>{c.text}</HTML></span>
              {revealed && c.correct && <span className="poll-tick">✓</span>}
            </button>
          )
        })}
      </div>
      <button className="poll-reveal-btn" onClick={() => setRevealed(true)} disabled={revealed}>
        {revealed ? 'Answer shown' : 'Reveal answer'}
      </button>
      {revealed && (
        <div className="poll-explanation"><HTML>{slide.explanation}</HTML></div>
      )}
    </div>
  )
}

// ─── Think-Pair-Share slide ───────────────────────────────────────────────────
function TPSSlide({ slide }) {
  const [phase, setPhase] = useState('idle')   // idle | think | pair | share
  const [timeLeft, setTimeLeft] = useState(0)

  const startPhase = (p) => {
    setPhase(p)
    if (p === 'think') setTimeLeft(slide.think.minutes * 60)
    else if (p === 'pair') setTimeLeft(slide.pair.minutes * 60)
    else setTimeLeft(0)
  }

  useEffect(() => {
    if (timeLeft <= 0 || (phase !== 'think' && phase !== 'pair')) return
    const t = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(t)
  }, [timeLeft, phase])

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  const totalFor = p => (p === 'think' ? slide.think.minutes : slide.pair.minutes) * 60
  const pct = (phase === 'think' || phase === 'pair') ? (timeLeft / totalFor(phase)) * 100 : 0
  const timerColor = timeLeft < 30 ? '#f87171' : 'var(--accent)'

  const phaseOrder = ['idle', 'think', 'pair', 'share']
  const phaseIdx = phaseOrder.indexOf(phase)

  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">{slide.sectionNumber}</div>
      <div className="activity-badge activity-badge--tps anim-in">THINK &nbsp;·&nbsp; PAIR &nbsp;·&nbsp; SHARE</div>
      <div className="tps-question anim-in"><HTML>{slide.question}</HTML></div>
      <div className="heading-rule anim-in" />

      <div className="tps-phases">
        {/* ── Think ── */}
        <div className={`tps-phase${phase === 'think' ? ' tps-phase--active' : phaseIdx > 1 ? ' tps-phase--done' : ''}`}>
          <div className="tps-phase-hd">
            <span className="tps-num" style={{ background: 'var(--accent)' }}>1</span>
            <span className="tps-phase-name">Think</span>
            <span className="tps-duration">{slide.think.minutes} min</span>
          </div>
          <p className="tps-prompt"><HTML>{slide.think.prompt}</HTML></p>
          {phase === 'idle' && (
            <button className="tps-btn" onClick={() => startPhase('think')}>▶ Start timer</button>
          )}
          {phase === 'think' && (
            <div className="tps-timer">
              <span className="tps-time" style={{ color: timerColor }}>{fmt(timeLeft)}</span>
              <div className="tps-bar"><div className="tps-bar-fill" style={{ width: `${pct}%`, background: timerColor }} /></div>
              <button className="tps-btn tps-btn--sm" onClick={() => startPhase('pair')}>Next →</button>
            </div>
          )}
        </div>

        {/* ── Pair ── */}
        <div className={`tps-phase${phase === 'pair' ? ' tps-phase--active' : phaseIdx > 2 ? ' tps-phase--done' : ''}`}>
          <div className="tps-phase-hd">
            <span className="tps-num" style={{ background: 'var(--accent-2)' }}>2</span>
            <span className="tps-phase-name">Pair</span>
            <span className="tps-duration">{slide.pair.minutes} min</span>
          </div>
          <p className="tps-prompt"><HTML>{slide.pair.prompt}</HTML></p>
          {phase !== 'pair' && phase !== 'share' && (
            <button className="tps-btn tps-btn--amber" onClick={() => startPhase('pair')}>▶ {phase === 'idle' ? 'Skip to pair' : 'Start pair timer'}</button>
          )}
          {phase === 'pair' && (
            <div className="tps-timer">
              <span className="tps-time" style={{ color: timeLeft < 30 ? '#f87171' : 'var(--accent-2)' }}>{fmt(timeLeft)}</span>
              <div className="tps-bar"><div className="tps-bar-fill" style={{ width: `${pct}%`, background: 'var(--accent-2)' }} /></div>
              <button className="tps-btn tps-btn--sm tps-btn--amber" onClick={() => startPhase('share')}>Share →</button>
            </div>
          )}
        </div>

        {/* ── Share ── */}
        <div className={`tps-phase${phase === 'share' ? ' tps-phase--active' : ''}`}>
          <div className="tps-phase-hd">
            <span className="tps-num" style={{ background: '#a78bfa' }}>3</span>
            <span className="tps-phase-name">Share</span>
          </div>
          <p className="tps-prompt"><HTML>{slide.share.prompt}</HTML></p>
          {phase !== 'share' && (
            <button className="tps-btn tps-btn--purple" onClick={() => startPhase('share')}>▶ Share phase</button>
          )}
          {phase === 'share' && (
            <CoverBlock color="#a78bfa">
              <div className="tps-answer">
                <div className="ex-result" style={{ marginBottom: '6px', display: 'block' }}>
                  <Equation latex={slide.answer} display={false} />
                </div>
                <span className="ex-note"><HTML>{slide.answerNote}</HTML></span>
              </div>
            </CoverBlock>
          )}
        </div>
      </div>
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
              <CoverBlock>
                <div className="ex-result">
                  <Equation latex={step.result} display={false} />
                </div>
              </CoverBlock>
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
            <CoverBlock color="var(--accent-2)"><HTML>{slide.questionAnswer}</HTML></CoverBlock>
          </span>
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
    case 'poll':        return 0
    case 'tps':         return 0
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
export default function Presentation({ slides: slideData, meta: metaData, sections = [] }) {
  const hasSections = Array.isArray(sections) && sections.length > 0
  const [atHome, setAtHome] = useState(hasSections)
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

  // Jump straight into a section's first slide from the home screen.
  const enterSection = useCallback((start) => {
    setAtHome(false)
    setSlideIdx(start)
    setRevealed(0)
    setAnimKey(k => k + 1)
    setDirection('enter')
  }, [])

  const goHome = useCallback(() => setAtHome(true), [])

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
      if (e.key === 'Escape' && hasSections) { e.preventDefault(); goHome(); return }
      if (atHome) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
          e.preventDefault(); enterSection(0)
        }
        return
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault(); advance()
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); retreat() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [advance, retreat, atHome, hasSections, goHome, enterSection])

  const handleStageClick = (e) => {
    if (atHome) return
    if (e.target.closest('.nav-btn') || e.target.closest('.nav-dot')) return
    advance()
  }

  const progress = slideData.length > 1
    ? ((slideIdx + (revealed / Math.max(steps, 1))) / (slideData.length - 1)) * 100
    : 100

  const currentSection = hasSections
    ? sections.find(s => slideIdx >= s.start && slideIdx < s.start + s.count)
    : null

  function renderSlide(slide) {
    switch (slide.type) {
      case 'hook':        return <HookSlide slide={slide} revealed={revealed} />
      case 'outline':     return <OutlineSlide slide={slide} revealed={revealed} />
      case 'section':     return <SectionSlide slide={slide} />
      case 'equation':    return <EquationSlide slide={slide} revealed={revealed} />
      case '__path':      return <PathDependenceSlide revealed={revealed} />
      case '__entropy':   return <EntropySlide revealed={revealed} />
      case 'poll':        return <PollSlide slide={slide} />
      case 'tps':         return <TPSSlide slide={slide} />
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
        {hasSections && !atHome && (
          <button className="home-btn" onClick={goHome} title="Back to sections (Esc)">⌂ Sections</button>
        )}
        <span className="course-id">{metaData?.courseId}</span>
        <div className="top-bar-divider" />
        <span className="deck-title">{metaData?.deckTitle}</span>
        {!atHome && currentSection && (
          <span className="top-section">· {currentSection.title}</span>
        )}
        <div className="top-bar-spacer" />
        {!atHome && (
          <span className="slide-counter">{slideIdx + 1} / {slideData.length}</span>
        )}
      </div>

      <div className="stage" onClick={handleStageClick}>
        {atHome ? (
          <HomeScreen sections={sections} meta={metaData} onPick={enterSection} />
        ) : (
          <div className="slide-wrapper">
            <div className={`slide active${direction === 'exit' ? ' exit' : ''}`} key={animKey}>
              {renderSlide(current)}
            </div>
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {!atHome && (
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
          <span className="nav-hint">← → or click · Esc for sections</span>
        </div>
      )}
    </div>
  )
}
