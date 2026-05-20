import { BALANS_WINDOW_DAYS } from '../constants';
import type { BalansResult, ChildrenLogEntry } from '../types';
import { computeBalansIndex } from './balansIndex';

export interface BalansExportReport {
  exportedAt: string;
  childAlias: string;
  windowDays: number;
  balans: BalansResult;
  logCount: number;
  logs: Pick<ChildrenLogEntry, 'id' | 'action' | 'createdAt' | 'observation' | 'signals' | 'category'>[];
}

/** Client-side JSON export — juridisk stabilitetsrapport (stub). */
export function exportBalansReport(
  childAlias: string,
  logs: ChildrenLogEntry[]
): BalansExportReport {
  const childLogs = logs.filter((l) => l.childAlias === childAlias);
  return {
    exportedAt: new Date().toISOString(),
    childAlias,
    windowDays: BALANS_WINDOW_DAYS,
    balans: computeBalansIndex(logs, childAlias),
    logCount: childLogs.length,
    logs: childLogs.map(({ id, action, createdAt, observation, signals, category }) => ({
      id,
      action,
      createdAt,
      observation,
      signals,
      category,
    })),
  };
}

export function downloadBalansReportJson(report: BalansExportReport): void {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `balans-${report.childAlias}-${report.exportedAt.slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
