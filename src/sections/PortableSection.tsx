import { useEffect, useRef } from 'react'
import { scrollState } from '../state/scrollState'
import {
  PORTABLE_OUTLINE_END,
  PORTABLE_HEADING_START,
  PORTABLE_HEADING_END,
  PORTABLE_SHINE_END,
  PORTABLE_GROW_START,
} from '../scenes/ScrollRig'

const EYEBROW_FADE_END = 0.1
// Outline guide fades out once the grow finale takes over — it stops
// making sense once the earth is filling the screen.
const OUTLINE_FADE_START = PORTABLE_GROW_START
const OUTLINE_FADE_END = PORTABLE_GROW_START + 0.08

export default function PortableSection() {
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const outlineRef = useRef<SVGRectElement>(null)
  const outlineWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      const isThis = scrollState.activeSection === 2
      const p = isThis ? scrollState.sectionProgress : 0

      // Eyebrow — fades in early, then just stays (like "SO PORTABLE,"
      // in the ref, which sticks around as a small label).
      if (eyebrowRef.current) {
        eyebrowRef.current.style.opacity = String(
          Math.min(Math.max(p / EYEBROW_FADE_END, 0), 1)
        )
      }

      // Outline guide — a single <rect> whose corner radius animates
      // from a big circle-like value down to 0 (sharp square), rather
      // than crossfading two separate shapes.
      if (outlineRef.current) {
        const t = Math.min(Math.max(p / PORTABLE_OUTLINE_END, 0), 1)
        const rx = 180 * (1 - t) // 180 ≈ fully round at this viewBox size
        outlineRef.current.setAttribute('rx', String(rx))
      }
      if (outlineWrapRef.current) {
        const fadeT = Math.min(
          Math.max((p - OUTLINE_FADE_START) / (OUTLINE_FADE_END - OUTLINE_FADE_START), 0),
          1
        )
        outlineWrapRef.current.style.opacity = String(1 - fadeT)
      }

      // Big heading — slides in from off-screen left once the outline
      // has finished morphing, then "shines" once fully arrived.
      if (headingRef.current) {
        const t = Math.min(
          Math.max((p - PORTABLE_HEADING_START) / (PORTABLE_HEADING_END - PORTABLE_HEADING_START), 0),
          1
        )
        const translateX = (1 - t) * -60 // vw, off-screen left at t=0
        headingRef.current.style.transform = `translateY(-50%) translateX(${translateX}vw)`
        headingRef.current.style.opacity = String(t)

        const shineT = Math.min(
          Math.max((p - PORTABLE_HEADING_END) / (PORTABLE_SHINE_END - PORTABLE_HEADING_END), 0),
          1
        )
        const glow = 6 + shineT * 34 // px
        headingRef.current.style.textShadow =
          shineT > 0
            ? `0 0 ${glow}px rgba(244,242,238,${0.25 + shineT * 0.55}), 0 0 ${glow * 2}px rgba(255,150,70,${shineT * 0.35})`
            : 'none'
      }

      raf = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="section section--spin">
      <div className="portable-sticky">
        <div className="portable-eyebrow" ref={eyebrowRef}>
          SO PORTABLE,
        </div>

        <h2 className="portable-heading" ref={headingRef}>
          it's efficient
        </h2>

        <div className="portable-outline" ref={outlineWrapRef}>
          <svg viewBox="0 0 360 360">
            <rect
              ref={outlineRef}
              x="10"
              y="10"
              width="340"
              height="340"
              rx="180"
              className="portable-outline__rect"
            />
            <g className="portable-outline__ticks">
              <line x1="180" y1="0" x2="180" y2="18" />
              <line x1="180" y1="342" x2="180" y2="360" />
              <line x1="0" y1="180" x2="18" y2="180" />
              <line x1="342" y1="180" x2="360" y2="180" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}
