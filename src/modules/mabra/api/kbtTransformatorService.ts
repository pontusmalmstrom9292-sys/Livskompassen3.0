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

function isStaleMabraCoachBackend(err: unknown): boolean {
  if (!(err instanceof FirebaseError)) return false;
  if (err.code !== 'functions/invalid-argument') return false;
  return err.message.includes('hubSymptom');
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
      throw new Error('Ofullständigt KBT-svar.');
    }
    return transform;
  } catch (err) {
    if (isStaleMabraCoachBackend(err)) {
      return { ...kbtTransformClientFallback(trimmed), usedLocalFallback: true };
    }
    throw err;
  }
}
