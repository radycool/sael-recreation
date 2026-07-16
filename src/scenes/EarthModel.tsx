import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import { Box3, Mesh, Vector3 } from 'three'

type EarthModelProps = {
  /** path relative to /public, e.g. "/models/earth-model.glb" */
  path: string
  scale?: number
}

/**
 * Loads a .glb file and drops it into the scene — auto-normalized to
 * a consistent size regardless of what units it was exported at.
 *
 * WHY THIS MATTERS: different 3D tools (Blender, Spline, etc.) export
 * models at wildly different real-world scales — one Earth model
 * might be "2 units across", another might be "12,742,000 units
 * across" (literally Earth's diameter in km). Without normalizing,
 * the camera can end up effectively INSIDE an oversized model, which
 * is exactly what was happening — the globe filling the whole screen.
 *
 * Fix: measure the model's actual bounding box after loading, then
 * scale it so it's always ~1.2 units across, centered on its own
 * origin. From there, the `scale` prop and ScrollRig's keyframes
 * behave predictably no matter which model you load.
 */
export default function EarthModel({ path, scale = 1 }: EarthModelProps) {
  const { scene } = useGLTF(path)

  const { normalizedScale, center } = useMemo(() => {
    const box = new Box3().setFromObject(scene)
    const size = box.getSize(new Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const targetDiameter = 1.2 // tune this single number to resize ALL models at once
    return {
      normalizedScale: targetDiameter / maxDim,
      center: box.getCenter(new Vector3()),
    }
  }, [scene])

  // Make sure every mesh inside the model actually receives/casts
  // light correctly — some exported GLBs come in "flat" otherwise.
  scene.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mesh = child as Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true
    }
  })

  return (
    <group scale={normalizedScale * scale}>
      {/* offset cancels out the model's own off-center origin, so it
          always rotates around its true center, not some random point */}
      <primitive object={scene} position={[-center.x, -center.y, -center.z]} />
    </group>
  )
}

// Preload both models so switching between them is instant once loaded once.
useGLTF.preload('/models/earth-model.glb')
useGLTF.preload('/models/earthquakes-2000-2019.glb')
