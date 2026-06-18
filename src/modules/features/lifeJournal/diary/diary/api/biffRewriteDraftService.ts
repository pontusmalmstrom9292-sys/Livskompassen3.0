import { httpsCallable } from 'firebase/functions';
import { functions } from '@/core/firebase/init';

export type BiffRewriteToneCheck = 'pass' | 'still_emotional' | 'too_long';

export type BiffRewriteDraftResponse = {
  cleanedText: string;
  toneCheck: BiffRewriteToneCheck;
};

export type BiffRewriteContext = 'dagbok' | 'hamn' | 'inkast';

const biffRewriteDraftCallable = httpsCallable<
  { draft: string; context?: BiffRewriteContext },
  BiffRewriteDraftResponse
>(functions, 'biffRewriteDraft');

export async function fetchBiffRewriteDraft(
  draft: string,
  context: BiffRewriteContext = 'dagbok',
): Promise<BiffRewriteDraftResponse | null> {
  const trimmed = draft.trim();
  if (trimmed.length < 10) return null;

  try {
    const { data } = await biffRewriteDraftCallable({ draft: trimmed, context });
    if (data?.cleanedText?.trim()) return data;
    return null;
  } catch {
    return null;
  }
}
