import { useScrollSync } from './hooks/useScrollSync'
import Scene from './scenes/Scene'
import Section from './sections/Section'

export default function App() {
  // Sets up Lenis smooth scroll + GSAP ScrollTrigger.
  // From this point on, scrolling drives the 3D model — no mouse
  // interaction needed. This is Step 3, the real Oryzo mechanism.
  useScrollSync()

  return (
    <main>
      {/* Fixed 3D layer — stays in place, reacts to scroll */}
      <Scene modelPath="/models/earth-model.glb" />

      {/* Scrollable content layer, sits on top */}
      <div id="content">
        <Section
          eyebrow="Introducing"
          title="A promise to the planet."
          body="This is the hero section. Scroll down — the model rotates, scales, and the camera moves as you pass through each section below."
        />
        <Section
          eyebrow="Materials"
          title="Made to leave less behind."
          body="Replace this with your real copy. Each section owns its own moment in the model's animation, defined in ScrollRig's keyframes array."
        />
        <Section
          eyebrow="Impact"
          title="Every choice, measured."
          body="This is where a data-driven section could live — we can swap in your earthquakes model here later if that fits your sustainability story."
        />
        <Section
          eyebrow="Available now"
          title="Join the shift."
          body="This is your closing / CTA section."
        />
      </div>
    </main>
  )
}
