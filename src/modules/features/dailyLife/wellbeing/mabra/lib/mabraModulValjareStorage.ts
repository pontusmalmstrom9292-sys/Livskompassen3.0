export const MABRA_MODULVALJARE_SEEN_KEY = 'lk_mabra_modulvaljare_seen_v1';

export function hasSeenMabraModulValjare(): boolean {
  try {
    return localStorage.getItem(MABRA_MODULVALJARE_SEEN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markMabraModulValjareSeen(): void {
  try {
    localStorage.setItem(MABRA_MODULVALJARE_SEEN_KEY, 'true');
  } catch {
    /* ignore */
  }
}
