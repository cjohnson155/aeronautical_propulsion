import { useState } from 'react'
import Unit4FluidImpulseDeck from './Unit4FluidImpulseDeck.jsx'
import Unit4RayleighFlowDeck from './Unit4RayleighFlowDeck.jsx'
import Unit4RayleighWorkedExamplesDeck from './Unit4RayleighWorkedExamplesDeck.jsx'

const unit4Options = [
  {
    id: 'fluid-impulse',
    title: 'Fluid Impulse',
    subtitle: 'Pressure & shear · surface traction · momentum theorem · I = pA(1 + γM²) · duct forces',
    color: 'from-cyan-500 to-amber-300',
  },
  {
    id: 'rayleigh-flow',
    title: 'Rayleigh Flow',
    subtitle: 'Heat addition · constant-area duct · Rayleigh choking · Mach-number trends',
    color: 'from-orange-500 to-cyan-300',
  },
  {
    id: 'worked-examples',
    title: 'Rayleigh Flow — Worked Examples',
    subtitle: 'Reading the Rayleigh table · what the starred quantities mean · thermal choking · impulse tie-in',
    color: 'from-amber-300 to-cyan-500',
  },
]

const decks = {
  'fluid-impulse': Unit4FluidImpulseDeck,
  'rayleigh-flow': Unit4RayleighFlowDeck,
  'worked-examples': Unit4RayleighWorkedExamplesDeck,
}

export default function Unit4Deck({ onExit }) {
  const [activeDeck, setActiveDeck] = useState(null)

  const ActiveDeck = activeDeck ? decks[activeDeck] : null

  if (ActiveDeck) {
    return (
      <div className="min-h-screen bg-slate-950">
        <div className="fixed left-4 top-4 z-50 flex gap-2">
          <button
            onClick={() => setActiveDeck(null)}
            className="rounded-lg bg-slate-800/90 px-4 py-2 text-sm font-semibold text-white shadow-lg ring-1 ring-white/10 transition hover:bg-slate-700"
          >
            ← Unit 4 menu
          </button>
          {onExit && (
            <button
              onClick={onExit}
              className="rounded-lg bg-slate-800/90 px-4 py-2 text-sm font-semibold text-white shadow-lg ring-1 ring-white/10 transition hover:bg-slate-700"
            >
              Course home
            </button>
          )}
        </div>
        <ActiveDeck />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-center justify-between pt-4">
          <div>
            <h1 className="text-5xl font-bold text-white">Unit 4 — Compressible Flow III</h1>
            <p className="mt-3 text-xl text-slate-400">Select a Unit 4 slide/deck</p>
          </div>
          {onExit && (
            <button
              onClick={onExit}
              className="rounded-xl bg-white/10 px-5 py-3 font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/20"
            >
              Course home
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {unit4Options.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveDeck(option.id)}
              className="group relative overflow-hidden rounded-2xl text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className={`relative flex h-80 flex-col justify-between overflow-hidden bg-gradient-to-br ${option.color} p-8`}>
                <div className="absolute right-0 top-0 -mr-20 -mt-20 h-40 w-40 rounded-full bg-white opacity-10 transition-transform duration-300 group-hover:scale-150" />
                <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-32 w-32 rounded-full bg-white opacity-10" />
                <div className="relative z-10">
                  <h2 className="mb-3 text-3xl font-bold text-white">{option.title}</h2>
                  <p className="text-lg text-white/90">{option.subtitle}</p>
                </div>
                <div className="relative z-10 flex items-center gap-2 font-semibold text-white/90 transition-all group-hover:text-white">
                  <span>Open slide deck</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
