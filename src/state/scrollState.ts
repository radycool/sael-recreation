/**
 * This is intentionally NOT React state (no useState).
 * Scroll fires constantly — if we ran a React re-render on every
 * pixel of scroll, the app would be sluggish. Instead, GSAP writes
 * numbers directly onto this plain object, and Three.js reads them
 * every animation frame (in useFrame) — bypassing React entirely
 * for this high-frequency data.
 */
export const scrollState = {
  globalProgress: 0, // 0 -> 1 across the entire page
  activeSection: 0, // index of the section currently in view
  sectionProgress: 0, // 0 -> 1 progress through that specific section
}

/**
 * The "fade in -> spin once -> hold -> fade out" timeline for a
 * content section. Takes t (0-1, how far scrolled through THIS
 * section) and returns how visible the text should be, and what
 * rotation (in degrees) the model should be at.
 *
 *   0% ─────── 15% ───────────────── 85% ─────── 100%
 *   fade in    │      full 360° spin      │   fade out
 *              └── text fully visible ────┘
 */
export function getSpinPhase(t: number) {
  const FADE_IN_END = 0.15
  const HOLD_END = 0.85

  if (t <= FADE_IN_END) {
    return { opacity: t / FADE_IN_END, rotationDeg: 0 }
  }
  if (t <= HOLD_END) {
    const local = (t - FADE_IN_END) / (HOLD_END - FADE_IN_END)
    return { opacity: 1, rotationDeg: local * 360 }
  }
  const local = (t - HOLD_END) / (1 - HOLD_END)
  return { opacity: 1 - local, rotationDeg: 360 }
}
