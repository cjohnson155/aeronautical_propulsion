// ME 3470 · Unit 2 — Summary — Key Equations
// Slide DATA only. Rendered by ../engine.jsx; assembled in ./index.js.
// Renumbered 06 -> 07 so it does not collide with 06-stagnation.js; placed last.
// Two reference slides, notation matched to their home sections:
//   I)  Differential relations — sound, compressibility, Gibbs   (lowercase p, as in §1–2, §4–5)
//   II) Process relations — isentropic change + stagnation set    (capital P, matching §6)

export const summarySlides = [
  // ── SUMMARY I: DIFFERENTIAL RELATIONS (SOUND · COMPRESSIBILITY · GIBBS) ──────
  {
    type: 'equation',
    heading: 'Summary I — Speed of Sound, Compressibility &amp; Gibbs',
    equationLabel:
      'The differential relations — how the gas responds to a change <em>at a point</em>. '
      + 'The constant-<em>s</em> (isentropic) response is what sets the sound speed.',
    equation:
      '\\begin{aligned} '
      + 'a &= \\sqrt{\\left(\\frac{\\partial p}{\\partial \\rho}\\right)_s} '
      + '= \\sqrt{\\gamma R T} = \\sqrt{\\frac{\\gamma p}{\\rho}} '
      + '\\qquad M = \\frac{V}{a} \\\\ '
      + '\\tau &= \\frac{1}{\\rho}\\frac{d\\rho}{dp} '
      + '\\qquad \\tau_T = \\frac{1}{p} '
      + '\\qquad \\tau_s = \\frac{1}{\\gamma p} = \\frac{1}{\\rho a^2} \\\\ '
      + 'ds &= c_v\\,\\frac{dT}{T} + R\\,\\frac{dv}{v} '
      + '= c_p\\,\\frac{dT}{T} - R\\,\\frac{dp}{p} '
      + '\\end{aligned}',
    terms: [
      { symbol: 'a = √(γRT)', definition: 'Speed of sound (m/s) — how fast pressure information travels through the gas' },
      { symbol: 'M = V/a', definition: 'Mach number — bulk flow speed relative to the local sound speed' },
      { symbol: 'γ = 1.4', definition: 'Ratio of specific heats c<sub>p</sub>/c<sub>v</sub> (air)' },
      { symbol: 'R = 287 J/kg·K', definition: 'Specific gas constant for air (ℜ/MW)' },
      { symbol: 'τ = (1/ρ)(dρ/dp)', definition: 'Compressibility — fractional density change per unit pressure rise (Pa⁻¹)' },
      { symbol: 'τ<sub>T</sub> = 1/p', definition: 'Isothermal compressibility — slow squeeze, constant T (as in §2)' },
      { symbol: 'τ<sub>s</sub> = 1/(γp)', definition: 'Isentropic compressibility — fast squeeze, constant s' },
      { symbol: 'ds', definition: 'Specific entropy change — the two Gibbs forms (constant-v and constant-p paths, §4)' },
    ],
    items: [
      {
        title: 'Sound speed tracks temperature — not flow speed',
        body: 'a = √(γRT) depends only on T, which sets the random thermal motion — it is independent of how fast the bulk flow moves. '
          + 'Molecular weight enters only through R = ℜ/MW, so lighter gases (helium) carry sound much faster.',
      },
      {
        title: 'One condition ties these together: constant entropy',
        body: 'The Gibbs equation defines ds. Setting <strong>ds = 0</strong> (isentropic) gives the mechanical response the other two describe: '
          + 'a² = 1/(ρτ<sub>s</sub>) = γp/ρ = γRT, and τ<sub>s</sub> = τ<sub>T</sub>/γ. '
          + 'A gas resists a <em>fast</em> (isentropic) squeeze by the factor γ more than a <em>slow</em> (isothermal) one.',
      },
    ],
  },

  // ── SUMMARY II: PROCESS RELATIONS (ISENTROPIC · STAGNATION) ──────────────────
  {
    type: 'equation',
    heading: 'Summary II — Isentropic Process &amp; Stagnation Relations',
    equationLabel:
      'Finite isentropic changes and total (stagnation) conditions — all driven by the same Mach factor. '
      + 'Pressure is capital P here, matching §6.',
    equation:
      '\\begin{aligned} '
      + '\\frac{P_2}{P_1} &= \\left(\\frac{\\rho_2}{\\rho_1}\\right)^{\\gamma} '
      + '= \\left(\\frac{T_2}{T_1}\\right)^{\\frac{\\gamma}{\\gamma-1}} \\\\ '
      + '\\frac{T_0}{T} &= 1 + \\frac{\\gamma-1}{2}M^2 '
      + '\\qquad h_0 = h + \\frac{V^2}{2} \\\\ '
      + '\\frac{P_0}{P} &= \\left(1 + \\frac{\\gamma-1}{2}M^2\\right)^{\\frac{\\gamma}{\\gamma-1}} '
      + '\\qquad \\frac{\\rho_0}{\\rho} = \\left(1 + \\frac{\\gamma-1}{2}M^2\\right)^{\\frac{1}{\\gamma-1}} '
      + '\\end{aligned}',
    terms: [
      { symbol: 'subscript 0', definition: 'Stagnation (total) state — flow slowed adiabatically to V → 0 (subscript t in Fanno notation)' },
      { symbol: 'T<sub>0</sub>/T', definition: 'Temperature ratio — needs only <strong>adiabatic</strong> flow' },
      { symbol: 'P<sub>0</sub>/P, ρ<sub>0</sub>/ρ', definition: 'Pressure &amp; density ratios — need <strong>isentropic</strong> flow (adiabatic + reversible)' },
      { symbol: 'h<sub>0</sub> = h + V²/2', definition: 'Stagnation enthalpy — straight from the energy equation' },
      { symbol: 'M = V/a', definition: 'Mach number — the single factor that sets every stagnation ratio' },
      { symbol: 'γ = 1.4', definition: 'Ratio of specific heats (air)' },
      { symbol: 'P₂/P₁ = (ρ₂/ρ₁)ᵞ', definition: 'Isentropic relation linking any two states — the parent of the stagnation set' },
    ],
    items: [
      {
        title: 'Isentropic relations = the Gibbs equation with ds = 0',
        body: 'Set ds = 0 in the Gibbs forms (Summary I) and integrate to get P₂/P₁ = (ρ₂/ρ₁)<sup>γ</sup> = (T₂/T₁)<sup>γ/(γ−1)</sup> '
          + '— equivalently T<sub>0</sub>/T<sub>1</sub> = (P<sub>0</sub>/P<sub>1</sub>)<sup>(γ−1)/γ</sup>, the form shown in §6. '
          + 'The stagnation set is just this relation applied between the static state and the brought-to-rest state.',
      },
      {
        title: 'Which total properties survive a shock?',
        body: 'T<sub>0</sub> needs only adiabatic flow, so it is <strong>conserved through a shock</strong>. '
          + 'P<sub>0</sub> and ρ<sub>0</sub> need reversibility — a shock adds entropy (Δs &gt; 0), so <strong>P<sub>0</sub> drops</strong> while T<sub>0</sub> holds. '
          + 'Same distinction as the §6 worked cases.',
      },
    ],
  },
]
