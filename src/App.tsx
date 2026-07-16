import { useState } from 'react'
import Scene from './scenes/Scene'

const MODELS = {
  earth: { path: '/models/earth-model.glb', label: 'Free Earth Model' },
  earthquakes: { path: '/models/earthquakes-2000-2019.glb', label: 'Earthquakes 2000–2019' },
} as const

type ModelKey = keyof typeof MODELS

export default function App() {
  const [activeModel, setActiveModel] = useState<ModelKey>('earth')

  return (
    <main>
      {/* The fixed 3D layer — sits behind everything */}
      <Scene modelPath={MODELS[activeModel].path} />

      {/* Simple UI to switch between your two models for comparison.
          This is just a Step 2 testing tool — it won't be part of
          the final site. */}
      <div
        style={{
          position: 'fixed',
          top: 24,
          left: 24,
          zIndex: 10,
          display: 'flex',
          gap: 8,
        }}
      >
        {(Object.keys(MODELS) as ModelKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setActiveModel(key)}
            style={{
              padding: '10px 16px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.2)',
              background: activeModel === key ? 'var(--accent)' : 'rgba(0,0,0,0.4)',
              color: 'var(--fg)',
              fontSize: 'var(--btn)',
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
            }}
          >
            {MODELS[key].label}
          </button>
        ))}
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          zIndex: 10,
          fontSize: 'var(--body3)',
          opacity: 0.6,
          maxWidth: '32ch',
        }}
      >
        Drag to orbit, scroll to zoom (temporary — this becomes scroll-driven in Step 4).
      </div>
    </main>
  )
}
