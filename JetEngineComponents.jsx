import { useState, useEffect } from "react";

// ── Engine geometry (shared by the schematic on every slide) ───────────────
// One reusable cross-section of a two-spool turbofan. Each slide passes an
// `active` section; that module lights up in its accent color, its zone is
// banded, and its bounding station numbers are highlighted. Everything else
// dims to gray so the eye lands on the part being discussed.

const MIRROR = 330; // centerline at y = 165, so a point's mirror is 330 - y

const NAC_TOP = [
  [122, 108], [160, 92], [214, 84], [298, 88], [392, 92], [476, 95],
  [536, 97], [600, 99], [668, 101], [728, 104], [792, 120], [858, 110],
];

function nacellePath(top) {
  const head = top.map(([x, y], i) => (i ? "L" : "M") + x + "," + y).join(" ");
  const last = top[top.length - 1];
  const down = "L" + last[0] + "," + (MIRROR - last[1]);
  const back = [...top].reverse().map(([x, y]) => "L" + x + "," + (MIRROR - y)).join(" ");
  return head + " " + down + " " + back + " Z";
}
const NACELLE_D = nacellePath(NAC_TOP);

// id, x, tick-top-y (meets the cowl), half-station?
const STATIONS_SVG = [
  ["0", 28, 150, false], ["1", 122, 108, false], ["2", 214, 84, false],
  ["2.5", 298, 88, true], ["3", 392, 92, false], ["4", 476, 95, false],
  ["4.5", 536, 97, true], ["5", 600, 99, false], ["6", 668, 101, false],
  ["7", 728, 104, false], ["8", 792, 120, false], ["9", 858, 110, false],
];

const MOD = {
  inlet: "#00d4ff", fan: "#38bdf8", lpc: "#a8ff3e", hpc: "#7dd923",
  comb: "#ff6b35", hpt: "#ffb000", lpt: "#ffce5a", ab: "#ff4d4d", noz: "#22d3ee",
};

// which module blocks light up for a given active section
const LIGHT = {
  inlet: ["inlet"], fan: ["fan"], compressors: ["lpc", "hpc"],
  combustor: ["comb"], turbines: ["hpt", "lpt"], afterburner: ["ab"], nozzle: ["noz"],
  all: ["inlet", "fan", "lpc", "hpc", "comb", "hpt", "lpt", "ab", "noz"],
};
// which station numbers belong to each section
const SEC_STATIONS = {
  inlet: ["0", "1", "2"], fan: ["2"], compressors: ["2", "2.5", "3"],
  combustor: ["3", "4"], turbines: ["4", "4.5", "5"], afterburner: ["5", "6", "7"],
  nozzle: ["7", "8", "9"],
  all: ["0", "1", "2", "2.5", "3", "4", "4.5", "5", "6", "7", "8", "9"],
};
// translucent zone band x-range
const ZONE = {
  inlet: [122, 214], fan: [194, 236], compressors: [240, 396],
  combustor: [400, 478], turbines: [478, 602], afterburner: [608, 724], nozzle: [726, 864],
};
const ACCENT = {
  inlet: "#00d4ff", fan: "#38bdf8", compressors: "#a8ff3e", combustor: "#ff6b35",
  turbines: "#ffb000", afterburner: "#ff4d4d", nozzle: "#22d3ee", all: "#8b949e",
};
const MOD_LABELS = [
  ["Inlet", 168, "inlet"], ["Fan", 214, "fan"], ["LPC", 270, "compressors"],
  ["HPC", 350, "compressors"], ["Burner", 440, "combustor"], ["HPT", 506, "turbines"],
  ["LPT", 566, "turbines"], ["A/B", 668, "afterburner"], ["Nozzle", 793, "nozzle"],
];

// A row of compressor/turbine blades (a stack of stages drawn from the side)
function BladeRow({ cx, count, gap, half, color, opacity }) {
  const start = cx - ((count - 1) * gap) / 2;
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const x = start + i * gap;
        return (
          <line key={i} x1={x} y1={165 - half} x2={x + 3} y2={165 + half}
            stroke={color} strokeWidth={3} strokeLinecap="round" opacity={opacity} />
        );
      })}
    </g>
  );
}

