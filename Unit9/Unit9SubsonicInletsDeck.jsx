import { useState, useEffect, useCallback } from 'react'

// ME 3470 - Unit 9: Subsonic Inlets
// React slide deck transcribed and redrawn from the handwritten source notes.

export const meta = {
  courseId: 'ME 3470',
  deckTitle: 'Unit 9 · Subsonic Inlets',
}

export const slides = [
  { type: 'overview', sectionNumber: 'Unit 9 · Inlets', heading: 'Subsonic and Supersonic Inlets', intro: 'Both inlet types must deliver usable flow to the engine, but their geometry and dominant flow-control problem are different.', steps: 2 },
  { type: 'stations', sectionNumber: 'Section 1 · Stations', heading: 'Station Numbering for This Unit', intro: 'Two different numbering habits collide in this material. Fix them now so the metrics on the next slides are unambiguous.', steps: 2 },
  { type: 'objectives', sectionNumber: 'Section 1 · 1.1', heading: 'What a Subsonic Inlet Must Do', intro: 'A practical inlet is judged by aerodynamic performance, installation effects, noise, and its ability to remain serviceable.', steps: 3 },
  { type: 'drivers', sectionNumber: 'Section 1 · 1.2', heading: 'What Governs Internal Performance?', intro: 'The internal flow follows diffuser physics. Area ratio alone is not enough: length, blockage, contour, and centerline shape determine whether the pressure rise is usable.', steps: 3 },
  { type: 'definitions', sectionNumber: 'Section 1 · 1.3', heading: 'Three Definitions to Keep Straight', intro: 'Distortion, the boundary layer, and the capture streamtube connect inlet geometry to what the fan or compressor actually receives.', steps: 3 },
  { type: 'metrics', sectionNumber: 'Section 1 · 1.4', heading: 'Pressure Recovery, Pressure Gradient, and Stall', intro: 'A diffuser converts kinetic energy to static pressure. The adverse pressure gradient required to do that is also what threatens the boundary layer.', steps: 3 },
  { type: 'metricsCompare', sectionNumber: 'Section 1 · 1.5', heading: 'Three Performance Numbers That Are Not the Same', intro: 'C_PR, π_d, and η_d all get called \u201cefficiency\u201d or \u201crecovery\u201d in conversation. They measure different things over different stations and take very different numerical values.', steps: 3 },
  { type: 'geometries', sectionNumber: 'Section 2 · 2.1', heading: 'Common Subsonic Diffuser Geometries', intro: 'Subsonic diffusion requires increasing area. Cross-section geometry and centerline curvature both affect the boundary layers.', steps: 4 },
  { type: 'recovery', sectionNumber: 'Section 2 · 2.2', heading: 'Ideal Static-Pressure Recovery vs. Area Ratio', intro: 'The ideal incompressible relation shows strong early gains and rapidly diminishing returns. It is a duct-geometry limit, not a total-pressure recovery.', steps: 3 },
  { type: 'gradient', sectionNumber: 'Section 2 · 2.3', heading: 'Why a Larger Area Ratio Can Trigger Separation', intro: 'For a fixed diffuser length, recovering more pressure means imposing a steeper adverse pressure gradient on the same boundary layer.', steps: 3 },
  { type: 'stall', sectionNumber: 'Section 2 · 2.4', heading: 'Four Diffuser-Stall Regimes', intro: 'Regimes are a map in divergence angle 2θ and nondimensional length L/W₁ - not angle alone. Along a path of increasing 2θ, a local recirculation bubble grows into a fully developed stall and then jet flow.', steps: 4 },
  { type: 'capture', sectionNumber: 'Section 3 · 3.1', heading: 'The Capture Streamtube and External Diffusion', intro: 'The capture streamtube is bounded by the outermost streamlines that are ultimately ingested by the engine.', steps: 2 },
  { type: 'captureDerivation', sectionNumber: 'Section 3 · 3.2', heading: 'Capture-Area Relation: Derivation', intro: 'Start with continuity, then use isentropic density and temperature relations to express velocity and density in terms of Mach number.', steps: 4 },
  { type: 'captureResult', sectionNumber: 'Section 3 · 3.3', heading: 'Capture-Area Relation: Final Form', intro: 'For isentropic external diffusion, the area ratio is controlled by the free-stream and inlet-lip Mach numbers.', steps: 1 },
  { type: 'mfr', sectionNumber: 'Section 3 · 3.4', heading: 'Mass-Flow Ratio and Inlet-Lip Mach Number', intro: 'The capture ratio A₀/A₁ is also the inlet mass-flow ratio when the streamtube is defined by the ingested flow.', steps: 2 },
  { type: 'lip', sectionNumber: 'Section 3 · 3.5', heading: 'Lip Contraction and Throat Mach Number', intro: 'The ratio of inlet-lip area to throat area controls how strongly subsonic flow accelerates around the convex inner lip.', steps: 2 },
  { type: 'external', sectionNumber: 'Section 4 · 4.1', heading: 'Flow Splits at the Highlight', intro: 'At the lip highlight, one branch goes over the nacelle and one follows the inner contour into the inlet.', steps: 2 },
  { type: 'spillageMechanism', sectionNumber: 'Section 4 · 4.2', heading: 'Why Spillage Happens: Demand vs. Capture Area', intro: 'A1 is fixed by geometry. A0 is not — it is whatever mass conservation requires once the engine\u2019s demanded flow is set. Spillage is what happens when those two stop matching.', steps: 2 },
  { type: 'backpressure', sectionNumber: 'Section 4 · 4.3', heading: 'How Compressor Speed Sets the Back Pressure', intro: 'Rotor speed sets a corrected-flow demand at a fixed flow area. That fixes the Mach number and static pressure at the fan face — the boundary condition the entire diffuser responds to.', steps: 2 },
  { type: 'forces', sectionNumber: 'Section 4 · 4.4', heading: 'Nacelle Pressure Forces and Lip Thrust', intro: 'The nonuniform pressure field around the lip produces an axial force that partially offsets additive drag. Getting the sign convention and the control surface right is most of the work.', steps: 2 },
  { type: 'summary', sectionNumber: 'Unit 9 · Summary', heading: 'Key Takeaways', intro: 'The useful design picture is a balance among pressure recovery, attachment, mass flow, and installed drag.', steps: 1 },
]

const G = 1.4
const ACCENT = '#5ec8d8'
const GOLD = '#f0a93b'
const GREEN = '#5fd39a'
const RED = '#e2685c'
const VIOLET = '#a993e8'

const dimClass = (revealed, step) => revealed >= step ? 'reveal on' : 'reveal'

function SlideFrame({ slide, children }) {
  return (
    <div className="slide-inner compress-slide">
      <div className="section-number anim-in">{slide.sectionNumber}</div>
      <h2 className="slide-heading anim-in">{slide.heading}</h2>
      <div className="heading-rule anim-in" />
      <p className="cf-note cf-note--lead anim-in">{slide.intro}</p>
      <div className="slide-content anim-in">{children}</div>
    </div>
  )
}

function Card({ title, children, className = '', tone }) {
  return (
    <section className={'card ' + className} style={tone ? { '--tone': tone } : undefined}>
      {title && <h3 className="card-title">{title}</h3>}
      {children}
    </section>
  )
}

function Equation({ children, accent = false, className = '' }) {
  return <div className={'equation' + (accent ? ' equation-accent' : '') + ' ' + className}>{children}</div>
}

function ArrowDefs({ id = 'arrow' }) {
  return (
    <defs>
      <marker id={id} markerWidth="8" markerHeight="8" refX="6.5" refY="3.5" orient="auto">
        <path d="M0 0 L7 3.5 L0 7 z" fill="context-stroke" />
      </marker>
      <marker id={id + '-small'} markerWidth="6" markerHeight="6" refX="5.3" refY="3" orient="auto">
        <path d="M0 0 L6 3 L0 6 z" fill="context-stroke" />
      </marker>
    </defs>
  )
}

function InletComparisonFigure({ revealed }) {
  return (
    <svg viewBox="0 0 760 240" className="wide-svg" aria-label="Subsonic and supersonic inlet geometry comparison">
      <ArrowDefs id="cmp-arrow" />
      <text x="185" y="28" className="svg-title" textAnchor="middle">Subsonic</text>
      <text x="575" y="28" className="svg-title" textAnchor="middle">Supersonic</text>

      <g className={dimClass(revealed, 1)}>
        <path d="M45 92 Q75 58 118 65 L320 42 L320 198 L118 175 Q75 182 45 148 Z" className="duct-fill" />
        <path d="M45 92 Q75 58 118 65 L320 42 M45 148 Q75 182 118 175 L320 198" className="duct-line" />
        <path d="M82 120 C145 120 225 111 302 86" className="flow-line" markerEnd="url(#cmp-arrow-small)" />
        <path d="M82 120 C145 120 225 129 302 154" className="flow-line" markerEnd="url(#cmp-arrow-small)" />
        <circle cx="49" cy="120" r="29" className="lip-round" />
        <text x="185" y="222" className="svg-note" textAnchor="middle">rounded lip · increasing area</text>
      </g>

      <g className={dimClass(revealed, 2)}>
        <path d="M430 72 L480 114 L714 98 M430 168 L480 126 L714 142" className="duct-line" />
        <path d="M433 120 L480 114 L630 103" className="flow-line" markerEnd="url(#cmp-arrow-small)" />
        <path d="M433 120 L480 126 L630 137" className="flow-line" markerEnd="url(#cmp-arrow-small)" />
        <path d="M490 114 L513 126 L536 114 L559 126 L582 114" className="shock-line" />
        <path d="M490 126 L513 114 L536 126 L559 114 L582 126" className="shock-line" />
        <text x="575" y="222" className="svg-note" textAnchor="middle">sharp lip · variable area · shock train</text>
      </g>
    </svg>
  )
}

function DiffuserIcon({ kind, label, active = true }) {
  const cls = active ? 'mini-diagram on' : 'mini-diagram'
  return (
    <div className={cls}>
      <svg viewBox="0 0 220 120" aria-label={label}>
        <ArrowDefs id={'d-' + kind} />
        {kind === 'rect' && <>
          <path d="M22 46 L174 20 L202 32 L202 88 L174 100 L22 74 Z" className="duct-fill" />
          <path d="M22 46 L174 20 L202 32 M22 74 L174 100 L202 88 M22 46 L22 74 M174 20 L174 100" className="duct-line" />
          <line x1="42" y1="60" x2="178" y2="60" className="flow-line" markerEnd={'url(#d-' + kind + '-small)'} />
        </>}
        {kind === 'conical' && <>
          <ellipse cx="34" cy="60" rx="16" ry="24" className="duct-fill" />
          <ellipse cx="188" cy="60" rx="22" ry="42" className="duct-fill" />
          <path d="M34 36 L188 18 M34 84 L188 102" className="duct-line" />
          <line x1="35" y1="60" x2="180" y2="60" className="flow-line" markerEnd={'url(#d-' + kind + '-small)'} />
        </>}
        {kind === 'annular' && <>
          <ellipse cx="34" cy="60" rx="16" ry="24" className="duct-fill" />
          <ellipse cx="190" cy="60" rx="23" ry="43" className="duct-fill" />
          <ellipse cx="190" cy="60" rx="10" ry="25" className="hub" />
          <ellipse cx="34" cy="60" rx="6" ry="10" className="hub" />
          <path d="M34 36 L190 17 M34 84 L190 103 M34 50 L190 35 M34 70 L190 85" className="duct-line" />
        </>}
        {kind === 'transition' && <>
          <rect x="18" y="32" width="32" height="56" rx="2" className="duct-fill" />
          <ellipse cx="190" cy="60" rx="22" ry="42" className="duct-fill" />
          <path d="M50 32 C96 20 133 24 190 18 M50 88 C96 100 133 96 190 102" className="duct-line" />
          <path d="M50 32 C112 54 132 46 190 18 M50 88 C112 66 132 74 190 102" className="soft-line" />
        </>}
      </svg>
      <div className="mini-label">{label}</div>
    </div>
  )
}

