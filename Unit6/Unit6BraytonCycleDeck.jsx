import { useState, useEffect, useCallback } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
//  ME 3470 · Unit 6 — Ideal Brayton Cycle · P–v & T–s  (closed-cycle model)
//  Same navy/cyan presentation shell as the other Unit 6 decks.
//
//  NEW slide type: 'cycle'
//    • closed-loop schematic (Compressor · Heater · Turbine · Cooler) top-right,
//      four numbered stations, each component highlights in its process color.
//    • P–v and T–s diagrams with derived coordinates (air-standard Brayton).
//      Faint dashed isobars/isentropes sit behind the cycle lines and align
//      exactly with them (same closed-form curves).
//    • Step-through animation: each process draws on its own — P–v (1→2, 2→3,
//      3→4, 4→1) first, then T–s — and the matching component lights up.
//
//  save as  src/Unit6/Unit6BraytonCycleDeck.jsx   (App.jsx imports it beside)
// ─────────────────────────────────────────────────────────────────────────────

export const meta = {
  courseId:  'ME 3470',
  deckTitle: 'Ideal Brayton Cycle · P–v & T–s Diagrams',
}

// ── air-standard constants (cold-air-standard) ───────────────────────────────
const G = 1.4, R = 0.287, CP = 1.005, T1 = 300, T3 = 1300, P1 = 100

// process → color + component name.  index 0..3 = process 1-2,2-3,3-4,4-1
const PROC = [
  { c: '#5ec8d8', comp: 'Compressor',        proc: '1→2 · Isentropic compression' },
  { c: '#f0a93b', comp: 'Heat exch. (qₙ)', proc: '2→3 · Constant-p heat addition' },
  { c: '#5fd39a', comp: 'Turbine',           proc: '3→4 · Isentropic expansion' },
  { c: '#6db3f2', comp: 'Heat exch. (qₒ)', proc: '4→1 · Constant-p heat rejection' },
]

export const slides = [
  { type: 'cycle', rp: 8,  sectionNumber: 'Section 4',
    heading: 'Ideal Brayton Cycle · r_p = 8',
    intro: 'The turbojet is open-cycle, but modeling it as a <strong>closed cycle</strong> gives clean efficiency definitions. Four processes: isentropic compression, constant-p heat addition, isentropic expansion, constant-p heat rejection. Step through each one — the P–v curve draws, then the T–s curve, and the matching component lights up.' },
  { type: 'cycle', rp: 16, sectionNumber: 'Section 4',
    heading: 'Ideal Brayton Cycle · r_p = 16',
    intro: 'Same cycle, pressure ratio doubled to 16. Compression and expansion get steeper, state 2 moves to higher pressure and temperature, and the enclosed area (net work per unit mass) grows — thermal efficiency rises from 44.8% to 54.7% for the same turbine-inlet temperature.' },
  { type: 'gibbs', sectionNumber: 'Section 5 · 5.5',
    heading: 'What Does a Power Cycle Produce/Consume? · Gibbs Form of the 1st Law',
    intro: 'The Gibbs form of the first law separates heat and work by their own state-property relations: <strong>δq = Tds</strong> and <strong>δw = Pdv</strong>. That means the area under a T–s curve is heat, and the area under a P–v curve is work — the two diagrams we’ll lean on for the rest of the cycle analysis.' },
  { type: 'piston', sectionNumber: 'Section 5 · 5.6',
    heading: 'Visualizing Boundary Work · Piston–Cylinder Example',
    intro: 'A frictionless, reversible piston–cylinder with the <strong>gas as our system</strong>. Step 1: the gas is compressed at constant pressure, so it cools and rejects heat. Step 2: heat is added at constant pressure until the piston returns to its initial location — then the same idea repeats to close the loop on P–v and T–s diagrams.' },
  { type: 'loop23', sectionNumber: 'Section 5 · 5.7',
    heading: 'Closing the Loop · Process ②→③ (Heat Addition)',
    intro: 'From ①→②, the <strong>surroundings did work</strong> on our system and <strong>heat was removed</strong> from it. Now let\u2019s go from ②→③: heat is added at constant pressure until v returns to its state-① value.' },
  { type: 'friction', sectionNumber: 'Section 5 · 5.8',
    heading: 'Adding Irreversibility · Friction in the Piston',
    intro: 'Now put friction in the piston. Work required to reach state ② becomes <strong>PΔv + friction·Δx</strong> — more work than the frictionless case. Do the <em>same</em> amount of work instead, and you land at a different state ②′: same P, bigger v.' },
  { type: 'reflect', sectionNumber: 'Section 5 · 5.8',
    heading: 'Same End State, Different Path — Where Does "Net" Come From?',
    intro: 'Two paths between the same two states share the same ΔE (it is a state function). Send the system out along one path and back along the other and you have a closed loop: dE = 0 over the loop, so ∮TdS = ∮PdV. But a different return path changes <em>how</em> you get there — and that\u2019s exactly what lets a cycle produce something net.' },
  { type: 'realgas', sectionNumber: 'Section 5 · 5.9',
    heading: 'Real Gas-Turbine Cycles',
    intro: 'How do we quantify how efficient our components actually are? Compare the <strong>actual</strong> work done to the <strong>ideal (isentropic)</strong> work done. We want the turbine to <em>do</em> as much work as possible, and the compressor to <em>use</em> as little work as possible — and on a T–s diagram, generating <strong>more entropy than isentropic</strong> is a direct sign we\u2019re inefficiently using our available energy.' },
  { type: 'summary', sectionNumber: 'Section 5 · 5.11',
    heading: 'Summary of Power Cycles',
    intro: 'A way to model an open-flow power-generating process as a <strong>closed-loop control mass</strong>, wherein convenient relationships for heat and work emerge readily.' },
]

// ── thermodynamics: derive every coordinate from r_p ─────────────────────────
function states(rp) {
  const e = (G - 1) / G
  const P2 = P1 * rp, T2 = T1 * Math.pow(rp, e), T4 = T3 / Math.pow(rp, e)
  const s3 = CP * Math.log(T3 / T2)
  const v = (T, P) => R * T / P
  return {
    rp, P2, T2, T4, s3,
    P: [P1, P2, P2, P1], T: [T1, T2, T3, T4],
    s: [0, 0, s3, s3],
    v: [v(T1, P1), v(T2, P2), v(T3, P2), v(T4, P1)],
    eta: 1 - 1 / Math.pow(rp, e),
  }
}

// linear map builder for a 40×14 … 306×226 plot box inside a 320×260 viewBox
function mapper(xmin, xmax, ymin, ymax) {
  const x0 = 40, y0 = 14, w = 266, h = 212
  return {
    x0, y0, w, h,
    fx: (x) => x0 + (x - xmin) / (xmax - xmin) * w,
    fy: (y) => y0 + h - (y - ymin) / (ymax - ymin) * h,
  }
}
const toPath = (pts, m) =>
  pts.map((p, i) => `${i ? 'L' : 'M'}${m.fx(p[0]).toFixed(1)} ${m.fy(p[1]).toFixed(1)}`).join(' ')

// samplers
const isentPV = (K, va, vb, n = 40) =>            // P v^γ = K
  Array.from({ length: n + 1 }, (_, i) => { const v = va + (vb - va) * i / n; return [v, K / Math.pow(v, G)] })
const isobarTS = (Tref, sa, sb, n = 40) =>        // T = Tref e^{s/cp}
  Array.from({ length: n + 1 }, (_, i) => { const s = sa + (sb - sa) * i / n; return [s, Tref * Math.exp(s / CP)] })

