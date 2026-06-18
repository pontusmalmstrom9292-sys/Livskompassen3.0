const lastFiredAt = new Map<string, number>();

/** Minst 30 s mellan samma signalKey — undviker spam vid snabb navigation. */
const THROTTLE_MS = 30_000;

export function shouldFireAdaptationSignal(signalKey: string, now = Date.now()): boolean {
  const prev = lastFiredAt.get(signalKey);
  if (prev !== undefined && now - prev < THROTTLE_MS) {
    return false;
  }
  lastFiredAt.set(signalKey, now);
  return true;
}

/** Test / logout — rensa throttle-state. */
export function resetAdaptationSignalThrottle(): void {
  lastFiredAt.clear();
}
