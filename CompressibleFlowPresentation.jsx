import { useState, useEffect } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

function K({ children, display = false, color }) {
  const html = katex.renderToString(children, {
    displayMode: display, throwOnError: false, trust: true,
    macros: { "\\d": "\\mathrm{d}" },
  });
  return <span style={{ color: color || "inherit" }} dangerouslySetInnerHTML={{ __html: html }} />;
}

const Card = ({ children, accent = "#06b6d4", style = {} }) => (
  <div style={{ background: "#0d1117", borderRadius: 10, padding: "16px 18px", border: `1px solid ${accent}22`, ...style }}>{children}</div>
);
const Label = ({ children, color = "#06b6d4" }) => (
  <div style={{ color, fontFamily: "monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{children}</div>
);
const EqBox = ({ children, color = "#06b6d4" }) => (
  <div style={{ background: "#161b22", borderRadius: 8, padding: "12px 16px", border: `1px solid ${color}33`, textAlign: "center", margin: "8px 0" }}>{children}</div>
);

const ACCENT = "#06b6d4"; // cyan

const slides = [
  {
    type: "title",
    title: "Compressible\nFlow",
    subtitle: "ME 3470 · Lecture 2.2",
    tag: "Speed of Sound · Mach Number · Stagnation",
  },
  {
    title: "Speed of Sound & Mach Number",
    subtitle: "Example 2.5: Good Problem",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card accent={ACCENT}>
          <Label color={ACCENT}>Fundamental Concepts</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <EqBox color={ACCENT}><K display color={ACCENT}>{String.raw`a = \sqrt{\gamma R T}`}</K></EqBox>
              <p style={{ color: "#8b949e", fontSize: 11, textAlign: "center", margin: 0 }}>Speed of Sound</p>
            </div>
            <div>
              <EqBox color="#a78bfa"><K display color="#a78bfa">{String.raw`M = \frac{V}{a}`}</K></EqBox>
              <p style={{ color: "#8b949e", fontSize: 11, textAlign: "center", margin: 0 }}>Mach Number</p>
            </div>
          </div>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Card accent="#f59e0b">
            <Label color="#f59e0b">Key Parameters</Label>
            {[
              [String.raw`\gamma`, "Specific heat ratio"],
              ["R", "Gas constant"],
              ["T", "Temperature (K)"],
            ].map(([s, d]) => (
              <div key={s} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 6 }}>
                <span style={{ color: "#f59e0b", minWidth: 28 }}><K color="#f59e0b">{s}</K></span>
                <span style={{ color: "#8b949e", fontSize: 12 }}>{d}</span>
              </div>
            ))}
          </Card>
          <Card accent="#a78bfa">
            <Label color="#a78bfa">Mach Regimes</Label>
            {[["M < 1", "Subsonic"], ["M = 1", "Sonic"], ["M > 1", "Supersonic"]].map(([m, r]) => (
              <div key={m} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#a78bfa", fontFamily: "monospace", fontSize: 12 }}>{m}</span>
                <span style={{ color: "#8b949e", fontSize: 12 }}>{r}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    ),
  },
  {
    title: "Stagnation Properties",
    subtitle: "Key Thermodynamic Relations",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card accent="#f43f5e">
          <Label color="#f43f5e">Isentropic Stagnation State</Label>
          {[
            { label: "Total Enthalpy", tex: String.raw`h_t = h + \frac{V^2}{2}`, color: "#f43f5e" },
            { label: "Static Temperature Relation", tex: String.raw`T_t = T + \frac{V^2}{2c_p}`, color: "#fb923c" },
            { label: "In Terms of Mach Number", tex: String.raw`\frac{T_t}{T} = 1 + \frac{\gamma-1}{2}M^2`, color: "#fbbf24" },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: 10 }}>
              <div style={{ color: "#8b949e", fontSize: 10, fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
              <EqBox color={item.color}><K display color={item.color}>{item.tex}</K></EqBox>
            </div>
          ))}
        </Card>
      </div>
    ),
  },
  {
    title: "Isentropic Relations for CPG",
    subtitle: "Calorically Perfect Gas",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card accent="#fb923c">
          <Label color="#fb923c">Pressure–Mach Relation</Label>
          <EqBox color="#fb923c">
            <K display color="#fb923c">{String.raw`\frac{p_t}{p} = \left[1 + \frac{\gamma-1}{2}M^2\right]^{\!\gamma/(\gamma-1)}`}</K>
          </EqBox>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Card accent={ACCENT}>
            <Label color={ACCENT}>Density Ratio</Label>
            <EqBox color={ACCENT}>
              <K display color={ACCENT}>{String.raw`\frac{\rho_t}{\rho} = \left(\frac{T_t}{T}\right)^{1/(\gamma-1)}`}</K>
            </EqBox>
          </Card>
          <Card accent="#10b981">
            <Label color="#10b981">Entropy Change</Label>
            <EqBox color="#10b981">
              <K display color="#10b981">{String.raw`\Delta s = c_p \ln\!\frac{T_t}{T} - R\ln\!\frac{p_t}{p}`}</K>
            </EqBox>
          </Card>
        </div>
      </div>
    ),
  },
  {
    title: "Mollier Diagram & Entropy",
    subtitle: "h-s Relations",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card accent="#a78bfa">
          <Label color="#a78bfa">h–s Diagram</Label>
          <svg viewBox="0 0 320 190" style={{ width: "100%", maxWidth: 380, display: "block", margin: "0 auto" }}>
            <line x1="40" y1="160" x2="290" y2="160" stroke="#30363d" strokeWidth="1.5" />
            <line x1="40" y1="10" x2="40" y2="160" stroke="#30363d" strokeWidth="1.5" />
            <text x="292" y="164" fontSize="11" fill="#8b949e" fontFamily="monospace">s</text>
            <text x="28" y="18" fontSize="11" fill="#8b949e" fontFamily="monospace">h</text>
            <line x1="120" y1="160" x2="120" y2="30" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="5,4" />
            <text x="124" y="175" fontSize="10" fill="#6366f1" fontFamily="monospace">isentropic</text>
            <path d="M 120 155 Q 155 120 168 55" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
            <text x="172" y="100" fontSize="10" fill="#f43f5e" fontFamily="monospace">real process</text>
            <circle cx="120" cy="155" r="5" fill="#10b981" />
            <text x="90" y="175" fontSize="10" fill="#10b981" fontFamily="monospace">State 1</text>
            <circle cx="168" cy="55" r="5" fill="#f59e0b" />
            <text x="172" y="50" fontSize="10" fill="#f59e0b" fontFamily="monospace">State 2</text>
            <path d="M 120 155 L 168 155" stroke="#30363d" strokeWidth="1" strokeDasharray="3,3" />
            <path d="M 168 155 L 168 55" stroke="#30363d" strokeWidth="1" strokeDasharray="3,3" />
            <text x="135" y="170" fontSize="9" fill="#f43f5e" fontFamily="monospace">Δs</text>
          </svg>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Card accent="#6366f1" style={{ borderLeft: "3px solid #6366f1" }}>
            <Label color="#6366f1">Isentropic Process</Label>
            <p style={{ color: "#8b949e", fontSize: 13, margin: 0 }}>
              <K color="#6366f1">{String.raw`\mathrm{d}s = 0`}</K> — vertical line on diagram
            </p>
          </Card>
          <Card accent="#f43f5e" style={{ borderLeft: "3px solid #f43f5e" }}>
            <Label color="#f43f5e">Entropy Increase</Label>
            <p style={{ color: "#8b949e", fontSize: 13, margin: 0 }}>
              <K color="#f43f5e">{String.raw`\Delta s \geq 0`}</K> — moves rightward
            </p>
          </Card>
        </div>
      </div>
    ),
  },
  {
    title: "Worked Example Setup",
    subtitle: "HW Problem 2.1 — Given Data",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card accent="#10b981">
          <Label color="#10b981">Problem Statement</Label>
          <p style={{ color: "#8b949e", fontSize: 13, marginBottom: 12 }}>
            Sonic exit gas — <K color="#10b981">{String.raw`V=0`}</K> isentropic assumption, <K color="#10b981">{String.raw`\Delta S = 0`}</K>
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[["a_t", "400 m/s"], ["a_0", "300 m/s"], ["\\gamma", "1.4"]].map(([s, v]) => (
              <div key={s} style={{ background: "#161b22", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                <div style={{ color: "#8b949e", fontSize: 11, marginBottom: 4 }}><K color="#8b949e">{s}</K></div>
                <div style={{ color: "#10b981", fontFamily: "monospace", fontSize: 16, fontWeight: 700 }}>{v}</div>
              </div>
            ))}
          </div>
          <p style={{ color: "#f0f6fc", fontSize: 13, textAlign: "center", margin: 0 }}>
            Find: Mach number at state <K color={ACCENT}>0</K>, velocity <K color={ACCENT}>V_0</K>, and temperature <K color={ACCENT}>T_0</K>
          </p>
        </Card>
        <Card accent="#f59e0b" style={{ borderLeft: "3px solid #f59e0b" }}>
          <Label color="#f59e0b">Strategy</Label>
          <p style={{ color: "#8b949e", fontSize: 13, margin: 0 }}>
            Use stagnation relations. Solve for Mach at state <K color="#f59e0b">0</K>, then find velocity and temperature.
          </p>
        </Card>
      </div>
    ),
  },
  {
    title: "Solution: Finding Mach",
    subtitle: "Step-by-Step Calculation",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card accent={ACCENT}>
          <Label color={ACCENT}>Step 1 — Stagnation Speed of Sound Ratio</Label>
          <EqBox color={ACCENT}>
            <K display color={ACCENT}>{String.raw`\frac{a_t^2}{a_0^2} = \frac{T_t}{T_0} = \left(\frac{400}{300}\right)^{\!2} = 1.778`}</K>
          </EqBox>
        </Card>
        <Card accent="#a78bfa">
          <Label color="#a78bfa">Step 2 — Apply Mach–Temperature Relation</Label>
          <EqBox color="#a78bfa">
            <K display color="#a78bfa">{String.raw`\frac{T_t}{T_0} = 1 + \frac{\gamma-1}{2}M_0^2`}</K>
          </EqBox>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
            {[
              String.raw`1.778 = 1 + 0.2\,M_0^2`,
              String.raw`M_0^2 = \frac{0.778}{0.2} = 3.89`,
            ].map((tex, i) => (
              <div key={i} style={{ background: "#161b22", borderRadius: 8, padding: "8px 14px", textAlign: "center" }}>
                <K color={i === 1 ? "#a8ff3e" : "#a78bfa"}>{tex}</K>
              </div>
            ))}
          </div>
          <EqBox color="#a8ff3e">
            <K display color="#a8ff3e">{String.raw`M_0 \approx 1.97`}</K>
          </EqBox>
        </Card>
      </div>
    ),
  },
  {
    title: "Solution: V_i and T_i",
    subtitle: "Final Results",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card accent="#10b981">
          <Label color="#10b981">Step 3 — Calculate Velocity</Label>
          <EqBox color="#10b981">
            <K display color="#10b981">{String.raw`V_0 = M_0 \cdot a_0 = 1.97 \times 300 = 591\ \mathrm{m/s}`}</K>
          </EqBox>
        </Card>
        <Card accent="#fb923c">
          <Label color="#fb923c">Step 4 — Energy Equation for Temperature</Label>
          <EqBox color="#fb923c">
            <K display color="#fb923c">{String.raw`V = \sqrt{2c_p\!\left(a_t^2 - a_0^2\right)/\gamma R}`}</K>
          </EqBox>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[["M_0", "1.97", ACCENT], ["V_0", "591 m/s", "#10b981"], ["M", "2.33", "#fb923c"]].map(([s, v, c]) => (
            <div key={s} style={{ background: "#0d1117", borderRadius: 10, padding: "14px 12px", textAlign: "center", border: `1px solid ${c}33` }}>
              <div style={{ color: "#8b949e", fontSize: 11, marginBottom: 6 }}><K color="#8b949e">{s}</K></div>
              <div style={{ color: c, fontFamily: "monospace", fontSize: 18, fontWeight: 700 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function CompressibleFlowPresentation() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const total = slides.length;
  const goTo = (idx) => {
    if (idx < 0 || idx >= total) return;
    setVisible(false);
    setTimeout(() => { setCurrent(idx); setVisible(true); }, 140);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(current + 1);
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   goTo(current - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current]);

  return (
    <div style={{
      minHeight: "100vh", background: "#010409", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "20px 16px", color: "#f0f6fc",
      backgroundImage: "radial-gradient(ellipse at 15% 10%, #06b6d415 0%, transparent 55%)",
    }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&display=swap" />
      <div style={{
        width: "100%", maxWidth: 820,
        background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
        border: "1px solid #21262d", borderRadius: 16, padding: "32px 36px", minHeight: 520,
        display: "flex", flexDirection: "column", justifyContent: "flex-start",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.14s ease, transform 0.14s ease", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "linear-gradient(#f0f6fc 1px,transparent 1px),linear-gradient(90deg,#f0f6fc 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        {slides[current].type !== 'title' && <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#f0f6fc", margin: "0 0 4px" }}>{slides[current].title}</h2>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: ACCENT, letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>{slides[current].subtitle}</p>
        </div>}
        {renderSlide(slides[current])}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 20 }}>
        <button onClick={() => goTo(current - 1)} disabled={current === 0}
          style={{ background: "transparent", border: "1px solid #30363d", color: current === 0 ? "#30363d" : "#8b949e", width: 40, height: 40, borderRadius: "50%", cursor: current === 0 ? "default" : "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
        <div style={{ display: "flex", gap: 6 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{ width: i === current ? 20 : 8, height: 8, borderRadius: 4, border: "none", background: i === current ? ACCENT : "#30363d", cursor: "pointer", transition: "all 0.3s", padding: 0 }} />
          ))}
        </div>
        <button onClick={() => goTo(current + 1)} disabled={current === total - 1}
          style={{ background: "transparent", border: "1px solid #30363d", color: current === total - 1 ? "#30363d" : "#8b949e", width: 40, height: 40, borderRadius: "50%", cursor: current === total - 1 ? "default" : "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
      </div>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#30363d", marginTop: 10, letterSpacing: 1 }}>{current + 1} / {total} · arrow keys to navigate</p>
    </div>
  );
}