// ── the figure: schematic + P–v + T–s ────────────────────────────────────────
function CycleFigure({ rp, revealed }) {
  const st = states(rp)
  const active = revealed === 0 ? -1 : (revealed - 1) % 4     // which component/color
  const onPV = revealed <= 4

  // ---- P–v geometry ----
  const vmax = Math.max(...st.v) * 1.08, pmax = st.P2 * 1.16
  const mp = mapper(0, vmax, 0, pmax)
  const K12 = P1 * Math.pow(st.v[0], G), K34 = st.P2 * Math.pow(st.v[2], G)
  const clipPV = (pts) => pts.filter(([, p]) => p <= pmax)
  const pvGuides = [
    { cls: 'gd', d: toPath([[0, P1], [vmax, P1]], mp) },                       // isobar P1
    { cls: 'gd', d: toPath([[0, st.P2], [vmax, st.P2]], mp) },                 // isobar P2
    { cls: 'gs', d: toPath(clipPV(isentPV(K12, vmax * .02, vmax)), mp) },      // isentrope thru 1-2
    { cls: 'gs', d: toPath(clipPV(isentPV(K34, vmax * .02, vmax)), mp) },      // isentrope thru 3-4
  ]
  const pvSeg = [
    isentPV(K12, st.v[0], st.v[1]),
    [[st.v[1], st.P2], [st.v[2], st.P2]],
    isentPV(K34, st.v[2], st.v[3]),
    [[st.v[3], P1], [st.v[0], P1]],
  ].map((pts) => toPath(pts, mp))
  const pvPts = st.v.map((v, i) => [mp.fx(v), mp.fy(st.P[i])])

  // ---- T–s geometry ----
  const smax = st.s3 * 1.2, tmax = T3 * 1.14
  const mt = mapper(0, smax, 0, tmax)
  const clipTS = (pts) => pts.filter(([, t]) => t <= tmax)
  const tsGuides = [
    { cls: 'gd', d: toPath(clipTS(isobarTS(T1, 0, smax)), mt) },   // low isobar
    { cls: 'gd', d: toPath(clipTS(isobarTS(st.T2, 0, smax)), mt) },// high isobar
    { cls: 'gs', d: toPath([[0, 0], [0, tmax]], mt) },             // isentrope s=0
    { cls: 'gs', d: toPath([[st.s3, 0], [st.s3, tmax]], mt) },     // isentrope s=s3
  ]
  const tsSeg = [
    [[0, T1], [0, st.T2]],
    isobarTS(st.T2, 0, st.s3),
    [[st.s3, T3], [st.s3, st.T4]],
    isobarTS(T1, st.s3, 0),
  ].map((pts) => toPath(pts, mt))
  const tsPts = st.s.map((s, i) => [mt.fx(s), mt.fy(st.T[i])])

  const pvOff = [[-2, 15], [-6, -6], [3, -7], [5, 15]]
  const tsOff = [[-6, 15], [-16, 4], [7, -5], [8, 14]]
  const n0 = Math.round

  const drawn = (base) =>                          // 0..3 processes visible in this diagram
    base === 0 ? Math.min(revealed, 4) : Math.max(0, Math.min(revealed - 4, 4))

  const renderDiagram = (kind) => {
    const isPV = kind === 'pv'
    const m = isPV ? mp : mt
    const guides = isPV ? pvGuides : tsGuides
    const segs = isPV ? pvSeg : tsSeg
    const pts = isPV ? pvPts : tsPts
    const off = isPV ? pvOff : tsOff
    const shown = drawn(isPV ? 0 : 4)
    const activeSeg = (!isPV === !onPV) ? active : -1
    return (
      <figure className="cyc-fig">
        <figcaption className="cyc-figc" style={{ color: (isPV === onPV && active >= 0) ? PROC[active].c : 'var(--muted)' }}>
          {isPV ? 'P–v diagram' : 'T–s diagram'}
        </figcaption>
        <svg viewBox="0 0 320 260" className="cyc-svg">
          {/* axes */}
          <line x1={m.x0} y1={m.y0} x2={m.x0} y2={m.y0 + m.h} className="ax" />
          <line x1={m.x0} y1={m.y0 + m.h} x2={m.x0 + m.w} y2={m.y0 + m.h} className="ax" />
          <text x={m.x0 - 6} y={m.y0 + 2} className="axttl" textAnchor="end">{isPV ? 'P' : 'T'}</text>
          <text x={m.x0 + m.w} y={m.y0 + m.h + 22} className="axttl" textAnchor="end">
            {isPV ? 'v (m³/kg)' : 's (kJ/kg·K)'}
          </text>
          <text x={m.x0 - 30} y={m.y0 + m.h / 2} className="axttl" textAnchor="middle"
            transform={`rotate(-90 ${m.x0 - 30} ${m.y0 + m.h / 2})`}>{isPV ? 'kPa' : 'K'}</text>

          {/* faint isobars / isentropes */}
          {guides.map((g, i) => <path key={i} className={g.cls} d={g.d} />)}

          {/* reference value labels */}
          {isPV ? <>
            <text x={m.x0 + 3} y={mp.fy(P1) - 3} className="reftxt">P₁={P1}</text>
            <text x={m.x0 + 3} y={mp.fy(st.P2) + 11} className="reftxt">P₂={n0(st.P2)}</text>
          </> : <>
            <text x={mt.fx(0) + 3} y={mt.fy(T3) - 3} className="reftxt">T₃={T3}</text>
            <text x={mt.fx(st.s3)} y={m.y0 + m.h + 12} className="reftxt" textAnchor="middle">s={st.s3.toFixed(2)}</text>
          </>}

          {/* process segments (draw one at a time) */}
          {segs.map((d, i) => i < shown && (
            <path key={`${kind}-${i}`} d={d} pathLength="1"
              className={`proc proc-draw${i === activeSeg ? ' proc-hot' : ''}`}
              style={{ stroke: PROC[i].c }} />
          ))}

          {/* state points */}
          {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.4" className="pt" />)}
          {pts.map(([x, y], i) => (
            <text key={i} x={x + off[i][0]} y={y + off[i][1]} className="ptxt">{i + 1}</text>
          ))}
        </svg>
      </figure>
    )
  }

  // ---- schematic (Compressor · Heater · Turbine · Cooler) ----
  const shape = (i) => ({
    fill: i === active ? PROC[i].c : 'var(--panel)',
    fillOpacity: i === active ? 0.2 : 1,
    stroke: i === active ? PROC[i].c : 'var(--muted)',
    strokeWidth: i === active ? 2.4 : 1.4,
  })
  const lab = (i) => ({ fill: i === active ? PROC[i].c : 'var(--ink)' })

  return (
    <div className="cyc-body">
      <p className="cyc-cap">
        {revealed === 0
          ? 'Click / → to step through each process.'
          : <><b style={{ color: PROC[active].c }}>{onPV ? 'P–v' : 'T–s'} · {PROC[active].proc}</b> — {PROC[active].comp}</>}
      </p>

      {/* process legend chips */}
      <div className="cyc-chips">
        {PROC.map((p, i) => (
          <span key={i} className={`chip${i === active ? ' chip-on' : ''}`}
            style={{ borderColor: p.c, background: i === active ? p.c + '22' : 'transparent' }}>
            <i style={{ background: p.c }} />{p.comp}
          </span>
        ))}
        <span className="chip-eta">η<sub>th</sub> = {(st.eta * 100).toFixed(1)}%</span>
      </div>

      <div className="cyc-grid">
        <div className="cyc-diagrams">
          {renderDiagram('pv')}
          {renderDiagram('ts')}
        </div>

        <div className="cyc-sch">
          <svg viewBox="0 0 280 224" className="cyc-svg">
            <defs>
              <marker id="ah" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0 0 L6 3 L0 6 z" fill="var(--muted)" />
              </marker>
            </defs>

            {/* pipes / loop */}
            <path className="pipe" d="M52 86 L52 59 L92 59" />
            <path className="pipe" d="M188 59 L228 59 L228 86" />
            <path className="pipe" d="M228 138 L228 165 L188 165" />
            <path className="pipe" d="M92 165 L52 165 L52 138" />

            {/* heat & work arrows */}
            <line x1="140" y1="20" x2="140" y2="43" className="pipe" markerEnd="url(#ah)" />
            <text x="140" y="15" className="sch-a" textAnchor="middle">qₙ</text>
            <line x1="140" y1="181" x2="140" y2="205" className="pipe" markerEnd="url(#ah)" />
            <text x="140" y="217" className="sch-a" textAnchor="middle">qₒ</text>
            <line x1="250" y1="112" x2="275" y2="112" className="pipe" markerEnd="url(#ah)" />
            <text x="278" y="108" className="sch-a" textAnchor="end">Wₙₑₜ</text>

            {/* heater (top) — process 2-3 */}
            <rect x="92" y="43" width="96" height="31" rx="4" style={shape(1)} />
            <text x="140" y="63" className="sch-l" textAnchor="middle" style={lab(1)}>Heat exch.</text>

            {/* cooler (bottom) — process 4-1 */}
            <rect x="92" y="150" width="96" height="31" rx="4" style={shape(3)} />
            <text x="140" y="170" className="sch-l" textAnchor="middle" style={lab(3)}>Heat exch.</text>

            {/* compressor (left) — process 1-2 */}
            <polygon points="30,138 74,138 62,86 42,86" style={shape(0)} />
            <text x="52" y="116" className="sch-l" textAnchor="middle" style={lab(0)}>Comp</text>

            {/* turbine (right) — process 3-4 */}
            <polygon points="218,86 238,86 250,138 206,138" style={shape(2)} />
            <text x="228" y="116" className="sch-l" textAnchor="middle" style={lab(2)}>Turb</text>

            {/* numbered stations */}
            {[[52, 152, 1], [52, 72, 2], [228, 72, 3], [228, 152, 4]].map(([x, y, n]) => (
              <g key={n}>
                <circle cx={x} cy={y} r="8.5" className="stn" />
                <text x={x} y={y + 3.4} className="stn-t" textAnchor="middle">{n}</text>
              </g>
            ))}
          </svg>
          <div className="cyc-sch-cap">Closed-cycle model</div>
        </div>
      </div>
    </div>
  )
}

// ── cycle slide renderer ─────────────────────────────────────────────────────
function CycleSlide({ slide, revealed }) {
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">{slide.sectionNumber}</div>
      <h2 className="slide-heading anim-in" dangerouslySetInnerHTML={{ __html: slide.heading.replace('r_p', 'r<sub>p</sub>') }} />
      <div className="heading-rule anim-in" />
      {slide.intro && (
        <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 10 }}
          dangerouslySetInnerHTML={{ __html: slide.intro }} />
      )}
      <CycleFigure rp={slide.rp} revealed={revealed} />
    </div>
  )
}

