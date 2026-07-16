import { useEffect, useRef } from 'react'
import { scrollState } from '../state/scrollState'

const BRAND_NAME = 'SAEL' // <-- swap this one constant to rename everywhere

// Must match Hero.tsx's own timing — the nav crossfades in exactly
// as the shrinking hero wordmark "arrives" at the logo's spot, so
// the whole thing reads as one continuous morph rather than two
// separate animations.
const FADE_START = 0.45
const FADE_END = 0.7

export default function Nav() {
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      if (navRef.current) {
        const isHero = scrollState.activeSection === 0
        const p = isHero ? Math.min(Math.max(scrollState.sectionProgress, 0), 1) : 1
        const t = Math.min(Math.max((p - FADE_START) / (FADE_END - FADE_START), 0), 1)

        navRef.current.style.opacity = String(t)
        navRef.current.style.transform = `translateY(${(1 - t) * -12}px)`
        navRef.current.style.pointerEvents = t > 0.5 ? 'auto' : 'none'
      }
      raf = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <header className="site-nav" ref={navRef}>
        <div className="site-nav__logo">{BRAND_NAME}</div>
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
