import { httpsCallable } from 'firebase/functions';
import { functions } from '../../../core/firebase/init';

const journalWovenCallable = httpsCallable(functions, 'journalWovenToKampspar');

export type JournalWovenResult = {
  kampsparDocId?: string;
  embeddingDim?: number | null;
};

/** G7 — opt-in only; fire-and-forget efter dagbok-save. */
export function journalWovenToKampspar(payload: {
  journalEntryId: string;
  mood: string;
  text: string;
}): void {
  journalWovenCallable({
    journalEntryId: payload.journalEntryId,
    mood: payload.mood,
    text: payload.text,
    optIn: true,
  }).catch((err) => {
    console.warn('[journal_woven] Kampspár-opt-in misslyckades:', err);
  });
}
