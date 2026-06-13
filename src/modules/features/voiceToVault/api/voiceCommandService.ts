import { httpsCallable } from 'firebase/functions';
import { functions } from '@/modules/core/firebase/init';
import type { SubmitInkastLiteResult } from '@/modules/inkast/api/inkastService';

export type ParseVoiceCommandResponse = {
  action: 'task_created' | 'vault_fact_created';
  message: string;
  title?: string; // Om task_created
  inkastResult?: SubmitInkastLiteResult; // Om vault_fact_created
};

const parseVoiceCommandCallable = httpsCallable<{ transcript: string }, ParseVoiceCommandResponse>(
  functions,
  'parseVoiceCommand'
);

export async function parseVoiceCommand(transcript: string): Promise<ParseVoiceCommandResponse> {
  const result = await parseVoiceCommandCallable({ transcript });
  return result.data;
}
