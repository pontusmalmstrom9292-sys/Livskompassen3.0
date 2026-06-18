import { httpsCallable } from 'firebase/functions';
import { functions } from '@/core/firebase/init';

export type JournalSilentReflectionResponse = {
  prompt: string;
};

const journalSilentReflectionCallable = httpsCallable<
  { moodHint?: string },
  JournalSilentReflectionResponse
>(functions, 'journalSilentReflection');

export async function fetchJournalSilentReflection(
  moodHint?: string,
): Promise<string | null> {
  try {
    const { data } = await journalSilentReflectionCallable({
      moodHint: moodHint?.trim() || undefined,
    });
    return data?.prompt?.trim() || null;
  } catch {
    return null;
  }
}
