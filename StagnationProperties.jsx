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

const ACCENT = "#06b6d4";

const slides = [
  // SLIDE 1 — Title
  {
    type: "title",
    title: "Stagnation\nProperties",
    subtitle: "AE 3310 · Section 6a",
    tag: "Isentropic Relations · Total Conditions · Mach Number",
  },

  // SLIDE 2 — What is Stagnation?
  {
    title: "Stagnation Properties",
    subtitle: "Section 6a — Defining Total Conditions",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card accent="#f43f5e">
          <Label color="#f43f5e">Definition</Label>
          <p style={{ color: "#8b949e", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
            The <span style={{ color: "#f43f5e" }}>stagnation value</span> of a property is the hypothetical value
            it would take if the flow were slowed down <span style={{ color: "#f43f5e" }}>adiabatically and isentropically</span> to{" "}
            <K color="#f43f5e">{String.raw`V \to 0`}</K>.
          </p>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Card accent={ACCENT}>
            <Label color={ACCENT}>State 1 — Freestream</Label>
            <EqBox color={ACCENT}><K display color={ACCENT}>{String.raw`V = V_\infty,\quad T_1,\quad P_1`}</K></EqBox>
          </Card>
          <Card accent="#a78bfa">
            <Label color="#a78bfa">State 2 — Stagnation</Label>
            <EqBox color="#a78bfa"><K display color="#a78bfa">{String.raw`V = 0,\quad T_0,\quad P_0`}</K></EqBox>
          </Card>
        </div>
        <Card accent="#f59e0b">
          <Label color="#f59e0b">Physical Intuition</Label>
          <p style={{ color: "#8b949e", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
            Imagine a high-KE gas flow slowed carefully with <span style={{ color: "#f59e0b" }}>no heat transfer</span>.
            The KE has nowhere to go but into heating the gas —
            the temperature rises to <K color="#f59e0b">{String.raw`T_0 > T_1`}</K>.
          </p>
        </Card>
      </div>
    ),
  },

  // SLIDE 3 — Isentropic Stagnation Relations
  {
    title: "Isentropic Stagnation Relations",
    subtitle: "Applying Isentropic Conditions Between States",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card accent="#f43f5e">
          <Label color="#f43f5e">Master Isentropic Relation</Label>
          <EqBox color="#f43f5e">
            <K display color="#f43f5e">{String.raw`\frac{T_0}{T_1} = \left(\frac{P_0}{P_1}\right)^{\!\frac{\gamma-1}{\gamma}} = \left(\frac{\rho_0}{\rho_1}\right)^{\gamma-1}`}</K>
          </EqBox>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            ["Temperature", String.raw`T_0,\ T_1`, ACCENT],
            ["Pressure", String.raw`P_0,\ P_1`, "#a78bfa"],
            ["Density", String.raw`\rho_0,\ \rho_1`, "#10b981"],
          ].map(([label, tex, color]) => (
            <div key={label} style={{ background: "#0d1117", borderRadius: 10, padding: "14px 12px", textAlign: "center", border: `1px solid ${color}33` }}>
              <div style={{ color: "#8b949e", fontSize: 11, fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
              <K display color={color}>{tex}</K>
            </div>
          ))}
        </div>
        <Card accent="#f59e0b">
          <Label color="#f59e0b">Note on Notation</Label>
          <p style={{ color: "#8b949e", fontSize: 13, margin: 0 }}>
            Subscript <K color="#f59e0b">{String.raw`_0`}</K> or <K color="#f59e0b">{String.raw`_t`}</K> (Fanno notation) both denote total / stagnation conditions.
          </p>
        </Card>
      </div>
    ),
  },

  // SLIDE 4 — Energy Equation Derivation
  {
    title: "Energy Equation Derivation",
    subtitle: "Relating Static and Stagnation Temperature",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Card accent={ACCENT}>
          <Label color={ACCENT}>Start: Conservation of Energy</Label>
          <EqBox color={ACCENT}>
            <K display color={ACCENT}>{String.raw`\dot{m}c_p T_1 + \tfrac{1}{2}\dot{m}V_1^2 = \dot{m}c_p T_a + \tfrac{1}{2}\dot{m}V_a^2`}</K>
          </EqBox>
          <p style={{ color: "#8b949e", fontSize: 12, margin: "4px 0 0", textAlign: "center" }}>
            internal energy + kinetic energy = constant
          </p>
        </Card>
        <Card accent="#a78bfa">
          <Label color="#a78bfa">Divide by ṁ and cₚ</Label>
          <EqBox color="#a78bfa">
            <K display color="#a78bfa">{String.raw`T_1 + \frac{V_1^2}{2c_p} = T_a + \frac{V_a^2}{2c_p}`}</K>
          </EqBox>
        </Card>
        <Card accent="#10b981">
          <Label color="#10b981">At Stagnation: V = 0</Label>
          <EqBox color="#10b981">
            <K display color="#10b981">{String.raw`\frac{T_0}{T_1} = 1 + \frac{V_1^2}{2\,c_p\,T_1}`}</K>
          </EqBox>
        </Card>
      </div>
    ),
  },

  // SLIDE 5 — Mach Number Form
  {
    title: "Temperature Ratio in Terms of Mach Number",
    subtitle: "Substituting Gas Relations",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Card accent={ACCENT}>
            <Label color={ACCENT}>Gas Relations</Label>
            <EqBox color={ACCENT}><K display color={ACCENT}>{String.raw`c_p = \frac{\gamma R}{\gamma-1}`}</K></EqBox>
            <EqBox color={ACCENT}><K display color={ACCENT}>{String.raw`a^2 = \gamma R T`}</K></EqBox>
          </Card>
          <Card accent="#f59e0b">
            <Label color="#f59e0b">Mach Number</Label>
            <EqBox color="#f59e0b"><K display color="#f59e0b">{String.raw`M = \frac{u}{a}`}</K></EqBox>
            <EqBox color="#f59e0b"><K display color="#f59e0b">{String.raw`u^2 = M^2 \gamma R T`}</K></EqBox>
          </Card>
        </div>
        <Card accent="#a78bfa">
          <Label color="#a78bfa">Substituting into T₀/T</Label>
          <EqBox color="#a78bfa">
            <K display color="#a78bfa">{String.raw`\frac{T_0}{T} = 1 + \frac{(\gamma-1)\,M^2\,\gamma R T}{2\,\gamma R T} = 1 + \frac{\gamma-1}{2}M^2`}</K>
          </EqBox>
        </Card>
        <Card accent="#a8ff3e">
          <Label color="#a8ff3e">Result (Fanno Notation)</Label>
          <EqBox color="#a8ff3e">
            <K display color="#a8ff3e">{String.raw`\frac{T_t}{T} = 1 + \frac{\gamma-1}{2}M^2 \qquad a_t = \sqrt{\gamma R T_t}`}</K>
          </EqBox>
        </Card>
      </div>
    ),
  },

  // SLIDE 6 — Pressure and Density
  {
    title: "Isentropic Pressure & Density Relations",
    subtitle: "Full Stagnation Property Set",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Card accent="#fb923c">
          <Label color="#fb923c">Total Pressure (Isentropic)</Label>
          <EqBox color="#fb923c">
            <K display color="#fb923c">{String.raw`\frac{P_t}{P} = \left(1 + \frac{\gamma-1}{2}M^2\right)^{\!\frac{\gamma}{\gamma-1}}`}</K>
          </EqBox>
        </Card>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Card accent={ACCENT}>
            <Label color={ACCENT}>Total Density (Isentropic)</Label>
            <EqBox color={ACCENT}>
              <K display color={ACCENT}>{String.raw`\frac{\rho_t}{\rho} = \left(1 + \frac{\gamma-1}{2}M^2\right)^{\!\frac{1}{\gamma-1}}`}</K>
            </EqBox>
          </Card>
          <Card accent="#f43f5e">
            <Label color="#f43f5e">Restriction</Label>
            <p style={{ color: "#8b949e", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
              <K color="#f43f5e">{String.raw`P_t`}</K> and <K color="#f43f5e">{String.raw`\rho_t`}</K> require <span style={{ color: "#f43f5e" }}>isentropic</span> (adiabatic + reversible).{" "}
              <K color="#a8ff3e">{String.raw`T_t`}</K> only requires <span style={{ color: "#a8ff3e" }}>adiabatic</span> — less restrictive.
            </p>
          </Card>
        </div>
      </div>
    ),
  },

  // SLIDE 7 — Examples
  {
    title: "When Can We Use Tₜ, Pₜ, ρₜ?",
    subtitle: "Examples",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[
          {
            color: ACCENT,
            label: "Duct with Resistance Heater",
            q: String.raw`\text{Can I use }T_t\text{? Can I define }T_t\text{?}`,
            lines: [
              { tex: String.raw`\text{Define }T_t\text{? }\textbf{Yes.}\text{ Use }T_t\text{? }\textbf{Yes.}`, color: ACCENT },
              { tex: String.raw`T_{t2} = T_{t1}\text{? }\textbf{No}\text{ — heat added}`, color: "#f43f5e" },
              { tex: String.raw`c_p T_{t1} + q_{\text{in}} = c_p T_{t2}`, color: "#f59e0b" },
            ],
          },
          {
            color: "#10b981",
            label: "Insulated Subsonic Nozzle",
            q: String.raw`P_t = \text{const?}`,
            lines: [
              { tex: String.raw`\textbf{Yes.}\text{ Adiabatic + no shocks} \Rightarrow \text{isentropic} \Rightarrow P_t \text{ conserved}`, color: "#10b981" },
            ],
          },
          {
            color: "#f43f5e",
            label: "Nozzle Goes Supersonic — Shock Present",
            q: String.raw`P_t = \text{const?}`,
            lines: [
              { tex: String.raw`\textbf{No.}\text{ Shock is irreversible} \Rightarrow \Delta s > 0 \Rightarrow P_t \text{ drops}`, color: "#f43f5e" },
              { tex: String.raw`T_t\text{ still conserved (adiabatic across shock)}`, color: "#a8ff3e" },
            ],
          },
        ].map(({ color, label, q, lines }) => (
          <Card key={label} accent={color}>
            <Label color={color}>{label}</Label>
            <div style={{ background: "#161b22", borderRadius: 6, padding: "6px 12px", marginBottom: 8 }}>
              <K color="#8b949e">{q}</K>
            </div>
            {lines.map(({ tex, color: c }, i) => (
              <div key={i} style={{ background: "#161b22", borderRadius: 6, padding: "6px 12px", marginTop: 4 }}>
                <K color={c}>{tex}</K>
              </div>
            ))}
          </Card>
        ))}
      </div>
    ),
  },
];

function renderSlide(slide) {
  if (slide.type === "title") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontFamily: "monospace", fontSize: 10, color: ACCENT, letterSpacing: 3, textTransform: "uppercase", marginBottom: 24 }}>AE 3310 · Aeronautical Propulsion · Section 6a</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 52, color: "#f0f6fc", margin: "0 0 16px", lineHeight: 1.15, whiteSpace: "pre-line" }}>{slide.title}</h1>
        <div style={{ width: 60, height: 3, background: `linear-gradient(90deg, ${ACCENT}, #a78bfa)`, borderRadius: 2, margin: "0 auto 20px" }} />
        <p style={{ fontFamily: "monospace", fontSize: 12, color: "#8b949e", letterSpacing: 2, margin: "0 0 8px" }}>{slide.subtitle}</p>
        <p style={{ fontFamily: "monospace", fontSize: 11, color: "#30363d", letterSpacing: 1 }}>{slide.tag}</p>
      </div>
    );
  }
  return slide.content;
}

export default function StagnationProperties() {
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
        {slides[current].type !== "title" && (
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#f0f6fc", margin: "0 0 4px" }}>{slides[current].title}</h2>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: ACCENT, letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>{slides[current].subtitle}</p>
          </div>
        )}
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
