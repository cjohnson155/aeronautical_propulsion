// ME 3470 · Unit 2 — slide assembly + section index
// Concatenates the per-section slide arrays in lecture order AND derives a
// `sections` table (title, accent, slide count, start index) consumed by the
// home-screen section cards.
import { openerSlides }       from './00-opener'
import { introSlides }        from './01-intro'
import { thermoSlides }       from './02-thermo'
import { firstLawSlides }     from './03-first-law'
import { conservationSlides } from './04-conservation'
import { soundSlides }        from './05-sound'
import { stagnationSlides }   from './06-stagnation'

// Single source of truth: lecture order + card metadata + the slide arrays.
// Edit titles/colours here; start indices recompute automatically.
const groups = [
  { id: 'overview',     tag: '0',  accent: '#5ec8d8', title: 'Overview',
    subtitle: 'Design task & six-movement outline',                  slides: openerSlides },
  { id: 'intro',        tag: '\u00a71', accent: '#f0a93b', title: 'Intro to Compressible Flow',
    subtitle: 'What compressibility is \u00b7 isothermal vs isentropic', slides: introSlides },
  { id: 'thermo',       tag: '\u00a72', accent: '#a78bfa', title: 'Thermodynamic Foundations',
    subtitle: 'Internal energy, enthalpy, c\u209a/c\u1d65, entropy',  slides: thermoSlides },
  { id: 'first-law',    tag: '\u00a73', accent: '#4ade80', title: 'First Law & Path Dependence',
    subtitle: 'State vs path variables \u00b7 free expansion',        slides: firstLawSlides },
  { id: 'conservation', tag: '\u00a74', accent: '#f87171', title: 'Conservation Principles',
    subtitle: 'Control volume \u00b7 mass, momentum & energy',        slides: conservationSlides },
  { id: 'sound',        tag: '\u00a75', accent: '#60a5fa', title: 'Speed of Sound, Mach & Shocks',
    subtitle: 'a = \u221a(\u03b3RT) \u00b7 Mach number \u00b7 shocks', slides: soundSlides },
  { id: 'stagnation',   tag: '\u00a76', accent: '#06b6d4', title: 'Stagnation Properties',
    subtitle: 'Total conditions \u00b7 T\u2080, P\u2080, \u03c1\u2080 \u00b7 Mach relations', slides: stagnationSlides },
]

// Flat array — lecture order.
export const slides = groups.flatMap((g) => g.slides)

// Section table with auto-computed start index + count.
let _start = 0
export const sections = groups.map((g) => {
  const start = _start
  _start += g.slides.length
  return {
    id: g.id,
    tag: g.tag,
    accent: g.accent,
    title: g.title,
    subtitle: g.subtitle,
    start,
    count: g.slides.length,
  }
})
