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
