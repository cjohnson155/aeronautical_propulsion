import React, { useState, useEffect, useCallback } from "react";
import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

/**
 * Real Turbojet Cycle — Lecture Deck
 * Compressor section built out (spool architecture, physical, why-multistage, η_c).
 * Other components remain placeholder scaffold.
 *
 * Requires:  npm i katex react-katex
 *
 * Placeholder legend:
 *   <Img/>  image / component diagram   (pass `src` to render real image)
 *   <Eqn/>  equation block              (pass `tex` to render KaTeX)
 *   <Txt/>  prose / bullet zone
 */

// ---- image asset URLs (GitHub raw — build-independent) -----------------
const IMG_SINGLE_SPOOL =
  "https://raw.githubusercontent.com/cjohnson155/aeronautical_propulsion/main/Images/Unit7/IMG_0057.jpeg";
const IMG_TWO_SPOOL =
  "https://raw.githubusercontent.com/cjohnson155/aeronautical_propulsion/main/Images/Unit7/IMG_0055.png";

// ---- design tokens ----------------------------------------------------
const INK = "#12202e";      // near-black steel blue (body text)
const PAPER = "#f6f4ef";    // warm off-white (bg)
const ACCENT = "#c8622d";   // exhaust orange (single accent)
const MUTED = "#5c6b78";    // captions / labels
const LINE = "#c9cdc7";     // hairline rules / placeholder borders

// ---- placeholder primitives -------------------------------------------
const boxBase = {
  border: `2px dashed ${LINE}`,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  fontWeight: 600,
  textAlign: "center",
  background: "rgba(0,0,0,0.015)",
};

// Img: renders a real image (with attribution caption) if `src` given,
// otherwise a dashed placeholder.
const Img = ({ label = "image", src, alt = "", caption, h = 300, fit = "contain" }) => {
  if (!src) return <div style={{ ...boxBase, height: h, fontSize: 20 }}>[ {label} ]</div>;
  return (
    <figure style={{ margin: 0, display: "flex", flexDirection: "column", height: h }}>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          borderRadius: 10,
          overflow: "hidden",
          background: "rgba(0,0,0,0.03)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: fit, display: "block" }}
        />
      </div>
      {caption && (
        <figcaption style={{ marginTop: 8, fontSize: 13, color: MUTED, fontStyle: "italic" }}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

// Eqn: renders KaTeX block if `tex` given, otherwise a placeholder.
const Eqn = ({ label = "equation", tex, h = 110 }) => {
  if (!tex)
    return (
      <div
        style={{
          ...boxBase,
          height: h,
          fontSize: 22,
          fontStyle: "italic",
          borderStyle: "solid",
          borderColor: ACCENT,
          color: ACCENT,
          background: "rgba(200,98,45,0.05)",
        }}
      >
        [ {label} ]
      </div>
    );
  return (
    <div
      style={{
        minHeight: h,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14px 20px",
        borderRadius: 10,
        border: `2px solid ${ACCENT}`,
        background: "rgba(200,98,45,0.05)",
        color: INK,
        fontSize: 26,
        overflowX: "auto",
      }}
    >
      <BlockMath math={tex} />
    </div>
  );
};

// inline math helper
const M = ({ tex }) => <InlineMath math={tex} />;

const Txt = ({ label = "text", children, h = 160 }) => (
  <div
    style={{
      ...(children ? {} : boxBase),
      height: h,
      fontSize: 18,
      display: "flex",
      alignItems: "flex-start",
      padding: children ? 0 : 20,
      color: children ? INK : MUTED,
      lineHeight: 1.4,
      textTransform: children ? "none" : "uppercase",
      letterSpacing: children ? "normal" : "0.12em",
      fontWeight: children ? 400 : 600,
      textAlign: "left",
    }}
  >
    {children ? <div>{children}</div> : <span style={{ marginTop: 4 }}>[ {label} ]</span>}
  </div>
);

const Eyebrow = ({ children }) => (
  <div
    style={{
      color: ACCENT,
      fontWeight: 700,
      fontSize: 22,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      marginBottom: 14,
    }}
  >
    {children}
  </div>
);

const Title = ({ children }) => (
  <h1 style={{ fontSize: 64, lineHeight: 1.02, margin: "0 0 28px", fontWeight: 800, color: INK }}>
    {children}
  </h1>
);

const H2 = ({ children }) => (
  <h2 style={{ fontSize: 30, margin: "0 0 12px", fontWeight: 700, color: INK }}>{children}</h2>
);

// orange "big idea" callout band
const Callout = ({ children }) => (
  <div
    style={{
      border: `2px solid ${ACCENT}`,
      background: "rgba(200,98,45,0.08)",
      borderRadius: 12,
      padding: "18px 24px",
      color: INK,
      fontSize: 22,
      fontWeight: 600,
      lineHeight: 1.35,
    }}
  >
    {children}
  </div>
);

// ---- reusable slide frame ---------------------------------------------
const Slide = ({ children }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      padding: "56px 72px 84px",
      display: "flex",
      flexDirection: "column",
    }}
  >
    {children}
  </div>
);

const Cols = ({ children, gap = 40 }) => (
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap, flex: 1, minHeight: 0 }}>
    {children}
  </div>
);

