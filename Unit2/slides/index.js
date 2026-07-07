// ME 3470 . Unit 2 - slide assembly + section index
// Flat `slides` (identical order to the consolidated deck) + `sections` table
// (title, accent, slide count, auto start index) for the home-screen cards.
import { introSlides }        from './01-intro'
import { thermoSlides }       from './02-thermo'
import { firstLawSlides }     from './03-first-law'
import { conservationSlides } from './04-conservation'
import { soundSlides }        from './05-sound'
import { stagnationSlides }   from './06-stagnation'
import { summarySlides }      from './07-summary'

const groups = [
  { id: 'intro',        tag: '§1', accent: '#5ec8d8', title: 'Intro to Compressible Flow',
    subtitle: 'Design task · what compressibility really means',          slides: introSlides },
  { id: 'thermo',       tag: '§2', accent: '#f0a93b', title: 'Thermodynamic Foundations',
    subtitle: 'EoS & Z · energy, enthalpy · cₚ/cᵥ(T) · entropy',     slides: thermoSlides },
  { id: 'first-law',    tag: '§3', accent: '#a78bfa', title: 'First Law & Path Dependence',
    subtitle: 'State vs path variables · free expansion',                slides: firstLawSlides },
  { id: 'conservation', tag: '§4', accent: '#4ade80', title: 'Conservation Principles',
    subtitle: 'Control volume · mass, momentum & energy',                slides: conservationSlides },
  { id: 'sound',        tag: '§5', accent: '#f87171', title: 'Speed of Sound, Mach & Shocks',
    subtitle: 'a = √(γRT) · Mach number · shock formation',           slides: soundSlides },
  { id: 'stagnation',   tag: '§6', accent: '#60a5fa', title: 'Stagnation Properties',
    subtitle: 'Bring the flow to rest · total T, p, ρ · when they apply', slides: stagnationSlides },
  { id: 'summary',   tag: '§7', accent: '#60a5fa', title: 'Summary - Equations',
    subtitle: 'All the tools we now have in the toolbox', slides: summarySlides },
]

export const slides = groups.flatMap((g) => g.slides)

let _start = 0
export const sections = groups.map((g) => {
  const start = _start
  _start += g.slides.length
  return { id: g.id, tag: g.tag, accent: g.accent, title: g.title,
           subtitle: g.subtitle, start, count: g.slides.length }
})
