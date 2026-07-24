/**
 * Secure Export Utilities
 * Provides safe methods for exporting data as JSON and PDF with XSS protection
 */

/**
 * Properly escapes HTML special characters to prevent XSS attacks
 * @param text - The text to escape
 * @returns HTML-escaped text safe for insertion into HTML
 */
export function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapeMap[char]);
}

/**
 * Safely creates an HTML string for print/export
 * Uses proper escaping to prevent XSS injection
 */
export function createSafeHtml(content: string, title: string, styles: string = ''): string {
  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="Content-Security-Policy" content="script-src 'none'; object-src 'none';">
  <title>${escapeHtml(title)}</title>
  <style>${styles}</style>
</head>
<body>
${content}
</body>
</html>`;
}

/**
 * Downloads JSON data as a file
 * @param data - The data to export
 * @param filename - The filename (without path)
 */
export function downloadJsonFile(data: unknown, filename: string): void {
  try {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download JSON file:', error);
  }
}

/**
 * Opens a new window for printing with secure HTML content
 * @param htmlContent - The HTML content to print (should be pre-escaped)
 * @param title - The window/document title
 * @returns The opened window or null if blocked
 */
export function openPrintWindow(htmlContent: string, title: string = 'Document'): Window | null {
  const win = window.open('', '_blank', 'noopener,noreferrer');
  if (!win) {
    console.warn('Failed to open print window - may be blocked by browser');
    return null;
  }

  try {
    // Clear the document first
    win.document.open();

    // Write the HTML
    win.document.write(htmlContent);

    // Close the document to finish loading
    win.document.close();

    // Set the title if provided
    if (title) {
      win.document.title = title;
    }

    // Focus the window
    win.focus();

    return win;
  } catch (error) {
    console.error('Failed to set up print window:', error);
    return null;
  }
}

/**
 * Prints content safely
 * @param htmlContent - The HTML content to print (should be pre-escaped)
 * @param title - The document title
 */
export function printSecurely(htmlContent: string, title: string = 'Document'): void {
  const win = openPrintWindow(htmlContent, title);
  if (win) {
    // Wait for content to render before printing
    setTimeout(() => {
      win.print();
    }, 250);
  }
}

/**
 * Creates a safe HTML table row with escaped content
 * @param cells - Array of cell values to display
 * @returns HTML string for a table row
 */
export function createSafeTableRow(cells: (string | number)[]): string {
  const escapedCells = cells.map((cell) => {
    const raw = cell == null || cell === '' ? '—' : String(cell);
    return `<td>${escapeHtml(raw)}</td>`;
  }).join('');
  return `<tr>${escapedCells}</tr>`;
}

/**
 * Creates a safe HTML table header row
 * @param headers - Array of header values
 * @returns HTML string for a header row
 */
export function createSafeTableHeader(headers: string[]): string {
  const escapedHeaders = headers.map((header) =>
    `<th>${escapeHtml(header)}</th>`
  ).join('');
  return `<tr>${escapedHeaders}</tr>`;
}

/**
 * Default print styles for reports
 */
export const DEFAULT_PRINT_STYLES = `
  body {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 24px;
    color: var(--bg-teal-deep);
    line-height: 1.5;
    max-width: 900px;
    margin: 0 auto;
  }
  h1 {
    font-size: 20px;
    margin: 0 0 12px 0;
    color: var(--bg-teal-deep);
  }
  h2 {
    font-size: 16px;
    margin: 16px 0 8px 0;
    color: #1e293b;
  }
  p {
    margin: 8px 0;
    font-size: 13px;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
    font-size: 12px;
  }
  td, th {
    border: 1px solid #cbd5e1;
    padding: 8px;
    text-align: left;
  }
  th {
    background-color: #f1f5f9;
    font-weight: 600;
  }
  tr:nth-child(even) {
    background-color: var(--text);
  }
  .meta {
    font-size: 12px;
    color: var(--text-dim);
    margin: 8px 0;
  }
  .disclaimer {
    font-size: 11px;
    color: #475569;
    background-color: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 12px;
    margin: 16px 0;
  }
  @media print {
    body { padding: 0; }
    table { page-break-inside: avoid; }
    tr { page-break-inside: avoid; }
  }
`;

/**
 * Valv/Dossier zone — juridisk utskrift (vit papper, indigo accent).
 * Centraliserad P2-token för DossierPage fallback-print.
 */
export const DOSSIER_PRINT_STYLES = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    padding: 40px;
    color: #1e293b;
    background: #fff;
    line-height: 1.5;
  }
  .dossier-header {
    border-bottom: 2px solid var(--bg-teal-deep);
    padding-bottom: 16px;
    margin-bottom: 24px;
  }
  .dossier-title {
    font-size: 20px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0;
    color: var(--bg-teal-deep);
  }
  .dossier-subtitle {
    font-size: 12px;
    color: var(--text-dim);
    margin-top: 4px;
    margin-bottom: 0;
  }
  .dossier-meta-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-top: 16px;
    font-size: 12px;
    background: var(--text);
    padding: 14px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }
  .dossier-hash-block {
    grid-column: span 2;
    font-family: monospace;
    background: #f1f5f9;
    padding: 10px;
    border-radius: 6px;
    word-break: break-all;
    border: 1px solid #cbd5e1;
    font-size: 10px;
    line-height: 1.4;
  }
  .dossier-hash-note {
    font-size: 9px;
    color: var(--text-dim);
    font-weight: normal;
  }
  .dossier-ai-foreword {
    margin-top: 24px;
    padding: 16px;
    background: var(--text);
    border-left: 4px solid var(--accent-secondary);
    font-size: 11px;
    color: #334155;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 24px;
  }
  th {
    text-align: left;
    background: #f1f5f9;
    padding: 10px 8px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #cbd5e1;
    color: #475569;
  }
  .dossier-row {
    page-break-inside: avoid;
    border-bottom: 1px solid #cbd5e1;
  }
  .dossier-row td {
    padding: 12px 8px;
  }
  .dossier-cell-date {
    font-weight: 600;
    font-size: 11px;
    font-family: monospace;
    white-space: nowrap;
  }
  .dossier-cell-kind {
    font-weight: 700;
    font-size: 10px;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .dossier-cell-title {
    font-weight: 600;
    font-size: 12px;
    color: var(--bg-teal-deep);
  }
  .dossier-cell-preview {
    font-size: 12px;
    line-height: 1.5;
    color: #334155;
    white-space: pre-wrap;
  }
  .dossier-bbic-header td {
    background: #e2e8f0;
    padding: 8px 12px;
    font-weight: 700;
    font-size: 12px;
    color: var(--bg-teal-deep);
  }
  .dossier-footer {
    margin-top: 40px;
    border-top: 1px solid #cbd5e1;
    padding-top: 12px;
    font-size: 9px;
    color: var(--text-muted);
    text-align: center;
  }
  @media print {
    body { padding: 0; }
    tr { page-break-inside: avoid; }
  }
`;

/**
 * Mabra/Vit hub export — disclaimer-ruta (Obsidian Calm print, slate tokens).
 */
export const VIT_HUB_PRINT_STYLES = `
  .disclaimer-box {
    font-size: 11px;
    color: var(--text-dim);
    background-color: var(--text);
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 12px;
    margin: 16px 0;
  }
`;