// generic two-slide component pattern (unfilled components) --------------
const PhysicalSlide = ({ eyebrow, title }) => (
  <Slide>
    <Eyebrow>{eyebrow} · what & why</Eyebrow>
    <Title>{title}</Title>
    <Cols>
      <div>
        <Img label="real component photo / cutaway" h={340} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        <div>
          <H2>Purpose & source of power</H2>
          <Txt label="what it does · where its work comes from" h={130} />
        </div>
        <div>
          <H2>Physical loss mechanisms</H2>
          <Txt label="friction · shocks · mixing · heat · incomplete combustion…" h={130} />
        </div>
      </div>
    </Cols>
  </Slide>
);

const DefinitionSlide = ({ eyebrow, title }) => (
  <Slide>
    <Eyebrow>{eyebrow} · definitions</Eyebrow>
    <Title>{title}</Title>
    <div style={{ marginBottom: 24 }}>
      <H2>Efficiency / loss definition</H2>
      <Eqn label="η and/or π defining relation" h={100} />
    </div>
    <div style={{ marginBottom: 24 }}>
      <H2>Governing stagnation relations</H2>
      <Eqn label="Tt / Pt mapping — inlet state → outlet state" h={100} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 24 }}>
      <div>
        <div style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>DEPENDS ON</div>
        <Txt label="input properties" h={90} />
      </div>
      <div style={{ fontSize: 44, color: ACCENT, fontWeight: 800 }}>→</div>
      <div>
        <div style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>SETS UP</div>
        <Txt label="output properties" h={90} />
      </div>
    </div>
  </Slide>
);

