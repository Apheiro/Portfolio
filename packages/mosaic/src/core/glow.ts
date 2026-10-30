import { clamp } from './geometry.js';

interface GlowTiming {
  range: number;
  duration: number;
  delay: number;
}

/** The original stagger runs from delay to delay * 10 across the glow range. */
export function glowCycleDuration(glow: GlowTiming): number {
  return glow.duration + (glow.range > 0 ? glow.delay * 10 : 0);
}

/** Sample a tile's complete rise-and-fade pulse, leaving its delayed tail intact. */
export function glowIntensity(
  distance: number,
  cycleProgress: number,
  glow: GlowTiming,
): number {
  if (distance > glow.range || distance === 0) return 0;
  const falloff = glow.range > 0 ? clamp(distance / glow.range) : 0;
  const delay = glow.delay * (1 + 9 * falloff);
  const elapsed = cycleProgress * glowCycleDuration(glow) - delay;
  const phase = clamp(elapsed / glow.duration);
  // Anime.js's original keyframes ease each half of border -> glow -> border.
  const half = phase < 0.5 ? phase * 2 : (phase - 0.5) * 2;
  const eased = 1 - (1 - half) ** 2;
  return (phase < 0.5 ? eased : 1 - eased) * (1 - falloff);
}
