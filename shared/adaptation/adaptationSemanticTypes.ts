/**
 * Adaptation Core Lager 2 — semantisk profil (Core-silo only, ej cross-RAG).
 */

import type { AdaptationPrefsDoc, CoachTone, UiDensity } from './adaptationTypes';

export const ADAPTATION_SEMANTIC_FLAG = 'adaptation_semantic_v1' as const;

export const ADAPTATION_SEMANTIC_REBUILD_VERSION = 1 as const;

export interface AdaptationSemanticProfileDoc {
  userId: string;
  ownerId: string;
  /** Deterministisk sammanfattning — byggd enbart från adaptation_prefs. */
  summaryText: string;
  signalSnapshot: Record<string, number | string | boolean>;
  topRoutes: string[];
  coachTone: CoachTone;
  uiDensity: UiDensity;
  rebuildVersion: typeof ADAPTATION_SEMANTIC_REBUILD_VERSION;
  sourcePrefsFingerprint: string;
  updatedAt?: string;
}

export interface AdaptationSemanticRebuildResult {
  profile: AdaptationSemanticProfileDoc;
  changed: boolean;
}

/** Top-N route-signaler sorterade efter antal (route_*). */
export function extractTopRouteSignals(
  signals: Record<string, number | string | boolean>,
  limit = 5,
): string[] {
  const routes: { key: string; count: number }[] = [];
  for (const [key, value] of Object.entries(signals)) {
    if (!key.startsWith('route_')) continue;
    const count = typeof value === 'number' ? value : 0;
    if (count <= 0) continue;
    routes.push({ key, count });
  }
  routes.sort((a, b) => b.count - a.count);
  return routes.slice(0, limit).map((r) => r.key);
}

const COACH_TONE_LABELS: Record<CoachTone, string> = {
  minimal: 'minimal coach-ton',
  standard: 'standard coach-ton',
  detailed: 'utförlig coach-ton',
};

const UI_DENSITY_LABELS: Record<UiDensity, string> = {
  paralys: 'paralys-läge (ett steg i taget)',
  normal: 'normal UI-täthet',
  full: 'full UI-täthet',
};

/**
 * Pure rebuild — ingen LLM, ingen läsning från Valv/Kunskap/Barnen.
 */
export function buildSemanticProfileFromPrefs(
  userId: string,
  prefs: AdaptationPrefsDoc,
  sourcePrefsFingerprint: string,
  prevFingerprint?: string,
): AdaptationSemanticRebuildResult {
  const topRoutes = extractTopRouteSignals(prefs.inferredSignals);
  const routeSummary =
    topRoutes.length > 0
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

  const profile: AdaptationSemanticProfileDoc = {
    userId,
    ownerId: userId,
    summaryText,
    signalSnapshot: { ...prefs.inferredSignals },
    topRoutes,
    coachTone: prefs.coachTone,
    uiDensity: prefs.uiDensity,
    rebuildVersion: ADAPTATION_SEMANTIC_REBUILD_VERSION,
    sourcePrefsFingerprint,
    updatedAt: new Date().toISOString(),
  };

  return {
    profile,
    changed: prevFingerprint !== sourcePrefsFingerprint,
  };
}
