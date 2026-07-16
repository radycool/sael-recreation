import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Suspense } from 'react'
import ScrollRig from './ScrollRig'
// import HandRig from './HandRig' // hand section on hold for now

type SceneProps = {
  modelPath: string
  secondaryModelPath: string
}

export default function Scene({ modelPath, secondaryModelPath }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 35 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 1 }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
      <directionalLight position={[-4, -2, -3]} intensity={0.5} color="#3fa9ff" />
      <Environment preset="city" />

      <Suspense fallback={null}>
        <ScrollRig primaryModelPath={modelPath} secondaryModelPath={secondaryModelPath} />
        {/* <HandRig /> — hand section on hold for now */}
      </Suspense>
    </Canvas>
  )
}
