import type { VaultLog } from '../../core/types/firestore';

function formatRecord(log: VaultLog & { id: string }): string {
  const lines = [
    'LIVSKOMPASSEN — VERKLIGHETSVALV (WORM)',
    `Datum: ${(log.createdAt ?? '').slice(0, 19)}`,
    `Kategori: ${log.category ?? 'bevis'}`,
    `Typ: ${log.entryType ?? 'simple'}`,
    '',
    log.truth ?? '',
  ];

  if (log.theirVersion || log.myReality) {
    lines.push('', '--- Tvåspalt ---', `Hens version: ${log.theirVersion ?? '—'}`, `Min verklighet: ${log.myReality ?? '—'}`);
  }
  if (log.evidenceUrl) {
    lines.push('', `Media: ${log.evidenceUrl}`);
  }

  return lines.join('\n');
}

/** Öppnar utskriftsdialog — användaren kan spara som PDF. */
export function exportVaultRecordAsPdf(log: VaultLog & { id: string }): void {
  const body = formatRecord(log)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Valv-bevis</title>
<style>body{font-family:Inter,sans-serif;padding:2rem;color:#0f172a;line-height:1.5}</style></head>
<body>${body}</body></html>`;

  const win = window.open('', '_blank');
  if (!win) return;
  win.opener = null;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
}
