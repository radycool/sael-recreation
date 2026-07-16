import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { scrollState } from '../state/scrollState'

gsap.registerPlugin(ScrollTrigger)

/**
 * Call this once, at the top of App. It wires up:
 * 1. Lenis — intercepts native scroll and smooths it out (that
 *    "buttery" easing you feel on premium sites is Lenis).
 * 2. GSAP ScrollTrigger — watches scroll position and each .section
 *    element, and writes progress numbers into scrollState.
 */
export function useScrollSync() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    })

    // Keep ScrollTrigger in sync with Lenis's smoothed scroll position
    lenis.on('scroll', ScrollTrigger.update)

    // Drive Lenis's internal clock from GSAP's ticker (shared rAF loop)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Overall page progress, 0 -> 1
    const globalTrigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        scrollState.globalProgress = self.progress
      },
    })

    // Per-section progress — this is what lets each section define
    // its own moment in the model's animation.
    const sections = gsap.utils.toArray<HTMLElement>('.section')
    const sectionTriggers = sections.map((sec, i) =>
      ScrollTrigger.create({
        trigger: sec,
        start: 'top center',
        end: 'bottom center',
        onUpdate: (self) => {
          scrollState.activeSection = i
          scrollState.sectionProgress = self.progress
        },
        onEnter: () => {
          scrollState.activeSection = i
        },
        onEnterBack: () => {
          scrollState.activeSection = i
        },
        toggleClass: { targets: sec, className: 'is-active' },
      })
    )

    return () => {
      lenis.destroy()
      globalTrigger.kill()
      sectionTriggers.forEach((t) => t.kill())
    }
  }, [])
}
