import { useState, useEffect, useCallback, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// ─────────────────────────────────────────────────────────────────────────────
//  ME 3470 · Unit 6 — Ideal vs. Real Brayton Cycle
//  Same presentation system as the Unit 4 decks:
//    • navy/cyan theme via CSS variables + <style>{CSS}
//    • type-driven slide renderers, KaTeX via the shared <Equation/>
//    • step-by-step reveals, click / arrow-key advance, top bar · dots · progress
//
//  Slide types used: title · concept · equation · compare · diagram · quiz
//    'quiz'    – guess-before-reveal 3-column table (verbs auto-colored). Column 1
//                shows on load; each step reveals the next row's columns 2 & 3.
//  Figure:
//    'engine-energy' – four themed curves (mechanical / kinetic / thermal /
//                      chemical) of the working gas across the engine stations.
// ─────────────────────────────────────────────────────────────────────────────

export const meta = {
  courseId:  'ME 3470',
  deckTitle: 'Ideal vs. Real Brayton Cycle \u00b7 Four Energy Currencies, One Moving Gas',
}

// verb → color for the quiz "direction" column
const QUIZ_VERB = {
  Added:       '#5fd39a',
  Extracted:   '#f0a93b',
  Transformed: '#a78bfa',
}

// currency colors reused by the concept cards, the figure, and its legend
const C_MECH = '#e0556a', C_KIN = '#a78bfa', C_THERM = '#5ec8d8', C_CHEM = '#5fd39a'

export const slides = [

  // ── TITLE ───────────────────────────────────────────────────────────────────
  {
    type: 'title',
    eyebrow: 'Undergraduate Course \u00b7 ME 3470',
    title: 'Engine Flow-Path Tour:<br>Energy',
    subtitle:
      'A jet engine runs on four energy currencies \u2014 kinetic, mechanical, thermal, and chemical \u2014 and the whole cycle is the story of converting one into another. Track them precisely and the ideal cycle, its efficiency, and the losses that make it real all fall out of one piece of bookkeeping.',
    meta: [
      { label: 'Unit',      value: '06 \u2014 Brayton Cycle' },
      { label: 'Topics',    value: 'Energy forms \u00b7 Enthalpy \u00b7 Component energy exchange \u00b7 Cycle efficiency \u00b7 Ideal vs. real' },
      { label: 'Builds to', value: 'T\u2013s & P\u2013v diagrams \u00b7 Component efficiencies' },
    ],
  },

  // ── FLOW-PATH TOUR · 1 INLET ────────────────────────────────────────────────
  {
    type: 'flowpath',
    sectionNumber: 'Flow-Path Tour',
    number: '1',
    heading: 'The Inlet',
    accent: C_KIN,
    intro:
      'Air flows through a <strong>subsonic diffuser</strong>: velocity drops and pressure rises (ram compression). Temperature shifts, but not by much, and the duct area changes along the way.',
    assumptions: [
      { tag: 'Adiabatic',      note: 'no meaningful heat through the duct walls' },
      { tag: 'Quasi-1D',       note: 'area varies along the duct, flow stays one-dimensional' },
      { tag: 'Reversible',     note: 'dissipation ignored' },
      { tag: 'h\u2080 constant', note: 'stagnation enthalpy (and stagnation temperature) is conserved', key: true },
    ],
  },

  // ── FLOW-PATH TOUR · 2 COMPRESSOR ───────────────────────────────────────────
  {
    type: 'flowpath',
    sectionNumber: 'Flow-Path Tour',
    number: '2',
    heading: 'The Compressor',
    accent: C_MECH,
    intro:
      'Elevated-pressure air meets a <strong>bladed disk</strong> that spins the flow, doing work on it as a rise in pressure and temperature. Heat leaking through the wall is orders of magnitude smaller than that shaft work, so we drop it. Multiple stages are lumped into one.',
    assumptions: [
      { tag: 'Adiabatic',        note: 'heat loss \u226a work in \u2014 negligible by scale of energy' },
      { tag: 'Reversible',       note: 'ideal compression, no entropy generated' },
      { tag: 'Work \u2192 flow',   note: 'ideally all shaft work goes straight into flow energy' },
      { tag: 'KE \u2248 constant', note: 'flow kinetic energy barely changes' },
      { tag: 'h\u2080 rises',      note: 'stagnation enthalpy climbs \u2014 h<sub>0</sub> = c<sub>p</sub>T<sub>0</sub>', key: true },
    ],
  },

  // ── FLOW-PATH TOUR · 3 BURNER ───────────────────────────────────────────────
  {
    type: 'flowpath',
    sectionNumber: 'Flow-Path Tour',
    number: '3',
    heading: 'The Burner',
    accent: C_CHEM,
    intro:
      'Very-high-pressure air enters a <strong>constant-area duct</strong> where fuel is added and burned. Picture a heat exchanger adding heat reversibly, so the only entropy rise comes from heat addition \u2014 not from dissipation.',
    assumptions: [
      { tag: 'Rayleigh flow',    note: 'constant area with heat addition' },
      { tag: 'Inviscid',         note: 'friction losses neglected' },
      { tag: 'Ignore fuel mass', note: 'fuel-to-air ratio is small (~50:1), so \u1e41<sub>fuel</sub> is negligible' },
      { tag: 'or const-P',       note: 'alternatively, let area change to hold pressure constant along the duct' },
      { tag: 'h\u2080 increases',  note: 'stagnation enthalpy rises with the heat added', key: true },
    ],
  },

  // ── FLOW-PATH TOUR · 4 TURBINE ──────────────────────────────────────────────
  {
    type: 'flowpath',
    sectionNumber: 'Flow-Path Tour',
    number: '4',
    heading: 'The Turbine',
    accent: '#f0a93b',
    intro:
      'Very hot, high-pressure gas hits <strong>another bladed disk</strong>. Pressure downstream is lower, so the flow pushes the blades, spins them, and gives up some of its energy to the shaft. We start with an <em>uncooled</em> turbine.',
    assumptions: [
      { tag: 'Adiabatic',        note: 'same scale argument as the compressor' },
      { tag: 'KE \u2248 constant', note: 'flow kinetic energy stays about the same' },
      { tag: 'Flow \u2192 shaft',  note: 'ideally all extracted flow energy becomes shaft work' },
      { tag: 'h\u2080 falls',      note: 'stagnation enthalpy drops as work is pulled out', key: true },
    ],
  },

  // ── FLOW-PATH TOUR · 5 NOZZLE ───────────────────────────────────────────────
  {
    type: 'flowpath',
    sectionNumber: 'Flow-Path Tour',
    number: '5',
    heading: 'The Nozzle',
    accent: C_KIN,
    intro:
      'Leftover thermal and flow energy convert into <strong>kinetic energy</strong> through an adiabatic, reversible expansion. The accelerated flow is what generates <strong>thrust</strong>.',
    assumptions: [
      { tag: 'Quasi-1D',         note: 'area varies, flow stays one-dimensional' },
      { tag: 'Isentropic',       note: 'adiabatic + reversible expansion' },
      { tag: 'h\u2080 constant',   note: 'stagnation enthalpy conserved \u2014 enthalpy simply trades into speed', key: true },
    ],
  },

  // ── FOUR CURRENCIES ─────────────────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Section 1',
    heading: 'Four Currencies, One Moving Gas',
    intro:
      'Set gravity and electricity aside. Inside a gas turbine, energy shows up in four forms, and every component does its work by converting one into another. Name them precisely now \u2014 the sloppiness that calls pressure \u201cthermal\u201d will cost us later.',
    cards: [
      { tag: 'KE', accent: C_KIN, label: 'Kinetic',
        body: '&frac12;mv&sup2; for the flow, &frac12;I&omega;&sup2; for a spinning bladed disk. The energy of something <strong>moving</strong> \u2014 and what the exhaust carries out as thrust.' },
      { tag: 'p', accent: C_MECH, label: 'Mechanical (pressure)',
        body: 'Flow work, <em>Pv</em>: an <strong>organized, directed</strong> \u201cpotential to push.\u201d Built by the compressor, spent in the turbine and nozzle.' },
      { tag: 'T', accent: C_THERM, label: 'Thermal (internal)',
        body: 'Internal energy u = c<sub>v</sub>T: <strong>random, disordered</strong> molecular motion. Rises on compression, peaks in the burner.' },
      { tag: 'fuel', accent: C_CHEM, label: 'Chemical',
        body: 'Locked in fuel bonds, released in the burner and afterburner. Its magnitude is the fuel\u2019s heating value (LHV).' },
    ],
    bridge:
      'Two of these \u2014 thermal and mechanical \u2014 are so easily confused that they deserve a single equation to keep them apart.',
  },

  // ── ENTHALPY ────────────────────────────────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Section 1',
    heading: 'Enthalpy Bundles Thermal and Mechanical',
    intro:
      'A moving fluid element carries three of the four currencies at once. Write what it carries per unit mass and the accounting becomes exact.',
    equation: 'h_0 = u + P\\,v + \\tfrac{1}{2}V^2',
    equationLabel: 'What a fluid element carries \u00b7 per unit mass',
    terms: [
      { sym: 'u',                   def: 'Thermal (internal) energy, <em>u = c<sub>v</sub>T</em> \u2014 random molecular motion' },
      { sym: 'P\\,v',               def: 'Mechanical flow work \u2014 the organized \u201cpotential to push\u201d' },
      { sym: '\\tfrac{1}{2}V^2',    def: 'Kinetic energy of the flow' },
      { sym: 'h_0',                 def: 'Stagnation enthalpy \u2014 the sum a fluid element actually carries' },
    ],
    cards: [
      { label: 'Enthalpy fuses thermal + mechanical',
        body: 'h = u + Pv. That is exactly why separating \u201cpressure\u201d from \u201cthermal\u201d is the right instinct \u2014 and why enthalpy, not temperature, is the currency to track in a moving gas.' },
      { label: 'Combustion supplies the fourth',
        body: 'The burner injects chemical energy (fuel LHV); the enthalpy then redistributes it into pressure, heat, and speed downstream.' },
    ],
    bridge:
      'The u-versus-Pv distinction is subtle enough to earn its own slide.',
  },

  // ── MECHANICAL vs THERMAL ───────────────────────────────────────────────────
  {
    type: 'compare',
    sectionNumber: 'Section 1',
    heading: 'Mechanical vs. Thermal \u2014 Organized vs. Disordered',
    intro:
      'Earlier in the course I loosely called the gas\u2019s pressure energy \u201cthermal.\u201d That\u2019s not quite right, and the difference is physical, not semantic.',
    regimes: [
      { tag: 'p', label: 'Mechanical (Pressure)', accent: C_MECH,
        head: 'Organized \u00b7 directed',
        body: 'Pressure is a <strong>directed</strong> force \u2014 the potential to push one specific way. Paired with a pressure differential it drives flow or turns a turbine. It is the <em>Pv</em> term in enthalpy.' },
      { tag: 'T', label: 'Thermal (Internal)', accent: C_THERM,
        head: 'Disordered \u00b7 random',
        body: 'Thermal energy is <strong>random</strong> molecular motion in every direction at once \u2014 the <em>u</em> term. Heating a confined gas usually raises pressure (T&uarr; &rArr; P&uarr;), but not always: let it expand freely and pressure adds nothing.' },
    ],
    closer:
      'Both live inside enthalpy, but only the organized part can be aimed. Keep them separate and every component\u2019s job becomes obvious \u2014 which is exactly the next exercise.',
  },

  // ── QUIZ ────────────────────────────────────────────────────────────────────
  {
    type: 'quiz',
    sectionNumber: 'Section 2',
    heading: 'Energy Exchange, Component by Component',
    question: 'How is energy <em>added, extracted, or transformed</em> inside this component?',
    columns: ['Component', 'Energy involved', 'Direction of change'],
    // `energy` and `rest` are plain text (unicode arrows). `verb` is one of
    // Added / Extracted / Transformed and is auto-colored by the renderer.
    rows: [
      { prompt: 'Inlet (diffuser)',        energy: 'Kinetic \u2192 flow work',   verb: 'Transformed', rest: ' \u2014 flow slows, pressure \u2191 (ram)' },
      { prompt: 'Fan',                     energy: 'Shaft work \u2192 enthalpy', verb: 'Added',       rest: ' \u2014 work in lifts pressure (mostly bypass)' },
      { prompt: 'Compressors (LPC / HPC)', energy: 'Shaft work \u2192 enthalpy', verb: 'Added',       rest: ' \u2014 pressure \u2191 and temperature \u2191' },
      { prompt: 'Burner',                  energy: 'Chemical \u2192 thermal',    verb: 'Added',       rest: ' \u2014 fuel burns, temp \u2191 at ~const pressure' },
      { prompt: 'Turbines (HPT / LPT)',    energy: 'Enthalpy \u2192 shaft work', verb: 'Extracted',   rest: ' \u2014 gas expands, pressure & temp \u2193' },
      { prompt: 'Afterburner (A/B)',       energy: 'Chemical \u2192 thermal',    verb: 'Added',       rest: ' \u2014 more fuel, temp \u2191 at ~const pressure' },
      { prompt: 'Nozzle',                  energy: 'Enthalpy \u2192 kinetic',    verb: 'Transformed', rest: ' \u2014 pressure & temp \u2192 velocity (thrust)' },
    ],
  },

  // ── ENERGY THROUGH THE ENGINE (figure) ──────────────────────────────────────
  {
    type: 'diagram',
    sectionNumber: 'Section 2',
    heading: 'Energy Through the Engine',
    intro:
      'The same seven components, now as a picture. Follow each currency station by station \u2014 the shapes are the answer key to the exercise you just did.',
    figure: 'engine-energy',
    caption:
      'Relative energy of the working gas across the engine: <span style="color:#e0556a;font-weight:600">mechanical</span>, <span style="color:#a78bfa;font-weight:600">kinetic</span>, <span style="color:#5ec8d8;font-weight:600">thermal</span>, and <span style="color:#5fd39a;font-weight:600">chemical</span>. Compression lifts pressure and heat together; the burner spends fuel to spike temperature; the turbines cash pressure back into shaft work. At the nozzle, pressure and thermal collapse into kinetic \u2014 the crossover is thrust. Vertical axis is qualitative. Click to trace one currency through one component at a time.',
    cards: [
      { tag: '\u2191', accent: C_KIN, label: 'The nozzle crossover',
        body: 'Kinetic energy is flat and low through the core, then rockets past everything at the nozzle. That is the only place the engine makes jet velocity \u2014 and thrust.' },
      { tag: 'fuel', accent: C_CHEM, label: 'Two chemical spikes',
        body: 'Chemical energy is zero until fuel is injected \u2014 once in the <strong>burner</strong>, again in the <strong>afterburner</strong>. Each spike feeds the thermal rise beside it.' },
      { tag: 'ram', accent: C_MECH, label: 'Read the inlet',
        body: 'Mechanical rises as kinetic falls across the inlet: ram compression trades the flow\u2019s speed for pressure before the compressor even starts.' },
    ],
    bridge:
      'Everything so far is exact bookkeeping. Now turn the crank into a cycle and ask how much net work it can make.',
  },

  // ── IDEAL BRAYTON EFFICIENCY ────────────────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Section 3',
    heading: 'Ideal Brayton Thermal Efficiency',
    intro:
      'Close the loop \u2014 compress, burn, expand, reject \u2014 and idealize every step as reversible. The thermal efficiency collapses to a single lever.',
    equation: '\\eta_{th} = 1 - \\dfrac{1}{r_p^{\\,(\\gamma-1)/\\gamma}}',
    equationLabel: 'Ideal cycle \u00b7 depends only on pressure ratio',
    terms: [
      { sym: '\\eta_{th}', def: 'Ideal cycle thermal efficiency' },
      { sym: 'r_p',        def: 'Compressor pressure ratio, <em>p<sub>03</sub>/p<sub>02</sub></em>' },
      { sym: '\\gamma',    def: 'Ratio of specific heats, c<sub>p</sub>/c<sub>v</sub> (&asymp;1.4 for air)' },
    ],
    cards: [
      { label: 'Efficiency climbs with pressure ratio',
        body: 'Every increase in r<sub>p</sub> converts a larger share of the added heat into work \u2014 which is why modern cores run overall pressure ratios above 40.' },
      { label: 'But peak power sits at a finite r<sub>p</sub>',
        body: 'For a fixed turbine-inlet temperature, specific net work is maximized at an <strong>intermediate</strong> pressure ratio \u2014 push past it and compressor back-work eats the gain. Max efficiency &ne; max work.' },
    ],
    bridge:
      'That clean result assumes perfection at every station. Real hardware doesn\u2019t oblige.',
  },

  // ── IDEAL vs REAL ───────────────────────────────────────────────────────────
  {
    type: 'compare',
    sectionNumber: 'Section 3',
    heading: 'Ideal vs. Real Brayton Cycle',
    intro:
      'The gap between the textbook cycle and a running engine is entropy \u2014 generated at every non-ideal step.',
    regimes: [
      { tag: 'ideal', label: 'Ideal', accent: C_THERM,
        head: 'Reversible everywhere',
        body: 'Isentropic compression and expansion, constant-pressure heat addition, no friction. It sets the <strong>upper bound</strong> on work and efficiency \u2014 the cycle you can only approach.' },
      { tag: 'real', label: 'Real', accent: '#f0a93b',
        head: 'Entropy at every step',
        body: 'Compressor and turbine efficiencies below one (&eta;<sub>c</sub>, &eta;<sub>t</sub> &lt; 1) generate entropy; the burner loses total pressure to friction and heat addition. More compressor work goes in, less turbine work comes out.' },
      { tag: 'net', label: 'The cost', accent: C_MECH,
        head: 'A smaller T\u2013s loop',
        body: 'Every loss shrinks the enclosed area on the T\u2013s diagram \u2014 the net work. Component efficiencies are exactly how we book that shrinkage, and where design effort pays off.' },
    ],
    closer:
      'Next we\u2019ll draw both loops on the same T\u2013s axes and read the losses off directly \u2014 entropy generation becomes visible as area.',
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

// ─── Figures ─────────────────────────────────────────────────────────────────
const STATIONS = [
  [60, 'Inlet'], [111.25, 'Fan'], [162.5, 'LPC'], [213.75, 'HPC'],
  [265, 'Burner'], [316.25, 'HPT'], [367.5, 'LPT'], [418.75, 'A/B'], [470, 'Nozzle'],
]

// x-position of every station boundary. The curves share these knots, so the
// gap between two stations is exactly one component.
const STATION_X = STATIONS.map(([x]) => x)
const SEGMENTS = STATION_X.length - 1        // components each currency crosses (8)

// The four energy currencies as point lists. x always increases left -> right,
// so a curve can be clipped at any x by walking its segments. (chem carries a
// few extra interior knots to shape its two combustion spikes.) Draw order here
// is the z-order: chem sits behind, kinetic on top so its nozzle spike shows.
const ENGINE_CURVES = [
  { key: 'chem',  cls: 'q6-chem',  pts: [[60,280],[213.75,280],[238,250],[252,175],[265,124.4],[278,175],[292,250],[316.25,280],[367.5,280],[392,255],[406,195],[418.75,157.8],[432,195],[446,250],[470,280]] },
  { key: 'therm', cls: 'q6-therm', pts: [[60,235.6],[111.25,217.8],[162.5,191.1],[213.75,142.2],[265,57.8],[316.25,120],[367.5,164.4],[418.75,106.7],[470,180]] },
  { key: 'mech',  cls: 'q6-mech',  pts: [[60,231.1],[111.25,206.7],[162.5,175.6],[213.75,106.7],[265,108.9],[316.25,160],[367.5,200],[418.75,204.4],[470,235.6]] },
  { key: 'kin',   cls: 'q6-kin',   pts: [[60,195.6],[111.25,204.4],[162.5,206.7],[213.75,204.4],[265,213.3],[316.25,191.1],[367.5,182.2],[418.75,191.1],[470,66.7]] },
]

// Order the currencies are traced in (one click per component). Each currency
// is drawn all the way across the engine before the next begins, so the story
// ends on kinetic rocketing up at the nozzle.
const ENGINE_TRACE = ['mech', 'therm', 'chem', 'kin']
const ENGINE_NAME  = { mech: 'Mechanical', therm: 'Thermal', chem: 'Chemical', kin: 'Kinetic' }
const ENGINE_COLOR = { mech: C_MECH, therm: C_THERM, chem: C_CHEM, kin: C_KIN }
// total clicks to draw every currency across every component (4 x 8 = 32)
const ENGINE_STEPS = ENGINE_TRACE.length * SEGMENTS

// SVG path for a point list, drawn only as far as x = xMax (linear segments,
// so the clipped endpoint is exact).
function clipCurve(pts, xMax) {
  if (xMax <= pts[0][0]) return ''
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    if (xMax >= x1) {
      d += ` L${x1} ${y1}`
    } else {
      const f = (xMax - x0) / (x1 - x0)
      d += ` L${xMax.toFixed(2)} ${(y0 + (y1 - y0) * f).toFixed(2)}`
      break
    }
  }
  return d
}

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion:reduce)').matches

