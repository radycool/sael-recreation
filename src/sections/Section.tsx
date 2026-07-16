import { useEffect, useRef } from 'react'
import { scrollState, getSpinPhase } from '../state/scrollState'

type SectionProps = {
  eyebrow: string
  title: string
  body: string
  /** This section's position in the scroll order (Hero is implicitly 0) */
  index: number
}

export default function Section({ eyebrow, title, body, index }: SectionProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      if (ref.current) {
        const isThisSection = scrollState.activeSection === index
        const opacity = isThisSection ? getSpinPhase(scrollState.sectionProgress).opacity : 0
        ref.current.style.opacity = String(opacity)
      }
      raf = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(raf)
  }, [index])

  return (
    // Taller than the viewport on purpose — see .section--spin in
    // global.css. The extra height is what gives the spin sequence
    // room to play out over a comfortable scroll distance, without
    // ever pausing native scroll.
    <section className="section section--spin">
      <div ref={ref} className="section__sticky">
        <div className="eyebrow">{eyebrow}</div>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
    </section>
  )
}
