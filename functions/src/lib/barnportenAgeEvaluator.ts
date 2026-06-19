import * as admin from 'firebase-admin';

type AgeBracket = 'toddler_preschool' | 'early_school' | 'pre_teen' | 'teen';

function bracketFromAgeYears(ageYears: number): AgeBracket {
  if (ageYears <= 5) return 'toddler_preschool';
  if (ageYears <= 9) return 'early_school';
  if (ageYears <= 13) return 'pre_teen';
  return 'teen';
}

function ageFromBirthDate(birthDate: string, now = new Date()): number | null {
  const parsed = Date.parse(birthDate);
  if (Number.isNaN(parsed)) return null;
  const birth = new Date(parsed);
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

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
    const age = ageFromBirthDate(birthDate);
    if (age === null) continue;
    const nextBracket = bracketFromAgeYears(age);
    if (state.currentBracket !== nextBracket) {
      childrenAgeState[alias] = {
        ...state,
        currentBracket: nextBracket,
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
