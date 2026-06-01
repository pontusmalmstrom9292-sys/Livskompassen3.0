import { httpsCallable } from 'firebase/functions';
import { functions } from '@/core/firebase/init';

export type MicroStep = {
  instruction: string;
  estimatedSeconds: number;
  physicalAnchor: string;
};

const breakDownCallable = httpsCallable<{ text: string }, { microSteps: MicroStep[] }>(
  functions,
  'breakDownResponse',
);

export async function fetchMicroSteps(text: string): Promise<MicroStep[]> {
  const result = await breakDownCallable({ text });
  const steps = result.data?.microSteps;
  if (!Array.isArray(steps) || steps.length === 0) {
    throw new Error('Inga mikrosteg returnerades.');
  }
  return steps;
}
