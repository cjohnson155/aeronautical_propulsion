// App entry — menu wrapper offering two self-contained decks.
//
// Each deck (ComponentEfficiencies, ProblemSet2Problem2) is fully
// self-contained: its own full-screen shell (top bar, nav dots, progress bar,
// click / arrow-key / space navigation), its own navy/cyan theme, and math
// rendered with plain `katex`. This wrapper just lets the user pick which one
// to mount, then gets out of the way.
//
// Adjust the import paths below if your deck files sit elsewhere or are renamed.

import { useState } from 'react'
import ComponentEfficiencies, { meta as ceMeta } from './ComponentEfficiencies'
import ProblemSet2Problem2, { meta as ps2Meta } from './ProblemSet2Problem2'

const DECKS = [
  { id: 'ce',  label: ceMeta.deckTitle,  Component: ComponentEfficiencies },
  { id: 'ps2', label: ps2Meta.deckTitle, Component: ProblemSet2Problem2 },
]

export default function App() {
  const [selected, setSelected] = useState(null)

  if (selected) {
    const { Component } = DECKS.find(d => d.id === selected)
    return (
      <div style={{ position: 'relative', height: '100vh' }}>
        <button
          onClick={(e) => { e.stopPropagation(); setSelected(null) }}
          style={{
            position: 'absolute', top: 12, right: 16, zIndex: 50,
            background: '#13243a', color: '#eaf1f8', border: '1px solid #27405e',
            borderRadius: 7, padding: '6px 14px', fontSize: 13, cursor: 'pointer',
            fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
          }}
        >
          &larr; Menu
        </button>
        <Component />
      </div>
    )
  }

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
      background: 'radial-gradient(1200px 700px at 70% -10%,#163152 0%,#0d
