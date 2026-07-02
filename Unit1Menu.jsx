import React, { useState } from 'react';
// Unit 1 — propulsion decks menu (formerly the app's root App.jsx).
// Rendered by ../App.jsx for the #/unit1 route. `onExit` returns to the unit picker.
//import TurbojetPresentation from './TurbojetPresentation';
import JetEngineComponents from './JetEngineComponents';
import PropulsionDeck from './PropulsionDeck';
import NewtonsLawsPropulsion from './NewtonsLawsPropulsion';

// ── MOVED / MERGED OUT OF UNIT 1 ─────────────────────────────────────────────
// Quasi1DFlowsPresentation.jsx → now Unit 3 (moved to ./Unit3, reached from the
//                                top-level unit picker).
// StagnationProperties.jsx     → merged into Unit 2 as Section 6 (./Unit2/06-stagnation.js).
//                                The standalone file is now unused (safe to delete).
// Unit2_ME3470.jsx             → old monolithic Unit 2 deck; superseded by ./Unit2.
// Archived, kept on disk for reference:
// import CompressibleFlowPresentation from './CompressibleFlowPresentation';
// import Unit2slides from './Unit2slides';

const Unit1Menu = ({ onExit }) => {
  const [currentPresentation, setCurrentPresentation] = useState(null);

  const presentations = [
    {
      id: 'newtonslaws',
      title: 'The Laws of Motion',
      subtitle: 'How we move forward',
      component: NewtonsLawsPropulsion,
      color: 'from-amber-500 to-yellow-300'
    },
    {
      id: 'propulsion',
      title: 'Types of Propusion Devices',
      subtitle: 'Air, sea, space',
      component: PropulsionDeck,
      color: 'from-fuchsia-600 to-pink-400'
    },
    {
      id: 'jetengine',
      title: 'Turbojet Engine Components',
      subtitle: 'Thrust & Energy Conversion',
      component: JetEngineComponents,
      color: 'from-red-700 to-orange-500'
    }
  ];

  if (currentPresentation) {
    const presentation = presentations.find(p => p.id === currentPresentation);
    const Component = presentation.component;

    return (
      <div>
        <button
          onClick={() => setCurrentPresentation(null)}
          className="fixed top-6 left-6 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
        >
          ← Back to Menu
        </button>
        <Component />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      {onExit && (
        <button
          onClick={onExit}
          className="fixed top-6 left-6 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
        >
          ← Units
        </button>
      )}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 pt-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            Unit 1 — Propulsion
          </h1>
          <p className="text-xl text-slate-400">
            Select a presentation to view
          </p>
        </div>

        {/* Presentation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {presentations.map((presentation) => (
            <button
              key={presentation.id}
              onClick={() => setCurrentPresentation(presentation.id)}
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              {/* Card Background */}
              <div className={`bg-gradient-to-br ${presentation.color} p-8 h-80 flex flex-col justify-between relative overflow-hidden`}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-300"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>

                {/* Content */}
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-white mb-3">
                    {presentation.title}
                  </h2>
                  <p className="text-lg text-white text-opacity-90">
                    {presentation.subtitle}
                  </p>
                </div>

                {/* CTA */}
                <div className="relative z-10 flex items-center gap-2 text-white text-opacity-90 group-hover:text-opacity-100 transition-all">
                  <span className="font-semibold">View Presentation</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-2 transition-transform">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-slate-400">
          <p>Click any card to start viewing</p>
        </div>
      </div>
    </div>
  );
};

export default Unit1Menu;
