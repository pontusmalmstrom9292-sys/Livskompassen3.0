/**
 * Barn-PWA utrullning — produktbeslut 2026-06-18.
 * Kod och locked UX (HITL, inkorg, agents) behålls; barnen får ingen aktiv PWA i prod just nu.
 * BP-PUSH fortsatt DEFER.
 */
export const BARNPORTEN_CHILD_PWA_ROLLOUT_ENABLED = false;

export function isBarnportenChildPwaRolloutEnabled(): boolean {
  return BARNPORTEN_CHILD_PWA_ROLLOUT_ENABLED;
}
