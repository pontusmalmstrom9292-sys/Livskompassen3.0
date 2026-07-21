/**
 * Companion photo → Inkast via submitInkastLite (base64).
 */

import { submitInkastLite } from '@/modules/inkast/api/inkastService';

export type CompanionPhotoPayload = {
  kind: 'photo';
  mimeType: string;
  fileName: string;
  /** base64 without data:-prefix */
  base64: string;
  source?: string;
};

export function isCompanionPhotoPayload(payload: Record<string, unknown>): boolean {
  if (payload.kind !== 'photo') return false;
  return typeof payload.base64 === 'string' && payload.base64.length > 32;
}

export async function fileToPhotoPayload(
  file: File,
  source = 'widget_inbox_photo',
): Promise<CompanionPhotoPayload> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  const base64 = btoa(binary);
  return {
    kind: 'photo',
    mimeType: file.type || 'image/jpeg',
    fileName: file.name || `cw_photo_${Date.now()}.jpg`,
    base64,
    source,
  };
}

export async function uploadCompanionPhoto(
  payload: Record<string, unknown>,
): Promise<void> {
  if (!isCompanionPhotoPayload(payload)) {
    throw new Error('photo_payload_invalid');
  }
  const base64 = String(payload.base64);
  const mimeType = typeof payload.mimeType === 'string' ? payload.mimeType : 'image/jpeg';
  const fileName =
    typeof payload.fileName === 'string' ? payload.fileName : `cw_photo_${Date.now()}.jpg`;

  await submitInkastLite({
    fileName,
    mimeType,
    base64,
    sourceModule: 'widget_companion_photo',
  });
}
