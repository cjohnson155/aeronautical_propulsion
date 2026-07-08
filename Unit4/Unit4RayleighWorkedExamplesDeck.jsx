import { useState, useEffect, useCallback, useRef } from 'react'
import katex from 'katex'
import 'katex/dist/katex.min.css'

// ─────────────────────────────────────────────────────────────────────────────
//  ME 3470 · Rayleigh Flow — Worked Examples
//  Third deck in the shared Unit 4 presentation system (Rayleigh Flow +
//  Fluid Impulse decks came first):
//    • navy/cyan theme via CSS variables + <style>{CSS}
//    • type-driven slide renderers, KaTeX via the shared <Equation/>
//    • step-by-step reveals, click / arrow-key advance
//    • top bar · nav dots · progress bar
//
//  New slide type added to the system:
//    'table'  – a real Rayleigh-table snapshot (M, T/T*, p/p*, T0/T0*,
//               p0/p0*, V/V*) that reveals in two passes: first the whole
//               page as-is, then only the rows/columns a problem needs light up.
//
//  Reuses 'derive' from the Fluid Impulse deck for the arithmetic itself.
// ─────────────────────────────────────────────────────────────────────────────

export const meta = {
  courseId:  'ME 3470',
  deckTitle: 'Rayleigh Flow · Worked Examples — Reading the Table, and What the Stars Mean',
}

// ─── The Rayleigh table itself (CPG, γ = 1.4) ────────────────────────────────
// Every ratio here is a closed-form function of M alone — this is the exact
// data a printed gas table pre-computes at a grid of Mach numbers.
const RAYLEIGH_ROWS = [
  { M: 0.10, TT: 0.0560, pp: 2.3669, T0T0: 0.0468, p0p0: 1.2591, VV: 0.0237 },
  { M: 0.20, TT: 0.2066, pp: 2.2727, T0T0: 0.1736, p0p0: 1.2346, VV: 0.0909 },
  { M: 0.30, TT: 0.4089, pp: 2.1314, T0T0: 0.3469, p0p0: 1.1985, VV: 0.1918 },
  { M: 0.35, TT: 0.5141, pp: 2.0487, T0T0: 0.4389, p0p0: 1.1779, VV: 0.2510 },
  { M: 0.40, TT: 0.6151, pp: 1.9608, T0T0: 0.5290, p0p0: 1.1566, VV: 0.3137 },
  { M: 0.50, TT: 0.7901, pp: 1.7778, T0T0: 0.6914, p0p0: 1.1141, VV: 0.4444 },
  { M: 0.60, TT: 0.9167, pp: 1.5957, T0T0: 0.8189, p0p0: 1.0753, VV: 0.5745 },
  { M: 0.70, TT: 0.9929, pp: 1.4235, T0T0: 0.9085, p0p0: 1.0431, VV: 0.6975 },
  { M: 0.80, TT: 1.0255, pp: 1.2658, T0T0: 0.9639, p0p0: 1.0193, VV: 0.8101 },
  { M: 0.90, TT: 1.0245, pp: 1.1246, T0T0: 0.9921, p0p0: 1.0049, VV: 0.9110 },
  { M: 1.00, TT: 1.0000, pp: 1.0000, T0T0: 1.0000, p0p0: 1.0000, VV: 1.0000 },
  { M: 1.20, TT: 0.9118, pp: 0.7958, T0T0: 0.9787, p0p0: 1.0194, VV: 1.1459 },
  { M: 1.50, TT: 0.7525, pp: 0.5783, T0T0: 0.9093, p0p0: 1.1215, VV: 1.3012 },
  { M: 2.00, TT: 0.5289, pp: 0.3636, T0T0: 0.7934, p0p0: 1.5031, VV: 1.4545 },
  { M: 2.50, TT: 0.3787, pp: 0.2462, T0T0: 0.7101, p0p0: 2.2218, VV: 1.5385 },
  { M: 3.00, TT: 0.2803, pp: 0.1765, T0T0: 0.6540, p0p0: 3.4245, VV: 1.5882 },
]
const RAYLEIGH_COLS = [
  { key: 'TT',   label: 'T / T\u2071\u1d43' },
  { key: 'pp',   label: 'p / p\u2071\u1d43' },
  { key: 'T0T0', label: 'T\u2080 / T\u2080\u2071\u1d43' },
  { key: 'p0p0', label: 'p\u2080 / p\u2080\u2071\u1d43' },
  { key: 'VV',   label: 'V / V\u2071\u1d43' },
]
// (superscript-star not in every font; the table renders literal "*" instead — see TableSlide)

