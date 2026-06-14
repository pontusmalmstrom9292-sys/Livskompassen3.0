import { saveChildrenLog, saveVaultLog } from '@/core/firebase/firestore';
import { OfflineWriteBlockedError } from '@/core/firebase/offlineWritePolicy';
import type { ChildAlias, LivsloggCategory } from '@/features/family/children/constants';
import { ingestWidgetRecordingToVault } from './widgetVaultRecording';
import {
  enqueueActionDashboardItem,
  listPendingActionDashboardItems,
  removePendingActionDashboardItem,
  type PendingActionDashboardItem,
} from './actionDashboardOfflineQueue';

export type ActionSaveResult =
  | { queued: true }
  | { queued: false; id: string };

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

async function writeVaultReflection(userId: string, text: string): Promise<string> {
  const stamp = new Date().toISOString();
  return saveVaultLog(userId, {
    action: 'widget_aktioner_reflektion',
    category: 'snabblogg',
    truth: `REFLEKTION ${stamp}\n\n${text}`,
    entryType: 'simple',
  });
}

async function writeChildLog(
  userId: string,
  params: {
    childAlias: ChildAlias;
    category: LivsloggCategory;
    observation: string;
    contentType?: 'text' | 'voice';
  },
): Promise<string> {
  return saveChildrenLog(userId, {
    childAlias: params.childAlias,
    observation: params.observation,
    category: params.category,
    action: 'livslogg',
    channel: 'widget',
    contentType: params.contentType ?? 'text',
  });
}

async function flushItem(userId: string, item: PendingActionDashboardItem): Promise<void> {
  if (item.kind === 'vault_reflection') {
    await writeVaultReflection(userId, item.text);
    return;
  }
  if (item.kind === 'child_log') {
    await writeChildLog(userId, {
      childAlias: item.childAlias,
      category: item.category,
      observation: item.observation,
      contentType: item.contentType,
    });
    return;
  }
  const blob = new Blob([item.audioData], { type: item.audioMimeType });
  const file = new File([blob], item.audioFileName, { type: item.audioMimeType });
  await ingestWidgetRecordingToVault(
    userId,
    file,
    item.transcript,
    new Date(item.recordedAtIso),
    item.durationSeconds,
  );
}

export async function saveActionReflection(
  userId: string,
  text: string,
): Promise<ActionSaveResult> {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('Tom text');

  if (!navigator.onLine) {
    await enqueueActionDashboardItem({ userId, kind: 'vault_reflection', text: trimmed });
    return { queued: true };
  }

  try {
    const id = await writeVaultReflection(userId, trimmed);
    return { queued: false, id };
  } catch (err) {
    if (!isOfflineError(err)) throw err;
    await enqueueActionDashboardItem({ userId, kind: 'vault_reflection', text: trimmed });
    return { queued: true };
  }
}

export async function saveActionChildLog(
  userId: string,
  params: {
    childAlias: ChildAlias;
    category: LivsloggCategory;
    observation: string;
    contentType?: 'text' | 'voice';
  },
): Promise<ActionSaveResult> {
  const trimmed = params.observation.trim();
  if (!trimmed) throw new Error('Tom observation');

  const payload = { ...params, observation: trimmed };

  if (!navigator.onLine) {
    await enqueueActionDashboardItem({ userId, kind: 'child_log', ...payload });
    return { queued: true };
  }

  try {
    const id = await writeChildLog(userId, payload);
    return { queued: false, id };
  } catch (err) {
    if (!isOfflineError(err)) throw err;
    await enqueueActionDashboardItem({ userId, kind: 'child_log', ...payload });
    return { queued: true };
  }
}

export async function saveActionVaultRecording(
  userId: string,
  file: File,
  transcript: string,
  recordedAt: Date,
  durationSeconds?: number,
): Promise<ActionSaveResult & { title?: string }> {
  if (!navigator.onLine) {
    const audioData = await file.arrayBuffer();
    await enqueueActionDashboardItem({
      userId,
      kind: 'vault_recording',
      transcript,
      recordedAtIso: recordedAt.toISOString(),
      durationSeconds,
      audioMimeType: file.type || 'audio/webm',
      audioFileName: file.name,
      audioData,
    });
    return { queued: true };
  }

  try {
    const { vaultId, analysis } = await ingestWidgetRecordingToVault(
      userId,
      file,
      transcript,
      recordedAt,
      durationSeconds,
    );
    return { queued: false, id: vaultId, title: analysis.title };
  } catch (err) {
    if (!isOfflineError(err)) throw err;
    const audioData = await file.arrayBuffer();
    await enqueueActionDashboardItem({
      userId,
      kind: 'vault_recording',
      transcript,
      recordedAtIso: recordedAt.toISOString(),
      durationSeconds,
      audioMimeType: file.type || 'audio/webm',
      audioFileName: file.name,
      audioData,
    });
    return { queued: true };
  }
}

async function runFlush(userId: string): Promise<number> {
  if (!navigator.onLine) return 0;

  const pending = await listPendingActionDashboardItems(userId);
  let flushed = 0;

  for (const item of pending) {
    try {
      await flushItem(userId, item);
      await removePendingActionDashboardItem(item.id);
      flushed += 1;
    } catch (err) {
      if (isOfflineError(err)) break;
      // Permanent error — skip item to unblock queue
      await removePendingActionDashboardItem(item.id).catch(() => undefined);
    }
  }

  return flushed;
}

export async function flushActionDashboardQueue(userId: string): Promise<number> {
  if (!flushInFlight) {
    flushInFlight = runFlush(userId).finally(() => {
      flushInFlight = null;
    });
  }
  return flushInFlight;
}
