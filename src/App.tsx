import { useScrollSync } from './hooks/useScrollSync'
import Scene from './scenes/Scene'
import Section from './sections/Section'
import Hero from './sections/Hero'
import LoadingScreen from './components/LoadingScreen'
import HeroBackground from './components/HeroBackground'
import Nav from './components/Nav'

export default function App() {
  useScrollSync()

  return (
    <main>
      <LoadingScreen />

      {/* Hero backdrop image, fades out as you scroll past the hero */}
      <HeroBackground />

      {/* Fixed 3D layer — stays in place, reacts to scroll */}
      <Scene modelPath="/models/earth-model.glb" />

      {/* Nav bar + vertical side label — always on top */}
      <Nav />

      {/* Scrollable content layer */}
      <div id="content">
        <Hero />

        <Section
          index={1}
          eyebrow="Materials"
          title="Made to leave less behind."
          body="Replace this with your real copy. Each section owns its own fade-in, spin, and fade-out sequence as you scroll through it."
        />
        <Section
          index={2}
          eyebrow="Impact"
          title="Every choice, measured."
          body="This is where a data-driven section could live — we can swap in your earthquakes model here later if that fits your sustainability story."
        />
        <Section
          index={3}
          eyebrow="Available now"
          title="Join the shift."
          body="This is your closing / CTA section."
        />
      </div>
    </main>
  )
}
