import { useState, useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

// Render a KaTeX expression inline or as a block
function K({ children, display = false, color }) {
  const html = katex.renderToString(children, {
    displayMode: display,
    throwOnError: false,
    trust: true,
    macros: { "\\d": "\\mathrm{d}" },
  });
  return (
    <span
      style={{ color: color || "inherit" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const slides = [
  {
    id: 0,
    type: "title",
    title: "Newton's Laws &\nPropulsive Forces",
    subtitle: "ME 3470 · Lecture 1.1",
    tag: "Classical Mechanics → Modern Propulsion",
  },
  {
    id: 1,
    type: "laws-overview",
    title: "Three Laws. One Universe.",
    laws: [
      {
        num: "I",
        name: "Inertia",
        text: "An object at rest stays at rest; an object in motion stays in motion — unless acted upon by a net external force.",
        color: "#00d4ff",
      },
      {
        num: "II",
        name: "F = ma",
        katexName: true,
        text: "The net force on a body equals its mass times its acceleration. Force and acceleration share the same direction.",
        color: "#ff6b35",
      },
      {
        num: "III",
        name: "Action–Reaction",
        text: "For every action there is an equal and opposite reaction. Forces always come in pairs.",
        color: "#a8ff3e",
      },
    ],
  },
  {
    id: 2,
    type: "balloon",
    title: "The Balloon Experiment",
    subtitle: "Newton's 3rd Law in its purest form",
  },
  {
    id: 3,
    type: "pressure-diagram",
    title: "Why the Balloon Moves",
    subtitle: "Pressure imbalance → Net force",
  },
  {
    id: 4,
    type: "satellite",
    title: "Satellite Thrusters",
    subtitle: "Reaction control in the vacuum of space",
  },
  {
    id: 5,
    type: "cycling",
    title: "Bicycle Propulsion",
    subtitle: "Newton's 3rd Law on solid ground",
  },
  {
    id: 6,
    type: "swimming",
    title: "Swimming",
    subtitle: "Propulsion through a fluid medium",
  },
  {
    id: 7,
    type: "synthesis",
    title: "The Universal Pattern",
    subtitle: "Every propulsive system shares one truth",
  },
  {
    id: 8,
    type: "equations",
    title: "From Newton to the Rocket Equation",
    subtitle: "Tsiolkovsky's derivation from F = ma",
  },
];

// ── Balloon Animation ──────────────────────────────────────────────────────
function BalloonSlide() {
  const [released, setReleased] = useState(false);
  const [phase, setPhase] = useState(0); // 0=held, 1=releasing, 2=done

  const release = () => {
    if (phase !== 0) return;
    setPhase(1);
    setTimeout(() => { setReleased(true); setPhase(2); }, 100);
  };

  const reset = () => { setReleased(false); setPhase(0); };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%" }}>
      <p style={{ color: "#aaa", fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>
        Click the balloon to release it
      </p>

      {/* Arena */}
      <div style={{
        position: "relative", width: "100%", maxWidth: 680, height: 200,
        background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
        border: "1px solid #30363d", borderRadius: 12, overflow: "hidden",
      }}>
        {/* Center line */}
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "#30363d", transform: "translateX(-50%)" }} />
        <div style={{ position: "absolute", left: "50%", top: 8, transform: "translateX(-50%)", color: "#444", fontSize: 10, fontFamily: "monospace", whiteSpace: "nowrap" }}>release point</div>

        {/* Balloon */}
        <div
          onClick={release}
          style={{
            position: "absolute",
            top: "50%",
            left: released ? "8%" : "50%",
            transform: "translate(-50%, -50%)",
            transition: released ? "left 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none",
            cursor: phase === 0 ? "pointer" : "default",
            userSelect: "none",
          }}
        >
          <div style={{ fontSize: 56, filter: "drop-shadow(0 0 12px rgba(255,107,53,0.6))", transform: released ? "rotate(-15deg)" : "none", transition: "transform 0.3s" }}>🎈</div>
          {released && (
            <div style={{
              position: "absolute", right: -8, top: "50%", transform: "translateY(-50%)",
              color: "#ff6b35", fontSize: 18, animation: "fadeInRight 0.4s ease forwards",
            }}>←</div>
          )}
        </div>

        {/* Air particles */}
        {released && (
          <div style={{ position: "absolute", top: "50%", left: "53%", transform: "translateY(-50%)", display: "flex", gap: 6 }}>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{
                width: 8, height: 8, borderRadius: "50%",
                background: `rgba(0,212,255,${0.9 - i * 0.15})`,
                animation: `particleRight 1.8s ${i * 0.1}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                boxShadow: "0 0 6px rgba(0,212,255,0.6)",
              }} />
            ))}
          </div>
        )}

        {/* Labels */}
        {released && (
          <>
            <div style={{ position: "absolute", bottom: 12, left: "12%", color: "#ff6b35", fontFamily: "monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>← Balloon</div>
            <div style={{ position: "absolute", bottom: 12, right: "8%", color: "#00d4ff", fontFamily: "monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Air →</div>
          </>
        )}
      </div>

      {/* Explanation */}
      <div style={{ display: "flex", gap: 16, width: "100%", maxWidth: 680 }}>
        {[
          { label: "Action", desc: "Air expelled rightward", color: "#00d4ff", icon: "💨" },
          { label: "Reaction", desc: "Balloon moves leftward", color: "#ff6b35", icon: "🎈" },
          { label: "Newton III", desc: "Equal & opposite forces", color: "#a8ff3e", icon: "⚖️" },
        ].map(c => (
          <div key={c.label} style={{
            flex: 1, background: "#0d1117", border: `1px solid ${c.color}33`,
            borderRadius: 8, padding: "12px 14px",
          }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{c.icon}</div>
            <div style={{ color: c.color, fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{c.label}</div>
            <div style={{ color: "#888", fontSize: 12 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <button onClick={reset} style={{
        background: "transparent", border: "1px solid #30363d", color: "#666",
        padding: "6px 18px", borderRadius: 6, cursor: "pointer", fontFamily: "monospace", fontSize: 12,
        transition: "all 0.2s",
      }}
        onMouseEnter={e => { e.target.style.borderColor = "#666"; e.target.style.color = "#aaa"; }}
        onMouseLeave={e => { e.target.style.borderColor = "#30363d"; e.target.style.color = "#666"; }}
      >
        ↺ Reset
      </button>

      <style>{`
        @keyframes particleRight {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(180px); opacity: 0; }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translate(10px, -50%); }
          to { opacity: 1; transform: translate(0, -50%); }
        }
      `}</style>
    </div>
  );
}

// ── Pressure Diagram ───────────────────────────────────────────────────────
function PressureDiagram() {
  const [step, setStep] = useState(0);

  const steps = [
    { label: "Sealed balloon: symmetric pressure", open: false, arrows: "symmetric" },
    { label: "Nozzle opened: right-side pressure escapes", open: true, arrows: "asymmetric" },
    { label: "Net leftward force accelerates balloon", open: true, arrows: "net" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%" }}>
      <div style={{ display: "flex", gap: 8 }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{
            padding: "6px 14px", borderRadius: 6, fontFamily: "monospace", fontSize: 11,
            background: step === i ? "#ff6b35" : "transparent",
            border: `1px solid ${step === i ? "#ff6b35" : "#30363d"}`,
            color: step === i ? "#000" : "#666", cursor: "pointer", transition: "all 0.2s",
          }}>Step {i + 1}</button>
        ))}
      </div>

      {/* SVG Diagram */}
      <svg viewBox="0 0 600 220" style={{ width: "100%", maxWidth: 600, height: "auto" }}>
        {/* Balloon body */}
        <ellipse cx="260" cy="110" rx="120" ry="80" fill="#1a1a2e" stroke="#ff6b35" strokeWidth="2" />
        {/* Nozzle */}
        <rect x="378" y="98" width={step === 0 ? 22 : 22} height="24" fill="#1a1a2e" stroke="#ff6b35" strokeWidth="2" />
        {/* Nozzle cap */}
        {step === 0 && <rect x="396" y="96" width="8" height="28" rx="2" fill="#ff6b35" />}

        {/* Pressure arrows — symmetric */}
        {steps[step].arrows === "symmetric" && (
          <>
            {/* left */}
            <line x1="100" y1="110" x2="138" y2="110" stroke="#00d4ff" strokeWidth="2" markerEnd="url(#arr-blue)" />
            {/* right */}
            <line x1="420" y1="110" x2="382" y2="110" stroke="#00d4ff" strokeWidth="2" markerEnd="url(#arr-blue)" />
            {/* top */}
            <line x1="260" y1="20" x2="260" y2="34" stroke="#00d4ff" strokeWidth="2" markerEnd="url(#arr-blue)" />
            {/* bottom */}
            <line x1="260" y1="200" x2="260" y2="186" stroke="#00d4ff" strokeWidth="2" markerEnd="url(#arr-blue)" />
            <text x="300" y="16" fill="#00d4ff" fontSize="11" fontFamily="monospace">P</text>
            <text x="62" y="114" fill="#00d4ff" fontSize="11" fontFamily="monospace">P</text>
            <text x="426" y="114" fill="#00d4ff" fontSize="11" fontFamily="monospace">P</text>
            <text x="300" y="216" fill="#00d4ff" fontSize="11" fontFamily="monospace">P</text>
          </>
        )}

        {/* Pressure arrows — asymmetric (right side open) */}
        {steps[step].arrows === "asymmetric" && (
          <>
            <line x1="100" y1="110" x2="138" y2="110" stroke="#00d4ff" strokeWidth="2" markerEnd="url(#arr-blue)" />
            <text x="62" y="114" fill="#00d4ff" fontSize="11" fontFamily="monospace">P</text>
            <line x1="260" y1="20" x2="260" y2="34" stroke="#00d4ff" strokeWidth="2" markerEnd="url(#arr-blue)" />
            <line x1="260" y1="200" x2="260" y2="186" stroke="#00d4ff" strokeWidth="2" markerEnd="url(#arr-blue)" />
            {/* escaping air */}
            <line x1="400" y1="110" x2="460" y2="110" stroke="#a8ff3e" strokeWidth="2.5" markerEnd="url(#arr-green)" />
            <line x1="400" y1="100" x2="470" y2="85" stroke="#a8ff3e" strokeWidth="1.5" markerEnd="url(#arr-green)" />
            <line x1="400" y1="120" x2="470" y2="135" stroke="#a8ff3e" strokeWidth="1.5" markerEnd="url(#arr-green)" />
            <text x="468" y="114" fill="#a8ff3e" fontSize="11" fontFamily="monospace">exhaust</text>
          </>
        )}

        {/* Net force arrow */}
        {steps[step].arrows === "net" && (
          <>
            <line x1="100" y1="110" x2="138" y2="110" stroke="#00d4ff" strokeWidth="2" markerEnd="url(#arr-blue)" />
            <text x="62" y="114" fill="#00d4ff" fontSize="11" fontFamily="monospace">P</text>
            <line x1="400" y1="110" x2="460" y2="110" stroke="#a8ff3e" strokeWidth="2" markerEnd="url(#arr-green)" />
            {/* BIG net force arrow */}
            <line x1="260" y1="110" x2="140" y2="110" stroke="#ff6b35" strokeWidth="5" markerEnd="url(#arr-orange)" />
            <text x="160" y="98" fill="#ff6b35" fontSize="13" fontFamily="monospace" fontWeight="bold">F_net</text>
          </>
        )}

        {/* Arrow markers */}
        <defs>
          <marker id="arr-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#00d4ff" />
          </marker>
          <marker id="arr-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#a8ff3e" />
          </marker>
          <marker id="arr-orange" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#ff6b35" />
          </marker>
        </defs>
      </svg>

      <p style={{ color: "#aaa", fontFamily: "'DM Mono', monospace", fontSize: 13, textAlign: "center", maxWidth: 500 }}>
        {steps[step].label}
      </p>
    </div>
  );
}

// ── Slide renderer ─────────────────────────────────────────────────────────
function SlideContent({ slide }) {
  switch (slide.type) {
    case "title":
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: 20 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 4, color: "#ff6b35", textTransform: "uppercase", marginBottom: 8 }}>{slide.tag}</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: "clamp(42px, 6vw, 72px)",
            fontWeight: 900, lineHeight: 1.1, color: "#f0f6fc",
            whiteSpace: "pre-line", margin: 0,
            textShadow: "0 0 60px rgba(255,107,53,0.3)",
          }}>{slide.title}</h1>
          <div style={{ width: 80, height: 3, background: "linear-gradient(90deg, #ff6b35, #00d4ff)", borderRadius: 2, margin: "8px 0" }} />
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: "#8b949e", letterSpacing: 2 }}>{slide.subtitle}</p>

          {/* Decorative orbit */}
          <div style={{ position: "absolute", bottom: 40, right: 60, opacity: 0.15 }}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#ff6b35" strokeWidth="1" strokeDasharray="4 8" />
              <circle cx="100" cy="100" r="50" fill="none" stroke="#00d4ff" strokeWidth="1" strokeDasharray="4 8" />
              <circle cx="100" cy="100" r="6" fill="#ff6b35" />
              <circle cx="180" cy="100" r="4" fill="#00d4ff" />
              <circle cx="50" cy="20" r="3" fill="#a8ff3e" />
            </svg>
          </div>
        </div>
      );

    case "laws-overview":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#f0f6fc", margin: 0 }}>{slide.title}</h2>
          {slide.laws.map(law => (
            <div key={law.num} style={{
              display: "flex", gap: 20, alignItems: "flex-start",
              background: "#0d1117", borderRadius: 10,
              border: `1px solid ${law.color}22`, padding: "16px 20px",
            }}>
              <div style={{
                fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900,
                color: law.color, minWidth: 44, lineHeight: 1,
                textShadow: `0 0 20px ${law.color}55`,
              }}>{law.num}</div>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: law.color, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
                  {law.katexName ? <K color={law.color}>{String.raw`F = ma`}</K> : law.name}
                </div>
                <div style={{ color: "#8b949e", fontSize: 14, lineHeight: 1.6 }}>{law.text}</div>
              </div>
            </div>
          ))}
        </div>
      );

    case "balloon":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#f0f6fc", margin: "0 0 4px 0" }}>{slide.title}</h2>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#ff6b35", letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>{slide.subtitle}</p>
          </div>
          <BalloonSlide />
        </div>
      );

    case "pressure-diagram":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#f0f6fc", margin: "0 0 4px 0" }}>{slide.title}</h2>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#00d4ff", letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>{slide.subtitle}</p>
          </div>
          <PressureDiagram />
          <div style={{ background: "#0d1117", borderRadius: 8, padding: "12px 16px", borderLeft: "3px solid #ff6b35" }}>
            <p style={{ color: "#8b949e", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
              Inside a sealed balloon, pressure is <span style={{ color: "#00d4ff" }}>isotropic</span> — equal in all directions, so forces cancel. 
              Opening one end lets air escape, destroying the symmetry. The left wall still has gas pushing on it; 
              the right wall's opposing force is gone. The resulting <span style={{ color: "#ff6b35" }}>net force</span> accelerates the balloon leftward: <em>F = ma</em>.
            </p>
          </div>
        </div>
      );

    case "satellite":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#f0f6fc", margin: "0 0 4px 0" }}>{slide.title}</h2>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#a8ff3e", letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>{slide.subtitle}</p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1, background: "#0d1117", borderRadius: 10, padding: "16px", border: "1px solid #a8ff3e22" }}>
              <svg viewBox="0 0 280 160" style={{ width: "100%" }}>
                {/* Stars */}
                {[[20,15],[240,30],[60,140],[200,150],[140,10],[30,80],[260,100]].map(([x,y],i) => (
                  <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity="0.4" />
                ))}
                {/* Satellite body */}
                <rect x="100" y="65" width="80" height="30" rx="4" fill="#1a2744" stroke="#a8ff3e" strokeWidth="1.5" />
                {/* Solar panels */}
                <rect x="40" y="72" width="55" height="16" rx="2" fill="#0d2a5e" stroke="#00d4ff" strokeWidth="1" />
                <rect x="185" y="72" width="55" height="16" rx="2" fill="#0d2a5e" stroke="#00d4ff" strokeWidth="1" />
                {/* Panel connectors */}
                <line x1="95" y1="80" x2="100" y2="80" stroke="#a8ff3e" strokeWidth="1.5" />
                <line x1="180" y1="80" x2="185" y2="80" stroke="#a8ff3e" strokeWidth="1.5" />
                {/* Thruster nozzle */}
                <polygon points="180,73 190,68 190,92 180,87" fill="#ff6b35" opacity="0.8" />
                {/* Exhaust plume */}
                {[0,1,2].map(i => (
                  <ellipse key={i} cx={205 + i * 14} cy={80} rx={5 - i} ry={3 - i * 0.5}
                    fill="#ff6b35" opacity={0.6 - i * 0.18}
                    style={{ animation: `pulse 0.8s ${i * 0.15}s infinite alternate` }} />
                ))}
                {/* Force arrow */}
                <line x1="140" y1="50" x2="80" y2="50" stroke="#a8ff3e" strokeWidth="3" markerEnd="url(#sarr)" />
                <text x="82" y="43" fill="#a8ff3e" fontSize="10" fontFamily="monospace">F_thrust</text>
                <defs>
                  <marker id="sarr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#a8ff3e" />
                  </marker>
                </defs>
              </svg>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { title: "No medium needed", body: "Unlike propellers or paddles, rockets and thrusters work in a vacuum. There's nothing to push against — yet Newton III still applies.", c: "#a8ff3e" },
                { title: "Expel mass → gain momentum", body: "The spacecraft gains momentum equal and opposite to the ejected propellant. This is the heart of the Tsiolkovsky rocket equation.", c: "#00d4ff" },
                { title: "Attitude control", body: "RCS thrusters fire in short bursts to rotate or translate satellites without any atmospheric reference.", c: "#ff6b35" },
              ].map(item => (
                <div key={item.title} style={{ background: "#0d1117", borderRadius: 8, padding: "10px 14px", borderLeft: `3px solid ${item.c}` }}>
                  <div style={{ color: item.c, fontFamily: "monospace", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>{item.title}</div>
                  <div style={{ color: "#8b949e", fontSize: 12, lineHeight: 1.5 }}>{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "cycling":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#f0f6fc", margin: "0 0 4px 0" }}>{slide.title}</h2>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#00d4ff", letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>{slide.subtitle}</p>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
            <div style={{ flex: 1.2, background: "#0d1117", borderRadius: 10, padding: 16, border: "1px solid #00d4ff22" }}>
              <svg viewBox="0 0 280 160" style={{ width: "100%" }}>
                {/* Ground */}
                <line x1="10" y1="135" x2="270" y2="135" stroke="#30363d" strokeWidth="2" />
                {/* Rear wheel */}
                <circle cx="80" cy="115" r="30" fill="none" stroke="#00d4ff" strokeWidth="2" />
                <circle cx="80" cy="115" r="4" fill="#00d4ff" />
                {[0,60,120,180,240,300].map((a,i) => (
                  <line key={i}
                    x1={80 + 4 * Math.cos(a * Math.PI / 180)}
                    y1={115 + 4 * Math.sin(a * Math.PI / 180)}
                    x2={80 + 28 * Math.cos(a * Math.PI / 180)}
                    y2={115 + 28 * Math.sin(a * Math.PI / 180)}
                    stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
                ))}
                {/* Front wheel */}
                <circle cx="200" cy="115" r="30" fill="none" stroke="#00d4ff" strokeWidth="2" />
                <circle cx="200" cy="115" r="4" fill="#00d4ff" />
                {[0,60,120,180,240,300].map((a,i) => (
                  <line key={i}
                    x1={200 + 4 * Math.cos(a * Math.PI / 180)}
                    y1={115 + 4 * Math.sin(a * Math.PI / 180)}
                    x2={200 + 28 * Math.cos(a * Math.PI / 180)}
                    y2={115 + 28 * Math.sin(a * Math.PI / 180)}
                    stroke="#00d4ff" strokeWidth="1" opacity="0.5" />
                ))}
                {/* Frame */}
                <line x1="80" y1="115" x2="140" y2="60" stroke="#f0f6fc" strokeWidth="2" />
                <line x1="140" y1="60" x2="200" y2="115" stroke="#f0f6fc" strokeWidth="2" />
                <line x1="140" y1="60" x2="120" y2="115" stroke="#f0f6fc" strokeWidth="2" />
                <line x1="120" y1="115" x2="80" y2="115" stroke="#f0f6fc" strokeWidth="1.5" />
                {/* Handlebars */}
                <line x1="200" y1="115" x2="190" y2="65" stroke="#f0f6fc" strokeWidth="2" />
                <line x1="183" y1="62" x2="197" y2="62" stroke="#f0f6fc" strokeWidth="2" />
                {/* Rider */}
                <circle cx="148" cy="48" r="10" fill="#ff6b35" opacity="0.9" />
                <line x1="148" y1="58" x2="140" y2="80" stroke="#ff6b35" strokeWidth="2" />
                <line x1="140" y1="80" x2="120" y2="100" stroke="#ff6b35" strokeWidth="2" />
                <line x1="140" y1="80" x2="148" y2="105" stroke="#ff6b35" strokeWidth="2" />
                <line x1="148" y1="58" x2="190" y2="65" stroke="#ff6b35" strokeWidth="2" />
                {/* Force arrows at contact patch */}
                <line x1="80" y1="135" x2="50" y2="135" stroke="#ff6b35" strokeWidth="3" markerEnd="url(#carr)" />
                <text x="16" y="150" fill="#ff6b35" fontSize="9" fontFamily="monospace">F_tire →gnd</text>
                <line x1="80" y1="135" x2="110" y2="135" stroke="#a8ff3e" strokeWidth="3" markerEnd="url(#carr2)" />
                <text x="86" y="150" fill="#a8ff3e" fontSize="9" fontFamily="monospace">F_reaction</text>
                <defs>
                  <marker id="carr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#ff6b35" />
                  </marker>
                  <marker id="carr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#a8ff3e" />
                  </marker>
                </defs>
              </svg>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { step: "01", text: "Pedaling rotates the rear wheel.", c: "#00d4ff" },
                { step: "02", text: "Tire pushes backward on the road (action).", c: "#ff6b35" },
                { step: "03", text: "Road pushes forward on tire (reaction) — this is traction.", c: "#a8ff3e" },
                { step: "04", text: "Net forward force accelerates the system. F = ma governs the resulting acceleration.", c: "#f0f6fc" },
              ].map(s => (
                <div key={s.step} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, color: s.c, minWidth: 30, opacity: 0.6 }}>{s.step}</div>
                  <div style={{ color: "#8b949e", fontSize: 13, lineHeight: 1.5, paddingTop: 2 }}>{s.text}</div>
                </div>
              ))}
              <div style={{ background: "#161b22", borderRadius: 8, padding: "10px 14px", marginTop: 4, fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#a8ff3e", textAlign: "center" }}>
                Medium matters: solid ground provides a rigid reaction surface
              </div>
            </div>
          </div>
        </div>
      );

    case "swimming":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#f0f6fc", margin: "0 0 4px 0" }}>{slide.title}</h2>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#a8ff3e", letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>{slide.subtitle}</p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ flex: 1.2, background: "#0d1117", borderRadius: 10, padding: 16, border: "1px solid #a8ff3e22", position: "relative", overflow: "hidden" }}>
              {/* Water background */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0d1117 30%, #0a2030 100%)", borderRadius: 10 }} />
              <svg viewBox="0 0 280 160" style={{ width: "100%", position: "relative" }}>
                {/* Water waves */}
                <path d="M0,50 Q35,40 70,50 Q105,60 140,50 Q175,40 210,50 Q245,60 280,50" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.3" />
                <path d="M0,58 Q35,48 70,58 Q105,68 140,58 Q175,48 210,58 Q245,68 280,58" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.15" />
                {/* Swimmer (freestyle, side view) */}
                {/* body */}
                <ellipse cx="140" cy="90" rx="40" ry="10" fill="#ff6b35" opacity="0.85" />
                {/* head */}
                <circle cx="175" cy="88" r="9" fill="#ff6b35" opacity="0.85" />
                {/* arm pushing back */}
                <line x1="130" y1="88" x2="90" y2="100" stroke="#f0f6fc" strokeWidth="3" strokeLinecap="round" />
                {/* arm recovery */}
                <line x1="155" y1="88" x2="185" y2="75" stroke="#f0f6fc" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
                {/* legs kick */}
                <line x1="100" y1="90" x2="75" y2="100" stroke="#f0f6fc" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="100" y1="90" x2="72" y2="82" stroke="#f0f6fc" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
                {/* Water displaced */}
                <ellipse cx="80" cy="102" rx="14" ry="5" fill="#00d4ff" opacity="0.25" />
                {/* Arrows */}
                <line x1="90" y1="100" x2="60" y2="108" stroke="#ff6b35" strokeWidth="2.5" markerEnd="url(#warr)" />
                <text x="22" y="120" fill="#ff6b35" fontSize="9" fontFamily="monospace">hand on H₂O</text>
                <line x1="140" y1="80" x2="180" y2="72" stroke="#a8ff3e" strokeWidth="2.5" markerEnd="url(#warr2)" />
                <text x="170" y="65" fill="#a8ff3e" fontSize="9" fontFamily="monospace">thrust</text>
                <defs>
                  <marker id="warr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#ff6b35" />
                  </marker>
                  <marker id="warr2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill="#a8ff3e" />
                  </marker>
                </defs>
              </svg>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "The medium", body: "Water is a fluid — it resists displacement. This gives the swimmer a 'surface' to push against.", c: "#00d4ff" },
                { label: "The action", body: "Hand & forearm sweep backward, exerting force on the water rearward.", c: "#ff6b35" },
                { label: "The reaction", body: "Water pushes the swimmer forward with equal force.", c: "#a8ff3e" },
                { label: "Efficiency", body: "Optimal stroke mechanics maximize the backward component of force and minimize drag — a fluid dynamics problem on top of Newton III.", c: "#8b949e" },
              ].map(item => (
                <div key={item.label} style={{ background: "#0d1117", borderRadius: 8, padding: "10px 14px", borderLeft: `3px solid ${item.c}` }}>
                  <div style={{ color: item.c, fontFamily: "monospace", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>{item.label}</div>
                  <div style={{ color: "#8b949e", fontSize: 12, lineHeight: 1.5 }}>{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "synthesis":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#f0f6fc", margin: "0 0 4px 0" }}>{slide.title}</h2>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#ff6b35", letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>{slide.subtitle}</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
              <thead>
                <tr>
                  {["System", "Action", "Reaction medium", "Thrust origin"].map(h => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#ff6b35", borderBottom: "1px solid #30363d", fontSize: 11, letterSpacing: 1, fontWeight: 400, textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Balloon", "Air expelled rearward", "Atmosphere (or vacuum inside)", "Pressure imbalance"],
                  ["Satellite RCS", "Propellant ejected rearward", "Vacuum (no medium needed)", "Momentum conservation"],
                  ["Bicycle", "Tire pushes road backward", "Solid ground (traction)", "Normal + friction forces"],
                  ["Swimming", "Hand sweeps water backward", "Liquid water", "Fluid reaction force"],
                  ["Jet engine", "Hot gas exhausted rearward", "Atmosphere + internal duct", "Pressure + momentum flux"],
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#0d1117" : "transparent" }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: "9px 12px", color: j === 0 ? "#f0f6fc" : "#8b949e", borderBottom: "1px solid #21262d" }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ background: "#0d1117", borderRadius: 8, padding: "14px 18px", borderLeft: "3px solid #a8ff3e", marginTop: 4 }}>
            <p style={{ color: "#a8ff3e", fontFamily: "'DM Mono', monospace", fontSize: 13, margin: 0, lineHeight: 1.7 }}>
              The medium changes. The vehicle changes. The principle never does:<br />
              <span style={{ color: "#f0f6fc" }}>push something backward → get pushed forward.</span>
            </p>
          </div>
        </div>
      );

    case "equations":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#f0f6fc", margin: "0 0 4px 0" }}>{slide.title}</h2>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#00d4ff", letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>{slide.subtitle}</p>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                {
                  label: "Newton II — variable mass",
                  color: "#ff6b35",
                  tex: String.raw`F = \frac{\d(mv)}{\d t} = \dot{m}\, v_e`,
                },
                {
                  label: "Thrust equation",
                  color: "#a8ff3e",
                  tex: String.raw`T = \dot{m}\, v_e + (p_e - p_0)\, A_e`,
                },
                {
                  label: "Tsiolkovsky rocket equation",
                  color: "#00d4ff",
                  tex: String.raw`\Delta v = v_e \ln\!\left(\frac{m_0}{m_f}\right)`,
                },
                {
                  label: "Specific impulse",
                  color: "#f0f6fc",
                  tex: String.raw`I_{sp} = \frac{v_e}{g_0} \quad [\text{s}]`,
                },
              ].map(item => (
                <div key={item.label} style={{
                  background: "#0d1117", borderRadius: 10, padding: "14px 20px",
                  border: `1px solid ${item.color}22`,
                  display: "flex", flexDirection: "column", gap: 8,
                }}>
                  <div style={{ color: "#555", fontFamily: "monospace", fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>{item.label}</div>
                  <div style={{ fontSize: 20, color: item.color }}>
                    <K display={true} color={item.color}>{item.tex}</K>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ width: 210, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ background: "#0d1117", borderRadius: 10, padding: 14, border: "1px solid #30363d", fontSize: 12, color: "#8b949e", lineHeight: 1.8 }}>
                <div style={{ color: "#f0f6fc", marginBottom: 8, fontFamily: "monospace", fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>Key variables</div>
                {[
                  [String.raw`\dot{m}`, "mass flow rate"],
                  [String.raw`v_e`, "exhaust velocity"],
                  [String.raw`m_0`, "initial mass"],
                  [String.raw`m_f`, "final mass"],
                  [String.raw`p_e`, "exit pressure"],
                  [String.raw`A_e`, "exit area"],
                  [String.raw`g_0`, "std. gravity"],
                ].map(([sym, def]) => (
                  <div key={sym} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ color: "#00d4ff", minWidth: 44 }}><K color="#00d4ff">{sym}</K></span>
                    <span style={{ fontSize: 11 }}>{def}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#0d1117", borderRadius: 10, padding: 14, border: "1px solid #ff6b3533", fontSize: 12, color: "#8b949e", lineHeight: 1.6 }}>
                Every thruster you design this semester traces back to <K color="#ff6b35">{"F = ma"}</K> applied to a variable-mass system.
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ── Main Presentation ──────────────────────────────────────────────────────
export default function NewtonsLawsPropulsion() {
  const [current, setCurrent] = useState(0);
  const [animDir, setAnimDir] = useState(1);
  const [visible, setVisible] = useState(true);
  const total = slides.length;

  const goTo = (idx) => {
    if (idx < 0 || idx >= total) return;
    setAnimDir(idx > current ? 1 : -1);
    setVisible(false);
    setTimeout(() => { setCurrent(idx); setVisible(true); }, 160);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(current + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goTo(current - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current]);

  return (
    <div style={{
      minHeight: "100vh", background: "#010409",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "20px 16px", fontFamily: "sans-serif", color: "#f0f6fc",
      backgroundImage: "radial-gradient(ellipse at 20% 10%, #1a0a0014 0%, transparent 60%), radial-gradient(ellipse at 80% 90%, #00d4ff08 0%, transparent 50%)",
    }}>
      {/* Load fonts */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Mono:wght@300;400;500&display=swap" />

      {/* Slide container */}
      <div style={{
        width: "100%", maxWidth: 820,
        background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
        border: "1px solid #21262d",
        borderRadius: 16,
        padding: "32px 36px",
        minHeight: 520,
        display: "flex", flexDirection: "column", justifyContent: "flex-start",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px #30363d22",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${animDir * 12}px)`,
        transition: "opacity 0.16s ease, transform 0.16s ease",
        position: "relative", overflow: "hidden",
      }}>
        {/* Subtle grid bg */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "linear-gradient(#f0f6fc 1px, transparent 1px), linear-gradient(90deg, #f0f6fc 1px, transparent 1px)",
          backgroundSize: "40px 40px", pointerEvents: "none",
        }} />

        <SlideContent slide={slides[current]} />
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 20 }}>
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          style={{
            background: "transparent", border: "1px solid #30363d", color: current === 0 ? "#30363d" : "#8b949e",
            width: 40, height: 40, borderRadius: "50%", cursor: current === 0 ? "default" : "pointer",
            fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}
        >←</button>

        {/* Dot progress */}
        <div style={{ display: "flex", gap: 6 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === current ? 20 : 8, height: 8,
              borderRadius: 4, border: "none",
              background: i === current ? "#ff6b35" : "#30363d",
              cursor: "pointer", transition: "all 0.3s", padding: 0,
            }} />
          ))}
        </div>

        <button
          onClick={() => goTo(current + 1)}
          disabled={current === total - 1}
          style={{
            background: "transparent", border: "1px solid #30363d", color: current === total - 1 ? "#30363d" : "#8b949e",
            width: 40, height: 40, borderRadius: "50%", cursor: current === total - 1 ? "default" : "pointer",
            fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}
        >→</button>
      </div>

      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#30363d", marginTop: 10, letterSpacing: 1 }}>
        {current + 1} / {total} · arrow keys to navigate
      </p>

      <style>{`
        @keyframes pulse {
          from { opacity: 0.6; transform: scaleX(1); }
          to { opacity: 0.2; transform: scaleX(1.3); }
        }
      `}</style>
    </div>
  );
}
