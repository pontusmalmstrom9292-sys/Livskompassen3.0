import * as admin from 'firebase-admin';
import { KompisSupervisor } from '../agents/kompis-supervisor';

admin.initializeApp();

export const supervisor = new KompisSupervisor();

/** Speglings-Coachen: max 2–4 meningar (server-side guard). */
export function trimSpeglingsMirror(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  const parts = trimmed.match(/[^.!?…]+[.!?…]+|[^.!?…]+$/g) ?? [trimmed];
  if (parts.length <= 4) return trimmed;
  return parts.slice(0, 4).join(' ').trim();
}

export const KNOWLEDGE_UPLOAD_MIMES = new Set([
  'application/pdf',
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

/** ~8 MB råfil som base64 (DoS-skydd före Buffer.from). */
export const MAX_KNOWLEDGE_UPLOAD_BASE64_CHARS = 11_000_000;
