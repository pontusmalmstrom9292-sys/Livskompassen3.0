import { saveChildrenLog, saveVaultLog } from '@/core/firebase/firestore';
import { uploadChildLogMedia } from '@/core/firebase/storage';
import { OfflineWriteBlockedError } from '@/core/firebase/offlineWritePolicy';
import type { ChildAlias, LivsloggCategory } from '@/features/family/children/constants';
import { ingestWidgetRecordingToVault } from './widgetVaultRecording';
import {
  enqueueActionDashboardItem,
  listPendingActionDashboardItems,
  removePendingActionDashboardItem,
  type PendingActionDashboardItem,
  type PendingChildLog,
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

const MAX_CHILD_PHOTO_BYTES = 10 * 1024 * 1024;

let flushInFlight: Promise<number> | null = null;

function isOfflineError(err: unknown): boolean {
  if (err instanceof OfflineWriteBlockedError) return true;
  if (typeof navigator !== 'undefined' && !navigator.onLine) return true;
  if (err && typeof err === 'object' && 'code' in err) {
    return TRANSIENT_FIREBASE_CODES.has(String((err as { code: string }).code));
  }
  return false;
}

function assertValidChildPhoto(file: File): void {
  if (!file.type.startsWith('image/')) {
    throw new Error('Endast bildfiler kan bifogas.');
  }
  if (file.size > MAX_CHILD_PHOTO_BYTES) {
    throw new Error('Bilden är för stor (max 10 MB).');
  }
}

async function uploadChildPhoto(
  userId: string,
  childAlias: ChildAlias,
  file: File,
): Promise<string> {
  assertValidChildPhoto(file);
  return uploadChildLogMedia(userId, childAlias, file);
}

function photoFileFromPending(item: PendingChildLog): File | null {
  if (!item.photoData || !item.photoMimeType || !item.photoFileName) return null;
  const blob = new Blob([item.photoData], { type: item.photoMimeType });
  return new File([blob], item.photoFileName, { type: item.photoMimeType });
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
    contentType?: 'text' | 'voice' | 'image';
    mediaUrl?: string;
  },
): Promise<string> {
  return saveChildrenLog(userId, {
    childAlias: params.childAlias,
    observation: params.observation,
    category: params.category,
    action: 'livslogg',
    channel: 'widget',
    contentType: params.contentType ?? 'text',
    mediaUrl: params.mediaUrl,
  });
}

async function resolveChildLogMediaUrl(
  userId: string,
  item: PendingChildLog,
): Promise<string | undefined> {
  const photoFile = photoFileFromPending(item);
  if (!photoFile) return undefined;
  return uploadChildPhoto(userId, item.childAlias, photoFile);
}

async function flushItem(userId: string, item: PendingActionDashboardItem): Promise<void> {
  if (item.kind === 'vault_reflection') {
    await writeVaultReflection(userId, item.text);
    return;
  }
  if (item.kind === 'child_log') {
    const mediaUrl = await resolveChildLogMediaUrl(userId, item);
    await writeChildLog(userId, {
      childAlias: item.childAlias,
      category: item.category,
      observation: item.observation,
      contentType: item.contentType,
      mediaUrl,
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
    contentType?: 'text' | 'voice' | 'image';
    photo?: File | null;
  },
): Promise<ActionSaveResult> {
  const trimmed = params.observation.trim();
  const photo = params.photo ?? null;
  const hasPhoto = photo != null && photo.size > 0;

  if (!trimmed && !hasPhoto) throw new Error('Tom observation');
  if (hasPhoto) assertValidChildPhoto(photo);

  const observation = trimmed || '(foto)';
  const contentType: 'text' | 'voice' | 'image' = hasPhoto
    ? 'image'
    : (params.contentType ?? 'text');

  const enqueuePayload = async (): Promise<void> => {
    const base = {
      userId,
      kind: 'child_log' as const,
      childAlias: params.childAlias,
      category: params.category,
      observation,
      contentType,
    };
    if (hasPhoto && photo) {
      const photoData = await photo.arrayBuffer();
      await enqueueActionDashboardItem({
        ...base,
        photoMimeType: photo.type || 'image/jpeg',
        photoFileName: photo.name || `photo_${Date.now()}.jpg`,
        photoData,
      });
      return;
    }
    await enqueueActionDashboardItem(base);
  };

  if (!navigator.onLine) {
    await enqueuePayload();
    return { queued: true };
  }

  try {
    let mediaUrl: string | undefined;
    if (hasPhoto && photo) {
      mediaUrl = await uploadChildPhoto(userId, params.childAlias, photo);
    }
    const id = await writeChildLog(userId, {
      childAlias: params.childAlias,
      category: params.category,
      observation,
      contentType,
      mediaUrl,
    });
    return { queued: false, id };
  } catch (err) {
    if (!isOfflineError(err)) throw err;
    await enqueuePayload();
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
