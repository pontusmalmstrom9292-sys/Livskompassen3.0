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

/** Klient-utskrift (PDF via webbläsarens utskriftsdialog). */
export function printBalansReport(report: BalansExportReport): void {
  const w = window.open('', '_blank', 'noopener,noreferrer');
  if (!w) return;
  const rows = report.logs
    .map(
      (l) =>
        `<tr><td>${l.createdAt?.slice(0, 10) ?? '—'}</td><td>${l.action ?? ''}</td><td>${(l.observation ?? '').slice(0, 80)}</td></tr>`,
    )
    .join('');
  w.document.write(`<!DOCTYPE html><html><head><title>Balans ${report.childAlias}</title>
<style>body{font-family:system-ui,sans-serif;padding:24px;color:#111}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px;font-size:12px}</style></head>
<body><h1>Stabilitetsrapport — ${report.childAlias}</h1>
<p>Exporterad: ${report.exportedAt.slice(0, 19)} · Balansindex: ${report.balans.index}/100 (${report.balans.label})</p>
<table><thead><tr><th>Datum</th><th>Typ</th><th>Notering</th></tr></thead><tbody>${rows}</tbody></table></body></html>`);
  w.document.close();
  w.focus();
  w.print();
}
