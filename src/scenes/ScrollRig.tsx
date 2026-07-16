import { useRef, type ReactNode } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Group } from 'three'
import { scrollState } from '../state/scrollState'

/**
 * One entry per section, in the same order as your sections in App.tsx.
 * This is the "director's chair" — tune these numbers to choreograph
 * exactly how the model moves as each section comes into view.
 *   rotY  = rotation around the vertical axis (radians)
 *   scale = overall size multiplier
 *   posY  = vertical lift (negative = lower, positive = higher)
 *   camZ  = camera distance (lower = closer/bigger)
 */
const keyframes = [
  { rotY: 0, scale: 0.85, posY: -0.15, camZ: 5 }, // hero — sized to sit inside the viewfinder ring
  { rotY: Math.PI * 0.55, scale: 1.3, posY: 0.15, camZ: 4 }, // lifts up, comes closer
  { rotY: Math.PI * 1.2, scale: 1.1, posY: 0.05, camZ: 4.5 },
  { rotY: Math.PI * 1.85, scale: 0.9, posY: -0.1, camZ: 5.5 }, // settles again
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export default function ScrollRig({ children }: { children: ReactNode }) {
  const group = useRef<Group>(null)
  const { camera } = useThree()

  useFrame(() => {
    if (!group.current) return

    const { activeSection, sectionProgress } = scrollState
    const from = keyframes[activeSection] ?? keyframes[0]
    const to = keyframes[Math.min(activeSection + 1, keyframes.length - 1)]

    // Rotate + scale + lift the model based on how far through the section we are
    group.current.rotation.y = lerp(from.rotY, to.rotY, sectionProgress)
    group.current.scale.setScalar(lerp(from.scale, to.scale, sectionProgress))
    group.current.position.y = lerp(from.posY, to.posY, sectionProgress)

    // Smoothly ease the camera toward its target distance each frame,
    // rather than snapping — this is what makes it feel fluid.
    const targetZ = lerp(from.camZ, to.camZ, sectionProgress)
    camera.position.z = lerp(camera.position.z, targetZ, 0.06)
  })

  return <group ref={group}>{children}</group>
}
