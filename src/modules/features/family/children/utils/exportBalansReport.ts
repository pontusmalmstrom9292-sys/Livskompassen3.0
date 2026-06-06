import { BALANS_WINDOW_DAYS } from '../constants';
import type { BalansResult, ChildrenLogEntry } from '../types';
import { computeBalansIndex } from './balansIndex';
import {
  escapeHtml,
  createSafeHtml,
  downloadJsonFile,
  printSecurely,
  createSafeTableRow,
  createSafeTableHeader,
  DEFAULT_PRINT_STYLES,
} from '@/shared/utils/secureExport';

export interface BalansExportReport {
  exportedAt: string;
  childAlias: string;
  windowDays: number;
  balans: BalansResult;
  logCount: number;
  logs: Pick<
    ChildrenLogEntry,
    'id' | 'action' | 'createdAt' | 'observation' | 'signals' | 'category'
  >[];
}

/**
 * Creates a balans export report object
 * Client-side JSON export — juridisk stabilitetsrapport
 */
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

/**
 * Downloads a balans report as a JSON file
 * Uses secure file download with proper escaping
 */
export function downloadBalansReportJson(report: BalansExportReport): void {
  try {
    const filename = `balans-${report.childAlias}-${report.exportedAt.slice(0, 10)}.json`;
    downloadJsonFile(report, filename);
  } catch (error) {
    console.error('Failed to download balans report JSON:', error);
  }
}

/**
 * Creates safe HTML for printing the balans report
 * All user-provided content is properly escaped to prevent XSS
 */
function createBalansReportHtml(report: BalansExportReport): string {
  // Create table rows with proper escaping
  const tableRows = report.logs
    .map((log) =>
      createSafeTableRow([
        log.createdAt?.slice(0, 10) ?? '—',
        log.action ?? '—',
        (log.observation ?? '').slice(0, 80),
      ])
    )
    .join('\n');

  const headerRow = createSafeTableHeader(['Datum', 'Typ', 'Notering']);

  const content = `
<h1>Stabilitetsrapport — ${escapeHtml(report.childAlias)}</h1>
<p class="meta">
  Exporterad: ${escapeHtml(report.exportedAt.slice(0, 19))} · 
  Balansindex: ${escapeHtml(String(report.balans.index))}/100 (${escapeHtml(String(report.balans.label))}) · 
  Poster: ${escapeHtml(String(report.logCount))} · 
  Period: ${escapeHtml(String(report.windowDays))} dagar
</p>
<table>
  <thead>
    ${headerRow}
  </thead>
  <tbody>
    ${tableRows || '<tr><td colspan="3">Inga poster</td></tr>'}
  </tbody>
</table>
  `;

  return createSafeHtml(
    content,
    `Stabilitetsrapport - ${escapeHtml(report.childAlias)}`,
    DEFAULT_PRINT_STYLES
  );
}

/**
 * Prints a balans report as PDF
 * Opens print dialog where user can save as PDF
 * All content is XSS-protected with proper HTML escaping
 */
export function printBalansReport(report: BalansExportReport): void {
  try {
    const html = createBalansReportHtml(report);
    printSecurely(html, `Stabilitetsrapport-${report.childAlias}`);
  } catch (error) {
    console.error('Failed to print balans report:', error);
  }
}