function GeometryParametersFigure() {
  return (
    <svg viewBox="0 0 560 190" className="wide-svg" aria-label="Diffuser geometry parameters">
      <ArrowDefs id="geo-arrow" />
      <path d="M60 75 L390 28 M60 115 L390 162" className="duct-line" />
      <line x1="60" y1="95" x2="390" y2="95" className="axis-dash" />
      <line x1="60" y1="46" x2="60" y2="144" className="measure" />
      <line x1="390" y1="12" x2="390" y2="178" className="measure" />
      <line x1="78" y1="25" x2="372" y2="25" className="measure" markerStart="url(#geo-arrow)" markerEnd="url(#geo-arrow)" />
      <text x="225" y="18" className="svg-label" textAnchor="middle">n · axial length</text>
      <line x1="70" y1="67" x2="386" y2="22" className="measure warm" markerEnd="url(#geo-arrow-small)" />
      <text x="230" y="52" className="svg-label warm" textAnchor="middle">L · wall length</text>
      <path d="M105 95 A45 45 0 0 0 103 68" className="angle" />
      <text x="124" y="78" className="svg-label warm">φ<tspan baselineShift="sub" fontSize="9">w</tspan></text>
      <text x="18" y="74" className="svg-note">V₁, M₁</text>
      <text x="18" y="91" className="svg-note">p₁, T₁</text>
      <text x="18" y="108" className="svg-note">A₁</text>
      <text x="410" y="64" className="svg-note">V₂, M₂</text>
      <text x="410" y="81" className="svg-note">p₂, T₂</text>
      <text x="410" y="98" className="svg-note">A₂</text>
      <text x="480" y="128" className="svg-formula">AR = A₂/A₁</text>
      <text x="18" y="125" className="svg-note">R₁ (inlet radius)</text>
      <text x="480" y="155" className="svg-note" textAnchor="middle">geometry + centerline curvature</text>
    </svg>
  )
}

const idealCPR = (ar) => 1 - 1 / (ar * ar)

function RecoveryPlot({ revealed }) {
  const x0 = 64, y0 = 16, w = 450, h = 240
  const fx = (x) => x0 + (x - 1) / 4 * w
  const fy = (y) => y0 + h - y * h
  const pts = Array.from({ length: 81 }, (_, i) => 1 + i * 0.05)
  const path = pts.map((x, i) => (i ? 'L' : 'M') + fx(x).toFixed(1) + ' ' + fy(idealCPR(x)).toFixed(1)).join(' ')
  return (
    <svg viewBox="0 0 600 300" className="wide-svg" aria-label="Ideal pressure recovery coefficient versus area ratio">
      <ArrowDefs id="rec-arrow" />
      <line x1={x0} y1={y0} x2={x0} y2={y0 + h} className="axis" />
      <line x1={x0} y1={y0 + h} x2={x0 + w + 24} y2={y0 + h} className="axis" />
      {[0, .25, .5, .75, 1].map(v => <g key={v}>
        <line x1={x0 - 5} y1={fy(v)} x2={x0} y2={fy(v)} className="tick" />
        <text x={x0 - 11} y={fy(v) + 4} className="tick-label" textAnchor="end">{v.toFixed(v === 1 ? 1 : 2).replace('0.00', '0')}</text>
      </g>)}
      {[1, 2, 3, 4, 5].map(v => <g key={v}>
        <line x1={fx(v)} y1={y0 + h} x2={fx(v)} y2={y0 + h + 5} className="tick" />
        <text x={fx(v)} y={y0 + h + 18} className="tick-label" textAnchor="middle">{v}</text>
      </g>)}
      <text x="14" y="35" className="svg-label">C<tspan baselineShift="sub" fontSize="9">PR,ideal</tspan></text>
      <text x={x0 + w} y={y0 + h + 36} className="svg-label" textAnchor="end">Area ratio A₂/A₁</text>
      <path d={path} className="chart-line" />
      <line x1={x0} y1={fy(1)} x2={x0 + w} y2={fy(1)} className="guide" />
      <g className={dimClass(revealed, 1)}>
        <line x1={fx(2)} y1={fy(0)} x2={fx(2)} y2={fy(.75)} className="guide warm" />
        <line x1={x0} y1={fy(.75)} x2={fx(2)} y2={fy(.75)} className="guide warm" />
        <circle cx={fx(2)} cy={fy(.75)} r="5" className="mark warm-fill" />
        <text x={fx(2) + 12} y={fy(.75) - 10} className="svg-note warm">AR = 2 → 75%</text>
      </g>
      <g className={dimClass(revealed, 2)}>
        <line x1={fx(3)} y1={fy(0)} x2={fx(3)} y2={fy(idealCPR(3))} className="guide positive" />
        <circle cx={fx(3)} cy={fy(idealCPR(3))} r="5" className="mark positive-fill" />
        <text x={fx(3) + 12} y={fy(idealCPR(3)) + 18} className="svg-note positive">AR = 3 → 89% ≈ 90%</text>
      </g>
      <g className={dimClass(revealed, 3)}>
        <path d={'M' + fx(3.6) + ' ' + fy(.95) + ' Q' + fx(4.4) + ' ' + fy(.985) + ' ' + fx(4.9) + ' ' + fy(.99)} className="callout-arrow" markerEnd="url(#rec-arrow)" />
        <text x={fx(3.35)} y={fy(.88)} className="svg-note">diminishing returns</text>
      </g>
    </svg>
  )
}

function AreaRatioSketches({ revealed }) {
  return (
    <div className="ratio-row">
      {[1, 2, 3].map((ar) => (
        <div key={ar} className={dimClass(revealed, ar)}>
          <svg viewBox="0 0 170 92" className="ratio-svg">
            <ArrowDefs id={'ar-' + ar} />
            {ar === 1 ? <>
              <path d="M20 28 L148 28 M20 64 L148 64" className="duct-line" />
            </> : <>
              <path d={'M20 37 L148 ' + (ar === 2 ? 18 : 7) + ' M20 55 L148 ' + (ar === 2 ? 74 : 85)} className="duct-line" />
            </>}
            <line x1="28" y1="46" x2="136" y2="46" className="flow-line" markerEnd={'url(#ar-' + ar + '-small)'} />
          </svg>
          <div className="ratio-label">AR = {ar}</div>
        </div>
      ))}
    </div>
  )
}

function PressureGradientPlot({ revealed }) {
  return (
    <svg viewBox="0 0 560 265" className="wide-svg" aria-label="Static pressure rise along fixed-length diffusers">
      <line x1="55" y1="20" x2="55" y2="225" className="axis" />
      <line x1="55" y1="225" x2="515" y2="225" className="axis" />
      <text x="28" y="28" className="svg-label">p</text>
      <text x="512" y="248" className="svg-label" textAnchor="end">x</text>
      <text x="510" y="215" className="svg-note" textAnchor="end">L</text>
      <g className={dimClass(revealed, 1)}>
        <path d="M55 225 C150 105 310 55 490 42" className="chart-line" />
        <text x="424" y="34" className="svg-note positive">AR = 3 · ideal 90%</text>
        <path d="M55 225 C150 118 250 88 300 86 C360 86 420 92 490 94" className="guide positive-stroke" />
        <text x="300" y="112" className="svg-note" textAnchor="middle">actual: separates, then p flattens</text>
      </g>
      <g className={dimClass(revealed, 2)}>
        <path d="M55 225 C145 135 306 92 490 82" className="chart-line warm-stroke" />
        <text x="430" y="78" className="svg-note warm">AR = 2 · 75%</text>
      </g>
      <g className={dimClass(revealed, 3)}>
        <path d="M55 225 C140 164 302 130 490 124" className="chart-line violet-stroke" />
        <text x="424" y="121" className="svg-note violet">AR = 1.5 · 56%</text>
      </g>
      <line x1="55" y1="225" x2="55" y2="34" className="guide" />
      <line x1="490" y1="225" x2="490" y2="32" className="guide" />
      <text x="268" y="258" className="svg-note" textAnchor="middle">same axial length L → larger Δp/L means a steeper adverse gradient</text>
    </svg>
  )
}

function BoundaryLayerStages({ revealed }) {
  // y = 84 is the WALL. Smaller y = farther from the wall.
  // Arrow length must therefore DECREASE as y increases (no-slip at the wall).
  const stages = [
    { title: '1 · Healthy attached BL', profile: 'M22 82 Q34 24 82 18', ends: [60, 48, 38, 30], reverseAt: [] },
    { title: '2 · Separation begins', profile: 'M22 82 Q24 42 82 22', ends: [58, 41, 30, 25], reverseAt: [] },
    { title: '3 · Flow reversal', profile: 'M22 82 Q4 58 22 50 Q48 30 82 22', ends: [56, 40, 13, 15], reverseAt: [2, 3] },
  ]
  return (
    <div className="bl-row">
      {stages.map((s, i) => <div key={s.title} className={dimClass(revealed, i + 1)}>
        <svg viewBox="0 0 115 100" className="bl-svg">
          <ArrowDefs id={'bl-' + i} />
          <line x1="22" y1="12" x2="22" y2="84" className="axis-dash" />
          <line x1="14" y1="84" x2="105" y2="84" className="wall" />
          <path d={s.profile} className="profile-line" />
          {[28, 42, 56, 70].map((y, j) => {
            const rev = s.reverseAt.includes(j)
            return <line key={y} x1="22" y1={y} x2={s.ends[j]} y2={y} className={rev ? 'reverse-arrow' : 'velocity-arrow'} markerEnd={'url(#bl-' + i + '-small)'} />
          })}
          <text x="105" y="96" className="tick-label" textAnchor="end">wall</text>
        </svg>
        <div className="mini-label">{s.title}</div>
      </div>)}
    </div>
  )
}

function StallSketch({ stage, revealed }) {
  const active = revealed >= stage
  const titles = ['No stall', 'Transitory stall', '2D fully developed stall', 'Jet flow']
  const notes = [
    'Small φ · fully attached exit flow · steady internal flow',
    'Larger φ · local detached patches reattach · internal unsteadiness',
    'Still larger φ · stall patch reaches exit · fan sees swirling flow',
    'Largest φ · a large stable vortex surrounds a central jet',
  ]
  return (
    <Card title={titles[stage - 1]} className={active ? 'stall-card reveal on' : 'stall-card reveal'} tone={[GREEN, GOLD, RED, VIOLET][stage - 1]}>
      <svg viewBox="0 0 300 150" className="stall-svg">
        <ArrowDefs id={'stall-' + stage} />
        <path d="M24 64 L266 25 M24 86 L266 125" className="duct-line" />
        {stage === 1 && [0, 1, 2, 3].map(i => <path key={i} d={'M34 ' + (70 + i * 4) + ' Q150 ' + (56 + i * 10) + ' 254 ' + (38 + i * 25)} className="flow-line" markerEnd={'url(#stall-' + stage + '-small)'} />)}
        {stage === 2 && <>
          <path d="M34 70 Q150 52 254 40" className="flow-line" markerEnd={'url(#stall-' + stage + '-small)'} />
          <path d="M34 79 Q100 75 137 93 Q170 114 238 112" className="flow-line" markerEnd={'url(#stall-' + stage + '-small)'} />
          <path d="M128 94 C158 77 190 87 181 106 C169 126 135 119 128 94" className="vortex" />
          <text x="154" y="136" className="svg-note warm" textAnchor="middle">stall bubble</text>
        </>}
        {stage === 3 && <>
          <path d="M34 72 Q146 46 254 40" className="flow-line" markerEnd={'url(#stall-' + stage + '-small)'} />
          <path d="M34 78 Q110 66 254 64" className="flow-line" markerEnd={'url(#stall-' + stage + '-small)'} />
          {[0, 1, 2].map(i => <path key={i} d={'M105 ' + (92 + i * 8) + ' C150 ' + (68 + i * 7) + ' 220 ' + (80 + i * 4) + ' 242 ' + (108 + i * 3)} className="vortex" />)}
        </>}
        {stage === 4 && <>
          <path d="M34 74 Q145 60 254 66" className="jet-line" markerEnd={'url(#stall-' + stage + ')'} />
          <path d="M64 68 C108 30 224 38 241 74 C248 101 215 115 171 108" className="vortex" markerEnd={'url(#stall-' + stage + '-small)'} />
          <path d="M65 84 C112 126 220 122 242 86" className="vortex" markerEnd={'url(#stall-' + stage + '-small)'} />
          <text x="164" y="58" className="svg-note violet" textAnchor="middle">central jet</text>
        </>}
        <text x="50" y="58" className="svg-label warm">φ</text>
      </svg>
      <p className="small-copy">{notes[stage - 1]}</p>
    </Card>
  )
}

function SDuctFigure() {
  return (
    <svg viewBox="0 0 520 190" className="wide-svg" aria-label="S-duct with an offset centerline">
      <ArrowDefs id="sduct-arrow" />
      <path d="M28 40 C150 38 155 108 292 106 C385 104 400 84 492 82" className="duct-line thick" />
      <path d="M28 84 C150 86 155 152 292 154 C385 156 400 152 492 154" className="duct-line thick" />
      <path d="M28 62 C150 62 155 130 292 130 C385 130 400 118 484 118" className="axis-dash accent-stroke" markerEnd="url(#sduct-arrow)" />
      <ellipse cx="28" cy="62" rx="8" ry="22" className="duct-fill" />
      <ellipse cx="492" cy="118" rx="9" ry="36" className="fan" />
      <line x1="46" y1="41" x2="46" y2="83" className="measure accent-stroke" />
      <line x1="474" y1="83" x2="474" y2="153" className="measure positive" />
      <text x="38" y="66" className="svg-note accent-text" textAnchor="end">A₁</text>
      <text x="466" y="142" className="svg-note positive" textAnchor="end">A₂ &gt; A₁</text>
      <text x="262" y="20" className="svg-title" textAnchor="middle">diffusing S-duct: offset centerline + increasing area</text>
      <text x="176" y="100" className="svg-note accent-text">centerline</text>
    </svg>
  )
}

