import { useEffect, useRef } from 'react'
import { scrollState } from '../state/scrollState'
import { BRAND_NAME } from '../components/Nav'

// Must match ScrollRig's FEATURE_* constants exactly — text visibility
// and the earth's tumble/grow are two separate systems reading the
// same scrollState, so they need the same windows to stay in sync.
const TEXT_IN_END = 0.15
const HOLD_END = 0.75
const SETTLE_END = 0.95

export default function FeatureSection() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      if (ref.current) {
        const isThis = scrollState.activeSection === 1
        const p = isThis ? scrollState.sectionProgress : 0

        let opacity = 0
        if (isThis) {
          if (p < TEXT_IN_END) {
            opacity = p / TEXT_IN_END
          } else if (p < HOLD_END) {
            // Fully visible and completely static through the whole
            // tumble/grow — no repositioning, no re-fading, nothing
            // overlapping while the earth does its thing.
            opacity = 1
          } else {
            opacity = 1 - Math.min((p - HOLD_END) / (SETTLE_END - HOLD_END), 1)
          }
        }
        ref.current.style.opacity = String(Math.min(Math.max(opacity, 0), 1))
      }
      raf = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="section section--spin">
      <div ref={ref} className="feature-sticky">
        <div className="feature-sticky__left">
          <h2>
            ISN'T JUST
            <br />
            A DASHBOARD.
          </h2>
        </div>
        <div className="feature-sticky__right">
          <p>
            {BRAND_NAME} isn't just a monitoring tool. It's the result
            of unprecedented AI breakthroughs.
          </p>
        </div>
      </div>
    </section>
  )
}
