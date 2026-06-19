import type { VitEntryRow } from '@/core/types/firestore';
import { VIT_VAULT_TAB_LABEL } from '@/core/copy/valvNavCopy';
import { VIT_HUB_EXPORT_DISCLAIMER } from './vitHubCopy';
import { vitProjectTitle, type VitHubStats } from './vitHubStats';
import {
  escapeHtml,
  createSafeHtml,
  downloadJsonFile,
  printSecurely,
  createSafeTableRow,
  createSafeTableHeader,
  DEFAULT_PRINT_STYLES,
  VIT_HUB_PRINT_STYLES,
} from '@/shared/utils/secureExport';

export type VitHubExportReport = {
  exportedAt: string;
  title: string;
  disclaimer: string;
  stats: {
    totalEntries: number;
    activeDays: number;
    sessionCount: number;
    activeProjectIds: string[];
  };
  entries: Array<{
    id: string;
    projectId: string;
    projectTitle: string;
    kind: VitEntryRow['kind'];
    bankId: string;
    date: string;
    responseText: string;
  }>;
};

const KIND_LABELS: Record<VitEntryRow['kind'], string> = {
  card: 'Frågekort',
  memory: 'Känslominne',
  chat_turn: 'Dialog',
};

/**
 * Gets the display date for a vault entry
 */
function entryDate(entry: VitEntryRow): string {
  return entry.cardDateKey ?? entry.createdAt?.slice(0, 10) ?? '—';
}

/**
 * Builds a Vit Hub export report object
 * Aggregates entries and statistics for export
 */
export function buildVitHubExportReport(
  entries: VitEntryRow[],
  stats: VitHubStats
): VitHubExportReport {
  return {
    exportedAt: new Date().toISOString(),
    title: `${VIT_VAULT_TAB_LABEL} — personlig export`,
    disclaimer: VIT_HUB_EXPORT_DISCLAIMER,
    stats: {
      totalEntries: stats.totalEntries,
      activeDays: stats.activeDays,
      sessionCount: stats.sessionCount,
      activeProjectIds: stats.activeProjectIds,
    },
    entries: entries.map((entry) => ({
      id: entry.id,
      projectId: entry.projectId,
      projectTitle: vitProjectTitle(entry.projectId),
      kind: entry.kind,
      bankId: entry.bankId,
      date: entryDate(entry),
      responseText: entry.responseText?.trim() ?? '',
    })),
  };
}

/**
 * Downloads a Vit Hub report as a JSON file
 * Uses secure file download with proper escaping
 */
export function downloadVitHubReportJson(report: VitHubExportReport): void {
  try {
    const filename = `mitt-vit-${report.exportedAt.slice(0, 10)}.json`;
    downloadJsonFile(report, filename);
  } catch (error) {
    console.error('Failed to download Vit Hub report JSON:', error);
  }
}

/**
 * Creates safe HTML for printing the Vit Hub report
 * All user-provided content is properly escaped to prevent XSS attacks
 */
function createVitHubReportHtml(report: VitHubExportReport): string {
  // Create table rows with proper escaping
  const tableRows = report.entries
    .map((entry) =>
      createSafeTableRow([
        entry.date,
        entry.projectTitle,
        KIND_LABELS[entry.kind] ?? '—',
        entry.bankId,
        entry.responseText || '—',
      ])
    )
    .join('\n');

  const headerRow = createSafeTableHeader([
    'Datum',
    'Projekt',
    'Typ',
    'Bank',
    'Innehål',
  ]);

  const customStyles = DEFAULT_PRINT_STYLES + VIT_HUB_PRINT_STYLES;

  const content = `
<h1>${escapeHtml(report.title)}</h1>
<p class="meta">
  Exporterad: ${escapeHtml(report.exportedAt.slice(0, 19))} · 
  Sparade svar: ${escapeHtml(String(report.stats.totalEntries))} · 
  Aktiva dagar: ${escapeHtml(String(report.stats.activeDays))} · 
  Sessioner: ${escapeHtml(String(report.stats.sessionCount))}
</p>
<div class="disclaimer-box">
  ${escapeHtml(report.disclaimer)}
</div>
<table>
  <thead>
    ${headerRow}
  </thead>
  <tbody>
    ${tableRows || '<tr><td colspan="5">Inga poster</td></tr>'}
  </tbody>
</table>
  `;

  return createSafeHtml(
    content,
    escapeHtml(report.title),
    customStyles
  );
}

/**
 * Prints a Vit Hub report as PDF
 * Opens print dialog where user can save as PDF
 * All content is XSS-protected with proper HTML escaping
 */
export function printVitHubReport(report: VitHubExportReport): void {
  try {
    const html = createVitHubReportHtml(report);
    printSecurely(html, escapeHtml(report.title));
  } catch (error) {
    console.error('Failed to print Vit Hub report:', error);
  }
}