function CaptureStreamtubeFigure({ revealed = 2 }) {
  return (
    <svg viewBox="0 0 760 320" className="wide-svg" aria-label="Capture streamtube approaching a subsonic inlet">
      <ArrowDefs id="cap-arrow" />
      <line x1="30" y1="160" x2="720" y2="160" className="axis-dash" />
      <g className={dimClass(revealed, 1)}>
        {/* streamtube EXPANDS from A0 to A1: external diffusion, A0/A1 = 0.75 */}
        <path d="M30 106 C120 106 190 100 252 88" className="capture-boundary" />
        <path d="M30 214 C120 214 190 220 252 232" className="capture-boundary" />
        {/* two separate lip curls - the duct centerline stays open */}
        <path d="M252 88 Q226 96 248 104" className="lip-shape" />
        <path d="M252 232 Q226 224 248 216" className="lip-shape" />
        <path d="M252 88 C360 62 540 58 720 70" className="nacelle-line" />
        <path d="M252 232 C360 258 540 262 720 250" className="nacelle-line" />
        {/* internal duct: throat near x=340, then DIVERGES to the fan face */}
        <path d="M248 104 C300 108 300 104 340 104 C460 100 560 95 650 90" className="inner-line" />
        <path d="M248 216 C300 212 300 216 340 216 C460 220 560 225 650 230" className="inner-line" />
        {[0, 1, 2].map(i => <path key={i} d={'M36 ' + (126 + i * 34) + ' C130 ' + (126 + i * 34) + ' 190 ' + (124 + i * 36) + ' 258 ' + (122 + i * 38) + ' C400 ' + (124 + i * 36) + ' 500 ' + (120 + i * 40) + ' 620 ' + (114 + i * 46)} className="flow-line" markerEnd="url(#cap-arrow-small)" />)}
        <text x="100" y="76" className="svg-label accent-text">captured streamtube</text>
        <text x="176" y="256" className="svg-note" textAnchor="middle">outermost streamlines eventually ingested</text>
      </g>
      <g className={dimClass(revealed, 2)}>
        <line x1="62" y1="106" x2="62" y2="214" className="measure accent-stroke" />
        <line x1="252" y1="88" x2="252" y2="232" className="measure warm" />
        <line x1="340" y1="104" x2="340" y2="216" className="measure" />
        <line x1="650" y1="90" x2="650" y2="230" className="measure positive" />
        <text x="48" y="166" className="svg-formula accent-text" textAnchor="end">A₀</text>
        <text x="262" y="140" className="svg-formula warm">A₁</text>
        <text x="350" y="140" className="svg-formula">A<tspan baselineShift="sub" fontSize="10">th</tspan></text>
        <text x="664" y="166" className="svg-formula positive">A₂</text>
        <circle cx="252" cy="88" r="5" className="mark warm-fill" />
        <path d="M258 84 L300 62" className="callout-arrow" />
        <text x="304" y="60" className="svg-note warm">highlight</text>
        <text x="350" y="156" className="svg-note">throat</text>
        <path d="M656 94 L686 108 L686 212 L656 226 Z" className="fan" />
        <text x="672" y="196" className="svg-note">fan face</text>
      </g>
      <text x="380" y="300" className="svg-note" textAnchor="middle">external diffusion → lip contraction → internal diffusion</text>
    </svg>
  )
}

function LipFlowFigure({ revealed = 2 }) {
  return (
    <svg viewBox="0 0 650 300" className="wide-svg" aria-label="Flow accelerating around the inlet lip and through the throat">
      <ArrowDefs id="lip-arrow" />
      <line x1="24" y1="150" x2="515" y2="150" className="axis-dash" />
      <path d="M92 92 Q135 50 192 58 L515 58" className="nacelle-line" />
      <path d="M92 208 Q135 250 192 242 L515 242" className="nacelle-line" />
      {/* two separate lip curls */}
      <path d="M92 92 Q64 98 96 100" className="lip-shape" />
      <path d="M92 208 Q64 202 96 200" className="lip-shape" />
      {/* minimum area at x = 230 (throat), then diffusion toward the fan face */}
      <path d="M96 100 C150 104 195 106 230 106 C320 106 420 99 515 92" className="inner-line" />
      <path d="M96 200 C150 196 195 194 230 194 C320 194 420 201 515 208" className="inner-line" />
      <g className={dimClass(revealed, 1)}>
        {[0, 1, 2, 3].map(i => <path key={i} d={'M24 ' + [118, 136, 164, 182][i] + ' C66 ' + [118, 136, 164, 182][i] + ' 82 ' + [116, 138, 162, 184][i] + ' 104 ' + [116, 138, 162, 184][i] + ' C200 ' + [120, 140, 160, 180][i] + ' 330 ' + [120, 140, 160, 180][i] + ' 420 ' + [120, 140, 160, 180][i] + ' C450 ' + [120, 140, 160, 180][i] + ' 468 ' + [112, 139, 161, 188][i] + ' 500 ' + [110, 138, 162, 190][i]} className="flow-line" markerEnd="url(#lip-arrow-small)" />)}
        <text x="24" y="40" className="svg-note warm">flow accelerates around the convex inner lip</text>
        <circle cx="92" cy="92" r="5" className="mark warm-fill" />
        <path d="M96 89 L146 70" className="callout-arrow" />
        <text x="150" y="68" className="svg-note warm">highlight</text>
      </g>
      <g className={dimClass(revealed, 2)}>
        <line x1="92" y1="92" x2="92" y2="208" className="measure warm" />
        <line x1="230" y1="106" x2="230" y2="194" className="measure accent-stroke" />
        <text x="76" y="86" className="svg-formula warm" textAnchor="end">A₁</text>
        <text x="236" y="80" className="svg-formula accent-text">A<tspan baselineShift="sub" fontSize="10">th</tspan></text>
        <text x="256" y="80" className="svg-note accent-text">throat = minimum area</text>
        <text x="300" y="266" className="svg-note positive" textAnchor="middle">desired M<tspan baselineShift="sub" fontSize="10">max</tspan> &lt; 1 · design mean M̄<tspan baselineShift="sub" fontSize="10">th</tspan> ≤ 0.75</text>
        <text x="300" y="288" className="svg-note" textAnchor="middle">A₁/A<tspan baselineShift="sub" fontSize="10">th</tspan> ≈ 1.3 is the lip-contraction ratio</text>
      </g>
    </svg>
  )
}

const isenFactor = (M) => Math.pow(1 + (G - 1) / 2 * M * M, (G + 1) / (2 * (G - 1)))
const captureRatio = (M0, M1) => (M1 / M0) * isenFactor(M0) / isenFactor(M1)
const contractionRatio = (M1, Mth) => (Mth / M1) * isenFactor(M1) / isenFactor(Mth)

function PlotAxes({ x0, y0, w, h, xTicks, yTicks, fx, fy, xLabel, yLabel }) {
  return <>
    <line x1={x0} y1={y0} x2={x0} y2={y0 + h} className="axis" />
    <line x1={x0} y1={y0 + h} x2={x0 + w} y2={y0 + h} className="axis" />
    {xTicks.map(v => <g key={'x' + v}>
      <line x1={fx(v)} y1={y0 + h} x2={fx(v)} y2={y0 + h + 5} className="tick" />
      <text x={fx(v)} y={y0 + h + 19} className="tick-label" textAnchor="middle">{v}</text>
    </g>)}
    {yTicks.map(v => <g key={'y' + v}>
      <line x1={x0 - 5} y1={fy(v)} x2={x0} y2={fy(v)} className="tick" />
      <text x={x0 - 10} y={fy(v) + 4} className="tick-label" textAnchor="end">{v}</text>
      <line x1={x0} y1={fy(v)} x2={x0 + w} y2={fy(v)} className="grid-line" />
    </g>)}
    <text x={x0 + w} y={y0 + h + 39} className="svg-label" textAnchor="end">{xLabel}</text>
    <text x={14} y={y0 + 8} className="svg-label">{yLabel}</text>
  </>
}

function MassFlowPlot({ revealed }) {
  const x0 = 72, y0 = 22, w = 470, h = 236
  const xmin = .4, xmax = .8, ymin = .6, ymax = 1.02
  const fx = x => x0 + (x - xmin) / (xmax - xmin) * w
  const fy = y => y0 + h - (y - ymin) / (ymax - ymin) * h
  const xs = Array.from({ length: 81 }, (_, i) => xmin + i * (xmax - xmin) / 80)
  const line = (M0) => xs.map((M1, i) => (i ? 'L' : 'M') + fx(M1).toFixed(1) + ' ' + fy(captureRatio(M0, M1)).toFixed(1)).join(' ')
  return (
    <svg viewBox="0 0 600 320" className="wide-svg" aria-label="Mass-flow ratio versus inlet-lip Mach number">
      <PlotAxes x0={x0} y0={y0} w={w} h={h} fx={fx} fy={fy} xTicks={[.4, .5, .6, .7, .8]} yTicks={[.65, .75, .85, .95]} xLabel="Inlet-lip Mach number M₁" yLabel="A₀/A₁" />
      <g className={dimClass(revealed, 1)}>
        <path d={line(.8)} className="chart-line warm-stroke" />
        <text x={fx(.63)} y={fy(captureRatio(.8, .63)) - 11} className="svg-note warm">M₀ = 0.80</text>
      </g>
      <g className={dimClass(revealed, 2)}>
        <path d={line(.95)} className="chart-line" />
        <text x={fx(.68)} y={fy(captureRatio(.95, .68)) + 22} className="svg-note accent-text">M₀ = 0.95</text>
      </g>
      <line x1={x0} y1={fy(.95)} x2={x0 + w} y2={fy(.95)} className="guide" />
    </svg>
  )
}

function LipContractionPlot({ revealed }) {
  const x0 = 72, y0 = 22, w = 470, h = 236
  const xmin = .4, xmax = .75, ymin = .96, ymax = 1.55
  const fx = x => x0 + (x - xmin) / (xmax - xmin) * w
  const fy = y => y0 + h - (y - ymin) / (ymax - ymin) * h
  const xs = Array.from({ length: 71 }, (_, i) => xmin + i * (xmax - xmin) / 70)
  const line = (Mth) => xs.filter(M1 => M1 <= Mth + 1e-9).map((M1, i) => (i ? 'L' : 'M') + fx(M1).toFixed(1) + ' ' + fy(contractionRatio(M1, Mth)).toFixed(1)).join(' ')
  return (
    <svg viewBox="0 0 600 320" className="wide-svg" aria-label="Lip contraction ratio versus inlet-lip Mach number">
      <PlotAxes x0={x0} y0={y0} w={w} h={h} fx={fx} fy={fy} xTicks={[.4, .5, .6, .7, .75]} yTicks={[1.0, 1.1, 1.3, 1.5]} xLabel="Inlet-lip Mach number M₁" yLabel="A₁/Ath" />
      <g className={dimClass(revealed, 1)}>
        <path d={line(.75)} className="chart-line" />
        <text x={fx(.58)} y={fy(contractionRatio(.58, .75)) - 10} className="svg-note accent-text">M<tspan baselineShift="sub" fontSize="9">th</tspan> = 0.75</text>
      </g>
      <g className={dimClass(revealed, 2)}>
        <path d={line(.6)} className="chart-line warm-stroke" />
        <text x={fx(.49)} y={fy(contractionRatio(.49, .6)) + 22} className="svg-note warm">M<tspan baselineShift="sub" fontSize="9">th</tspan> = 0.60</text>
      </g>
    </svg>
  )
}

