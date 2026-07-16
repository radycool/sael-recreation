import { useEffect, useRef } from 'react'
import { scrollState } from '../state/scrollState'

// How far off-screen each column starts/ends, in vh.
const TRAVEL = 34

// Opacity trapezoid: fades in over the first slice, fully visible
// through the middle, fades out over the last slice — while position
// keeps moving continuously across the WHOLE 0-1 range regardless,
// so it never just sits still; it's always mid-scroll.
const FADE_IN_END = 0.14
const FADE_OUT_START = 0.86

function motionFor(p: number, direction: 1 | -1) {
  // direction +1 (left column): starts below (+TRAVEL) at p=0, passes
  // through 0 at the midpoint, continues up and off (-TRAVEL) at p=1.
  // direction -1 (right column): the mirror image — starts above.
  const translateY = direction * TRAVEL * (1 - 2 * p)

  let opacity: number
  if (p < FADE_IN_END) {
    opacity = p / FADE_IN_END
  } else if (p < FADE_OUT_START) {
    opacity = 1
  } else {
    opacity = 1 - Math.min((p - FADE_OUT_START) / (1 - FADE_OUT_START), 1)
  }

  return { translateY, opacity: Math.min(Math.max(opacity, 0), 1) }
}

export default function FeatureSection() {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      const isThis = scrollState.activeSection === 1
      const p = isThis ? scrollState.sectionProgress : 0

      if (leftRef.current) {
        const { translateY, opacity } = motionFor(p, 1)
        leftRef.current.style.transform = `translateY(${translateY}vh)`
        leftRef.current.style.opacity = String(opacity)
      }
      if (rightRef.current) {
        const { translateY, opacity } = motionFor(p, -1)
        rightRef.current.style.transform = `translateY(${translateY}vh)`
        rightRef.current.style.opacity = String(opacity)
      }

      raf = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="section section--spin">
      <div className="feature-sticky">
        <div className="feature-sticky__left" ref={leftRef}>
          <h2>EMBRACING GREEN ENERGY FOR A SUSTAINABLE WORLD</h2>
        </div>
        <div className="feature-sticky__right" ref={rightRef}>
          <p>
            With a plant first approach, we are making a sustainable
            impact by propelling green energy solutions.
          </p>
        </div>
      </div>
    </section>
  )
}

