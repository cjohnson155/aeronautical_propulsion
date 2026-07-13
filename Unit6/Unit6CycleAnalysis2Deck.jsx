import { useState, useEffect, useCallback } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
//  ME 3470 · Unit 6 — Cycle Analysis 2
//  Same navy/cyan presentation shell as Unit6BraytonCycleDeck.
//
//  Picks up right where the real-gas-turbine slide leaves off: the cyclic
//  energy balance, the heat-transfer terms in a Brayton cycle, the thermal-
//  efficiency derivation, and the isentropic/isobaric simplification down to
//  the pressure-ratio-only form (η = 1 − 1/r_p^((γ−1)/γ)) used elsewhere.
//
//  save as  src/Unit6/Unit6CycleAnalysis2Deck.jsx
// ─────────────────────────────────────────────────────────────────────────────

export const meta = {
  courseId:  'ME 3470',
  deckTitle: 'Cycle Analysis 2 · Efficiency Derivation',
}

export const slides = [
  { type: 'balance', sectionNumber: 'Section 5 · 5.10',
    heading: 'Neither Net Work Nor Net Heat — Just a Balance',
    intro: 'For an ideal cycle, does the process end up with more work, or more heat? <strong>Neither</strong> — a cyclic process returns to its starting state, so the two must balance exactly.' },
  { type: 'heatterms', sectionNumber: 'Section 5 · 5.10',
    heading: 'Heat Transfer To & From the Working Fluid',
    intro: 'With the cyclic balance in hand, the heat added and heat rejected are just enthalpy differences across the two constant-pressure legs — <strong>q<sub>in</sub></strong> across the heater, <strong>q<sub>out</sub></strong> across the cooler.' },
  { type: 'efficiency', sectionNumber: 'Section 5 · 5.10',
    heading: 'Thermal Efficiency of the Ideal Brayton Cycle',
    intro: 'Thermal efficiency is net work over heat in — and since net work equals q<sub>in</sub> − q<sub>out</sub>, it reduces entirely to a <strong>ratio of temperatures</strong>.' },
  { type: 'simplify', sectionNumber: 'Section 5 · 5.10',
    heading: 'Isentropic + Isobaric Legs Collapse It to Pressure Ratio Alone',
    intro: 'The four temperatures aren\u2019t independent: 1→2 and 3→4 are isentropic, and 2→3 / 4→1 are isobaric. Combine the two and every temperature ratio becomes the <strong>same pressure-ratio term</strong> — the efficiency depends on r<sub>p</sub> alone.' },
  { type: 'dependencies', sectionNumber: 'Section 5 · 5.10',
    heading: 'What the Ideal Brayton Efficiency Actually Depends On',
    intro: 'With η<sub>th,Brayton</sub> = 1 − 1/r<sub>p</sub>^((γ−1)/γ) in hand, only <strong>two quantities</strong> control it — and one identity ties compressor and turbine together.' },
  { type: 'prlimit', sectionNumber: 'Section 5 · 5.11',
    heading: 'Highest Pressure Ratio ≠ Highest Net Work',
    intro: 'Real gas-turbine efficiency keeps climbing then flattens out with pressure ratio — but efficiency and <strong>net work</strong> are not the same story once the max cycle temperature is fixed.' },
  { type: 'wnetmax', sectionNumber: 'Section 5 · 5.11',
    heading: 'There\u2019s a Pressure Ratio That Maximizes Net Work',
    intro: 'For fixed T<sub>min</sub> and T<sub>max</sub>, net work rises with pressure ratio, peaks at <strong>w<sub>net,max</sub></strong>, then falls back down — the peak has its own formula.' },
  { type: 'backwork', sectionNumber: 'Section 5 · 5.11',
    heading: 'Back Work Ratio',
    intro: 'A large share of the turbine\u2019s output never leaves the shaft as useful work — it goes straight back into driving the compressor. That share is the <strong>back work ratio</strong>.' },
  { type: 'workedexample', sectionNumber: 'Section 5 · 5.11 · Example',
    heading: 'Worked Example — Ideal Turbojet, r\u209a = 8',
    intro: 'Compressor inlet at 300 K, turbine inlet at 1300 K, pressure ratio 8. Because \u03c0<sub>c</sub> = \u03c0<sub>t</sub>, the isentropic relation pins down both remaining temperatures directly.' },
]

