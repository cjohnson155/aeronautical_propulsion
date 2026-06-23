import { useState, useEffect, useCallback, useRef } from 'react'
import katex from 'katex'

function Equation({ latex }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    try {
      katex.render(latex, ref.current, { displayMode: true, throwOnError: false })
    } catch (e) {
      ref.current.textContent = latex
    }
  }, [latex])
  return <div ref={ref} />
}

function HTML({ children }) {
  return <span dangerouslySetInnerHTML={{ __html: children }} />
}

// ─── Slide renderers ──────────────────────────────────────────────────────────

function SectionSlide({ slide }) {
  return (
    <div className="slide-inner section-slide anim-in">
      {slide.sectionNumber && <div className="section-number">{slide.sectionNumber}</div>}
      <h2 className="section-title">{slide.title}</h2>
      <div className="section-divider-line" />
      {slide.subtitle && <p className="section-sub" dangerouslySetInnerHTML={{ __html: slide.subtitle }} />}
    </div>
  )
}

function BulletsSlide({ slide, revealed }) {
  return (
    <div className="slide-inner">
      <h2 className="slide-heading anim-in">{slide.heading}</h2>
      <div className="heading-rule anim-in" />
      <ul className="bullet-list">
        {(slide.items || []).map((item, i) => (
          <li key={i} className={`bullet-item${i < revealed ? ' revealed' : ''}`}>
            <span className="bullet-marker">◆</span>
            <div className="bullet-text">
              <strong><HTML>{item.title}</HTML></strong>
              {item.body && <span className="bullet-sub"><HTML>{item.body}</HTML></span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function EquationSlide({ slide, revealed }) {
  return (
    <div className="slide-inner">
      <h2 className="slide-heading anim-in">{slide.heading}</h2>
      <div className="heading-rule anim-in" />
      {slide.equationLabel && <div className="eq-label anim-in">{slide.equationLabel}</div>}
      {slide.equation && (
        <div className="eq-box anim-in"><Equation latex={slide.equation} /></div>
      )}
      {slide.terms && slide.terms.length > 0 && (
        <div className="eq-terms anim-in">
          {slide.terms.map((t, i) => (
            <div className="eq-term" key={i}>
              <span className="sym"><HTML>{t.symbol}</HTML></span>
              <span className="def">— <HTML>{t.definition}</HTML></span>
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
                {item.body && <span className="bullet-sub"><HTML>{item.body}</HTML></span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function TwoColSlide({ slide, revealed }) {
  const leftItems  = slide.left?.items  || []
  const rightItems = slide.right?.items || []
  function isRevealed(side, idx) {
    const pos = side === 'left' ? idx * 2 : idx * 2 + 1
    return pos < revealed
  }
  return (
    <div className="slide-inner">
      <h2 className="slide-heading anim-in">{slide.heading}</h2>
      <div className="heading-rule anim-in" />
      <div className="two-col">
        <div className="col">
          {slide.left?.label && <div className="col-header">{slide.left.label}</div>}
          {leftItems.map((item, i) => (
            <div key={i} className={`col-item${isRevealed('left', i) ? ' revealed' : ''}`}>
              <strong><HTML>{item.title}</HTML></strong>
              {item.body && <HTML>{item.body}</HTML>}
            </div>
          ))}
        </div>
        <div className="col-divider" />
        <div className="col">
          {slide.right?.label && <div className="col-header">{slide.right.label}</div>}
          {rightItems.map((item, i) => (
            <div key={i} className={`col-item${isRevealed('right', i) ? ' revealed' : ''}`}>
              <strong><HTML>{item.title}</HTML></strong>
              {item.body && <HTML>{item.body}</HTML>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Path Dependence slide (custom) ──────────────────────────────────────────

function PathDependenceSlide({ revealed }) {
  const items = [
    {
      category: 'PATH-DEPENDENT',
      color: '#f87171',
      vars: [
        { sym: 'q', label: 'Heat transfer', body: 'Depends on how slowly or quickly the process occurs, and through what path. Adding heat isothermally vs. adiabatically gives different q even between the same two states.' },
        { sym: 'w', label: 'Work', body: 'Boundary work ∫p dV depends on the p–V trajectory. Reversible isothermal expansion does more work than free (unrestrained) expansion between identical endpoints — same states, different paths, different w.' },
      ]
    },
    {
      category: 'PATH-INDEPENDENT (State Variables)',
      color: '#4ade80',
      vars: [
        { sym: 'e', label: 'Internal energy', body: 'e = c<sub>v</sub>T for a calorically perfect gas. Its value is fixed once the state (T, p, ρ) is known — regardless of how you got there.' },
        { sym: 'h', label: 'Enthalpy', body: 'h = e + pv = c<sub>p</sub>T. Also a state variable; only the endpoints matter when computing Δh.' },
        { sym: 'S', label: 'Entropy', body: 'S is a state variable. But dS = δq<sub>rev</sub>/T — you must integrate along a reversible path to evaluate it. The result is still path-independent.' },
      ]
    }
  ]

  let revealCount = 0

  return (
    <div className="slide-inner">
      <h2 className="slide-heading anim-in">Path Dependence vs. State Variables</h2>
      <div className="heading-rule anim-in" />
      <p className="anim-in" style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.8rem', lineHeight: 1.5 }}>
        The 1st Law <strong style={{color:'#e2e8f0'}}>de = δq + δw</strong> uses δ (not d) for heat and work — a reminder that they are <em>not</em> exact differentials. Only state variables have exact differentials.
      </p>
      <div style={{ display: 'flex', gap: '1.2rem' }}>
        {items.map((group, gi) => (
          <div key={gi} style={{ flex: 1 }}>
            <div style={{
              fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
              color: group.color, borderBottom: `1px solid ${group.color}40`,
              paddingBottom: '0.35rem', marginBottom: '0.6rem'
            }}>
              {group.category}
            </div>
            {group.vars.map((v, vi) => {
              const idx = revealCount++
              const show = idx < revealed
              return (
                <div key={vi} className={`col-item${show ? ' revealed' : ''}`}
                  style={{ marginBottom: '0.55rem', borderLeft: `2px solid ${group.color}60`, paddingLeft: '0.6rem' }}>
                  <strong style={{ color: group.color, fontSize: '1rem', fontStyle: 'italic' }}>{v.sym}</strong>
                  <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.78rem', marginLeft: '0.4rem' }}>{v.label}</span>
                  <span className="bullet-sub" style={{ display: 'block', marginTop: '0.2rem' }}><HTML>{v.body}</HTML></span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Entropy examples slide (custom) ─────────────────────────────────────────

function EntropySlide({ revealed }) {
  const examples = [
    {
      icon: '🔥',
      title: 'Heat addition (combustor)',
      body: 'Adding heat δq to a gas at temperature T increases entropy by dS = δq/T. In a real combustor, additional irreversibilities (viscous dissipation, mixing) raise entropy further — hence stagnation pressure is always lost across the burner.',
    },
    {
      icon: '🌊',
      title: 'Normal shock',
      body: 'Across a shock, T₀ is conserved but p₀ drops. Since Δs = c<sub>p</sub> ln(T₀₂/T₀₁) − R ln(p₀₂/p₀₁), the p₀ loss directly increases entropy. This is why inlets that swallow shocks pay a pressure-recovery penalty.',
    },
    {
      icon: '💨',
      title: 'Unrestrained (free) expansion',
      body: 'Gas expands into a vacuum: no work done (w = 0), no heat transfer (q = 0), yet ΔS > 0. The same particles now have more volume to occupy — more microstates, higher entropy. A striking reminder that entropy can increase with no energy transfer.',
    },
    {
      icon: '🔀',
      title: 'Irreversible mixing',
      body: 'Mixing two streams of air at different temperatures or compositions is irreversible. Even if the total energy is conserved, the process cannot be undone without external work — ΔS<sub>universe</sub> > 0. Relevant in turbofan bypass/core mixing.',
    },
    {
      icon: '⚙️',
      title: 'Viscous friction in ducts',
      body: 'In Fanno flow, friction converts ordered kinetic energy to thermal energy, raising entropy monotonically along the duct in both subsonic and supersonic branches — regardless of flow direction. Mach → 1 is the entropy maximum.',
    },
  ]

  return (
    <div className="slide-inner">
      <h2 className="slide-heading anim-in">Entropy: Ways It Increases</h2>
      <div className="heading-rule anim-in" />
      <p className="anim-in" style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.8rem' }}>
        <strong style={{color:'#e2e8f0'}}>dS ≥ δq/T</strong> &nbsp;(2nd Law). Equality holds for reversible processes; strict inequality for all real ones.
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

// ─── Slide data ───────────────────────────────────────────────────────────────

const meta = { courseId: 'ME 3470', deckTitle: 'Unit 2 — Thermodynamic Foundations' }

const slides = [
  {
    type: 'section',
    sectionNumber: 'Part 1',
    title: 'Internal Energy & Enthalpy',
    subtitle: 'State variables, the 1st Law, and a room full of air.',
  },
  {
    type: 'equation',
    heading: 'Internal Energy & Enthalpy of a Calorically Perfect Gas',
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
        body: 'ρ = 1.181 kg/m³, V = 5×7×3.3 m = 115.5 m³ → m = 136.4 kg, T ≈ 293 K.<br>E = c<sub>v</sub>Tm = 717.5 × 293 × 136.4 ≈ <strong>29.2 MJ</strong>&emsp;H = c<sub>p</sub>Tm ≈ <strong>40.8 MJ</strong>.<br>Check: H/E = c<sub>p</sub>/c<sub>v</sub> = γ = 1.4 ✓',
      },
      {
        title: 'Why does H/E = γ?',
        body: 'H = c<sub>p</sub>Tm and E = c<sub>v</sub>Tm, so H/E = c<sub>p</sub>/c<sub>v</sub> = γ exactly. A fast sanity check you can always use.',
      },
    ],
  },
  {
    type: '__path',   // custom renderer flag
  },
  {
    type: '__entropy',  // custom renderer flag
  },
]

// ─── Step counts ──────────────────────────────────────────────────────────────

function totalSteps(slide) {
  if (slide.type === 'bullets')   return slide.items?.length || 0
  if (slide.type === 'equation')  return slide.items?.length || 0
  if (slide.type === 'twocol') {
    return (slide.left?.items?.length || 0) + (slide.right?.items?.length || 0)
  }
  if (slide.type === '__path')    return 5  // 2 path-dep + 3 state vars
  if (slide.type === '__entropy') return 5
  return 0
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Presentation() {
  const [slideIdx,  setSlideIdx]  = useState(0)
  const [revealed,  setRevealed]  = useState(0)
  const [direction, setDirection] = useState(null)
  const [animKey,   setAnimKey]   = useState(0)

  const current = slides[slideIdx]
  const steps   = totalSteps(current)

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= slides.length) return
    setDirection('exit')
    setTimeout(() => {
      setSlideIdx(idx)
      setRevealed(0)
      setAnimKey(k => k + 1)
      setDirection('enter')
    }, 260)
  }, [])

  const advance = useCallback(() => {
    if (revealed < steps) setRevealed(r => r + 1)
    else goTo(slideIdx + 1)
  }, [revealed, steps, slideIdx, goTo])

  const retreat = useCallback(() => {
    if (revealed > 0) setRevealed(0)
    else goTo(slideIdx - 1)
  }, [revealed, slideIdx, goTo])

  useEffect(() => {
    const h = (e) => {
      if (['ArrowRight','ArrowDown',' '].includes(e.key)) { e.preventDefault(); advance() }
      if (['ArrowLeft','ArrowUp'].includes(e.key))        { e.preventDefault(); retreat() }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [advance, retreat])

  const handleStageClick = (e) => {
    if (e.target.closest('.nav-btn') || e.target.closest('.nav-dot')) return
    advance()
  }

  const progress = slides.length > 1
    ? ((slideIdx + (revealed / Math.max(steps, 1))) / (slides.length - 1)) * 100
    : 100

  function renderSlide(slide, key) {
    switch (slide.type) {
      case 'section':    return <SectionSlide slide={slide} key={key} />
      case 'bullets':    return <BulletsSlide slide={slide} revealed={revealed} key={key} />
      case 'equation':   return <EquationSlide slide={slide} revealed={revealed} key={key} />
      case 'twocol':     return <TwoColSlide slide={slide} revealed={revealed} key={key} />
      case '__path':     return <PathDependenceSlide revealed={revealed} key={key} />
      case '__entropy':  return <EntropySlide revealed={revealed} key={key} />
      default:           return null
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0f172a; }

        .app {
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          background: #0f172a;
          color: #e2e8f0;
          height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* ── top bar ── */
        .top-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.55rem 1.5rem;
          background: #1e293b;
          border-bottom: 1px solid #334155;
          font-size: 0.72rem;
          flex-shrink: 0;
        }
        .course-id  { font-weight: 700; color: #38bdf8; letter-spacing: 0.05em; }
        .deck-title { color: #94a3b8; }
        .top-bar-divider { width: 1px; height: 14px; background: #475569; }
        .top-bar-spacer  { flex: 1; }
        .slide-counter   { color: #64748b; font-variant-numeric: tabular-nums; }

        /* ── stage ── */
        .stage {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          cursor: pointer;
          overflow: hidden;
        }
        .slide-wrapper {
          position: relative;
          width: min(900px, 100%);
          aspect-ratio: 16/9;
          background: #1e293b;
          border-radius: 8px;
          border: 1px solid #334155;
          overflow: hidden;
          box-shadow: 0 8px 40px #00000080;
        }
        .slide {
          position: absolute;
          inset: 0;
          padding: 2.2rem 2.8rem;
          overflow-y: auto;
          transition: opacity 0.26s ease, transform 0.26s ease;
        }
        .slide.exit { opacity: 0; transform: translateY(-12px); }
        .progress-bar {
          position: absolute;
          bottom: 0; left: 0;
          height: 3px;
          background: linear-gradient(90deg, #38bdf8, #818cf8);
          transition: width 0.4s ease;
        }

        /* ── nav bar ── */
        .nav-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 1.5rem;
          background: #1e293b;
          border-top: 1px solid #334155;
          flex-shrink: 0;
        }
        .nav-btn {
          background: #334155;
          border: none;
          color: #e2e8f0;
          padding: 0.35rem 0.9rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.8rem;
        }
        .nav-btn:disabled { opacity: 0.3; cursor: default; }
        .nav-dots { display: flex; gap: 0.4rem; flex: 1; justify-content: center; }
        .nav-dot  { width: 8px; height: 8px; border-radius: 50%; background: #475569; cursor: pointer; transition: background 0.2s; }
        .nav-dot.active { background: #38bdf8; }
        .nav-hint { font-size: 0.65rem; color: #475569; }

        /* ── slide inner ── */
        .slide-inner { height: 100%; display: flex; flex-direction: column; }

        /* ── section slide ── */
        .section-slide { justify-content: center; }
        .section-number { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.12em; color: #38bdf8; text-transform: uppercase; margin-bottom: 0.6rem; }
        .section-title  { font-size: 2.2rem; font-weight: 800; line-height: 1.15; color: #f8fafc; }
        .section-divider-line { width: 3rem; height: 3px; background: #38bdf8; margin: 0.8rem 0; border-radius: 2px; }
        .section-sub { font-size: 0.9rem; color: #94a3b8; line-height: 1.5; }

        /* ── content slides ── */
        .slide-heading { font-size: 1.35rem; font-weight: 700; color: #f8fafc; margin-bottom: 0.3rem; }
        .heading-rule  { height: 2px; background: linear-gradient(90deg, #38bdf8 60%, transparent); border-radius: 1px; margin-bottom: 0.9rem; }

        /* ── equations ── */
        .eq-label { font-size: 0.7rem; color: #64748b; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.4rem; }
        .eq-box   { background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 0.6rem 1rem; margin-bottom: 0.6rem; text-align: center; }
        .eq-terms { display: flex; flex-wrap: wrap; gap: 0.3rem 1.2rem; margin-bottom: 0.8rem; }
        .eq-term  { font-size: 0.75rem; }
        .sym      { color: #38bdf8; font-weight: 700; font-style: italic; }
        .def      { color: #94a3b8; }

        /* ── bullets ── */
        .bullet-list { list-style: none; display: flex; flex-direction: column; gap: 0.45rem; }
        .bullet-item {
          display: flex; gap: 0.7rem; align-items: flex-start;
          opacity: 0; transform: translateX(-10px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .bullet-item.revealed { opacity: 1; transform: none; }
        .bullet-marker { color: #38bdf8; font-size: 0.55rem; margin-top: 0.35rem; flex-shrink: 0; }
        .bullet-text   { font-size: 0.82rem; line-height: 1.5; }
        .bullet-text strong { color: #f8fafc; display: block; font-size: 0.85rem; }
        .bullet-sub    { color: #94a3b8; font-size: 0.78rem; margin-top: 0.15rem; }

        /* ── two col ── */
        .two-col     { display: flex; gap: 0; flex: 1; }
        .col         { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .col-header  { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; color: #38bdf8; text-transform: uppercase; padding-bottom: 0.35rem; border-bottom: 1px solid #334155; margin-bottom: 0.2rem; }
        .col-divider { width: 1px; background: #334155; margin: 0 1.2rem; }
        .col-item    { font-size: 0.8rem; line-height: 1.5; color: #94a3b8; padding: 0.4rem 0; border-bottom: 1px solid #1e293b; opacity: 0; transform: translateY(6px); transition: opacity 0.3s, transform 0.3s; }
        .col-item.revealed { opacity: 1; transform: none; }
        .col-item strong { color: #e2e8f0; display: block; font-size: 0.82rem; margin-bottom: 0.15rem; }

        /* ── anim ── */
        .anim-in { animation: fadeUp 0.4s ease both; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: none; } }

        /* KaTeX */
        .katex { font-size: 1.1em !important; color: #e2e8f0; }
      `}</style>

      <div className="app">
        <div className="top-bar">
          <span className="course-id">{meta.courseId}</span>
          <div className="top-bar-divider" />
          <span className="deck-title">{meta.deckTitle}</span>
          <div className="top-bar-spacer" />
          <span className="slide-counter">{slideIdx + 1} / {slides.length}</span>
        </div>

        <div className="stage" onClick={handleStageClick}>
          <div className="slide-wrapper">
            <div className={`slide active${direction === 'exit' ? ' exit' : ''}`} key={animKey}>
              {renderSlide(current, animKey)}
            </div>
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="nav-bar">
          <button className="nav-btn" onClick={retreat} disabled={slideIdx === 0 && revealed === 0}>← Prev</button>
          <div className="nav-dots">
            {slides.map((_, i) => (
              <div key={i} className={`nav-dot${i === slideIdx ? ' active' : ''}`}
                onClick={(e) => { e.stopPropagation(); goTo(i) }} />
            ))}
          </div>
          <button className="nav-btn" onClick={advance} disabled={slideIdx === slides.length - 1 && revealed >= steps}>Next →</button>
          <span className="nav-hint">← → or click</span>
        </div>
      </div>
    </>
  )
}