// ---- slides -----------------------------------------------------------
const slides = [
  // 0 — Title
  () => (
    <Slide>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Eyebrow>Propulsion · Farokhi Ch. 4</Eyebrow>
        <h1 style={{ fontSize: 84, lineHeight: 1.0, margin: "0 0 20px", fontWeight: 800, color: INK }}>
          Real Cycle
          <br />
          &amp; Component Efficiencies
        </h1>
        <div style={{ fontSize: 28, color: MUTED }}>[ subtitle / date / course ]</div>
      </div>
    </Slide>
  ),

  // 1 — Framing / language
  () => (
    <Slide>
      <Eyebrow>Before we start · shared language</Eyebrow>
      <Title>Stagnation states, stations &amp; notation</Title>
      <Cols>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <H2>Stagnation vs. static</H2>
            <Eqn label="Tt, Pt definitions" h={110} />
          </div>
          <div>
            <H2>τ and π notation</H2>
            <Txt label="τ_r π_r · τ_c π_c · τ_b π_b · τ_t π_t · π_n" h={110} />
          </div>
        </div>
        <div>
          <H2>Station numbering map</H2>
          <Img label="labeled flow diagram · stations 0→9" h={300} />
        </div>
      </Cols>
    </Slide>
  ),

  // 2/3 — Diffuser / Inlet
  () => <PhysicalSlide eyebrow="Inlet / Diffuser" title="Inlet & Diffuser" />,
  () => <DefinitionSlide eyebrow="Inlet / Diffuser" title="Diffuser efficiency (π_d)" />,

  // 4 — NEW: Spool architecture (context, before compressors)
  () => (
    <Slide>
      <Eyebrow>Compressor · context first</Eyebrow>
      <Title>How many spools?</Title>
      <Cols gap={44}>
        <div>
          <Img
            src={IMG_TWO_SPOOL}
            alt="Two-spool compressor: LP (N1) and HP (N2) on concentric drive shafts"
            caption="FAA, Pilot's Handbook of Aeronautical Knowledge (public domain)"
            h={430}
            fit="contain"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, justifyContent: "center" }}>
          <div>
            <H2>Real engines split the compression</H2>
            <Txt h="auto">
              Large engines use two (or three) <strong>spools</strong>: a low-pressure compressor
              (<M tex="N_1" />) and a high-pressure compressor (<M tex="N_2" />) on{" "}
              <strong>concentric shafts</strong>. Each spool is driven by — and speed-matched to —
              its own turbine, so each can run near its best efficiency.
            </Txt>
          </div>
          <Callout>
            Today’s example is a <span style={{ color: ACCENT }}>single-spool turbojet</span>: one
            compressor ↔ one turbine, one shaft, <em>one</em> power balance. Everything that follows
            assumes this.
          </Callout>
        </div>
      </Cols>
    </Slide>
  ),

  // 5 — Compressor physical (filled)
  () => (
    <Slide>
      <Eyebrow>Compressor · what & why</Eyebrow>
      <Title>Compressor</Title>
      <Cols>
        <div>
          <Img
            src={IMG_SINGLE_SPOOL}
            alt="Single-spool axial compressor cutaway showing intake casing, stator vanes, rotor blades, and main shaft"
            caption="Single-spool axial compressor cutaway. [confirm source before publishing]"
            h={360}
            fit="contain"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <H2>Purpose & source of power</H2>
            <Txt h="auto">
              Raises the <strong>total (stagnation) pressure</strong> of the incoming air before
              combustion. Rotor rows add energy; stator rows diffuse it to pressure. The work is{" "}
              <strong>not free</strong> — it is supplied by the turbine through the shaft (closed by
              the power balance).
            </Txt>
          </div>
          <div>
            <H2>Physical loss mechanisms</H2>
            <Txt h="auto">
              Blade-profile &amp; endwall friction, boundary-layer growth in the adverse pressure
              gradient, tip-clearance leakage, wake mixing between rows, and shock losses in
              transonic stages. Together these make the real compression non-isentropic →{" "}
              <M tex="\eta_c < 1" />.
            </Txt>
          </div>
        </div>
      </Cols>
    </Slide>
  ),

  // 6 — NEW: Why multi-stage?
  () => (
    <Slide>
      <Eyebrow>Compressor · the key aerodynamic constraint</Eyebrow>
      <Title>Why so many stages?</Title>
      <Cols gap={44}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <H2>Compression runs “uphill”</H2>
            <Txt h="auto">
              A compressor <em>raises</em> pressure, so the flow moves against an{" "}
              <strong>adverse pressure gradient</strong>. Diffusing (decelerating) flow makes the
              blade boundary layer thicken and, if pushed too hard,{" "}
              <strong>separate → stall / surge</strong>. So each blade row can only diffuse the flow
              a limited amount.
            </Txt>
          </div>
          <div>
            <H2>The diffusion limit (de Haller)</H2>
            <Eqn tex={"\\frac{W_2}{W_1} \\;\\gtrsim\\; 0.72"} h={90} />
            <Txt h="auto">
              This caps the pressure rise per stage at only{" "}
              <M tex="\pi_{\text{stage}} \approx 1.15\text{–}1.4" />. Efficiency falling with stage
              loading is the <em>consequence</em> of this limit, not the root cause.
            </Txt>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <H2>Small rises multiply</H2>
            <Eqn tex={"\\pi_c \\;=\\; \\prod_{i=1}^{N}\\pi_{s,i} \\;=\\; \\pi_s^{\\,N}"} h={90} />
            <Eqn tex={"N \\;=\\; \\frac{\\ln \\pi_c}{\\ln \\pi_s}\\;\\Rightarrow\\; \\frac{\\ln 20}{\\ln 1.2}\\approx 16"} h={90} />
            <Txt h="auto">
              To reach a useful <M tex="\pi_c \approx 6\text{–}20" />, you stack many small stages —
              which is exactly why jet-engine axial compressors run{" "}
              <strong>~14–16 stages</strong>.
            </Txt>
          </div>
          <Callout>
            Turbine = opposite gradient. Flow <strong>accelerates</strong> (favorable{" "}
            <M tex="dp/dx<0" />), the boundary layer stays attached, so one turbine stage does the
            work of many compressor stages → a <strong>1–3-stage turbine drives a 14–16-stage
            compressor</strong>.
          </Callout>
        </div>
      </Cols>
    </Slide>
  ),

  // 7 — Compressor definition (filled η_c)
  () => (
    <Slide>
      <Eyebrow>Compressor · definitions</Eyebrow>
      <Title>Compressor isentropic efficiency (η_c)</Title>
      <div style={{ marginBottom: 18 }}>
        <H2>Definition — ideal over actual work</H2>
        <Eqn
          tex={"\\eta_c=\\frac{h_{t3s}-h_{t2}}{h_{t3}-h_{t2}}=\\frac{T_{t3s}-T_{t2}}{T_{t3}-T_{t2}}=\\frac{\\pi_c^{(\\gamma-1)/\\gamma}-1}{\\tau_c-1}"}
          h={90}
        />
      </div>
      <div style={{ marginBottom: 18 }}>
        <H2>Governing stagnation relations</H2>
        <Eqn
          tex={"\\tau_c = 1+\\frac{\\pi_c^{(\\gamma-1)/\\gamma}-1}{\\eta_c},\\qquad T_{t3}=\\tau_c\\,T_{t2},\\qquad P_{t3}=\\pi_c\\,P_{t2}"}
          h={90}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 24 }}>
        <div>
          <div style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>DEPENDS ON</div>
          <Txt h="auto">
            <M tex="T_{t2},\,P_{t2}" /> (inlet exit), design <M tex="\pi_c" />, measured{" "}
            <M tex="\eta_c" />, and <M tex="\gamma" />.
          </Txt>
        </div>
        <div style={{ fontSize: 44, color: ACCENT, fontWeight: 800 }}>→</div>
        <div>
          <div style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>SETS UP</div>
          <Txt h="auto">
            Compressor-exit state <M tex="T_{t3},\,P_{t3}" /> — the burner inlet condition.
          </Txt>
        </div>
      </div>
    </Slide>
  ),

  // 8/9 — Burner
  () => <PhysicalSlide eyebrow="Burner" title="Burner / Combustor" />,
  () => (
    <Slide>
      <Eyebrow>Burner · definitions</Eyebrow>
      <Title>Combustion efficiency, pressure loss &amp; f</Title>
      <Cols gap={40}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <H2>Combustion efficiency η_b</H2>
            <Eqn label="fuel energy released / available" h={90} />
          </div>
          <div>
            <H2>Pressure loss π_b</H2>
            <Eqn label="Pt4 / Pt3  (keep separate from η_b!)" h={90} />
          </div>
        </div>
        <div>
          <H2>Fuel–air ratio f</H2>
          <Eqn label="energy balance → f is born here" h={90} />
          <div style={{ marginTop: 20 }}>
            <H2>Convention flag</H2>
            <Txt label="does turbine mass flow include f? fix it now" h={110} />
          </div>
        </div>
      </Cols>
    </Slide>
  ),

  // 10/11 — Turbine
  () => <PhysicalSlide eyebrow="Turbine" title="Turbine" />,
  () => <DefinitionSlide eyebrow="Turbine" title="Turbine isentropic efficiency (η_t)" />,

  // 12 — Power balance
  () => (
    <Slide>
      <Eyebrow>The linkage that closes the cycle</Eyebrow>
      <Title>Turbine–Compressor Power Balance</Title>
      <div style={{ marginBottom: 22 }}>
        <H2>Work matching (with mechanical efficiency η_m)</H2>
        <Eqn label="η_m · ẇ_turbine = ẇ_compressor   →   solves τ_t" h={120} />
      </div>
      <Cols>
        <div>
          <H2>Why τ_t is determined, not chosen</H2>
          <Txt label="shaft constraint fixes turbine work; τ_t falls out" h={150} />
        </div>
        <div>
          <H2>Spool diagram</H2>
          <Img label="compressor ↔ shaft ↔ turbine, η_m on shaft" h={150} />
        </div>
      </Cols>
    </Slide>
  ),

  // 13/14 — Nozzle
  () => <PhysicalSlide eyebrow="Nozzle" title="Nozzle" />,
  () => <DefinitionSlide eyebrow="Nozzle" title="Nozzle efficiency / π_n" />,

  // 15 — Assembly
  () => (
    <Slide>
      <Eyebrow>Putting it together</Eyebrow>
      <Title>Real Turbojet Cycle Analysis</Title>
      <div style={{ marginBottom: 20 }}>
        <H2>Chain the τ's and π's, station by station</H2>
        <Eqn label="τ_r π_r → τ_c π_c → τ_b π_b → τ_t π_t → π_n" h={100} />
      </div>
      <Cols>
        <div>
          <H2>Thrust</H2>
          <Eqn label="specific thrust equation" h={110} />
        </div>
        <div>
          <H2>TSFC</H2>
          <Eqn label="TSFC = f / (F/ṁ)" h={110} />
        </div>
      </Cols>
      <div style={{ marginTop: 18, fontSize: 22, color: MUTED }}>
        [ callback: same chain as the ideal cycle, each stage swapped for its efficiency-corrected version ]
      </div>
    </Slide>
  ),
];

