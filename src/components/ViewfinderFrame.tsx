import { useEffect, useRef } from 'react'
import { scrollState } from '../state/scrollState'

/**
 * Purely decorative — sits centered over the 3D model. Reads
 * scrollState every frame (same pattern as ScrollRig) to fade itself
 * out as you scroll away from the hero, without triggering React
 * re-renders on every scroll pixel.
 */
export default function ViewfinderFrame() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      if (ref.current) {
        const isHero = scrollState.activeSection === 0
        // Fully gone by the same point the hero backdrop/tagline
        // have faded (0.7), instead of lingering at ~10% forever.
        const opacity = isHero ? 1 - scrollState.sectionProgress / 0.7 : 0
        ref.current.style.opacity = String(Math.min(Math.max(opacity, 0), 1))
      }
      raf = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={ref} className="viewfinder-frame">
      <svg viewBox="0 0 360 360">
        {/* sharp camera-crop-mark corners, tight around the model —
            no full ring, matching the ref's understated framing */}
        <g className="viewfinder-corners">
          <path d="M 40 76 L 40 40 L 76 40" />
          <path d="M 284 40 L 320 40 L 320 76" />
          <path d="M 320 284 L 320 320 L 284 320" />
          <path d="M 76 320 L 40 320 L 40 284" />
        </g>
        <g className="viewfinder-ticks">
          <line x1="180" y1="8" x2="180" y2="26" />
          <line x1="180" y1="334" x2="180" y2="352" />
          <line x1="8" y1="180" x2="26" y2="180" />
          <line x1="334" y1="180" x2="352" y2="180" />
        </g>
      </svg>
    </div>
  )
}
