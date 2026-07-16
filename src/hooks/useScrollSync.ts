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
    //
    // Hero (index 0) sits flush with the top of the page, so it needs
    // its own trigger anchored to the viewport TOP ('top top' -> 'bottom
    // top'), giving progress = 0 exactly at page load. The later
    // "spin/hold" sections are much taller than the viewport, so
    // 'top center' -> 'bottom center' is fine for them (that's what
    // centers the "hold" phase of getSpinPhase while they're in view).
    const sections = gsap.utils.toArray<HTMLElement>('.section')
    const sectionTriggers = sections.map((sec, i) =>
      ScrollTrigger.create({
        trigger: sec,
        start: i === 0 ? 'top top' : 'top center',
        end: i === 0 ? 'bottom top' : 'bottom center',
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
