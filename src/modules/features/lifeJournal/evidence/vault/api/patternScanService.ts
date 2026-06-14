import { httpsCallable } from 'firebase/functions';
import { functions } from '@/core/firebase/init';
import { withVaultSessionPayload } from '@/core/auth/vaultServerSession';

type RescanResult = { written: number; libraryVersion: string };

const rescanCallable = httpsCallable<Record<string, never>, RescanResult>(
  functions,
  'rescanPatternMetadata',
);

export async function rescanPatternMetadata(): Promise<RescanResult> {
  const result = await rescanCallable(withVaultSessionPayload<Record<string, never>>({}));
  return result.data;
}
