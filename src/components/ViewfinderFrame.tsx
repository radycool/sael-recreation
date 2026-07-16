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
          <path d="M 30 66 L 30 30 L 66 30" />
          <path d="M 294 30 L 330 30 L 330 66" />
          <path d="M 330 294 L 330 330 L 294 330" />
          <path d="M 66 330 L 30 330 L 30 294" />
        </g>
        <g className="viewfinder-ticks">
          <line x1="180" y1="4" x2="180" y2="20" />
          <line x1="180" y1="340" x2="180" y2="356" />
          <line x1="4" y1="180" x2="20" y2="180" />
          <line x1="340" y1="180" x2="356" y2="180" />
        </g>
      </svg>
    </div>
  )
}
