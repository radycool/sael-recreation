import { useEffect, useRef } from 'react'
import { BRAND_NAME } from './Nav'
import { scrollState } from '../state/scrollState'

// Kept in sync with Nav.tsx's own MOVE_END — the wordmark shrinks and
// slides continuously (staying fully opaque the whole time, no fade)
// until it settles exactly into the nav logo's spot. Nav.tsx then
// snaps its own logo to visible at that same instant, so it reads as
// the wordmark itself becoming the logo, not two elements crossfading.
const MOVE_END = 0.7

// Staggered, non-overlapping fade-out windows — each one is fully
// gone before the next starts. Since this whole component is
// position: fixed, these are the ONLY thing moving/hiding these
// elements — there's no native scroll drag to compound with anymore.
const FADES: Record<string, [number, number]> = {
  scrollCue: [0, 0.1],
  tagline: [0.12, 0.28],
  eyebrow: [0.3, 0.44],
  infoCard: [0.46, 0.6],
}

function fadeFor(p: number, [start, end]: [number, number]) {
  return 1 - Math.min(Math.max((p - start) / (end - start), 0), 1)
}

export default function HeroContent() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLHeadingElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const infoCardRef = useRef<HTMLDivElement>(null)
  const scrollCueRef = useRef<HTMLDivElement>(null)

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
      const isHero = scrollState.activeSection === 0
      const p = isHero ? Math.min(Math.max(scrollState.sectionProgress, 0), 1) : 1

      if (wordmarkRef.current) {
        const moveT = Math.min(p / MOVE_END, 1)

        // Slides + shrinks from the big hero position toward the
        // nav bar's top-left logo spot (~48px / ~32px). Stays fully
        // opaque the entire time — it settles into place rather than
        // fading into a separate element.
        const translateX = moveT * -3 // vw
        const translateY = moveT * -15.5 // vh
        const scale = 1 - moveT * 0.88

        wordmarkRef.current.style.transform =
          `translate(${translateX}vw, ${translateY}vh) scale(${scale})`
        wordmarkRef.current.style.transformOrigin = 'top left'
      }

      if (scrollCueRef.current) scrollCueRef.current.style.opacity = String(fadeFor(p, FADES.scrollCue))
      if (taglineRef.current) taglineRef.current.style.opacity = String(fadeFor(p, FADES.tagline))
      if (eyebrowRef.current) eyebrowRef.current.style.opacity = String(fadeFor(p, FADES.eyebrow))
      if (infoCardRef.current) infoCardRef.current.style.opacity = String(fadeFor(p, FADES.infoCard))

      // Hides the whole layer once you're past the hero, so it can't
      // block clicks/scroll or peek through on later sections.
      if (wrapRef.current) {
        wrapRef.current.style.visibility = isHero ? 'visible' : 'hidden'
      }

      raf = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="hero-content" ref={wrapRef}>
      <div className="eyebrow-top" ref={eyebrowRef}>SUSTAINABLE &amp; AFFORDABLE ENERGY FOR LIFE</div>

      <h1 className="hero-wordmark" ref={wordmarkRef}>{BRAND_NAME}</h1>

      <p className="hero-tagline" ref={taglineRef}>
        Designed to track, measure, and act — {BRAND_NAME} makes
        sustainability feel considered, not complicated.
      </p>

      <div className="info-card" ref={infoCardRef}>
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

      <div className="scroll-cue" ref={scrollCueRef}>
        <span className="scroll-cue__ring" />
        <span className="scroll-cue__chevron">⌄</span>
        SCROLL TO CONTINUE
      </div>
    </div>
  )
}
