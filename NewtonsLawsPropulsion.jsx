import { useState, useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
// Live polling loads the Firebase SDK from a CDN at runtime — no npm install and
// nothing for the bundler to resolve. See the setup block lower down.

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

// ── Live polling via Firebase Realtime Database ────────────────────────────
// SETUP (one time, ~3 min — no npm install needed):
//   1. Create a free Firebase project → add a Realtime Database (start in test
//      mode), then paste its config below.
//   2. Deploy the deck. Students scan the QR shown on a question slide (or open
//      <your-url>/?vote=CODE), tap an answer, and your slide tallies it live.
// The Firebase SDK is fetched from a CDN at runtime, only when a config is set.
// Until databaseURL is filled in, the deck runs exactly as before, with the
// built-in click-to-vote fallback — nothing breaks.
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "", // e.g. "https://your-project-default-rtdb.firebaseio.com"
  projectId: "",
};

// Change this each lecture (or per section) to begin with a fresh, empty room.
const POLL_SESSION = "me3470-lecture-1";

const pollEnabled = Boolean(firebaseConfig.databaseURL);
const FIREBASE_CDN = "https://www.gstatic.com/firebasejs/10.12.2";
let pollDb = null;
let pollReady = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error("Failed to load " + src));
    document.head.appendChild(s);
  });
}

// Fetch the Firebase compat SDK from the CDN the first time polling is used,
// initialize the app, and cache the database handle. Returns Promise<boolean>.
function ensurePoll() {
  if (!pollEnabled || typeof window === "undefined") return Promise.resolve(false);
  if (pollReady) return pollReady;
  pollReady = (async () => {
    if (!window.firebase) {
      await loadScript(`${FIREBASE_CDN}/firebase-app-compat.js`);
      await loadScript(`${FIREBASE_CDN}/firebase-database-compat.js`);
    }
    if (!window.firebase.apps.length) window.firebase.initializeApp(firebaseConfig);
    pollDb = window.firebase.database();
    return true;
  })();
  return pollReady;
}

// Anonymous, one vote per device (students can change their vote while open).
function pollDeviceId() {
  if (typeof window === "undefined") return "server";
  let id = window.localStorage.getItem("poll-device-id");
  if (!id) {
    id = Math.random().toString(36).slice(2, 10);
    window.localStorage.setItem("poll-device-id", id);
  }
  return id;
}

function usePollVotes(sessionCode, questionId) {
  const [votes, setVotes] = useState({});
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!pollEnabled) return;
    let votesRef, openRef, cancelled = false;
    ensurePoll().then((ok) => {
      if (!ok || cancelled) return;
      const base = `sessions/${sessionCode}/${questionId}`;
      votesRef = pollDb.ref(`${base}/votes`);
      openRef = pollDb.ref(`${base}/open`);
      votesRef.on("value", (s) => setVotes(s.val() || {}));
      openRef.on("value", (s) => setOpen(Boolean(s.val())));
    });
    return () => {
      cancelled = true;
      if (votesRef) votesRef.off();
      if (openRef) openRef.off();
    };
  }, [sessionCode, questionId]);
  return { votes, open };
}

function setPollOpen(questionId, isOpen) {
  ensurePoll().then((ok) => { if (ok) pollDb.ref(`sessions/${POLL_SESSION}/${questionId}/open`).set(isOpen); });
}
function resetPollVotes(questionId) {
  ensurePoll().then((ok) => { if (ok) pollDb.ref(`sessions/${POLL_SESSION}/${questionId}/votes`).remove(); });
}
function castPollVote(sessionCode, questionId, optionIndex) {
  ensurePoll().then((ok) => { if (ok) pollDb.ref(`sessions/${sessionCode}/${questionId}/votes/${pollDeviceId()}`).set(optionIndex); });
}
function tallyVotes(votes, numOptions) {
  const counts = new Array(numOptions).fill(0);
  Object.values(votes).forEach((v) => { if (v >= 0 && v < numOptions) counts[v] += 1; });
  return counts;
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
  {
    id: 9,
    type: "concept",
    q: "rocket",
  },
  {
    id: 10,
    type: "concept",
    q: "rockBreathing",
  },
];

