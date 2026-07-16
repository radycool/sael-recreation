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
 *   camZ  = camera distance (lower = closer/bigger)
 */
const keyframes = [
  { rotY: 0, scale: 1.4, camZ: 6 }, // hero
  { rotY: Math.PI * 0.55, scale: 1.9, camZ: 4.2 }, // section 2
  { rotY: Math.PI * 1.2, scale: 1.6, camZ: 5.2 }, // section 3
  { rotY: Math.PI * 1.85, scale: 1.2, camZ: 7 }, // outro
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

    // Rotate + scale the model based on how far through the section we are
    group.current.rotation.y = lerp(from.rotY, to.rotY, sectionProgress)
    group.current.scale.setScalar(lerp(from.scale, to.scale, sectionProgress))

    // Smoothly ease the camera toward its target distance each frame,
    // rather than snapping — this is what makes it feel fluid.
    const targetZ = lerp(from.camZ, to.camZ, sectionProgress)
    camera.position.z = lerp(camera.position.z, targetZ, 0.06)
  })

  return <group ref={group}>{children}</group>
}
