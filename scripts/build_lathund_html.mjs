/**
 * Build styled HTML lathunds from markdown (tables, headings).
 * Usage: node scripts/build_lathund_html.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { marked } = require('marked');

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const docs = join(root, 'docs');

marked.setOptions({ gfm: true, breaks: false });

const CSS = `
@media print { .no-print { display: none; } body { font-size: 10pt; } }
body { font-family: Inter, system-ui, sans-serif; max-width: 720px; margin: 1.5rem auto; padding: 0 1rem; color: #111; line-height: 1.45; }
h1 { font-size: 1.35rem; border-bottom: 2px solid #333; padding-bottom: 0.35rem; }
h2 { font-size: 1.05rem; margin-top: 1.25rem; color: #222; }
h3 { font-size: 0.95rem; }
table { width: 100%; border-collapse: collapse; font-size: 0.88rem; margin: 0.6rem 0 1rem; }
th, td { border: 1px solid #ccc; padding: 0.4rem 0.55rem; text-align: left; vertical-align: top; }
th { background: #f0f0f0; font-weight: 600; }
code { font-size: 0.82rem; background: #f4f4f4; padding: 0.1rem 0.25rem; border-radius: 3px; }
pre { background: #f4f4f4; padding: 0.75rem; border-radius: 6px; overflow-x: auto; font-size: 0.82rem; }
pre code { background: none; padding: 0; }
p { margin: 0.5rem 0; }
hr { border: none; border-top: 1px solid #ddd; margin: 1.25rem 0; }
strong { font-weight: 600; }
.nav { margin: 0.75rem 0 1.25rem; }
.btn { display: inline-block; margin: 0.2rem 0.5rem 0.2rem 0; padding: 0.55rem 0.9rem; background: #1a1a1a; color: #fff !important; text-decoration: none; border-radius: 6px; font-size: 0.88rem; }
.btn:hover { background: #333; }
a { color: #0969da; }
em { color: #555; }
`;

function wrap(title, bodyHtml, indexHref) {
  const index = indexHref || 'LATHUND-INDEX.html';
  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — Livskompassen</title>
  <style>${CSS}</style>
</head>
<body>
  <div class="nav no-print">
    <a class="btn" href="#" onclick="window.print();return false;">Skriv ut (⌘P)</a>
    <a class="btn" href="${index}">Alla lathundar</a>
  </div>
  <article class="content">
${bodyHtml}
  </article>
  <div class="nav no-print">
    <a class="btn" href="#" onclick="window.print();return false;">Skriv ut (⌘P)</a>
    <a class="btn" href="${index}">Alla lathundar</a>
  </div>
</body>
</html>`;
}

const files = [
  { src: 'KOMPASS-MINNESKARTA.md', out: 'KOMPASS-MINNESKARTA.html', title: 'Minneskarta', index: 'LATHUND-INDEX.html' },
  { src: 'GIT-LATHUND.md', out: 'GIT-LATHUND.html', title: 'Git-lathund', index: 'LATHUND-INDEX.html' },
  { src: 'design/DESIGN-LATHUND.md', out: 'design/DESIGN-LATHUND.html', title: 'Design-lathund', index: '../LATHUND-INDEX.html' },
  { src: 'CURSOR-MENY-LATHUND.md', out: 'CURSOR-MENY-LATHUND.html', title: 'Cursor-menylathund', index: 'LATHUND-INDEX.html' },
];

for (const f of files) {
  const md = readFileSync(join(docs, f.src), 'utf8');
  const html = marked.parse(md);
  const outPath = join(docs, f.out);
  writeFileSync(outPath, wrap(f.title, html, f.index), 'utf8');
  console.log('[build_lathund_html]', f.out);
}
