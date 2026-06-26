#!/usr/bin/env node
/**
 * smoke:secrets — enkel regex-skanner som letar API-nycklar, tokens och
 * service-account-material i filer som är staged för commit (lokal husky-gate).
 *
 * Designprinciper:
 * - Gratis och offline. Inga månadskostnader, inga API-anrop.
 * - Skannar endast staged filer (`git diff --cached --name-only`).
 *   Faller tillbaka till alla spårade filer när skriptet körs utanför git
 *   (CI eller manuell genomgång).
 * - Snabb fail med tydligt svenskt meddelande så otekninsk användare förstår
 *   varför committen avvisades.
 * - Whitelistar bindings för publika Firebase web-konfig (VITE_FIREBASE_*) som
 *   redan är publika via index.html. Riktiga secrets ska finnas i .env (ignored)
 *   eller GitHub Actions secrets.
 *
 * Exit-koder:
 *   0  — inga träffar
 *   1  — minst en misstänkt secret hittad
 */

import { execSync, execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { extname, relative, resolve } from 'node:path';

const ROOT = resolve(process.cwd());

/** Filer som aldrig får committas (helt blockerade oavsett innehåll). */
const FORBIDDEN_PATHS = [
  /(^|\/)\.env(\..+)?$/,
  /(^|\/)service-account.*\.json$/i,
  /(^|\/)gcp-key.*\.json$/i,
  /(^|\/)credentials\.json$/i,
  /(^|\/)client_secret.*\.json$/i,
  /(^|\/)firebase-adminsdk.*\.json$/i,
];

/** Filtyper vi struntar i (binär eller helt orelevant). */
const SKIP_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.svg',
  '.mp3', '.mp4', '.wav', '.ogg', '.webm',
  '.zip', '.gz', '.tar', '.7z',
  '.pdf', '.psd', '.ai',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.lock',
]);

/** Filer/kataloger som whitelistas helt (tom whitelist är fine). */
const ALLOWLIST_PATHS = [
  /(^|\/)scripts\/smoke_secrets\.mjs$/,           // detta skript självt
  /(^|\/)docs\/SAKERHETSNAT\.md$/,                // dokumentation med exempel
  /(^|\/)\.cursor\/rules\/sakerhetsnat-husky\.mdc$/,
];

/**
 * Regex-mönster som indikerar potentiell secret.
 * Listan är medvetet smal för att hålla false-positives nere — bättre att
 * släppa igenom 1 udda fall än att utlösa panik vid varje commit.
 */
const SECRET_PATTERNS = [
  {
    label: 'Google API Key',
    re: /AIza[0-9A-Za-z\-_]{35}/,
  },
  {
    label: 'GCP service-account private_key block',
    re: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  },
  {
    label: 'AWS Access Key ID',
    re: /\bAKIA[0-9A-Z]{16}\b/,
  },
  {
    label: 'GitHub Personal Access Token',
    re: /\bghp_[0-9A-Za-z]{36}\b/,
  },
  {
    label: 'GitHub fine-grained PAT',
    re: /\bgithub_pat_[0-9A-Za-z_]{82}\b/,
  },
  {
    label: 'Slack token',
    re: /\bxox[abprs]-[0-9A-Za-z-]{10,}/,
  },
  {
    label: 'Stripe live secret key',
    re: /\bsk_live_[0-9A-Za-z]{16,}\b/,
  },
  {
    label: 'OpenAI API key',
    // Negativ lookahead efter "ant-" så vi inte dubbel-matchar Anthropic-nycklar.
    re: /\bsk-(?!ant-)(?:proj-)?[A-Za-z0-9_-]{20,}/,
  },
  {
    label: 'Anthropic API key',
    re: /\bsk-ant-[A-Za-z0-9_-]{20,}/,
  },
  {
    label: 'Firebase Cloud Messaging server key (legacy)',
    re: /\bAAAA[A-Za-z0-9_-]{7}:[A-Za-z0-9_-]{140,}\b/,
  },
];

/** Strängar som matchar generic secret men är ofarliga (placeholder/exempel). */
const SAFE_CONTEXTS = [
  /placeholder/i,
  /example/i,
  /your[-_]?api[-_]?key/i,
  /xxxx+/i,
];

function isAllowlisted(path) {
  return ALLOWLIST_PATHS.some((re) => re.test(path));
}

