import { httpsCallable } from 'firebase/functions';
import { functions } from '@/core/firebase/init';
import { withVaultSessionPayload } from '@/core/auth/vaultServerSession';

type RescanResult = { written: number; libraryVersion: string };

type AssistResult = RescanResult & { docId?: string | null };

const rescanCallable = httpsCallable<Record<string, never>, RescanResult>(
  functions,
  'rescanPatternMetadata',
);

const assistCallable = httpsCallable<{ sourceRef?: string }, AssistResult>(
  functions,
  'assistPatternMetadata',
);

export async function rescanPatternMetadata(): Promise<RescanResult> {
  const result = await rescanCallable(withVaultSessionPayload<Record<string, never>>({}));
  return result.data;
}

/** P3 Flow-assist — kompletterande FLOW-lager (metadata sidecar). */
export async function assistPatternMetadata(sourceRef?: string): Promise<AssistResult> {
  const result = await assistCallable(
    withVaultSessionPayload<{ sourceRef?: string }>(sourceRef ? { sourceRef } : {}),
  );
  return result.data;
}