// ── Slide 1 — cyclic energy balance ──────────────────────────────────────────
function BalanceSlide({ revealed }) {
  const on = revealed >= 1
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">Section 5 · 5.10</div>
      <h2 className="slide-heading anim-in">Neither Net Work Nor Net Heat — Just a Balance</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 10 }}>
        Now we have an easy way to tell how much work and heat a cycle produces or consumes. For an ideal
        cycle, should the process end up with <strong>more work</strong>, or <strong>more heat</strong>?
        <strong> Neither</strong> — a perfect cycle just converts one into the other with nothing left over.
      </p>

      <div className="gibbs-card" style={{ maxWidth: 720, margin: '0 auto' }}>
        <div className="gibbs-card-h">1<sup>st</sup> law, neglecting kinetic energy</div>
        <div className="gibbs-eq">(q<sub>in</sub> − q<sub>out</sub>) + (w<sub>in</sub> − w<sub>out</sub>) = h<sub>exit</sub> − h<sub>inlet</sub></div>
        <div className={`gibbs-callout${on ? ' gibbs-callout-on' : ''}`} style={{ textAlign: 'center' }}>
          A cycle returns to the <u>same state</u> it started at, so h<sub>exit</sub> = h<sub>inlet</sub> over one
          full lap — the right-hand side vanishes.
        </div>
      </div>

      <p className="cyc-cap" style={{ marginTop: 12 }}>
        {on
          ? <><b style={{ color: 'var(--accent)' }}>Result</b> — net heat in equals net work out. Nothing is
             "left over" as excess heat or excess work; they're the same quantity viewed two ways.</>
          : <b>Click / → to see what the cyclic condition forces.</b>}
      </p>

      <div className="gibbs-footer" style={{ marginTop: on ? 4 : 12, opacity: on ? 1 : 0.4, transition: '.3s' }}>
        <div className="gibbs-footer-row" style={{ textAlign: 'center' }}>
          <b>q<sub>in</sub> − q<sub>out</sub> = w<sub>out</sub> − w<sub>in</sub> = w<sub>net</sub></b>
        </div>
        <div className="gibbs-footer-row">
          This is the whole basis for a thermal-efficiency ratio: net work out, divided by the heat we paid
          to put in.
        </div>
      </div>
    </div>
  )
}

// ── Slide 2 — heat transfer terms ────────────────────────────────────────────
function HeatTermsSlide({ revealed }) {
  const on = revealed >= 1
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">Section 5 · 5.10</div>
      <h2 className="slide-heading anim-in">Heat Transfer To &amp; From the Working Fluid</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 10 }}>
        Both heat-transfer legs of the Brayton cycle are constant-pressure — so each is just a difference in
        enthalpy between the two stations that bound it, which for an ideal gas is c<sub>p</sub>ΔT.
      </p>

      <div className="gibbs-grid gibbs-grid-2">
        <div className="gibbs-card">
          <div className="gibbs-card-h" style={{ color: '#f0a93b' }}>Heat addition · 2→3</div>
          <svg viewBox="0 0 200 100" className="gibbs-svg">
            <line x1="24" y1="70" x2="176" y2="70" className="ax" />
            <circle cx="50" cy="70" r="7" className="stn" /><text x="50" y="73.4" className="stn-t" textAnchor="middle">2</text>
            <circle cx="150" cy="70" r="7" className="stn" /><text x="150" y="73.4" className="stn-t" textAnchor="middle">3</text>
            <line x1="50" y1="40" x2="50" y2="61" className="pipe" markerEnd="url(#hah)" />
            <line x1="100" y1="20" x2="100" y2="41" className="pipe" markerEnd="url(#hah)" />
            <line x1="150" y1="40" x2="150" y2="61" className="pipe" markerEnd="url(#hah)" />
            <text x="100" y="14" className="sch-a" textAnchor="middle">q<tspan baselineShift="sub">in</tspan></text>
            <defs>
              <marker id="hah" markerWidth="8" markerHeight="8" refX="4" refY="6" orient="auto">
                <path d="M0 8 L4 0 L8 8 z" fill="var(--accent-2)" />
              </marker>
            </defs>
          </svg>
          <div className="gibbs-eq">q<sub>in</sub> = h₃ − h₂ = c<sub>p</sub>(T₃ − T₂)</div>
        </div>

        <div className="gibbs-card">
          <div className="gibbs-card-h" style={{ color: '#6db3f2' }}>Heat rejection · 4→1</div>
          <svg viewBox="0 0 200 100" className="gibbs-svg">
            <line x1="24" y1="30" x2="176" y2="30" className="ax" />
            <circle cx="50" cy="30" r="7" className="stn" /><text x="50" y="33.4" className="stn-t" textAnchor="middle">4</text>
            <circle cx="150" cy="30" r="7" className="stn" /><text x="150" y="33.4" className="stn-t" textAnchor="middle">1</text>
            <line x1="50" y1="60" x2="50" y2="39" className="pipe" markerEnd="url(#hbh)" />
            <line x1="100" y1="80" x2="100" y2="59" className="pipe" markerEnd="url(#hbh)" />
            <line x1="150" y1="60" x2="150" y2="39" className="pipe" markerEnd="url(#hbh)" />
            <text x="100" y="92" className="sch-a" textAnchor="middle">q<tspan baselineShift="sub">out</tspan></text>
            <defs>
              <marker id="hbh" markerWidth="8" markerHeight="8" refX="4" refY="0" orient="auto">
                <path d="M0 0 L4 8 L8 0 z" fill="var(--accent)" />
              </marker>
            </defs>
          </svg>
          <div className="gibbs-eq">q<sub>out</sub> = h₄ − h₁ = c<sub>p</sub>(T₄ − T₁)</div>
        </div>
      </div>

      <p className="cyc-cap" style={{ marginTop: 4 }}>
        {on
          ? <>Both are ordinary <b style={{ color: 'var(--accent-2)' }}>constant-pressure</b> enthalpy changes —
             no shaft work crosses the boundary of either heat exchanger.</>
          : <b>Click / → for why these are plain enthalpy differences.</b>}
      </p>

      <div className={`gibbs-footer${on ? '' : ''}`} style={{ opacity: on ? 1 : 0.4, transition: '.3s' }}>
        <div className="gibbs-footer-row">
          The heater and cooler are the two legs where the working fluid crosses a boundary that lets heat
          in or out — the compressor and turbine legs are isentropic, so <b>no q</b> there.
        </div>
      </div>
    </div>
  )
}

