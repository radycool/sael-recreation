import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Group } from 'three'
import { scrollState } from '../state/scrollState'
import EarthModel from './EarthModel'

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

// Section 2 ("So portable, it's wearable" / outline-morph section):
// three partial rotations — outline morph, heading arrival, then a
// model-swap spin — followed by a dramatic scale-up finale so it
// feels like the camera is diving in. Must match PortableSection.tsx's
// own timing exactly.
export const PORTABLE_OUTLINE_END = 0.25 // circle -> square completes
export const PORTABLE_HEADING_START = 0.3
export const PORTABLE_HEADING_END = 0.55 // big heading fully arrived
export const PORTABLE_SWAP_END = 0.65 // model-swap spin + crossfade completes
export const PORTABLE_SHINE_END = 0.65 // text "shine" finishes (same point)
export const PORTABLE_GROW_START = 0.65
const PORTABLE_ROT1_DEG = 70
const PORTABLE_ROT2_DEG = 70
const PORTABLE_SWAP_ROT_DEG = 90
const PORTABLE_GROW_TO = 14 // huge — "feel like we're inside it"

// NOTE: if HandSection.tsx is re-enabled later, this becomes section
// 3 and the hand-hold branch (removed here) needs restoring above.

type ScrollRigProps = {
  primaryModelPath: string
  secondaryModelPath: string
}

export default function ScrollRig({ primaryModelPath, secondaryModelPath }: ScrollRigProps) {
  const group = useRef<Group>(null)
  const primaryRef = useRef<Group>(null)
  const secondaryRef = useRef<Group>(null)
  const { camera } = useThree()

  useFrame(() => {
    if (!group.current) return

    const { activeSection, sectionProgress: p } = scrollState

    camera.position.z = BASE_CAM_Z

    // Default: only the primary model shown, secondary hidden. Section
    // 2 overrides this during its swap window (see below).
    if (primaryRef.current) primaryRef.current.scale.setScalar(1)
    if (secondaryRef.current) secondaryRef.current.scale.setScalar(0)

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
      group.current.position.y = BASE_POS_Y

      // Rotation: partial turn during the outline morph, holds,
      // partial turn during the heading's arrival, holds, partial
      // "swap spin" while the model crossfades, then keeps slowly
      // turning through the final zoom-in for a "diving in" feel.
      const deg2rad = Math.PI / 180
      let rotDeg: number
      if (p < PORTABLE_OUTLINE_END) {
        rotDeg = (p / PORTABLE_OUTLINE_END) * PORTABLE_ROT1_DEG
      } else if (p < PORTABLE_HEADING_START) {
        rotDeg = PORTABLE_ROT1_DEG
      } else if (p < PORTABLE_HEADING_END) {
        const t = (p - PORTABLE_HEADING_START) / (PORTABLE_HEADING_END - PORTABLE_HEADING_START)
        rotDeg = PORTABLE_ROT1_DEG + t * PORTABLE_ROT2_DEG
      } else if (p < PORTABLE_SWAP_END) {
        const t = (p - PORTABLE_HEADING_END) / (PORTABLE_SWAP_END - PORTABLE_HEADING_END)
        rotDeg = PORTABLE_ROT1_DEG + PORTABLE_ROT2_DEG + t * PORTABLE_SWAP_ROT_DEG
      } else {
        const t = (p - PORTABLE_GROW_START) / (1 - PORTABLE_GROW_START)
        rotDeg = PORTABLE_ROT1_DEG + PORTABLE_ROT2_DEG + PORTABLE_SWAP_ROT_DEG + t * 180
      }
      group.current.rotation.y = rotDeg * deg2rad
      group.current.rotation.x = 0

      // Model crossfade — happens WHILE the swap-spin plays, so the
      // earth is mid-turn when it changes rather than popping while
      // static. Primary shrinks to 0, secondary grows to 1, same t.
      if (p >= PORTABLE_HEADING_END && p < PORTABLE_SWAP_END) {
        const t = (p - PORTABLE_HEADING_END) / (PORTABLE_SWAP_END - PORTABLE_HEADING_END)
        if (primaryRef.current) primaryRef.current.scale.setScalar(1 - t)
        if (secondaryRef.current) secondaryRef.current.scale.setScalar(t)
      } else if (p >= PORTABLE_SWAP_END) {
        if (primaryRef.current) primaryRef.current.scale.setScalar(0)
        if (secondaryRef.current) secondaryRef.current.scale.setScalar(1)
      }

      // Scale: flat until the grow phase, then ramps up hard (eased
      // in) into an oversized, screen-filling finale.
      if (p < PORTABLE_GROW_START) {
        group.current.scale.setScalar(BASE_SCALE)
      } else {
        const t = Math.min(Math.max((p - PORTABLE_GROW_START) / (1 - PORTABLE_GROW_START), 0), 1)
        const eased = t * t // ease-in — starts slow, accelerates
        group.current.scale.setScalar(BASE_SCALE + eased * (PORTABLE_GROW_TO - BASE_SCALE))
      }
    } else {
      // Past the "diving in" finale — both models hidden rather than
      // letting the primary one pop back to a small default size,
      // which would undo the immersive grow-huge effect abruptly.
      group.current.position.y = BASE_POS_Y
      group.current.scale.setScalar(BASE_SCALE)
      group.current.rotation.y = 0
      group.current.rotation.x = 0
      if (primaryRef.current) primaryRef.current.scale.setScalar(0)
      if (secondaryRef.current) secondaryRef.current.scale.setScalar(0)
    }
  })

  return (
    <group ref={group}>
      <group ref={primaryRef}>
        <EarthModel path={primaryModelPath} scale={1} />
      </group>
      <group ref={secondaryRef}>
        <EarthModel path={secondaryModelPath} scale={1} />
      </group>
    </group>
  )
}
