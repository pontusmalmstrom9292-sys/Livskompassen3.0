import { randomUUID } from 'crypto';
import { admin } from './firebaseAdmin';

/** Admin SDK → vault_evidence (WORM path, uid-scoped). */
export async function uploadInkastEvidence(input: {
  ownerId: string;
  fileName: string;
  mimeType: string;
  buffer: Buffer;
}): Promise<string> {
  const safeName = input.fileName.replace(/[^\w.-]+/g, '_').slice(0, 80);
  const path = `vault_evidence/${input.ownerId}/inkast/${Date.now()}_${safeName}`;
  const bucket = admin.storage().bucket();
  const file = bucket.file(path);
  const token = randomUUID();

  await file.save(input.buffer, {
    contentType: input.mimeType,
    metadata: {
      metadata: {
        firebaseStorageDownloadTokens: token,
        source: 'inkast_lite',
        ownerId: input.ownerId,
      },
    },
  });

  const encoded = encodeURIComponent(path);
  return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encoded}?alt=media&token=${token}`;
}
