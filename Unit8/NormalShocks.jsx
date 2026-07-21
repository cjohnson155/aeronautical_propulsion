import React, { useState, useEffect, useCallback } from "react";

/* ============================================================================
   UNIT 8 — SHOCKS & EXPANSIONS   ·   ME 3470
   ----------------------------------------------------------------------------
   Matches the PropulsionDeck visual system (grid bg, Archivo/Oswald/JetBrains
   Mono, amber + cyan accents, panel-bordered blocks).

   STATUS: transcribed from handwritten pages ① and ② (through Mass
   Conservation). The Momentum slide is intentionally a PENDING stub — its
   equation runs off the bottom of page ②. To extend the deck as more photos
   arrive, just append objects to the SLIDES array below; nothing else changes.
   ========================================================================== */

const C = {
  bg: "#0a0e14",
  panel: "#10161f",
  line: "#1d2733",
  amber: "#ffb443",
  cyan: "#3fd0d6",
  dim: "#5a6b7b",
  text: "#dde6ef",
  grid: "rgba(63,208,214,0.05)",
};

const display = "'Archivo', sans-serif";
const head = "'Oswald', sans-serif";
const mono = "'JetBrains Mono', monospace";

/* ---------- tiny math helpers (unicode-first; Frac ready for ratio slides) -- */
const Sub = ({ children }) => <sub style={{ fontSize: "0.68em" }}>{children}</sub>;
const Sup = ({ children }) => <sup style={{ fontSize: "0.68em" }}>{children}</sup>;
function Frac({ n, d }) {
  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", margin: "0 4px" }}>
      <span style={{ padding: "0 4px" }}>{n}</span>
      <span style={{ borderTop: `1px solid ${C.text}`, width: "100%", padding: "0 4px" }}>{d}</span>
    </span>
  );
}

/* ---------- normal-shock relations (γ = 1.4) for the plots ----------------- */
const GREEN = "#7bd88f";
const m1Range = Array.from({ length: 21 }, (_, k) => 1 + k * 0.1);
const f_m2 = (m) => Math.sqrt((m * m + 5) / (7 * m * m - 1));      // M2(M1)
const f_pr = (m) => (2.8 * m * m - 0.4) / 2.4;                     // P2/P1
const f_rr = (m) => (2.4 * m * m) / (0.4 * m * m + 2);            // rho2/rho1 = V1/V2
const f_tr = (m) => f_pr(m) / f_rr(m);                            // T2/T1
const m1Wide = Array.from({ length: 25 }, (_, k) => 1 + k * 0.25); // 1 → 7
const f_ptr = (m) => Math.pow((1.2 * m * m) / (1 + 0.2 * m * m), 3.5) * Math.pow((7 / 6) * m * m - 1 / 6, -2.5); // Pt2/Pt1
const f_dsr = (m) => -Math.log(f_ptr(m));                         // (s2-s1)/R
const pts = (fn, range = m1Range) => range.map((x) => ({ x, y: fn(x) }));

