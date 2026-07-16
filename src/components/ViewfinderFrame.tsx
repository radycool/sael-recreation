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
        const opacity = isHero ? 1 - scrollState.sectionProgress * 0.9 : 0
        ref.current.style.opacity = String(Math.max(opacity, 0))
      }
      raf = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={ref} className="viewfinder-frame">
      <svg viewBox="0 0 360 360">
        <circle cx="180" cy="180" r="160" className="viewfinder-ring-outer" />
        <circle cx="180" cy="180" r="122" className="viewfinder-ring-inner" />
        <g className="viewfinder-ticks">
          <line x1="180" y1="8" x2="180" y2="34" />
          <line x1="180" y1="326" x2="180" y2="352" />
          <line x1="8" y1="180" x2="34" y2="180" />
          <line x1="326" y1="180" x2="352" y2="180" />
        </g>
      </svg>
    </div>
  )
}
