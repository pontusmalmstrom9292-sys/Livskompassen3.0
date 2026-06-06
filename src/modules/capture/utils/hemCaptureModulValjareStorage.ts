export const HEM_CAPTURE_MODULVALJARE_SEEN_KEY = 'lk_hem_capture_modulvaljare_seen_v1';

export function hasSeenHemCaptureModulValjare(): boolean {
  try {
    return localStorage.getItem(HEM_CAPTURE_MODULVALJARE_SEEN_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markHemCaptureModulValjareSeen(): void {
  try {
    localStorage.setItem(HEM_CAPTURE_MODULVALJARE_SEEN_KEY, 'true');
  } catch {
    /* ignore */
  }
}
