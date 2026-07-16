/**
 * Empty spacer only. This still needs to exist in the normal document
 * flow with real height (via .hero.section's min-height: 100vh) so
 * ScrollTrigger has something to measure scroll distance against —
 * that's what produces scrollState.sectionProgress.
 *
 * The actual visible hero UI lives in HeroContent.tsx, which is
 * position: fixed (like the earth/nav) and driven ENTIRELY by reading
 * scrollState — it does not sit inside this element, so native
 * document scroll can't drag it around. Only our own JS moves it.
 */
export default function Hero() {
  return <section className="hero section" />
}