// ── Gibbs-form slide (δq=Tds, δw=Pdv, isentropic ⇒ adiabatic, cyclic dE=0) ───
function GibbsSlide({ revealed }) {
  const on = revealed >= 1
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">Section 5 · 5.5</div>
      <h2 className="slide-heading anim-in">What Does a Power Cycle Produce/Consume? · Gibbs Form of the 1<sup>st</sup> Law</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 10 }}>
        The Gibbs form of the first law separates heat and work by their own state-property relations:{' '}
        <strong>δq = Tds</strong> and <strong>δw = Pdv</strong>. The area under a T–s curve is heat;
        the area under a P–v curve is work.
      </p>

      <p className="cyc-cap">
        {on
          ? <><b style={{ color: 'var(--accent)' }}>Answer</b> — the shaded area under each curve is exactly the integral shown below it: heat for T–s, work for P–v.</>
          : 'Click / → to reveal what each shaded area means.'}
      </p>

      <div className="gibbs-grid">
        <div className="gibbs-card">
          <div className="gibbs-card-h">Heat · T–s diagram</div>
          <svg viewBox="0 0 200 150" className="gibbs-svg">
            <line x1="30" y1="12" x2="30" y2="128" className="ax" />
            <line x1="30" y1="128" x2="182" y2="128" className="ax" />
            <text x="24" y="16" className="axttl" textAnchor="end">T</text>
            <text x="184" y="140" className="axttl" textAnchor="end">s</text>
            <path d="M42,26 Q95,58 150,104 L150,128 L42,128 Z" className={`shade${on ? ' shade-on' : ''}`} />
            <path d="M42,26 Q95,58 150,104" className="proc" style={{ stroke: 'var(--accent)' }} />
            <circle cx="42" cy="26" r="3.4" className="pt" /><text x="46" y="20" className="ptxt">①</text>
            <circle cx="150" cy="104" r="3.4" className="pt" /><text x="154" y="118" className="ptxt">②</text>
          </svg>
          <div className="gibbs-eq">Q = ∫Tds &nbsp; (or&nbsp; q = ∫Tds)</div>
          <div className="gibbs-q">Does the area under the curve mean positive heat in, or negative heat out?</div>
        </div>

        <div className="gibbs-card">
          <div className="gibbs-card-h">Isentropic ⇒ adiabatic</div>
          <svg viewBox="0 0 200 150" className="gibbs-svg">
            <line x1="30" y1="12" x2="30" y2="128" className="ax" />
            <line x1="30" y1="128" x2="182" y2="128" className="ax" />
            <text x="24" y="16" className="axttl" textAnchor="end">T</text>
            <text x="184" y="140" className="axttl" textAnchor="end">s</text>
            <line x1="96" y1="24" x2="96" y2="112" className="proc" style={{ stroke: 'var(--accent-2)' }} />
            <circle cx="96" cy="24" r="3.4" className="pt" /><text x="100" y="20" className="ptxt">①</text>
            <circle cx="96" cy="112" r="3.4" className="pt" /><text x="100" y="126" className="ptxt">②</text>
          </svg>
          <div className="gibbs-eq">∫₁²Tds = 0 ∴ isentropic</div>
          <div className={`gibbs-callout${on ? ' gibbs-callout-on' : ''}`}>An isentropic process <u>cannot</u> involve heat transfer — it must be adiabatic.</div>
        </div>

        <div className="gibbs-card">
          <div className="gibbs-card-h">Work · P–v diagram</div>
          <svg viewBox="0 0 200 150" className="gibbs-svg">
            <line x1="30" y1="12" x2="30" y2="128" className="ax" />
            <line x1="30" y1="128" x2="182" y2="128" className="ax" />
            <text x="24" y="16" className="axttl" textAnchor="end">P</text>
            <text x="184" y="140" className="axttl" textAnchor="end">v</text>
            <path d="M42,30 Q95,40 150,66 L150,128 L42,128 Z" className={`shade${on ? ' shade-on' : ''}`} />
            <path d="M42,30 Q95,40 150,66" className="proc" style={{ stroke: 'var(--accent)' }} />
            <circle cx="42" cy="30" r="3.4" className="pt" /><text x="46" y="24" className="ptxt">①</text>
            <circle cx="150" cy="66" r="3.4" className="pt" /><text x="154" y="80" className="ptxt">②</text>
          </svg>
          <div className="gibbs-eq">W = ∫Pdv</div>
          <div className="gibbs-q">Does the area mean work done <i>by</i> the system, or work done <i>on</i> the system?</div>
        </div>
      </div>

      <div className="gibbs-footer">
        <div className="gibbs-footer-row"><b>Polytropic process:</b> Pv<sup>n</sup> = C &nbsp; (n and C are constants)</div>
        <div className="gibbs-footer-row">
          Modeling the Brayton cycle as a <b>closed system</b>: the property relation dE = TdS − Pdv holds at
          every step, and for a closed system undergoing a cycle the initial and final states are <u>identical</u>.
          So over one complete cycle <b>∮dE = 0 ⇒ ∮TdS = ∮PdV</b> (dE ≡ internal energy change; state variables
          are path-independent, so E returns to its starting value).
        </div>
        <div className="gibbs-footer-row gibbs-footer-warn">
          However — <b>Q and W do not have to be zero.</b> They are path-dependent.
        </div>
      </div>
    </div>
  )
}

