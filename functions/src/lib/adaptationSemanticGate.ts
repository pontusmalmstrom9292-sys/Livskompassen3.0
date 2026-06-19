import * as admin from 'firebase-admin';
import { ADAPTATION_SEMANTIC_FLAG } from '../../../shared/adaptation/adaptationSemanticTypes';
import { isAdaptationLayerEnabled } from './adaptationLayerGate';

const EVOLUTION_HUB = 'evolution_hub';

function semanticFlagEnabled(data: admin.firestore.DocumentData | undefined): boolean {
  const flags = data?.unlockedFeatureFlags;
  if (!Array.isArray(flags)) return false;
  return flags.includes(ADAPTATION_SEMANTIC_FLAG);
}

/** Kräver både adaptation_layer_v1 och adaptation_semantic_v1. */
export async function isAdaptationSemanticEnabled(uid: string): Promise<boolean> {
  const layerOn = await isAdaptationLayerEnabled(uid);
  if (!layerOn) return false;

  const snap = await admin.firestore().collection(EVOLUTION_HUB).doc(uid).get();
  if (!snap.exists) return false;
  return semanticFlagEnabled(snap.data());
}