function isForbiddenPath(path) {
  return FORBIDDEN_PATHS.some((re) => re.test(path));
}

function getStagedFiles() {
  try {
    const out = execSync('git diff --cached --name-only --diff-filter=ACMR', {
      encoding: 'utf8',
    });
    return out
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return null;
  }
}

function getAllTrackedFiles() {
  try {
    const out = execSync('git ls-files', { encoding: 'utf8' });
    return out
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

function readStagedBlob(path) {
  // Läser den staged versionen av filen (vad git commit faktiskt skapar),
  // inte working tree-versionen. Hindrar att en staged secret undgår
  // upptäckt om användaren tar bort den ur working tree efter staging.
  // Använder execFileSync (inte execSync) så att path-argumentet
  // inte tolkas av en shell.
  try {
    const buf = execFileSync('git', ['show', `:${path}`], {
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 4 * 1024 * 1024,
    });
    return buf.toString('utf8');
  } catch {
    return null;
  }
}

function readSafe(path) {
  // Fallback för icke-staging-läge (CI / manuell genomgång) — läs working tree.
  try {
    const abs = resolve(ROOT, path);
    const st = statSync(abs);
    if (!st.isFile()) return null;
    // Hoppa över väldigt stora filer (>2 MB) — sällan är secrets i binärer.
    if (st.size > 2 * 1024 * 1024) return null;
    return readFileSync(abs, 'utf8');
  } catch {
    return null;
  }
}

function scan(files, { staged }) {
  const findings = [];

  for (const file of files) {
    const rel = relative(ROOT, resolve(ROOT, file));
    if (isAllowlisted(rel)) continue;

    if (isForbiddenPath(rel)) {
      findings.push({
        file: rel,
        reason: 'Förbjuden filsökväg (secrets-mall: .env / service-account / credentials).',
      });
      continue;
    }

    if (SKIP_EXTENSIONS.has(extname(rel).toLowerCase())) continue;

    // I staging-läge: läs staged blob (vad git committar) i stället för disk.
    const content = staged ? readStagedBlob(rel) : readSafe(rel);
    if (!content) continue;
    if (content.length > 2 * 1024 * 1024) continue;

    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Hoppa kommenterade utgivna placeholders och rader markerade som godkända.
      if (/sakerhetsnat:allow/i.test(line)) continue;
      for (const pattern of SECRET_PATTERNS) {
        const match = line.match(pattern.re);
        if (!match) continue;
        const isSafe = SAFE_CONTEXTS.some((re) => re.test(line));
        if (isSafe) continue;
        findings.push({
          file: rel,
          line: i + 1,
          reason: `Misstänkt ${pattern.label}: ${match[0].slice(0, 12)}…`,
        });
      }
    }
  }

  return findings;
}

function printHeader() {
  console.log('[smoke:secrets] Skannar staged filer efter API-nycklar, tokens och credentials…');
}

function printFindings(findings) {
  console.error('\n[smoke:secrets] STOPP — möjliga hemligheter upptäckta:');
  for (const f of findings) {
    const where = f.line ? `${f.file}:${f.line}` : f.file;
    console.error(`  - ${where} — ${f.reason}`);
  }
  console.error(
    '\nÅtgärder:\n' +
    '  1. Ta bort nyckeln/filen ur staging: git restore --staged <fil>\n' +
    '  2. Flytta riktig secret till .env (lokalt) eller GitHub Actions secrets (CI).\n' +
    '  3. Om träffen är en false-positive (placeholder, exempel): lägg till\n' +
    '     kommentaren "sakerhetsnat:allow" på samma rad.\n' +
    '  4. Läs docs/SAKERHETSNAT.md för fullständig checklista.\n'
  );
}

function main() {
  printHeader();
  let files = getStagedFiles();
  let staged = true;
  if (files === null) {
    console.log('[smoke:secrets] Inget git-staging-läge — skannar alla spårade filer som fallback.');
    files = getAllTrackedFiles();
    staged = false;
  } else if (files.length === 0) {
    console.log('[smoke:secrets] Inga staged filer. PASS.');
    process.exit(0);
  }

  const findings = scan(files, { staged });
  if (findings.length === 0) {
    console.log(`[smoke:secrets] PASS — inga hemligheter hittade (${files.length} filer skannade).`);
    process.exit(0);
  }

  printFindings(findings);
  process.exit(1);
}

main();
