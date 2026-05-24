import { FirebaseError } from 'firebase/app';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../core/firebase/init';
import { kbtTransformClientFallback } from '../lib/kbtTransformFallback';

export type KbtTransformResult = {
  distortion: string;
  clinicalFact: string;
  compassionateRewrite: string;
};

export type KbtTransformResponse = KbtTransformResult & {
  /** Server saknar transformator-läge — visar deterministisk lokal vägledning. */
  usedLocalFallback?: boolean;
};

const mabraCoachCallable = httpsCallable<
  { mode: 'transformator'; thought: string },
  { transform?: KbtTransformResult; redirectToSpeglar?: boolean; coach?: string }
>(functions, 'mabraCoach');

function errorText(err: unknown): string {
  if (err instanceof FirebaseError) {
    return `${err.code} ${err.message} ${JSON.stringify(err.customData ?? '')}`;
  }
  if (err instanceof Error) return err.message;
  return String(err);
}

function isStaleMabraCoachBackend(err: unknown): boolean {
  const text = errorText(err);
  return text.includes('hubSymptom') || text.includes('exerciseType');
}

export async function fetchKbtTransformator(thought: string): Promise<KbtTransformResponse> {
  const trimmed = thought.trim();
  try {
    const result = await mabraCoachCallable({ mode: 'transformator', thought: trimmed });
    if (result.data?.redirectToSpeglar) {
      throw new Error('redirect_speglar');
    }
    const transform = result.data?.transform;
    if (!transform?.distortion || !transform.clinicalFact || !transform.compassionateRewrite) {
      return { ...kbtTransformClientFallback(trimmed), usedLocalFallback: true };
    }
    return transform;
  } catch (err) {
    if (isStaleMabraCoachBackend(err)) {
      return { ...kbtTransformClientFallback(trimmed), usedLocalFallback: true };
    }
    throw err;
  }
}
