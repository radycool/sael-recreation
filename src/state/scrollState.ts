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
