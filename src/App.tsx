import { useScrollSync } from './hooks/useScrollSync'
import Scene from './scenes/Scene'
import Hero from './sections/Hero'
import FeatureSection from './sections/FeatureSection'
import PortableSection from './sections/PortableSection'
// import HandSection from './sections/HandSection' // hand section on hold for now
import LoadingScreen from './components/LoadingScreen'
import HeroBackground from './components/HeroBackground'
import HeroContent from './components/HeroContent'
import Nav from './components/Nav'
import PromoVideo from './components/PromoVideo'

export default function App() {
  useScrollSync()

  return (
    <main>
      <LoadingScreen />

      {/* Hero backdrop image, fades out as you scroll past the hero */}
      <HeroBackground />

      {/* Fixed 3D layer — stays in place, reacts to scroll */}
      <Scene modelPath="/models/earth-model.glb" secondaryModelPath="/models/earthquakes-2000-2019.glb" />

      {/* Fixed hero text layer — driven entirely by scrollState, not
          by native document scroll (see HeroContent.tsx) */}
      <HeroContent />

      {/* Nav bar + vertical side label — always on top */}
      <Nav />

      {/* Bottom-right video widget — hover grows it, click plays it */}
      <PromoVideo />

      {/* Scrollable content layer */}
      <div id="content">
        {/* Empty spacer — just gives ScrollTrigger real height to
            measure the hero's scroll progress against */}
        <Hero />

        <FeatureSection />

        <PortableSection />

        {/* <HandSection /> — hand section on hold for now */}
      </div>
    </main>
  )
}