// ---- deck shell -------------------------------------------------------
export default function Deck() {
  const [i, setI] = useState(0);
  const n = slides.length;
  const go = useCallback((d) => setI((p) => Math.max(0, Math.min(n - 1, p + d))), [n]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [go]);

  const Current = slides[i];

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: MUTED + "22",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        boxSizing: "border-box",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, system-ui, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 1200 }}>
        {/* 16:9 stage */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            background: PAPER,
            borderRadius: 14,
            boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: ACCENT }} />
          <Current />

          <div
            style={{
              position: "absolute",
              bottom: 22,
              left: 72,
              right: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ color: MUTED, fontSize: 18, fontWeight: 600, letterSpacing: "0.08em" }}>
              {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
            <div style={{ display: "flex", gap: 12 }}>
              <NavBtn onClick={() => go(-1)} disabled={i === 0}>
                ← Prev
              </NavBtn>
              <NavBtn onClick={() => go(1)} disabled={i === n - 1}>
                Next →
              </NavBtn>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 12, color: PAPER, fontSize: 14, opacity: 0.8 }}>
          Arrow keys / space to navigate
        </div>
      </div>
    </div>
  );
}

const NavBtn = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      border: `2px solid ${INK}`,
      background: disabled ? "transparent" : INK,
      color: disabled ? MUTED : PAPER,
      opacity: disabled ? 0.4 : 1,
      borderRadius: 8,
      padding: "10px 18px",
      fontSize: 18,
      fontWeight: 700,
      cursor: disabled ? "default" : "pointer",
    }}
  >
    {children}
  </button>
);
