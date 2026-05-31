import {
  formatInkastResultMessage,
  submitInkastLite,
  type SubmitInkastLiteResult,
} from '../inkast/api/inkastService';
import {
  addPendingDraft,
  updateDraftStatus,
  type DraftStatus,
} from './draftQueue';

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

  try {
    const result = await submitInkastLite({
      text: trimmed,
      fileName: input.fileName ?? 'capture.txt',
      sourceModule: input.sourceModule,
      optInTrauma: input.optInTrauma,
    });
    const status: DraftStatus =
      result.action === 'queued' || result.classification.routing === 'review'
        ? 'review'
        : 'synced';
    await updateDraftStatus(draft.id, { status, syncResult: result });
    return {
      result,
      message: formatInkastResultMessage(result),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Sortering misslyckades.';
    await updateDraftStatus(draft.id, { status: 'failed', errorMessage: msg });
    throw new Error(msg);
  }
}

/** Heuristik: mejl/sms med konflikt/brus → parallell arkiv-kopia via capture. */
export function shouldDualWritePlaneringToCapture(text: string): boolean {
  const blob = text.toLowerCase();
  return (
    /\b(sms|mejl|e-post|mail|whatsapp)\b/.test(blob) &&
    /\b(ex|motpart|barnens mor|vårdnad|soc|bevis|konflikt)\b/.test(blob)
  );
}
