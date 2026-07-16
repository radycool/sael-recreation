import { useRef, type ReactNode } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Group } from 'three'
import { scrollState } from '../state/scrollState'

const BASE_SCALE = 0.95
const BASE_CAM_Z = 5
const BASE_POS_Y = -0.15

// How much the earth grows across the hero's own scroll range — by
// the time you've scrolled 90% through the hero, it's ~1.9x its
// resting size, giving the "lift" a real sense of the camera closing
// in rather than just text fading around a static object.
const HERO_GROW_TO = 1.9
const HERO_GROW_END = 0.9

// Section 1 ("isn't just a dashboard"): must match FeatureSection.tsx's
// own timing exactly — text fade-in ends where the tumble/grow starts,
// and text fade-out starts exactly where the earth begins settling
// back down, so nothing drifts out of sync between the two.
const FEATURE_TEXT_IN_END = 0.15
const FEATURE_HOLD_END = 0.75
const FEATURE_SETTLE_END = 0.95
const FEATURE_GROW_TO = 2.3

export default function ScrollRig({ children }: { children: ReactNode }) {
  const group = useRef<Group>(null)
  const { camera } = useThree()

  useFrame(() => {
    if (!group.current) return

    const { activeSection, sectionProgress: p } = scrollState

    group.current.position.y = BASE_POS_Y
    camera.position.z = BASE_CAM_Z

    if (activeSection === 0) {
      // Hero: no spin, but scales up as you scroll through it — this
      // is the "lift" into the next section.
      const growT = Math.min(Math.max(p / HERO_GROW_END, 0), 1)
      group.current.scale.setScalar(BASE_SCALE + growT * (HERO_GROW_TO - BASE_SCALE))
      group.current.rotation.y = 0
      group.current.rotation.x = 0
    } else if (activeSection === 1) {
      // Scale: ramps up through the hold window, then settles back
      // down to resting size as the section wraps up.
      let scaleT: number
      if (p < FEATURE_TEXT_IN_END) {
        scaleT = 0
      } else if (p < FEATURE_HOLD_END) {
        scaleT = (p - FEATURE_TEXT_IN_END) / (FEATURE_HOLD_END - FEATURE_TEXT_IN_END)
      } else if (p < FEATURE_SETTLE_END) {
        scaleT = 1 - (p - FEATURE_HOLD_END) / (FEATURE_SETTLE_END - FEATURE_HOLD_END)
      } else {
        scaleT = 0
      }
      group.current.scale.setScalar(BASE_SCALE + scaleT * (FEATURE_GROW_TO - BASE_SCALE))

      // Rotation: one continuous tumble across the hold window — the
      // first half turns on the Y axis (side to side), the second
      // half continues on the X axis (top to bottom), rather than a
      // flat single-axis spin. Holds at that final orientation while
      // scale settles back down, instead of un-rotating.
      const holdT = Math.min(Math.max((p - FEATURE_TEXT_IN_END) / (FEATURE_HOLD_END - FEATURE_TEXT_IN_END), 0), 1)
      if (holdT < 0.5) {
        group.current.rotation.y = (holdT / 0.5) * Math.PI
        group.current.rotation.x = 0
      } else {
        group.current.rotation.y = Math.PI
        group.current.rotation.x = ((holdT - 0.5) / 0.5) * Math.PI
      }
    } else {
      group.current.scale.setScalar(BASE_SCALE)
      group.current.rotation.y = 0
      group.current.rotation.x = 0
    }
  })

  return <group ref={group}>{children}</group>
}