// ── Piston–cylinder boundary-work example slide ─────────────────────────────
function PistonSlide({ revealed }) {
  const on = revealed >= 1
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">Section 5 · 5.6</div>
      <h2 className="slide-heading anim-in">Visualizing Boundary Work · Piston–Cylinder Example</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 10 }}>
        A frictionless, reversible piston–cylinder — our <strong>system is the gas</strong> in the cylinder.
        Step 1: the gas is compressed at constant pressure, so it cools and rejects heat. Step 2: heat is added at
        constant pressure until the piston returns to its initial location. Steps 3–4 repeat the idea to close the
        loop on P–v and T–s diagrams.
      </p>

            <div className="pist-strip">
        <svg viewBox="0 0 640 150" className="pist-svg">
          {/* state 1: large volume, weight applied, heat leaves during 1→2 compression */}
          <g>
            <rect x="20" y="20" width="70" height="90" rx="3" className="pist-cyl" />
            <rect x="30" y="44" width="50" height="60" className="pist-gas" />
            <rect x="26" y="36" width="58" height="10" className="pist-head" />
            <line x1="55" y1="16" x2="55" y2="34" className="pipe" markerEnd="url(#ah2)" />
            <text x="55" y="12" className="sch-a" textAnchor="middle">P, mg</text>
            <text x="90" y="112" className="sch-a">q<tspan baselineShift="sub">out</tspan></text>
            <circle cx="55" cy="128" r="8" className="stn" /><text x="55" y="131.5" className="stn-t" textAnchor="middle">1</text>
          </g>
          <text x="150" y="68" className="pist-arrow" textAnchor="middle">→</text>

          {/* state 2: compressed (small volume); heat enters during 2→3 */}
          <g transform="translate(230,0)">
            <rect x="20" y="20" width="70" height="90" rx="3" className="pist-cyl" />
            <rect x="30" y="74" width="50" height="30" className="pist-gas" />
            <rect x="26" y="66" width="58" height="10" className="pist-head" />
            <text x="90" y="86" className="sch-a">q<tspan baselineShift="sub">in</tspan></text>
            <circle cx="55" cy="128" r="8" className="stn" /><text x="55" y="131.5" className="stn-t" textAnchor="middle">2</text>
          </g>
          <text x="380" y="68" className="pist-arrow" textAnchor="middle">→</text>

          {/* states 3–4: continue the loop */}
          <g transform="translate(460,0)">
            <rect x="20" y="20" width="70" height="90" rx="3" className="pist-cyl pist-ghost" />
            <rect x="30" y="30" width="50" height="74" className="pist-gas pist-ghost" />
            <circle cx="55" cy="128" r="8" className="stn stn-ghost" /><text x="55" y="131.5" className="stn-t" textAnchor="middle">3</text>
          </g>
          <text x="540" y="68" className="pist-arrow" textAnchor="middle">→</text>
          <g transform="translate(560,0)">
            <rect x="20" y="20" width="70" height="90" rx="3" className="pist-cyl pist-ghost" />
            <rect x="30" y="55" width="50" height="49" className="pist-gas pist-ghost" />
            <circle cx="55" cy="128" r="8" className="stn stn-ghost" /><text x="55" y="131.5" className="stn-t" textAnchor="middle">4</text>
          </g>
          <defs>
            <marker id="ah2" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto">
              <path d="M0 8 L4 0 L8 8 z" fill="var(--muted)" />
            </marker>
          </defs>
        </svg>
        <div className="cyc-sch-cap">Our system is the gas in the cylinder — 1→2 compress at constant P, 2→3 & 3→4 close the loop on P–v / T–s</div>
      </div>

      <div className="gibbs-footer" style={{ marginTop: 12 }}>
        <div className="gibbs-footer-row">
          Sign convention: boundary work Pdv is <b>(+)</b> when done <u>by</u> the system on the surroundings, and
          <b> (−)</b> when done <u>on</u> the system by the surroundings &nbsp; — &nbsp; <b>dE = TdS − Pdv</b>
        </div>
      </div>

      <p className="cyc-cap" style={{ marginTop: 10 }}>
        {on
          ? <><b style={{ color: 'var(--accent)' }}>Step 1</b> — P stays constant while v shrinks (1→2); on the T–s diagram T and s both drop as heat leaves — one constant-pressure compression, two diagrams.</>
          : <><b>What happens in Step 1?</b> Click / → to see it on both diagrams.</>}
      </p>

      <div className="gibbs-grid gibbs-grid-2">
        <div className="gibbs-card">
          <div className="gibbs-card-h">P–v diagram</div>
          <svg viewBox="0 0 200 150" className="gibbs-svg">
            <line x1="30" y1="12" x2="30" y2="128" className="ax" />
            <line x1="30" y1="128" x2="182" y2="128" className="ax" />
            <text x="24" y="16" className="axttl" textAnchor="end">P</text>
            <text x="184" y="140" className="axttl" textAnchor="end">v</text>
            <path d="M64,50 L150,50 L150,128 L64,128 Z" className={`shade${on ? ' shade-on' : ''}`} />
            <line x1="64" y1="50" x2="150" y2="50" className="proc" style={{ stroke: 'var(--accent-2)' }} />
            <circle cx="150" cy="50" r="3.4" className="pt" /><text x="154" y="46" className="ptxt">①</text>
            <circle cx="64" cy="50" r="3.4" className="pt" /><text x="52" y="46" className="ptxt">②</text>
          </svg>
          <div className="gibbs-q">P stays const. · v goes smaller</div>
        </div>
        <div className="gibbs-card">
          <div className="gibbs-card-h">T–s diagram</div>
          <svg viewBox="0 0 200 150" className="gibbs-svg">
            <line x1="30" y1="12" x2="30" y2="128" className="ax" />
            <line x1="30" y1="128" x2="182" y2="128" className="ax" />
            <text x="24" y="16" className="axttl" textAnchor="end">T</text>
            <text x="184" y="140" className="axttl" textAnchor="end">s</text>
            <path d="M64,95 Q107,66 150,40 L150,128 L64,128 Z" className={`shade${on ? ' shade-on' : ''}`} />
            <path d="M64,95 Q107,66 150,40" fill="none" className="proc" style={{ stroke: 'var(--accent-2)' }} />
            <circle cx="150" cy="40" r="3.4" className="pt" /><text x="154" y="36" className="ptxt">①</text>
            <circle cx="64" cy="95" r="3.4" className="pt" /><text x="52" y="99" className="ptxt">②</text>
          </svg>
          <div className="gibbs-q">T drops · s gets smaller (heat leaves)</div>
        </div>
      </div>

      <div className="gibbs-footer">
        <div className="gibbs-footer-row">
          w<sub>by sys</sub> = ∫₁²Pdv = <b>PΔv</b> &nbsp;(P constant) &nbsp;⇒&nbsp; Δv &lt; 0, so work is done <u>on</u> the system
        </div>
        <div className="gibbs-footer-row">
          q = ∫₁²Tds = <b>c<sub>p</sub>ΔT</b> &nbsp;(constant-p heat) &nbsp;⇒&nbsp; ΔT &lt; 0, so heat is <u>rejected</u> from the system
        </div>
      </div>
    </div>
  )
}

