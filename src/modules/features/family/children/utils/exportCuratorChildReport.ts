/**
 * Fas C — avidentifierad export för kurator/jurist.
 * Endast alias (Barn 1 / Barn 2) — aldrig fulla juridiska namn, ingen media-URL.
 */
import {
  downloadJsonFile,
  escapeHtml,
  createSafeHtml,
  printSecurely,
  createSafeTableRow,
  createSafeTableHeader,
  DEFAULT_PRINT_STYLES,
} from '@/shared/utils/secureExport';
import type { ChildrenLogEntry } from '../types';
import { computeBalansIndex } from './balansIndex';
import { extractIncidentTagIds } from '../lib/incidentThemeFromLogs';
import { BALANS_WINDOW_DAYS } from '../constants';

export type CuratorExportOptions = {
  /** Defaults true — map Kasper→Barn 1 etc. */
  anonymizeAliases?: boolean;
  windowDays?: number;
};

export type CuratorIncidentRow = {
  date: string;
  category: string;
  epistemic: 'citat' | 'tolkning' | 'okand';
  note: string;
  patternTagIds: string[];
};

export type CuratorChildReport = {
  kind: 'livskompassen_curator_child_report_v1';
  disclaimer_sv: string;
  exportedAt: string;
  windowDays: number;
  childLabel: string;
  /** Original alias — only included when anonymizeAliases=false */
  childAliasRaw?: string;
  balansIndex: number;
  balansLabel: string;
  daysWithData: number;
  incidentCount: number;
  incidents: CuratorIncidentRow[];
};

const DISCLAIMER =
  'Avidentifierad sammanställning. Endast alias/etikett — inte personnummer eller fullständigt juridiskt namn. ' +
  'Observationer är beteende + datum. Ingen diagnosetikett. Endast för behörig mottagare (kurator/jurist) efter din bedömning.';

function epistemicOf(observation: string | undefined): CuratorIncidentRow['epistemic'] {
  if (!observation) return 'okand';
  if (/^\[citat\]/i.test(observation)) return 'citat';
  if (/^\[tolkning\]/i.test(observation)) return 'tolkning';
  return 'okand';
}

function stripEpistemic(observation: string | undefined): string {
  return (observation ?? '').replace(/^\[(citat|tolkning)\]\s*/i, '').trim();
}

/** Strip emails / long digit runs that look like phone or personnummer. */
function scrubPii(text: string): string {
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[epost]')
    .replace(/\b\d{6}[-+]?\d{4}\b/g, '[id]')
    .replace(/\b(?:\+46|0)\d[\d\s-]{6,}\b/g, '[tel]');
}

export function buildAliasMap(aliases: string[]): Map<string, string> {
  const unique = [...new Set(aliases.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'sv'));
  const map = new Map<string, string>();
  unique.forEach((a, i) => map.set(a, `Barn ${i + 1}`));
  return map;
}

export function exportCuratorChildReport(
  childAlias: string,
  logs: ChildrenLogEntry[],
  options: CuratorExportOptions = {},
): CuratorChildReport {
  const anonymize = options.anonymizeAliases !== false;
  const windowDays = options.windowDays ?? BALANS_WINDOW_DAYS;
  const allAliases = logs.map((l) => l.childAlias ?? '').filter(Boolean);
  const aliasMap = buildAliasMap(allAliases.length ? allAliases : [childAlias]);
  const childLabel = anonymize ? (aliasMap.get(childAlias) ?? 'Barn') : childAlias;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - windowDays);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const childLogs = logs.filter((l) => l.childAlias === childAlias);
  const incidents = childLogs
    .filter((l) => l.category === 'incident' || l.action === 'incident_analys')
    .filter((l) => {
      const day = (l.createdAt ?? '').slice(0, 10);
      return !day || day >= cutoffStr;
    })
    .map((l): CuratorIncidentRow => ({
      date: (l.createdAt ?? '').slice(0, 10) || '—',
      category: l.category ?? l.action ?? 'incident',
      epistemic: epistemicOf(l.observation),
      note: scrubPii(stripEpistemic(l.observation)).slice(0, 240),
      patternTagIds: extractIncidentTagIds(l.truth),
    }));

  const balans = computeBalansIndex(logs, childAlias);

  return {
    kind: 'livskompassen_curator_child_report_v1',
    disclaimer_sv: DISCLAIMER,
    exportedAt: new Date().toISOString(),
    windowDays,
    childLabel,
    ...(anonymize ? {} : { childAliasRaw: childAlias }),
    balansIndex: balans.index,
    balansLabel: balans.label,
    daysWithData: balans.daysWithData,
    incidentCount: incidents.length,
    incidents,
  };
}

export function downloadCuratorChildReportJson(report: CuratorChildReport): void {
  const safeLabel = report.childLabel.replace(/\s+/g, '-').toLowerCase();
  downloadJsonFile(report, `kurator-${safeLabel}-${report.exportedAt.slice(0, 10)}.json`);
}

function createCuratorReportHtml(report: CuratorChildReport): string {
  const rows = report.incidents
    .map((inc) =>
      createSafeTableRow([
        inc.date,
        inc.epistemic,
        inc.note.slice(0, 100),
        inc.patternTagIds.join(', ') || '—',
      ]),
    )
    .join('\n');

  const header = createSafeTableHeader(['Datum', 'Epistemik', 'Notering', 'Mönster-id']);

  const content = `
<h1>Kurator-/jurist­sammanställning — ${escapeHtml(report.childLabel)}</h1>
<p class="meta">${escapeHtml(report.disclaimer_sv)}</p>
<p class="meta">
  Exporterad: ${escapeHtml(report.exportedAt.slice(0, 19))} ·
  Balans: ${escapeHtml(String(report.balansIndex))}/100 (${escapeHtml(report.balansLabel)}) ·
  Incidenter: ${escapeHtml(String(report.incidentCount))} ·
  Fönster: ${escapeHtml(String(report.windowDays))} dagar
</p>
<table>
  <thead>${header}</thead>
  <tbody>${rows || '<tr><td colspan="4">Inga incidenter i perioden</td></tr>'}</tbody>
</table>
`;

  return createSafeHtml(
    content,
    `Kuratorrapport - ${escapeHtml(report.childLabel)}`,
    DEFAULT_PRINT_STYLES,
  );
}

export function printCuratorChildReport(report: CuratorChildReport): void {
  printSecurely(createCuratorReportHtml(report), `Kurator-${report.childLabel}`);
}
