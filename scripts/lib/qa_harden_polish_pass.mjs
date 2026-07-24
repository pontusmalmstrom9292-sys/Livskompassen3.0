/**
 * QA Harden Fas 1 — safe UI polish pass after each round.
 * Token/touch/spacing only. Never dock chrome-lock, Valv, or Tier C.
 *
 * Disable: QA_AUTO_POLISH=0
 * Returns { applied: number, notes: string[], files: string[] }
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT } from './qa_harden_io.mjs';

const MAX_FILES = 5;
const POLISH_CSS = resolve(ROOT, 'src/design-system/styles/qa-harden-auto-polish.css');
const INDEX_CSS = resolve(ROOT, 'src/index.css');
const IMPORT_LINE = "@import './design-system/styles/qa-harden-auto-polish.css';";

/** Route path prefix → CSS files we may polish (content only). */
const PATH_CSS_MAP = [
  { re: /^\/(mabra|vardagen)/, files: ['src/design-system/styles/mabra-vit-hub.css', 'src/design-system/styles/mabra-collapsible.css'] },
  { re: /^\/planering/, files: ['src/design-system/styles/planering-routines.css', 'src/design-system/styles/planering-tool-card.css'] },
  { re: /^\/hjartat|^\/reflection|^\/orakel/, files: ['src/design-system/styles/reflektion-panel.css', 'src/design-system/styles/dagbok-journal.css'] },
  { re: /^\/familjen|^\/barnporten|^\/hamn/, files: ['src/modules/shell/components/vardagen.css'] },
  { re: /^\/kompis/, files: ['src/design-system/styles/kompis-hub.css'] },
  { re: /^\/inkast|^\/widget/, files: ['src/design-system/styles/capture-breath.css'] },
  { re: /^\/sos/, files: ['src/design-system/styles/biff-triage.css'] },
];

const POLISH_CSS_BODY = `/**
 * QA Harden auto-polish (Fas 1) — content touch floor + calm chip spacing.
 * Does NOT touch BastaDesign dock / chrome-lock / Valv.
 * Generated/maintained by scripts/lib/qa_harden_polish_pass.mjs
 */

/* Hub content chips & tabs (not fixed dock) */
.hub-tabs button,
.calm-tabs button,
.familjen-layer-switch button,
[data-tab]:not([data-dock-item]),
.nav-truth-tab,
.hub-chip,
.calm-chip,
.mabra-chip,
.super-module-mode-chip {
  min-height: max(var(--ds-touch-target, 2.75rem), 44px);
  min-width: max(var(--ds-touch-target, 2.75rem), 44px);
}

/* Content CTA row — breathing room without redesign */
.hub-content .btn-pill,
.calm-scroll-island .btn-pill,
[data-scroll-island] .btn-pill {
  min-height: max(var(--ds-touch-target, 2.75rem), 44px);
  padding-inline: max(0.85rem, 12px);
}

/* Soft focus ring for keyboard / a11y polish */
.hub-content button:focus-visible,
.calm-scroll-island button:focus-visible,
[data-scroll-island] button:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--ds-gold, #fde68a) 55%, transparent);
  outline-offset: 2px;
}

/* Mockup button parity — gold accent + secondary calm (content only, not dock) */
.calm-scroll-island .btn-pill--accent,
.calm-scroll-island .ui-cta-gold,
[data-scroll-island] .btn-pill--accent,
[data-scroll-island] .ui-cta-gold,
.hub-content .btn-pill--accent,
.hub-content .ui-cta-gold {
  color: var(--ds-gold, #fde68a) !important;
  border-color: color-mix(in srgb, var(--ds-gold, #fde68a) 45%, transparent) !important;
}

.calm-scroll-island .btn-pill--secondary,
[data-scroll-island] .btn-pill--secondary,
.hub-content .btn-pill--secondary {
  min-height: max(var(--ds-touch-target, 2.75rem), 44px);
  border-radius: var(--ds-radius-pill, 999px);
}
`;

