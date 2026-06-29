import { useReducedMotion } from 'framer-motion';

/** Respects prefers-reduced-motion for DS motion presets. */
export function useDsReducedMotion(): boolean {
  return useReducedMotion() ?? false;
}

/** Returns motion props or instant fallback when reduced motion is on. */
export function dsMotionOrInstant<T extends Record<string, unknown>>(
  reduced: boolean,
  full: T,
  instant?: T,
): T {
  if (!reduced) return full;
  return instant ?? ({ ...full, transition: { duration: 0 } } as T);
}