// ── Peer-instruction concept questions ─────────────────────────────────────
const conceptQuestions = {
  rocket: {
    eyebrow: "Concept Check · Newton II for variable mass",
    title: "Rock(et) Propulsion",
    scenario:
      "A person throws rocks from a boat. At the instant shown the parameters below are known. What is the force F on the boat?",
    diagram: "rocket",
    vars: [
      ["R", "throwing rate (rocks/s)"],
      ["m_b", "mass of boat + contents (kg)"],
      ["m_r", "mass of one rock (kg)"],
      ["u_r", "rock velocity rel. to boat (m/s)"],
      ["u_b", "velocity of boat (m/s)"],
    ],
    options: [
      { tex: String.raw`F = R\,m_r\,u_r` },
      { tex: String.raw`F = R(m_r + m_b)\,u_r` },
      { tex: String.raw`F = R(m_r + m_b)(u_b - u_r)` },
      { tex: String.raw`F = R\,m_r(u_b - u_r)` },
      { text: "None of the above" },
      { text: "I don't know" },
    ],
    correct: 0,
    explanation:
      "Force is the time rate of change of momentum. The boat feels the reaction of a net mass flow of rocks, R·m_r, leaving at velocity u_r relative to the boat. The boat's own speed u_b cancels out — only the ejection velocity relative to the boat sets the thrust.",
    distractor: {
      idx: 3,
      note: "the popular trap. Subtracting u_b mixes reference frames; thrust depends on the rock's speed relative to the boat, not on how fast the boat is already moving.",
    },
    history: { year: "2004", n: 71, bars: [
      { opt: 1, val: 10 }, { opt: 2, val: 6 }, { opt: 3, val: 13 },
      { opt: 4, val: 27 }, { opt: 5, val: 4 }, { opt: 6, val: 7 },
    ] },
  },
  rockBreathing: {
    eyebrow: "Concept Check · momentum flux in & out",
    title: "Rock(-Breathing) Propulsion",
    scenario:
      "A person on a dock throws rocks to a person in a boat, who in turn throws them into the water. What is the force F on the boat?",
    diagram: "rockBreathing",
    vars: [
      ["R", "throwing rate (rocks/s)"],
      ["m_b", "mass of boat + contents (kg)"],
      ["m_r", "mass of one rock (kg)"],
      ["u_{in}", "rock velocity in, rel. to boat"],
      ["u_{out}", "rock velocity out, rel. to boat"],
      ["u_b", "velocity of boat (m/s)"],
    ],
    options: [
      { tex: String.raw`F = R\,m_r(u_{out} - u_{in})` },
      { tex: String.raw`F = R(m_r + m_b)(u_{out} - u_{in})` },
      { tex: String.raw`F = R(m_r + m_b)(u_b - u_{out})` },
      { tex: String.raw`F = R\,m_r(u_b - u_{out} - u_{in})` },
      { text: "None of the above" },
      { text: "I don't know" },
    ],
    correct: 0,
    explanation:
      "Again F is the rate of change of momentum, but rocks are now both received and ejected. The net force is the outgoing momentum flux R·m_r·u_out minus the incoming flux R·m_r·u_in, both measured relative to the boat — giving F = R·m_r(u_out − u_in).",
    distractor: null,
    history: { year: "2004", n: 53, bars: [
      { opt: 1, val: 50 }, { opt: 2, val: 3 },
    ] },
  },
};

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
// Helpers: compute N uniformly-spaced points on an ellipse (cx,cy,rx,ry)
// and return the outward unit normal at each point.
function ellipseArrows(cx, cy, rx, ry, n) {
  // Parameterise by equal angle steps; good-enough for visual uniform spacing
  return Array.from({ length: n }, (_, i) => {
    const t = (2 * Math.PI * i) / n;
    const x = cx + rx * Math.cos(t);
    const y = cy + ry * Math.sin(t);
    // Outward normal direction (unnormalised gradient of ellipse equation)
    const nx = Math.cos(t) / rx;
    const ny = Math.sin(t) / ry;
    const len = Math.sqrt(nx * nx + ny * ny);
    return { x, y, nx: nx / len, ny: ny / len, t };
  });
}

