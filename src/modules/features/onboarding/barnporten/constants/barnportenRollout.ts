/** @locked MOD-FAM-BPORT — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-BPORT.md
 *
 * Barn-PWA utrullning — YOLO våg W2 (2026-07-10).
 * Kod och locked UX (HITL, inkorg, agents) behålls; rollout ON enligt plan.
 */
export const BARNPORTEN_CHILD_PWA_ROLLOUT_ENABLED = true;

export function isBarnportenChildPwaRolloutEnabled(): boolean {
  return BARNPORTEN_CHILD_PWA_ROLLOUT_ENABLED;
}
