export type CognitiveLoadLevel = 1 | 2 | 3 | 4 | 5;

export type KasamModeId = 'trygg_hamn' | 'neutral' | 'grundad';

const LOAD_KEY = 'livskompassen_cognitive_load';
const KASAM_KEY = 'livskompassen_kasam_mode';

export const KASAM_MODES: { id: KasamModeId; label: string }[] = [
  { id: 'trygg_hamn', label: 'Trygg Hamn-läge' },
  { id: 'grundad', label: 'Grundad kväll' },
  { id: 'neutral', label: 'Neutral' },
];

export function loadCognitiveLoad(): CognitiveLoadLevel {
  try {
    const raw = sessionStorage.getItem(LOAD_KEY);
    const n = raw ? Number(raw) : 3;
    if (n >= 1 && n <= 5) return n as CognitiveLoadLevel;
  } catch {
    /* ignore */
  }
  return 3;
}

export function saveCognitiveLoad(level: CognitiveLoadLevel): void {
  try {
    sessionStorage.setItem(LOAD_KEY, String(level));
  } catch {
    /* ignore */
  }
}

export function loadKasamMode(): KasamModeId {
  try {
    const raw = sessionStorage.getItem(KASAM_KEY);
    if (raw === 'trygg_hamn' || raw === 'grundad' || raw === 'neutral') return raw;
  } catch {
    /* ignore */
  }
  return 'trygg_hamn';
}

export function saveKasamMode(mode: KasamModeId): void {
  try {
    sessionStorage.setItem(KASAM_KEY, mode);
  } catch {
    /* ignore */
  }
}

/** F-01.2 — nivå 4–5 aktiverar reducerad UI (Safe Mode). */
export function isExtremeFatigue(level: CognitiveLoadLevel): boolean {
  return level >= 4;
}
