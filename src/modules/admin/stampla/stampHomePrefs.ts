const STAMP_ON_HOME_KEY = 'livskompassen_stamp_on_home_screen';

/** Hem — stämpel av som standard (widget + Arbetsliv räcker). */
export function isStampOnHomeScreenEnabled(): boolean {
  try {
    return localStorage.getItem(STAMP_ON_HOME_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setStampOnHomeScreenEnabled(enabled: boolean): void {
  try {
    if (enabled) {
      localStorage.setItem(STAMP_ON_HOME_KEY, 'true');
    } else {
      localStorage.removeItem(STAMP_ON_HOME_KEY);
    }
  } catch {
    /* ignore */
  }
}
