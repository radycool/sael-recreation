import { useRef, type ReactNode } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Group } from 'three'
import { scrollState, getSpinPhase } from '../state/scrollState'

// Constant across every section now — the model no longer grows or
// shrinks as you scroll. Only rotation changes.
const BASE_SCALE = 0.85
const BASE_CAM_Z = 5
const BASE_POS_Y = -0.15

export default function ScrollRig({ children }: { children: ReactNode }) {
  const group = useRef<Group>(null)
  const { camera } = useThree()

  useFrame(() => {
    if (!group.current) return

    const { activeSection, sectionProgress } = scrollState

    group.current.scale.setScalar(BASE_SCALE)
    group.current.position.y = BASE_POS_Y
    camera.position.z = BASE_CAM_Z

    if (activeSection === 0) {
      // Hero: settled, no spin — this is the "resting" state before
      // any content-section spin sequence begins.
      group.current.rotation.y = 0
    } else {
      // Content sections: fade-in -> spin once -> hold -> fade-out,
      // same timeline the text opacity uses (see Section.tsx).
      const { rotationDeg } = getSpinPhase(sectionProgress)
      group.current.rotation.y = (rotationDeg * Math.PI) / 180
    }
  })

  return <group ref={group}>{children}</group>
}
