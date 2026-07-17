/**
 * Suppresserar Zero Footprint-lås under Valv-upplåsning (biometri/WebAuthn).
 * Android BiometricPrompt → app pausas → utan detta låses Valvet mitt i inloggningen.
 */

let unlockInFlight = false;
let graceUntilMs = 0;

/** Kort andrum efter lyckad upplåsning medan biometri-UI stängs. */
const POST_UNLOCK_GRACE_MS = 2_500;

export function beginVaultUnlockInFlight(): void {
  unlockInFlight = true;
}

export function endVaultUnlockInFlight(options?: { graceMs?: number }): void {
  unlockInFlight = false;
  const grace = options?.graceMs ?? POST_UNLOCK_GRACE_MS;
  graceUntilMs = Date.now() + Math.max(0, grace);
}

/** True under aktiv upplåsning eller kort grace — skippa visibility/app-background lock. */
export function shouldSuppressVaultBackgroundLock(): boolean {
  if (unlockInFlight) return true;
  return Date.now() < graceUntilMs;
}