// Energy through the engine, one click at a time. `step` counts how many
// currency-through-a-component units have been requested (0..ENGINE_STEPS).
// Each new step animates exactly one currency's rise/fall across one component;
// completed lines stay on screen, so the chart accumulates into all four curves.
// Clicks bubble up to the stage, so the deck's normal advance drives it.
function EngineEnergyFigure({ step }) {
  const [frac, setFrac] = useState(1)   // 0..1 progress of the unit now drawing
  const prev = useRef(step)
  const raf = useRef(0)

  useEffect(() => {
    const forward = step > prev.current
    prev.current = step
    cancelAnimationFrame(raf.current)
    if (step <= 0) { setFrac(1); return }
    if (!forward || prefersReduced()) { setFrac(1); return }   // going back: snap
    setFrac(0)
    const dur = 440, t0 = performance.now()
    const tick = (now) => {
      const e = Math.min((now - t0) / dur, 1)
      setFrac(e < 0.5 ? 2 * e * e : 1 - Math.pow(-2 * e + 2, 2) / 2)
      if (e < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [step])

  const clamped   = Math.max(0, Math.min(step, ENGINE_STEPS))
  const activeIdx = clamped - 1                       // unit currently drawing
  const settled   = clamped >= ENGINE_STEPS && frac >= 1
  const activeType = activeIdx >= 0 ? ENGINE_TRACE[Math.floor(activeIdx / SEGMENTS)] : null
  const activeSeg  = activeIdx >= 0 ? activeIdx % SEGMENTS : -1
  const showActive = activeIdx >= 0 && !settled

  // how far right each currency is drawn
  const extent = {}
  for (const c of ENGINE_CURVES) {
    const ti = ENGINE_TRACE.indexOf(c.key)
    const base = Math.max(0, Math.min(activeIdx - ti * SEGMENTS, SEGMENTS))
    extent[c.key] = (c.key === activeType && base < SEGMENTS)
      ? STATION_X[base] + frac * (STATION_X[base + 1] - STATION_X[base])
      : STATION_X[base]
  }

  return (
    <svg viewBox="0 0 520 320" className="q1d-svg" aria-hidden>
      {/* active-component highlight band */}
      {showActive && activeSeg >= 0 && (
        <rect className="q6-band" x={STATION_X[activeSeg]} y="40"
          width={STATION_X[activeSeg + 1] - STATION_X[activeSeg]} height="240" />
      )}

      {/* axes */}
      <line x1="60" y1="40" x2="60" y2="280" className="q1d-wall" />
      <line x1="60" y1="280" x2="470" y2="280" className="q1d-wall" />
      <text x="30" y="160" className="q1d-t q1d-t--sm" textAnchor="middle" transform="rotate(-90 30 160)">relative energy</text>

      {/* station gridlines + labels (labels bracketing the live component light up) */}
      {STATIONS.map(([x, l], i) => {
        const active = showActive && (i === activeSeg || i === activeSeg + 1)
        return (
          <g key={l}>
            <line x1={x} y1="40" x2={x} y2="280" className="q1d-station" />
            <text x={x} y="296"
              className={`q1d-t q1d-t--sm${active ? ' q6-lab-active' : ''}`}
              textAnchor="middle">{l}</text>
          </g>
        )
      })}

      {/* curves, each clipped to its own drawn extent; the live one is emphasized */}
      {ENGINE_CURVES.map((c) => (
        <path key={c.cls}
          className={`${c.cls}${c.key === activeType && showActive ? ' q6-live' : ''}`}
          d={clipCurve(c.pts, extent[c.key])} />
      ))}

      {/* readout: which currency, which component is drawing right now */}
      {showActive && activeType && (
        <g>
          <text x="466" y="52" className="q6-read" style={{ fill: ENGINE_COLOR[activeType] }} textAnchor="end">{ENGINE_NAME[activeType]}</text>
          <text x="466" y="66" className="q6-read-sub" textAnchor="end">{STATIONS[activeSeg][1] + ' \u2192 ' + STATIONS[activeSeg + 1][1]}</text>
        </g>
      )}

      {/* affordance before the first click */}
      {clamped === 0 && (
        <text x="265" y="162" className="q6-hint" textAnchor="middle">{'click to trace each currency \u2192'}</text>
      )}

      {/* thrust annotation once kinetic reaches the nozzle */}
      {extent.kin >= 470 && (
        <>
          <circle cx="470" cy="66.7" r="4" style={{ fill: C_KIN }} />
          <text x="464" y="58" className="q1d-t" style={{ fill: C_KIN, fontWeight: 600 }} textAnchor="end">thrust</text>
        </>
      )}
    </svg>
  )
}

function Figure({ name, step }) {
  if (name === 'engine-energy') return <EngineEnergyFigure step={step} />
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
      {slide.sectionNumber && <div className="section-number anim-in">{slide.sectionNumber}</div>}
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
              <span className="cmp-tag" style={{ background: c.accent }}><HTML>{c.tag}</HTML></span>
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
              <span className="regime-tag" style={{ background: r.accent }}><HTML>{r.tag}</HTML></span>
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

// Reveal-step layout for a diagram slide. The engine-energy chart is special:
// it consumes one reveal step per currency-through-a-component unit, so the
// deck's ordinary click / arrow advance draws it piece by piece.
function diagramLayout(slide) {
  const cards = slide.cards || []
  const figSteps = slide.figure === 'engine-energy' ? ENGINE_STEPS : 1
  const chartLastAt = 1 + figSteps                 // revealed when the figure is complete
  const eqAt = slide.equation ? chartLastAt + 1 : null
  const cardStart = (eqAt || chartLastAt) + 1
  const bridgeAt = cardStart + cards.length
  const total = slide.bridge
    ? bridgeAt
    : (cards.length ? cardStart + cards.length - 1 : (eqAt || chartLastAt))
  return { cards, figSteps, eqAt, cardStart, bridgeAt, total }
}

function DiagramSlide({ slide, revealed }) {
  const L = diagramLayout(slide)
  const figShown = revealed >= 1
  const chartStep = Math.max(0, Math.min(revealed - 1, L.figSteps))
  return (
    <div className="slide-inner compress-slide">
      <SlideHead slide={slide} />
      {slide.intro && (
        <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
          <p className="cf-note cf-note--lead"><HTML>{slide.intro}</HTML></p>
        </div>
      )}
      <figure className={`q1d-fig reveal-block${figShown ? ' revealed' : ''}`}>
        <Figure name={slide.figure} step={chartStep} />
        {slide.caption && <figcaption><HTML>{slide.caption}</HTML></figcaption>}
      </figure>
      {slide.equation && (
        <div className={`reveal-block eq-row${revealed >= L.eqAt ? ' revealed' : ''}`}>
          <div className="eq-box"><Equation latex={slide.equation} /></div>
        </div>
      )}
      {L.cards.length > 0 && (
        <div className="cmp-row cmp-row--tight">
          {L.cards.map((c, i) => (
            <div key={i} className={`cmp-card reveal-block${revealed >= L.cardStart + i ? ' revealed' : ''}`}
                 style={{ borderTopColor: c.accent }}>
              <div className="cmp-head">
                <span className="cmp-tag" style={{ background: c.accent }}><HTML>{c.tag}</HTML></span>
                <span className="cmp-label">{c.label}</span>
              </div>
              <div className="cmp-item"><span><HTML>{c.body}</HTML></span></div>
            </div>
          ))}
        </div>
      )}
      {slide.bridge && (
        <div className={`reveal-block cf-bridge${revealed >= L.bridgeAt ? ' revealed' : ''}`}>
          <HTML>{slide.bridge}</HTML>
        </div>
      )}
    </div>
  )
}

// ─── NEW: guess-before-reveal quiz slide ─────────────────────────────────────
function QuizSlide({ slide, revealed }) {
  const cols = slide.columns || ['Component', 'Energy involved', 'Direction of change']
  const rows = slide.rows || []
  return (
    <div className="slide-inner compress-slide">
      <SlideHead slide={slide} />
      {slide.question && (
        <div className="quiz-question anim-in"><HTML>{slide.question}</HTML></div>
      )}
      <div className="quiz-grid anim-in">
        <div className="quiz-h">{cols[0]}</div>
        <div className="quiz-h">{cols[1]}</div>
        <div className="quiz-h">{cols[2]}</div>
        {rows.flatMap((r, i) => {
          const answered = i < revealed
          const current  = i === revealed
          const cur = current ? ' quiz-cell--cur' : ''
          return [
            <div key={`${i}-p`} className={`quiz-cell quiz-cell--prompt${current ? ' is-current' : ''}${cur}`}>{r.prompt}</div>,
            <div key={`${i}-e`} className={`quiz-cell${cur}`}>
              {answered ? r.energy : <span className="quiz-q" aria-hidden>?</span>}
            </div>,
            <div key={`${i}-d`} className={`quiz-cell${cur}`}>
              {answered
                ? <span><strong style={{ color: QUIZ_VERB[r.verb] || 'var(--ink)' }}>{r.verb}</strong>{r.rest}</span>
                : <span className="quiz-q" aria-hidden>?</span>}
            </div>,
          ]
        })}
      </div>
    </div>
  )
}

// \u2500\u2500\u2500 Flow-path assumptions slide \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
function FlowpathSlide({ slide, revealed }) {
  const items = slide.assumptions || []
  return (
    <div className="slide-inner compress-slide">
      {slide.sectionNumber && <div className="section-number anim-in">{slide.sectionNumber}</div>}
      <div className="fp-head anim-in">
        {slide.number && (
          <span className="fp-num" style={{ borderColor: slide.accent, color: slide.accent }}>{slide.number}</span>
        )}
        <h2 className="slide-heading" style={{ margin: 0 }}><HTML>{slide.heading}</HTML></h2>
      </div>
      <div className="heading-rule anim-in" style={{ background: slide.accent }} />
      {slide.intro && (
        <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
          <p className="cf-note cf-note--lead"><HTML>{slide.intro}</HTML></p>
        </div>
      )}
      <div className="fp-list">
        {items.map((a, i) => (
          <div key={i}
            className={`fp-chip reveal-block${a.key ? ' fp-chip--key' : ''}${revealed > i + 1 ? ' revealed' : ''}`}
            style={a.key ? undefined : { borderLeftColor: slide.accent }}>
            <span className="fp-tag" style={{ color: a.key ? 'var(--accent-2)' : slide.accent }}><HTML>{a.tag}</HTML></span>
            <span className="fp-note"><HTML>{a.note}</HTML></span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Steps per slide ─────────────────────────────────────────────────────────
function totalSteps(slide) {
  switch (slide.type) {
    case 'concept':  return 1 + (slide.cards?.length || 0) + (slide.bridge ? 1 : 0)
    case 'equation': return 3 + (slide.cards?.length || 0) + (slide.bridge ? 1 : 0)
    case 'compare':  return 1 + (slide.regimes?.length || 0) + (slide.closer ? 1 : 0)
    case 'diagram':  return diagramLayout(slide).total
    case 'flowpath': return 1 + (slide.assumptions?.length || 0)
    case 'quiz':     return (slide.rows?.length || 0)
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
      case 'equation': return <EquationSlide slide={slide} revealed={revealed} />
      case 'compare':  return <CompareSlide slide={slide} revealed={revealed} />
      case 'diagram':  return <DiagramSlide slide={slide} revealed={revealed} />
      case 'flowpath': return <FlowpathSlide slide={slide} revealed={revealed} />
      case 'quiz':     return <QuizSlide slide={slide} revealed={revealed} />
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
        <span className="nav-hint">&larr; &rarr; or click to advance</span>
      </div>
    </div>
  )
}

// ─── Styles (shared ME 3470 navy/cyan theme) ─────────────────────────────────
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
.title-subtitle{font-size:18px;line-height:1.5;color:var(--muted);max-width:720px;margin:0 0 30px}
.title-meta{display:flex;gap:42px;flex-wrap:wrap}
.meta-label{font-family:var(--display);font-size:12px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--accent);margin-bottom:6px}
.meta-value{font-size:15px;color:var(--ink);max-width:280px}

/* equation rows */
.eq-row{display:flex;align-items:center;gap:28px;flex-wrap:wrap;margin:16px 0}
.eq-box{background:var(--panel);border:1px solid var(--rule);border-left:3px solid var(--accent);
  border-radius:8px;padding:14px 26px;font-size:20px;overflow-x:auto;max-width:100%}
.eq-aside{color:var(--muted);font-size:15px;display:flex;align-items:center;gap:8px}

/* concept cards */
.cmp-row{display:flex;gap:18px;flex-wrap:wrap;margin:16px 0 18px}
.cmp-row--tight{margin:10px 0 14px}
.cmp-card{flex:1 1 300px;min-width:260px;background:var(--panel);border:1px solid var(--rule);
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
.cmp-item span em{color:var(--accent);font-style:italic}

/* term glossary */
.term-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 26px;margin:6px 0 12px;max-width:920px}
.term-item{display:flex;align-items:baseline;gap:10px}
.term-sym{color:var(--accent);min-width:54px}
.term-def{font-size:13.5px;color:var(--muted);line-height:1.45}
.term-def em{color:var(--accent);font-style:italic}

.mini-card{background:var(--panel);border:1px solid var(--rule);
  border-radius:10px;padding:12px 16px;display:flex;flex-direction:column;gap:4px;max-width:980px}
.mini-card strong{font-size:14.5px;color:var(--accent)}
.mini-card span{font-size:13.5px;line-height:1.5;color:var(--muted)}
.mini-card span strong{color:var(--accent-2);font-size:13.5px}

/* regime cards */
.regime-card{flex:1 1 280px;min-width:260px;background:var(--panel);border:1px solid var(--rule);
  border-top:3px solid var(--accent);border-radius:10px;padding:14px 18px;
  opacity:0;transform:translateY(8px);transition:.42s ease}
.regime-card.revealed{opacity:1;transform:none}
.regime-head{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.regime-tag{font-family:var(--display);font-size:12px;font-weight:700;color:var(--bg);
  border-radius:5px;padding:2px 9px}
.regime-label{font-family:var(--display);font-size:17px;font-weight:700;color:var(--ink)}
.regime-headline{display:block;font-size:15px;margin-bottom:6px}
.regime-body{font-size:13.5px;line-height:1.55;color:var(--muted);margin:0}
.regime-body strong{color:var(--accent-2)}
.regime-body em{color:var(--accent);font-style:italic}

/* quiz slide */
.quiz-question{font-size:20px;line-height:1.35;color:var(--ink);font-weight:600;
  max-width:1000px;margin:2px 0 16px}
.quiz-question em{color:var(--accent);font-style:italic}
.quiz-grid{display:grid;grid-template-columns:1.1fr 1.3fr 1.7fr;width:100%;max-width:1040px}
.quiz-h{font-family:var(--display);font-size:12px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--muted);padding:0 14px 10px 0;border-bottom:1px solid var(--rule)}
.quiz-cell{padding:13px 14px;border-bottom:1px solid var(--rule);
  font-size:15px;line-height:1.45;color:var(--muted);transition:background .25s}
.quiz-cell--prompt{font-family:var(--display);font-weight:700;color:var(--ink);
  border-left:2px solid transparent}
.quiz-cell--prompt.is-current{border-left-color:var(--accent);padding-left:12px}
.quiz-cell--cur{background:rgba(94,200,216,.07)}
.quiz-q{color:var(--muted);opacity:.5}

/* figures */
.q1d-fig{margin:0 0 14px;background:var(--panel);border:1px solid var(--rule);
  border-radius:12px;padding:16px 18px 12px}
.q1d-fig figcaption{font-size:12.5px;line-height:1.5;color:var(--muted);text-align:center;margin-top:10px;max-width:900px;margin-left:auto;margin-right:auto}
.q1d-svg{width:100%;height:auto;cursor:pointer;display:block;max-height:46vh}
.q1d-wall{fill:none;stroke:var(--muted);stroke-width:2}
.q1d-station{stroke:var(--rule);stroke-width:1;stroke-dasharray:3 3}
.q1d-t{font-family:var(--body);font-size:11px;fill:var(--ink)}
.q1d-t--sm{font-size:9px;fill:var(--muted)}

/* Unit 6 energy curves */
.q6-mech{fill:none;stroke:${C_MECH};stroke-width:2.6;stroke-linejoin:round}
.q6-kin{fill:none;stroke:${C_KIN};stroke-width:2.6;stroke-linejoin:round}
.q6-band{fill:rgba(255,255,255,.05);stroke:rgba(255,255,255,.16);stroke-width:1}
.q6-lab-active{fill:var(--accent);font-weight:700}
.q6-live{stroke-width:3.6}
.q6-read{font-family:var(--body);font-size:12px;font-weight:700}
.q6-read-sub{font-family:var(--body);font-size:9px;fill:var(--muted)}
.q6-hint{font-family:var(--body);font-size:11px;fill:var(--muted);font-style:italic;opacity:.85}
.q6-therm{fill:none;stroke:${C_THERM};stroke-width:2.6;stroke-linejoin:round}
.q6-chem{fill:none;stroke:${C_CHEM};stroke-width:2.6;stroke-linejoin:round}
.q1d-draw{stroke-dasharray:1400;stroke-dashoffset:1400;animation:q1dDraw 1.2s ease forwards}
@keyframes q1dDraw{to{stroke-dashoffset:0}}

/* flow-path tour */
.fp-head{display:flex;align-items:center;gap:14px;margin:2px 0 0}
.fp-num{font-family:var(--display);font-size:20px;font-weight:700;line-height:1;
  width:40px;height:40px;flex:none;display:flex;align-items:center;justify-content:center;
  border:2px solid var(--accent);border-radius:50%}
.fp-list{display:flex;flex-direction:column;gap:10px;max-width:920px;margin-top:6px}
.fp-chip{display:flex;align-items:baseline;gap:16px;background:var(--panel);
  border:1px solid var(--rule);border-left:3px solid var(--accent);
  border-radius:8px;padding:11px 16px;margin:0}
.fp-chip--key{border-left-color:var(--accent-2);background:rgba(240,169,59,.07);
  border-color:rgba(240,169,59,.35)}
.fp-tag{font-family:var(--display);font-weight:700;font-size:15px;min-width:140px;flex:none}
.fp-note{font-size:14px;line-height:1.5;color:var(--muted)}
.fp-note strong{color:var(--accent-2)}
.fp-note em{color:var(--accent);font-style:italic}
.fp-note sub{font-size:.72em}

/* nav */
.nav-bar{display:flex;align-items:center;gap:16px;padding:14px 26px;border-top:1px solid var(--rule)}
.nav-btn{background:var(--panel);color:var(--ink);border:1px solid var(--rule);
  border-radius:7px;padding:8px 16px;font-size:14px;cursor:pointer;transition:.2s}
.nav-btn:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}
.nav-btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.nav-btn:disabled{opacity:.35;cursor:default}
.nav-dots{flex:1;display:flex;gap:8px;justify-content:center;flex-wrap:wrap}
.nav-dot{width:9px;height:9px;border-radius:50%;background:var(--rule);cursor:pointer;transition:.2s}
.nav-dot.active{background:var(--accent);transform:scale(1.25)}
.nav-hint{color:var(--muted);font-size:12px}
.progress-bar{position:absolute;left:0;bottom:-12px;height:2px;background:var(--accent);transition:width .3s ease}

@media (max-width:720px){
  .slide-heading{font-size:26px}
  .main-title{font-size:46px}
  .term-grid{grid-template-columns:1fr}
  .cmp-row{flex-direction:column}
  .title-meta{gap:24px}
  .quiz-question{font-size:17px}
  .quiz-grid{font-size:13px}
  .nav-hint{display:none}
}
@media (prefers-reduced-motion:reduce){
  .anim-in,.reveal-block,.cmp-card,.regime-card,.fp-chip{animation:none;transition:none}
  .q1d-draw{animation:none;stroke-dashoffset:0}
}
`