// ── Slide 3 — thermal efficiency derivation ─────────────────────────────────
function EfficiencySlide({ revealed }) {
  const on = revealed >= 1
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">Section 5 · 5.10</div>
      <h2 className="slide-heading anim-in">Thermal Efficiency of the Ideal Brayton Cycle</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 10 }}>
        Thermal efficiency is net work delivered per unit of heat purchased. Substitute the two
        c<sub>p</sub>ΔT terms from the previous slide and the c<sub>p</sub> cancels straight out.
      </p>

      <div className="gibbs-card" style={{ maxWidth: 760, margin: '0 auto' }}>
        <div className="gibbs-card-h">Definition → substitution → simplified ratio</div>
        <div className="gibbs-eq" style={{ fontSize: 15 }}>
          η<sub>th,Brayton</sub> = w<sub>net</sub> ⁄ q<sub>in</sub> = 1 − q<sub>out</sub> ⁄ q<sub>in</sub>
        </div>
        <div className={`gibbs-callout${on ? ' gibbs-callout-on' : ''}`} style={{ textAlign: 'center', marginTop: 10 }}>
          = 1 − c<sub>p</sub>(T₄ − T₁) ⁄ c<sub>p</sub>(T₃ − T₂)
        </div>
        <div className="gibbs-eq" style={{ marginTop: 12, fontSize: 15 }}>
          = 1 − <span style={{ color: 'var(--accent)' }}>T₁(T₄⁄T₁ − 1)</span> ⁄ <span style={{ color: 'var(--accent-2)' }}>T₂(T₃⁄T₂ − 1)</span>
        </div>
      </div>

      <p className="cyc-cap" style={{ marginTop: 12 }}>
        {on
          ? <>Factoring out T₁ and T₂ sets up the next step — <b>if T₄/T₁ and T₃/T₂ turn out equal</b>, they
             cancel and only a temperature (or pressure) ratio survives.</>
          : <b>Click / → to see why the terms were factored this way.</b>}
      </p>

      <div className="gibbs-footer" style={{ marginTop: on ? 4 : 12, opacity: on ? 1 : 0.4, transition: '.3s' }}>
        <div className="gibbs-footer-row">
          This form is exact for the ideal cycle so far — it hasn't used the isentropic or isobaric
          relations yet. That's the next step.
        </div>
      </div>
    </div>
  )
}

