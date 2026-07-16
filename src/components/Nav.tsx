import { useEffect, useRef } from 'react'
import { scrollState } from '../state/scrollState'

const BRAND_NAME = 'SAEL' // <-- swap this one constant to rename everywhere

// Must match Hero.tsx's own timing — the small logo crossfades in
// exactly as the shrinking hero wordmark "arrives" at this spot, so
// the whole thing reads as one continuous morph rather than two
// separate animations. The links, unlike the logo, are visible from
// the very start (matching the ref) — only the logo needs to wait
// for the wordmark to finish shrinking into its spot.
const FADE_START = 0.45
const FADE_END = 0.7

export default function Nav() {
  const logoRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      const isHero = scrollState.activeSection === 0
      const p = isHero ? Math.min(Math.max(scrollState.sectionProgress, 0), 1) : 1
      const t = Math.min(Math.max((p - FADE_START) / (FADE_END - FADE_START), 0), 1)

      if (logoRef.current) {
        logoRef.current.style.opacity = String(t)
        logoRef.current.style.transform = `translateY(calc(-50% + ${(1 - t) * -12}px))`
      }
      // Small placeholder dot holds the corner until the logo lands,
      // then crossfades out — same handoff idea as the loading ring.
      if (dotRef.current) {
        dotRef.current.style.opacity = String(1 - t)
      }
      raf = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <header className="site-nav">
        <div className="site-nav__logo-slot">
          <div className="site-nav__dot" ref={dotRef} />
          <div className="site-nav__logo" ref={logoRef}>{BRAND_NAME}</div>
        </div>
        <nav className="site-nav__links">
          <a href="#" className="is-active">Company</a>
          <a href="#">Businesses</a>
          <a href="#">Sustainability</a>
          <a href="#">Investors</a>
          <a href="#">Newsroom</a>
          <a href="#">Career</a>
          <a href="#">Contact Us</a>
        </nav>
      </header>

      <div className="side-label">{BRAND_NAME}-1 MODEL</div>
    </>
  )
}

export { BRAND_NAME }
