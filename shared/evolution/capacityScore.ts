/**
 * Kanonisk kapacitetsskala — user_capability_state.capacityScore lagras normaliserat 0–1.
 * MåBra checkins (mood/energy) är 0–10 per fält; medel → normalisering / 10.
 */

/** MåBra mood+energy medel (0–10) under vilken ekonomi/planering låses. */
export const MAABRA_MOOD_ENERGY_THRESHOLD = 7.0;

/** Normaliserad 0–1 — sparmål, kuvert, impulskö (nivå 3). */
export const CAPACITY_STABILITY_THRESHOLD = 0.5;

/** Hem + header — förenklad UX. */
export const CAPACITY_LOW_HOME_THRESHOLD = 0.35;

/** Planering Kanban tri-gate (usePlanningKanbanGate). */
export const CAPACITY_PLANNING_KANBAN_THRESHOLD = 0.45;

export function moodEnergyAverageToNormalized(avg0to10: number): number {
  if (!Number.isFinite(avg0to10)) return 0;
  return Math.min(1, Math.max(0, avg0to10 / 10));
}

/** Klient + server — läs user_capability_state (0–1, legacy 0–10 eller 0–100). */
export function normalizeStoredCapacityScore(raw: number | undefined): number {
  if (typeof raw !== 'number' || Number.isNaN(raw)) return 0;
  if (raw <= 1) return Math.min(1, Math.max(0, raw));
  if (raw > 10) return Math.min(1, Math.max(0, raw / 100));
  return Math.min(1, Math.max(0, raw / 10));
}

/** Backend callables som förväntar 0–10 (t.ex. smart allocation). */
export function capacityScoreToScale10(raw: number | undefined): number {
  const normalized = normalizeStoredCapacityScore(raw);
  if (normalized === 0 && raw === undefined) return 5;
  return normalized * 10;
}
