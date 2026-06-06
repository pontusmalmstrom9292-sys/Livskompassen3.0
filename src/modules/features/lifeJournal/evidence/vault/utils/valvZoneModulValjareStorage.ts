export const VALV_ZONE_MODULVALJARE_SEEN_KEY = 'lk_valv_zone_modulvaljare_seen_v1';

export function hasSeenValvZoneModulValjare(): boolean {
  try {
    return localStorage.getItem(VALV_ZONE_MODULVALJARE_SEEN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markValvZoneModulValjareSeen(): void {
  try {
    localStorage.setItem(VALV_ZONE_MODULVALJARE_SEEN_KEY, 'true');
  } catch {
    /* ignore */
  }
}
