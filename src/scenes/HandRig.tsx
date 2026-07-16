import { useEffect, useRef, Suspense, lazy } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { scrollState } from '../state/scrollState'

// Must match HandSection.tsx's own timing exactly — text visibility
// and the hand's reach/settle/exit are two separate systems reading
// the same scrollState progress, so they need identical windows.
export const HAND_ENTER_END = 0.2
export const HAND_HOLD_END = 0.8

// Resting position once settled — sits just under/behind where the
// earth ends up (see ScrollRig's hand-hold branch), so it reads as
// cupping the earth from below rather than two unrelated objects.
const SETTLED_POS: [number, number, number] = [0, -1.05, 0.35]
const START_POS: [number, number, number] = [0, -3.2, 0.1]

// Rotation reaches in at an angle, then levels out into a neutral
// "holding" pose once settled.
const START_ROT: [number, number, number] = [0.9, -0.15, -0.45]
const SETTLED_ROT: [number, number, number] = [0.35, 0, -0.08]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

const HandModel = lazy(() => import('./HandModel'))

export default function HandRig() {
  const group = useRef<Group>(null)
  const pointer = useRef({ x: 0, y: 0 })

  // Cheap global listener — only actually applied to the hand while
  // it's settled (see below), but no harm tracking it always.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame(() => {
    if (!group.current) return

    const { activeSection, sectionProgress: p } = scrollState

    if (activeSection < 2) {
      // Hasn't arrived yet — parked off-screen below, out of view.
      group.current.position.set(...START_POS)
      group.current.rotation.set(...START_ROT)
      group.current.visible = false
      return
    }

    group.current.visible = true

    if (p < HAND_ENTER_END) {
      // Reaching up into the settled position.
      const t = easeOutCubic(Math.min(Math.max(p / HAND_ENTER_END, 0), 1))
      group.current.position.set(
        lerp(START_POS[0], SETTLED_POS[0], t),
        lerp(START_POS[1], SETTLED_POS[1], t),
        lerp(START_POS[2], SETTLED_POS[2], t)
      )
      group.current.rotation.set(
        lerp(START_ROT[0], SETTLED_ROT[0], t),
        lerp(START_ROT[1], SETTLED_ROT[1], t),
        lerp(START_ROT[2], SETTLED_ROT[2], t)
      )
    } else if (p < HAND_HOLD_END) {
      // Settled — holds position, but tilts subtly toward the
      // pointer for a bit of interactivity while you're looking at it.
      const wobbleX = pointer.current.y * 0.12
      const wobbleY = pointer.current.x * 0.12
      group.current.position.set(...SETTLED_POS)
      group.current.rotation.set(
        SETTLED_ROT[0] + wobbleX,
        SETTLED_ROT[1] + wobbleY,
        SETTLED_ROT[2]
      )
    } else {
      // Exiting — descends back down out of frame.
      const t = Math.min(Math.max((p - HAND_HOLD_END) / (1 - HAND_HOLD_END), 0), 1)
      group.current.position.set(
        lerp(SETTLED_POS[0], START_POS[0], t),
        lerp(SETTLED_POS[1], START_POS[1], t),
        lerp(SETTLED_POS[2], START_POS[2], t)
      )
      group.current.rotation.set(
        lerp(SETTLED_ROT[0], START_ROT[0], t),
        lerp(SETTLED_ROT[1], START_ROT[1], t),
        lerp(SETTLED_ROT[2], START_ROT[2], t)
      )
    }
  })

  return (
    <group ref={group} visible={false}>
      <Suspense fallback={null}>
        <HandModel path="/models/hand.glb" />
      </Suspense>
    </group>
  )
}
