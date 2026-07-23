/**
 * Edge AI intelligence consumer — listens for native `livskompassen-intelligence`
 * and prepares non-PII tags that Inkast merges into WORM via submitInkastLite.
 * Never writes reality_vault from the client.
 */
import {
  INTELLIGENCE_EVENT,
  type EdgeIntelligenceDetail,
  type EdgeSilo,
  clearLastIntelligence,
  getLastIntelligence,
  mapEdgeSiloToRouting,
  setLastIntelligence,
} from '@/modules/shared/utils/nativeMindAura';

export const INTELLIGENCE_CONSUMED_EVENT = 'livskompassen-intelligence-consumed';

let installed = false;

function isEdgeSilo(raw: unknown): raw is EdgeSilo {
  return raw === 'tanke' || raw === 'handling' || raw === 'idé';
}

function normalizeDetail(raw: unknown): EdgeIntelligenceDetail | null {
  if (!raw || typeof raw !== 'object') return null;
  const d = raw as Record<string, unknown>;
  if (!isEdgeSilo(d.silo)) return null;
  const entities = Array.isArray(d.entities)
    ? d.entities.filter((e): e is string => typeof e === 'string').slice(0, 12)
    : [];
  return {
    silo: d.silo,
    lang: typeof d.lang === 'string' ? d.lang : 'und',
    entities,
    stress: d.stress === true,
    text: typeof d.text === 'string' ? d.text.slice(0, 200) : '',
    receivedAt: Date.now(),
  };
}

/** Non-PII tags that survive into WORM classification.tags via server merge. */
export function buildEdgeWormTags(detail: EdgeIntelligenceDetail): string[] {
  const tags: string[] = [`edge:silo:${detail.silo}`];
  if (detail.stress) tags.push('edge:stress');
  const hasSchedule = detail.entities.some((e) => {
    const u = e.toUpperCase();
    return u.startsWith('DATE_TIME:') || u.startsWith('DATE:') || u.startsWith('TIME:');
  });
  if (hasSchedule) tags.push('edge:schedule');
  if (detail.lang && detail.lang !== 'und') tags.push(`edge:lang:${detail.lang.slice(0, 8)}`);
  return tags.slice(0, 6);
}

function onIntelligence(ev: Event): void {
  const ce = ev as CustomEvent;
  const detail = normalizeDetail(ce.detail);
  if (!detail) return;
  setLastIntelligence(detail);
  try {
    window.dispatchEvent(
      new CustomEvent(INTELLIGENCE_CONSUMED_EVENT, {
        detail: {
          ...detail,
          suggestedRouting: mapEdgeSiloToRouting(detail.silo),
          wormTags: buildEdgeWormTags(detail),
        },
      }),
    );
  } catch {
    /* ignore */
  }
}

/** Idempotent — safe to call from analyze path and module load. */
export function installIntelligenceConsumer(): void {
  if (typeof window === 'undefined' || installed) return;
  window.addEventListener(INTELLIGENCE_EVENT, onIntelligence as EventListener);
  installed = true;
}

export function uninstallIntelligenceConsumer(): void {
  if (typeof window === 'undefined' || !installed) return;
  window.removeEventListener(INTELLIGENCE_EVENT, onIntelligence as EventListener);
  installed = false;
  clearLastIntelligence();
}

export { clearLastIntelligence, getLastIntelligence, mapEdgeSiloToRouting };
