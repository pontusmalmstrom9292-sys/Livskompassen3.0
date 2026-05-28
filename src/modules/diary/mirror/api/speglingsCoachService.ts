import { httpsCallable } from 'firebase/functions';
import { functions } from '../../../core/firebase/init';

type SpeglingsMirrorResponse = { mirror: string };

const speglingsMirrorCallable = httpsCallable<
  { reflection: string; mood?: string },
  SpeglingsMirrorResponse
>(functions, 'speglingsMirror');

export async function fetchSpeglingsMirror(reflection: string, mood?: string): Promise<string> {
  const result = await speglingsMirrorCallable({ reflection, mood });
  const mirror = result.data?.mirror;
  if (!mirror?.trim()) throw new Error('Tomt speglings-svar.');
  return mirror.trim();
}
