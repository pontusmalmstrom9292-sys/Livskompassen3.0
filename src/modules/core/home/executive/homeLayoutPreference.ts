/** Hemlayout för ME-midnight-executive — extended (default) eller mix-E klassisk. */

export type ExecutiveHomeLayoutMode = 'extended' | 'mix-e';

const STORAGE_KEY = 'livskompassen_home_layout';
export const HOME_LAYOUT_CHANGED_EVENT = 'livskompassen:home-layout-changed';

export function getExecutiveHomeLayoutMode(): ExecutiveHomeLayoutMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'mix-e' ? 'mix-e' : 'extended';
  } catch {
    return 'extended';
  }
}

export function setExecutiveHomeLayoutMode(mode: ExecutiveHomeLayoutMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
    window.dispatchEvent(new CustomEvent(HOME_LAYOUT_CHANGED_EVENT, { detail: { mode } }));
  } catch {
    /* ignore */
  }
}