function Plot({ xDomain, yDomain, series, yRef, xLabel }) {
  const W = 400, H = 258, m = { l: 46, r: 14, t: 14, b: 34 };
  const iw = W - m.l - m.r, ih = H - m.t - m.b;
  const [x0, x1] = xDomain, [y0, y1] = yDomain;
  const sx = (x) => m.l + ((x - x0) / (x1 - x0)) * iw;
  const sy = (y) => m.t + ih - ((y - y0) / (y1 - y0)) * ih;
  const path = (p) => p.map((q, i) => `${i ? "L" : "M"}${sx(q.x).toFixed(1)},${sy(q.y).toFixed(1)}`).join(" ");
  const xticks = []; for (let t = Math.ceil(x0); t <= x1 + 1e-9; t++) xticks.push(t);
  const step = Math.max(1, Math.round((y1 - y0) / 5));
  const yticks = []; for (let t = Math.ceil(y0); t <= y1 + 1e-9; t += step) yticks.push(t);
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.line}`, padding: 12 }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block" }}>
        <line x1={m.l} y1={m.t} x2={m.l} y2={m.t + ih} stroke={C.dim} strokeWidth="1" />
        <line x1={m.l} y1={m.t + ih} x2={m.l + iw} y2={m.t + ih} stroke={C.dim} strokeWidth="1" />
        {xticks.map((t) => (
          <text key={"x" + t} x={sx(t)} y={m.t + ih + 15} fill={C.dim} fontSize="10" fontFamily="monospace" textAnchor="middle">{t}</text>
        ))}
        {yticks.map((t) => (
          <text key={"y" + t} x={m.l - 6} y={sy(t) + 3} fill={C.dim} fontSize="10" fontFamily="monospace" textAnchor="end">{t}</text>
        ))}
        {yRef !== undefined && (
          <line x1={m.l} y1={sy(yRef)} x2={m.l + iw} y2={sy(yRef)} stroke={C.amber} strokeWidth="1" strokeDasharray="4 4" opacity="0.7" />
        )}
        {series.map((s, i) => (
          <path key={i} d={path(s.points)} fill="none" stroke={s.color} strokeWidth="2.2" />
        ))}
        <text x={m.l + iw} y={m.t + ih + 30} fill={C.dim} fontSize="10.5" fontFamily="monospace" textAnchor="end">{xLabel}</text>
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 6 }}>
        {series.map((s, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: mono, fontSize: 11, color: C.dim }}>
            <span style={{ width: 14, height: 3, background: s.color, display: "inline-block" }} /> {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ============================== SLIDE DATA ================================= */
const SLIDES = [
  {
    kind: "title",
    unit: "UNIT 8",
    title: "Shocks & Expansions",
    subtitle: "ME 3470 · Compressible Flow",
    note: "From a single weak compression wave to the formation of a shock — and the equations that govern it.",
  },

  {
    kind: "section",
    index: "01",
    eyebrow: "SPEED OF SOUND",
    title: "The weak compression wave",
    lead: [
      "Recall the definition of the speed of sound: an infinitesimal compression wave travels through the gas at speed a, separating two nearly identical states.",
    ],
    states: {
      leftLabel: "BEHIND WAVE",
      left: ["P + dP", "ρ + dρ", "T + dT", "u + du"],
      rightLabel: "AHEAD",
      right: ["P", "ρ", "T", "u"],
      arrow: "a",
    },
    callout: {
      tone: "cyan",
      label: "WHY ISENTROPIC",
      text:
        "The changes across the wave are small enough to be reversible. No heat crosses the control volume drawn around the wave → adiabatic → isentropic. The gas compresses locally, then expands back to equilibrium once the wave passes.",
    },
  },

  {
    kind: "section",
    index: "02",
    eyebrow: "THOUGHT EXPERIMENT",
    title: "A train of infinitesimal waves",
    lead: [
      "Picture a stationary gas in a duct — we sit in the lab reference frame, so V_gas = 0.",
      "A piston at the left end taps out a series of infinitesimal sound waves. Each wave leaves behind a gas that is slightly compressed and slightly warmer than the one ahead of it.",
    ],
    equations: [{ expr: <span>V<Sub>gas</Sub> = 0</span>, note: "lab reference frame" }],
    callout: {
      tone: "amber",
      label: "SETUP",
      text:
        "The first (black) wave moves into undisturbed gas. The next (blue) wave moves into gas that the black wave has already changed.",
    },
  },

  {
    kind: "section",
    index: "03",
    eyebrow: "THE KEY INSIGHT",
    title: "Later waves catch up",
    lead: [
      "What do we know about the speed of sound as a function of temperature?",
    ],
    equations: [{ expr: <span>a ∝ √T</span>, note: "sound speed rises with temperature" }],
    callout: {
      tone: "cyan",
      label: "CATCH-UP",
      text:
        "Because a ∝ √T, a wave moving into gas warmed by the wave ahead of it travels slightly faster. Blue catches up to black; green catches up to blue even quicker, since it sees an even warmer gas.",
    },
  },

  {
    kind: "section",
    index: "04",
    eyebrow: "FORMATION",
    title: "Compressions coalesce → a shock",
    lead: [
      "As the faster trailing waves overtake the leaders, the infinitesimal compressions pile up on top of one another.",
    ],
    result: {
      expr: <span>coalesced compression wave&nbsp;=&nbsp;<strong style={{ color: C.amber }}>shockwave</strong></span>,
    },
    callout: {
      tone: "amber",
      label: "DEFINITION",
      text:
        "Each compression is isentropic on its own, but the coalesced wave is much stronger and NON-isentropic. That non-isentropic compression wave is a shockwave.",
    },
  },

  {
    kind: "section",
    index: "05",
    eyebrow: "OPEN QUESTIONS",
    title: "What are we actually dealing with?",
    lead: [
      "Before deriving anything, the notes leave two questions open — they drive the rest of the unit.",
    ],
    questions: [
      "If the coalesced waves propagate at the speed of sound — which speed of sound? The gas in front of the shock, or the gas behind it?",
      "Is a shock just a large-amplitude sound wave, or does its \u201Cnon-isentropic-ness\u201D fundamentally change the gas behind it?",
    ],
  },

  {
    kind: "section",
    index: "06",
    eyebrow: "REFERENCE FRAME",
    title: "Ride along with the shock",
    lead: [
      "To analyze it, jump into a reference frame that travels with the shock, so the shock looks stationary.",
      "In this frame the observer sees gas rushing toward the shock on one side and rushing away on the other. The flow is treated as 1-D.",
    ],
    equations: [
      { expr: <span>U<Sub>shock</Sub> = − u<Sub>gas, in front</Sub></span>, note: "shock frame ↔ lab frame" },
    ],
    callout: {
      tone: "cyan",
      label: "THE TWO STATES",
      text:
        "Gas approaches at state 1 (in front) and leaves at state 2 (behind). The question becomes: what happens to the flow between these two states?",
    },
  },

  {
    kind: "section",
    index: "07",
    eyebrow: "CONTROL VOLUME",
    title: "The CV and its assumptions",
    lead: [
      "Fix a control volume that travels with the shock so the shock appears stationary inside it. State 1 enters (u, P, T, ρ); state 2 leaves (u\u2082, P\u2082, T\u2082, ρ\u2082).",
    ],
    assumptions: [
      "No heat transfer",
      "No shaft work",
      "Neglect body forces (gravity)",
      "Inviscid — neglect shear stress",
    ],
    callout: {
      tone: "amber",
      label: "NOTE",
      text:
        "The infinitesimal \u201C+ d\u201D versions of the properties were only true for a tiny Mach wave. Across a real shock we carry finite state-2 values (subscript 2).",
    },
  },

  {
    kind: "section",
    index: "08",
    eyebrow: "CONSERVATION · 1 of 3",
    title: "Mass conservation",
    lead: [
      "Apply conservation of mass across the CV.",
    ],
    equations: [
      { expr: <span>ρ<Sub>1</Sub>u<Sub>1</Sub>A<Sub>1</Sub> = ρ<Sub>2</Sub>u<Sub>2</Sub>A<Sub>2</Sub></span>, note: "general form" },
      { expr: <span>A<Sub>1</Sub> = A<Sub>2</Sub></span>, note: "CV length ⊥ to flow → area cancels" },
    ],
    result: {
      expr: <span>ρ<Sub>1</Sub>u<Sub>1</Sub> = ρ<Sub>2</Sub>u<Sub>2</Sub></span>,
    },
  },

  {
    kind: "section",
    index: "09",
    eyebrow: "CONSERVATION · 2 of 3",
    title: "Momentum",
    lead: [
      "Apply conservation of momentum across the CV. With constant area (A₁ = A₂), the area terms cancel.",
    ],
    equations: [
      { expr: <span>A<Sub>1</Sub>( P<Sub>1</Sub> + ρ<Sub>1</Sub>u<Sub>1</Sub><Sup>2</Sup> ) = ( P<Sub>2</Sub> + ρ<Sub>2</Sub>u<Sub>2</Sub><Sup>2</Sup> )A<Sub>2</Sub></span>, note: "A₁ = A₂ → area cancels" },
    ],
    result: {
      expr: <span>P<Sub>1</Sub> + ρ<Sub>1</Sub>u<Sub>1</Sub><Sup>2</Sup> = P<Sub>2</Sub> + ρ<Sub>2</Sub>u<Sub>2</Sub><Sup>2</Sup></span>,
    },
  },

  {
    kind: "section",
    index: "10",
    eyebrow: "CONSERVATION · 3 of 3",
    title: "Energy",
    lead: [
      "The energy equation, with no shaft work and no heat transfer, reduces to the total (stagnation) enthalpy being conserved.",
    ],
    equations: [
      { expr: <span>h<Sub>1</Sub> + <Frac n={<span>u<Sub>1</Sub><Sup>2</Sup></span>} d="2" /> = h<Sub>2</Sub> + <Frac n={<span>u<Sub>2</Sub><Sup>2</Sup></span>} d="2" /></span>, note: "q̸ − w̸ drop out" },
    ],
    result: { expr: <span>h<Sub>t</Sub> = constant</span> },
    callout: {
      tone: "cyan",
      label: "FOR A CPG",
      text:
        "If the gas is calorically perfect, h = cₚT, so total temperature is conserved too: T_t = constant across the shock.",
    },
  },

  {
    kind: "section",
    index: "11",
    eyebrow: "THE PARADOX",
    title: "So what happens across the shock?",
    lead: [
      "These are exactly our Rayleigh-flow equations minus heat transfer, and our quasi-1D nozzle/diffuser equations minus area change. So what actually changes across the shock?",
      "A shock is a very thin region — finite thickness, order micrometres — that is DOMINATED by viscous stress. But wait: didn\u2019t we assume inviscid flow?",
    ],
    callout: {
      tone: "amber",
      label: "RESOLUTION",
      text:
        "We drew the CV AROUND the shock. As long as the viscous region stays buried inside, the flow crossing the CV walls is inviscid — and the before/after property changes already capture the effect of the shock\u2019s viscosity.",
    },
  },

  {
    kind: "section",
    index: "12",
    eyebrow: "CLOSURE",
    title: "Closing the system",
    lead: [
      "Three conservation equations, four unknowns (ρ, u, P, T at state 2). We need one more relation — an equation of state.",
    ],
    equations: [
      { expr: <span>ρ<Sub>1</Sub>u<Sub>1</Sub> = ρ<Sub>2</Sub>u<Sub>2</Sub></span>, note: "① mass" },
      { expr: <span>P<Sub>1</Sub> + ρ<Sub>1</Sub>u<Sub>1</Sub><Sup>2</Sup> = P<Sub>2</Sub> + ρ<Sub>2</Sub>u<Sub>2</Sub><Sup>2</Sup></span>, note: "② momentum" },
      { expr: <span>c<Sub>p</Sub>T<Sub>1</Sub> + <Frac n={<span>u<Sub>1</Sub><Sup>2</Sup></span>} d="2" /> = c<Sub>p</Sub>T<Sub>2</Sub> + <Frac n={<span>u<Sub>2</Sub><Sup>2</Sup></span>} d="2" /></span>, note: "③ energy" },
      { expr: <span>P<Sub>2</Sub> = ρ<Sub>2</Sub>R T<Sub>2</Sub></span>, note: "④ perfect-gas EoS" },
    ],
    result: { expr: <span>4 equations · 4 unknowns → solvable</span> },
    assumptions: [
      "Steady flow (we ride with the shock)",
      "Only before/after states — both in equilibrium",
      "Perfect gas (P.G.)",
      "P = ρRT · dh = cₚdT · a² = γRT",
    ],
  },

  {
    kind: "section",
    index: "13",
    eyebrow: "ANALYTICAL FORM",
    title: "Rankine–Hugoniot",
    lead: [
      "Combining the equations gives a clean analytical result for the density ratio across a normal shock.",
    ],
    result: {
      expr: (
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          <Frac n={<span>ρ<Sub>2</Sub></span>} d={<span>ρ<Sub>1</Sub></span>} />
          <span style={{ margin: "0 8px" }}>=</span>
          <Frac
            n={<span style={{ display: "inline-flex", alignItems: "center" }}>1 + <Frac n="γ+1" d="γ−1" /><Frac n={<span>P<Sub>2</Sub></span>} d={<span>P<Sub>1</Sub></span>} /></span>}
            d={<span style={{ display: "inline-flex", alignItems: "center" }}><Frac n="γ+1" d="γ−1" /> + <Frac n={<span>P<Sub>2</Sub></span>} d={<span>P<Sub>1</Sub></span>} /></span>}
          />
        </span>
      ),
    },
    callout: {
      tone: "cyan",
      label: "READ IT OFF",
      text:
        "The density ratio across a normal shock is ONLY a function of γ and the pressure ratio — every other variable has been baked in.",
    },
  },

  {
    kind: "section",
    index: "14",
    eyebrow: "SECOND LAW",
    title: "Entropy change",
    lead: [
      "We already have a relation between density and pressure — Gibbs. Swapping in the shock relations gives the entropy change as a function of the density and pressure ratios.",
    ],
    equations: [
      { expr: <span>s<Sub>2</Sub> − s<Sub>1</Sub> = C<Sub>v</Sub> ln<span style={{ display: "inline-flex" }}>(<Frac n={<span>T<Sub>2</Sub></span>} d={<span>T<Sub>1</Sub></span>} />)</span> − R ln<span style={{ display: "inline-flex" }}>(<Frac n={<span>ρ<Sub>2</Sub></span>} d={<span>ρ<Sub>1</Sub></span>} />)</span></span>, note: "Gibbs" },
    ],
    result: {
      expr: (
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          <Frac n={<span>s<Sub>2</Sub> − s<Sub>1</Sub></span>} d={<span>C<Sub>v</Sub></span>} />
          <span style={{ margin: "0 8px" }}>= ln</span>
          <span>[ <Frac n={<span>P<Sub>2</Sub></span>} d={<span>P<Sub>1</Sub></span>} /><span style={{ display: "inline-flex", alignItems: "flex-start" }}>(<Frac n={<span>ρ<Sub>2</Sub></span>} d={<span>ρ<Sub>1</Sub></span>} />)<Sup>−γ</Sup></span> ]</span>
        </span>
      ),
    },
    callout: {
      tone: "amber",
      label: "MEANING",
      text:
        "Entropy change across a normal shock, expressed purely through the density and pressure ratios.",
    },
  },

  {
    kind: "section",
    index: "15",
    eyebrow: "CONVENIENT FORMS",
    title: "Mach-number relations",
    lead: [
      "Rewriting the ratios in terms of upstream and downstream Mach number gives the forms you actually use.",
    ],
    equations: [
      { expr: <span><Frac n={<span>u<Sub>2</Sub></span>} d={<span>u<Sub>1</Sub></span>} /> = <Frac n={<span>M<Sub>2</Sub></span>} d={<span>M<Sub>1</Sub></span>} /> √<span style={{ display: "inline-flex" }}>(<Frac n={<span>T<Sub>2</Sub></span>} d={<span>T<Sub>1</Sub></span>} />)</span></span>, note: "velocity · def. of M & a=√(γRT)" },
      { expr: <span><Frac n={<span>ρ<Sub>2</Sub></span>} d={<span>ρ<Sub>1</Sub></span>} /> = <Frac n={<span>M<Sub>1</Sub></span>} d={<span>M<Sub>2</Sub></span>} /> √<span style={{ display: "inline-flex" }}>(<Frac n={<span>T<Sub>1</Sub></span>} d={<span>T<Sub>2</Sub></span>} />)</span></span>, note: "density · from ρ₁u₁ = ρ₂u₂" },
      { expr: <span><Frac n={<span>T<Sub>2</Sub></span>} d={<span>T<Sub>1</Sub></span>} /> = <Frac n={<span>1 + <Frac n="γ−1" d="2" /> M<Sub>1</Sub><Sup>2</Sup></span>} d={<span>1 + <Frac n="γ−1" d="2" /> M<Sub>2</Sub><Sup>2</Sup></span>} /></span>, note: "temperature · from total enthalpy h_t1 = h_t2" },
      { expr: <span><Frac n={<span>P<Sub>2</Sub></span>} d={<span>P<Sub>1</Sub></span>} /> = <Frac n={<span>1 + γM<Sub>1</Sub><Sup>2</Sup></span>} d={<span>1 + γM<Sub>2</Sub><Sup>2</Sup></span>} /></span>, note: "pressure · from momentum (fluid impulse)" },
    ],
  },

  {
    kind: "section",
    index: "16",
    eyebrow: "CONVENIENT FORMS",
    title: "Downstream Mach number",
    lead: [
      "Combining the relations closes the loop: M₂ falls out as a function of the upstream Mach number and γ alone.",
    ],
    result: {
      expr: <span>M<Sub>2</Sub><Sup>2</Sup> = <Frac n={<span>M<Sub>1</Sub><Sup>2</Sup> + <Frac n="2" d="γ−1" /></span>} d={<span><Frac n="2γ" d="γ−1" /> M<Sub>1</Sub><Sup>2</Sup> − 1</span>} /></span>,
    },
    callout: {
      tone: "cyan",
      label: "WHY IT MATTERS",
      text:
        "Once you know M₁ and γ, this gives M₂ directly — and every other ratio follows from the relations on the previous slide.",
    },
  },

  {
    kind: "section",
    index: "17",
    eyebrow: "SHOCK STRENGTH",
    title: "Mach number behind the shock",
    lead: [
      "Plotting M₂ against M₁ (γ = 1.4) shows the defining behaviour of a normal shock.",
    ],
    plot: {
      xDomain: [1, 3],
      yDomain: [0, 1.5],
      yRef: 1,
      xLabel: "M₁",
      series: [{ color: C.amber, label: "M₂", points: pts(f_m2) }],
    },
    callout: {
      tone: "amber",
      label: "ALWAYS SUBSONIC",
      text:
        "In the shock frame the flow behind a normal shock is ALWAYS subsonic (M₂ < 1). The M₁ < 1 → M₂ > 1 branch would be an expansion shock — forbidden by the 2nd law.",
    },
  },

  {
    kind: "section",
    index: "18",
    eyebrow: "SHOCK STRENGTH",
    title: "How the ratios grow",
    lead: [
      "As shock strength (M₁) increases, the property ratios respond differently — some without bound, some toward a limit.",
    ],
    plot: {
      xDomain: [1, 3],
      yDomain: [0, 11],
      yRef: 6,
      xLabel: "M₁",
      series: [
        { color: C.cyan, label: "P₂/P₁", points: pts(f_pr) },
        { color: GREEN, label: "T₂/T₁", points: pts(f_tr) },
        { color: C.amber, label: "ρ₂/ρ₁ = V₁/V₂", points: pts(f_rr) },
      ],
    },
    assumptions: [
      "Pressure ratio ↑ (unbounded)",
      "Temperature ratio ↑ (unbounded)",
      "Density ratio ↑ → asymptote",
      "Velocity ratio V₂/V₁ ↓ → asymptote",
    ],
    callout: {
      tone: "cyan",
      label: "THE ASYMPTOTE",
      text:
        "Density (and thus V₁/V₂) can\u2019t grow forever: ρ₂/ρ₁ → (γ+1)/(γ−1) ≈ 6 for air as M₁ → ∞. Pressure and temperature keep climbing.",
    },
  },

  {
    kind: "section",
    index: "19",
    eyebrow: "STAGNATION",
    title: "Stagnation properties across the shock",
    lead: [
      "Across a normal shock, total temperature is conserved — but total pressure is always lost.",
    ],
    equations: [
      { expr: <span>T<Sub>t1</Sub> = T<Sub>t2</Sub></span>, note: "total temperature conserved" },
      { expr: <span>P<Sub>t2</Sub> &lt; P<Sub>t1</Sub></span>, note: "always" },
    ],
    result: {
      expr: (
        <span style={{ display: "inline-flex", alignItems: "center", flexWrap: "wrap" }}>
          <Frac n={<span>P<Sub>t2</Sub></span>} d={<span>P<Sub>t1</Sub></span>} />
          <span style={{ margin: "0 8px" }}>=</span>
          <span style={{ display: "inline-flex", alignItems: "flex-start" }}>
            [ <Frac n={<span><Frac n="γ+1" d="2" /> M<Sub>1</Sub><Sup>2</Sup></span>} d={<span>1 + <Frac n="γ−1" d="2" /> M<Sub>1</Sub><Sup>2</Sup></span>} /> ]<Sup>γ/(γ−1)</Sup>
          </span>
          <span style={{ margin: "0 6px" }}>·</span>
          <span style={{ display: "inline-flex", alignItems: "flex-start" }}>
            [ <Frac n="2γ" d="γ+1" /> M<Sub>1</Sub><Sup>2</Sup> − <Frac n="γ−1" d="γ+1" /> ]<Sup>1/(1−γ)</Sup>
          </span>
        </span>
      ),
    },
  },

  {
    kind: "section",
    index: "20",
    eyebrow: "STAGNATION",
    title: "Two more forms for total pressure",
    lead: [
      "Both follow from the isentropic total-pressure relation combined with the shock ratios.",
    ],
    equations: [
      { expr: <span><Frac n={<span>P<Sub>t2</Sub></span>} d={<span>P<Sub>t1</Sub></span>} /> = <span style={{ display: "inline-flex", alignItems: "flex-start" }}>(<Frac n={<span>T<Sub>1</Sub></span>} d={<span>T<Sub>2</Sub></span>} />)<Sup>γ/(γ−1)</Sup></span> · <Frac n={<span>P<Sub>2</Sub></span>} d={<span>P<Sub>1</Sub></span>} /></span>, note: "in terms of the temperature ratio" },
      { expr: <span><Frac n={<span>P<Sub>t2</Sub></span>} d={<span>P<Sub>1</Sub></span>} /> = <span style={{ display: "inline-flex", alignItems: "flex-start" }}>(1 + <Frac n="γ−1" d="2" /> M<Sub>2</Sub><Sup>2</Sup>)<Sup>γ/(γ−1)</Sup></span> · <Frac n={<span>P<Sub>2</Sub></span>} d={<span>P<Sub>1</Sub></span>} /></span>, note: "in terms of the downstream Mach number" },
    ],
    callout: {
      tone: "amber",
      label: "KEY FACT",
      text: "Stagnation pressure is LOST across a normal shock.",
    },
  },

  {
    kind: "section",
    index: "21",
    eyebrow: "STAGNATION",
    title: "Stagnation density",
    lead: [
      "From the total-property equation of state, and because total temperature is conserved, the stagnation density ratio equals the stagnation pressure ratio.",
    ],
    equations: [
      { expr: <span>P<Sub>t</Sub> = ρ<Sub>t</Sub>R T<Sub>t</Sub></span>, note: "total-property EoS" },
    ],
    result: {
      expr: <span><Frac n={<span>ρ<Sub>t2</Sub></span>} d={<span>ρ<Sub>t1</Sub></span>} /> = <Frac n={<span>P<Sub>t2</Sub></span>} d={<span>P<Sub>t1</Sub></span>} /></span>,
    },
  },

  {
    kind: "section",
    index: "22",
    eyebrow: "SECOND LAW",
    title: "Entropy rise = stagnation-pressure loss",
    lead: [
      "Entropy rises through the shock and climbs with shock strength (γ = 1.4). Because total temperature is conserved, that rise IS the stagnation-pressure drop.",
    ],
    plot: {
      xDomain: [1, 7],
      yDomain: [0, 4],
      xLabel: "M₁",
      series: [
        { color: C.cyan, label: "P₍t2₎/P₍t1₎", points: pts(f_ptr, m1Wide) },
        { color: GREEN, label: "(s₂−s₁)/R", points: pts(f_dsr, m1Wide) },
      ],
    },
    result: {
      expr: <span><Frac n={<span>P<Sub>t2</Sub></span>} d={<span>P<Sub>t1</Sub></span>} /> = e<Sup>−(s₂−s₁)/R</Sup></span>,
    },
    callout: {
      tone: "amber",
      label: "BECAUSE",
      text: "T_t2 = T_t1 — total temperature is constant across the shock, so the two curves are mirror images through the log relation.",
    },
  },

  {
    kind: "section",
    index: "23",
    eyebrow: "RECAP",
    title: "Normal shock — what to remember",
    lead: [
      "Everything a normal shock does, in one place.",
    ],
    assumptions: [
      "Flow behind is ALWAYS subsonic (M₂ < 1)",
      "P, T, and entropy all rise across it",
      "Density ratio is capped at (γ+1)/(γ−1)",
      "T_t conserved · P_t always lost",
    ],
    callout: {
      tone: "cyan",
      label: "THE ONE-LINER",
      text:
        "A shock conserves mass, momentum, energy and total temperature — but it is non-isentropic, so entropy climbs and stagnation pressure falls with shock strength.",
    },
  },
];

/* ============================== COMPONENTS ================================= */
const FONT_LINK_ID = "u8-fonts";
function useFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const l = document.createElement("link");
    l.id = FONT_LINK_ID;
    l.rel = "stylesheet";
    l.href =
      "https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Archivo:wght@400;500;600;700;900&display=swap";
    document.head.appendChild(l);
  }, []);
}

function Eq({ expr, note, boxed }) {
  return (
    <div
      style={{
        background: C.panel,
        border: `1px solid ${boxed ? C.amber : C.line}`,
        borderLeft: boxed ? `3px solid ${C.amber}` : `1px solid ${C.line}`,
        padding: "14px 16px",
        marginTop: 10,
      }}
    >
      <div style={{ fontFamily: mono, color: C.text, fontSize: "clamp(17px,2.4vw,24px)", letterSpacing: 1 }}>{expr}</div>
      {note && <div style={{ fontFamily: mono, color: C.dim, fontSize: 10.5, letterSpacing: 1, marginTop: 6, textTransform: "uppercase" }}>{note}</div>}
    </div>
  );
}

function StateBox({ label, rows }) {
  return (
    <div style={{ flex: 1, background: C.panel, border: `1px solid ${C.line}`, padding: "12px 14px" }}>
      <div style={{ fontFamily: mono, color: C.cyan, fontSize: 9.5, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      {rows.map((r, i) => (
        <div key={i} style={{ fontFamily: mono, color: C.text, fontSize: 15, lineHeight: 1.7 }}>{r}</div>
      ))}
    </div>
  );
}

function Callout({ tone, label, text }) {
  const color = tone === "cyan" ? C.cyan : C.amber;
  const bg = tone === "cyan" ? "rgba(63,208,214,0.05)" : "rgba(255,180,67,0.06)";
  return (
    <div style={{ marginTop: 14, padding: "10px 14px", border: `1px solid ${color}40`, borderLeft: `3px solid ${color}`, background: bg }}>
      <div style={{ fontFamily: mono, color, fontSize: 9.5, letterSpacing: 2, textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
      <span style={{ fontFamily: head, color: C.dim, fontSize: 13, lineHeight: 1.55 }}>{text}</span>
    </div>
  );
}

function TitleSlide({ s }) {
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", padding: "clamp(24px,6vw,90px)" }}>
      <div>
        <div style={{ fontFamily: mono, color: C.cyan, letterSpacing: 5, fontSize: 13, marginBottom: 22 }}>{s.unit}</div>
        <h1 style={{ fontFamily: display, fontWeight: 900, fontSize: "clamp(40px,8vw,104px)", color: C.text, margin: 0, lineHeight: 0.95, textTransform: "uppercase" }}>{s.title}</h1>
        <div style={{ fontFamily: mono, color: C.amber, letterSpacing: 3, fontSize: "clamp(12px,1.6vw,16px)", marginTop: 20 }}>{s.subtitle}</div>
        <p style={{ fontFamily: head, fontWeight: 400, color: C.dim, fontSize: "clamp(15px,2vw,22px)", marginTop: 26, maxWidth: 620, lineHeight: 1.5 }}>{s.note}</p>
      </div>
    </div>
  );
}

function SectionSlide({ s }) {
  const hasFigure = s.states || s.equations || s.result || s.plot;
  return (
    <div style={{ height: "100%", display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,44px)", padding: "clamp(22px,4.5vw,64px)", alignContent: "flex-start", overflow: "auto" }}>
      {/* left column: text */}
      <div style={{ flex: "1 1 340px", minWidth: 280 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <span style={{ fontFamily: display, fontWeight: 900, fontSize: "clamp(36px,6vw,76px)", color: C.amber, lineHeight: 0.8 }}>{s.index}</span>
          <span style={{ fontFamily: mono, color: C.cyan, fontSize: 12, letterSpacing: 2 }}>{s.eyebrow}</span>
        </div>
        <h2 style={{ fontFamily: display, fontWeight: 800, fontSize: "clamp(24px,3.4vw,44px)", color: C.text, margin: "10px 0 0", lineHeight: 1.05, textTransform: "uppercase" }}>{s.title}</h2>

        {s.lead && s.lead.map((p, i) => (
          <p key={i} style={{ fontFamily: head, fontWeight: 400, color: C.dim, fontSize: "clamp(14px,1.6vw,18px)", marginTop: i === 0 ? 16 : 10, lineHeight: 1.55, maxWidth: 520 }}>{p}</p>
        ))}

        {s.assumptions && (
          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: C.line, border: `1px solid ${C.line}`, maxWidth: 460 }}>
            {s.assumptions.map((a, i) => (
              <div key={i} style={{ background: C.panel, padding: "10px 12px", display: "flex", gap: 10, alignItems: "baseline" }}>
                <span style={{ fontFamily: mono, color: C.amber, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: head, color: C.text, fontSize: 13.5 }}>{a}</span>
              </div>
            ))}
          </div>
        )}

        {s.questions && s.questions.map((q, i) => (
          <div key={i} style={{ marginTop: 14, padding: "12px 16px", borderLeft: `3px solid ${C.amber}`, background: "rgba(255,180,67,0.05)" }}>
            <span style={{ fontFamily: mono, color: C.amber, fontSize: 11, marginRight: 8 }}>Q{i + 1}</span>
            <span style={{ fontFamily: head, color: C.text, fontStyle: "italic", fontSize: "clamp(14px,1.7vw,18px)", lineHeight: 1.5 }}>{q}</span>
          </div>
        ))}

        {s.callout && <Callout {...s.callout} />}
      </div>

      {/* right column: figure / equations */}
      {hasFigure && (
        <div style={{ flex: "1 1 320px", minWidth: 280, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {s.plot && <Plot {...s.plot} />}
          {s.states && (
            <div>
              <div style={{ display: "flex", gap: 1, background: C.line, border: `1px solid ${C.line}` }}>
                <StateBox label={s.states.leftLabel} rows={s.states.left} />
                <StateBox label={s.states.rightLabel} rows={s.states.right} />
              </div>
              <div style={{ textAlign: "center", fontFamily: mono, color: C.cyan, fontSize: 12, letterSpacing: 2, marginTop: 8 }}>
                ⟵ wave travels at speed <span style={{ color: C.amber }}>{s.states.arrow}</span>
              </div>
            </div>
          )}
          {s.equations && s.equations.map((e, i) => <Eq key={i} expr={e.expr} note={e.note} />)}
          {s.result && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontFamily: mono, color: C.amber, fontSize: 9.5, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Result</div>
              <Eq expr={s.result.expr} boxed />
            </div>
          )}
        </div>
      )}

      {s.pending && (
        <div style={{ flexBasis: "100%", marginTop: 4, padding: "12px 16px", border: `1px dashed ${C.dim}`, background: "rgba(90,107,123,0.08)" }}>
          <span style={{ fontFamily: mono, color: C.amber, fontSize: 10.5, letterSpacing: 2, marginRight: 10 }}>PENDING</span>
          <span style={{ fontFamily: head, color: C.dim, fontSize: 13, lineHeight: 1.5 }}>{s.pending}</span>
        </div>
      )}
    </div>
  );
}

export default function NormalShocks() {
  useFonts();
  const [i, setI] = useState(0);
  const n = SLIDES.length;
  const go = useCallback((d) => setI((p) => Math.max(0, Math.min(n - 1, p + d))), [n]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      if (e.key === "Home") setI(0);
      if (e.key === "End") setI(n - 1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go, n]);

  const s = SLIDES[i];

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        minHeight: 520,
        background: C.bg,
        backgroundImage: `linear-gradient(${C.grid} 1px, transparent 1px), linear-gradient(90deg, ${C.grid} 1px, transparent 1px)`,
        backgroundSize: "44px 44px",
        color: C.text,
        position: "relative",
        overflow: "hidden",
        fontFamily: head,
      }}
    >
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "50%", height: "60%", background: `radial-gradient(circle, ${C.amber}22, transparent 70%)`, pointerEvents: "none" }} />

      <div key={i} style={{ position: "absolute", inset: 0, animation: "fadeIn 420ms ease" }}>
        {s.kind === "title" && <TitleSlide s={s} />}
        {s.kind === "section" && <SectionSlide s={s} />}
      </div>

      {/* progress bar */}
      <div style={{ position: "absolute", top: 0, left: 0, height: 3, width: `${((i + 1) / n) * 100}%`, background: C.amber, transition: "width 300ms ease", zIndex: 10 }} />

      {/* controls */}
      <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 16, zIndex: 10 }}>
        <button onClick={() => go(-1)} disabled={i === 0} style={navBtn(i === 0)}>‹</button>
        <div style={{ fontFamily: mono, fontSize: 12, letterSpacing: 2, color: C.dim }}>
          <span style={{ color: C.text }}>{String(i + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
        </div>
        <button onClick={() => go(1)} disabled={i === n - 1} style={navBtn(i === n - 1)}>›</button>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px);} to {opacity:1; transform:none;} }`}</style>
    </div>
  );
}

function navBtn(disabled) {
  return {
    width: 38,
    height: 38,
    borderRadius: 2,
    border: `1px solid ${disabled ? "#1d2733" : "#3fd0d6"}`,
    background: "rgba(16,22,31,0.8)",
    color: disabled ? "#3a4654" : "#3fd0d6",
    fontSize: 20,
    cursor: disabled ? "default" : "pointer",
    fontFamily: "monospace",
    lineHeight: 1,
  };
}
