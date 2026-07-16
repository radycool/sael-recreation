import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import EarthModel from './EarthModel'

type SceneProps = {
  modelPath: string
}

/**
 * This is Step 2 of the scroll-sync system: for now, OrbitControls
 * lets you freely rotate/zoom with your mouse so you can inspect the
 * model and decide on a good default scale/angle. In Step 4, we'll
 * REMOVE OrbitControls and replace mouse control with scroll control
 * — that's the actual Oryzo mechanism.
 */
export default function Scene({ modelPath }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 35 }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}
    >
      {/* Soft overall light so nothing is pitch black */}
      <ambientLight intensity={0.6} />
      {/* Key light — main light source, like a sun */}
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
      {/* Rim light — subtle accent from behind, matches Oryzo's moody edge glow */}
      <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#3fa9ff" />

      {/* Environment gives realistic reflections on any shiny/metallic materials */}
      <Environment preset="city" />

      <Suspense fallback={null}>
        <EarthModel path={modelPath} scale={1.5} />
      </Suspense>

      {/* TEMPORARY — for inspecting the model only. Removed in Step 4. */}
      <OrbitControls enablePan={false} />
    </Canvas>
  )
}