function PressureDiagram() {
  // layer visibility: 0 = none, 1 = external only, 2 = +internal, 3 = +skin tension
  const [layer, setLayer] = useState(0);
  // For step 2 / step 3 we also show nozzle open + net-force variants
  const [scenario, setScenario] = useState(0); // 0=sealed, 1=open, 2=net

  // Balloon geometry (SVG viewBox 0 0 600 260)
  const CX = 270, CY = 130, RX = 130, RY = 88;
  const N_EXT = 12; // external pressure arrows
  const N_INT = 12; // internal pressure arrows
  const N_SKIN = 16; // skin tension tick marks

  const extPts = ellipseArrows(CX, CY, RX, RY, N_EXT);
  const intPts = ellipseArrows(CX, CY, RX, RY, N_INT);

  const ARROW_LEN = 30; // length of external-pressure arrow shaft
  const INT_LEN   = 28; // length of internal-pressure arrow shaft

  // skin tension: pairs of small tangent ticks along the skin
  const skinPts = ellipseArrows(CX, CY, RX, RY, N_SKIN);

  const stepLabels = [
    { label: "External atmospheric pressure (P_atm)", color: "#00d4ff" },
    { label: "Internal gas pressure (P_int > P_atm)", color: "#ff6b35" },
    { label: "Skin tension balances the pressure difference", color: "#a8ff3e" },
  ];

  const scenarioLabels = [
    "Sealed balloon — symmetric, net force = 0",
    "Nozzle opened — right-side symmetry broken, air escapes",
    "Net leftward force accelerates balloon (F = ma)",
  ];

  // Which layers are visible
  const showExt  = layer >= 1;
  const showInt  = layer >= 2;
  const showSkin = layer >= 3;

  // Nozzle open for scenario >= 1
  const nozzleOpen = scenario >= 1;
  // Hide external arrows on the right in scenario 1+
  const extVisible = (pt) => {
    if (!nozzleOpen) return true;
    // suppress the rightmost 3 arrows (near the nozzle opening)
    return pt.nx < 0.65;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}>

      {/* ── Layer controls ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {stepLabels.map((s, i) => {
            const active = layer === i + 1;
            const past   = layer > i + 1;
            return (
              <button key={i} onClick={() => setLayer(i + 1 === layer ? i : i + 1)} style={{
                padding: "6px 14px", borderRadius: 6, fontFamily: "monospace", fontSize: 11,
                background: active ? s.color : past ? s.color + "22" : "transparent",
                border: `1px solid ${active || past ? s.color : "#30363d"}`,
                color: active ? "#000" : past ? s.color : "#666",
                cursor: "pointer", transition: "all 0.25s",
              }}>
                {active || past ? "✓ " : ""}{`Layer ${i + 1}`}
              </button>
            );
          })}
          <button onClick={() => setLayer(0)} style={{
            padding: "6px 14px", borderRadius: 6, fontFamily: "monospace", fontSize: 11,
            background: "transparent", border: "1px solid #30363d",
            color: "#555", cursor: "pointer",
          }}>↺ Reset</button>
        </div>
        {layer > 0 && (
          <div style={{ fontFamily: "monospace", fontSize: 11, color: stepLabels[layer - 1].color, letterSpacing: 0.5 }}>
            {stepLabels[layer - 1].label}
          </div>
        )}
      </div>

      {/* ── Scenario stepper ── */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        {scenarioLabels.map((s, i) => (
          <button key={i} onClick={() => setScenario(i)} style={{
            padding: "5px 12px", borderRadius: 6, fontFamily: "monospace", fontSize: 10,
            background: scenario === i ? "#ff6b35" : "transparent",
            border: `1px solid ${scenario === i ? "#ff6b35" : "#30363d"}`,
            color: scenario === i ? "#000" : "#555", cursor: "pointer", transition: "all 0.2s",
          }}>Step {i + 1}</button>
        ))}
      </div>

      {/* ── SVG ── */}
      <svg viewBox="0 0 600 260" style={{ width: "100%", maxWidth: 620, height: "auto" }}>
        <defs>
          <marker id="pd-ext" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill="#00d4ff" />
          </marker>
          <marker id="pd-int" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill="#ff6b35" />
          </marker>
          <marker id="pd-green" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto">
            <path d="M0,0 L0,8 L9,4 z" fill="#a8ff3e" />
          </marker>
          <marker id="pd-orange" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L0,10 L10,5 z" fill="#ff6b35" />
          </marker>
          {/* Glow filter for internal arrows */}
          <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── External pressure arrows (inward, tip touches skin) ── */}
        {showExt && extPts.map((p, i) => {
          if (!extVisible(p)) return null;
          const x1 = p.x + p.nx * ARROW_LEN;
          const y1 = p.y + p.ny * ARROW_LEN;
          const x2 = p.x + p.nx * 4;
          const y2 = p.y + p.ny * 4;
          return (
            <line key={`ext-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#00d4ff" strokeWidth="1.8"
              markerEnd="url(#pd-ext)"
              filter="url(#glow-blue)"
              style={{ opacity: 0, animation: `fadeIn 0.35s ${i * 0.04}s ease forwards` }}
            />
          );
        })}

        {/* ── Internal pressure arrows (outward) ── */}
        {showInt && intPts.map((p, i) => {
          const x1 = p.x - p.nx * INT_LEN; // start at centre-ish inside
          const y1 = p.y - p.ny * INT_LEN;
          const x2 = p.x - p.nx * 3; // tip just touches inner skin
          const y2 = p.y - p.ny * 3;
          return (
            <line key={`int-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#ff6b35" strokeWidth="1.8"
              markerEnd="url(#pd-int)"
              filter="url(#glow-orange)"
              style={{ opacity: 0, animation: `fadeIn 0.35s ${i * 0.04}s ease forwards` }}
            />
          );
        })}

        {/* ── Skin tension ticks ── */}
        {showSkin && skinPts.map((p, i) => {
          // Tangent direction: perpendicular to normal
          const tx = -p.ny, ty = p.nx;
          const TICK = 7;
          return (
            <line key={`sk-${i}`}
              x1={p.x - tx * TICK} y1={p.y - ty * TICK}
              x2={p.x + tx * TICK} y2={p.y + ty * TICK}
              stroke="#a8ff3e" strokeWidth="2.5" strokeLinecap="round"
              style={{ opacity: 0, animation: `fadeIn 0.3s ${i * 0.03}s ease forwards` }}
            />
          );
        })}

        {/* ── Balloon body (drawn after arrows so it clips nothing) ── */}
        <ellipse cx={CX} cy={CY} rx={RX} ry={RY}
          fill="#111428" fillOpacity="0.85"
          stroke="#ff6b35" strokeWidth="2.5"
        />

        {/* ── Nozzle ── */}
        <rect x={CX + RX - 2} y={CY - 13} width="26" height="26"
          fill="#111428" stroke="#ff6b35" strokeWidth="2" />
        {/* Cap (sealed) */}
        {!nozzleOpen && (
          <rect x={CX + RX + 20} y={CY - 15} width="9" height="30" rx="2" fill="#ff6b35" />
        )}

        {/* ── Escaping air (scenario 1+) ── */}
        {nozzleOpen && (
          <>
            <line x1={CX + RX + 26} y1={CY}
                  x2={CX + RX + 80} y2={CY}
              stroke="#a8ff3e" strokeWidth="2.5" markerEnd="url(#pd-green)" />
            <line x1={CX + RX + 26} y1={CY - 8}
                  x2={CX + RX + 90} y2={CY - 24}
              stroke="#a8ff3e" strokeWidth="1.5" markerEnd="url(#pd-green)" />
            <line x1={CX + RX + 26} y1={CY + 8}
                  x2={CX + RX + 90} y2={CY + 24}
              stroke="#a8ff3e" strokeWidth="1.5" markerEnd="url(#pd-green)" />
            <text x={CX + RX + 82} y={CY + 4}
              fill="#a8ff3e" fontSize="11" fontFamily="monospace">exhaust</text>
          </>
        )}

        {/* ── Net force arrow (scenario 2) ── */}
        {scenario === 2 && (
          <>
            <line x1={CX} y1={CY} x2={CX - 110} y2={CY}
              stroke="#ff6b35" strokeWidth="6" markerEnd="url(#pd-orange)"
              style={{ opacity: 0, animation: "fadeIn 0.5s 0.1s ease forwards" }}
            />
            <text x={CX - 108} y={CY - 12}
              fill="#ff6b35" fontSize="13" fontFamily="monospace" fontWeight="bold">F_net</text>
          </>
        )}

        {/* ── Labels ── */}
        {showExt && (
          <text x="18" y="24" fill="#00d4ff" fontSize="11" fontFamily="monospace"
            style={{ opacity: 0, animation: "fadeIn 0.4s 0.1s ease forwards" }}>
            P_atm (external)
          </text>
        )}
        {showInt && (
          <text x="18" y="42" fill="#ff6b35" fontSize="11" fontFamily="monospace"
            style={{ opacity: 0, animation: "fadeIn 0.4s 0.1s ease forwards" }}>
            P_int (internal, higher)
          </text>
        )}
        {showSkin && (
          <text x="18" y="60" fill="#a8ff3e" fontSize="11" fontFamily="monospace"
            style={{ opacity: 0, animation: "fadeIn 0.4s 0.1s ease forwards" }}>
            T_skin (tension in membrane)
          </text>
        )}
      </svg>

      {/* ── Caption ── */}
      <p style={{ color: "#aaa", fontFamily: "'DM Mono', monospace", fontSize: 12, textAlign: "center", maxWidth: 540, margin: 0 }}>
        {scenarioLabels[scenario]}
      </p>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ── Concept-question diagrams ──────────────────────────────────────────────
function RocketDiagram() {
  return (
    <svg viewBox="0 0 320 150" style={{ width: "100%", maxWidth: 330 }}>
      <path d="M0,122 Q40,116 80,122 Q120,128 160,122 Q200,116 240,122 Q280,128 320,122" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.3" />
      {/* boat */}
      <polygon points="58,96 150,96 138,120 70,120" fill="#1a2744" stroke="#a8ff3e" strokeWidth="1.5" />
      {/* rock pile in boat */}
      {[[78,91],[89,91],[100,91],[83,83],[95,83]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="5" fill="#3a4a5a" stroke="#566472" strokeWidth="0.5" />
      ))}
      {/* thrower */}
      <circle cx="120" cy="74" r="6" fill="#ff6b35" />
      <line x1="120" y1="80" x2="120" y2="96" stroke="#ff6b35" strokeWidth="2" />
      <line x1="120" y1="84" x2="142" y2="77" stroke="#ff6b35" strokeWidth="2" />
      {/* ejected rocks */}
      {[[162,75],[188,73],[214,71]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r={5-i} fill="#3a4a5a" opacity={0.9-i*0.22} />
      ))}
      {/* ejection flow */}
      <line x1="150" y1="78" x2="248" y2="68" stroke="#00d4ff" strokeWidth="2.5" markerEnd="url(#cq-cyan)" />
      <text x="150" y="58" fill="#00d4ff" fontSize="10.5" fontFamily="monospace">rocks out:  R m_r , u_r</text>
      {/* boat velocity */}
      <line x1="104" y1="110" x2="66" y2="110" stroke="#a8ff3e" strokeWidth="2" markerEnd="url(#cq-green)" />
      <text x="40" y="105" fill="#a8ff3e" fontSize="10" fontFamily="monospace">u_b</text>
      <defs>
        <marker id="cq-cyan" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#00d4ff" /></marker>
        <marker id="cq-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#a8ff3e" /></marker>
      </defs>
    </svg>
  );
}

