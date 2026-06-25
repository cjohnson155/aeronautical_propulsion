// Unit 3 — Quasi-1D Flows (standalone deck moved here from the repo root)
import Quasi1DFlowsPresentation from './Quasi1DFlowsPresentation'

export default function App({ onExit }) {
  return (
    <div>
      {onExit && (
        <button
          onClick={onExit}
          className="fixed top-6 left-6 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
        >
          ← Units
        </button>
      )}
      <Quasi1DFlowsPresentation />
    </div>
  )
}