// ── Slide 4 — isentropic + isobaric simplification ───────────────────────────
function SimplifySlide({ revealed }) {
  const on = revealed >= 1
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">Section 5 · 5.10</div>
      <h2 className="slide-heading anim-in">Isentropic + Isobaric Legs Collapse It to Pressure Ratio Alone</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 10 }}>
        Two more facts about this cycle pin down T₄/T₁ and T₃/T₂ to be the <strong>same ratio</strong>, which is
        exactly what the previous slide needed to cancel.
      </p>

      <div className="gibbs-grid gibbs-grid-2">
        <div className="gibbs-card">
          <div className="gibbs-card-h" style={{ color: '#5ec8d8' }}>Processes 1→2 &amp; 3→4 · isentropic</div>
          <div className="gibbs-eq" style={{ fontSize: 14 }}>(T₂⁄T₁)^(γ/(γ−1)) = P₂⁄P₁</div>
          <div className="gibbs-eq" style={{ fontSize: 14, marginTop: 6 }}>P₃⁄P₄ = (T₃⁄T₄)^(γ/(γ−1))</div>
        </div>
        <div className="gibbs-card">
          <div className="gibbs-card-h" style={{ color: '#f0a93b' }}>Processes 2→3 &amp; 4→1 · isobaric</div>
          <div className="gibbs-eq" style={{ fontSize: 16 }}>P₂ = P₃ &nbsp;&nbsp; P₄ = P₁</div>
          <div className="gibbs-q" style={{ textAlign: 'center', marginTop: 8 }}>
            No pressure drop across either heat exchanger.
          </div>
        </div>
      </div>

      <div className="gibbs-card" style={{ maxWidth: 780, margin: '12px auto 0' }}>
        <div className="gibbs-card-h">Combine the two</div>
        <div className={`gibbs-eq${on ? '' : ''}`} style={{ fontSize: 14.5 }}>
          (T₂⁄T₁)^(γ/(γ−1)) = P₂⁄P₁ = P₃⁄P₄ = (T₃⁄T₄)^(γ/(γ−1))
        </div>
        <div className={`gibbs-callout${on ? ' gibbs-callout-on' : ''}`} style={{ textAlign: 'center', marginTop: 10 }}>
          ⇒ T₂/T₁ = T₃/T₄ &nbsp;⇒&nbsp; T₄/T₁ = T₃/T₂ &nbsp;— the two ratios from the efficiency expression
          are identical, so they cancel.
        </div>
      </div>

      <p className="cyc-cap" style={{ marginTop: 12 }}>
        {on
          ? <><b style={{ color: 'var(--accent)' }}>Final form</b> — everything but the pressure ratio drops
             out, matching the r<sub>p</sub> = 8 / r<sub>p</sub> = 16 cycles from earlier in this unit.</>
          : <b>Click / → to see the final pressure-ratio-only result.</b>}
      </p>

      <div className="gibbs-footer" style={{ marginTop: on ? 4 : 12, opacity: on ? 1 : 0.4, transition: '.3s' }}>
        <div className="gibbs-footer-row" style={{ textAlign: 'center', fontSize: 15 }}>
          <b>η<sub>th,Brayton</sub> = 1 − 1 ⁄ r<sub>p</sub>^((γ−1)/γ)</b> &nbsp;&nbsp; where r<sub>p</sub> = P₂/P₁
        </div>
        <div className="gibbs-footer-row">
          Higher pressure ratio ⇒ higher ideal efficiency, independent of turbine-inlet temperature.
        </div>
      </div>
    </div>
  )
}

