import { httpsCallable } from 'firebase/functions';
import { functions } from '../../../core/firebase/init';
import { journalQuickMirrorFallback } from '../utils/journalQuickMirrorFallback';

export type JournalQuickMirrorResponse = {
  mirrorLine: string;
  microStep: string;
  suggestMode: 'snabb' | 'reflektera' | 'none';
  toneCheck: 'pass' | 'too_fixing' | 'too_long';
};

const journalQuickMirrorCallable = httpsCallable<
  { mood: string; tags: string[]; optionalText?: string },
  JournalQuickMirrorResponse
>(functions, 'journalQuickMirror');

export async function fetchJournalQuickMirror(
  mood: string,
  tags: string[],
  optionalText?: string,
): Promise<JournalQuickMirrorResponse> {
  try {
    const { data } = await journalQuickMirrorCallable({
      mood,
      tags,
      optionalText: optionalText?.trim() || undefined,
    });
    if (data?.mirrorLine?.trim()) return data;
    return journalQuickMirrorFallback(mood, optionalText);
  } catch {
    return journalQuickMirrorFallback(mood, optionalText);
  }
}