// ── Loop23 slide (process ②→③: heat addition at constant P, closes dE=0) ────
function Loop23Slide({ revealed }) {
  const on = revealed >= 1
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">Section 5 · 5.7</div>
      <h2 className="slide-heading anim-in">Closing the Loop · Process ②→③ (Heat Addition)</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 10 }}>
        From ①→②, the <strong>surroundings did work</strong> on our system and <strong>heat was removed</strong> from
        it. Now let's go from ②→③: heat is added at constant pressure until v returns to its state-① value.
      </p>

      <div className="gibbs-grid gibbs-grid-2">
        <div className="gibbs-card">
          <div className="gibbs-card-h">P–v diagram</div>
          <svg viewBox="0 0 200 150" className="gibbs-svg">
            <line x1="30" y1="12" x2="30" y2="128" className="ax" />
            <line x1="30" y1="128" x2="182" y2="128" className="ax" />
            <text x="24" y="16" className="axttl" textAnchor="end">P</text>
            <text x="184" y="140" className="axttl" textAnchor="end">v</text>
            <path d="M64,50 L150,50 L150,128 L64,128 Z" className={`shade${on ? ' shade-on' : ''}`} />
            <line x1="64" y1="50" x2="150" y2="50" className="proc" style={{ stroke: 'var(--accent)' }} />
            <circle cx="64" cy="50" r="3.4" className="pt" /><text x="52" y="46" className="ptxt">②</text>
            <circle cx="150" cy="50" r="3.4" className="pt" /><text x="154" y="46" className="ptxt">③</text>
          </svg>
          <div className="gibbs-q">P stays const. · v increases</div>
        </div>
        <div className="gibbs-card">
          <div className="gibbs-card-h">T–s diagram</div>
          <svg viewBox="0 0 200 150" className="gibbs-svg">
            <line x1="30" y1="12" x2="30" y2="128" className="ax" />
            <line x1="30" y1="128" x2="182" y2="128" className="ax" />
            <text x="24" y="16" className="axttl" textAnchor="end">T</text>
            <text x="184" y="140" className="axttl" textAnchor="end">s</text>
            <path d="M64,95 Q107,66 150,40 L150,128 L64,128 Z" className={`shade${on ? ' shade-on' : ''}`} />
            <path d="M64,95 Q107,66 150,40" fill="none" className="proc" style={{ stroke: 'var(--accent)' }} />
            <circle cx="64" cy="95" r="3.4" className="pt" /><text x="52" y="99" className="ptxt">②</text>
            <circle cx="150" cy="40" r="3.4" className="pt" /><text x="154" y="36" className="ptxt">③</text>
          </svg>
          <div className="gibbs-q">T rises · entropy increases</div>
        </div>
      </div>

      <div className="gibbs-footer">
        <div className="gibbs-footer-row">
          w<sub>by sys</sub> = ∫₂³Pdv = <b>PΔv</b> &nbsp;&nbsp;&nbsp; q<sub>into sys</sub> = ∫₂³Tds = <b>c<sub>p</sub>ΔT</b> &nbsp;(T rises, so it stays inside the integral)
        </div>
      </div>

      <p className="cyc-cap" style={{ marginTop: 10 }}>
        {on
          ? <><b style={{ color: 'var(--accent)' }}>We're back where we started</b> — state ③ ends up with exactly the
             same P, v, T, and s as state ①.</>
          : <><b>What happens when the loop closes?</b> Click / → to see it.</>}
      </p>

      <div className="gibbs-footer" style={{ transition: '.25s', borderColor: on ? 'var(--accent-2)' : 'var(--rule)' }}>
        <div className="gibbs-footer-row">
          State ③ = State ① &nbsp;⇒&nbsp; <b>∮dE = 0</b> &nbsp;⇒&nbsp; <b style={{ color: 'var(--accent-2)' }}>∮TdS = ∮PdV over the loop</b>
        </div>
        <div className="gibbs-footer-row" style={{ display: 'flex', gap: 40 }}>
          <span>↑ heat exchanged</span><span>↑ work done</span>
        </div>
      </div>
    </div>
  )
}

// ── Friction slide (irreversibility: more work in, less area out) ──────────
function FrictionSlide({ revealed }) {
  const on = revealed >= 1
  const loopPath = (dx) =>
    `M${64 + dx},50 L${150 + dx},50 L${150 + dx},70 L${100 + dx},96 L${64 + dx},70 Z`
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">Section 5 · 5.8</div>
      <h2 className="slide-heading anim-in">Adding Irreversibility · Friction in the Piston</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 10 }}>
        Now put friction in the piston. Work required to reach state ② becomes <strong>PΔv + friction·Δx</strong> —
        more work than the frictionless case. Do the <em>same</em> amount of work instead, and you land at a
        different state ②′: same P, bigger v.
      </p>

      <div className="gibbs-grid gibbs-grid-2">
        <div className="gibbs-card">
          <div className="gibbs-card-h">P–v diagram · compare @ same states</div>
          <svg viewBox="0 0 200 150" className="gibbs-svg">
            <line x1="30" y1="12" x2="30" y2="128" className="ax" />
            <line x1="30" y1="128" x2="182" y2="128" className="ax" />
            <text x="24" y="16" className="axttl" textAnchor="end">P</text>
            <text x="184" y="140" className="axttl" textAnchor="end">v</text>
            <path d={loopPath(0)} fill="var(--accent)" opacity={on ? 0.14 : 0.06} />
            <path d={loopPath(0)} fill="none" stroke="var(--accent)" strokeWidth="2" opacity={0.9} />
            <circle cx="64" cy="50" r="3.4" className="pt" /><text x="52" y="46" className="ptxt">①</text>
            <circle cx="150" cy="50" r="3.4" className="pt" /><text x="154" y="46" className="ptxt">②</text>
            {on && <>
              <circle cx="100" cy="96" r="3.4" className="pt" style={{ fill: 'var(--bad)' }} />
              <text x="100" y="112" className="ptxt" style={{ fill: 'var(--bad)' }} textAnchor="middle">②′</text>
              <text x="30" y="8" className="reftxt" style={{ fill: 'var(--bad)' }}>friction: work <tspan fill="var(--accent)">in</tspan> &gt; work out</text>
            </>}
          </svg>
          <div className="gibbs-q">More area (friction path) = more work done <b>on</b> the system</div>
        </div>
        <div className="gibbs-card">
          <div className="gibbs-card-h">T–s diagram · compare @ same states</div>
          <svg viewBox="0 0 200 150" className="gibbs-svg">
            <line x1="30" y1="12" x2="30" y2="128" className="ax" />
            <line x1="30" y1="128" x2="182" y2="128" className="ax" />
            <text x="24" y="16" className="axttl" textAnchor="end">T</text>
            <text x="184" y="140" className="axttl" textAnchor="end">s</text>
            <path d={loopPath(0)} fill="var(--accent-2)" opacity={on ? 0.14 : 0.06} />
            <path d={loopPath(0)} fill="none" stroke="var(--accent-2)" strokeWidth="2" opacity={0.9} />
            <circle cx="64" cy="50" r="3.4" className="pt" /><text x="52" y="46" className="ptxt">②</text>
            <circle cx="150" cy="50" r="3.4" className="pt" /><text x="154" y="46" className="ptxt">①</text>
            {on && <>
              <circle cx="100" cy="96" r="3.4" className="pt" style={{ fill: 'var(--bad)' }} />
              <text x="100" y="112" className="ptxt" style={{ fill: 'var(--bad)' }} textAnchor="middle">③</text>
              <text x="30" y="8" className="reftxt" style={{ fill: 'var(--bad)' }}>friction: heat out &gt; heat in</text>
            </>}
          </svg>
          <div className="gibbs-q">More area (friction path) = more heat removed from the system</div>
        </div>
      </div>

      <p className="cyc-cap" style={{ marginTop: 10 }}>
        {on
          ? <><b style={{ color: 'var(--bad)' }}>Net effect</b> — friction eats into both totals.</>
          : <><b>What does friction do to the totals?</b> Click / → to reveal.</>}
      </p>

      <div className="gibbs-footer" style={{ borderColor: on ? 'var(--bad)' : 'var(--rule)' }}>
        <div className="gibbs-footer-row">
          w<sub>net</sub> = w<sub>out</sub> − w<sub>in</sub> = PΔv − (PΔv + F·Δx) = <b>−F·Δx &lt; 0</b> &nbsp;⇒&nbsp; the
          surroundings put <b>more</b> work into the system than they get back
        </div>
        <div className="gibbs-footer-row">
          over the round trip ΔE = 0, so q<sub>net</sub> = w<sub>net</sub> = <b>−F·Δx &lt; 0</b> &nbsp;⇒&nbsp; <b>more
          heat is rejected</b> than added — the friction work is dissipated as heat
        </div>
      </div>
    </div>
  )
}