// ── Slide 5 — what the pressure-ratio-only efficiency depends on ───────────
function DependenciesSlide({ revealed }) {
  const on = revealed >= 1
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">Section 5 · 5.10</div>
      <h2 className="slide-heading anim-in">What the Ideal Brayton Efficiency Actually Depends On</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 10 }}>
        Every temperature dropped out on the last slide, leaving a strikingly simple result — efficiency
        rides entirely on <strong>two quantities</strong>.
      </p>

      <div className="gibbs-card" style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="gibbs-card-h">Final result</div>
        <div className="gibbs-eq" style={{ fontSize: 17 }}>
          η<sub>th,Brayton</sub> = 1 − 1 ⁄ (P₂⁄P₁)^((γ−1)/γ)
        </div>
      </div>

      <div className="gibbs-grid gibbs-grid-2" style={{ marginTop: 14 }}>
        <div className="gibbs-card">
          <div className="gibbs-card-h" style={{ color: '#5ec8d8' }}>① Pressure ratio</div>
          <div className="gibbs-q" style={{ textAlign: 'center' }}>
            The pressure ratio of the gas turbine, P₂⁄P₁ — set by the compressor.
          </div>
        </div>
        <div className="gibbs-card">
          <div className="gibbs-card-h" style={{ color: '#f0a93b' }}>② Specific heat ratio</div>
          <div className="gibbs-q" style={{ textAlign: 'center' }}>
            γ, the specific heat ratio of the working fluid.
          </div>
        </div>
      </div>

      <p className="cyc-cap" style={{ marginTop: 12 }}>
        {on
          ? <><b style={{ color: 'var(--accent)' }}>Both push the same way</b> — thermal efficiency increases
             as γ increases <i>and</i> as P₂⁄P₁ increases.</>
          : <b>Click / → for the compressor/turbine pressure-ratio identity.</b>}
      </p>

      <div className="gibbs-footer" style={{ marginTop: on ? 4 : 12, opacity: on ? 1 : 0.4, transition: '.3s' }}>
        <div className="gibbs-footer-row" style={{ textAlign: 'center' }}>
          <b>η<sub>th,Brayton</sub> ↑ with γ ↑ and P₂⁄P₁ ↑</b>
        </div>
        <div className="gibbs-footer-row">
          <b>Note:</b> P₂⁄P₁ = P₃⁄P₄ — for an ideal Brayton cycle, the compressor's pressure ratio <i>is</i>
          the turbine's pressure ratio.
        </div>
      </div>
    </div>
  )
}

// ── Slide 6 — real-engine efficiency plateau vs. work-maximizing PR ─────────
function PrLimitSlide({ revealed }) {
  const on = revealed >= 1
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">Section 5 · 5.11</div>
      <h2 className="slide-heading anim-in">Highest Pressure Ratio ≠ Highest Net Work</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 10 }}>
        Real gas-turbine efficiency rises steeply with pressure ratio at first, then flattens out — typical
        engines sit in the <strong>r<sub>p</sub> ≈ 10–25</strong> range where the curve has mostly leveled off.
      </p>

      <div className="gibbs-card" style={{ maxWidth: 760, margin: '0 auto' }}>
        <div className="gibbs-card-h">η<sub>th,Brayton</sub> vs. pressure ratio, r<sub>p</sub> = P₂/P₁</div>
        <svg viewBox="0 0 340 170" className="gibbs-svg" style={{ maxHeight: '26vh' }}>
          <line x1="30" y1="150" x2="320" y2="150" className="ax" />
          <line x1="30" y1="150" x2="30" y2="14" className="ax" />
          <text x="10" y="20" className="sch-a">η</text>
          <text x="300" y="166" className="sch-a">r<tspan baselineShift="sub" fontSize="7">p</tspan></text>
          {[0.1,0.3,0.5,0.7].map((v,i) => (
            <text key={i} x="22" y={150 - v*160 + 3} className="sch-a" textAnchor="end">{v.toFixed(1)}</text>
          ))}
          <path d="M30,150 C55,60 80,30 130,22 C180,16 250,14 320,13"
            fill="none" stroke="var(--accent)" strokeWidth="2.4" />
          <rect x="55" y="14" width="150" height="136" fill="var(--accent-2)" opacity={on ? 0.14 : 0}
            style={{ transition: '.4s' }} stroke={on ? 'var(--accent-2)' : 'none'} strokeDasharray="3 3" />
          {on && <text x="130" y="70" className="sch-a" textAnchor="middle" fill="var(--accent-2)">typical gas-turbine range</text>}
        </svg>
      </div>

      <p className="cyc-cap" style={{ marginTop: 10 }}>
        {on
          ? <><b style={{ color: 'var(--accent)' }}>The catch</b> — this plot holds no ceiling on cycle
             temperature. In a real engine, T<sub>max</sub> is capped by <b>turbine-blade material limits</b>.</>
          : <b>Click / → for why efficiency alone doesn\u2019t decide the best r<sub>p</sub>.</b>}
      </p>

      <div className="gibbs-footer" style={{ marginTop: on ? 4 : 12, opacity: on ? 1 : 0.4, transition: '.3s' }}>
        <div className="gibbs-footer-row">
          If we push r<sub>p</sub> higher while T<sub>max</sub> stays <b>fixed</b>, the net work per cycle
          rises at first — but eventually reaches a max, then <b>decreases</b>, even though η<sub>th</sub>
          keeps climbing.
        </div>
        <div className="gibbs-footer-row" style={{ color: 'var(--bad)' }}>
          <b>Highest r<sub>p</sub> ⇒ highest η<sub>th</sub>, but not the highest w<sub>net</sub>.</b>
        </div>
      </div>
    </div>
  )
}

