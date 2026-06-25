import { useState, useEffect, useCallback } from 'react'
import Unit1Menu from './Unit1Menu.jsx'
import Unit2Deck from './Unit2/App.jsx'
import Unit3Deck from './Unit3/App.jsx'

// ── Top-level course hub ─────────────────────────────────────────────────────
// Landing page → pick a unit. Lightweight hash routing (no router dependency):
//   #/        → this landing page
//   #/unit1   → Unit 1 (propulsion decks menu)
//   #/unit2   → Unit 2 (compressible-flow slide deck, incl. stagnation §6)
//   #/unit3   → Unit 3 (quasi-1D flows deck)
// Hashes are used because this is a GitHub Pages *project* page: they need no
// server-side redirect, so the browser/phone Back button works and links like
// …/#/unit2 are shareable. Vite's `base` handles asset URLs independently.

function readRoute() {
  const h = window.location.hash.replace(/^#\/?/, '')
  if (h === 'unit1') return 'unit1'
  if (h === 'unit2') return 'unit2'
  if (h === 'unit3') return 'unit3'
  return 'home'
}

const units = [
  {
    id: 'unit1',
    title: 'Unit 1 — Propulsion',
    subtitle: 'Laws of motion · engine types · turbojets',
    color: 'from-red-700 to-orange-500',
  },
  {
    id: 'unit2',
    title: 'Unit 2 — Compressible Flow',
    subtitle: 'Thermo · conservation · speed of sound · stagnation',
    color: 'from-violet-700 to-purple-500',
  },
  {
    id: 'unit3',
    title: 'Unit 3 — Quasi-1D Flows',
    subtitle: 'Diffusers & nozzles · area–velocity relations',
    color: 'from-lime-500 to-emerald-300',
  },
]

export default function App() {
  const [route, setRoute] = useState(readRoute)

  useEffect(() => {
    const onHash = () => setRoute(readRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = useCallback((id) => { window.location.hash = `#/${id}` }, [])
  const goHome = useCallback(() => { window.location.hash = '#/' }, [])

  if (route === 'unit1') return <Unit1Menu onExit={goHome} />
  if (route === 'unit2') return <Unit2Deck onExit={goHome} />
  if (route === 'unit3') return <Unit3Deck onExit={goHome} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 pt-8">
          <h1 className="text-5xl font-bold text-white mb-4">Aeronautical Propulsion</h1>
          <p className="text-xl text-slate-400">Select a unit to begin</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {units.map((u) => (
            <button
              key={u.id}
              onClick={() => go(u.id)}
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <div className={`bg-gradient-to-br ${u.color} p-8 h-80 flex flex-col justify-between relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-300"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-white mb-3">{u.title}</h2>
                  <p className="text-lg text-white text-opacity-90">{u.subtitle}</p>
                </div>
                <div className="relative z-10 flex items-center gap-2 text-white text-opacity-90 group-hover:text-opacity-100 transition-all">
                  <span className="font-semibold">Open unit</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-2 transition-transform">
                    <polyline points="9 18 15 12 9 6"></polyline>
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
