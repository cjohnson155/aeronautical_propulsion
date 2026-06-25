// ME 3470 · Unit 2 — entry point
// Wires the assembled slides + section table + meta into the presentation engine.
// ME 3470 · Unit 2 — deck wrapper
import Presentation from './engine'
import { slides, sections } from './index.js'
import { meta } from './meta'

export default function App({ onExit }) {
  return <Presentation slides={slides} meta={meta} sections={sections} onExit={onExit} />
}
