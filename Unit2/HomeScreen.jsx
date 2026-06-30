// ME 3470 . Unit 2 - Home screen (clickable grid of section cards)
export default function HomeScreen({ sections = [], meta = {}, onPick }) {
  return (
    <div className="home">
      <div className="home-head">
        <div className="home-eyebrow">{meta.courseId}</div>
        <h1 className="home-title">{meta.deckTitle}</h1>
        <p className="home-sub">Pick a section to jump in — or press → to start from the beginning.</p>
      </div>
      <div className="home-grid">
        {sections.map((s, i) => (
          <button
            key={s.id || i}
            className="home-card"
            style={{ borderTopColor: s.accent }}
            onClick={() => onPick && onPick(s.start)}
          >
            <span className="home-card-tag" style={{ background: s.accent }}>{s.tag ?? i}</span>
            <span className="home-card-title">{s.title}</span>
            {s.subtitle && <span className="home-card-sub">{s.subtitle}</span>}
            <span className="home-card-meta">
              <span>{s.count} slide{s.count === 1 ? '' : 's'}</span>
              <span className="home-card-go" style={{ color: s.accent }}>Enter →</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
