import { useEffect, useRef } from 'react'
import { scrollState } from '../state/scrollState'
import { HAND_ENTER_END, HAND_HOLD_END } from '../scenes/HandRig'
import { BRAND_NAME } from '../components/Nav'

export default function HandSection() {
  const headingRef = useRef<HTMLDivElement>(null)
  const capRef = useRef<HTMLParagraphElement>(null)
  const footnoteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      const isThis = scrollState.activeSection === 2
      const p = isThis ? scrollState.sectionProgress : 0

      let t: number // 0 = smoke/invisible, 1 = fully resolved
      if (p < HAND_ENTER_END) {
        t = Math.min(Math.max(p / HAND_ENTER_END, 0), 1)
      } else if (p < HAND_HOLD_END) {
        t = 1
      } else {
        t = 1 - Math.min(Math.max((p - HAND_HOLD_END) / (1 - HAND_HOLD_END), 0), 1)
      }

      const blur = (1 - t) * 18 // px
      const opacity = t
      const translateY = (1 - t) * 14 // px, settles slightly as it resolves

      for (const ref of [headingRef, capRef, footnoteRef]) {
        if (!ref.current) continue
        ref.current.style.filter = `blur(${blur}px)`
        ref.current.style.opacity = String(opacity)
        ref.current.style.transform = `translateY(${translateY}px)`
      }

      raf = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="section section--spin">
      <div className="hand-sticky">
        <div className="hand-heading" ref={headingRef}>
          <h2>
            Powered by AI<span className="hand-heading__star">*</span>
          </h2>
          <div className="hand-heading__model">{BRAND_NAME}-1</div>
        </div>

        <p className="hand-caption" ref={capRef}>
          Try to hover the hand
        </p>

        <div className="hand-footnote" ref={footnoteRef}>
          * Internal R&amp;D render
        </div>
      </div>
    </section>
  )
}
