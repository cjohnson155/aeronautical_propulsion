import { useState } from 'react'
import Unit6BraytonCycleDeck from './Unit6BraytonCycleDeck.jsx'
import Unit6CycleAnalysis2Deck from './Unit6CycleAnalysis2Deck.jsx'
import Unit6BraytonCycleDeck1 from './Unit6BraytonCycleDeck1.jsx'

// NOTE: save this file as  src/Unit6/App.jsx
// (the deck lives beside it at  src/Unit6/Unit6BraytonCycleDeck.jsx)

const unit6Options = [
  {
        id: 'brayton-cycle1',
    title: 'Engine Flowpath Tour',
    subtitle: 'Four energy currencies \u00b7 enthalpy = u + Pv \u00b7 Assumptions and models ',
    color: 'from-violet-500 to-pink-300',
  },
    id: 'brayton-cycle',
    title: 'Ideal vs. Real Brayton Cycle',
    subtitle: 'Four energy currencies \u00b7 enthalpy = u + Pv \u00b7 component energy exchange \u00b7 cycle efficiency \u00b7 ideal vs. real',
    color: 'from-cyan-500 to-amber-300',
  },
  {
    id: 'cycle-analysis-2',
    title: 'Cycle Analysis 2',
    subtitle: 'Cyclic energy balance \u00b7 heat-transfer terms \u00b7 thermal efficiency derivation \u00b7 isentropic + isobaric simplification',
    color: 'from-indigo-500 to-cyan-300',
  },
]

const decks = {
  'brayton-cycle': Unit6BraytonCycleDeck,
  'cycle-analysis-2': Unit6CycleAnalysis2Deck,
}

export default function Unit6Deck({ onExit }) {
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
            ← Unit 6 menu
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
            <h1 className="text-5xl font-bold text-white">Unit 6 — Ideal vs. Real Brayton Cycle</h1>
            <p className="mt-3 text-xl text-slate-400">Select a Unit 6 slide/deck</p>
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
          {unit6Options.map((option) => (
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