function EngineSchematic({ active = "all" }) {
  const lights = LIGHT[active] || [];
  const lit = (k) => lights.includes(k);
  const mc = (k) => (lit(k) ? MOD[k] : "#3b434d");
  const mo = (k) => (lit(k) ? 1 : 0.5);
  const acc = ACCENT[active] || "#30363d";
  const onStations = SEC_STATIONS[active] || [];
  const zone = ZONE[active];
  const lpOn = ["fan", "compressors", "turbines", "all"].includes(active);
  const hpOn = ["compressors", "turbines", "all"].includes(active);
  const flames = (k) => lit(k) || active === "all";

  return (
    <svg viewBox="0 0 940 268" style={{ width: "100%", height: "auto", display: "block" }}>
      <defs>
        <marker id="ar-cyan" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#5fb3d9" /></marker>
        <marker id="ar-red" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#ff6b35" /></marker>
        <marker id="ar-sky" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#38bdf8" /></marker>
      </defs>

      {/* nacelle, core, spinner, shafts */}
      <path d={NACELLE_D} fill="#0c1117" stroke="#39424c" strokeWidth={2} />
      <line x1={150} y1={165} x2={866} y2={165} stroke="#2a313a" strokeWidth={1} strokeDasharray="5 6" />
      <rect x={205} y={142} width={401} height={46} rx={14} fill="#0d1117" stroke="#262d36" />
      <polygon points="176,165 210,146 210,184" fill="#2b333d" stroke="#454d57" strokeWidth={1} />
      <line x1={210} y1={165} x2={579} y2={165} stroke={lpOn ? "#5fb3d9" : "#39424c"} strokeWidth={1.6} />
      <line x1={350} y1={165} x2={506} y2={165} stroke={hpOn ? "#caa14a" : "#454d57"} strokeWidth={3.4} strokeLinecap="round" />

      {/* zone highlight (over the structure, under the crisp blades) */}
      {zone && <rect x={zone[0]} y={70} width={zone[1] - zone[0]} height={152} fill={acc} opacity={0.10} rx={6} />}
      {zone && <line x1={zone[0]} y1={67} x2={zone[1]} y2={67} stroke={acc} strokeWidth={1} opacity={0.5} />}
      {zone && <line x1={zone[0]} y1={223} x2={zone[1]} y2={223} stroke={acc} strokeWidth={1} opacity={0.5} />}

      {/* inlet cowl gets traced when it's the subject */}
      {active === "inlet" && <path d="M122,108 L160,92 L214,84" fill="none" stroke={MOD.inlet} strokeWidth={2.5} />}
      {active === "inlet" && <path d="M122,222 L160,238 L214,246" fill="none" stroke={MOD.inlet} strokeWidth={2.5} />}

      {/* fan + bypass flow */}
      <BladeRow cx={214} count={2} gap={9} half={70} color={mc("fan")} opacity={mo("fan")} />
      <circle cx={214} cy={165} r={8} fill="#2b333d" stroke={mc("fan")} strokeWidth={1.4} />
      {(active === "fan" || active === "all") && (
        <g>
          <line x1={244} y1={112} x2={540} y2={108} stroke="#38bdf8" strokeWidth={1.6} opacity={0.6} markerEnd="url(#ar-sky)" />
          <line x1={244} y1={220} x2={540} y2={224} stroke="#38bdf8" strokeWidth={1.6} opacity={0.6} markerEnd="url(#ar-sky)" />
        </g>
      )}

      {/* compressors */}
      <BladeRow cx={270} count={3} gap={12} half={24} color={mc("lpc")} opacity={mo("lpc")} />
      <BladeRow cx={350} count={6} gap={11} half={20} color={mc("hpc")} opacity={mo("hpc")} />

      {/* combustor (annular liner with a flame core) */}
      <rect x={404} y={143} width={72} height={16} rx={7} fill={lit("comb") ? "#2a160d" : "#0d1117"} stroke={mc("comb")} strokeWidth={1.6} />
      <rect x={404} y={171} width={72} height={16} rx={7} fill={lit("comb") ? "#2a160d" : "#0d1117"} stroke={mc("comb")} strokeWidth={1.6} />
      {flames("comb") && [416, 432, 448, 464].map((x, i) => (
        <ellipse key={i} cx={x} cy={165} rx={3.5} ry={7} fill="#ff8c42" opacity={0.85} />
      ))}

      {/* turbines */}
      <BladeRow cx={506} count={2} gap={12} half={20} color={mc("hpt")} opacity={mo("hpt")} />
      <BladeRow cx={566} count={3} gap={13} half={26} color={mc("lpt")} opacity={mo("lpt")} />

      {/* afterburner: flameholder at station 6 + reheat flames */}
      <line x1={668} y1={150} x2={668} y2={180} stroke={mc("ab")} strokeWidth={3} strokeLinecap="round" />
      <line x1={668} y1={156} x2={659} y2={150} stroke={mc("ab")} strokeWidth={2} />
      <line x1={668} y1={174} x2={659} y2={180} stroke={mc("ab")} strokeWidth={2} />
      {flames("ab") && [682, 697, 712].map((x, i) => (
        <ellipse key={i} cx={x} cy={165} rx={4} ry={8} fill="#ff6b4d" opacity={0.8} />
      ))}

      {/* nozzle inner contour (converging to the throat at 8) */}
      <path d="M726,140 L792,150 L858,146" fill="none" stroke={mc("noz")} strokeWidth={2} />
      <path d="M726,190 L792,180 L858,184" fill="none" stroke={mc("noz")} strokeWidth={2} />

      {/* intake + exhaust flow */}
      <line x1={40} y1={165} x2={108} y2={165} stroke="#5fb3d9" strokeWidth={2.4} markerEnd="url(#ar-cyan)" />
      <text x={44} y={156} fill="#5fb3d9" fontSize={13} fontFamily="'DM Mono', monospace">ṁ₀</text>
      {[148, 165, 182].map((y, i) => (
        <line key={i} x1={868} y1={y} x2={920} y2={y} stroke="#ff6b35" strokeWidth={2.4} markerEnd="url(#ar-red)" />
      ))}
      <text x={874} y={138} fill="#ff6b35" fontSize={13} fontFamily="'DM Mono', monospace">V₉</text>

      {/* station ticks + circled numbers */}
      {STATIONS_SVG.map(([id, x, yt, half]) => {
        const on = onStations.includes(id);
        return (
          <g key={id}>
            <line x1={x} y1={34} x2={x} y2={yt} stroke={on ? acc : "#2a313a"} strokeWidth={1} strokeDasharray="3 4" />
            <circle cx={x} cy={22} r={half ? 9 : 11} fill={on ? acc : "#0d1117"} stroke={on ? acc : "#39424c"} strokeWidth={1.4} />
            <text x={x} y={26} textAnchor="middle" fontSize={half ? 9 : 11} fontFamily="'DM Mono', monospace" fill={on ? "#06121a" : "#8b949e"}>{id}</text>
          </g>
        );
      })}

      {/* module name labels */}
      {MOD_LABELS.map(([name, cx, section]) => {
        const on = active === section || active === "all";
        return (
          <text key={name + cx} x={cx} y={259} textAnchor="middle" fontSize={10}
            fontFamily="'DM Mono', monospace" fill={on ? ACCENT[section] : "#5b636d"}
            fontWeight={on ? 700 : 400}>{name}</text>
        );
      })}
    </svg>
  );
}

