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
  const eyebrowRef = useRef<HTMLDivElement>(null)

  // Pins the eyebrow's right edge to the wordmark's actual rendered
  // right edge — measured directly rather than guessed, since "SAEL"
  // and "ORYZO" render at very different widths and a fixed vw offset
  // would only line up by coincidence.
  useEffect(() => {
    const align = () => {
      if (wordmarkRef.current && eyebrowRef.current) {
        const rect = wordmarkRef.current.getBoundingClientRect()
        eyebrowRef.current.style.right = `${window.innerWidth - rect.right}px`
      }
    }
    align()
    window.addEventListener('resize', align)
    return () => window.removeEventListener('resize', align)
  }, [])

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
      <div className="eyebrow-top" ref={eyebrowRef}>SUSTAINABLE &amp; AFFORDABLE ENERGY FOR LIFE</div>

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
          The world's most necessary
          <br />
          commitment to a livable planet.
        </p>
      </div>

      <div className="scroll-cue">
        <span className="scroll-cue__ring" />
        <span className="scroll-cue__chevron">⌄</span>
        SCROLL TO CONTINUE
      </div>
    </section>
  )
}