function ExternalFlowFigure({ revealed }) {
  return (
    <svg viewBox="0 0 720 310" className="wide-svg" aria-label="Flow dividing at the nacelle highlight and forming an external sonic bubble">
      <ArrowDefs id="ext-arrow" />
      <line x1="24" y1="252" x2="700" y2="252" className="axis-dash" />
      <text x="700" y="268" className="svg-note" textAnchor="end">centerline · upper half shown</text>
      <path d="M250 95 Q292 48 362 56 L690 76" className="nacelle-line" />
      <path d="M250 95 Q216 120 248 146" className="lip-shape" />
      <path d="M248 146 C284 154 306 158 336 158 C460 155 574 138 690 124" className="inner-line" />
      <circle cx="250" cy="95" r="6" className="mark warm-fill" />
      <path d="M256 100 L296 110" className="callout-arrow" />
      <text x="300" y="114" className="svg-note warm">highlight</text>
      <g className={dimClass(revealed, 1)}>
        <path d="M28 128 C120 128 188 118 246 98" className="flow-line" markerEnd="url(#ext-arrow-small)" />
        <path d="M256 90 C324 44 440 42 648 62" className="flow-line" markerEnd="url(#ext-arrow-small)" />
        <path d="M28 186 C120 186 190 194 252 200 C400 204 540 202 656 198" className="flow-line" markerEnd="url(#ext-arrow-small)" />
        <text x="62" y="112" className="svg-label accent-text">dividing streamline</text>
        <text x="606" y="42" className="svg-label accent-text" textAnchor="middle">outer branch</text>
        <text x="392" y="226" className="svg-note">inner branch follows the lip into the inlet</text>
      </g>
      <g className={dimClass(revealed, 2)}>
        <path d="M330 55 C362 20 448 18 480 63 C430 61 378 57 330 55 Z" className="sonic-bubble" />
        <text x="404" y="48" className="svg-label warm" textAnchor="middle">sonic bubble</text>
        <text x="510" y="90" className="svg-note warm">excess external acceleration</text>
        <text x="510" y="109" className="svg-note warm">→ cowl shock, pressure drag</text>
        <text x="510" y="128" className="svg-note warm">→ D<tspan baselineShift="sub" fontSize="9">nacelle</tspan> increases</text>
      </g>
      <text x="360" y="292" className="svg-note" textAnchor="middle">external flow contributes nacelle drag; internal flow sets mass flow and distortion</text>
    </svg>
  )
}

function NacellePressureFigure({ revealed }) {
  const arrows = [
    [64, 168, 64, 124], [102, 162, 96, 107], [142, 150, 126, 94], [184, 130, 161, 86],
    [244, 112, 226, 88], [302, 112, 292, 92], [362, 120, 360, 100], [420, 129, 425, 108],
  ]
  return (
    <svg viewBox="0 0 620 290" className="wide-svg" aria-label="Nacelle pressure distribution and axial pressure force">
      <ArrowDefs id="force-arrow" />
      <path d="M170 124 Q206 76 258 86 L520 103" className="nacelle-line" />
      <path d="M170 124 Q148 147 164 169 Q184 188 174 218" className="lip-shape" />
      <path d="M164 169 C270 158 405 160 520 168" className="inner-line" />
      <text x="408" y="78" className="svg-note">outer cowl</text>
      <text x="430" y="158" className="svg-note">inner cowl</text>
      <path d="M50 170 C100 170 132 153 170 124" className="capture-boundary" />
      <path d="M50 230 C100 230 132 214 174 218" className="capture-boundary" />
      <g className={dimClass(revealed, 1)}>
        {arrows.map((a, i) => <line key={i} x1={a[0]} y1={a[1]} x2={a[2]} y2={a[3]} className={i < 4 ? 'pressure-arrow warm-stroke' : 'pressure-arrow'} markerEnd="url(#force-arrow-small)" />)}
        <text x="68" y="116" className="svg-note warm">p ≈ p₀ upstream</text>
        <text x="174" y="246" className="svg-note warm">p<tspan baselineShift="sub" fontSize="9">max</tspan> at stagnation point</text>
        <text x="300" y="208" className="svg-note accent-text">p<tspan baselineShift="sub" fontSize="9">min</tspan> near inner-lip acceleration</text>
        <text x="492" y="92" className="svg-note">p → p₀ downstream</text>
      </g>
      <g className={dimClass(revealed, 2)}>
        <line x1="166" y1="85" x2="104" y2="38" className="resultant-arrow" markerEnd="url(#force-arrow)" />
        <line x1="166" y1="85" x2="166" y2="28" className="side-arrow" markerEnd="url(#force-arrow)" />
        <line x1="166" y1="85" x2="104" y2="85" className="lip-thrust-arrow" markerEnd="url(#force-arrow)" />
        <text x="68" y="28" className="svg-note positive">resultant force</text>
        <text x="176" y="26" className="svg-note accent-text">radial component</text>
        <text x="176" y="40" className="svg-note">(cancels around the annulus)</text>
        <text x="60" y="104" className="svg-note positive">lip “thrust”</text>
      </g>
      <text x="400" y="260" className="svg-note" textAnchor="middle">integrate (p - p₀) over the external cowl surface — this is lip suction, not additive drag</text>
    </svg>
  )
}

function AnnularAreaFigure() {
  return (
    <svg viewBox="0 0 430 175" className="wide-svg" aria-label="Annular area element on an axisymmetric nacelle">
      <ArrowDefs id="ann-arrow" />
      <path d="M45 110 Q86 43 154 34" className="duct-line thick" />
      <path d="M80 120 Q118 61 174 55" className="soft-line" />
      <path d="M111 72 L126 83 L117 103 L100 93 Z" className="area-patch" />
      <text x="66" y="78" className="svg-note warm">dA</text>
      <line x1="115" y1="89" x2="160" y2="89" className="pressure-arrow" markerEnd="url(#ann-arrow-small)" />
      <ellipse cx="316" cy="88" rx="68" ry="33" className="annulus" />
      <ellipse cx="316" cy="88" rx="61" ry="28" className="annulus inner" />
      <line x1="316" y1="88" x2="316" y2="58" className="measure" />
      <text x="327" y="72" className="svg-note">r</text>
      <path d="M316 55 A70 34 0 0 1 384 88" className="highlight-stroke" />
      <text x="316" y="150" className="svg-formula" textAnchor="middle">dA<tspan baselineShift="sub" fontSize="10">x</tspan> ≈ 2πr dr</text>
      <text x="316" y="168" className="svg-note" textAnchor="middle">axial projection of the surface strip</text>
    </svg>
  )
}

function HighDemandFigure() {
  return (
    <svg viewBox="0 0 380 220" className="wide-svg" aria-label="High engine demand: streamtube nearly fills the capture area">
      <ArrowDefs id="hd-arrow" />
      <line x1="40" y1="109" x2="352" y2="109" className="axis-dash" />
      {/* streamtube is essentially parallel: A0 ~ A1 */}
      <path d="M40 76 C110 76 155 76 188 78" className="capture-boundary" />
      <path d="M40 142 C110 142 155 142 188 140" className="capture-boundary" />
      <path d="M188 78 Q173 82 194 87" className="lip-shape" />
      <path d="M188 140 Q173 136 194 131" className="lip-shape" />
      <path d="M188 78 C250 58 310 56 352 58" className="nacelle-line" />
      <path d="M188 140 C250 160 310 162 352 160" className="nacelle-line" />
      <path d="M194 87 C230 88 250 87 270 87 C300 85 330 82 352 80" className="inner-line" />
      <path d="M194 131 C230 130 250 131 270 131 C300 133 330 136 352 138" className="inner-line" />
      {[0, 1, 2].map(i => <path key={i} d={'M46 ' + (89 + i * 20) + ' C110 ' + (89 + i * 20) + ' 150 ' + (91 + i * 18) + ' 196 ' + (94 + i * 15) + ' C260 ' + (94 + i * 15) + ' 300 ' + (92 + i * 17) + ' 340 ' + (90 + i * 19)} className="flow-line" markerEnd="url(#hd-arrow-small)" />)}
      <line x1="60" y1="76" x2="60" y2="142" className="measure accent-stroke" />
      <line x1="188" y1="78" x2="188" y2="140" className="measure warm" />
      <text x="50" y="113" className="svg-formula accent-text" textAnchor="end">A₀</text>
      <text x="200" y="113" className="svg-formula warm">A₁</text>
      <text x="190" y="196" className="svg-note" textAnchor="middle">A₀ ≈ A₁ · high M₁ · little or no spillage</text>
    </svg>
  )
}

function LowDemandFigure() {
  return (
    <svg viewBox="0 0 380 220" className="wide-svg" aria-label="Low engine demand: streamtube contracts well ahead of the lip and flow spills around it">
      <ArrowDefs id="ld-arrow" />
      <line x1="40" y1="109" x2="352" y2="109" className="axis-dash" />
      {/* A0 < A1: the captured streamtube EXPANDS on its way to the highlight */}
      <path d="M40 89 C110 89 152 84 188 78" className="capture-boundary" />
      <path d="M40 129 C110 129 152 134 188 140" className="capture-boundary" />
      <path d="M188 78 Q173 82 194 87" className="lip-shape" />
      <path d="M188 140 Q173 136 194 131" className="lip-shape" />
      <path d="M188 78 C250 58 310 56 352 58" className="nacelle-line" />
      <path d="M188 140 C250 160 310 162 352 160" className="nacelle-line" />
      <path d="M194 87 C230 88 250 87 270 87 C300 85 330 82 352 80" className="inner-line" />
      <path d="M194 131 C230 130 250 131 270 131 C300 133 330 136 352 138" className="inner-line" />
      {/* captured flow */}
      <path d="M46 99 C110 99 152 95 198 94 C260 94 300 92 340 90" className="flow-line" markerEnd="url(#ld-arrow-small)" />
      <path d="M46 119 C110 119 152 123 198 124 C260 124 300 126 340 128" className="flow-line" markerEnd="url(#ld-arrow-small)" />
      {/* spilled flow: outside the dividing streamline, over the cowl */}
      <path d="M46 76 C110 76 152 70 188 66 C242 46 302 44 348 48" className="flow-line" markerEnd="url(#ld-arrow-small)" />
      <path d="M46 142 C110 142 152 148 188 152 C242 172 302 174 348 170" className="flow-line" markerEnd="url(#ld-arrow-small)" />
      <circle cx="188" cy="78" r="4.5" className="mark warm-fill" />
      <text x="190" y="38" className="svg-note warm" textAnchor="middle">spilled flow goes outside the cowl</text>
      <line x1="58" y1="89" x2="58" y2="129" className="measure accent-stroke" />
      <line x1="188" y1="78" x2="188" y2="140" className="measure warm" />
      <text x="48" y="113" className="svg-formula accent-text" textAnchor="end">A₀</text>
      <text x="200" y="113" className="svg-formula warm">A₁</text>
      <text x="190" y="196" className="svg-note" textAnchor="middle">A₀ &lt; A₁ · low M₁ · streamtube expands · spillage drag rises</text>
    </svg>
  )
}

function BackPressureChainFigure({ revealed }) {
  const boxes = [
    { x: 10, w: 128, lines: ['N / \u221ATt2', '(rotor speed)'] },
    { x: 168, w: 150, lines: ['corrected-flow', 'demand ↑'] },
    { x: 348, w: 132, lines: ['M at fixed A2', '(mass-flow fn.)'] },
    { x: 510, w: 130, lines: ['p2 lower', '(vs. lower N)'] },
    { x: 670, w: 128, lines: ['sets A0 upstream', '(mass balance)'] },
  ]
  return (
    <svg viewBox="0 0 810 190" className="wide-svg" aria-label="Chain from rotor speed to the upstream capture area">
      <ArrowDefs id="chain-arrow" />
      {boxes.map((b, i) => <g key={i} className={dimClass(revealed, Math.min(i, 1) + 1)}>
        <rect x={b.x} y="64" width={b.w} height="60" rx="9" className="card-rect" fill="rgba(94,200,216,.07)" stroke="var(--accent)" strokeWidth="1.4" />
        <text x={b.x + b.w / 2} y="90" className="svg-label" textAnchor="middle">{b.lines[0]}</text>
        <text x={b.x + b.w / 2} y="108" className="svg-note" textAnchor="middle">{b.lines[1]}</text>
      </g>)}
      {[0, 1, 2, 3].map(i => <line key={i} x1={boxes[i].x + boxes[i].w + 2} y1="94" x2={boxes[i + 1].x - 2} y2="94" className="flow-line" markerEnd="url(#chain-arrow)" />)}
      <text x="405" y="26" className="svg-note" textAnchor="middle">higher N → stronger upstream suction → larger captured streamtube (less spillage)</text>
      <text x="405" y="168" className="svg-note" textAnchor="middle">lower N → weaker suction → streamtube contracts before the lip → spillage</text>
    </svg>
  )
}