// ── Station reference (matches the textbook Fig. 3.1 + Unit 5 notes) ────────
const stations = [
  { n: "0", name: "Freestream", desc: "Undisturbed air far ahead of the engine" },
  { n: "1", name: "Inlet lip", desc: "Nacelle leading edge / inlet entrance" },
  { n: "2", name: "Fan / comp. face", desc: "Exit of intake → inlet of fan or compressor" },
  { n: "2.5", name: "LPC exit", desc: "Exit of low-pressure compressor → HPC inlet" },
  { n: "3", name: "HPC exit", desc: "Exit of high-pressure compressor → burner inlet" },
  { n: "4", name: "Burner exit", desc: "Exit of combustor → high-pressure turbine inlet" },
  { n: "4.5", name: "HPT exit", desc: "Exit of HPT → low-pressure turbine inlet" },
  { n: "5", name: "LPT exit", desc: "Exit of LPT → inlet to afterburner" },
  { n: "6", name: "Afterburner", desc: "Afterburner combustor / flameholder" },
  { n: "7", name: "Nozzle inlet", desc: "Inlet to the exhaust nozzle" },
  { n: "8", name: "Throat", desc: "Minimum-area throat of the nozzle" },
  { n: "9", name: "Nozzle exit", desc: "Exit plane of the nozzle" },
];

