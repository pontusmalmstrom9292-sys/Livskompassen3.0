import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  escapeHtml,
  createSafeHtml,
  downloadJsonFile,
  openPrintWindow,
  createSafeTableRow,
  createSafeTableHeader,
} from './secureExport';

describe('secureExport utilities', () => {
  describe('escapeHtml', () => {
    it('should escape HTML entities', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
      );
    });

    it('should escape ampersands', () => {
      expect(escapeHtml('A & B')).toBe('A &amp; B');
    });

    it('should escape quotes', () => {
      expect(escapeHtml('He said "Hello"')).toBe('He said &quot;Hello&quot;');
    });

    it('should escape single quotes', () => {
      expect(escapeHtml("It's dangerous")).toBe('It&#39;s dangerous');
    });

    it('should handle empty strings', () => {
      expect(escapeHtml('')).toBe('');
    });

    it('should handle strings with no special characters', () => {
      expect(escapeHtml('Hello World')).toBe('Hello World');
    });

    it('should prevent XSS injection via onerror attribute', () => {
      const xssAttempt = '<img src=x onerror="alert(\'XSS\')">'; 
      const escaped = escapeHtml(xssAttempt);
      expect(escaped).toBe('&lt;img src=x onerror=&quot;alert(&#39;XSS&#39;)&quot;&gt;');
      // Escaped text may still contain the substring "onerror="; ensure no live HTML attribute
      expect(escaped).not.toMatch(/<img\b/i);
      expect(escaped).toContain('onerror=&quot;');
    });

    it('should prevent XSS injection via onclick attribute', () => {
      const xssAttempt = '<div onclick="malicious()">Click me</div>';
      const escaped = escapeHtml(xssAttempt);
      expect(escaped).not.toMatch(/<div\b/i);
      expect(escaped).toContain('onclick=&quot;');
    });

    it('should handle mixed content', () => {
      const content = 'A & B <tag> "quoted" \'single\'';
      const escaped = escapeHtml(content);
      expect(escaped).toBe('A &amp; B &lt;tag&gt; &quot;quoted&quot; &#39;single&#39;');
    });
  });

  describe('createSafeHtml', () => {
    it('should create valid HTML document', () => {
      const html = createSafeHtml('<p>Test</p>', 'Test Document');
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html');
      expect(html).toContain('</html>');
    });

    it('should escape title to prevent XSS', () => {
      const html = createSafeHtml('<p>Content</p>', '<script>alert("xss")</script>');
      expect(html).toContain('&lt;script&gt;');
      expect(html).not.toContain('<script>');
    });

    it('should include Content Security Policy header', () => {
      const html = createSafeHtml('<p>Test</p>', 'Test');
      expect(html).toContain('Content-Security-Policy');
      expect(html).toContain("script-src 'none'");
      expect(html).toContain("object-src 'none'");
    });

    it('should include custom styles', () => {
      const customStyle = 'body { color: red; }';
      const html = createSafeHtml('<p>Test</p>', 'Test', customStyle);
      expect(html).toContain(customStyle);
    });

    it('should set UTF-8 charset', () => {
      const html = createSafeHtml('<p>Test</p>', 'Test');
      expect(html).toContain('charset="utf-8"');
    });

    it('should set language to Swedish', () => {
      const html = createSafeHtml('<p>Test</p>', 'Test');
      expect(html).toContain('lang="sv"');
    });
  });

  describe('createSafeTableRow', () => {
    it('should create table row with escaped cells', () => {
      const row = createSafeTableRow(['A', 'B', 'C']);
      expect(row).toContain('<tr>');
      expect(row).toContain('</tr>');
      expect(row).toContain('<td>A</td>');
      expect(row).toContain('<td>B</td>');
      expect(row).toContain('<td>C</td>');
    });

    it('should escape content in cells', () => {
      const row = createSafeTableRow(['<script>alert("xss")</script>', 'B']);
      expect(row).toContain('&lt;script&gt;');
      expect(row).not.toContain('<script>');
    });

    it('should handle numbers', () => {
      const row = createSafeTableRow([1, 2, 3]);
      expect(row).toContain('<td>1</td>');
      expect(row).toContain('<td>2</td>');
      expect(row).toContain('<td>3</td>');
    });

    it('should replace empty cells with —', () => {
      const row = createSafeTableRow(['A', '', 'C']);
      expect(row).toContain('<td>A</td>');
      expect(row).toContain('<td>—</td>');
      expect(row).toContain('<td>C</td>');
    });

    it('should replace null/undefined cells with —', () => {
      const row = createSafeTableRow(['A', null as any, undefined as any, 'D']);
      expect(row).toContain('<td>A</td>');
      expect(row).toContain('<td>—</td>');
      expect(row).toContain('<td>D</td>');
    });
  });

  describe('createSafeTableHeader', () => {
    it('should create table header row', () => {
      const header = createSafeTableHeader(['Header1', 'Header2', 'Header3']);
      expect(header).toContain('<tr>');
      expect(header).toContain('</tr>');
      expect(header).toContain('<th>Header1</th>');
      expect(header).toContain('<th>Header2</th>');
      expect(header).toContain('<th>Header3</th>');
    });

    it('should escape header content', () => {
      const header = createSafeTableHeader(['<script>xss</script>']);
      expect(header).toContain('&lt;script&gt;');
      expect(header).not.toContain('<script>');
    });

    it('should handle special characters in headers', () => {
      const header = createSafeTableHeader(['A & B', '"Quoted"', "'Single'"]);
      expect(header).toContain('A &amp; B');
      expect(header).toContain('&quot;Quoted&quot;');
      expect(header).toContain('&#39;Single&#39;');
    });
  });

  describe('Integration tests', () => {
    it('should prevent XSS in complete flow', () => {
      const maliciousData = {
        title: '<script>alert("xss")</script>',
        content: '<img src=x onerror="alert(\'attack\')">', 
      };

      const html = createSafeHtml(
        `<p>${escapeHtml(maliciousData.content)}</p>`,
        maliciousData.title
      );

      // Verify no live script tags; event handler text is escaped (not executable)
      expect(html).not.toContain('<script>');
      expect(html).not.toMatch(/<img\b[^>]*onerror=/i);
      expect(html).toContain('onerror=&quot;');
      expect(html).toContain('alert'); // escaped text may remain; CSP blocks scripts
    });

    it('should create safe report with table', () => {
      const reportData = [
        { date: '2024-01-01', action: '<delete>', note: 'Test & verify' },
        { date: '2024-01-02', action: 'Update', note: '"Quoted" value' },
      ];

      const rows = reportData.map((row) =>
        createSafeTableRow([row.date, row.action, row.note])
      ).join('');

      const header = createSafeTableHeader(['Date', 'Action', 'Note']);

      const html = createSafeHtml(
        `<table><thead>${header}</thead><tbody>${rows}</tbody></table>`,
        'Report'
      );

      expect(html).not.toContain('<delete>');
      expect(html).toContain('&lt;delete&gt;');
      expect(html).toContain('Test &amp; verify');
    });
  });
});
