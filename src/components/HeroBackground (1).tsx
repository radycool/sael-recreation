import { useEffect, useRef } from 'react'
import { scrollState } from '../state/scrollState'

/**
 * Sits BEHIND the transparent 3D canvas (z-index -1), so the Earth
 * model renders on top of it. Fades to fully transparent — revealing
 * the solid --bg color underneath — as you scroll out of the hero,
 * same "reads scrollState every frame" pattern as ViewfinderFrame.
 */
export default function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      if (ref.current) {
        const isHero = scrollState.activeSection === 0
        // Fades out over the first ~70% of the hero's scroll range,
        // fully gone by the time the "lift" into section 2 begins.
        const opacity = isHero ? 1 - scrollState.sectionProgress / 0.7 : 0
        ref.current.style.opacity = String(Math.min(Math.max(opacity, 0), 1))
      }
      raf = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(raf)
  }, [])

  return <div ref={ref} className="hero-background" />
}