// ── Slides ─────────────────────────────────────────────────────────────────
const slides = [
  {
    type: "title",
    tag: "ME 3470 · Unit 5 — Airbreathing Engines",
    title: "Anatomy of a\nTurbofan Engine",
    subtitle: "Component purpose · station-numbered 0 → 9",
  },
  { type: "stationMap" },
  {
    type: "component", section: "inlet", accent: "#00d4ff",
    eyebrow: "Stations 0 → 2",
    title: "Inlet & Diffuser",
    stationsCaption: "Freestream (0) · inlet lip (1) · fan face (2)",
    purpose: "Capture the oncoming air and slow it down — trading speed for a rise in static pressure — then hand the fan a smooth, even stream to work with.",
    cards: [
      { label: "Slow & recover pressure", body: "The duct acts as a diffuser: it converts the air's velocity into higher static pressure, so the fan and compressor start from a stronger state." },
      { label: "Feed the fan cleanly", body: "It smooths swirl and distortion. Uneven flow into the compressor can trigger stall, so a uniform profile at station 2 matters as much as pressure." },
      { label: "Match the flight speed", body: "Subsonic flight needs only a simple duct; supersonic flight uses inlet shaping and shock waves to slow the flow to subsonic before the fan." },
    ],
  },
  {
    type: "component", section: "fan", accent: "#38bdf8",
    eyebrow: "Station 2 · bypass stream",
    title: "The Fan",
    stationsCaption: "Sits at the compressor face (2) and splits core from bypass",
    purpose: "Move a large mass of air through the bypass duct to make most of the engine's thrust — and do it efficiently by giving a lot of air a small push instead of a little air a huge one.",
    cards: [
      { label: "Most of the thrust", body: "In a high-bypass turbofan the ducted bypass air produces roughly 80% of total thrust; the core mainly exists to drive the fan." },
      { label: "Propulsive efficiency", body: "Accelerating a big mass of air gently is quieter and burns less fuel than the high-velocity jet of a pure turbojet." },
      { label: "Splits the flow", body: "Air divides into a core stream (compressed, burned, expanded) and a bypass stream ducted straight to the rear. The fan rides on the LP shaft." },
    ],
  },
  {
    type: "component", section: "compressors", accent: "#a8ff3e",
    eyebrow: "Stations 2 → 3",
    title: "LPC + HPC",
    stationsCaption: "LPC exit (2.5) · HPC exit / burner inlet (3)",
    purpose: "Squeeze the core air up to the cycle's peak pressure before combustion. A high pressure ratio is what makes the engine efficient and lets the burner add heat effectively.",
    cards: [
      { label: "Stage by stage", body: "Each rotor-plus-stator stage adds a small pressure rise; stacking many stages builds a large overall pressure ratio (OPR)." },
      { label: "Two spools", body: "The LPC (2→2.5) rides the LP shaft with the fan; the HPC (2.5→3) rides the HP shaft — so each can spin at its own best speed." },
      { label: "Sets efficiency", body: "Higher OPR raises thermal efficiency, but compression also heats the air, which limits how far it can practically be pushed." },
    ],
  },
  {
    type: "component", section: "combustor", accent: "#ff6b35",
    eyebrow: "Stations 3 → 4",
    title: "Combustor (Burner)",
    stationsCaption: "Burner inlet (3) · burner exit / HPT inlet (4)",
    purpose: "Add energy. Fuel burns continuously at nearly constant pressure, raising the gas to the cycle's maximum temperature T₄ — the heat input the turbines and nozzle later turn into work and thrust.",
    cards: [
      { label: "Chemical → thermal", body: "Fuel sprayed into the high-pressure air burns continuously, dumping heat into the flow at roughly constant pressure." },
      { label: "Hold a stable flame", body: "A recirculating primary zone anchors the flame in fast-moving air; dilution air downstream then tailors the exit temperature." },
      { label: "Capped by materials", body: "Peak temperature T₄ is limited by what the first turbine stage can survive, so the burner is designed to control — not maximize — exit temperature." },
    ],
  },
  {
    type: "component", section: "turbines", accent: "#ffb000",
    eyebrow: "Stations 4 → 5",
    title: "HPT + LPT",
    stationsCaption: "HPT exit (4.5) · LPT exit / afterburner inlet (5)",
    purpose: "Extract work from the hot gas to drive the compressors and fan. The turbines power the rest of the engine; whatever energy they leave behind is what the nozzle uses to make the jet.",
    cards: [
      { label: "HPT drives the HPC", body: "Stations 4→4.5. It sits in the hottest gas right behind the burner, so its blades are internally cooled and coated. HP shaft." },
      { label: "LPT drives the fan & LPC", body: "Stations 4.5→5. More and larger stages as the gas expands and cools. LP shaft." },
      { label: "Take only what's needed", body: "Turbines extract just enough work to run the compressors and fan; the leftover pressure and heat pass to the nozzle." },
    ],
  },
  {
    type: "component", section: "afterburner", accent: "#ff4d4d",
    eyebrow: "Stations 5 → 7",
    title: "Afterburner (Reheat)",
    stationsCaption: "Afterburner inlet (5) · flameholder (6) · nozzle inlet (7)",
    purpose: "Burn extra fuel in the turbine exhaust to spike thrust on demand. The exhaust still carries unused oxygen, so reigniting it raises exhaust temperature and velocity without needing a bigger core.",
    cards: [
      { label: "Thrust on demand", body: "Provides a large, brief thrust boost for takeoff or supersonic dash — only on engines built for it, not the basic turbofan." },
      { label: "Flameholders", body: "At station 6, bluff-body holders create sheltered low-speed wakes that anchor the flame in the fast-moving gas." },
      { label: "A costly boost", body: "The extra thrust comes with a steep jump in fuel burn, so the afterburner is used only in short bursts." },
    ],
  },
  {
    type: "component", section: "nozzle", accent: "#22d3ee",
    eyebrow: "Stations 7 → 9",
    title: "Exhaust Nozzle",
    stationsCaption: "Nozzle inlet (7) · throat (8) · exit (9)",
    purpose: "Turn the leftover pressure and heat into a high-speed exhaust jet. The momentum of that jet leaving at station 9 is what the airframe feels as thrust.",
    cards: [
      { label: "Accelerate the exhaust", body: "A converging passage speeds the gas up; the throat at station 8 is where the flow can reach the speed of sound (Mach 1)." },
      { label: "Set the exit state", body: "The exit area at station 9 fixes the exhaust velocity and how closely exit pressure matches the surrounding air." },
      { label: "Shaped to the speed", body: "Convergent nozzles suit subsonic exhaust; convergent–divergent nozzles (throat 8 → exit 9) accelerate the gas to supersonic." },
    ],
  },
  { type: "synthesis" },
];

