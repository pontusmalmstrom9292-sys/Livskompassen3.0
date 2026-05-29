const ENABLED_KEY = 'livskompassen_app_unlock_enabled';
const SESSION_KEY = 'livskompassen_app_unlocked_session';

export function isAppUnlockEnabled(): boolean {
  return localStorage.getItem(ENABLED_KEY) === 'true';
}

export function setAppUnlockEnabled(enabled: boolean): void {
  if (enabled) {
    localStorage.setItem(ENABLED_KEY, 'true');
  } else {
    localStorage.removeItem(ENABLED_KEY);
    clearAppUnlockSession();
  }
}

export function isAppUnlockedThisSession(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

export function markAppUnlockedThisSession(): void {
  sessionStorage.setItem(SESSION_KEY, 'true');
}

export function clearAppUnlockSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export const APP_UNLOCK_PASSKEY_KEY = 'livskompassen_app_unlock_passkey_id';
export const APP_UNLOCK_ENABLED_KEY = ENABLED_KEY;

const FINGERPRINT_SETUP_PENDING_KEY = 'livskompassen_fingerprint_setup_pending';

export function markFingerprintSetupPending(): void {
  sessionStorage.setItem(FINGERPRINT_SETUP_PENDING_KEY, 'true');
}

export function consumeFingerprintSetupPending(): boolean {
  const pending = sessionStorage.getItem(FINGERPRINT_SETUP_PENDING_KEY) === 'true';
  sessionStorage.removeItem(FINGERPRINT_SETUP_PENDING_KEY);
  return pending;
}
