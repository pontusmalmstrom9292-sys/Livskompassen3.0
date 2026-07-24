/**
 * Static Swedish + banned-copy scan of src (fast).
 * Autofix ONLY inside string literals for TYPO_FIXES (never Mabra identifiers).
 * Default autofix OFF — polish-pass may set QA_SWEDISH_AUTOFIX=1.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { ROOT, QA_DIR, ensureQaDir, writeJson } from './lib/qa_harden_io.mjs';
import {
  BANNED_UI_TERMS,
  TYPO_FIXES,
  ENGLISH_UI_LEAKS,
  WEIRD_UI,
  allowEnglishContext,
  extractStringLiterals,
} from './lib/qa_swedish_dict.mjs';

ensureQaDir();

const SRC = resolve(ROOT, 'src');
const AUTOFIX = process.env.QA_SWEDISH_AUTOFIX === '1';

function collectFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist' || entry === 'assets') continue;
      collectFiles(full, acc);
    } else if (/\.(tsx?|jsx?)$/.test(entry) && !entry.endsWith('.d.ts')) {
      acc.push(full);
    }
  }
  return acc;
}

function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

const issues = [];
const fixes = [];
const files = collectFiles(SRC);

for (const file of files) {
  const rel = relative(ROOT, file);
  if (/\/dev\/|theme-lab|design-sandbox|sandbox\//i.test(rel)) continue;

  let raw = readFileSync(file, 'utf8');
  const text = stripComments(raw);
  let changed = false;

  if (!rel.includes('modules/core/copy/')) {
    for (const banned of BANNED_UI_TERMS) {
      if (text.includes(`'${banned}'`) || text.includes(`"${banned}"`) || text.includes(`\`${banned}\``)) {
        issues.push({
          code: 'BANNED_COPY',
          path: rel,
          detail: banned,
          swedish: `Förbjuden term i UI-sträng: «${banned}» (${rel}).`,
        });
      }
    }
  }

  const literals = extractStringLiterals(text);
  for (const lit of literals) {
    if (allowEnglishContext(lit)) continue;

    for (const { bad, good } of TYPO_FIXES) {
      if (!lit.includes(bad)) continue;
      issues.push({
        code: 'SWEDISH_TYPO',
        path: rel,
        detail: `${bad} → ${good}`,
        swedish: `Stavfel i text: «${bad}» ska vara «${good}» (${rel}).`,
      });
      if (AUTOFIX) {
        // Replace only inside quotes occurrences of the bad token as whole word in file strings
        const re = new RegExp(`(['"\`])([^'"\`]*)(${bad})([^'"\`]*)\\1`, 'g');
        const next = raw.replace(re, (_, q, a, _b, c) => `${q}${a}${good}${c}${q}`);
        if (next !== raw) {
          raw = next;
          changed = true;
          fixes.push({ path: rel, bad, good });
        }
      }
    }

    if (lit.length <= 40 && lit.trim().split(/\s+/).length <= 4) {
      for (const { re, hint } of ENGLISH_UI_LEAKS) {
        if (re.test(lit)) {
          issues.push({
            code: 'ENGLISH_UI',
            path: rel,
            detail: `«${lit}» → ${hint}`,
            swedish: `Engelska i UI: «${lit}» — använd «${hint}» (${rel}).`,
          });
          break;
        }
      }
    }

    for (const { re, code } of WEIRD_UI) {
      if (re.test(lit)) {
        issues.push({
          code: 'WEIRD_UI',
          path: rel,
          detail: `${code}: ${lit.slice(0, 60)}`,
          swedish: `Konstig text i UI (${code}) i ${rel}.`,
        });
        break;
      }
    }
  }

  if (changed) writeFileSync(file, raw);
}

const summary = {
  probe: 'swedish-static',
  at: new Date().toISOString(),
  autofix: AUTOFIX,
  issueCount: issues.length,
  fixCount: fixes.length,
  issues: issues.slice(0, 200),
  fixes: fixes.slice(0, 100),
};

writeJson('swedish-static.json', summary);

console.log(
  `\n=== SWEDISH STATIC === issues=${summary.issueCount} autofixes=${summary.fixCount} autofix=${AUTOFIX}`,
);
for (const i of issues.slice(0, 25)) {
  console.log(`  [${i.code}] ${i.path}: ${i.detail}`);
}
process.exit(issues.some((i) => i.code === 'BANNED_COPY') ? 1 : 0);