// ── Reflect slide (same end-state, different path ⇒ net work/heat) ─────────
function ReflectSlide({ revealed }) {
  const on = revealed >= 1
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">Section 5 · 5.8</div>
      <h2 className="slide-heading anim-in">Same End State, Different Path — Where Does "Net" Come From?</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 10 }}>
        Two paths between the same two states share the same ΔE (it is a state function). Send the system out
        along one path and back along the other and you have a closed loop: dE = 0 over the loop, so
        ∮TdS = ∮PdV. But a different return path changes <em>how</em> you get there — and that's exactly what lets
        a cycle produce something net.
      </p>

      <div className="gibbs-footer">
        <div className="gibbs-footer-row">
          <b>Why more Q is needed:</b> while you add heat, the gas is expanding against friction, so you need more Q
          to reach the same final state ③ — and you also do more work on the surroundings along the way.
        </div>
      </div>

      <p className="cyc-cap" style={{ marginTop: 10 }}>
        {on
          ? <><b style={{ color: 'var(--accent)' }}>Hm…</b> for a full cycle, Q<sub>net,in</sub> = W<sub>net,out</sub> once
             you land back on the state you started from. The path is what allows there to be net something — even a
             perfectly reversible cycle gets net work, it's just that the entropy increase comes from reversible
             heating instead of friction.</>
          : <><b>So where does the "net" actually come from?</b> Click / → to reveal.</>}
      </p>

      <div className="gibbs-grid gibbs-grid-2">
        <div className="gibbs-card">
          <div className="gibbs-card-h">P–v diagram</div>
          <svg viewBox="0 0 200 150" className="gibbs-svg">
            <line x1="30" y1="12" x2="30" y2="128" className="ax" />
            <line x1="30" y1="128" x2="182" y2="128" className="ax" />
            <text x="24" y="16" className="axttl" textAnchor="end">P</text>
            <text x="184" y="140" className="axttl" textAnchor="end">v</text>
            <path d="M60,105 C80,55 130,50 155,60 C130,90 95,100 60,105 Z"
              className={`shade${on ? ' shade-on' : ''}`} />
            <path d="M60,105 C80,55 130,50 155,60" className="proc" style={{ stroke: 'var(--accent)' }} />
            <path d="M155,60 C130,90 95,100 60,105" className="proc" style={{ stroke: 'var(--accent-2)' }} />
          </svg>
          <div className="gibbs-q">{on ? 'Shaded area = net work out per cycle' : 'Two paths, same endpoints'}</div>
        </div>
        <div className="gibbs-card">
          <div className="gibbs-card-h">T–s diagram</div>
          <svg viewBox="0 0 200 150" className="gibbs-svg">
            <line x1="30" y1="12" x2="30" y2="128" className="ax" />
            <line x1="30" y1="128" x2="182" y2="128" className="ax" />
            <text x="24" y="16" className="axttl" textAnchor="end">T</text>
            <text x="184" y="140" className="axttl" textAnchor="end">s</text>
            <path d="M60,105 C80,55 130,50 155,60 C130,90 95,100 60,105 Z"
              className={`shade${on ? ' shade-on' : ''}`} />
            <path d="M60,105 C80,55 130,50 155,60" className="proc" style={{ stroke: 'var(--accent)' }} />
            <path d="M155,60 C130,90 95,100 60,105" className="proc" style={{ stroke: 'var(--accent-2)' }} />
          </svg>
          <div className="gibbs-q">{on ? 'Shaded area = net heat in per cycle' : 'Two paths, same endpoints'}</div>
        </div>
      </div>
    </div>
  )
}

// ── Real gas-turbine cycle slide (isentropic efficiency, entropy generation) ─
function RealGasSlide({ revealed }) {
  const on = revealed >= 1
  const RED = 'var(--bad)'

  // hand-placed T–s points (qualitative, matches the sketch) — viewBox 0 0 320 240
  const P = {
    1:  { x: 62,  y: 200 },
    '2s': { x: 62,  y: 108 },
    '2a': { x: 92,  y: 96  },
    '3s': { x: 152, y: 30  },
    '3a': { x: 168, y: 60  },
    '4a': { x: 182, y: 118 },
    '4s': { x: 166, y: 140 },
  }
  const dot = (k) => <circle key={k} cx={P[k].x} cy={P[k].y} r="3.4" className="pt" />

  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">Section 5 · 5.9</div>
      <h2 className="slide-heading anim-in">Real Gas-Turbine Cycles</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 10 }}>
        How do we quantify how efficient our components actually are? Compare the <strong>actual</strong> work done
        to the <strong>ideal (isentropic)</strong> work done. We want the turbine to <em>do</em> as much work as
        possible, and the compressor to <em>use</em> as little work as possible — and on a T–s diagram, generating{' '}
        <strong>more entropy than isentropic</strong> is a sign we're inefficiently using our available energy.
      </p>

      <p className="cyc-cap">
        {on
          ? <><b style={{ color: 'var(--accent-2)' }}>Real cycle</b> — solid path; dashed path is the isentropic
             (ideal) reference at each leg.</>
          : <b>Click / → to compare the real cycle against the isentropic reference.</b>}
      </p>

      <div className="gibbs-grid gibbs-grid-2">
        <div className="gibbs-card" style={{ gridColumn: '1 / -1', maxWidth: 460, margin: '0 auto' }}>
          <div className="gibbs-card-h">T–s diagram · real vs. isentropic</div>
          <svg viewBox="0 0 320 240" className="gibbs-svg" style={{ maxHeight: '34vh' }}>
            <line x1="34" y1="10" x2="34" y2="212" className="ax" />
            <line x1="34" y1="212" x2="300" y2="212" className="ax" />
            <text x="28" y="14" className="axttl" textAnchor="end">T</text>
            <text x="302" y="224" className="axttl" textAnchor="end">s</text>

            {/* isentropic (ideal) reference — dashed */}
            <path d={`M${P[1].x},${P[1].y} L${P['2s'].x},${P['2s'].y}`} className="proc" strokeDasharray="5 4" style={{ stroke: 'var(--muted)' }} />
            <path d={`M${P['2s'].x},${P['2s'].y} Q104,${P['2s'].y - 8} ${P['3s'].x},${P['3s'].y}`} className="proc" strokeDasharray="5 4" style={{ stroke: 'var(--muted)' }} />
            <path d={`M${P['3s'].x},${P['3s'].y} L${P['4s'].x},${P['4s'].y}`} className="proc" strokeDasharray="5 4" style={{ stroke: 'var(--muted)' }} />
            <path d={`M${P['4s'].x},${P['4s'].y} Q116,190 ${P[1].x},${P[1].y}`} className="proc" strokeDasharray="5 4" style={{ stroke: 'var(--muted)' }} />

            {/* actual cycle — solid, colored, drawn on reveal */}
            <path d={`M${P[1].x},${P[1].y} Q78,152 ${P['2a'].x},${P['2a'].y}`} className={`proc${on ? ' proc-draw' : ''}`} pathLength="1" style={{ stroke: '#5ec8d8' }} />
            <path d={`M${P['2a'].x},${P['2a'].y} Q126,68 ${P['3a'].x},${P['3a'].y}`} className={`proc${on ? ' proc-draw' : ''}`} pathLength="1" style={{ stroke: 'var(--accent-2)' }} />
            <path d={`M${P['3a'].x},${P['3a'].y} Q186,86 ${P['4a'].x},${P['4a'].y}`} className={`proc${on ? ' proc-draw' : ''}`} pathLength="1" style={{ stroke: '#5fd39a' }} />
            <path d={`M${P['4a'].x},${P['4a'].y} Q134,182 ${P[1].x},${P[1].y}`} className={`proc${on ? ' proc-draw' : ''}`} pathLength="1" style={{ stroke: '#6db3f2' }} />

            {/* state points */}
            {dot(1)}{dot('2s')}{dot('2a')}{dot('3s')}{dot('3a')}{dot('4a')}{dot('4s')}
            <text x={P[1].x - 4} y={P[1].y + 16} className="ptxt" textAnchor="middle">1</text>
            <text x={P['2s'].x - 14} y={P['2s'].y + 3} className="ptxt">2s</text>
            <text x={P['2a'].x + 5} y={P['2a'].y - 5} className="ptxt">2a</text>
            <text x={P['3s'].x - 4} y={P['3s'].y - 6} className="ptxt">3s</text>
            <text x={P['3a'].x + 6} y={P['3a'].y + 2} className="ptxt">3a</text>
            <text x={P['4a'].x + 6} y={P['4a'].y + 4} className="ptxt">4a</text>
            <text x={P['4s'].x - 4} y={P['4s'].y + 16} className="ptxt">4s</text>

            {on && <>
              <text x={70} y={158} className="reftxt" style={{ fill: RED }}>entropy increases 1→2</text>
              <text x={188} y={100} className="reftxt" style={{ fill: RED }}>entropy increases 3→4</text>
              <text x={162} y={44} className="reftxt" style={{ fill: 'var(--accent-2)' }}>2→3: doesn't reach as high a T</text>
            </>}
          </svg>
        </div>
      </div>

      <div className="gibbs-grid gibbs-grid-2" style={{ marginTop: 4 }}>
        <div className="gibbs-card">
          <div className="gibbs-card-h" style={{ color: RED }}>Observations of the real cycle</div>
          <div className="gibbs-q" style={{ color: on ? 'var(--ink)' : 'var(--muted)' }}>
            • Doesn't reach as high a temp for 2→3<br />
            • Overall = less heat in
          </div>
        </div>
        <div className="gibbs-card">
          <div className="gibbs-card-h">What the real cycle looks like</div>
          <div className="gibbs-q" style={{ color: on ? 'var(--ink)' : 'var(--muted)' }}>
            • Entropy increases 1→2, and again 3→4<br />
            • Heat rejected is more (4→1)
          </div>
        </div>
      </div>

      <div className="gibbs-footer" style={{ marginTop: 10 }}>
        <div className="gibbs-footer-row">
          <b>Isentropic efficiencies:</b> η<sub>C</sub> = w<sub>s</sub>/w<sub>a</sub> (compressor, ideal-over-actual —
          we want to <i>use</i> less) &nbsp;&nbsp; η<sub>T</sub> = w<sub>a</sub>/w<sub>s</sub> (turbine,
          actual-over-ideal — we want to <i>get</i> more).
        </div>
        <div className="gibbs-footer-row gibbs-footer-warn">
          We drop to a lower isobar during 2→3 (heat addition), meaning we lose pressure ⇒ <b>less available work</b>.
          We also lose pressure when we reject heat.
        </div>
      </div>
    </div>
  )
}