function StationMapFigure({ revealed }) {
  const stations = [
    { x: 70, y1: 92, y2: 168, tag: '0', name: 'free stream', tone: 'accent-text' },
    { x: 240, y1: 78, y2: 182, tag: '1', name: 'highlight', tone: 'warm' },
    { x: 330, y1: 94, y2: 166, tag: 'th', name: 'throat', tone: 'violet' },
    { x: 640, y1: 84, y2: 176, tag: '2', name: 'fan face', tone: 'positive' },
  ]
  return (
    <svg viewBox="0 0 760 290" className="wide-svg" aria-label="Station numbering from free stream to the fan face">
      <ArrowDefs id="stn-arrow" />
      <line x1="40" y1="130" x2="700" y2="130" className="axis-dash" />
      <path d="M40 92 C120 92 180 88 240 78" className="capture-boundary" />
      <path d="M40 168 C120 168 180 172 240 182" className="capture-boundary" />
      <path d="M240 78 Q216 86 238 92" className="lip-shape" />
      <path d="M240 182 Q216 174 238 168" className="lip-shape" />
      <path d="M240 78 C350 56 520 52 700 62" className="nacelle-line" />
      <path d="M240 182 C350 204 520 208 700 198" className="nacelle-line" />
      <path d="M238 92 C290 96 300 94 330 94 C450 90 560 86 640 84" className="inner-line" />
      <path d="M238 168 C290 164 300 166 330 166 C450 170 560 174 640 176" className="inner-line" />
      <path d="M646 88 L674 100 L674 160 L646 172 Z" className="fan" />
      {stations.map(s => <g key={s.tag} className={dimClass(revealed, 1)}>
        <line x1={s.x} y1="52" x2={s.x} y2="206" className="guide" />
        <text x={s.x} y="46" className={'svg-formula ' + s.tone} textAnchor="middle">{s.tag}</text>
        <text x={s.x} y="222" className="svg-note" textAnchor="middle">{s.name}</text>
      </g>)}
      <g className={dimClass(revealed, 2)}>
        <line x1="70" y1="252" x2="640" y2="252" className="measure accent-stroke" markerStart="url(#stn-arrow-small)" markerEnd="url(#stn-arrow-small)" />
        <text x="355" y="246" className="svg-note accent-text" textAnchor="middle">π_d = p_t2/p_t0 · spans 0 → 2</text>
        <line x1="330" y1="280" x2="640" y2="280" className="measure violet" markerStart="url(#stn-arrow-small)" markerEnd="url(#stn-arrow-small)" />
        <text x="485" y="274" className="svg-note violet" textAnchor="middle">C_PR · internal diffuser only, th → 2</text>
      </g>
      <text x="380" y="16" className="svg-note" textAnchor="middle">§2 numbers a generic diffuser 1 → 2; from §3 on, station 1 is the highlight</text>
    </svg>
  )
}

const etaD = (M0, pid) => ((1 + (G - 1) / 2 * M0 * M0) * Math.pow(pid, (G - 1) / G) - 1) / ((G - 1) / 2 * M0 * M0)

function InletEfficiencyPlot({ revealed }) {
  const x0 = 74, y0 = 22, w = 460, h = 224
  const xmin = .3, xmax = 2.5, ymin = .6, ymax = 1.02
  const fx = x => x0 + (x - xmin) / (xmax - xmin) * w
  const fy = y => y0 + h - (y - ymin) / (ymax - ymin) * h
  const xs = Array.from({ length: 89 }, (_, i) => xmin + i * (xmax - xmin) / 88)
  const line = (pid) => xs.map((M, i) => (i ? 'L' : 'M') + fx(M).toFixed(1) + ' ' + fy(Math.max(ymin, etaD(M, pid))).toFixed(1)).join(' ')
  return (
    <svg viewBox="0 0 600 320" className="wide-svg" aria-label="Inlet adiabatic efficiency versus flight Mach number">
      <PlotAxes x0={x0} y0={y0} w={w} h={h} fx={fx} fy={fy} xTicks={[.5, 1.0, 1.5, 2.0, 2.5]} yTicks={[.6, .7, .8, .9, 1.0]} xLabel="Flight Mach number M₀" yLabel={<>η<tspan baselineShift="sub" fontSize="9">d</tspan></>} />
      <g className={dimClass(revealed, 1)}>
        <path d={line(.98)} className="chart-line warm-stroke" />
        <text x={fx(1.9)} y={fy(etaD(1.9, .98)) + 26} className="svg-note warm">π<tspan baselineShift="sub" fontSize="9">d</tspan> = 0.980</text>
      </g>
      <g className={dimClass(revealed, 2)}>
        <path d={line(.995)} className="chart-line positive-stroke" />
        <text x={fx(1.15)} y={fy(etaD(1.15, .995)) - 14} className="svg-note positive">π<tspan baselineShift="sub" fontSize="9">d</tspan> = 0.995</text>
      </g>
      <g className={dimClass(revealed, 3)}>
        <circle cx={fx(.8)} cy={fy(etaD(.8, .98))} r="5" className="mark warm-fill" />
        <text x={fx(.85)} y={fy(etaD(.8, .98)) + 26} className="svg-note warm">M₀ = 0.8 → η<tspan baselineShift="sub" fontSize="9">d</tspan> ≈ 0.95</text>
        <circle cx={fx(.3)} cy={fy(etaD(.3, .98))} r="5" className="mark warm-fill" />
        <text x={fx(.34)} y={fy(etaD(.3, .98)) + 18} className="svg-note warm">M₀ = 0.3 → η<tspan baselineShift="sub" fontSize="9">d</tspan> ≈ 0.67</text>
      </g>
      <text x="300" y="312" className="svg-note" textAnchor="middle">same π<tspan baselineShift="sub" fontSize="9">d</tspan>, very different η<tspan baselineShift="sub" fontSize="9">d</tspan> — at low M₀ there is little ram rise to recover</text>
    </svg>
  )
}

function OverviewSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="two-col compare-copy">
      <Card title="Subsonic inlet" tone={ACCENT} className={dimClass(revealed, 1)}>
        <ul className="clean-list compact">
          <li><b>Rounded, blunt lip</b></li>
          <li>Increasing flow area</li>
          <li>Dominant issue: boundary-layer separation</li>
        </ul>
      </Card>
      <Card title="Supersonic inlet" tone={GOLD} className={dimClass(revealed, 2)}>
        <ul className="clean-list compact">
          <li><b>Sharp lip</b></li>
          <li>Converging–diverging duct with a variable throat</li>
          <li>Dominant issue: shock–boundary-layer interaction, unstart, buzz</li>
        </ul>
      </Card>
    </div>
    <InletComparisonFigure revealed={revealed} />
    <div className="callout strip-callout">
      <b>This unit’s focus:</b> subsonic boundary-layer separation. Supersonic inlets will focus on the shock system and how it interacts with the boundary layer.
    </div>
  </SlideFrame>
}

function ObjectivesSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="three-col objective-grid">
      <Card title="Flow quality" tone={ACCENT} className={dimClass(revealed, 1)}>
        <ul className="clean-list">
          <li>Low steady-state distortion</li>
          <li>Low dynamic distortion</li>
          <li>Manage boundary-layer separation</li>
          <li>Internal performance dominated by <b>throat Mach number</b></li>
        </ul>
      </Card>
      <Card title="Installed performance" tone={GOLD} className={dimClass(revealed, 2)}>
        <ul className="clean-list">
          <li>Low installation drag</li>
          <li>Low noise</li>
          <li>Low observables, when required</li>
          <li>Allow engine thrust growth</li>
        </ul>
      </Card>
      <Card title="Operations and support" tone={GREEN} className={dimClass(revealed, 3)}>
        <ul className="clean-list">
          <li>Accessibility</li>
          <li>Inspectability and reliability</li>
          <li>Maintainability</li>
          <li>Repairability</li>
        </ul>
      </Card>
    </div>
    <div className="callout wide-callout">
      <span className="eyebrow">Subsonic-inlet summary</span>
      Aerodynamic performance has both <b>internal</b> and <b>external</b> components; the best internal diffuser is not automatically the best installed inlet.
    </div>
  </SlideFrame>
}

function StationsSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <Card title="Station map for the whole unit" tone={ACCENT}><StationMapFigure revealed={revealed} /></Card>
    <div className="callout strip-callout">
      <b>Watch the collision:</b> Section 2 studies a generic diffuser and calls its inlet and exit <b>1</b> and <b>2</b>. From Section 3 onward, <b>1</b> means the inlet-lip highlight. When both are in play, name the internal diffuser <b>th → 2</b> and reserve <b>0 → 1</b> for external diffusion.
    </div>
  </SlideFrame>
}

function MetricsCompareSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="plot-layout balanced">
      <div className="plot-side">
        <Card title="1 · C_PR — static-pressure recovery coefficient" tone={VIOLET} className={dimClass(revealed, 1)}>
          <Equation>C<sub>PR</sub> = (p₂ - p<sub>th</sub>)/q<sub>th</sub></Equation>
          <p><b>Asks:</b> what fraction of the incoming dynamic head did the duct convert to static pressure? A <b>duct-geometry</b> metric, measured across the internal diffuser only.</p>
          <p className="small-copy">Ideal incompressible: 1 - 1/AR². Real: <b>0.5-0.8</b>. Effectiveness η<sub>D</sub> = C<sub>PR</sub>/C<sub>PR,ideal</sub>.</p>
        </Card>
        <Card title="2 · π_d — total-pressure recovery" tone={GREEN} className={dimClass(revealed, 2)}>
          <Equation accent>π<sub>d</sub> = p<sub>t2</sub>/p<sub>t0</sub></Equation>
          <p><b>Asks:</b> how much total pressure survived from free stream to fan face? A <b>loss</b> metric, and the number the cycle deck consumes.</p>
          <p className="small-copy">Subsonic cruise: <b>0.97-0.995</b>. Note C<sub>PR</sub> ≈ 0.9 and π<sub>d</sub> ≈ 0.9 mean completely different things - a π<sub>d</sub> of 0.9 would be a badly broken inlet.</p>
        </Card>
      </div>
      <div className="plot-side">
        <Card title="3 · η_d — adiabatic (isentropic) inlet efficiency" tone={GOLD} className={dimClass(revealed, 3)}>
          <p>The inlet is adiabatic and does no work, so T<sub>t</sub> is constant and &ldquo;efficiency&rdquo; cannot mean an enthalpy ratio across it. Instead compare the <b>ideal</b> static-to-total compression that would reach the actual p<sub>t2</sub> against the <b>full ram</b> rise available at M₀:</p>
          <Equation>η<sub>d</sub> = (h<sub>t2s</sub> - h₀)/(h<sub>t0</sub> - h₀) = (T<sub>t2s</sub> - T₀)/(T<sub>t0</sub> - T₀)</Equation>
          <Equation accent>η<sub>d</sub> = {'{'}[1 + (γ-1)M₀²/2]·π<sub>d</sub><sup>(γ-1)/γ</sup> - 1{'}'} / {'{'}(γ-1)M₀²/2{'}'}</Equation>
          <p className="small-copy">π<sub>d</sub> = 1 gives η<sub>d</sub> = 1. Everything else follows from π<sub>d</sub> and M₀ alone.</p>
        </Card>
        <Card title="Why η_d collapses at low M₀" tone={ACCENT} className={dimClass(revealed, 3)}>
          <InletEfficiencyPlot revealed={revealed} />
        </Card>
      </div>
    </div>
    <div className="callout wide-callout">
      <span className="eyebrow">The one sentence to remember</span>
      <b>C_PR</b> grades the duct, <b>π_d</b> grades the loss, <b>η_d</b> grades the loss <i>relative to the ram compression available at that flight condition</i>. That last normalisation is why the same π_d = 0.98 reads as η_d ≈ 0.95 at M₀ = 0.8 but ≈ 0.67 at M₀ = 0.3 - and why η_d is the natural metric for supersonic inlets while π_d is the robust one for subsonic.
    </div>
  </SlideFrame>
}

function DriversSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="driver-layout">
      <Card title="Diffuser-performance map" tone={ACCENT} className={dimClass(revealed, 1)}>
        <Equation accent>
          C<sub>PR</sub> = f(AR, n/R₁, β, centerline shape)
        </Equation>
        <div className="variable-grid">
          <span><b>AR</b><small>area ratio</small></span>
          <span><b>n/R₁</b><small>axial length ÷ inlet radius R₁</small></span>
          <span><b>β</b><small>inlet blockage</small></span>
          <span><b>shape</b><small>offset/curvature</small></span>
        </div>
      </Card>
      <Card title="Geometry rule of thumb" tone={GREEN} className={dimClass(revealed, 2)}>
        <div className="big-number">8.7°</div>
        <p>A cubic internal diffuser contour was noted with a maximum wall angle of about <b>8.7°</b>.</p>
        <div className="mini-duct">
          <svg viewBox="0 0 300 90">
            <path d="M15 38 C105 38 156 20 282 9 M15 52 C105 52 156 70 282 81" className="duct-line" />
            <line x1="22" y1="45" x2="272" y2="45" className="axis-dash" />
          </svg>
        </div>
      </Card>
      <Card title="Cruise and installed effects" tone={GOLD} className={dimClass(revealed, 3)}>
        <ul className="clean-list">
          <li>Subsonic cruise capture ratio ≈ <b>0.70</b></li>
          <li>Additive drag and spillage drag</li>
          <li>Lip thrust and lip bluntness</li>
          <li>Engine-face distortion can be most problematic at <b>takeoff and climb</b></li>
        </ul>
      </Card>
    </div>
  </SlideFrame>
}

function DefinitionsSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="definition-stack">
      <Card title="1 · Distortion" tone={RED} className={dimClass(revealed, 1)}>
        <p>Nonuniform flow entering the fan or compressor - often large patches of <b>low-energy, low-momentum flow</b>. It can destabilize compressor/fan aerodynamics, degrade performance, or cause stall. The most common measure is <b>total-pressure distortion</b>.</p>
        <div className="distortion-face" aria-label="Engine face with a low total-pressure patch"><span /></div>
      </Card>
      <Card title="2 · Boundary layer" tone={ACCENT} className={dimClass(revealed, 2)}>
        <p>The thin, viscous region adjacent to a wall. Separation causes inlet stall and distortion; its behavior is strongly characterized by <b>Reynolds number</b>.</p>
        <svg viewBox="0 0 360 95" className="inline-svg">
          <ArrowDefs id="def-bl" />
          <line x1="20" y1="74" x2="340" y2="74" className="wall" />
          {[0, 1, 2, 3].map(i => <path key={i} d={'M30 ' + (65 - i * 12) + ' Q120 ' + (58 - i * 8) + ' 310 ' + (48 - i * 8)} className="flow-line" markerEnd="url(#def-bl-small)" />)}
          <path d="M30 72 Q110 34 310 23" className="boundary-edge" />
        </svg>
      </Card>
      <Card title="3 · Capture streamtube" tone={GREEN} className={dimClass(revealed, 3)}>
        <p>A control volume extending from the free-stream capture area <b>A₀</b> to the inlet-lip highlight at <b>A₁</b>. It <b>pre-diffuses</b> the flow before the flow enters the nacelle and inlet.</p>
        <svg viewBox="0 0 360 95" className="inline-svg">
          <line x1="18" y1="48" x2="348" y2="48" className="axis-dash" />
          <path d="M18 33 C110 33 170 30 232 26 M18 63 C110 63 170 66 232 70" className="capture-boundary" />
          <path d="M232 26 C272 20 310 18 348 18 M232 70 C272 76 310 78 348 78" className="nacelle-line" />
          <path d="M232 26 Q220 30 236 31 M232 70 Q220 66 236 65" className="lip-shape" />
          <path d="M236 31 C272 30 310 28 348 26 M236 65 C272 66 310 68 348 70" className="inner-line" />
          <line x1="44" y1="33" x2="44" y2="63" className="measure accent-stroke" />
          <line x1="232" y1="26" x2="232" y2="70" className="measure positive" />
          <text x="36" y="52" className="svg-note accent-text" textAnchor="end">A₀</text>
          <text x="242" y="52" className="svg-note positive">A₁</text>
          <text x="130" y="18" className="svg-note">cruise: A₀/A₁ ≈ 0.7</text>
        </svg>
      </Card>
    </div>
  </SlideFrame>
}

function MetricsSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="metrics-grid">
      <Card title="Pressure gradient and centerline offset" tone={ACCENT} className={dimClass(revealed, 1)}>
        <p>A pressure gradient says whether static pressure <b>climbs or drops</b> in the flow direction, making forward progress harder or easier. An S-duct adds curvature through an offset centerline.</p>
        <SDuctFigure />
      </Card>
      <Card title="Static-pressure recovery coefficient" tone={GREEN} className={dimClass(revealed, 2)}>
        <p>Measures how effectively the diffuser converts kinetic energy into static pressure.</p>
        <Equation accent>C<sub>PR</sub> = Δp /(ρ₁V₁²/2) = (p₂ - p₁)/q₁</Equation>
        <p className="micro-copy"><b>q₁ is dynamic pressure - not heat.</b></p>
        <Equation>C<sub>PR,ideal</sub> = 1 - 1/AR²</Equation>
        <p className="micro-copy">AR = exit area / inlet area · <b>incompressible</b> ideal</p>
        <p className="small-copy"><b>Static, not total.</b> C<sub>PR</sub> is not the inlet total-pressure recovery π<sub>d</sub> = p<sub>t2</sub>/p<sub>t0</sub>. See 1.5.</p>
      </Card>
      <Card title="What “stall” means here" tone={RED} className={dimClass(revealed, 3)}>
        <dl className="term-list">
          <dt>Detached/separated BL</dt><dd>The boundary layer leaves contact with the wall.</dd>
          <dt>Recirculation</dt><dd>Flow swirls in a trapped pocket next to the wall.</dd>
          <dt>Stall</dt><dd>Local detached layers, recirculation zones, and large eddies dominate the diffuser flow.</dd>
        </dl>
      </Card>
    </div>
  </SlideFrame>
}

function GeometriesSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="geometry-grid">
      <DiffuserIcon kind="rect" label="2D rectangular" active={revealed >= 1} />
      <DiffuserIcon kind="conical" label="Conical" active={revealed >= 2} />
      <DiffuserIcon kind="annular" label="Annular" active={revealed >= 3} />
      <DiffuserIcon kind="transition" label="Rectangular → circular transition" active={revealed >= 4} />
    </div>
    <Card className="parameter-card" title="Geometry parameters preserved from the notes" tone={GOLD}>
      <GeometryParametersFigure />
    </Card>
  </SlideFrame>
}

function RecoverySlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="plot-layout">
      <Card title="Ideal incompressible one-dimensional diffuser" tone={ACCENT} className="plot-card">
        <RecoveryPlot revealed={revealed} />
      </Card>
      <div className="plot-side">
        <Equation accent>C<sub>PR,ideal</sub> = 1 - 1/AR²</Equation>
        <AreaRatioSketches revealed={revealed} />
        <div className={dimClass(revealed, 3) + ' callout'}>
          Increasing AR beyond about 3 buys progressively less ideal static-pressure recovery - while the real boundary layer still pays for the stronger adverse gradient. <b>These percentages are C<sub>PR</sub>, not π<sub>d</sub>:</b> a good inlet has C<sub>PR</sub> ≈ 0.8 and π<sub>d</sub> ≈ 0.99 at the same time.
        </div>
      </div>
    </div>
  </SlideFrame>
}

function GradientSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="gradient-layout">
      <Card title="Pressure rise over the same length L" tone={ACCENT}>
        <PressureGradientPlot revealed={revealed} />
        <Equation>dp/dx ≈ (p₂ - p₁)/(x₂ - x₁) = Δp/L</Equation>
      </Card>
      <Card title="Boundary-layer response" tone={RED}>
        <BoundaryLayerStages revealed={revealed} />
        <p className="small-copy">As C<sub>PR</sub> increases without extending the diffuser, the flow finds it increasingly difficult to remain attached.</p>
      </Card>
    </div>
  </SlideFrame>
}

function StallSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="stall-grid">
      {[1, 2, 3, 4].map(stage => <StallSketch key={stage} stage={stage} revealed={revealed} />)}
    </div>
    <div className="callout strip-callout"><b>Physical picture:</b> fluid in the separated region becomes trapped and recirculates while the outer flow passes over it. <b>Read the regimes off the (2θ, L/W₁) map:</b> a long, gently divergent duct and a short, steeply divergent one can share the same AR and land in completely different regimes - which is exactly the point of 1.2.</div>
  </SlideFrame>
}

function CaptureSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="capture-layout">
      <Card title="Capture-streamtube geometry" tone={ACCENT} className="capture-figure-card">
        <CaptureStreamtubeFigure revealed={revealed} />
      </Card>
      <div className="capture-side">
        <Card title="Definition" tone={GREEN} className={dimClass(revealed, 1)}>
          <p>The boundary is set by the <b>outermost streamlines that eventually enter the engine</b>.</p>
          <Equation>A₀/A₁ = capture ratio = MFR</Equation>
        </Card>
        <Card title="At the lip and fan hub" tone={GOLD} className={dimClass(revealed, 2)}>
          <p><b>Only when A₀ &lt; A₁.</b> At cruise the streamtube expands and the flow decelerates ahead of the lip - external diffusion. At static and takeoff the engine demands more than A₁ passes naturally, A₀ &gt; A₁, and the streamtube <i>contracts</i> and <b>accelerates</b> into the inlet. Around the fan hub the flow must squeeze into less annular area, so it accelerates locally in either case.</p>
        </Card>
      </div>
    </div>
  </SlideFrame>
}

function CaptureDerivationSlide({ slide, revealed }) {
  const items = [
    <><b>Continuity</b><Equation>ρ₀u₀A₀ = ρ₁u₁A₁</Equation></>,
    <><b>Isentropic property relations</b><Equation>p<sub>t</sub>/p = (T<sub>t</sub>/T)<sup>γ/(γ-1)</sup> = (ρ<sub>t</sub>/ρ)<sup>γ</sup></Equation><Equation>ρ<sub>t</sub>/ρ = [1 + (γ-1)M²/2]<sup>1/(γ-1)</sup></Equation></>,
    <><b>Rearrange the area ratio</b><Equation>A₀/A₁ = (ρ₁/ρ₀)(u₁/u₀)</Equation><Equation>u = Ma = M√(γRT)</Equation></>,
    <><b>Replace static temperature</b><Equation>T/T<sub>t</sub> = [1 + (γ-1)M²/2]<sup>-1</sup></Equation><p className="micro-copy">For isentropic external diffusion: p<sub>t1</sub> = p<sub>t0</sub> and T<sub>t1</sub> = T<sub>t0</sub>.</p></>,
  ]
  return <SlideFrame slide={slide}>
    <div className="derivation-grid">
      {items.map((item, i) => <Card key={i} title={'Step ' + (i + 1)} tone={[ACCENT, VIOLET, GOLD, GREEN][i]} className={dimClass(revealed, i + 1)}>{item}</Card>)}
    </div>
    <div className="callout strip-callout">The exponent in the final relation comes from combining the density exponent <b>1/(γ-1)</b> with the velocity’s temperature exponent <b>1/2</b>.</div>
  </SlideFrame>
}

function CaptureResultSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="result-layout">
      <Card title="Final area-Mach relation" tone={ACCENT} className={dimClass(revealed, 1)}>
        <Equation accent className="hero-equation">
          <span className="frac"><span>A₀</span><span>A₁</span></span>
          <span> = </span>
          <span className="frac"><span>M₁</span><span>M₀</span></span>
          <span> </span>
          <span className="frac">
            <span>[1 + (γ-1)M₀²/2]<sup>(γ+1)/[2(γ-1)]</sup></span>
            <span>[1 + (γ-1)M₁²/2]<sup>(γ+1)/[2(γ-1)]</sup></span>
          </span>
        </Equation>
        <p className="center-copy">For air, γ = 1.4. The formula follows from conservation of mass, a = √(γRT), and the isentropic property relations.</p>
      </Card>
      <div className="three-col result-cards">
        <Card title="A₀/A₁" tone={GREEN}><p>Capture ratio or mass-flow ratio: capture-streamtube area divided by inlet-lip area.</p></Card>
        <Card title="M₀" tone={GOLD}><p>Free-stream Mach number before the flow begins external diffusion.</p></Card>
        <Card title="M₁" tone={VIOLET}><p>Mach number at the inlet lip. Raising M₁ generally raises the captured fraction for fixed M₀.</p></Card>
      </div>
    </div>
  </SlideFrame>
}

function MfrSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="plot-layout balanced">
      <Card title="Capture ratio A₀/A₁" tone={ACCENT} className="plot-card">
        <MassFlowPlot revealed={revealed} />
      </Card>
      <div className="plot-side">
        <Card title="What the plot says" tone={GREEN} className={dimClass(revealed, 1)}>
          <ul className="clean-list">
            <li>MFR rises steeply with M₁, reaching 1 when M₁ = M₀.</li>
            <li>At fixed M₁, raising M₀ from 0.80 to 0.95 changes MFR by only a few percent, and lowers it slightly.</li>
            <li><b>M₁ is not a design knob.</b> The engine sets ṁ; ṁ and the fixed A₁ set M₁; M₁ and M₀ then set A₀/A₁. Section 4.2 builds this chain.</li>
          </ul>
        </Card>
        <Card title="Useful reading" tone={GOLD} className={dimClass(revealed, 2)}>
          <p>At M₀ = 0.80 and M₁ ≈ 0.70, A₀/A₁ ≈ 0.95 - the free-stream tube is 95% as large as the highlight area, so spillage is small.</p>
          <p className="small-copy"><b>Reconcile with 1.2:</b> a cruise capture ratio of ≈ 0.70 corresponds to M₁ ≈ 0.44 at M₀ = 0.80, well to the left of this reading. M₁ ≈ 0.70 is a high-demand point, not typical cruise.</p>
        </Card>
      </div>
    </div>
  </SlideFrame>
}

function LipSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="lip-layout">
      <Card title="Lip-contraction ratio" tone={ACCENT}><LipContractionPlot revealed={revealed} /></Card>
      <Card title="Lip and throat geometry" tone={GOLD}><LipFlowFigure revealed={revealed} /></Card>
    </div>
    <div className="callout strip-callout">For subsonic flow, a decreasing area accelerates the stream. A common design target in the notes is <b>M̄<sub>th</sub> ≤ 0.75</b>, while keeping the local peak Mach number below 1.</div>
  </SlideFrame>
}

function ExternalSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="external-layout">
      <Card title="Dividing streamline at the highlight" tone={ACCENT}><ExternalFlowFigure revealed={revealed} /></Card>
      <Card title="Highlight vs. dividing streamline" tone={VIOLET} className={dimClass(revealed, 1)}>
        <p>The <b>highlight</b> is fixed geometry - the lip leading edge. The <b>dividing streamline</b> is a flow feature that moves with operating point.</p>
        <ul className="clean-list compact">
          <li>MFR = 1: they coincide.</li>
          <li>MFR &lt; 1 (spillage): the stagnation point sits on the <b>outer</b> cowl, aft of the highlight.</li>
          <li>MFR &gt; 1 (static, takeoff): it moves onto the <b>inner</b> surface.</li>
        </ul>
      </Card>
      <Card title="Installed-inlet quantities" tone={GOLD} className={dimClass(revealed, 2)}>
        <div className="chip-row">
          <span className="metric-chip">additive drag</span>
          <span className="metric-chip">lip suction</span>
          <span className="metric-chip">spillage drag</span>
          <span className="metric-chip">nacelle drag</span>
        </div>
      </Card>
    </div>
  </SlideFrame>
}

function SpillageMechanismSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="lip-layout">
      <Card title="High power / high N" tone={GREEN} className={dimClass(revealed, 1)}><HighDemandFigure /></Card>
      <Card title="Reduced power / low N" tone={RED} className={dimClass(revealed, 2)}><LowDemandFigure /></Card>
    </div>
    <div className="callout strip-callout">
      <b>Same relation as Section 3.3:</b> ṁ = ρ₀A₀V₀ = ρ₁A₁V₁. A₁ is fixed by the cowl. The engine's demanded ṁ, together with fixed A₁, sets M₁ — and A₀/A₁ = f(M₀, M₁) from the capture-ratio relation. <b>Raise the demand (higher N) and M₁ rises, pushing A₀/A₁ toward 1.</b> <b>Lower the demand and M₁ falls, so A₀/A₁ drops well below 1</b> — the streamtube must contract ahead of the lip, and the excess spills around the outside of the cowl.
    </div>
    <div className={dimClass(revealed, 2) + ' callout wide-callout'}>
      <span className="eyebrow">Where this shows up</span>
      Descent, approach, holding, and idle/low-power settings all reduce demanded flow relative to a fixed A₁ sized for climb or high-speed cruise — these are the spillage-prone regimes. The opposite mismatch (demand exceeds what A₁ naturally passes, e.g. static ground run or takeoff roll) instead makes the streamtube contract <b>into</b> the inlet — the reason lips need generous rounding, not spillage.
    </div>
  </SlideFrame>
}

function BackpressureSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="forces-layout">
      <Card title="From rotor speed to captured streamtube" tone={ACCENT}><BackPressureChainFigure revealed={revealed} /></Card>
      <div className="forces-side">
        <Card title="The mass-flow function, moved downstream" tone={GREEN} className={dimClass(revealed, 1)}>
          <Equation accent>ṁ√T<sub>t2</sub> / (A₂ p<sub>t2</sub>) = f(M₂)</Equation>
          <p>A₂ is fixed by the compressor face. Rotor speed N sets the corrected-flow demand on the left side — that pins M₂, and isentropically p₂/p<sub>t2</sub> = f(M₂) then pins the static pressure right at the face.</p>
        </Card>
        <Card title="Two pressure events, two locations" tone={GOLD} className={dimClass(revealed, 2)}>
          <p><b>Compare operating points, not stations.</b> Raising N lowers p₂ at the fan face <i>relative to a lower power setting</i> — that is the stronger suction that pulls in a larger streamtube. It does <b>not</b> mean pressure falls along the duct: from throat to fan face the inlet is a diffuser and static pressure <b>rises</b>. Pressure then rises again, stage by stage, through the rotor and stator rows downstream of station 2. Subsonic (elliptic) flow is what lets the fan-face pressure act as the boundary condition the whole diffuser, and the free-stream streamtube, must satisfy.</p>
        </Card>
      </div>
    </div>
  </SlideFrame>
}

function ForcesSlide({ slide, revealed }) {
  return <SlideFrame slide={slide}>
    <div className="forces-layout">
      <Card title="Pressure field and force components" tone={ACCENT}><NacellePressureFigure revealed={revealed} /></Card>
      <div className="forces-side">
        <Card title="Axial pressure force — mind the sign" tone={GREEN} className={dimClass(revealed, 1)}>
          <Equation accent>F<sub>x</sub> = -∯(p - p₀) (n̂·x̂) dA</Equation>
          <p>n̂ is the <b>outward</b> normal on the surface, so the minus sign is what makes p &gt; p₀ on a forward-facing surface push the nacelle forward. Over the rounded lip the suction peak gives a forward axial force: <b>lip thrust</b>.</p>
          <p className="small-copy">For an axisymmetric nacelle, dA<sub>x</sub> = 2πr dr is the <b>axial projection</b> of the surface strip, not its area.</p>
        </Card>
        <Card title="Two different control surfaces" tone={RED} className={dimClass(revealed, 1)}>
          <p><b>Additive drag</b> D<sub>add</sub> integrates pressure over the <b>pre-entry streamtube</b>, station 0 → 1. <b>Lip suction</b> F<sub>lip</sub> integrates pressure over the <b>external cowl forebody</b>. Different surfaces — do not merge them.</p>
          <Equation>D<sub>spillage</sub> = D<sub>add</sub> - F<sub>lip</sub></Equation>
          <p className="small-copy">At subsonic speeds a well-rounded lip recovers most of D<sub>add</sub>, so spillage drag stays small. This is <i>why</i> lip bluntness is a design variable — and why sharp supersonic lips pay a spillage penalty.</p>
        </Card>
        <Card title="Axisymmetric area element" tone={GOLD} className={dimClass(revealed, 2)}>
          <AnnularAreaFigure />
        </Card>
      </div>
    </div>
  </SlideFrame>
}

function SummarySlide({ slide, revealed }) {
  const points = [
    ['Geometry matters', 'Short, long, fat, and narrow diffusers can have different C_PR because the adverse pressure gradient - not area ratio alone - controls attachment.'],
    ['Three metrics, three jobs', 'C_PR grades the duct (0.5-0.8). Pi_d grades the loss (0.97-0.995) and feeds the cycle. Eta_d grades that loss against the ram rise available at M0. Never quote one for another.'],
    ['Know the stall regimes', 'Separation is dangerous because it creates low-energy distortion and unsteady swirling flow at the fan or compressor face. Regimes live on a (2-theta, L/W1) map.'],
    ['Get the drag bookkeeping right', 'Additive drag acts on the pre-entry streamtube; lip suction acts on the external cowl. Spillage drag is the difference, not either one alone.'],
    ['Protect the throat', 'Lip geometry and contraction set the throat velocity profile; keep mean throat Mach around or below 0.75 and avoid local sonic flow.'],
    ['Demand sets capture, not the reverse', 'Rotor speed sets corrected flow, which sets M1 at the fixed A1, which sets A0/A1. Spillage is the symptom of low demand, never a choice.'],
    ['Transition ducts need both ratios', 'Track n/R1 as well as area ratio AR; centerline curvature and cross-section transition alter the boundary layers.'],
  ]
  return <SlideFrame slide={slide}>
    <div className={dimClass(revealed, 1) + ' takeaway-grid'}>
      {points.map(([title, body], i) => <Card key={title} title={(i + 1) + ' · ' + title} tone={[ACCENT, VIOLET, RED, GOLD, GREEN, ACCENT, VIOLET][i]}><p>{body}</p></Card>)}
    </div>
  </SlideFrame>
}

function SlideRouter({ slide, revealed }) {
  switch (slide.type) {
    case 'overview': return <OverviewSlide slide={slide} revealed={revealed} />
    case 'stations': return <StationsSlide slide={slide} revealed={revealed} />
    case 'objectives': return <ObjectivesSlide slide={slide} revealed={revealed} />
    case 'drivers': return <DriversSlide slide={slide} revealed={revealed} />
    case 'definitions': return <DefinitionsSlide slide={slide} revealed={revealed} />
    case 'metrics': return <MetricsSlide slide={slide} revealed={revealed} />
    case 'metricsCompare': return <MetricsCompareSlide slide={slide} revealed={revealed} />
    case 'geometries': return <GeometriesSlide slide={slide} revealed={revealed} />
    case 'recovery': return <RecoverySlide slide={slide} revealed={revealed} />
    case 'gradient': return <GradientSlide slide={slide} revealed={revealed} />
    case 'stall': return <StallSlide slide={slide} revealed={revealed} />
    case 'capture': return <CaptureSlide slide={slide} revealed={revealed} />
    case 'captureDerivation': return <CaptureDerivationSlide slide={slide} revealed={revealed} />
    case 'captureResult': return <CaptureResultSlide slide={slide} revealed={revealed} />
    case 'mfr': return <MfrSlide slide={slide} revealed={revealed} />
    case 'lip': return <LipSlide slide={slide} revealed={revealed} />
    case 'external': return <ExternalSlide slide={slide} revealed={revealed} />
    case 'spillageMechanism': return <SpillageMechanismSlide slide={slide} revealed={revealed} />
    case 'backpressure': return <BackpressureSlide slide={slide} revealed={revealed} />
    case 'forces': return <ForcesSlide slide={slide} revealed={revealed} />
    case 'summary': return <SummarySlide slide={slide} revealed={revealed} />
    default: return null
  }
}

export default function Presentation({ slides: slideData = slides, meta: metaData = meta }) {
  const [slideIdx, setSlideIdx] = useState(0)
  const [revealed, setRevealed] = useState(0)
  const [direction, setDirection] = useState(null)
  const [animKey, setAnimKey] = useState(0)

  const current = slideData[slideIdx]
  const steps = current?.steps ?? 1
  const hint = `← → or click · ${steps} reveal${steps === 1 ? '' : 's'}`

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= slideData.length) return
    setDirection('exit')
    setTimeout(() => {
      setSlideIdx(idx)
      setRevealed(0)
      setAnimKey(k => k + 1)
      setDirection('enter')
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
    const onKey = (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === ' ') {
        event.preventDefault()
        advance()
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault()
        retreat()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [advance, retreat])

  const stageClick = (event) => {
    if (event.target.closest('.nav-btn') || event.target.closest('.nav-dot')) return
    advance()
  }

  const rawProgress = slideData.length > 1
    ? ((slideIdx + revealed / Math.max(steps, 1)) / (slideData.length - 1)) * 100
    : 100
  const progress = Math.max(0, Math.min(100, rawProgress))

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

      <div className="stage" onClick={stageClick}>
        <div className="slide-wrapper">
          <div className={'slide active' + (direction === 'exit' ? ' exit' : '')} key={animKey}>
            <SlideRouter slide={current} revealed={revealed} />
          </div>
          <div className="progress-bar" style={{ width: progress + '%' }} />
        </div>
      </div>

      <div className="nav-bar">
        <button className="nav-btn" onClick={retreat} disabled={slideIdx === 0 && revealed === 0}>← Prev</button>
        <div className="nav-dots">
          {slideData.map((_, i) => <div key={i} className={'nav-dot' + (i === slideIdx ? ' active' : '')} onClick={(event) => { event.stopPropagation(); goTo(i) }} />)}
        </div>
        <button className="nav-btn" onClick={advance} disabled={slideIdx === slideData.length - 1 && revealed >= steps}>Next →</button>
        <span className="nav-hint">{hint}</span>
      </div>
    </div>
  )
}

