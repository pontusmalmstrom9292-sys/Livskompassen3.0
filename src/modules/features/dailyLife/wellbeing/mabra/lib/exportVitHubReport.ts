import type { VitEntryRow } from '@/core/types/firestore';
import { VIT_HUB_EXPORT_DISCLAIMER } from './vitHubCopy';
import { vitProjectTitle, type VitHubStats } from './vitHubStats';

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

const EXPORT_DISCLAIMER = VIT_HUB_EXPORT_DISCLAIMER;

const KIND_LABELS: Record<VitEntryRow['kind'], string> = {
  card: 'Frågekort',
  memory: 'Känslominne',
  chat_turn: 'Dialog',
};

function entryDate(entry: VitEntryRow): string {
  return entry.cardDateKey ?? entry.createdAt?.slice(0, 10) ?? '—';
}

export function buildVitHubExportReport(
  entries: VitEntryRow[],
  stats: VitHubStats,
): VitHubExportReport {
  return {
    exportedAt: new Date().toISOString(),
    title: 'Mitt Vit — personlig export',
    disclaimer: EXPORT_DISCLAIMER,
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

export function downloadVitHubReportJson(report: VitHubExportReport): void {
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mitt-vit-${report.exportedAt.slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Klient-utskrift — PDF via webbläsarens utskriftsdialog (inte dossier). */
export function printVitHubReport(report: VitHubExportReport): void {
  const w = window.open('', '_blank', 'noopener,noreferrer');
  if (!w) return;

  const entryRows = report.entries
    .map(
      (e) =>
        `<tr>
          <td>${e.date}</td>
          <td>${e.projectTitle}</td>
          <td>${KIND_LABELS[e.kind]}</td>
          <td>${e.bankId}</td>
          <td>${escapeHtml(e.responseText || '—')}</td>
        </tr>`,
    )
    .join('');

  w.document.write(`<!DOCTYPE html><html lang="sv"><head><meta charset="utf-8" />
<title>${report.title}</title>
<style>
  body { font-family: system-ui, sans-serif; padding: 24px; color: #111; max-width: 800px; }
  h1 { font-size: 18px; margin-bottom: 4px; }
  .meta { font-size: 12px; color: #444; margin-bottom: 16px; }
  .disclaimer { font-size: 11px; color: #666; border: 1px solid #ddd; padding: 8px; margin-bottom: 16px; }
  table { border-collapse: collapse; width: 100%; font-size: 11px; }
  td, th { border: 1px solid #ccc; padding: 6px; vertical-align: top; }
  th { text-align: left; background: #f5f5f5; }
</style></head><body>
<h1>${report.title}</h1>
<p class="meta">Exporterad: ${report.exportedAt.slice(0, 19)} · Sparade svar: ${report.stats.totalEntries} · Aktiva dagar: ${report.stats.activeDays}</p>
<p class="disclaimer">${report.disclaimer}</p>
<table>
  <thead><tr><th>Datum</th><th>Projekt</th><th>Typ</th><th>Bank</th><th>Innehåll</th></tr></thead>
  <tbody>${entryRows || '<tr><td colspan="5">Inga poster</td></tr>'}</tbody>
</table>
</body></html>`);
  w.document.close();
  w.focus();
  w.print();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
