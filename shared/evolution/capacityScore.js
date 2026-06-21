"use strict";
/**
 * Kanonisk kapacitetsskala — user_capability_state.capacityScore lagras normaliserat 0–1.
 * MåBra checkins (mood/energy) är 0–10 per fält; medel → normalisering / 10.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CAPACITY_PLANNING_KANBAN_THRESHOLD = exports.CAPACITY_LOW_HOME_THRESHOLD = exports.CAPACITY_STABILITY_THRESHOLD = exports.MAABRA_MOOD_ENERGY_THRESHOLD = void 0;
exports.moodEnergyAverageToNormalized = moodEnergyAverageToNormalized;
exports.normalizeStoredCapacityScore = normalizeStoredCapacityScore;
exports.capacityScoreToScale10 = capacityScoreToScale10;
/** MåBra mood+energy medel (0–10) under vilken ekonomi/planering låses. */
exports.MAABRA_MOOD_ENERGY_THRESHOLD = 7.0;
/** Normaliserad 0–1 — sparmål, kuvert, impulskö (nivå 3). */
exports.CAPACITY_STABILITY_THRESHOLD = 0.5;
/** Hem + header — förenklad UX. */
exports.CAPACITY_LOW_HOME_THRESHOLD = 0.35;
/** Planering Kanban tri-gate (usePlanningKanbanGate). */
exports.CAPACITY_PLANNING_KANBAN_THRESHOLD = 0.45;
function moodEnergyAverageToNormalized(avg0to10) {
    if (!Number.isFinite(avg0to10))
        return 0;
    return Math.min(1, Math.max(0, avg0to10 / 10));
}
/** Klient + server — läs user_capability_state (0–1, legacy 0–10 eller 0–100). */
function normalizeStoredCapacityScore(raw) {
    if (typeof raw !== 'number' || Number.isNaN(raw))
        return 0;
    if (raw <= 1)
        return Math.min(1, Math.max(0, raw));
    if (raw > 10)
        return Math.min(1, Math.max(0, raw / 100));
    return Math.min(1, Math.max(0, raw / 10));
}
/** Backend callables som förväntar 0–10 (t.ex. smart allocation). */
function capacityScoreToScale10(raw) {
    const normalized = normalizeStoredCapacityScore(raw);
    if (normalized === 0 && raw === undefined)
        return 5;
    return normalized * 10;
}
//# sourceMappingURL=capacityScore.js.map