// ── Small shared bits ───────────────────────────────────────────────────────
function Eyebrow({ children, color }) {
  return (
    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color, letterSpacing: 2, textTransform: "uppercase", margin: 0 }}>{children}</p>
  );
}
function Heading({ children }) {
  return (
    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#f0f6fc", margin: "0 0 4px 0", lineHeight: 1.1 }}>{children}</h2>
  );
}

// ── Slide renderer ──────────────────────────────────────────────────────────
function SlideContent({ slide }) {
  switch (slide.type) {
    case "title":
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: 18 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: 4, color: "#ff6b35", textTransform: "uppercase" }}>{slide.tag}</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: "clamp(40px, 6vw, 68px)",
            fontWeight: 900, lineHeight: 1.08, color: "#f0f6fc", whiteSpace: "pre-line", margin: 0,
            textShadow: "0 0 60px rgba(255,107,53,0.28)",
          }}>{slide.title}</h1>
          <div style={{ width: 90, height: 3, background: "linear-gradient(90deg, #00d4ff, #ff6b35)", borderRadius: 2, margin: "4px 0" }} />
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: "#8b949e", letterSpacing: 2, margin: 0 }}>{slide.subtitle}</p>
          <div style={{ width: "100%", maxWidth: 640, marginTop: 14, opacity: 0.96 }}>
            <EngineSchematic active="all" />
          </div>
        </div>
      );

    case "stationMap":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%" }}>
          <div>
            <Heading>Station Numbers, 0 → 9</Heading>
            <Eyebrow color="#00d4ff">The reference frame for every component</Eyebrow>
          </div>
          <EngineSchematic active="all" />
          <p style={{ color: "#8b949e", fontSize: 12.5, lineHeight: 1.55, margin: 0 }}>
            Numbering follows the afterburning-turbojet convention from the textbook (Fig. 3.1) and the Unit 5 notes.
            Modules are color-coded by what they do to the flow: <span style={{ color: "#00d4ff" }}>intake</span> →
            <span style={{ color: "#a8ff3e" }}> compression</span> → <span style={{ color: "#ff6b35" }}>combustion</span> →
            <span style={{ color: "#ffb000" }}> expansion</span> → <span style={{ color: "#22d3ee" }}>exhaust</span>.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {stations.map((s) => (
              <div key={s.n} style={{ display: "flex", gap: 9, alignItems: "flex-start", background: "#0d1117", border: "1px solid #21262d", borderRadius: 8, padding: "7px 9px" }}>
                <span style={{ minWidth: 26, height: 22, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Mono', monospace", fontSize: 11, background: "#161b22", color: "#c9d1d9", border: "1px solid #30363d", flexShrink: 0 }}>{s.n}</span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: "#f0f6fc", fontSize: 11.5, fontWeight: 600 }}>{s.name}</div>
                  <div style={{ color: "#8b949e", fontSize: 10, lineHeight: 1.35 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "component":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 13, width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 8 }}>
            <div>
              <Eyebrow color={slide.accent}>{slide.eyebrow}</Eyebrow>
              <Heading>{slide.title}</Heading>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, color: "#8b949e", letterSpacing: 0.5, textAlign: "right", maxWidth: 300 }}>{slide.stationsCaption}</div>
          </div>

          <EngineSchematic active={slide.section} />

          <div style={{ background: "#0d1117", borderRadius: 10, padding: "13px 18px", borderLeft: `3px solid ${slide.accent}` }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: slide.accent, marginBottom: 5 }}>Purpose</div>
            <p style={{ color: "#e6edf3", fontSize: 14.5, lineHeight: 1.55, margin: 0 }}>{slide.purpose}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {slide.cards.map((c) => (
              <div key={c.label} style={{ background: "#0d1117", border: `1px solid ${slide.accent}22`, borderRadius: 10, padding: "11px 13px" }}>
                <div style={{ color: slide.accent, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4, lineHeight: 1.3 }}>{c.label}</div>
                <div style={{ color: "#8b949e", fontSize: 11.5, lineHeight: 1.5 }}>{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "synthesis":
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 15, width: "100%" }}>
          <div>
            <Eyebrow color="#ff6b35">Stations 0 → 9, together</Eyebrow>
            <Heading>How the Pieces Make Thrust</Heading>
          </div>
          <p style={{ color: "#8b949e", fontSize: 13.5, lineHeight: 1.55, margin: 0 }}>
            Every component upstream exists to set up one quantity — the change in momentum of the flow between the freestream and the exhaust:
          </p>

          {/* Thrust equation */}
          <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 12, padding: "18px 16px", textAlign: "center" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "clamp(15px, 2.6vw, 23px)", color: "#f0f6fc", lineHeight: 1.4, letterSpacing: 0.5 }}>
              F<sub>n</sub> ={" "}
              <span style={{ color: "#a8ff3e" }}>(ṁ<sub>0</sub> + ṁ<sub>f</sub>)·V<sub>9</sub></span>{" "}
              <span style={{ color: "#00d4ff" }}>− ṁ<sub>0</sub>·V<sub>0</sub></span>{" "}
              <span style={{ color: "#ff6b35" }}>+ (p<sub>9</sub> − p<sub>0</sub>)·A<sub>9</sub></span>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#555", letterSpacing: 1, marginTop: 8, textTransform: "uppercase" }}>
              uninstalled net thrust · momentum equation
            </div>
          </div>

          {/* Three terms */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { term: "(ṁ₀+ṁ_f)·V₉", label: "Exhaust momentum", c: "#a8ff3e", body: "All mass leaving — incoming air plus burned fuel — carried out at exit velocity V₉ (station 9)." },
              { term: "− ṁ₀·V₀", label: "Inlet momentum", c: "#00d4ff", body: "Subtract the momentum the air already had as it entered, at the freestream (station 0)." },
              { term: "(p₉−p₀)·A₉", label: "Pressure–area", c: "#ff6b35", body: "Extra force when nozzle-exit pressure doesn't match ambient, over the exit area at station 9." },
            ].map((t) => (
              <div key={t.label} style={{ background: "#0d1117", border: `1px solid ${t.c}22`, borderRadius: 10, padding: "11px 13px" }}>
                <div style={{ color: t.c, fontFamily: "'DM Mono', monospace", fontSize: 12.5, marginBottom: 5 }}>{t.term}</div>
                <div style={{ color: t.c, fontFamily: "'DM Mono', monospace", fontSize: 9.5, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{t.label}</div>
                <div style={{ color: "#8b949e", fontSize: 11, lineHeight: 1.45 }}>{t.body}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#0d1117", borderRadius: 8, padding: "12px 16px", borderLeft: "3px solid #ffb000" }}>
            <p style={{ color: "#8b949e", fontSize: 12.5, margin: 0, lineHeight: 1.6 }}>
              <span style={{ color: "#f0f6fc" }}>Two spools</span> — the HP spool (HPC ↔ HPT) and LP spool (fan/LPC ↔ LPT) — let each compressor–turbine pair turn at its own optimum speed.
              Thermodynamically it is a <span style={{ color: "#f0f6fc" }}>Brayton cycle</span>: compress (0→3), burn (3→4), expand through the turbines (4→5) and the nozzle (7→9).
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ── Deck shell ───────────────────────────────────────────────────────────────
export default function JetEngineComponents() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [dir, setDir] = useState(1);
  const total = slides.length;

  const goTo = (idx) => {
    if (idx < 0 || idx >= total) return;
    setDir(idx > current ? 1 : -1);
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
      backgroundImage: "radial-gradient(ellipse at 18% 8%, #00d4ff0d 0%, transparent 55%), radial-gradient(ellipse at 85% 92%, #ff6b3510 0%, transparent 52%)",
    }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Mono:wght@300;400;500&display=swap" />

      <div style={{
        width: "100%", maxWidth: 860,
        background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
        border: "1px solid #21262d", borderRadius: 16, padding: "30px 34px",
        minHeight: 540, display: "flex", flexDirection: "column", justifyContent: "flex-start",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px #30363d22",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : `translateY(${dir * 12}px)`,
        transition: "opacity 0.16s ease, transform 0.16s ease",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03, pointerEvents: "none",
          backgroundImage: "linear-gradient(#f0f6fc 1px, transparent 1px), linear-gradient(90deg, #f0f6fc 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }} />
        <SlideContent slide={slides[current]} />
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 18 }}>
        <button onClick={() => goTo(current - 1)} disabled={current === 0} style={{
          background: "transparent", border: "1px solid #30363d", color: current === 0 ? "#30363d" : "#8b949e",
          width: 40, height: 40, borderRadius: "50%", cursor: current === 0 ? "default" : "pointer",
          fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
        }}>←</button>

        <div style={{ display: "flex", gap: 6 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: i === current ? 20 : 8, height: 8, borderRadius: 4, border: "none",
              background: i === current ? "#ff6b35" : "#30363d", cursor: "pointer", transition: "all 0.3s", padding: 0,
            }} />
          ))}
        </div>

        <button onClick={() => goTo(current + 1)} disabled={current === total - 1} style={{
          background: "transparent", border: "1px solid #30363d", color: current === total - 1 ? "#30363d" : "#8b949e",
          width: 40, height: 40, borderRadius: "50%", cursor: current === total - 1 ? "default" : "pointer",
          fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
        }}>→</button>
      </div>

      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#30363d", marginTop: 10, letterSpacing: 1 }}>
        {current + 1} / {total} · arrow keys to navigate
      </p>
    </div>
  );
}
