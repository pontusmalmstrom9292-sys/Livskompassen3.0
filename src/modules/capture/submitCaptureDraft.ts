import type { SubmitInkastLiteResult } from '../inkast/api/inkastService';
import { syncCaptureDraftRecord } from './captureDraftSync';
import { addPendingDraft, getDraft } from './draftQueue';

export type SubmitCaptureDraftInput = {
  text: string;
  fileName?: string;
  sourceModule: string;
  optInTrauma?: boolean;
};

export type SubmitCaptureDraftResult = {
  result: SubmitInkastLiteResult;
  message: string;
};

/** Sparar utkast lokalt, kör submitInkastLite, uppdaterar DraftQueue-status. */
export async function submitCaptureDraft(
  input: SubmitCaptureDraftInput,
): Promise<SubmitCaptureDraftResult> {
  const trimmed = input.text.trim();
  if (trimmed.length < 3) {
    throw new Error('Texten är för kort.');
  }

  const draft = await addPendingDraft({
    text: trimmed,
    fileName: input.fileName ?? 'capture.txt',
    sourceModule: input.sourceModule,
  });

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error('Offline — sparat lokalt. Synkas när nätet är tillbaka.');
  }

  const synced = await syncCaptureDraftRecord(draft, { optInTrauma: input.optInTrauma });
  if (synced) return synced;

  const refreshed = await getDraft(draft.id);
  const msg = refreshed?.errorMessage ?? 'Sortering misslyckades.';
  throw new Error(msg);
}

/** Heuristik: mejl/sms med konflikt/brus → parallell arkiv-kopia via capture. */
export function shouldDualWritePlaneringToCapture(text: string): boolean {
  const blob = text.toLowerCase();
  return (
    /\b(sms|mejl|e-post|mail|whatsapp)\b/.test(blob) &&
    /\b(ex|motpart|barnens mor|vårdnad|soc|bevis|konflikt)\b/.test(blob)
  );
}
