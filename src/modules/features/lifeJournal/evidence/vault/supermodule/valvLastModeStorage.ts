import type { ValvInputMode } from './valvInputModes';

const STORAGE_KEY = 'livskompassen_valv_last_input_mode_v1';

export function readValvLastInputMode(): ValvInputMode | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw as ValvInputMode | null;
  } catch {
    return null;
  }
}

export function writeValvLastInputMode(mode: ValvInputMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* best-effort */
  }
}
