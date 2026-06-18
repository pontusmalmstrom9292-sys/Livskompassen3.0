import { httpsCallable } from 'firebase/functions';
import { functions } from '@/core/firebase/init';
import type { CompassFlow } from '../utils/compassTime';

export type KompassradTag = 'biff' | 'no-jade' | 'parallel' | 'rest';

export type GenerateKompassradResponse = {
  advice: string;
  tag: KompassradTag;
  flow: CompassFlow;
};

const generateKompassradCallable = httpsCallable<
  { flow?: CompassFlow },
  GenerateKompassradResponse
>(functions, 'generateKompassrad');

export async function fetchKompassrad(
  flow: CompassFlow,
): Promise<GenerateKompassradResponse | null> {
  try {
    const { data } = await generateKompassradCallable({ flow });
    if (data?.advice?.trim()) return data;
    return null;
  } catch {
    return null;
  }
}
