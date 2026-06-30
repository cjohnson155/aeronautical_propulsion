// ME 3470 . Unit 2 - entry point
import Presentation from './engine'
import { slides, sections } from './slides'
import { meta } from './meta'

export default function App() {
  return <Presentation slides={slides} meta={meta} sections={sections} />
}
