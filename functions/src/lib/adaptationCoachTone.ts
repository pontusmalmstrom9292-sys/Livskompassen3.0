import type { CoachTone } from '../../../shared/adaptation/adaptationTypes';
import { DEFAULT_ADAPTATION_PREFS } from '../../../shared/adaptation/adaptationTypes';
import { isAdaptationLayerEnabled } from './adaptationLayerGate';
import { getAdaptationPrefsDoc } from './adaptationPrefsStore';

/** Server-side coach-ton — läser adaptation_prefs, aldrig callable-input. */
export async function resolveCoachToneForUser(uid: string): Promise<CoachTone> {
  const enabled = await isAdaptationLayerEnabled(uid);
  if (!enabled) return DEFAULT_ADAPTATION_PREFS.coachTone;

  const prefs = await getAdaptationPrefsDoc(uid);
  return prefs?.coachTone ?? DEFAULT_ADAPTATION_PREFS.coachTone;
}
