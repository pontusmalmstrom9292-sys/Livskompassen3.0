"use strict";
/**
 * Adaptation Core Lager 2 — semantisk profil (Core-silo only, ej cross-RAG).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADAPTATION_SEMANTIC_REBUILD_VERSION = exports.ADAPTATION_SEMANTIC_FLAG = void 0;
exports.extractTopRouteSignals = extractTopRouteSignals;
exports.buildSemanticProfileFromPrefs = buildSemanticProfileFromPrefs;
exports.ADAPTATION_SEMANTIC_FLAG = 'adaptation_semantic_v1';
exports.ADAPTATION_SEMANTIC_REBUILD_VERSION = 1;
/** Top-N route-signaler sorterade efter antal (route_*). */
function extractTopRouteSignals(signals, limit = 5) {
    const routes = [];
    for (const [key, value] of Object.entries(signals)) {
        if (!key.startsWith('route_'))
            continue;
        const count = typeof value === 'number' ? value : 0;
        if (count <= 0)
            continue;
        routes.push({ key, count });
    }
    routes.sort((a, b) => b.count - a.count);
    return routes.slice(0, limit).map((r) => r.key);
}
const COACH_TONE_LABELS = {
    minimal: 'minimal coach-ton',
    standard: 'standard coach-ton',
    detailed: 'utförlig coach-ton',
};
const UI_DENSITY_LABELS = {
    paralys: 'paralys-läge (ett steg i taget)',
    normal: 'normal UI-täthet',
    full: 'full UI-täthet',
};
/**
 * Pure rebuild — ingen LLM, ingen läsning från Valv/Kunskap/Barnen.
 */
function buildSemanticProfileFromPrefs(userId, prefs, sourcePrefsFingerprint, prevFingerprint) {
    const topRoutes = extractTopRouteSignals(prefs.inferredSignals);
    const routeSummary = topRoutes.length > 0
        ? topRoutes.map((r) => r.replace(/^route_/, '')).join(', ')
        : 'ingen navigationshistorik än';
    const summaryText = [
        `Coach-ton: ${COACH_TONE_LABELS[prefs.coachTone]}.`,
        `UI: ${UI_DENSITY_LABELS[prefs.uiDensity]}.`,
        `Mest besökta zoner: ${routeSummary}.`,
        prefs.dismissedHints.length > 0
            ? `Avfärdade tips: ${prefs.dismissedHints.length}.`
            : null,
    ]
        .filter(Boolean)
        .join(' ');
    const profile = {
        userId,
        ownerId: userId,
        summaryText,
        signalSnapshot: { ...prefs.inferredSignals },
        topRoutes,
        coachTone: prefs.coachTone,
        uiDensity: prefs.uiDensity,
        rebuildVersion: exports.ADAPTATION_SEMANTIC_REBUILD_VERSION,
        sourcePrefsFingerprint,
        updatedAt: new Date().toISOString(),
    };
    return {
        profile,
        changed: prevFingerprint !== sourcePrefsFingerprint,
    };
}
//# sourceMappingURL=adaptationSemanticTypes.js.map