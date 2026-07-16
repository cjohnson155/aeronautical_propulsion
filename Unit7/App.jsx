import { useEffect } from 'react'
import Deck from './ComponentEfficiencies.jsx'

// ── Unit 7 — Real Cycle & Component Efficiencies ─────────────────────────────
// Thin wrapper so the top-level hub can mount this like the other units:
//   <Unit7Deck onExit={goHome} />
// The deck itself (ComponentEfficiencies.jsx) owns slide state + arrow-key nav.
// This wrapper adds the "back to units" affordance every unit shares:
//   • a floating Units button (top-left)
//   • Esc key → exit
// Drop this file next to ComponentEfficiencies.jsx as Unit7/App.jsx.

export default function App({ onExit }) {
  useEffect(() => {
    if (!onExit) return
    const h = (e) => { if (e.key === 'Escape') onExit() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onExit])

  return (
    <div style={{ position: 'relative' }}>
      {onExit && (
        <button
          onClick={onExit}
          style={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 50,
            border: '2px solid #12202e',
            background: '#12202e',
            color: '#f6f4ef',
            borderRadius: 8,
            padding: '10px 16px',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Inter','Helvetica Neue',Arial,system-ui,sans-serif",
          }}
        >
          ⌂ Units
        </button>
      )}
      <Deck />
    </div>
  )
}