// ── Summary slide (wrap-up of power-cycle fundamentals, 5.11) ───────────────
function SummarySlide() {
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">Section 5 · 5.11</div>
      <h2 className="slide-heading anim-in">Summary of Power Cycles</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 10 }}>
        A way to model an <strong>open-flow power-generating process</strong> as a closed-loop control mass —
        wherein convenient relationships for heat and work emerge readily.
      </p>

      <div className="gibbs-grid gibbs-grid-2">
        <div className="gibbs-card">
          <div className="gibbs-card-h">1<sup>st</sup> Law · closed system</div>
          <div className="gibbs-eq">TdS − Pdv = dE</div>
          <div className="gibbs-q">
            Cycle begins &amp; ends @ the <b>same state</b> &nbsp;⇒&nbsp; ∮dE = 0 &nbsp;⇒&nbsp; <b>∮TdS = ∮PdV</b>
          </div>
          <div className="gibbs-callout gibbs-callout-on" style={{ marginTop: 8 }}>
            Work done <u>by</u> the system is (+) &nbsp;·&nbsp; heat added <u>to</u> the system is (+)
          </div>
        </div>

        <div className="gibbs-card">
          <div className="gibbs-card-h">Two-state cycles</div>
          <svg viewBox="0 0 220 120" className="gibbs-svg">
            <defs>
              <marker id="loopArrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                <path d="M0 0 L6 3 L0 6 z" fill="var(--muted)" />
              </marker>
            </defs>
            <line x1="18" y1="8" x2="18" y2="96" className="ax" />
            <line x1="18" y1="96" x2="204" y2="96" className="ax" />
            <text x="12" y="12" className="axttl" textAnchor="end">P</text>
            <text x="206" y="108" className="axttl" textAnchor="end">v</text>

            {/* zero net work — degenerate (retraced) loop */}
            <path d="M46,80 L46,40" className="proc" style={{ stroke: 'var(--muted)' }}
              markerEnd="url(#loopArrow)" markerStart="url(#loopArrow)" />
            <text x="46" y="112" className="ptxt" textAnchor="middle" style={{ fontSize: 11 }}>zero</text>

            {/* (−) net work — counter-clockwise loop */}
            <ellipse cx="110" cy="58" rx="20" ry="16" fill="none" className="proc" style={{ stroke: '#e2685c' }} />
            <path d="M110,42 L103,43" className="proc" style={{ stroke: '#e2685c' }} markerEnd="url(#loopArrow)" />
            <text x="110" y="112" className="ptxt" textAnchor="middle" style={{ fontSize: 11 }}>(−)</text>

            {/* (+) net work — clockwise loop */}
            <ellipse cx="175" cy="58" rx="20" ry="16" fill="none" className="proc" style={{ stroke: '#5fd39a' }} />
            <path d="M175,42 L182,43" className="proc" style={{ stroke: '#5fd39a' }} markerEnd="url(#loopArrow)" />
            <text x="175" y="112" className="ptxt" textAnchor="middle" style={{ fontSize: 11 }}>(+)</text>
          </svg>
          <div className="gibbs-q">A cycle with only two states can net zero, negative, or positive work.</div>
        </div>
      </div>

      <div className="gibbs-footer">
        <div className="gibbs-footer-row">
          <b>Irreversibilities</b> show up as pressure drops during isobaric processes, and entropy increases
          during (ideally) isentropic processes.
        </div>
        <div className="gibbs-footer-row">
          Power-cycle analysis is <b>visually interpretive</b> — it lets you compare cycles directly through
          graphing.
        </div>
      </div>

      <div className="gibbs-footer" style={{ marginTop: 10 }}>
        <div className="gibbs-footer-row"><b>Brayton cycle</b> governs/models a jet engine best:</div>
        <div className="gibbs-footer-row" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <span>1→2 &nbsp;Isentropic compression</span>
          <span>2→3 &nbsp;Isobaric heat addition</span>
          <span>3→4 &nbsp;Isentropic expansion</span>
          <span>4→1 &nbsp;Isobaric heat rejection</span>
        </div>
      </div>
    </div>
  )
}

// ── dispatch to the right slide component by type ───────────────────────────
function SlideRouter({ slide, revealed }) {
  if (slide.type === 'gibbs') return <GibbsSlide revealed={revealed} />
  if (slide.type === 'piston') return <PistonSlide revealed={revealed} />
  if (slide.type === 'loop23') return <Loop23Slide revealed={revealed} />
  if (slide.type === 'friction') return <FrictionSlide revealed={revealed} />
  if (slide.type === 'reflect') return <ReflectSlide revealed={revealed} />
  if (slide.type === 'realgas') return <RealGasSlide revealed={revealed} />
  if (slide.type === 'summary') return <SummarySlide />
  return <CycleSlide slide={slide} revealed={revealed} />
}

const ONE_STEP_TYPES = ['gibbs', 'piston', 'loop23', 'friction', 'reflect', 'realgas', 'summary']
const totalSteps = (slide) => ONE_STEP_TYPES.includes(slide?.type) ? 1 : 8   // P–v ×4 then T–s ×4

