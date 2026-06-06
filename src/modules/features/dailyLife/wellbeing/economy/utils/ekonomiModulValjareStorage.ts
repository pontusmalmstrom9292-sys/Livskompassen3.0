export const EKONOMI_MODULVALJARE_SEEN_KEY = 'lk_ekonomi_modulvaljare_seen_v1';

export function hasSeenEkonomiModulValjare(): boolean {
  try {
    return localStorage.getItem(EKONOMI_MODULVALJARE_SEEN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markEkonomiModulValjareSeen(): void {
  try {
    localStorage.setItem(EKONOMI_MODULVALJARE_SEEN_KEY, 'true');
  } catch {
    /* ignore */
  }
}
