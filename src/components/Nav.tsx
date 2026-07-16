import { useEffect, useRef } from 'react'
import { scrollState } from '../state/scrollState'

const BRAND_NAME = 'SAEL' // <-- swap this one constant to rename everywhere

// Must match HeroContent.tsx's MOVE_END exactly — the logo snaps to
// visible at the precise instant the shrinking wordmark finishes
// arriving at this spot. No crossfade: it's meant to read as the
// wordmark itself settling into place and becoming the logo, not two
// separate elements swapping.
const MOVE_END = 0.7

export default function Nav() {
  const logoRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      const isHero = scrollState.activeSection === 0
      const p = isHero ? Math.min(Math.max(scrollState.sectionProgress, 0), 1) : 1
      const arrived = p >= MOVE_END

      if (logoRef.current) {
        logoRef.current.style.opacity = arrived ? '1' : '0'
      }
      // Small placeholder dot holds the corner until the wordmark
      // arrives, then disappears at that same instant.
      if (dotRef.current) {
        dotRef.current.style.opacity = arrived ? '0' : '1'
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
