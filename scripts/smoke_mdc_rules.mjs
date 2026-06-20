#!/usr/bin/env node
/**
 * Static smoke: Cursor MDC rule hygiene (Nivå B+C).
 * Usage: npm run smoke:mdc
 *
 * Checks:
 * - Exactly one alwaysApply: true → .cursor/index.mdc
 * - No catch-all globs: *
 * - Every .mdc under .cursor/ has description
 * - Thin-pointer wiring (design-calm, grunder-kanon, skills)
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, dirname, relative, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const cursorDir = resolve(root, '.cursor');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function walkMdc(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walkMdc(full, acc);
    } else if (entry.endsWith('.mdc')) {
      acc.push(full);
    }
  }
  return acc;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  return match[1];
}

function getField(frontmatter, field) {
  const re = new RegExp(`^${field}:\\s*(.+)$`, 'm');
  const m = frontmatter.match(re);
  return m ? m[1].trim() : undefined;
}

function hasAlwaysApplyTrue(frontmatter) {
  return /^alwaysApply:\s*true\s*$/m.test(frontmatter);
}

function hasCatchAllGlob(frontmatter) {
  if (!frontmatter.includes('globs')) return false;
  const lines = frontmatter.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^globs:\s*\*\s*$/.test(trimmed)) return true;
    if (/^globs:\s*["']?\*["']?\s*$/.test(trimmed)) return true;
    if (/^-\s*\*\s*$/.test(trimmed)) return true;
    if (/^-\s*["']?\*["']?\s*$/.test(trimmed)) return true;
    if (/^globs:\s*\*\*\/\*\*\s*$/.test(trimmed)) return true;
  }
  return false;
}

function mustInclude(relPath, ...needles) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  const text = readFileSync(full, 'utf8');
  for (const needle of needles) {
    assert(text.includes(needle), `${relPath} saknar: ${needle}`);
  }
}

function main() {
  console.log('[smoke:mdc] Validerar .cursor/**/*.mdc …');

  assert(existsSync(cursorDir), 'saknar .cursor/');

  const files = walkMdc(cursorDir);
  assert(files.length > 0, 'inga .mdc-filer hittades under .cursor/');

  const alwaysApplyFiles = [];

  for (const fullPath of files) {
    const rel = relative(root, fullPath);
    const content = readFileSync(fullPath, 'utf8');
    const fm = parseFrontmatter(content);

    assert(fm !== null, `${rel} saknar YAML frontmatter (---)`);

    const description = getField(fm, 'description');
    assert(description && description.length > 0, `${rel} saknar description`);

    if (hasAlwaysApplyTrue(fm)) {
      alwaysApplyFiles.push(rel);
    }

    assert(!hasCatchAllGlob(fm), `${rel} har förbjuden catch-all glob (*)`);
  }

  assert(
    alwaysApplyFiles.length === 1,
    `förväntat exakt 1 alwaysApply: true, hittade ${alwaysApplyFiles.length}: ${alwaysApplyFiles.join(', ')}`,
  );
  assert(
    alwaysApplyFiles[0] === '.cursor/index.mdc',
    `enda alwaysApply: true ska vara .cursor/index.mdc, var: ${alwaysApplyFiles[0]}`,
  );

  // B1 — thin pointers
  mustInclude('.cursor/rules/projectGuard.mdc', 'grunder-kanon.mdc', 'GUARD-REGLERBOK.md');
  mustInclude('.cursor/rules/guard-regelbok.mdc', 'grunder-kanon.mdc', 'Ej tillräckligt data');
  mustInclude('.cursor/rules/grunder-kanon.mdc', 'U1', 'U6', 'PMIR-gates', 'Ej tillräckligt data');

  // B2 — design merge
  mustInclude('.cursor/rules/ui-design.mdc', 'design-calm.mdc', 'Kanon flyttad');
  mustInclude('.cursor/rules/design-calm.mdc', 'OBSIDIAN CALM 2.0', 'Progressive disclosure');

  // B3 — assistant tone in index
  mustInclude('.cursor/index.mdc', 'Progressive disclosure', 'Inget JADE');

  // C2 — skill pointers
  mustInclude('.cursor/rules/memory-silo.mdc', 'livskompassen-memory-silo-guard');
  mustInclude('.cursor/rules/synapser-adk.mdc', 'livskompassen-synapser-adk');
  mustInclude('.cursor/rules/security-firestore.mdc', '.context/security.md', 'grunder-kanon.mdc');

  console.log(`[smoke:mdc] PASS — ${files.length} MDC-filer, 1 alwaysApply, inga catch-all globs.`);
}

try {
  main();
} catch (err) {
  console.error('[smoke:mdc] FAIL:', err.message);
  process.exit(1);
}
