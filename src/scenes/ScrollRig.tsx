import { useRef, type ReactNode } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Group } from 'three'
import { scrollState } from '../state/scrollState'
import { HAND_ENTER_END } from './HandRig'

const BASE_SCALE = 0.95
const BASE_CAM_Z = 5
const BASE_POS_Y = -0.15

// Hero grows the earth by 20% across its own scroll range.
const HERO_GROW_TO = BASE_SCALE * 1.2
const HERO_GROW_END = 0.9

// Section 1 ("isn't just a dashboard"): must match FeatureSection.tsx's
// own timing exactly — text fade-in ends where the tumble/grow starts,
// and text fade-out starts exactly where the earth begins settling
// back down, so nothing drifts out of sync between the two.
//
// Continuity matters here: this section STARTS at HERO_GROW_TO (right
// where the hero left off) and grows another 20% on top of that —
// not a reset back to BASE_SCALE, which was causing a visible jump
// in earth size right at the section boundary.
const FEATURE_TEXT_IN_END = 0.15
const FEATURE_HOLD_END = 0.75
const FEATURE_SETTLE_END = 0.95
const FEATURE_GROW_TO = HERO_GROW_TO * 1.2

// Section 2 (hand): earth shrinks down to "fit in the hand" over the
// same window the hand takes to arrive (HAND_ENTER_END, from
// HandRig.tsx), then holds — continuous from BASE_SCALE, no jump.
const HAND_HOLD_SCALE = 0.5
const HAND_HOLD_POS_Y = 0.55 // sits just above the hand's settled palm

export default function ScrollRig({ children }: { children: ReactNode }) {
  const group = useRef<Group>(null)
  const { camera } = useThree()

  useFrame(() => {
    if (!group.current) return

    const { activeSection, sectionProgress: p } = scrollState

    camera.position.z = BASE_CAM_Z

    if (activeSection === 0) {
      // Hero: no spin, but scales up as you scroll through it — this
      // is the "lift" into the next section.
      group.current.position.y = BASE_POS_Y
      const growT = Math.min(Math.max(p / HERO_GROW_END, 0), 1)
      group.current.scale.setScalar(BASE_SCALE + growT * (HERO_GROW_TO - BASE_SCALE))
      group.current.rotation.y = 0
      group.current.rotation.x = 0
    } else if (activeSection === 1) {
      group.current.position.y = BASE_POS_Y
      // Scale: starts exactly at HERO_GROW_TO (continuous with where
      // the hero left off), ramps up through the hold window, then
      // settles back down to resting size as the section wraps up.
      let scale: number
      if (p < FEATURE_TEXT_IN_END) {
        scale = HERO_GROW_TO
      } else if (p < FEATURE_HOLD_END) {
        const t = (p - FEATURE_TEXT_IN_END) / (FEATURE_HOLD_END - FEATURE_TEXT_IN_END)
        scale = HERO_GROW_TO + t * (FEATURE_GROW_TO - HERO_GROW_TO)
      } else if (p < FEATURE_SETTLE_END) {
        const t = (p - FEATURE_HOLD_END) / (FEATURE_SETTLE_END - FEATURE_HOLD_END)
        scale = FEATURE_GROW_TO - t * (FEATURE_GROW_TO - BASE_SCALE)
      } else {
        scale = BASE_SCALE
      }
      group.current.scale.setScalar(scale)

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
    } else if (activeSection === 2) {
      // Continuous from BASE_SCALE (where section 1 left off) down to
      // the smaller "held in hand" size, over the same window the
      // hand takes to arrive — then just holds.
      const t = Math.min(Math.max(p / HAND_ENTER_END, 0), 1)
      group.current.scale.setScalar(BASE_SCALE + t * (HAND_HOLD_SCALE - BASE_SCALE))
      group.current.position.y = BASE_POS_Y + t * (HAND_HOLD_POS_Y - BASE_POS_Y)
      group.current.rotation.y = 0
      group.current.rotation.x = 0
    } else {
      group.current.position.y = BASE_POS_Y
      group.current.scale.setScalar(BASE_SCALE)
      group.current.rotation.y = 0
      group.current.rotation.x = 0
    }
  })

  return <group ref={group}>{children}</group>
}
