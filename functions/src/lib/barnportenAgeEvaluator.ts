import { admin } from './firebaseAdmin';
import {
  ageYearsFromBirthDate,
  bracketFromAgeYears,
} from '../../../shared/evolution/childAgeBracket';

/** Server-side bracket eval — mirror orkester_barnporten_evaluator (P2.3). */
export async function evaluateBarnportenBracketsForUser(uid: string): Promise<{ updated: string[] }> {
  const db = admin.firestore();
  const hubRef = db.collection('evolution_hub').doc(uid);
  const snap = await hubRef.get();
  if (!snap.exists) return { updated: [] };

  const before = snap.data() as Record<string, unknown>;
  const childrenAgeState = { ...(before.childrenAgeState as Record<string, Record<string, unknown>> | undefined) };
  const updated: string[] = [];

  for (const [alias, state] of Object.entries(childrenAgeState)) {
    const birthDate = typeof state?.birthDate === 'string' ? state.birthDate : '';
    if (!birthDate) continue;
    const age = ageYearsFromBirthDate(birthDate);
    if (age === null) continue;
    const nextBracket = bracketFromAgeYears(age);
    if (state.currentBracket !== nextBracket) {
      childrenAgeState[alias] = {
        ...state,
        currentBracket: nextBracket,
        ageYears: age,
        lastAgeEvalAt: new Date().toISOString(),
      };
      updated.push(alias);
    }
  }

  if (updated.length === 0) return { updated: [] };

  const after = {
    ...before,
    childrenAgeState,
    updatedAt: new Date().toISOString(),
  };

  await hubRef.set(after, { merge: true });
  // evolution_ledger via onEvolutionHubWrite trigger

  return { updated };
}