function ensurePolishCss() {
  const notes = [];
  let applied = 0;
  const files = [];

  const needParity = !existsSync(POLISH_CSS) || !readFileSync(POLISH_CSS, 'utf8').includes('Mockup button parity');
  if (!existsSync(POLISH_CSS) || readFileSync(POLISH_CSS, 'utf8').length < 80 || needParity) {
    writeFileSync(POLISH_CSS, POLISH_CSS_BODY);
    applied += 1;
    files.push('src/design-system/styles/qa-harden-auto-polish.css');
    notes.push(needParity ? 'Updated qa-harden-auto-polish.css (touch + mockup button parity)' : 'Created qa-harden-auto-polish.css');
  }

  if (existsSync(INDEX_CSS)) {
    let idx = readFileSync(INDEX_CSS, 'utf8');
    if (!idx.includes('qa-harden-auto-polish.css')) {
      // After premium-polish import
      if (idx.includes("premium-polish.css';")) {
        idx = idx.replace(
          "premium-polish.css';",
          `premium-polish.css';\n${IMPORT_LINE}`,
        );
      } else {
        idx = `${IMPORT_LINE}\n${idx}`;
      }
      writeFileSync(INDEX_CSS, idx);
      applied += 1;
      files.push('src/index.css');
      notes.push('Wired qa-harden-auto-polish.css into index.css');
    }
  }

  return { applied, notes, files };
}

/**
 * Ensure mapped CSS files use touch-target token on buttons where missing.
 */
function polishPathCss(tierA) {
  const notes = [];
  let applied = 0;
  const files = [];
  const touchFindings = (tierA || []).filter(
    (f) => f.code === 'TOUCH_TOO_SMALL' && f.path && !String(f.path).includes('/dev/'),
  );
  if (!touchFindings.length) return { applied, notes, files };

  const targets = new Set();
  for (const f of touchFindings) {
    const path = String(f.path).split('→')[0].replace(/^page:/, '').replace(/^device:/, '');
    for (const row of PATH_CSS_MAP) {
      if (row.re.test(path)) row.files.forEach((x) => targets.add(x));
    }
  }

  let count = 0;
  for (const rel of targets) {
    if (count >= MAX_FILES) break;
    // Never touch dock / chrome lock stylesheets
    if (/dock|floating-dock|basta-design|chrome-lock|exec-header/i.test(rel)) continue;
    const abs = resolve(ROOT, rel);
    if (!existsSync(abs)) continue;
    let src = readFileSync(abs, 'utf8');
    if (src.includes('qa-harden-touch-boost')) continue;
    // Append a scoped boost comment block once
    const boost = `

/* qa-harden-touch-boost — Fas 1 auto-polish (content buttons) */
button:not([data-dock-item]):not(.basta-dock-item),
[role="tab"],
[role="button"]:not([data-dock-item]) {
  min-height: max(var(--ds-touch-target, 2.75rem), 2.5rem);
}
`;
    writeFileSync(abs, src.trimEnd() + boost);
    applied += 1;
    count += 1;
    files.push(rel);
    notes.push(`Touch boost in ${rel}`);
  }

  return { applied, notes, files };
}

/**
 * @param {Array<{ code: string, path?: string }>} tierA
 * @param {{ round?: number }} opts
 */
export function applyPolishPass(tierA = [], opts = {}) {
  if (process.env.QA_AUTO_POLISH === '0') {
    return { applied: 0, notes: ['QA_AUTO_POLISH=0 — polish skip'], files: [] };
  }

  const notes = [`polish-pass round=${opts.round ?? '?'}`];
  let applied = 0;
  const files = [];

  const base = ensurePolishCss();
  applied += base.applied;
  notes.push(...base.notes);
  files.push(...base.files);

  const pathFix = polishPathCss(tierA);
  applied += pathFix.applied;
  notes.push(...pathFix.notes);
  files.push(...pathFix.files);

  if (applied === 0) {
    notes.push('Ingen ny polish (redan på plats)');
  }

  // Always re-run Swedish typo autofix as part of polish
  try {
    const r = spawnSync(process.execPath, [resolve(ROOT, 'scripts/debug_swedish_static.mjs')], {
      cwd: ROOT,
      encoding: 'utf8',
      env: { ...process.env, QA_SWEDISH_AUTOFIX: process.env.QA_SWEDISH_AUTOFIX || '1' },
    });
    const out = (r.stdout || '').slice(-200);
    notes.push(`swedish-autofix exit=${r.status ?? 1} ${out.replace(/\n/g, ' ').slice(0, 120)}`);
    if (existsSync(resolve(ROOT, '.cursor/qa-harden/swedish-static.json'))) {
      try {
        const s = JSON.parse(readFileSync(resolve(ROOT, '.cursor/qa-harden/swedish-static.json'), 'utf8'));
        if (s.fixCount > 0) {
          applied += s.fixCount;
          notes.push(`Swedish typos fixed: ${s.fixCount}`);
        }
      } catch {
        /* ignore */
      }
    }
  } catch (e) {
    notes.push(`swedish-autofix skip: ${e instanceof Error ? e.message : String(e)}`);
  }

  return { applied, notes, files: [...new Set(files)] };
}
