import { REFRAMING_STEPS } from '../constants';
import type { MabraPendingExerciseNote } from './mabraExerciseNoteStorage';

export type MabraExplicitSaveSource = {
  bankId: string;
  promptText: string;
  responseText: string;
  lens?: string;
};

export function localDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function composeReflectionEntryText(promptText: string, responseText: string): string {
  const trimmed = responseText.trim();
  if (!trimmed) return '';
  return `Fråga: ${promptText.trim()}\n\nSvar: ${trimmed}`;
}

export function composeExerciseNoteText(note: MabraPendingExerciseNote): string {
  const lines: string[] = [];
  if (note.exerciseType === 'reframing') {
    for (const step of REFRAMING_STEPS) {
      const answer = note.answers[step.stepKey]?.trim();
      if (!answer) continue;
      lines.push(`${step.label}: ${answer}`);
    }
  } else {
    for (const [key, value] of Object.entries(note.answers)) {
      const trimmed = value.trim();
      if (trimmed) lines.push(`${key}: ${trimmed}`);
    }
  }
  if (lines.length === 0) return '';
  const header =
    note.exerciseType === 'reframing'
      ? 'Mabra — reframing (utkast)'
      : `Mabra — ${note.exerciseType}`;
  return `${header}\n\n${lines.join('\n')}`;
}

export function toExplicitSaveSource(
  bankId: string,
  promptText: string,
  responseText: string,
  lens?: string,
): MabraExplicitSaveSource | null {
  const composed = composeReflectionEntryText(promptText, responseText);
  if (!composed) return null;
  return { bankId, promptText, responseText: composed, lens };
}
