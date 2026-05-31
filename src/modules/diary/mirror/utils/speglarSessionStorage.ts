const SPEGLAR_SESSION_KEY = 'livskompassen_speglar_session';

export type SpeglarSessionSnapshot = {
  feeling: string;
  journalMood: string;
  showForensic: boolean;
};

export function readSpeglarSession(): SpeglarSessionSnapshot | null {
  try {
    const raw = localStorage.getItem(SPEGLAR_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SpeglarSessionSnapshot;
    if (typeof parsed.feeling !== 'string') return null;
    return {
      feeling: parsed.feeling,
      journalMood: typeof parsed.journalMood === 'string' ? parsed.journalMood : '',
      showForensic: parsed.showForensic === true,
    };
  } catch {
    return null;
  }
}

export function writeSpeglarSession(snapshot: SpeglarSessionSnapshot): void {
  try {
    localStorage.setItem(SPEGLAR_SESSION_KEY, JSON.stringify(snapshot));
  } catch {
    /* quota / private mode */
  }
}

export function clearSpeglarSession(): void {
  localStorage.removeItem(SPEGLAR_SESSION_KEY);
}