const CSS = `
:root{
  --bg:#0d1b2a; --panel:#13243a; --panel2:#102035; --ink:#eaf1f8; --muted:#8da4be;
  --accent:#5ec8d8; --accent2:#f0a93b; --bad:#e2685c; --pos:#5fd39a; --violet:#a993e8;
  --rule:#27405e; --display:'Georgia','Times New Roman',serif;
  --body:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
}
*{box-sizing:border-box}
html,body,#root{height:100%;margin:0}
.app{height:100vh;height:100dvh;width:100%;display:flex;flex-direction:column;
  background:radial-gradient(1200px 700px at 70% -10%,#163152 0%,var(--bg) 55%);
  color:var(--ink);font-family:var(--body)}
.top-bar{display:flex;align-items:center;gap:12px;padding:14px 26px;border-bottom:1px solid var(--rule);font-size:13px;letter-spacing:.04em}
.course-id{color:var(--accent);font-weight:700}.top-bar-divider{width:1px;height:14px;background:var(--rule)}
.deck-title{color:var(--muted)}.top-bar-spacer{flex:1}.slide-counter{color:var(--muted);font-variant-numeric:tabular-nums}
.stage{flex:1;min-height:0;display:flex;align-items:flex-start;justify-content:center;padding:24px 38px;cursor:pointer;overflow:auto}
.slide-wrapper{margin:auto;position:relative;width:100%;max-width:1180px}.slide{width:100%}
.slide.exit .slide-inner{opacity:0;transform:translateY(-10px);transition:.24s ease}.slide-inner{width:100%}
.anim-in{animation:fadeUp .5s ease both}@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.section-number{font-family:var(--display);color:var(--accent);font-size:14px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:8px}
.slide-heading{font-family:var(--display);font-size:32px;line-height:1.15;margin:2px 0 0}.heading-rule{width:70px;height:3px;background:var(--accent);margin:12px 0}
.cf-note{font-size:14.5px;line-height:1.5;color:var(--muted);max-width:1120px;margin:0}.cf-note--lead{color:var(--ink)}
.slide-content{margin-top:14px}.reveal{opacity:.24;filter:saturate(.45);transition:opacity .3s ease,filter .3s ease,transform .3s ease}.reveal.on{opacity:1;filter:none}

.card{--tone:var(--accent);background:linear-gradient(145deg,rgba(255,255,255,.015),transparent 55%),var(--panel);border:1px solid var(--rule);border-top:2px solid var(--tone);border-radius:12px;padding:12px 14px;min-width:0}
.card-title{font-size:13px;color:var(--tone);letter-spacing:.02em;margin:0 0 7px;font-weight:750}.card p{font-size:13.5px;line-height:1.48;color:var(--muted);margin:4px 0}.card p b{color:var(--ink)}
.clean-list{margin:4px 0 0;padding-left:19px;color:var(--muted);font-size:13.5px;line-height:1.55}.clean-list li{margin:4px 0}.clean-list b{color:var(--ink)}.clean-list.compact{line-height:1.35}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px}.three-col{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.callout{background:rgba(94,200,216,.08);border:1px solid rgba(94,200,216,.28);border-radius:10px;padding:10px 13px;color:var(--muted);font-size:13.5px;line-height:1.45}.callout b{color:var(--ink)}
.strip-callout{margin-top:10px}.wide-callout{margin-top:16px;font-size:14px}.eyebrow{display:block;color:var(--accent);font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;margin-bottom:3px}
.equation{font-family:var(--display);font-size:18px;line-height:1.35;color:var(--ink);text-align:center;padding:7px 9px;background:rgba(13,27,42,.52);border:1px solid var(--rule);border-radius:8px;margin:7px 0}.equation-accent{color:var(--accent);border-color:rgba(94,200,216,.34);background:rgba(94,200,216,.06)}
.equation sup{font-size:.68em}.equation sub{font-size:.7em}.micro-copy{font-size:12px!important;text-align:center}.small-copy{font-size:12.5px!important;line-height:1.42!important}.center-copy{text-align:center}.hero-equation{font-size:22px;padding:22px 16px;display:flex;align-items:center;justify-content:center;gap:7px;flex-wrap:wrap}.frac{display:inline-grid;grid-template-rows:auto auto;text-align:center;vertical-align:middle}.frac>span:first-child{border-bottom:1.4px solid currentColor;padding:0 5px 3px}.frac>span:last-child{padding:3px 5px 0}

.wide-svg,.inline-svg{width:100%;height:auto;display:block}.wide-svg{max-height:36vh}.inline-svg{max-height:12vh}
.svg-title{font:700 15px var(--body);fill:var(--ink)}.svg-label{font:650 12px var(--body);fill:var(--ink)}.svg-note{font:11px var(--body);fill:var(--muted)}.svg-formula{font:700 14px var(--display);fill:var(--ink)}
.accent-text{fill:var(--accent)!important}.warm{color:var(--accent2);fill:var(--accent2)!important}.positive{color:var(--pos);fill:var(--pos)!important}.violet{color:var(--violet);fill:var(--violet)!important}
.duct-fill{fill:rgba(94,200,216,.055);stroke:var(--rule);stroke-width:1}.duct-line,.nacelle-line,.inner-line,.lip-shape{fill:none;stroke:var(--ink);stroke-width:2;stroke-linejoin:round;stroke-linecap:round}.duct-line.thick{stroke-width:3}.nacelle-line{stroke-width:2.4}.inner-line{stroke:var(--muted);stroke-width:2}.lip-shape{stroke:var(--accent2);stroke-width:3}
.flow-line{fill:none;stroke:var(--accent);stroke-width:1.7;stroke-linecap:round}.soft-line{fill:none;stroke:var(--muted);stroke-width:1.2}.shock-line{fill:none;stroke:var(--accent2);stroke-width:2.2}.lip-round{fill:var(--panel);stroke:var(--accent);stroke-width:3}
.hub{fill:var(--panel2);stroke:var(--muted);stroke-width:1.3}.fan{fill:rgba(94,200,216,.15);stroke:var(--accent);stroke-width:1.5}.axis,.tick,.wall{stroke:var(--muted);stroke-width:1.3}.wall{stroke-width:2.3}.axis-dash{fill:none;stroke:var(--muted);stroke-width:1.2;stroke-dasharray:5 5}.accent-stroke{stroke:var(--accent)!important}.measure{stroke:var(--muted);stroke-width:1.2;fill:none}.angle{fill:none;stroke:var(--accent2);stroke-width:1.4}.tick-label{font:10px var(--body);fill:var(--muted)}.grid-line{stroke:var(--rule);stroke-width:.7;opacity:.55}
.chart-line{fill:none;stroke:var(--accent);stroke-width:3;stroke-linecap:round}.warm-stroke{stroke:var(--accent2)!important}.violet-stroke{stroke:var(--violet)!important}.positive-stroke{stroke:var(--pos)!important}.guide{fill:none;stroke:var(--muted);stroke-width:1;stroke-dasharray:5 5}.mark{stroke:var(--bg);stroke-width:1}.warm-fill{fill:var(--accent2)}.positive-fill{fill:var(--pos)}.callout-arrow{fill:none;stroke:var(--muted);stroke-width:1.2}.profile-line{fill:none;stroke:var(--ink);stroke-width:1.8}.velocity-arrow{stroke:var(--accent);stroke-width:1.3}.reverse-arrow{stroke:var(--bad);stroke-width:1.4}.boundary-edge{fill:none;stroke:var(--accent2);stroke-width:1.3;stroke-dasharray:4 4}
.capture-boundary{fill:none;stroke:var(--accent);stroke-width:2;stroke-dasharray:8 5}.highlight-stroke{fill:none;stroke:var(--accent2);stroke-width:3}.vortex{fill:none;stroke:var(--bad);stroke-width:1.6}.jet-line{fill:none;stroke:var(--violet);stroke-width:4}.sonic-bubble{fill:rgba(240,169,59,.18);stroke:var(--accent2);stroke-width:2;stroke-dasharray:5 3}
.pressure-arrow{stroke:var(--accent);stroke-width:1.7}.resultant-arrow{stroke:var(--pos);stroke-width:5}.side-arrow{stroke:var(--accent);stroke-width:4}.lip-thrust-arrow{stroke:var(--pos);stroke-width:4}.annulus{fill:none;stroke:var(--accent);stroke-width:6}.annulus.inner{stroke:var(--panel);stroke-width:2}.area-patch{fill:rgba(240,169,59,.3);stroke:var(--accent2);stroke-width:1}

.compare-copy{max-width:760px;margin:0 auto 8px}.objective-grid{margin-top:16px}.driver-layout{display:grid;grid-template-columns:1.1fr .9fr 1fr;gap:14px}.variable-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:10px}.variable-grid span{background:rgba(255,255,255,.03);border:1px solid var(--rule);border-radius:7px;padding:7px;color:var(--ink)}.variable-grid small{display:block;color:var(--muted);font-size:10px;margin-top:2px}.big-number{font:700 44px var(--display);color:var(--pos);text-align:center;margin:2px 0}.mini-duct svg{width:100%;max-height:70px}
.definition-stack{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}.distortion-face{height:76px;width:118px;border:2px solid var(--accent);border-radius:50%;margin:8px auto 0;position:relative;background:rgba(94,200,216,.07)}.distortion-face span{position:absolute;width:48px;height:34px;border-radius:50%;background:rgba(226,104,92,.42);left:14px;top:9px;transform:rotate(-16deg);box-shadow:0 0 16px rgba(226,104,92,.25)}
.metrics-grid{display:grid;grid-template-columns:1.2fr 1fr .9fr;gap:14px}.term-list{margin:0}.term-list dt{color:var(--ink);font-weight:700;font-size:12.5px;margin-top:8px}.term-list dd{margin:2px 0 0;color:var(--muted);font-size:12px;line-height:1.35}
.geometry-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.mini-diagram{opacity:.23;filter:saturate(.4);transition:.3s;background:var(--panel);border:1px solid var(--rule);border-radius:10px;padding:7px}.mini-diagram.on{opacity:1;filter:none}.mini-diagram svg{width:100%;height:auto;display:block;max-height:14vh}.mini-label{text-align:center;color:var(--muted);font-size:12px;margin-top:2px}.parameter-card{margin-top:12px;padding-bottom:5px}.parameter-card .wide-svg{max-height:25vh}
.plot-layout{display:grid;grid-template-columns:1.55fr .85fr;gap:14px;align-items:stretch}.plot-layout.balanced{grid-template-columns:1.45fr .9fr}.plot-card .wide-svg{max-height:45vh}.plot-side{display:flex;flex-direction:column;gap:12px}.ratio-row{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.ratio-svg{width:100%;height:auto}.ratio-label{text-align:center;font-size:11px;color:var(--muted)}
.gradient-layout{display:grid;grid-template-columns:1.12fr .88fr;gap:14px}.gradient-layout .wide-svg{max-height:32vh}.bl-row{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:10px}.bl-svg{width:100%;height:auto;display:block}
.stall-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.stall-card{padding-bottom:8px}.stall-svg{width:100%;height:auto;display:block;max-height:22vh}
.capture-layout{display:grid;grid-template-columns:1.55fr .75fr;gap:14px}.capture-figure-card .wide-svg{max-height:48vh}.capture-side{display:flex;flex-direction:column;gap:12px}.derivation-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.derivation-grid .card{min-height:150px}.derivation-grid .equation{font-size:16px;margin:5px 0}.result-cards{margin-top:14px}
.lip-layout{display:grid;grid-template-columns:1fr 1fr;gap:14px}.lip-layout .wide-svg{max-height:39vh}.external-layout{display:grid;grid-template-columns:1.5fr .7fr;gap:14px}.external-layout .wide-svg{max-height:47vh}.chip-row{display:flex;gap:9px;flex-wrap:wrap;align-content:flex-start}.metric-chip{display:inline-block;color:var(--ink);font-size:12.5px;border:1px solid rgba(240,169,59,.45);background:rgba(240,169,59,.08);border-radius:20px;padding:7px 11px}
.forces-layout{display:grid;grid-template-columns:1.35fr .9fr;gap:14px}.forces-layout>.card .wide-svg{max-height:49vh}.forces-side{display:flex;flex-direction:column;gap:12px}.forces-side .wide-svg{max-height:20vh}.takeaway-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.takeaway-grid .card{min-height:124px}

.nav-bar{display:flex;align-items:center;gap:16px;padding:14px 26px;border-top:1px solid var(--rule)}.nav-btn{background:var(--panel);color:var(--ink);border:1px solid var(--rule);border-radius:7px;padding:8px 16px;font-size:14px;cursor:pointer;transition:.2s}.nav-btn:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}.nav-btn:disabled{opacity:.35;cursor:default}.nav-dots{flex:1;display:flex;gap:7px;justify-content:center;flex-wrap:wrap}.nav-dot{width:8px;height:8px;border-radius:50%;background:var(--rule);cursor:pointer;transition:.2s}.nav-dot.active{background:var(--accent);transform:scale(1.28)}.nav-hint{color:var(--muted);font-size:12px;white-space:nowrap}.progress-bar{position:absolute;left:0;bottom:-12px;height:2px;background:var(--accent);transition:width .3s ease}

@media (max-width:950px){
  .driver-layout,.metrics-grid,.definition-stack,.takeaway-grid{grid-template-columns:1fr 1fr}.plot-layout,.plot-layout.balanced,.capture-layout,.external-layout,.forces-layout{grid-template-columns:1fr}.geometry-grid{grid-template-columns:1fr 1fr}.wide-svg{max-height:none}.capture-side,.forces-side{display:grid;grid-template-columns:1fr 1fr}.stage{padding:20px 24px}
}
@media (max-width:720px){
  .slide-heading{font-size:26px}.nav-hint{display:none}.two-col,.three-col,.driver-layout,.metrics-grid,.definition-stack,.gradient-layout,.stall-grid,.lip-layout,.derivation-grid,.takeaway-grid{grid-template-columns:1fr}.capture-side,.forces-side{display:flex}.geometry-grid{grid-template-columns:1fr}.stage{padding:18px 16px}.top-bar,.nav-bar{padding-left:16px;padding-right:16px}.nav-dots{display:none}
}
@media (prefers-reduced-motion:reduce){.anim-in{animation:none}.reveal{transition:none}}
`
