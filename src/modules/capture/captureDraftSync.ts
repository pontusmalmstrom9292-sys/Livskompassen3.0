import { OfflineWriteBlockedError } from '@/core/firebase/offlineWritePolicy';
import {
  formatInkastResultMessage,
  primaryInkastItem,
  submitInkastLite,
  type SubmitInkastLiteResult,
} from '../inkast/api/inkastService';
import {
  deleteDraft,
  getDraft,
  listDraftsByStatus,
  updateDraftStatus,
  type CaptureDraft,
  type DraftStatus,
} from './draftQueue';

export type SyncCaptureDraftResult = {
  result: SubmitInkastLiteResult;
  message: string;
};

const TRANSIENT_FIREBASE_CODES = new Set([
  'unavailable',
  'deadline-exceeded',
  'network-request-failed',
  'failed-precondition',
]);

let flushInFlight: Promise<number> | null = null;

function isOfflineError(err: unknown): boolean {
  if (err instanceof OfflineWriteBlockedError) return true;
  if (typeof navigator !== 'undefined' && !navigator.onLine) return true;
  if (err && typeof err === 'object' && 'code' in err) {
    return TRANSIENT_FIREBASE_CODES.has(String((err as { code: string }).code));
  }
  return false;
}

function statusFromBatch(batch: SubmitInkastLiteResult): DraftStatus {
  const result = primaryInkastItem(batch);
  return result.action === 'queued' || result.classification.routing === 'review'
    ? 'review'
    : 'synced';
}

/** Synkar ett befintligt pending/failed-utkast — skapar inget nytt draft. */
export async function syncCaptureDraftRecord(
  draft: CaptureDraft,
  options?: { optInTrauma?: boolean },
): Promise<SyncCaptureDraftResult | null> {
  if (draft.status !== 'pending' && draft.status !== 'failed') return null;

  const trimmed = draft.text.trim();
  if (trimmed.length < 3) {
    await deleteDraft(draft.id);
    return null;
  }

  try {
    const batch = await submitInkastLite({
      text: trimmed,
      fileName: draft.fileName ?? 'capture.txt',
      sourceModule: draft.sourceModule ?? 'hem_capture',
      optInTrauma: options?.optInTrauma,
    });
    await updateDraftStatus(draft.id, {
      status: statusFromBatch(batch),
      syncResult: batch,
      errorMessage: undefined,
    });
    return {
      result: batch,
      message: formatInkastResultMessage(batch),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Sortering misslyckades.';
    if (isOfflineError(err)) {
      if (draft.status === 'pending') {
        await updateDraftStatus(draft.id, { errorMessage: msg });
      } else {
        await updateDraftStatus(draft.id, { status: 'failed', errorMessage: msg });
      }
      return null;
    }
    await updateDraftStatus(draft.id, { status: 'failed', errorMessage: msg });
    return null;
  }
}

async function runFlush(): Promise<number> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) return 0;

  const drafts = [
    ...(await listDraftsByStatus('pending')),
    ...(await listDraftsByStatus('failed')),
  ].sort((a, b) => a.updatedAt - b.updatedAt);

  let flushed = 0;
  for (const draft of drafts) {
    const result = await syncCaptureDraftRecord(draft);
    if (result) flushed += 1;
    else if (typeof navigator !== 'undefined' && !navigator.onLine) break;
  }
  return flushed;
}

/** Flush pending/failed capture-utkast när nätet är tillbaka. */
export async function flushCaptureDraftQueue(): Promise<number> {
  if (!flushInFlight) {
    flushInFlight = runFlush().finally(() => {
      flushInFlight = null;
    });
  }
  return flushInFlight;
}

/** Manuell retry från granskningskö-panelen. */
export async function retryCaptureDraft(draftId: string): Promise<boolean> {
  const draft = await getDraft(draftId);
  if (!draft || (draft.status !== 'pending' && draft.status !== 'failed')) return false;

  if (draft.status === 'failed') {
    await updateDraftStatus(draftId, { status: 'pending', errorMessage: undefined });
  }

  const refreshed = await getDraft(draftId);
  if (!refreshed) return false;
  const result = await syncCaptureDraftRecord(refreshed);
  return result !== null;
}
