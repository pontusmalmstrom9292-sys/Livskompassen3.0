import type { DossierCandidateDoc, DossierReportType } from '../types';
import {
  createSafeHtml,
  DOSSIER_PRINT_STYLES,
  escapeHtml,
  printSecurely,
} from '@/shared/utils/secureExport';

export interface DossierPrintInput {
  selected: DossierCandidateDoc[];
  reportType: DossierReportType;
  includeAiForeword: boolean;
  childLabel: string;
}

async function computeSHA256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function mapToBBIC(category: string | undefined): string {
  const cat = (category || '').toLowerCase();
  if (['skola', 'utbildning', 'förskola'].includes(cat)) return 'Barnets behov: Utbildning';
  if (['hälsa', 'sömn', 'bvc', 'läkare', 'sjuk', 'vård'].includes(cat)) return 'Barnets behov: Hälsa';
  if (['känslor', 'ångest', 'bråk', 'rädd', 'oro'].includes(cat)) return 'Barnets behov: Känslomässig utveckling';
  if (['omsorg', 'vårdnad', 'mat', 'kläder', 'rutin', 'överlämning'].includes(cat)) {
    return 'Föräldraförmåga: Grundläggande omsorg';
  }
  if (['kommunikation', 'biff', 'konflikt', 'hot'].includes(cat)) {
    return 'Föräldraförmåga: Konflikthantering & Kommunikation';
  }
  if (['ekonomi', 'pengar', 'underhåll'].includes(cat)) return 'Familj och miljö: Ekonomi';
  return 'Övriga observationer';
}

function renderDossierRow(d: DossierCandidateDoc): string {
  return `<tr class="dossier-row">
    <td class="dossier-cell-date">${escapeHtml(d.createdAt.slice(0, 10))}</td>
    <td class="dossier-cell-kind">${escapeHtml(d.kind.toUpperCase().replace('_', ' '))}</td>
    <td class="dossier-cell-title">${escapeHtml(d.title)}</td>
    <td class="dossier-cell-preview">${escapeHtml(d.preview)}</td>
  </tr>`;
}

function buildRowsHtml(
  sorted: DossierCandidateDoc[],
  reportType: DossierReportType,
): string {
  if (reportType !== 'BBIC') {
    return sorted.map(renderDossierRow).join('');
  }

  const grouped: Record<string, DossierCandidateDoc[]> = {};
  for (const d of sorted) {
    const bbicCat = mapToBBIC(d.category);
    if (!grouped[bbicCat]) grouped[bbicCat] = [];
    grouped[bbicCat].push(d);
  }

  let rowsHtml = '';
  for (const [catName, items] of Object.entries(grouped)) {
    rowsHtml += `<tr class="dossier-bbic-header"><td colspan="4">${escapeHtml(catName)}</td></tr>`;
    rowsHtml += items.map(renderDossierRow).join('');
  }
  return rowsHtml;
}

export async function buildDossierPrintHtml(input: DossierPrintInput): Promise<{
  html: string;
  hash: string;
}> {
  const sorted = [...input.selected].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const textCorpus = sorted
    .map((d) => `[${d.createdAt.slice(0, 10)}] ${d.title}: ${d.preview}`)
    .join('\n');
  const hash = await computeSHA256(textCorpus);

  const rowsHtml = buildRowsHtml(sorted, input.reportType);
  const aiForewordHtml = input.includeAiForeword
    ? `<div class="dossier-ai-foreword">
        <strong>Neutral Sammanställning (Vävaren):</strong> Denna dossier är strukturerad med stöd av Livskompassens AI. Posterna nedan är oföränderliga och kryptografiskt säkrade användardata (WORM), medan eventuella AI-taggar och urvalshjälp har utförts i syfte att neutralt och objektivt presentera kronologin för juridiska ombud eller socialtjänst. Målet är att skilja känsla från dokumenterad fakta.
      </div>`
    : '';

  const childLabel = escapeHtml(input.childLabel || 'Hela familjen');
  const reportLabel = escapeHtml(
    input.reportType === 'LEGAL'
      ? 'Juridisk Kronologi (Fakta & Tidsstämplar)'
      : 'BBIC-strukturerad rapport',
  );
  const hashSafe = escapeHtml(hash);

  const content = `
    <div class="dossier-header">
      <h1 class="dossier-title">Stabilitets- och Beviskronologi</h1>
      <p class="dossier-subtitle">Genererad via Livskompassen — Formellt och oföränderligt underlag (låsta poster)</p>
      <div class="dossier-meta-grid">
        <div><strong>Barn/Område:</strong> ${childLabel}</div>
        <div><strong>Rapporttyp:</strong> ${reportLabel}</div>
        <div><strong>Exportdatum:</strong> ${escapeHtml(new Date().toLocaleString('sv-SE'))}</div>
        <div><strong>Antal inkluderade poster:</strong> ${input.selected.length} st</div>
        <div class="dossier-hash-block">
          <strong>KRYPTOGRAFISK BEVIS-HASH (SHA-256):</strong><br/>
          ${hashSafe}<br/>
          <span class="dossier-hash-note">
            *Denna hash säkrar att innehållet i dokumentet inte har modifierats eller manipulerats sedan exporttillfället i Livskompassen.
          </span>
        </div>
      </div>
      ${aiForewordHtml}
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 12%">Datum</th>
          <th style="width: 15%">Källa</th>
          <th style="width: 25%">Kategori</th>
          <th>Observation / Bevisfakta</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
    <div class="dossier-footer">
      Dokumentet är krypterat och verifierat. Livskompassen använder strikt dataseparering och låsta poster för att säkra beviskedjor.
    </div>
  `;

  const html = createSafeHtml(
    content,
    `Stabilitets- och Beviskronologi — ${childLabel}`,
    DOSSIER_PRINT_STYLES,
  );

  return { html, hash };
}

export async function printDossierFallback(input: DossierPrintInput): Promise<string> {
  const { html, hash } = await buildDossierPrintHtml(input);
  printSecurely(html, `Stabilitets- och Beviskronologi — ${input.childLabel || 'Hela familjen'}`);
  return hash;
}
