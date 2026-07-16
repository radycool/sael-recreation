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
        // Fades out across the same window the earth grows in
        // (ScrollRig's HERO_GROW_END) — the darkening and the "lift"
        // finish together instead of on separate timers.
        const opacity = isHero ? 1 - scrollState.sectionProgress / 0.9 : 0
        ref.current.style.opacity = String(Math.min(Math.max(opacity, 0), 1))
      }
      raf = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(raf)
  }, [])

  return <div ref={ref} className="hero-background" />
}