// ── presentation shell (shared theme/nav) ────────────────────────────────────
export default function Presentation({ slides: slideData = slides, meta: metaData = meta }) {
  const [slideIdx, setSlideIdx] = useState(0)
  const [revealed, setRevealed] = useState(0)
  const [direction, setDirection] = useState(null)
  const [animKey, setAnimKey] = useState(0)

  const current = slideData[slideIdx]
  const steps = totalSteps(current)
  const hint = ONE_STEP_TYPES.includes(current.type)
    ? '← → or click · 1 step: reveal'
    : '← → or click · 8 steps: P–v then T–s'

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= slideData.length) return
    setDirection('exit')
    setTimeout(() => { setSlideIdx(idx); setRevealed(0); setAnimKey((k) => k + 1); setDirection('enter') }, 260)
  }, [slideData.length])

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
  const progress = slideData.length > 1
    ? ((slideIdx + revealed / Math.max(steps, 1)) / (slideData.length - 1)) * 100 : 100

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

      <div className="stage" onClick={stage}>
        <div className="slide-wrapper">
          <div className={`slide active${direction === 'exit' ? ' exit' : ''}`} key={animKey}>
            <SlideRouter slide={current} revealed={revealed} />
          </div>
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="nav-bar">
        <button className="nav-btn" onClick={retreat} disabled={slideIdx === 0 && revealed === 0}>&larr; Prev</button>
        <div className="nav-dots">
          {slideData.map((_, i) => (
            <div key={i} className={`nav-dot${i === slideIdx ? ' active' : ''}`}
              onClick={(e) => { e.stopPropagation(); goTo(i) }} />
          ))}
        </div>
        <button className="nav-btn" onClick={advance} disabled={slideIdx === slideData.length - 1 && revealed >= steps}>Next &rarr;</button>
        <span className="nav-hint">{hint}</span>
      </div>
    </div>
  )
}

// ── styles (shared ME 3470 navy/cyan theme + cycle additions) ────────────────
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
  padding:26px 40px;cursor:pointer;overflow:auto}
.slide-wrapper{margin:auto;position:relative;width:100%;max-width:1180px}
.slide{width:100%}
.slide.exit .slide-inner{opacity:0;transform:translateY(-10px);transition:.24s ease}
.slide-inner{width:100%}
.anim-in{animation:fadeUp .5s ease both}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.compress-slide{max-height:100%}
.section-number{font-family:var(--display);color:var(--accent);
  font-size:14px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:8px}
.slide-heading{font-family:var(--display);font-size:32px;margin:2px 0 0}
.slide-heading sub{font-size:.62em}
.heading-rule{width:70px;height:3px;background:var(--accent);margin:12px 0 12px}
.cf-note{font-size:14.5px;line-height:1.5;color:var(--muted);max-width:1120px;margin:0}
.cf-note strong{color:var(--accent-2)}
.cf-note--lead{color:var(--ink)}

/* cycle slide */
.cyc-body{width:100%}
.cyc-cap{font-size:15px;color:var(--ink);margin:2px 0 8px;min-height:20px}
.cyc-cap b{font-weight:700}
.cyc-chips{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px}
.chip{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--muted);
  border:1px solid var(--rule);border-radius:20px;padding:3px 10px;transition:.2s}
.chip i{width:9px;height:9px;border-radius:2px;display:inline-block}
.chip-on{color:var(--ink);font-weight:600}
.chip-eta{margin-left:auto;font-size:13px;color:var(--accent);font-weight:600}
.chip-eta sub{font-size:.7em}

.cyc-grid{display:grid;grid-template-columns:1fr 292px;gap:20px;align-items:start}
.cyc-diagrams{display:flex;gap:14px;flex-wrap:wrap}
.cyc-fig{flex:1 1 320px;margin:0;background:var(--panel);border:1px solid var(--rule);
  border-radius:12px;padding:8px 10px 4px}
.cyc-figc{font-size:12px;text-align:center;margin:2px 0 0;font-weight:600}
.cyc-svg{width:100%;height:auto;display:block;max-height:40vh}
.cyc-sch{background:var(--panel);border:1px solid var(--rule);border-radius:12px;
  padding:10px 10px 6px}
.cyc-sch-cap{font-size:11.5px;color:var(--muted);text-align:center;margin-top:2px}

/* diagram elements */
.ax{stroke:var(--muted);stroke-width:1.4}
.axttl{font:12px var(--body);fill:var(--muted)}
.reftxt{font:10px var(--body);fill:var(--muted);opacity:.85}
.gd{fill:none;stroke:var(--muted);stroke-width:1;stroke-dasharray:5 4;opacity:.32}
.gs{fill:none;stroke:var(--muted);stroke-width:1;stroke-dasharray:2 4;opacity:.32}
.proc{fill:none;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.proc-hot{filter:drop-shadow(0 0 4px currentColor)}
.proc-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:pd .7s ease forwards}
@keyframes pd{to{stroke-dashoffset:0}}
.pt{fill:var(--ink);stroke:var(--bg);stroke-width:1}
.ptxt{font:700 12px var(--body);fill:var(--ink)}

/* schematic elements */
.pipe{fill:none;stroke:var(--muted);stroke-width:1.6}
.sch-l{font:600 12px var(--body)}
.sch-a{font:600 11px var(--body);fill:var(--muted)}
.stn{fill:var(--accent);stroke:var(--bg);stroke-width:1}
.stn-t{font:700 11px var(--body);fill:#0d1b2a}

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

@media (max-width:900px){ .cyc-grid{grid-template-columns:1fr} }
@media (max-width:720px){ .slide-heading{font-size:26px} .nav-hint{display:none} }
@media (prefers-reduced-motion:reduce){ .anim-in{animation:none} .proc-draw{animation:none;stroke-dashoffset:0} }

/* gibbs / piston slides */
.gibbs-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:14px}
.gibbs-grid-2{grid-template-columns:repeat(2,1fr);max-width:640px}
.gibbs-card{background:var(--panel);border:1px solid var(--rule);border-radius:12px;padding:10px 12px 12px}
.gibbs-card-h{font-size:12.5px;font-weight:700;color:var(--accent);margin-bottom:2px;text-align:center}
.gibbs-svg{width:100%;height:auto;display:block;max-height:22vh}
.gibbs-eq{font-size:13px;color:var(--ink);text-align:center;margin-top:2px;font-weight:600}
.gibbs-q{font-size:12.5px;color:var(--muted);margin-top:6px;line-height:1.4}
.gibbs-callout{font-size:12.5px;color:var(--muted);margin-top:6px;line-height:1.4;border-radius:8px;padding:6px 8px;transition:.25s}
.gibbs-callout-on{color:var(--ink);background:rgba(240,169,59,.14);border:1px solid var(--accent-2)}
.gibbs-footer{background:var(--panel);border:1px solid var(--rule);border-radius:12px;padding:12px 16px;margin-top:4px}
.gibbs-footer-row{font-size:13.5px;color:var(--muted);line-height:1.55;margin:3px 0}
.gibbs-footer-row b{color:var(--ink)}
.gibbs-footer-warn{color:var(--accent-2)}
.gibbs-footer-warn b{color:var(--accent-2)}
.shade{fill:var(--accent);opacity:.10;transition:opacity .4s ease}
.shade-on{opacity:.28}

.pist-strip{background:var(--panel);border:1px solid var(--rule);border-radius:12px;padding:10px 10px 4px;margin-bottom:14px}
.pist-svg{width:100%;height:auto;display:block;max-height:22vh}
.pist-cyl{fill:none;stroke:var(--muted);stroke-width:1.6}
.pist-gas{fill:var(--accent);opacity:.16}
.pist-head{fill:var(--ink);opacity:.85}
.pist-ghost{opacity:.4}
.stn-ghost{opacity:.55}
.pist-arrow{font:600 22px var(--body);fill:var(--muted)}

@media (max-width:900px){ .gibbs-grid{grid-template-columns:1fr} .gibbs-grid-2{grid-template-columns:1fr} }
`
