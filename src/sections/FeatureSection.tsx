import { useEffect, useRef } from 'react'
import { scrollState } from '../state/scrollState'

// Each word gets its own slice of the overall fade window, staggered
// by its position in the sentence — that's what makes it read as an
// "ascending" cascade rather than the whole line popping at once.
const FADE_IN_END = 0.18
const FADE_OUT_START = 0.82

function wordStyle(p: number, index: number, total: number) {
  const inStart = (index / total) * (FADE_IN_END * 0.7)
  const inEnd = inStart + FADE_IN_END * 0.45
  const outStart = FADE_OUT_START + (index / total) * ((1 - FADE_OUT_START) * 0.5)
  const outEnd = outStart + (1 - FADE_OUT_START) * 0.6

  let settledT: number // 0 = hidden below, 1 = settled in place
  if (p < inEnd) {
    settledT = Math.min(Math.max((p - inStart) / (inEnd - inStart), 0), 1)
  } else if (p < outStart) {
    settledT = 1
  } else {
    settledT = 1 - Math.min(Math.max((p - outStart) / (outEnd - outStart), 0), 1)
  }

  return {
    translateY: (1 - settledT) * 26, // px — rises up into place
    rotateX: (1 - settledT) * 55, // deg — flattens out as it settles, the "3D" part
    opacity: settledT,
  }
}

const LEFT_TEXT = 'EMBRACING GREEN ENERGY FOR A SUSTAINABLE WORLD'
const RIGHT_TEXT =
  "With a plant first approach, we are making a sustainable impact by propelling green energy solutions."

export default function FeatureSection() {
  const leftRef = useRef<HTMLHeadingElement>(null)
  const rightRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      const isThis = scrollState.activeSection === 1
      const p = isThis ? scrollState.sectionProgress : 0

      for (const ref of [leftRef, rightRef]) {
        if (!ref.current) continue
        const words = ref.current.querySelectorAll<HTMLElement>('.word')
        words.forEach((word, i) => {
          const { translateY, rotateX, opacity } = wordStyle(p, i, words.length)
          word.style.transform = `translateY(${translateY}px) rotateX(${rotateX}deg)`
          word.style.opacity = String(opacity)
        })
      }

      raf = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="section section--spin">
      <div className="feature-sticky">
        <div className="feature-sticky__left">
          <h2 ref={leftRef} className="ascend-text">
            {LEFT_TEXT.split(' ').map((w, i) => (
              <span className="word" key={i}>
                {w}&nbsp;
              </span>
            ))}
          </h2>
        </div>
        <div className="feature-sticky__right">
          <p ref={rightRef} className="ascend-text">
            {RIGHT_TEXT.split(' ').map((w, i) => (
              <span className="word" key={i}>
                {w}&nbsp;
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
