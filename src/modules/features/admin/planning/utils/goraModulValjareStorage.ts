export const GORA_MODULVALJARE_SEEN_KEY = 'lk_gora_modulvaljare_seen_v1';

export function hasSeenGoraModulValjare(): boolean {
  try {
    return localStorage.getItem(GORA_MODULVALJARE_SEEN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markGoraModulValjareSeen(): void {
  try {
    localStorage.setItem(GORA_MODULVALJARE_SEEN_KEY, 'true');
  } catch {
    /* ignore */
  }
}
