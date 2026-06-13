import { httpsCallable } from 'firebase/functions';
import { functions } from '@/modules/core/firebase/init';

export type VoiceToVaultResult = {
  success: boolean;
  action: 'persisted';
  collection: 'reality_vault' | 'planning_tasks';
  docId: string;
  summary: string;
};

const parseVoiceToVaultCallable = httpsCallable<
  { text: string },
  VoiceToVaultResult
>(functions, 'parseVoiceToVault');

export async function submitVoiceToVault(text: string): Promise<VoiceToVaultResult> {
  const result = await parseVoiceToVaultCallable({ text });
  return result.data;
}
