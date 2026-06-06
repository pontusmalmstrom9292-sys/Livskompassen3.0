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
  const escapedCells = cells.map((cell) =>
    `<td>${escapeHtml(String(cell ?? '—'))}</td>`
  ).join('');
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
    color: #0f172a;
    line-height: 1.5;
    max-width: 900px;
    margin: 0 auto;
  }
  h1 {
    font-size: 20px;
    margin: 0 0 12px 0;
    color: #0f172a;
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
    background-color: #f8fafc;
  }
  .meta {
    font-size: 12px;
    color: #64748b;
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