function RockBreathingDiagram() {
  return (
    <svg viewBox="0 0 360 150" style={{ width: "100%", maxWidth: 360 }}>
      <path d="M0,124 Q45,118 90,124 Q135,130 180,124 Q225,118 270,124 Q315,130 360,124" fill="none" stroke="#00d4ff" strokeWidth="1" opacity="0.3" />
      {/* dock */}
      <rect x="0" y="92" width="120" height="6" fill="#2a2f3a" />
      <line x1="20" y1="98" x2="20" y2="124" stroke="#2a2f3a" strokeWidth="3" />
      <line x1="100" y1="98" x2="100" y2="124" stroke="#2a2f3a" strokeWidth="3" />
      {/* rocks on dock */}
      {[[18,86],[29,86],[40,86],[23,78]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="4.5" fill="#3a4a5a" stroke="#566472" strokeWidth="0.5" />
      ))}
      {/* dock thrower */}
      <circle cx="70" cy="74" r="6" fill="#ff6b35" />
      <line x1="70" y1="80" x2="70" y2="92" stroke="#ff6b35" strokeWidth="2" />
      <line x1="70" y1="83" x2="90" y2="78" stroke="#ff6b35" strokeWidth="2" />
      {/* boat */}
      <polygon points="206,96 286,96 275,118 217,118" fill="#1a2744" stroke="#a8ff3e" strokeWidth="1.5" />
      {/* boat thrower */}
      <circle cx="238" cy="76" r="6" fill="#ff6b35" />
      <line x1="238" y1="82" x2="238" y2="96" stroke="#ff6b35" strokeWidth="2" />
      <line x1="238" y1="85" x2="258" y2="80" stroke="#ff6b35" strokeWidth="2" />
      {/* incoming flow dock -> boat */}
      <line x1="96" y1="80" x2="204" y2="84" stroke="#00d4ff" strokeWidth="2.5" markerEnd="url(#cq2-cyan)" />
      <text x="104" y="70" fill="#00d4ff" fontSize="10" fontFamily="monospace">in:  R m_r , u_in</text>
      {/* outgoing flow boat -> water */}
      <line x1="276" y1="80" x2="350" y2="74" stroke="#a8ff3e" strokeWidth="2.5" markerEnd="url(#cq2-green)" />
      <text x="262" y="64" fill="#a8ff3e" fontSize="10" fontFamily="monospace">out:  R m_r , u_out</text>
      <defs>
        <marker id="cq2-cyan" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#00d4ff" /></marker>
        <marker id="cq2-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#a8ff3e" /></marker>
      </defs>
    </svg>
  );
}