// ── Slide 7 — the pressure ratio that maximizes net work ────────────────────
function WnetMaxSlide({ revealed }) {
  const on = revealed >= 1
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">Section 5 · 5.11</div>
      <h2 className="slide-heading anim-in">There\u2019s a Pressure Ratio That Maximizes Net Work</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 10 }}>
        Hold T<sub>min</sub> and T<sub>max</sub> fixed and sweep the pressure ratio on a T–s diagram: the
        enclosed area — <strong>net work</strong> — grows, peaks, then shrinks again.
      </p>

      <div className="gibbs-card" style={{ maxWidth: 780, margin: '0 auto' }}>
        <div className="gibbs-card-h">T–s diagram · three pressure ratios, same T<sub>min</sub>/T<sub>max</sub></div>
        <svg viewBox="0 0 360 170" className="gibbs-svg" style={{ maxHeight: '28vh' }}>
          <line x1="30" y1="150" x2="340" y2="150" className="ax" />
          <line x1="30" y1="150" x2="30" y2="16" className="ax" />
          <text x="300" y="166" className="sch-a">s</text>
          <text x="10" y="24" className="sch-a">T</text>
          <line x1="30" y1="30" x2="340" y2="30" stroke="var(--muted)" strokeWidth="1" strokeDasharray="4 3" />
          <line x1="30" y1="140" x2="340" y2="140" stroke="var(--muted)" strokeWidth="1" strokeDasharray="4 3" />
          <text x="335" y="26" className="sch-a" textAnchor="end">1000 K</text>
          <text x="335" y="150" className="sch-a" textAnchor="end">300 K</text>

          {/* PR = 1.5 : narrow cycle near the left, small area */}
          <polygon points="70,140 90,140 100,30 82,30" fill="var(--muted)" opacity="0.18" />
          <path d="M70,140 L90,140 L100,30 L82,30 Z" fill="none" stroke="var(--muted)" strokeWidth="1.6" />
          <text x="80" y="18" className="sch-a" textAnchor="middle">PR=1.5</text>

          {/* PR = 8.2 : the work-maximizing cycle, widest enclosed band */}
          <polygon points="130,140 190,140 230,30 150,30" fill="var(--accent)" opacity={on ? 0.28 : 0.16}
            style={{ transition: '.4s' }} />
          <path d="M130,140 L190,140 L230,30 L150,30 Z" fill="none" stroke="var(--accent)" strokeWidth="2.2" />
          <text x="180" y="18" className="sch-a" textAnchor="middle" fill="var(--accent)">PR=8.2 → w_net,max</text>

          {/* PR = 30 : too high — tall isentropes, narrow entropy band, small enclosed area */}
          <polygon points="272,140 288,140 320,32 306,32" fill="var(--bad)" opacity="0.14" />
          <path d="M272,140 L288,140 L320,32 L306,32 Z" fill="none" stroke="var(--bad)" strokeWidth="1.6" />
          <text x="300" y="18" className="sch-a" textAnchor="middle">PR=30</text>
        </svg>
      </div>

      <p className="cyc-cap" style={{ marginTop: 10 }}>
        {on
          ? <><b style={{ color: 'var(--accent)' }}>Both extremes lose</b> — at r<sub>p</sub>=1.5 the cycle is
             too small; at r<sub>p</sub>=30 the entropy band is pinched too narrow. Only the middle r<sub>p</sub>
             encloses the largest T–s area.</>
          : <b>Click / → for the pressure ratio that sits at the peak.</b>}
      </p>

      <div className="gibbs-footer" style={{ marginTop: on ? 4 : 12, opacity: on ? 1 : 0.4, transition: '.3s' }}>
        <div className="gibbs-footer-row" style={{ textAlign: 'center', fontSize: 15 }}>
          <b>r<sub>p,w<sub>net,max</sub></sub> = (T<sub>max</sub> ⁄ T<sub>min</sub>)^(γ ⁄ 2(γ−1))</b>
        </div>
        <div className="gibbs-footer-row">
          Away from this value — whether r<sub>p</sub> is too small (1.5) or too large (30 in this comparison) —
          <b> w<sub>net</sub> &lt; w<sub>net,max</sub></b>.
        </div>
      </div>
    </div>
  )
}

