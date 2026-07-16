import React, { useState, useEffect, useCallback } from "react";

/**
 * Real Turbojet Cycle — Lecture Deck TEMPLATE
 * Content-free scaffold. Fill the placeholder zones.
 * Type is intentionally large for projector legibility.
 *
 * Placeholder legend:
 *   <Img/>  image / component diagram
 *   <Eqn/>  equation block
 *   <Txt/>  prose / bullet zone
 */

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

const Img = ({ label = "image", h = 300 }) => (
  <div style={{ ...boxBase, height: h, fontSize: 20 }}>[ {label} ]</div>
);

const Eqn = ({ label = "equation", h = 110 }) => (
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

const Txt = ({ label = "text", h = 160 }) => (
  <div style={{ ...boxBase, height: h, fontSize: 18, alignItems: "flex-start", padding: 20 }}>
    <span style={{ marginTop: 4 }}>[ {label} ]</span>
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

// two-slide component pattern -------------------------------------------
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
    {/* inputs -> component -> outputs dependency map (consistent every slide) */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: 24,
      }}
    >
      <div>
        <div style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>
          DEPENDS ON
        </div>
        <Txt label="input properties" h={90} />
      </div>
      <div style={{ fontSize: 44, color: ACCENT, fontWeight: 800 }}>→</div>
      <div>
        <div style={{ color: MUTED, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 8 }}>
          SETS UP
        </div>
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

  // 4/5 — Compressor
  () => <PhysicalSlide eyebrow="Compressor" title="Compressor" />,
  () => <DefinitionSlide eyebrow="Compressor" title="Compressor isentropic efficiency (η_c)" />,

  // 6/7 — Burner
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

  // 8/9 — Turbine
  () => <PhysicalSlide eyebrow="Turbine" title="Turbine" />,
  () => <DefinitionSlide eyebrow="Turbine" title="Turbine isentropic efficiency (η_t)" />,

  // 10 — DEDICATED power balance slide
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

  // 11/12 — Nozzle
  () => <PhysicalSlide eyebrow="Nozzle" title="Nozzle" />,
  () => <DefinitionSlide eyebrow="Nozzle" title="Nozzle efficiency / π_n" />,

  // 13 — Assembly
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
        fontFamily:
          "'Inter', 'Helvetica Neue', Arial, system-ui, sans-serif",
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
          {/* accent edge */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 8, background: ACCENT }} />
          <Current />

          {/* footer: counter + nav */}
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