// ── Past-class response bars ───────────────────────────────────────────────
function ResultsBars({ history, correct }) {
  const max = Math.max(...history.bars.map(b => b.val));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ color: "#555", fontFamily: "monospace", fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>
        A past offering · {history.year} · n ≈ {history.n} · green = correct
      </div>
      {history.bars.map(b => {
        const isCorrect = b.opt - 1 === correct;
        return (
          <div key={b.opt} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 12, color: isCorrect ? "#a8ff3e" : "#8b949e", fontFamily: "monospace", fontSize: 11 }}>{b.opt}</span>
            <div style={{ flex: 1, background: "#161b22", borderRadius: 3, height: 13, overflow: "hidden" }}>
              <div style={{ width: `${(b.val / max) * 100}%`, height: "100%", background: isCorrect ? "#a8ff3e" : "#5a6472", opacity: isCorrect ? 1 : 0.7, borderRadius: 3, transition: "width 0.5s ease" }} />
            </div>
            <span style={{ width: 22, textAlign: "right", color: "#8b949e", fontFamily: "monospace", fontSize: 10 }}>{b.val}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Concept question (Think · Pair · Reveal) ───────────────────────────────
function ConceptQuestion({ data, qid }) {
  const [phase, setPhase] = useState(0);
  const [pick, setPick] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const { votes, open } = usePollVotes(POLL_SESSION, qid);

  // Voting opens during Think/Pair and closes on Reveal; also closes on leave.
  useEffect(() => { setPollOpen(qid, phase < 2); }, [qid, phase]);
  useEffect(() => () => { setPollOpen(qid, false); }, [qid]);

  const phases = [
    { key: "Think", hint: "Vote on your own — no discussion yet", color: "#00d4ff" },
    { key: "Pair & Share", hint: "Turn to a neighbor, defend your choice, then re-vote", color: "#a8ff3e" },
    { key: "Reveal", hint: "Reasoning & answer", color: "#ff6b35" },
  ];
  const revealed = phase === 2;
  const Diagram = data.diagram === "rocket" ? RocketDiagram : RockBreathingDiagram;

  const counts = tallyVotes(votes, data.options.length);
  const total = Object.keys(votes).length;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const voteUrl = `${origin}/?vote=${POLL_SESSION}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=0&data=${encodeURIComponent(voteUrl)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 13, width: "100%" }}>
      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#ff6b35", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{data.eyebrow}</div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "#f0f6fc", margin: 0 }}>{data.title}</h2>
      </div>

      {/* Phase stepper */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {phases.map((p, i) => (
          <button key={p.key} onClick={() => setPhase(i)} style={{
            padding: "6px 14px", borderRadius: 20, fontFamily: "monospace", fontSize: 11,
            background: phase === i ? p.color : "transparent",
            border: `1px solid ${phase === i ? p.color : "#30363d"}`,
            color: phase === i ? "#000" : "#666", cursor: "pointer", transition: "all 0.2s",
          }}>{i + 1} · {p.key}</button>
        ))}
        <span style={{ color: "#8b949e", fontFamily: "monospace", fontSize: 11, marginLeft: 2 }}>{phases[phase].hint}</span>
      </div>

      {/* Scenario + diagram + givens */}
      <div style={{ display: "flex", gap: 14, alignItems: "stretch" }}>
        <div style={{ flex: 1.3, background: "#0d1117", border: "1px solid #30363d", borderRadius: 10, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
          <p style={{ color: "#c9d1d9", fontSize: 13, lineHeight: 1.5, margin: 0 }}>{data.scenario}</p>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1, marginTop: 4 }}>
            <Diagram />
          </div>
        </div>
        <div style={{ flex: 0.85, background: "#0d1117", border: "1px solid #30363d", borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ color: "#f0f6fc", fontFamily: "monospace", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Given</div>
          {data.vars.map(([sym, def]) => (
            <div key={sym} style={{ display: "flex", gap: 10, alignItems: "baseline", marginBottom: 6 }}>
              <span style={{ minWidth: 40 }}><K color="#00d4ff">{sym}</K></span>
              <span style={{ color: "#8b949e", fontSize: 11.5, lineHeight: 1.4 }}>{def}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Join panel — shown while voting (Think / Pair) when polling is on */}
      {pollEnabled && !revealed && (
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#0d1117", border: "1px solid #30363d", borderRadius: 10, padding: "12px 16px" }}>
          <img src={qrSrc} alt="Scan to vote" width="74" height="74" style={{ borderRadius: 6, background: "#fff", padding: 4 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#f0f6fc", fontFamily: "monospace", fontSize: 10, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Vote from your phone</div>
            <div style={{ color: "#00d4ff", fontFamily: "monospace", fontSize: 13, wordBreak: "break-all" }}>{voteUrl}</div>
            <div style={{ color: "#8b949e", fontFamily: "monospace", fontSize: 11, marginTop: 2 }}>room · {POLL_SESSION}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <div style={{ fontFamily: "monospace", fontSize: 12, color: open ? "#a8ff3e" : "#8b949e" }}>{open ? "● voting open" : "○ closed"}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, color: "#f0f6fc", lineHeight: 1 }}>{total}<span style={{ fontFamily: "monospace", fontSize: 11, color: "#8b949e", marginLeft: 6 }}>votes</span></div>
            <button onClick={() => resetPollVotes(qid)} style={{ background: "transparent", border: "1px solid #30363d", color: "#666", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "monospace", fontSize: 10 }}>↺ reset</button>
          </div>
        </div>
      )}

      {/* Options — live tallies when polling is on, click-to-vote fallback otherwise */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {data.options.map((opt, i) => {
          const isCorrect = i === data.correct;
          const isPicked = !pollEnabled && i === pick;
          const pct = pollEnabled && total ? (counts[i] / total) * 100 : 0;
          let border = "#30363d", bg = "#0d1117", glow = "none";
          if (revealed && isCorrect) { border = "#a8ff3e"; bg = "#0e1f12"; glow = "0 0 0 1px #a8ff3e44"; }
          else if (revealed && isPicked && !isCorrect) { border = "#ff6b35"; bg = "#1f1310"; }
          else if (isPicked) { border = "#00d4ff"; bg = "#0c1922"; }
          const badgeBg = (revealed && isCorrect) ? "#a8ff3e" : (isPicked ? "#00d4ff" : "#161b22");
          const badgeColor = ((revealed && isCorrect) || isPicked) ? "#000" : "#8b949e";
          const fill = revealed ? (isCorrect ? "#a8ff3e" : "#5a6472") : "#00d4ff";
          return (
            <button key={i} onClick={pollEnabled ? undefined : () => setPick(i)} style={{
              position: "relative", overflow: "hidden",
              display: "flex", alignItems: "center", gap: 12, textAlign: "left",
              background: bg, border: `1px solid ${border}`, boxShadow: glow,
              borderRadius: 9, padding: "11px 14px", cursor: pollEnabled ? "default" : "pointer", transition: "all 0.18s",
            }}>
              {pollEnabled && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: fill, opacity: 0.18, transition: "width 0.4s ease" }} />}
              <span style={{
                position: "relative", minWidth: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "monospace", fontSize: 12, background: badgeBg, color: badgeColor, border: "1px solid #30363d",
              }}>{i + 1}</span>
              <span style={{ position: "relative", flex: 1 }}>
                {opt.text
                  ? <span style={{ fontFamily: "monospace", fontSize: 13, color: "#8b949e" }}>{opt.text}</span>
                  : <span style={{ fontSize: 15, color: "#e6edf3" }}><K>{opt.tex}</K></span>}
              </span>
              {pollEnabled && <span style={{ position: "relative", fontFamily: "monospace", fontSize: 12, color: revealed && isCorrect ? "#a8ff3e" : "#8b949e", minWidth: 18, textAlign: "right" }}>{counts[i]}</span>}
              {revealed && isCorrect && <span style={{ position: "relative", color: "#a8ff3e", fontSize: 15 }}>✓</span>}
              {revealed && isPicked && !isCorrect && <span style={{ position: "relative", color: "#ff6b35", fontSize: 15 }}>✗</span>}
            </button>
          );
        })}
      </div>

      {!pollEnabled && (
        <div style={{ color: "#555", fontFamily: "monospace", fontSize: 10.5, letterSpacing: 0.5 }}>
          live polling off · add your Firebase config near the top of this file to let students vote from their phones
        </div>
      )}

      {/* Reveal */}
      {revealed && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ background: "#0d1117", border: "1px solid #a8ff3e33", borderRadius: 10, padding: "14px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{ color: "#a8ff3e", fontFamily: "monospace", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>Answer · option {data.correct + 1}</span>
              <span style={{ fontSize: 18 }}><K color="#a8ff3e">{data.options[data.correct].tex}</K></span>
              {pollEnabled && total > 0 && <span style={{ color: "#8b949e", fontFamily: "monospace", fontSize: 11, marginLeft: "auto" }}>{counts[data.correct]} / {total} correct · {Math.round((counts[data.correct] / total) * 100)}%</span>}
            </div>
            <p style={{ color: "#8b949e", fontSize: 13, lineHeight: 1.65, margin: 0 }}>{data.explanation}</p>
            {data.distractor && (
              <p style={{ color: "#bd8b73", fontSize: 12.5, lineHeight: 1.6, margin: "10px 0 0", paddingTop: 10, borderTop: "1px solid #21262d" }}>
                <span style={{ color: "#ff6b35", fontFamily: "monospace", fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>Watch out · option {data.distractor.idx + 1} — </span>
                {data.distractor.note}
              </p>
            )}
          </div>
          {data.history && (
            <div>
              <button onClick={() => setShowHistory(s => !s)} style={{
                background: "transparent", border: "1px solid #30363d", color: "#8b949e",
                padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontFamily: "monospace", fontSize: 11,
              }}>{showHistory ? "▾ hide past-class results" : "▸ show how past classes voted"}</button>
              {showHistory && (
                <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, padding: "12px 16px", marginTop: 8 }}>
                  <ResultsBars history={data.history} correct={data.correct} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Phone voting view (opened via <your-url>/?vote=CODE) ───────────────────
function StudentVote({ code }) {
  const [openMap, setOpenMap] = useState({});
  const [myVote, setMyVote] = useState(null);

  useEffect(() => {
    if (!pollEnabled) return;
    let refs = [], cancelled = false;
    ensurePoll().then((ok) => {
      if (!ok || cancelled) return;
      Object.keys(conceptQuestions).forEach((id) => {
        const r = pollDb.ref(`sessions/${code}/${id}/open`);
        r.on("value", (s) => setOpenMap((m) => ({ ...m, [id]: Boolean(s.val()) })));
        refs.push(r);
      });
    });
    return () => { cancelled = true; refs.forEach((r) => r.off()); };
  }, [code]);

  const activeId = Object.keys(conceptQuestions).find((id) => openMap[id]) || null;
  const q = activeId ? conceptQuestions[activeId] : null;

  useEffect(() => { setMyVote(null); }, [activeId]);

  const choose = (i) => { setMyVote(i); castPollVote(code, activeId, i); };

  const shell = (children) => (
    <div style={{ minHeight: "100vh", background: "#010409", color: "#f0f6fc", fontFamily: "sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 18px", textAlign: "center", gap: 16 }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&display=swap" />
      {children}
    </div>
  );

  if (!pollEnabled) return shell(<p style={{ color: "#8b949e", fontFamily: "monospace" }}>Live polling isn't configured for this site yet.</p>);

  if (!q) return shell(
    <>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 3, color: "#ff6b35", textTransform: "uppercase" }}>room · {code}</div>
      <div style={{ fontSize: 44 }}>🛰️</div>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, margin: 0 }}>You're in.</h1>
      <p style={{ color: "#8b949e", fontFamily: "monospace", fontSize: 13, maxWidth: 320 }}>Waiting for your instructor to open a question…</p>
    </>
  );

  return shell(
    <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 14, textAlign: "left" }}>
      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 2, color: "#ff6b35", textTransform: "uppercase", marginBottom: 6 }}>{q.eyebrow}</div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin: 0 }}>{q.title}</h1>
        <p style={{ color: "#8b949e", fontSize: 13, lineHeight: 1.5, marginTop: 8 }}>{q.scenario}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {q.options.map((opt, i) => {
          const chosen = myVote === i;
          return (
            <button key={i} onClick={() => choose(i)} style={{
              display: "flex", alignItems: "center", gap: 12, textAlign: "left",
              background: chosen ? "#0c1922" : "#0d1117", border: `1px solid ${chosen ? "#00d4ff" : "#30363d"}`,
              borderRadius: 10, padding: "14px 16px", cursor: "pointer", transition: "all 0.15s",
            }}>
              <span style={{ minWidth: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 13, background: chosen ? "#00d4ff" : "#161b22", color: chosen ? "#000" : "#8b949e", border: "1px solid #30363d" }}>{i + 1}</span>
              <span style={{ flex: 1 }}>
                {opt.text
                  ? <span style={{ fontFamily: "monospace", fontSize: 13, color: "#c9d1d9" }}>{opt.text}</span>
                  : <span style={{ fontSize: 16, color: "#e6edf3" }}><K>{opt.tex}</K></span>}
              </span>
              {chosen && <span style={{ color: "#00d4ff", fontSize: 16 }}>✓</span>}
            </button>
          );
        })}
      </div>
      <p style={{ color: myVote !== null ? "#a8ff3e" : "#8b949e", fontFamily: "monospace", fontSize: 12, minHeight: 16 }}>
        {myVote !== null ? "✓ vote recorded — you can change it while voting is open" : "tap your answer"}
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

    case "concept":
      return <ConceptQuestion data={conceptQuestions[slide.q]} qid={slide.q} />;

    default:
      return null;
  }
}

// ── Main Presentation ──────────────────────────────────────────────────────
function Deck() {
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

// ── Entry point: presenter deck, or the phone voting view (?vote=CODE) ──────
export default function NewtonsLawsPropulsion() {
  const voteCode =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("vote")
      : null;
  return voteCode ? <StudentVote code={voteCode} /> : <Deck />;
}