// ── Slide 8 — back work ratio ────────────────────────────────────────────────
function BackWorkSlide({ revealed }) {
  const on = revealed >= 1
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">Section 5 · 5.11</div>
      <h2 className="slide-heading anim-in">Back Work Ratio</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 10 }}>
        The turbine has to power the compressor <strong>before</strong> any work is left over as useful net
        output. The back work ratio tracks how much of the turbine's output that costs.
      </p>

      <div className="gibbs-card" style={{ maxWidth: 700, margin: '0 auto' }}>
        <div className="gibbs-card-h">Definition</div>
        <div className="gibbs-eq" style={{ fontSize: 15 }}>
          w<sub>turbine</sub> = w<sub>net,out</sub> + w<sub>compressor</sub>
        </div>
        <div className={`gibbs-callout${on ? ' gibbs-callout-on' : ''}`} style={{ textAlign: 'center', marginTop: 10 }}>
          Back work ratio &nbsp; BWR = w<sub>compressor</sub> ⁄ w<sub>turbine</sub>
        </div>
      </div>

      <p className="cyc-cap" style={{ marginTop: 12 }}>
        {on
          ? <><b style={{ color: 'var(--accent)' }}>Gas turbines have high back work</b> — the back work ratio is
             typically <b>around 40–60%</b>, far higher than in a Rankine (steam) cycle.</>
          : <b>Click / → for how large this ratio typically is.</b>}
      </p>

      <div className="gibbs-footer" style={{ marginTop: on ? 4 : 12, opacity: on ? 1 : 0.4, transition: '.3s' }}>
        <div className="gibbs-footer-row" style={{ textAlign: 'center' }}>
          <b>BWR ≈ 40–60% is typical</b> for a gas-turbine Brayton cycle
        </div>
        <div className="gibbs-footer-row">
          A large fraction of everything the turbine produces goes right back into running the compressor —
          only the remainder shows up as net shaft work.
        </div>
      </div>
    </div>
  )
}

// ── Slide 9 — worked example: rp = 8 ideal turbojet ─────────────────────────
function WorkedExampleSlide({ revealed }) {
  const on = revealed >= 1
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">Section 5 · 5.11 · Example</div>
      <h2 className="slide-heading anim-in">Worked Example — Ideal Turbojet, r<sub>p</sub> = 8</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in" style={{ marginBottom: 10 }}>
        Our ideal jet engine has a pressure ratio of 8. Air temperature is 300 K at the compressor
        inlet and 1300 K at the turbine inlet. <strong>a)</strong> Find the gas temperature at the exit of
        the compressor &amp; turbine. <strong>b)</strong> Back work ratio. <strong>c)</strong> Thermal efficiency.
      </p>

      <div className="gibbs-card" style={{ maxWidth: 640, margin: '0 auto 12px' }}>
        <div className="gibbs-card-h">Given</div>
        <div className="gibbs-eq" style={{ fontSize: 14.5 }}>
          P₂⁄P₁ = P₃⁄P₄ = 8 &nbsp;&nbsp; T₁ = 300 K &nbsp;&nbsp; T₃ = 1300 K
        </div>
      </div>

      <div className="gibbs-grid gibbs-grid-2">
        <div className="gibbs-card">
          <div className="gibbs-card-h" style={{ color: '#5ec8d8' }}>Compressor · 1→2, isentropic</div>
          <div className="gibbs-eq" style={{ fontSize: 13.5 }}>
            P₂⁄P₁ = (T₂⁄T₁)^(γ/(γ−1))
          </div>
          <div className="gibbs-eq" style={{ fontSize: 13.5, marginTop: 4 }}>
            8 = (T₂⁄300)^(1/0.286)
          </div>
          <div className={`gibbs-callout${on ? ' gibbs-callout-on' : ''}`} style={{ textAlign: 'center', marginTop: 8 }}>
            <b>T₂ = 543.4 K</b>
          </div>
        </div>
        <div className="gibbs-card">
          <div className="gibbs-card-h" style={{ color: '#f0a93b' }}>Turbine · 3→4, isentropic</div>
          <div className="gibbs-eq" style={{ fontSize: 13.5 }}>
            P₃⁄P₄ = (T₃⁄T₄)^(γ/(γ−1))
          </div>
          <div className="gibbs-eq" style={{ fontSize: 13.5, marginTop: 4 }}>
            8 = (1300⁄T₄)^(1/0.286)
          </div>
          <div className={`gibbs-callout${on ? ' gibbs-callout-on' : ''}`} style={{ textAlign: 'center', marginTop: 8 }}>
            <b>T₄ = 717.6 K</b>
          </div>
        </div>
      </div>

      <p className="cyc-cap" style={{ marginTop: 12 }}>
        {on
          ? <><b style={{ color: 'var(--accent)' }}>Part (b) setup</b> — back work ratio needs
             w<sub>comp,in</sub> = c<sub>p</sub>(T₂ − T₁) compared against
             w<sub>turb,out</sub> = c<sub>p</sub>(T₃ − T₄), both now computable from the temperatures above.</>
          : <b>Click / → for how these two temperatures feed into part (b).</b>}
      </p>

      <div className="gibbs-footer" style={{ marginTop: on ? 4 : 12, opacity: on ? 1 : 0.4, transition: '.3s' }}>
        <div className="gibbs-footer-row" style={{ textAlign: 'center' }}>
          <b>BWR = w<sub>comp,in</sub> ⁄ w<sub>turb,out</sub></b>
        </div>
        <div className="gibbs-footer-row">
          Same pressure ratio, same γ — so both temperature jumps come from one isentropic relation
          applied twice, once forward from T₁ and once backward from T₃.
        </div>
      </div>
    </div>
  )
}

