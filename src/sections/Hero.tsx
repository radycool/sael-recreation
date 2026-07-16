import { BRAND_NAME } from '../components/Nav'

export default function Hero() {
  return (
    <section className="hero section">
      <div className="corner-dot" />

      <div className="eyebrow-top">MADE FOR THE PLANET. BUILT TO LAST.</div>

      <h1 className="hero-wordmark">{BRAND_NAME}</h1>

      <p className="hero-tagline">
        Designed to track, measure, and act — {BRAND_NAME} makes
        sustainability feel considered, not complicated.
      </p>

      <div className="info-card">
        <p className="info-card__title">
          DESIGNED WITH PURPOSE,
          <br />
          BY A TEAM THAT CARES.
        </p>
        <hr />
        <p className="info-card__body">
          Replace this with your real founder/brand story —
          same spot as Oryzo's "Designed by Lusion" card.
        </p>
      </div>

      <div className="scroll-cue">
        <span className="scroll-cue__chevron">⌄</span>
        SCROLL TO CONTINUE
      </div>
    </section>
  )
}
