import * as admin from 'firebase-admin';
import { ADAPTATION_LAYER_FLAG } from '../../../shared/adaptation/adaptationTypes';

const EVOLUTION_HUB = 'evolution_hub';

/** Master switch — `adaptation_layer_v1` i evolution_hub.unlockedFeatureFlags. */
export async function isAdaptationLayerEnabled(uid: string): Promise<boolean> {
  const snap = await admin.firestore().collection(EVOLUTION_HUB).doc(uid).get();
  if (!snap.exists) return false;
  const flags = snap.data()?.unlockedFeatureFlags;
  if (!Array.isArray(flags)) return false;
  return flags.includes(ADAPTATION_LAYER_FLAG);
}
