// App entry — renders the transformed Component Efficiencies deck.
//
// The transformed deck (ComponentEfficiencies.tsx) is fully self-contained:
//   • its own full-screen shell — top bar, nav dots, progress bar,
//     and click / arrow-key / space navigation
//   • its own navy/cyan theme (no external CSS needed)
//   • math rendered with plain `katex` (NO react-katex dependency)
//
// So this file no longer needs the old light-theme shell, the dashed
// placeholder primitives (<Img/> <Eqn/> <Txt/>), or its own `slides` array —
// all of that lived in the pre-transform version and is now dead weight that
// also pulled in react-katex. This wrapper just mounts the deck.
//
// Adjust the import path below if your deck file sits elsewhere or is renamed.

import Presentation from './ComponentEfficiencies'

export default function App() {
  return <Presentation />
}

// ── customizing ──────────────────────────────────────────────────────────────
// <Presentation/> already defaults to the deck's built-in slides + meta, so the
// bare tag above is all you need. If you ever want to override either, the deck
// also exports them as named exports:
//
//   import Presentation, { slides, meta } from './ComponentEfficiencies'
//   return <Presentation slides={slides} meta={{ ...meta, deckTitle: 'Custom' }} />
