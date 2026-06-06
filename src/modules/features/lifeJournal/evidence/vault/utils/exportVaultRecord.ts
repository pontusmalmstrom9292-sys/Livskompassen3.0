import type { VaultLog } from '@/core/types/firestore';
import {
  escapeHtml,
  createSafeHtml,
  printSecurely,
  DEFAULT_PRINT_STYLES,
} from '@/shared/utils/secureExport';

/**
 * Formats a vault log record into plain text
 * No HTML characters are used here - escaping happens during print
 */
function formatRecord(log: VaultLog & { id: string }): string {
  const lines = [
    'LIVSKOMPASSEN — ARKIV (LÅST POST)',
    `Datum: ${(log.createdAt ?? '').slice(0, 19)}`,
    `Kategori: ${log.category ?? 'bevis'}`,
    `Typ: ${log.entryType ?? 'simple'}`,
    '',
    log.truth ?? '',
  ];

  if (log.theirVersion || log.myReality) {
    lines.push(
      '',
      '--- Tvåspalt ---',
      `Hens version: ${log.theirVersion ?? '—'}`,
      `Min verklighet: ${log.myReality ?? '—'}`
    );
  }

  if (log.evidenceUrl) {
    lines.push('', `Media: ${log.evidenceUrl}`);
  }

  return lines.join('\n');
}

/**
 * Creates safe HTML for displaying the vault record
 * All user-provided content is properly escaped to prevent XSS attacks
 */
function createVaultRecordHtml(log: VaultLog & { id: string }): string {
  const plainText = formatRecord(log);

  // Split lines and create proper HTML with escaping
  const htmlLines = plainText.split('\n').map((line) => {
    const escaped = escapeHtml(line);
    if (line.startsWith('LIVSKOMPASSEN')) {
      return `<h1>${escaped}</h1>`;
    }
    if (line.startsWith('---')) {
      return `<hr><h2>${escaped}</h2>`;
    }
    if (line === '') {
      return '';
    }
    return `<p>${escaped}</p>`;
  });

  const content = htmlLines.join('\n');

  const html = createSafeHtml(
    content,
    `Valv-bevis - ${escapeHtml(log.category ?? 'bevis')}`,
    DEFAULT_PRINT_STYLES
  );

  return html;
}

/**
 * Exports a vault record as a printable PDF
 * Opens a print dialog where user can save as PDF
 * All content is properly XSS-protected with HTML escaping
 */
export function exportVaultRecordAsPdf(log: VaultLog & { id: string }): void {
  try {
    const html = createVaultRecordHtml(log);
    printSecurely(
      html,
      `Valv-bevis-${(log.createdAt ?? '').slice(0, 10)}`
    );
  } catch (error) {
    console.error('Failed to export vault record as PDF:', error);
  }
}
