/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
/** Lokal KPI — privat, ingen social proof. */

export type RecoveryKpiEvent =
  | { type: 'akut_start'; at: number }
  | { type: 'akut_complete'; at: number }
  | { type: 'protocol'; mins: 1 | 3 | 10; at: number }
  | { type: 'help_tap'; target: string; at: number }
  | { type: 'plan_saved'; at: number }
  | { type: 'comeback'; at: number };

const KEY = 'livskompassen_df_kpi:';

function k(uid?: string) {
  return `${KEY}${uid || 'local'}`;
}

export function pushKpiEvent(event: RecoveryKpiEvent, uid?: string): void {
  try {
    const raw = localStorage.getItem(k(uid));
    const list: RecoveryKpiEvent[] = raw ? (JSON.parse(raw) as RecoveryKpiEvent[]) : [];
    list.push(event);
    localStorage.setItem(k(uid), JSON.stringify(list.slice(-200)));
  } catch {
    /* ignore */
  }
}

export function summarizeKpi(uid?: string): {
  akutStarts: number;
  akutCompletes: number;
  completeRate: number;
  protocols: number;
  helpTaps: number;
} {
  try {
    const raw = localStorage.getItem(k(uid));
    const list: RecoveryKpiEvent[] = raw ? (JSON.parse(raw) as RecoveryKpiEvent[]) : [];
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = list.filter((e) => e.at >= weekAgo);
    const starts = recent.filter((e) => e.type === 'akut_start').length;
    const completes = recent.filter((e) => e.type === 'akut_complete').length;
    return {
      akutStarts: starts,
      akutCompletes: completes,
      completeRate: starts ? completes / starts : 0,
      protocols: recent.filter((e) => e.type === 'protocol').length,
      helpTaps: recent.filter((e) => e.type === 'help_tap').length,
    };
  } catch {
    return { akutStarts: 0, akutCompletes: 0, completeRate: 0, protocols: 0, helpTaps: 0 };
  }
}
