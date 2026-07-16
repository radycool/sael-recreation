import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import { Mesh, Object3D } from 'three'

type EarthModelProps = {
  /** path relative to /public, e.g. "/models/earth-model.glb" */
  path: string
  scale?: number
}

/**
 * Loads a .glb file and drops it into the scene.
 * useGLTF caches loaded models, so switching between two models
 * and back doesn't re-download them.
 */
export default function EarthModel({ path, scale = 1 }: EarthModelProps) {
  const { scene } = useGLTF(path)
  const ref = useRef<Object3D>(null)

  // Make sure every mesh inside the model actually receives/casts
  // light correctly — some exported GLBs come in "flat" otherwise.
  scene.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mesh = child as Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true
    }
  })

  return <primitive ref={ref} object={scene} scale={scale} />
}

// Preload both models so switching between them is instant once loaded once.
useGLTF.preload('/models/earth-model.glb')
useGLTF.preload('/models/earthquakes-2000-2019.glb')
