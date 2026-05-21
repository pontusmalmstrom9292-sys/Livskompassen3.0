import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { app } from './init';

const storage = getStorage(app);

export async function uploadVaultEvidence(userId: string, file: File): Promise<string> {
  const safeName = file.name.replace(/[^\w.-]+/g, '_').slice(0, 80);
  const path = `vault_evidence/${userId}/${Date.now()}_${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}
