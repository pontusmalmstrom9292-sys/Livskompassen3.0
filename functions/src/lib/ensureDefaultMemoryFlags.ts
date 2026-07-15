import * as admin from 'firebase-admin';
import { ADAPTATION_LAYER_FLAG } from '../../../shared/adaptation/adaptationTypes';

const EVOLUTION_HUB = 'evolution_hub';

/** Default memory-system flags — server-only (client cannot write unlockedFeatureFlags). */
const DEFAULT_MEMORY_FLAGS = [ADAPTATION_LAYER_FLAG] as const;

/**
 * Ensures adaptation_layer_v1 is present after first hub activity.
 * Idempotent — safe to call on every onEvolutionHubWrite.
 */
export async function ensureDefaultMemoryFlags(
  db: admin.firestore.Firestore,
  uid: string,
  hubData: Record<string, unknown>,
): Promise<boolean> {
  const flags = Array.isArray(hubData.unlockedFeatureFlags)
    ? (hubData.unlockedFeatureFlags as string[])
    : [];
  const missing = DEFAULT_MEMORY_FLAGS.filter((f) => !flags.includes(f));
  if (missing.length === 0) return false;

  await db.collection(EVOLUTION_HUB).doc(uid).set(
    {
      unlockedFeatureFlags: [...flags, ...missing],
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );

  console.log(`[EvolutionHub] Default memory flags added uid=${uid} flags=${missing.join(',')}`);
  return true;
}
