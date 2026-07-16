import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'

/**
 * useProgress (from drei) tracks Three.js's loading manager — it knows
 * the real download progress of your GLTF model, not a fake timer.
 * The circle's stroke-dashoffset is driven directly by that number,
 * so the ring actually "draws itself in" as your model downloads.
 */
export default function LoadingScreen() {
  const { progress } = useProgress()
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)

  // Once progress hits 100, wait a beat (lets the ring visibly finish
  // drawing), then start the fade-out. NOTE: we deliberately don't
  // depend on useProgress's `active` flag here — it can flicker or
  // get stuck `true` if multiple loaders register slightly out of
  // sync (e.g. the GLTF model + the environment lighting map), which
  // is what was causing the screen to stay stuck at 100%.
  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => setExiting(true), 450)
      return () => clearTimeout(t)
    }
  }, [progress])

  // Failsafe: no matter what, never let the loading screen block the
  // site for more than a few seconds.
  useEffect(() => {
    const failsafe = setTimeout(() => setExiting(true), 4000)
    return () => clearTimeout(failsafe)
  }, [])

  // After the fade-out transition finishes, unmount entirely so it
  // stops blocking clicks/scroll.
  useEffect(() => {
    if (exiting) {
      const t = setTimeout(() => setVisible(false), 700)
      return () => clearTimeout(t)
    }
  }, [exiting])

  if (!visible) return null

  const radius = 90
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress / 100)

  return (
    <div className={`loading-screen ${exiting ? 'is-exiting' : ''}`}>
      <div className="loading-ring-wrap">
        <svg viewBox="0 0 220 220" className="loading-svg">
          {/* faint dotted guide circle, always fully visible */}
          <circle cx="110" cy="110" r="100" className="loading-ring-guide" />

          {/* solid ring that draws itself in as progress increases */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            className="loading-ring-progress"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />

          {/* N/S/E/W tick brackets, like a camera viewfinder */}
          <g className="loading-ticks">
            <line x1="110" y1="0" x2="110" y2="20" />
            <line x1="110" y1="200" x2="110" y2="220" />
            <line x1="0" y1="110" x2="20" y2="110" />
            <line x1="200" y1="110" x2="220" y2="110" />
          </g>
        </svg>
        <div className="loading-label">{Math.round(progress)}%</div>
      </div>
    </div>
  )
}
