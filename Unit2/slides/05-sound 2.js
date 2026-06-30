// ME 3470 . Unit 2 - Section 5 - Speed of Sound, Mach & Shocks
// Slide DATA only. Rendered by ../engine.jsx; assembled in ./index.js.

export const soundSlides = [


  // ── NEW · SECTION 5: SPEED OF SOUND ─────────────────────────────────────────
  {
    type: 'soundspeed',
    sectionNumber: 'Section 5 — Speed of Sound',
    heading: 'How the Gas Talks to Itself',
    intro:
      'How does one part of the gas know what is happening elsewhere? Information travels by <strong>collisions</strong>. A pressure wave is an infinitesimal compression then expansion — a <em>sound wave</em>. The wave itself is the pattern; collisions are the medium.',
    equation: 'a = \\sqrt{\\left(\\frac{\\partial p}{\\partial \\rho}\\right)_s} \\;=\\; \\sqrt{\\gamma R T}',
    equationLabel: 'Sound travels at the average molecular speed',
    terms: [
      { sym: 'a',        def: 'Speed at which mechanical information propagates' },
      { sym: '\\gamma',  def: 'How temperature is stored — bonds vs. translation' },
      { sym: 'R = \\tfrac{\\mathcal{R}}{MW}', def: 'Gas “size”: bigger, heavier molecules → slower sound' },
      { sym: 'T',        def: 'How fast the molecules’ random motion is' },
    ],
    cards: [
      { k: 'It depends on T, not bulk velocity', v: 'Random thermal motion is set by temperature, so a depends on T — independent of how fast the flow as a whole is moving.' },
      { k: 'γ can match across weights',          v: 'Diatomic molecules of different mass can share the same γ; molecular weight enters only through R.' },
    ],
    bridge:
      'So <strong>a</strong> sets the speed limit for “get out of the way” messages. What happens when the flow outruns that limit?',
  },


  // ── THINK · PAIR · SHARE: Speed of sound prediction ─────────────────────────
  {
    type: 'tps',
    sectionNumber: 'Section 5 — Think \u00b7 Pair \u00b7 Share',
    question:
      'The reservoir air has been heated to <strong>T = 600 K</strong>. '
      + 'Using a = \u221a(\u03b3RT), predict the speed of sound in the air. '
      + 'Then predict a if the reservoir held <strong>helium</strong> at 600 K '
      + '(\u03b3<sub>He</sub> = 5/3, R<sub>He</sub> = 2077 J/kg\u00b7K). '
      + 'Which is faster, and by roughly how much?',
    think: { minutes: 3, prompt: 'Set up both calculations individually. Estimate before you compute — which gas do you expect to be faster, and why?' },
    pair:  { minutes: 3, prompt: 'Compare estimates and calculations. Can you separate the two contributions to the He speedup — the larger \u03b3 vs the much larger R?' },
    share: { prompt: 'Report back. What is the speedup factor? How much comes from \u03b3 alone vs R alone?' },
    answer: 'a_{\\text{air}} = \\sqrt{1.4 \\times 287 \\times 600} = 491\\;\\text{m/s} \\qquad a_{\\text{He}} = \\sqrt{\\tfrac{5}{3} \\times 2077 \\times 600} = 1442\\;\\text{m/s}',
    answerNote: 'He is ~3\u00d7 faster. \u03b3 effect alone: \u221a(5/3 \u00f7 1.4) \u2248 1.09\u00d7. R effect alone: \u221a(2077 \u00f7 287) \u2248 2.69\u00d7. Almost all of the speedup is molecular weight, not \u03b3.',
  },

  // ── WORKED EXAMPLE: ACOUSTIC TRAVERSE (Anderson MCF Ex. 2 — Parts e, f) ─────
  {
    type: 'example',
    sectionNumber: 'Section 5 — Worked Example',
    heading: 'Acoustic Traverse: Air vs. Helium',
    scenario:
      'The vessel (V = 10 m³) has been heated to <strong>T = 600 K.</strong> '
      + 'Assume spherical geometry. How long does an acoustic wave take to cross it? '
      + 'How does helium compare to air at the same conditions?',
    steps: [
      {
        label: 'Find vessel diameter (spherical)',
        eq: 'V = \\tfrac{4}{3}\\pi r^3 '
          + '\\;\\Rightarrow\\; r = \\!\\left(\\frac{3V}{4\\pi}\\right)^{\\!1/3} '
          + '= \\!\\left(\\frac{30}{4\\pi}\\right)^{\\!1/3} = 1.337\\;\\mathrm{m}',
        result: 'D = 2r = 2.673\\;\\mathrm{m}',
        revealResult: true,
        question: 'The geometry affects the distance, not the wave speed. '
          + 'Would a cylindrical vessel of the same volume give a longer or shorter traverse?',
      },
      {
        label: 'Speed of sound in air at 600 K',
        eq: 'a = \\sqrt{\\gamma RT} = \\sqrt{(1.4)(287)(600)}',
        result: 'a_{\\text{air}} = 491.0\\;\\mathrm{m/s}',
        revealResult: true,
        question: 'At 300 K: a ≈ 347 m/s. The ratio 491/347 ≈ √2. Why? (a ∝ √T)',
      },
      {
        label: 'Traverse time for air',
        eq: 't = \\frac{D}{a} = \\frac{2.673}{491.0}',
        result: 't_{\\text{air}} = 5.44\\times 10^{-3}\\;\\mathrm{s}',
        revealResult: true,
      },
      {
        label: 'Helium at same T — higher γ, much larger R',
        eq: 'R_{\\text{He}} = \\frac{8314}{4} = 2078.5\\;\\mathrm{J/(kg\\cdot K)}, '
          + '\\quad \\gamma_{\\text{He}} = \\tfrac{5}{3} = 1.667',
        note: 'a<sub>He</sub> = &radic;(1.667 &times; 2078.5 &times; 600) = 1442 m/s'
          + '&emsp;&rarr;&emsp;t<sub>He</sub> = 2.673 / 1442',
        result: 't_{\\text{He}} = 1.85\\times 10^{-3}\\;\\mathrm{s}',
        revealResult: true,
        question: 'Helium is ~3× faster. Separate the two effects: '
          + 'what fraction of the speedup comes from the larger R, and what from the larger γ?',
      },
    ],
  },

  // ── STOP AND SOLVE: Mach number in the test section ─────────────────────────
  {
    type: 'example',
    sectionNumber: 'Section 5 — Stop and Solve',
    heading: 'Back to Our Wind Tunnel: Size the Test-Section Speed',
    scenario:
      'We are still designing that supersonic wind tunnel reservoir. '
      + 'Suppose the flow leaving the nozzle and entering the test section has been '
      + 'accelerated to <strong>V = 680 m/s</strong>, and at that point in the flow the '
      + 'static temperature has dropped to <strong>T = 200 K</strong>. '
      + '<strong>Your turn:</strong> using a = &radic;(&gamma;RT), find the local speed of sound '
      + 'and the Mach number of the test-section flow. You have the equation — set it up '
      + 'and solve before revealing each answer.',
    steps: [
      {
        label: 'Step 1 — find the local speed of sound at T = 200 K',
        eq: 'a = \\sqrt{\\gamma R T}',
        note: 'Use γ = 1.4 and R = 287 J/(kg·K) for air. Compute a before revealing.',
        result: 'a = \\sqrt{(1.4)(287)(200)} = 283\\;\\mathrm{m/s}',
        revealResult: true,
      },
      {
        label: 'Step 2 — find the Mach number',
        eq: 'M = \\frac{V}{a}',
        note: 'Now divide the given flow velocity by the speed of sound you just found.',
        result: 'M = \\frac{680}{283} = 2.40',
        revealResult: true,
        question: 'Is this a reasonable Mach number for a supersonic wind tunnel test section? '
          + 'What would you need to change about the reservoir conditions to push M higher?',
      },
    ],
  },

  // ── NEW · SECTION 5: V vs a — SHOCK FORMATION ───────────────────────────────
  {
    type: 'shockform',
    sectionNumber: 'Section 5 — V vs. a',
    heading: 'Can the Molecules Get Out of the Way?',
    intro:
      'The core question: how fast is the <strong>bulk velocity V</strong> compared to the speed of the collision wave <strong>a</strong>? That single ratio — the Mach number — decides whether the flow stays smooth or slams into a shock.',
    regimes: [
      {
        tag: 'M < 1', label: 'Subsonic', accent: '#5ec8d8',
        head: 'Molecules collide faster than the flow moves',
        body: 'Information outruns the body. Molecules are told to “get out of the way” before it arrives, so the flow parts smoothly around it.',
      },
      {
        tag: 'M > 1', label: 'Supersonic', accent: '#f0a93b',
        head: 'The flow outruns the collisions',
        body: 'Molecules cannot respond in time — they “couldn’t move out of the way quick enough and get slammed.” Disturbances pile up all at once into a <strong>shock</strong>: a compression wave.',
      },
    ],
    closer: 'a also measures how quickly the collisions can respond to a change in density (a compression). When the flow is faster than that response, the response can’t keep up — and you get a shock.',
  },
]
