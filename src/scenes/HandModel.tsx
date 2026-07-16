import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import { Box3, Mesh, Vector3 } from 'three'

type HandModelProps = {
  path: string
  scale?: number
}

/**
 * Same normalization approach as EarthModel.tsx — measures the actual
 * bounding box after load and scales to a consistent target size, so
 * it behaves predictably regardless of what units the source file
 * (Sketchfab, in this case) was exported at.
 */
export default function HandModel({ path, scale = 1 }: HandModelProps) {
  const { scene } = useGLTF(path)

  const { normalizedScale, center } = useMemo(() => {
    const box = new Box3().setFromObject(scene)
    const size = box.getSize(new Vector3())
    const maxDim = Math.max(size.x, size.y, size.z) || 1
    const targetSize = 2.4 // tune this to resize the hand overall
    return {
      normalizedScale: targetSize / maxDim,
      center: box.getCenter(new Vector3()),
    }
  }, [scene])

  scene.traverse((child) => {
    if ((child as Mesh).isMesh) {
      const mesh = child as Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true
    }
  })

  return (
    <group scale={normalizedScale * scale}>
      <primitive object={scene} position={[-center.x, -center.y, -center.z]} />
    </group>
  )
}

useGLTF.preload('/models/hand.glb')
