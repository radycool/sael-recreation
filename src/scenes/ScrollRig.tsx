import { useRef, type ReactNode } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Group } from 'three'
import { scrollState, getSpinPhase } from '../state/scrollState'

const BASE_SCALE = 0.95
const BASE_CAM_Z = 5
const BASE_POS_Y = -0.15

// How much the earth grows across the hero's own scroll range — by
// the time you've scrolled 90% through the hero, it's ~1.9x its
// resting size, giving the "lift" a real sense of the camera closing
// in rather than just text fading around a static object.
const HERO_GROW_TO = 1.9
const HERO_GROW_END = 0.9

export default function ScrollRig({ children }: { children: ReactNode }) {
  const group = useRef<Group>(null)
  const { camera } = useThree()

  useFrame(() => {
    if (!group.current) return

    const { activeSection, sectionProgress } = scrollState

    group.current.position.y = BASE_POS_Y
    camera.position.z = BASE_CAM_Z

    if (activeSection === 0) {
      // Hero: no spin, but scales up as you scroll through it — this
      // is the "lift" into the next section.
      const growT = Math.min(Math.max(sectionProgress / HERO_GROW_END, 0), 1)
      group.current.scale.setScalar(BASE_SCALE + growT * (HERO_GROW_TO - BASE_SCALE))
      group.current.rotation.y = 0
    } else {
      // Content sections: fade-in -> spin once -> hold -> fade-out,
      // same timeline the text opacity uses (see Section.tsx).
      group.current.scale.setScalar(BASE_SCALE)
      const { rotationDeg } = getSpinPhase(sectionProgress)
      group.current.rotation.y = (rotationDeg * Math.PI) / 180
    }
  })

  return <group ref={group}>{children}</group>
}
