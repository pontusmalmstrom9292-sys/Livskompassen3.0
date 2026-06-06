import { httpsCallable } from 'firebase/functions';
import { withVaultSessionPayload } from '@/core/auth/vaultServerSession';
import { functions } from '@/core/firebase/init';

const weaveCallable = httpsCallable<
  { journalEntryId: string; mood: string; text: string },
  { status: string; vaultMetadataId?: string }
>(functions, 'weaveJournalEntry');

/** Fire-and-forget — blockerar inte journal-save. */
export function weaveJournalEntry(payload: {
  journalEntryId: string;
  mood: string;
  text: string;
}): void {
  void weaveCallable(withVaultSessionPayload(payload)).catch((err) => {
    console.warn('[Vävaren] Async tagging misslyckades:', err);
  });
}