export const slides = [

  // ── TITLE ───────────────────────────────────────────────────────────────────
  {
    type: 'title',
    eyebrow: 'Undergraduate Course \u00b7 ME 3470',
    title: 'Rayleigh Flow<br>Worked Examples',
    subtitle: 'Three worked problems built directly on the Rayleigh table \u2014 what the starred quantities actually mean, how each ratio is just a function of Mach number, and how two table lookups replace an equation of state.',
    meta: [
      { label: 'Unit',      value: '04 \u2014 Rayleigh Flow, Worked Examples' },
      { label: 'Topics',    value: 'Starred reference state \u00b7 CPG Rayleigh relations \u00b7 Table lookup by division \u00b7 Thermal choking \u00b7 Impulse tie-in' },
      { label: 'Builds on', value: 'Unit 4 \u2014 Rayleigh Flow & Fluid Impulse' },
    ],
  },

  // ── WHAT DOES THE STAR MEAN ──────────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Section 1',
    heading: 'What Does the Star Actually Mean?',
    intro:
      'Every ratio in the Rayleigh table \u2014 T/T*, p/p*, T\u2080/T\u2080*, p\u2080/p\u2080*, V/V* \u2014 is measured against one fixed reference: the state <strong>this same duct</strong> would reach at <strong>M = 1</strong>, if you kept adding (or pulling) heat until it got there.',
    cards: [
      { tag: 'Fixed', accent: '#5ec8d8', label: 'A Reference, Not a Destination',
        body: 'The starred state usually is <strong>not</strong> reached by the real flow. It\u2019s a bookkeeping anchor: hold the mass flux G = &rho;u and the impulse I = pA(1+&gamma;M&sup2;) fixed at whatever your inlet gives you, and ask \u201cwhat would T, p, etc. be if this duct got to M = 1?\u201d' },
      { tag: '\u2605\u2260\u2605', accent: '#f0a93b', label: 'Every Problem Has Its Own Star',
        body: 'Change the inlet state and you get a <strong>different</strong> star state. T* and p* belong to the specific duct and mass flux you\u2019re analyzing \u2014 they are not universal constants like R or &gamma;.' },
      { tag: '\u00f7', accent: '#5ec8d8', label: 'Why It\u2019s Useful: It Cancels',
        body: 'Both stations in a real problem share the <strong>same</strong> star, because it\u2019s fixed by the same duct. So (T/T*)<sub>2</sub> \u00f7 (T/T*)<sub>1</sub> cancels T* completely and leaves T\u2082/T\u2081 \u2014 the number you actually wanted.' },
    ],
    bridge:
      'So the star is scaffolding you build once, use to relate two Mach numbers, then throw away. Next: how each ratio is computed from M alone.',
  },

  // ── BUILDING THE RATIOS FROM M ALONE ─────────────────────────────────────────
  {
    type: 'equation',
    sectionNumber: 'Section 1',
    heading: 'Building the Ratios From M Alone',
    intro:
      'For a calorically perfect gas, every starred ratio collapses to a closed-form function of Mach number and &gamma; \u2014 no T, p, or duct geometry required as inputs.',
    equation: '\\dfrac{p}{p^{*}} = \\dfrac{1+\\gamma}{1+\\gamma M^{2}}',
    equationLabel: 'The simplest of the five \u2014 falls monotonically from M = 0 to M = 1',
    terms: [
      { sym: '\\dfrac{T}{T^{*}}',       def: '= (1+&gamma;)&sup2;M&sup2; / (1+&gamma;M&sup2;)&sup2; \u2014 rises, peaks near M &asymp; 0.845, then falls back through 1 at M = 1.' },
      { sym: '\\dfrac{T_0}{T_0^{*}}',   def: '= (1+&gamma;)M&sup2;(2+(&gamma;\u22121)M&sup2;) / (1+&gamma;M&sup2;)&sup2; \u2014 rises monotonically; this is the column that tracks heat added.' },
      { sym: '\\dfrac{p_0}{p_0^{*}}',   def: '= (p/p*)\u00b7[(2+(&gamma;\u22121)M&sup2;)/(1+&gamma;)]<sup>&gamma;/(&gamma;\u22121)</sup> \u2014 always &ge; 1 away from M = 1; the stagnation-pressure loss.' },
      { sym: '\\dfrac{V}{V^{*}}',       def: '= (1+&gamma;)M&sup2; / (1+&gamma;M&sup2;) = &rho;*/&rho; \u2014 rises monotonically with M.' },
    ],
    cards: [
      { label: 'Where p/p* comes from', body: 'Substitute &rho;u&sup2; = &gamma;pM&sup2; into the momentum balance p + &rho;u&sup2; = const and divide through by its M = 1 value \u2014 this is exactly the impulse relation from the previous deck, rewritten as a ratio.' },
      { label: 'One input, five outputs', body: 'Feed in M (and &gamma;), read off five numbers. This is precisely what a Rayleigh gas table pre-computes for you at a grid of Mach numbers, so you never touch this algebra directly.' },
    ],
    bridge:
      'Most courses hand you these five numbers pre-computed. Here is that table, exactly as it appears on the page you\u2019ll flip to.',
  },

  // ── FULL TABLE SNAPSHOT ───────────────────────────────────────────────────────
  {
    type: 'table',
    sectionNumber: 'Section 2',
    heading: 'The Rayleigh Table \u2014 Full Snapshot',
    intro:
      '&gamma; = 1.4. Every row is one Mach number; every column is one of the five ratios from the last slide. This is the whole page \u2014 nothing highlighted yet.',
    highlightRows: [],
    highlightCols: [],
    caption:
      'Notice T/T* peaks near M &asymp; 0.845 and falls back to 1.0000 at M = 1 \u2014 the one non-monotonic column, and the usual source of confusion. p\u2080/p\u2080* is the only column that never drops below 1.',
    bridge:
      'Now the same table, but for one specific problem \u2014 with only the rows and columns that problem needs lit up.',
  },

  // ── EXAMPLE 1 SETUP ───────────────────────────────────────────────────────────
  {
    type: 'table',
    sectionNumber: 'Example 1',
    heading: 'Setup \u2014 Table Lookup for T\u2082 and p\u2082',
    intro:
      'Combustor inlet: M\u2081 = 0.30, T\u2081 = 300 K, p\u2081 = 200 kPa. Heat addition raises the Mach number to M\u2082 = 0.60. We only need two rows and two columns of the whole page.',
    highlightRows: [0.30, 0.60],
    highlightCols: ['TT', 'pp'],
    caption:
      'Everything else on the page is noise for this particular problem \u2014 just these four cells.',
    bridge:
      'Two ratios, two stations, one division each. Now the arithmetic.',
  },

  // ── EXAMPLE 1 SOLVE ────────────────────────────────────────────────────────────
  {
    type: 'derive',
    sectionNumber: 'Example 1',
    heading: 'Solve \u2014 T\u2082 and p\u2082 by Table Lookup',
    intro:
      'Divide the highlighted cells station by station; the star cancels because both stations sit in the same duct.',
    steps: [
      { n: '1', tag: 'Look up M\u2081 = 0.30',
        eq: '\\left(\\dfrac{T}{T^{*}}\\right)_{1} \\!=\\! 0.4089, \\qquad \\left(\\dfrac{p}{p^{*}}\\right)_{1} \\!=\\! 2.1314',
        note: 'Straight off the highlighted row \u2014 no algebra yet.' },
      { n: '2', tag: 'Look up M\u2082 = 0.60',
        eq: '\\left(\\dfrac{T}{T^{*}}\\right)_{2} \\!=\\! 0.9167, \\qquad \\left(\\dfrac{p}{p^{*}}\\right)_{2} \\!=\\! 1.5957',
        note: 'Same two columns, the other highlighted row.' },
      { n: '3', tag: 'Divide out the star',
        eq: '\\dfrac{T_2}{T_1} = \\dfrac{0.9167}{0.4089} = 2.242, \\qquad \\dfrac{p_2}{p_1} = \\dfrac{1.5957}{2.1314} = 0.749',
        note: 'T* and p* never need a numeric value \u2014 they cancel in the division.' },
      { n: '4', tag: 'Apply to the known inlet',
        eq: 'T_2 = 300(2.242) = 672.6\\ \\text{K}, \\qquad p_2 = 200(0.749) = 149.7\\ \\text{kPa}',
        note: 'T rose (subsonic heating below M &asymp; 0.845); p fell \u2014 the momentum-driven pressure loss from the Fluid Impulse deck, now read straight off the table.' },
    ],
    result: {
      eq: '\\dfrac{T_2}{T_1} = \\dfrac{(T/T^{*})_2}{(T/T^{*})_1}, \\qquad \\dfrac{p_2}{p_1} = \\dfrac{(p/p^{*})_2}{(p/p^{*})_1}',
      label: 'The star never appears in the final answer \u2014 it\u2019s scaffolding, not a result.',
    },
    closer:
      'That\u2019s the entire method for any two-station Rayleigh problem: look up both rows, divide matching columns, apply to whatever inlet value you were given.',
  },

  // ── EXAMPLE 2 SETUP ───────────────────────────────────────────────────────────
  {
    type: 'table',
    sectionNumber: 'Example 2',
    heading: 'Setup \u2014 How Much Heat Before It Chokes?',
    intro:
      'Same combustor, new inlet: M\u2083 = 0.20, T\u2080\u2083 = 420 K. How much stagnation temperature can this duct absorb before it thermally chokes at M = 1?',
    highlightRows: [0.20, 1.00],
    highlightCols: ['T0T0'],
    caption:
      'Only one column matters here \u2014 T\u2080/T\u2080* is the ledger for heat added. The M = 1 row is the ceiling: it <em>is</em> the star state.',
    bridge:
      'This time the star row isn\u2019t just scaffolding \u2014 it\u2019s the answer we\u2019re solving for.',
  },

  // ── EXAMPLE 2 SOLVE ────────────────────────────────────────────────────────────
  {
    type: 'derive',
    sectionNumber: 'Example 2',
    heading: 'Solve \u2014 the Thermal-Choking Ceiling',
    intro:
      'At M = 1, T\u2080/T\u2080* = 1 by definition \u2014 that row literally is the star. One lookup and one ratio gives the ceiling.',
    steps: [
      { n: '1', tag: 'Look up M\u2083 = 0.20',
        eq: '\\left(\\dfrac{T_0}{T_0^{*}}\\right)_{3} = 0.1736',
        note: 'The highlighted cell in the T\u2080/T\u2080* column.' },
      { n: '2', tag: 'Solve for the star itself',
        eq: 'T_0^{*} = \\dfrac{T_{03}}{0.1736} = \\dfrac{420}{0.1736} \\approx 2419\\ \\text{K}',
        note: 'This is the maximum stagnation temperature this duct can ever reach \u2014 the thermal-choking ceiling for this inlet.' },
      { n: '3', tag: 'Max heat addition',
        eq: 'q_{max} = c_p\\left(T_0^{*} - T_{03}\\right) = 1005\\,(2419 - 420) \\approx 2.01\\times10^{6}\\ \\text{J/kg}',
        note: 'Push past this and the duct can no longer pass the same mass flow \u2014 back-pressure builds and the inlet condition must change.' },
    ],
    result: {
      eq: 'q_{max} = c_p\\left(\\dfrac{T_{03}}{(T_0/T_0^{*})_3} - T_{03}\\right)',
      label: 'One table lookup turns \u201chow much heat is too much\u201d into a single division.',
    },
    closer:
      'This is the real payoff of the starred quantities: they turn the thermal-choking limit \u2014 usually the hardest idea in this unit \u2014 into arithmetic.',
  },

  // ── EXAMPLE 3 SETUP ───────────────────────────────────────────────────────────
  {
    type: 'table',
    sectionNumber: 'Example 3',
    heading: 'Setup \u2014 the Table IS the Impulse Relation',
    intro:
      'Same p/p* column as Example 1, but now let\u2019s see where it comes from: p/p* = (1+&gamma;)/(1+&gamma;M&sup2;) is the impulse balance in disguise.',
    highlightRows: [0.20, 0.35],
    highlightCols: ['pp'],
    caption:
      'These are the same two burner stations as the Fluid Impulse deck\u2019s worked example \u2014 M = 0.20 in, M = 0.35 out.',
    bridge:
      'Divide the same column, and you rederive the impulse-based pressure ratio without ever writing I = pA(1+&gamma;M&sup2;) by hand.',
  },

  // ── EXAMPLE 3 SOLVE ────────────────────────────────────────────────────────────
  {
    type: 'derive',
    sectionNumber: 'Example 3',
    heading: 'Solve \u2014 and the Punchline',
    intro:
      'Compare the table-lookup answer against the impulse-conservation derivation from the Fluid Impulse deck.',
    steps: [
      { n: '1', tag: 'Table lookup at M = 0.20',
        eq: '\\left(\\dfrac{p}{p^{*}}\\right)_{3} = 2.2727' },
      { n: '2', tag: 'Table lookup at M = 0.35',
        eq: '\\left(\\dfrac{p}{p^{*}}\\right)_{4} = 2.0487' },
      { n: '3', tag: 'Divide',
        eq: '\\dfrac{p_4}{p_3} = \\dfrac{2.0487}{2.2727} = 0.901 \\quad (\\text{a } 9.9\\%\\ \\text{drop})',
        note: 'Same 9.9% loss as the impulse-derived worked example.' },
      { n: '4', tag: 'The impulse formula gives the same number',
        eq: '\\dfrac{p_4}{p_3} = \\dfrac{1+\\gamma M_3^{2}}{1+\\gamma M_4^{2}} = \\dfrac{1.056}{1.1715} = 0.901',
        note: 'Table division and the impulse derivation are the <strong>identical calculation</strong> \u2014 the table just pre-divides it for you at every M.' },
    ],
    result: {
      eq: '\\dfrac{p}{p^{*}} = \\dfrac{1+\\gamma}{1+\\gamma M^{2}} \\;\\Longrightarrow\\; \\dfrac{p_2}{p_1} = \\dfrac{1+\\gamma M_1^{2}}{1+\\gamma M_2^{2}}',
      label: 'The star cancels exactly because it is defined by the same conserved impulse at both stations.',
    },
    closer:
      'That\u2019s the whole trick behind every starred quantity: define a fixed reference from a conserved quantity, tabulate it once per Mach number, then divide it away whenever you compare two stations.',
  },

  // ── RECAP ─────────────────────────────────────────────────────────────────────
  {
    type: 'concept',
    sectionNumber: 'Recap',
    heading: 'Why the Stars Aren\u2019t Actually Confusing',
    intro:
      'Three worked examples, one recurring pattern \u2014 the star is never the point, the division is.',
    cards: [
      { tag: '\u2460', accent: '#5ec8d8', label: 'Fixed, Not Reached',
        body: 'The star is the M = 1 state for <strong>your</strong> duct\u2019s specific mass flux and impulse \u2014 usually never actually visited by the real flow.' },
      { tag: '\u2461', accent: '#f0a93b', label: 'One Function of M',
        body: 'Every ratio \u2014 T/T*, p/p*, T\u2080/T\u2080*, p\u2080/p\u2080*, V/V* \u2014 is pure algebra in M and &gamma;. That algebra is exactly what the table pre-computes.' },
      { tag: '\u2462', accent: '#5ec8d8', label: 'Cancels on Division',
        body: 'Two stations, two lookups, one division \u2014 the star disappears and only the physical ratio you actually wanted survives.' },
    ],
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

function DeriveSlide({ slide, revealed }) {
  const steps = slide.steps || []
  const resultStep = steps.length + 1
  const closerStep = resultStep + (slide.result ? 1 : 0)
  return (
    <div className="slide-inner compress-slide">
      <SlideHead slide={slide} />
      {slide.intro && (
        <div className={`reveal-block${revealed > 0 ? ' revealed' : ''}`}>
          <p className="cf-note cf-note--lead"><HTML>{slide.intro}</HTML></p>
        </div>
      )}
      <div className="drv-col">
        {steps.map((s, i) => (
          <div key={i} className={`drv-row reveal-block${revealed > i + 1 ? ' revealed' : ''}`}>
            <span className="drv-num">{s.n}</span>
            <div className="drv-body">
              {s.tag && <div className="drv-tag">{s.tag}</div>}
              <div className="drv-eq"><Equation latex={s.eq} /></div>
              {s.note && <p className="drv-note"><HTML>{s.note}</HTML></p>}
            </div>
          </div>
        ))}
      </div>
      {slide.result && (
        <div className={`reveal-block drv-result${revealed > resultStep ? ' revealed' : ''}`}>
          <div className="drv-result-eq"><Equation latex={slide.result.eq} /></div>
          {slide.result.label && <div className="drv-result-label"><HTML>{slide.result.label}</HTML></div>}
        </div>
      )}
      {slide.closer && (
        <div className={`reveal-block cf-bridge${revealed > closerStep ? ' revealed' : ''}`}>
          <HTML>{slide.closer}</HTML>
        </div>
      )}
    </div>
  )
}

// ─── NEW: TableSlide — a real Rayleigh-table snapshot with two-pass reveal ───
function TableSlide({ slide, revealed }) {
  const introOn     = revealed > 0
  const highlightOn = revealed > 1
  const bridgeStep  = 2
  const hlRows = slide.highlightRows || []
  const hlCols = slide.highlightCols || []
  const anyHighlight = highlightOn && (hlRows.length > 0 || hlCols.length > 0)

  return (
    <div className="slide-inner compress-slide">
      <SlideHead slide={slide} />
      {slide.intro && (
        <div className={`reveal-block${introOn ? ' revealed' : ''}`}>
          <p className="cf-note cf-note--lead"><HTML>{slide.intro}</HTML></p>
        </div>
      )}
      <div className={`reveal-block rt-wrap${introOn ? ' revealed' : ''}`}>
        <div className="rt-scroll">
          <table className="rt-table">
            <thead>
              <tr>
                <th className="rt-mcol">M</th>
                {RAYLEIGH_COLS.map(c => (
                  <th key={c.key}
                      className={anyHighlight && hlCols.includes(c.key) ? 'rt-col-hl' : ''}>
                    {c.label.replace('\u2071\u1d43', '*')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RAYLEIGH_ROWS.map(r => {
                const rowHL = anyHighlight && hlRows.includes(r.M)
                return (
                  <tr key={r.M} className={rowHL ? 'rt-row-hl' : ''}>
                    <td className={`rt-mcol${rowHL ? ' rt-row-hl' : ''}`}>{r.M.toFixed(2)}</td>
                    {RAYLEIGH_COLS.map(c => {
                      const colHL = anyHighlight && hlCols.includes(c.key)
                      const cellHL = rowHL && colHL
                      return (
                        <td key={c.key}
                            className={`${colHL ? 'rt-col-hl' : ''} ${rowHL ? 'rt-row-hl' : ''} ${cellHL ? 'rt-cell-hl' : ''}`}>
                          {r[c.key].toFixed(4)}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {slide.caption && (
          <p className="rt-caption"><HTML>{slide.caption}</HTML></p>
        )}
      </div>
      {slide.bridge && (
        <div className={`reveal-block cf-bridge${revealed > bridgeStep ? ' revealed' : ''}`}>
          <HTML>{slide.bridge}</HTML>
        </div>
      )}
    </div>
  )
}

// ─── Steps per slide ─────────────────────────────────────────────────────────
function totalSteps(slide) {
  switch (slide.type) {
    case 'concept':  return 1 + (slide.cards?.length || 0) + (slide.bridge ? 1 : 0)
    case 'equation': return 3 + (slide.cards?.length || 0) + (slide.bridge ? 1 : 0)
    case 'derive':   return 1 + (slide.steps?.length || 0) + (slide.result ? 1 : 0) + (slide.closer ? 1 : 0)
    case 'table':    return 2 + (slide.bridge ? 1 : 0)
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
      case 'derive':   return <DeriveSlide slide={slide} revealed={revealed} />
      case 'table':    return <TableSlide slide={slide} revealed={revealed} />
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
        <span className="nav-hint">&larr; &rarr; or click \u00b7 click again to light up the table</span>
      </div>
    </div>
  )
}

// ─── Styles (shared theme with the Rayleigh Flow / Fluid Impulse decks) ─────
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

/* term glossary */
.term-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 26px;margin:6px 0 12px;max-width:920px}
.term-item{display:flex;align-items:baseline;gap:10px}
.term-sym{color:var(--accent);min-width:54px}
.term-def{font-size:13.5px;color:var(--muted);line-height:1.45}

.mini-card{background:var(--panel);border:1px solid var(--rule);
  border-radius:10px;padding:12px 16px;display:flex;flex-direction:column;gap:4px;max-width:980px}
.mini-card strong{font-size:14.5px;color:var(--accent)}
.mini-card span{font-size:13.5px;line-height:1.5;color:var(--muted)}

/* derivation steps */
.drv-col{display:flex;flex-direction:column;gap:10px;margin:12px 0 14px;max-width:1000px}
.drv-row{display:flex;gap:14px;align-items:flex-start;background:var(--panel);
  border:1px solid var(--rule);border-radius:10px;padding:12px 16px;
  opacity:0;transform:translateY(8px);transition:.42s ease}
.drv-row.revealed{opacity:1;transform:none}
.drv-num{flex:0 0 26px;height:26px;border-radius:50%;background:var(--accent);color:var(--bg);
  font-family:var(--display);font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center}
.drv-body{flex:1;min-width:0}
.drv-tag{font-family:var(--display);font-size:11px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--accent-2);margin-bottom:4px}
.drv-eq{font-size:16px;overflow-x:auto;padding:2px 0}
.drv-note{font-size:13px;line-height:1.5;color:var(--muted);margin:4px 0 0}
.drv-note strong{color:var(--accent-2)}
.drv-note em{color:var(--accent)}
.drv-result{background:var(--panel);border:1px solid var(--rule);
  border-left:3px solid var(--accent-2);border-radius:10px;padding:14px 20px;
  display:flex;flex-direction:column;gap:8px;max-width:1000px}
.drv-result-eq{font-size:20px;overflow-x:auto}
.drv-result-label{font-size:13px;color:var(--muted);line-height:1.45}

/* rayleigh table snapshot */
.rt-wrap{max-width:1020px}
.rt-scroll{overflow-x:auto;border:1px solid var(--rule);border-radius:10px;background:var(--panel)}
.rt-table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums;font-size:13.5px}
.rt-table th,.rt-table td{padding:8px 14px;text-align:right;white-space:nowrap;
  border-bottom:1px solid var(--rule);transition:background-color .5s ease,color .5s ease}
.rt-table thead th{font-family:var(--display);font-size:12.5px;letter-spacing:.06em;
  color:var(--accent);border-bottom:2px solid var(--rule);text-align:right;padding-top:10px}
.rt-mcol{text-align:left !important;color:var(--muted);font-weight:600}
.rt-table thead th.rt-mcol{color:var(--accent)}
.rt-table tbody tr:last-child td{border-bottom:none}
.rt-col-hl{background:rgba(94,200,216,.13)}
.rt-row-hl{background:rgba(240,169,59,.11)}
td.rt-cell-hl{background:rgba(240,169,59,.32);color:var(--ink);font-weight:700;
  box-shadow:inset 0 0 0 1px rgba(240,169,59,.6)}
th.rt-col-hl{background:rgba(94,200,216,.22)}
.rt-caption{font-size:12.5px;line-height:1.5;color:var(--muted);margin:10px 2px 0}
.rt-caption em{color:var(--accent-2);font-style:italic}

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
  .cmp-row,.drv-col{flex-direction:column}
  .title-meta{gap:24px}
  .rt-table{font-size:12px}
  .rt-table th,.rt-table td{padding:6px 9px}
}
@media (prefers-reduced-motion:reduce){
  .anim-in,.reveal-block,.cmp-card,.drv-row{animation:none;transition:none}
}
`
