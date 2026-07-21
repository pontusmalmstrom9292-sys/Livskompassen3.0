/**
 * Content safety gate for Drogfrihet banks.
 * Usage: npm run smoke:drogfrihet-content
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const FORBIDDEN = [
  /ring\s*113\b/i,
  /tel:113\b/i,
  /\bstreaken\b/i,
  /leaderboard/i,
  /skärp dig/i,
  /du borde skämmas/i,
  /hur man får tag/i,
];

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function lintFile(rel) {
  const full = resolve(root, rel);
  assert(existsSync(full), `saknar ${rel}`);
  const text = readFileSync(full, 'utf8');
  for (const re of FORBIDDEN) {
    assert(!re.test(text), `${rel} innehåller förbjudet: ${re}`);
  }
  // "inga streaks" is OK — only block "streaken" / gamification praise
  return text;
}

function main() {
  const quote = lintFile('src/modules/features/dailyLife/drogfrihet/content/dfQuoteBank.ts');
  const q = lintFile('src/modules/features/dailyLife/drogfrihet/content/dfQuestionBank.ts');
  const n = lintFile('src/modules/features/dailyLife/drogfrihet/content/dfNotisBank.ts');
  lintFile('src/modules/features/dailyLife/drogfrihet/content/akutProtocolContent.ts');
  lintFile('src/modules/features/dailyLife/drogfrihet/content/aterfallContent.ts');
  lintFile('src/modules/features/dailyLife/drogfrihet/constants/resources.ts');

  assert(quote.includes('DF_QUOTE_COUNT'), 'quote bank saknar count');
  assert(q.includes('DF_QUESTION_COUNT'), 'question bank saknar count');
  assert(n.includes('DF_NOTIS_COUNT'), 'notis bank saknar count');

  assert(/DF_QUOTE_COUNT = 240/.test(quote) || /DF_QUOTE_COUNT = [2-9]\d{2}/.test(quote), 'quote bank behöver ≥240');
  assert(/DF_QUESTION_COUNT = 100/.test(q) || /DF_QUESTION_COUNT = [1-9]\d{2}/.test(q), 'question bank behöver ≥100');
  assert(/DF_NOTIS_COUNT = 90/.test(n) || /DF_NOTIS_COUNT = [9]\d|[1-9]\d{2}/.test(n), 'notis bank behöver ≥90');
  assert(/112/.test(readFileSync(resolve(root, 'src/modules/features/dailyLife/drogfrihet/constants/resources.ts'), 'utf8')), 'resources måste nämna 112');
  assert(/90101/.test(readFileSync(resolve(root, 'src/modules/features/dailyLife/drogfrihet/constants/resources.ts'), 'utf8')), 'resources måste nämna 90101');

  console.log('[smoke:drogfrihet-content] PASS');
}

main();
