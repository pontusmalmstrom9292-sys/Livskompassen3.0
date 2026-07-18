import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/core/firebase/storage';
import type { JournalAttachment } from '../types/journalAttachment';

export const JOURNAL_MEMORY_MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/pdf',
]);

const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
  heif: 'image/heif',
  pdf: 'application/pdf',
};

function safeFileName(name: string): string {
  return name.replace(/[^\w.-]+/g, '_').slice(0, 80) || 'minne';
}

export function resolveJournalMemoryMime(file: File): string | null {
  const type = file.type?.toLowerCase();
  if (type && ALLOWED_MIME.has(type)) return type;
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext && EXT_TO_MIME[ext]) return EXT_TO_MIME[ext];
  return null;
}

export function validateJournalMemoryFile(
  file: File,
): { ok: true; mimeType: string } | { ok: false; message: string } {
  if (file.size > JOURNAL_MEMORY_MAX_BYTES) {
    return { ok: false, message: 'Filen är större än 5 MB. Välj en mindre fil.' };
  }
  const mimeType = resolveJournalMemoryMime(file);
  if (!mimeType) {
    return {
      ok: false,
      message: 'Filtypen stöds inte. Välj JPG, PNG, WebP, HEIC eller PDF.',
    };
  }
  return { ok: true, mimeType };
}

export function journalMemoryStoragePath(
  userId: string,
  entryId: string,
  fileName: string,
): string {
  return `users/${userId}/journal_memories/${entryId}/${safeFileName(fileName)}`;
}

/** Throws when Storage bucket is missing from build env (bilaga kräver giltig bucket). */
export function assertJournalStorageReady(): void {
  const bucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
  if (!bucket || bucket === 'YOUR_STORAGE_BUCKET') {
    throw new Error(
      'Bilaga kräver Firebase Storage — kontrollera app-konfigurationen (storage bucket).',
    );
  }
}

export async function uploadJournalMemory(
  userId: string,
  entryId: string,
  file: File,
  caption?: string,
): Promise<JournalAttachment> {
  if (!userId.trim()) {
    throw new Error('Du måste vara inloggad för att ladda upp bilaga.');
  }
  if (!entryId.trim()) {
    throw new Error('Kunde inte förbereda bilagan — försök spara igen.');
  }
  assertJournalStorageReady();

  const validation = validateJournalMemoryFile(file);
  if (validation.ok === false) {
    throw new Error(validation.message);
  }
  const storagePath = journalMemoryStoragePath(userId, entryId, file.name);
  const storageRef = ref(storage, storagePath);
  await uploadBytes(storageRef, file, { contentType: validation.mimeType });
  const url = await getDownloadURL(storageRef);
  const trimmed = caption?.trim().slice(0, 500);
  return {
    url,
    storagePath,
    name: file.name,
    mimeType: validation.mimeType,
    size: file.size,
    ...(trimmed ? { caption: trimmed } : {}),
  };
}