// ── dispatch to the right slide component by type ───────────────────────────
function SlideRouter({ slide, revealed }) {
  if (slide.type === 'balance') return <BalanceSlide revealed={revealed} />
  if (slide.type === 'heatterms') return <HeatTermsSlide revealed={revealed} />
  if (slide.type === 'efficiency') return <EfficiencySlide revealed={revealed} />
  if (slide.type === 'simplify') return <SimplifySlide revealed={revealed} />
  if (slide.type === 'dependencies') return <DependenciesSlide revealed={revealed} />
  if (slide.type === 'prlimit') return <PrLimitSlide revealed={revealed} />
  if (slide.type === 'wnetmax') return <WnetMaxSlide revealed={revealed} />
  if (slide.type === 'backwork') return <BackWorkSlide revealed={revealed} />
  if (slide.type === 'workedexample') return <WorkedExampleSlide revealed={revealed} />
  return null
}

const totalSteps = () => 1   // every slide here is a single click-to-reveal

// ── presentation shell (shared theme/nav — mirrors Unit6BraytonCycleDeck) ───
export default function Presentation({ slides: slideData = slides, meta: metaData = meta }) {
  const [slideIdx, setSlideIdx] = useState(0)
  const [revealed, setRevealed] = useState(0)
  const [direction, setDirection] = useState(null)
  const [animKey, setAnimKey] = useState(0)

  const current = slideData[slideIdx]
  const steps = totalSteps(current)
  const hint = '← → or click · 1 step: reveal'

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

// ── styles (shared ME 3470 navy/cyan theme, copied from Unit6BraytonCycleDeck) ─
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

.cyc-cap{font-size:15px;color:var(--ink);margin:2px 0 8px;min-height:20px}
.cyc-cap b{font-weight:700}

.pipe{fill:none;stroke:var(--muted);stroke-width:1.6}
.sch-l{font:600 12px var(--body)}
.sch-a{font:600 11px var(--body);fill:var(--muted)}
.stn{fill:var(--accent);stroke:var(--bg);stroke-width:1}
.stn-t{font:700 11px var(--body);fill:#0d1b2a}
.ax{stroke:var(--muted);stroke-width:1.4}

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

/* gibbs-style cards, reused for equation-driven derivation slides */
.gibbs-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:14px}
.gibbs-grid-2{grid-template-columns:repeat(2,1fr);max-width:640px;margin-left:auto;margin-right:auto}
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

@media (max-width:900px){ .gibbs-grid{grid-template-columns:1fr} .gibbs-grid-2{grid-template-columns:1fr} }
@media (max-width:720px){ .slide-heading{font-size:26px} .nav-hint{display:none} }
@media (prefers-reduced-motion:reduce){ .anim-in{animation:none} }
`
