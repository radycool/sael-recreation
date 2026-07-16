import { useEffect, useRef } from 'react'
import { scrollState } from '../state/scrollState'

const TIMELINE = [
  { year: '1999', title: 'Foundation of SAEL', img: '/images/journey/01.jpg' },
  { year: '2004–2006', title: 'Diversification into Energy', img: '/images/journey/02.jpg' },
  { year: '2010s', title: 'Biomass Leadership', img: '/images/journey/03.jpg' },
  { year: '2017–2021', title: 'Solar Expansion', img: '/images/journey/04.jpg' },
  { year: '2022', title: 'SAEL Industries Limited', img: '/images/journey/05.jpg' },
  { year: '2023', title: 'Integrated Renewable Platform', img: '/images/journey/06.jpg' },
  { year: '2024', title: 'Manufacturing Scale-Up', img: '/images/journey/07.jpg' },
  { year: '2025', title: 'Gigawatt Growth', img: '/images/journey/08.webp' },
  { year: '2026', title: 'Integrated Green Energy Leader', img: '/images/journey/01.jpg' },
]

// Heading/eyebrow: starts big and centered, migrates to a small
// top-left section header (not the nav corner — a page-section
// header, same idea as "SO PORTABLE," in the ref).
const HEADER_MOVE_END = 0.35
// Box: grows from a small square guide into the full carousel frame
// over the same window the header is migrating.
const BOX_GROW_END = 0.35
// Carousel: the rest of the section scrolls horizontally through
// the timeline cards, one per roughly equal slice of progress.
const CAROUSEL_START = 0.38

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export default function JourneySection() {
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf: number
    const update = () => {
      const isThis = scrollState.activeSection === 3
      const p = isThis ? scrollState.sectionProgress : 0

      const headerT = Math.min(Math.max(p / HEADER_MOVE_END, 0), 1)
      const introOpacity = Math.min(Math.max(p / 0.08, 0), 1)

      // Heading + eyebrow travel together: center -> top-left header.
      for (const [ref, sizeFrom, sizeTo] of [
        [eyebrowRef, 0, 0],
        [headingRef, 64, 34], // px font-size, big centered -> small header
      ] as const) {
        const el = ref.current
        if (!el) continue
        const topVH = lerp(50, 14, headerT)
        const leftVW = lerp(50, 6, headerT)
        const translateXPercent = lerp(-50, 0, headerT)
        const translateYPercent = lerp(-50, 0, headerT)
        el.style.top = `${topVH}vh`
        el.style.left = `${leftVW}vw`
        el.style.transform = `translate(${translateXPercent}%, ${translateYPercent}%)`
        el.style.opacity = String(introOpacity)
        if (sizeFrom !== sizeTo) {
          el.style.fontSize = `${lerp(sizeFrom, sizeTo, headerT)}px`
        }
      }
      // Eyebrow sits just above the heading, offset a bit less so it
      // doesn't overlap once both are small.
      if (eyebrowRef.current) {
        const topVH = lerp(45, 10, headerT)
        eyebrowRef.current.style.top = `${topVH}vh`
      }

      // Box grows from a small centered square into the full
      // carousel frame.
      if (boxRef.current) {
        const growT = Math.min(Math.max(p / BOX_GROW_END, 0), 1)
        const widthVW = lerp(30, 72, growT)
        const heightVH = lerp(36, 56, growT)
        boxRef.current.style.width = `${widthVW}vw`
        boxRef.current.style.height = `${heightVH}vh`
        boxRef.current.style.opacity = String(introOpacity)
      }

      // Carousel — shifts one full card-width per equal slice of the
      // remaining scroll range.
      if (trackRef.current) {
        const t = Math.min(Math.max((p - CAROUSEL_START) / (1 - CAROUSEL_START), 0), 1)
        const shiftPercent = t * (TIMELINE.length - 1) * 100
        trackRef.current.style.transform = `translateX(-${shiftPercent}%)`
      }

      raf = requestAnimationFrame(update)
    }
    update()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <section className="section section--spin journey-section">
      <div className="journey-sticky">
        <div className="journey-eyebrow" ref={eyebrowRef}>
          KNOW SAEL BETTER
        </div>
        <h2 className="journey-heading" ref={headingRef}>
          OUR JOURNEY
        </h2>

        <div className="journey-box" ref={boxRef}>
          <div className="journey-track" ref={trackRef}>
            {TIMELINE.map((item) => (
              <div className="journey-card" key={item.year}>
                <img src={item.img} alt={item.title} className="journey-card__img" />
                <div className="journey-card__overlay">
                  <div className="journey-card__year">{item.year}</div>
                  <div className="journey-card__title">{item.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
