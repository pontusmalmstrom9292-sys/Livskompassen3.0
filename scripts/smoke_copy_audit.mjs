/**
 * Static smoke: NAMN-AUDIT v2 — inga batch-1-förbjudna termer i user-facing TS/TSX utan copy-konstant.
 * Usage: npm run smoke:copy-audit
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const srcRoot = join(root, 'src');

/** Rå strängar som inte får förekomma utanför copy/ och functions/. */
const BANNED_LITERALS = [
  'Mitt Vit',
  'Paralys-Brytaren',
  'Paralys-brytare',
  'Paralysbrytaren',
  'Känslokort',
  'Frågesport',
];

const COPY_ALLOW_PREFIX = join(srcRoot, 'modules/core/copy');
const FUNCTIONS_PREFIX = join(root, 'functions');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function collectSourceFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist') continue;
      collectSourceFiles(full, acc);
    } else if (/\.tsx?$/.test(entry)) {
      acc.push(full);
    }
  }
  return acc;
}

function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

function isAllowedPath(filePath) {
  if (filePath.startsWith(COPY_ALLOW_PREFIX)) return true;
  if (filePath.startsWith(FUNCTIONS_PREFIX)) return true;
  return false;
}

/** KASAM i strängliteral — tillåt identifierare KASAM_STEPS / KasamEvening. */
function lineHasBannedKasam(line) {
  if (/\bKASAM_STEPS\b/.test(line) || /\bKasamData\b/.test(line) || /\bKasamEvening\b/.test(line)) {
    return false;
  }
  return /(['"`])[^'"`]*\bKASAM\b[^'"`]*\1/.test(line);
}

function scanFile(filePath) {
  if (isAllowedPath(filePath)) return [];
  const raw = readFileSync(filePath, 'utf8');
  const text = stripComments(raw);
  const rel = filePath.replace(`${root}/`, '');
  const hits = [];

  for (const banned of BANNED_LITERALS) {
    if (text.includes(banned)) {
      hits.push({ rel, banned });
    }
  }

  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (lineHasBannedKasam(trimmed)) {
      hits.push({ rel, banned: `KASAM in string literal: ${trimmed.slice(0, 72)}` });
    }
  }

  return hits;
}

function main() {
  assert(existsSync(join(srcRoot, 'modules/core/copy/compassBannerQuotes.ts')), 'saknar compassBannerQuotes.ts');
  assert(existsSync(join(srcRoot, 'modules/core/copy/compassWidgetLabels.ts')), 'saknar compassWidgetLabels.ts');

  const quotes = readFileSync(join(srcRoot, 'modules/core/copy/compassBannerQuotes.ts'), 'utf8');
  assert(quotes.includes('pickQuote'), 'compassBannerQuotes.ts saknar pickQuote');
  assert(quotes.includes('COMPASS_BANNER_QUOTES'), 'compassBannerQuotes.ts saknar katalog');

  const valvCopy = readFileSync(join(srcRoot, 'modules/core/copy/valvNavCopy.ts'), 'utf8');
  assert(valvCopy.includes('Min utveckling'), 'valvNavCopy.ts saknar Min utveckling');

  const files = collectSourceFiles(srcRoot);
  const allHits = files.flatMap(scanFile);

  if (allHits.length > 0) {
    const report = allHits.map((h) => `  ${h.rel}: ${h.banned}`).join('\n');
    throw new Error(`copy-audit FAIL — förbjudna termer utanför copy/:\n${report}`);
  }

  console.log('smoke:copy-audit PASS');
}

main();
