#!/usr/bin/env node
/**
 * Audits calm-card-style class usage outside the core definition styles.
 * Fails if any tracked variant has no usage in the app/theme sources.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';

const root = join(import.meta.dirname, '..');
const src = join(root, 'src');
const definitionFiles = new Set([
  join(src, 'design-system/styles/obsidian-calm-glass.css'),
  join(src, 'design-system/styles/obsidian-calm-shells.css'),
  join(src, 'design-system/styles/components.css'),
  join(src, 'design-system/styles/premium-polish.css'),
]);
const trackedClasses = ['calm-card', 'calm-card-midnight', 'glass-card', 'glass-card--ai'];

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (['.ts', '.tsx', '.css'].includes(extname(entry.name)) && !definitionFiles.has(full)) {
      files.push(full);
    }
  }
  return files;
}

function countClassUsage(filePaths, className) {
  const pattern = new RegExp(`(^|[^A-Za-z0-9_-])${className}(?![A-Za-z0-9_-])`, 'g');
  let count = 0;
  for (const filePath of filePaths) {
    const text = readFileSync(filePath, 'utf8');
    const matches = text.match(pattern);
    if (matches) {
      count += matches.length;
    }
  }
  return count;
}

const files = walk(src);
const classes = Object.fromEntries(
  trackedClasses.map((className) => [className, countClassUsage(files, className)]),
);
const unused = trackedClasses.filter((className) => classes[className] === 0);

console.log(JSON.stringify({ classes, unused, scannedFiles: files.length }, null, 2));

if (unused.length) {
  console.error(`[smoke:calm-card-audit] FAIL — unused classes: ${unused.join(', ')}`);
  process.exit(1);
}

console.log('[smoke:calm-card-audit] PASS — no unused calm-card variants found');
