import { useEffect, useRef } from 'react'
import { BRAND_NAME } from '../components/Nav'
import { scrollState } from '../state/scrollState'

// Kept in sync with Nav.tsx's own reveal window so the big hero
// wordmark visually "lands" in the nav logo's spot right as the
// nav bar crossfades in — one continuous morph, driven by scroll.
const MOVE_END = 0.7
const FADE_START = 0.45
const FADE_END = 0.7

export default function Hero() {
  const wordmarkRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      if (wordmarkRef.current) {
        const isHero = scrollState.activeSection === 0
        const p = isHero ? Math.min(Math.max(scrollState.sectionProgress, 0), 1) : 1

        const moveT = Math.min(p / MOVE_END, 1)
        const fadeT = Math.min(Math.max((p - FADE_START) / (FADE_END - FADE_START), 0), 1)

        // Slides + shrinks from the big hero position toward the
        // nav bar's top-left logo spot (~48px / ~32px).
        const translateX = moveT * -3 // vw
        const translateY = moveT * -15.5 // vh
        const scale = 1 - moveT * 0.88

        wordmarkRef.current.style.transform =
          `translate(${translateX}vw, ${translateY}vh) scale(${scale})`
        wordmarkRef.current.style.transformOrigin = 'top left'
        wordmarkRef.current.style.opacity = String(1 - fadeT)
      }
      raf = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="hero section">
      <div className="eyebrow-top">SUSTAINABLE &amp; AFFORDABLE ENERGY FOR LIFE</div>

      <h1 className="hero-wordmark" ref={wordmarkRef}>{BRAND_NAME}</h1>

      <p className="hero-tagline">
        Designed to track, measure, and act — {BRAND_NAME} makes
        sustainability feel considered, not complicated.
      </p>

      <div className="info-card">
        <p className="info-card__title">
          DESIGNED WITH PURPOSE,
          <br />
          BY A TEAM THAT CARES.
        </p>
        <hr />
        <p className="info-card__body">
          Replace this with your real founder/brand story —
          same spot as Oryzo's "Designed by Lusion" card.
        </p>
      </div>

      <div className="scroll-cue">
        <span className="scroll-cue__chevron">⌄</span>
        SCROLL TO CONTINUE
      </div>
    </section>
  )
}
