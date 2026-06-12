import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { app } from './init';

export const storage = getStorage(app);

function slugifyForPath(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || 'inspelning'
  );
}

export async function uploadVaultEvidence(userId: string, file: File): Promise<string> {
  const safeName = file.name.replace(/[^\w.-]+/g, '_').slice(0, 80);
  const path = `vault_evidence/${userId}/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}

/** WH1 — diskret inspelning med ISO-stämpel + slug från analys-titel. */
/** Projekt P2 — bildblock, uid-scoped. */
export async function uploadProjectMedia(
  userId: string,
  projectId: string,
  file: File,
): Promise<{ storagePath: string; downloadUrl: string }> {
  const safeName = file.name.replace(/[^\w.-]+/g, '_').slice(0, 80);
  const path = `project_media/${userId}/${projectId}/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type || 'application/octet-stream' });
  const downloadUrl = await getDownloadURL(storageRef);
  return { storagePath: path, downloadUrl };
}

export async function uploadDiscreetRecording(
  userId: string,
  file: File,
  recordedAt: Date,
  titleSlug: string,
): Promise<string> {
  const iso =
    recordedAt.toISOString().replace(/:/g, '-').replace(/\.\d{3}Z$/, 'Z') ??
    `${Date.now()}`;
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'webm';
  const slug = slugifyForPath(titleSlug);
  const path = `vault_evidence/${userId}/discreet/${iso}_${slug}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}
