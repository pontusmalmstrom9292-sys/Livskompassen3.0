/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
/**
 * Lokal återfallsplan + SOS-räknare (Zero Footprint för craving-text;
 * endast tidsstämplar / strukturerad plan på enheten).
 */

export type IfThenItem = { ifText: string; thenText: string };

export type RiskMapLocal = {
  people: string[];
  places: string[];
  things: string[];
};

export type RecoveryPlanLocal = {
  ifThen: IfThenItem[];
  riskMap: RiskMapLocal;
  values: string[];
  consequenceCards: string[];
};

const PLAN_PREFIX = 'livskompassen_recovery_plan:';
const SOS_TS_PREFIX = 'livskompassen_recovery_sos_ts:';
const COMEBACK_FLAG = 'livskompassen_recovery_comeback:';

function key(prefix: string, uid?: string): string {
  return `${prefix}${uid || 'local'}`;
}

const EMPTY_PLAN: RecoveryPlanLocal = {
  ifThen: [
    { ifText: '', thenText: '' },
    { ifText: '', thenText: '' },
    { ifText: '', thenText: '' },
  ],
  riskMap: { people: [], places: [], things: [] },
  values: [],
  consequenceCards: [],
};

export function loadRecoveryPlanLocal(uid?: string): RecoveryPlanLocal {
  try {
    const raw = localStorage.getItem(key(PLAN_PREFIX, uid));
    if (!raw) return structuredClone(EMPTY_PLAN);
    const parsed = JSON.parse(raw) as Partial<RecoveryPlanLocal>;
    return {
      ifThen: Array.isArray(parsed.ifThen)
        ? parsed.ifThen.slice(0, 3).map((row) => ({
            ifText: String(row?.ifText ?? '').slice(0, 120),
            thenText: String(row?.thenText ?? '').slice(0, 120),
          }))
        : structuredClone(EMPTY_PLAN.ifThen),
      riskMap: {
        people: Array.isArray(parsed.riskMap?.people)
          ? parsed.riskMap!.people.map(String).slice(0, 6)
          : [],
        places: Array.isArray(parsed.riskMap?.places)
          ? parsed.riskMap!.places.map(String).slice(0, 6)
          : [],
        things: Array.isArray(parsed.riskMap?.things)
          ? parsed.riskMap!.things.map(String).slice(0, 6)
          : [],
      },
      values: Array.isArray(parsed.values) ? parsed.values.map(String).slice(0, 5) : [],
      consequenceCards: Array.isArray(parsed.consequenceCards)
        ? parsed.consequenceCards.map(String).slice(0, 5)
        : [],
    };
  } catch {
    return structuredClone(EMPTY_PLAN);
  }
}

export function saveRecoveryPlanLocal(plan: RecoveryPlanLocal, uid?: string): void {
  localStorage.setItem(key(PLAN_PREFIX, uid), JSON.stringify(plan));
}

/** Opt-in metadata: tidpunkt för SOS-öppning (ingen craving-text). */
export function recordSosOpenLocal(uid?: string): void {
  try {
    const k = key(SOS_TS_PREFIX, uid);
    const raw = localStorage.getItem(k);
    const list: number[] = raw ? (JSON.parse(raw) as number[]) : [];
    const next = [...list.filter((t) => typeof t === 'number'), Date.now()].slice(-40);
    localStorage.setItem(k, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
}

export function countSosOpensLast7Days(uid?: string): number {
  try {
    const raw = localStorage.getItem(key(SOS_TS_PREFIX, uid));
    if (!raw) return 0;
    const list = JSON.parse(raw) as number[];
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return list.filter((t) => typeof t === 'number' && t >= weekAgo).length;
  } catch {
    return 0;
  }
}

export function setComebackPending(uid?: string, pending = true): void {
  if (pending) localStorage.setItem(key(COMEBACK_FLAG, uid), '1');
  else localStorage.removeItem(key(COMEBACK_FLAG, uid));
}

export function isComebackPending(uid?: string): boolean {
  return localStorage.getItem(key(COMEBACK_FLAG, uid)) === '1';
}

export function parseTagList(raw: string): string[] {
  return raw
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);
}
