import type { MabraExerciseType, MabraSymptomHub } from '../types';

const STORAGE_KEY = 'livskompassen_mabra_pending_exercise_note_v1';

export type MabraPendingExerciseNote = {
  exerciseType: MabraExerciseType;
  hubSymptom?: MabraSymptomHub;
  answers: Record<string, string>;
  capturedAtIso: string;
};

function isPendingExerciseNote(value: unknown): value is MabraPendingExerciseNote {
  if (typeof value !== 'object' || value === null) return false;
  const row = value as Record<string, unknown>;
  if (typeof row.exerciseType !== 'string') return false;
  if (row.hubSymptom !== undefined && typeof row.hubSymptom !== 'string') return false;
  if (typeof row.capturedAtIso !== 'string') return false;
  if (typeof row.answers !== 'object' || row.answers === null || Array.isArray(row.answers)) {
    return false;
  }
  return true;
}

/** Session RAM — rensas när fliken stängs (Zero Footprint). */
export function readPendingExerciseNote(): MabraPendingExerciseNote | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isPendingExerciseNote(parsed)) return null;
    const answers: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed.answers)) {
      if (typeof value === 'string' && value.trim()) answers[key] = value.trim();
    }
    return { ...parsed, answers };
  } catch {
    return null;
  }
}

export function writePendingExerciseNote(note: MabraPendingExerciseNote): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(note));
  } catch {
    /* quota */
  }
}

export function clearPendingExerciseNote(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function hasPendingExerciseNote(): boolean {
  const note = readPendingExerciseNote();
  if (!note) return false;
  return Object.values(note.answers).some((line) => line.trim().length > 0);
}
