#!/usr/bin/env node
/**
 * Synkar kanon till docs/external-ai/gemini-kunskap/ för Gemini Custom Gem upload.
 * Kör: npm run gemini:sync:kunskap
 */
import { copyFileSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'url';
import { dirname } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outRoot = join(root, 'docs/external-ai/gemini-kunskap');

/** @type {{ dest: string; src: string }[]} */
const TIER1 = [
  { dest: '01-LIFE-OS-BUILD-STATE.md', src: 'docs/external-ai/LIFE-OS-BUILD-STATE.md' },
  { dest: '02-SECURITY-LOCK-MANIFEST.md', src: 'docs/external-ai/SECURITY-LOCK-MANIFEST.md' },
  { dest: '03-SYNAPSE-LOCK-SPEC.md', src: 'docs/external-ai/SYNAPSE-LOCK-SPEC.md' },
  { dest: '04-LIFE-OS-CORE-LOCKED.md', src: 'docs/external-ai/LIFE-OS-CORE-LOCKED.md' },
  {
    dest: '05-locked-ux-features-CURRENT.md',
    src: 'docs/system_sync/locked_ux_features_CURRENT.md',
  },
  {
    dest: '06-fas19-masterplan-v2.md',
    src: 'docs/evaluations/2026-06-15-fas19-masterplan-v2.md',
  },
  { dest: '07-DOC-INDEX.md', src: 'docs/DOC-INDEX.md' },
  { dest: '08-GEMINI-GEM-KNOWLEDGE.md', src: 'docs/external-ai/GEMINI-GEM-KNOWLEDGE.md' },
];

/** @type {{ dest: string; src: string }[]} */
const TIER2 = [
  { dest: '09-security.md', src: '.context/security.md' },
  { dest: '10-doman-covert-narcissism.md', src: '.context/domän-covert-narcissism.md' },
  { dest: '11-Arkiv-GAP-REGISTER.md', src: 'docs/specs/modules/Arkiv-GAP-REGISTER.md' },
  { dest: '12-INNEHALL-REGISTER.md', src: 'docs/INNEHALL-REGISTER.md' },
  { dest: '13-GCP-INVENTORY-LATEST.md', src: 'docs/GCP-INVENTORY-LATEST.md' },
  { dest: '14-GEMINI-ORKESTER-MASTER-PROMPT.md', src: 'docs/external-ai/GEMINI-ORKESTER-MASTER-PROMPT.md' },
  { dest: '15-flow-pipeline-karta.md', src: 'docs/evaluations/2026-06-17-flow-pipeline-karta.md' },
  { dest: '16-MALL-deep-research-modul.md', src: 'docs/evaluations/MALL-deep-research-modul.md' },
  {
    dest: '17-GEMINI-FLOW-CHAT-PROMPTS.md',
    src: 'docs/external-ai/GEMINI-FLOW-CHAT-PROMPTS.md',
  },
];

const EXTRA = [
  {
    dest: '00-SYSTEM-INSTRUCTION-KLISTRA-IN.txt',
    src: 'docs/external-ai/GEMINI-GEM-SYSTEM-INSTRUCTION-KLISTRA-IN.txt',
  },
];

const REPOMIX_SRC = join(root, 'exports/gemini-handoff/repomix');
const REPOMIX_DEST = join(outRoot, 'tier-3-repomix');

function copyMapped(entries, destDir) {
  mkdirSync(destDir, { recursive: true });
  const synced = [];
  const missing = [];

  for (const { dest, src } of entries) {
    const from = join(root, src);
    const to = join(destDir, dest);
    try {
      statSync(from);
      copyFileSync(from, to);
      synced.push({ src, dest: to.replace(root + '/', ''), bytes: statSync(to).size });
    } catch {
      missing.push(src);
    }
  }
  return { synced, missing };
}

function copyRepomixPacks() {
  mkdirSync(REPOMIX_DEST, { recursive: true });
  const synced = [];
  const missing = [];

  try {
    const files = readdirSync(REPOMIX_SRC).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const from = join(REPOMIX_SRC, file);
      const to = join(REPOMIX_DEST, file);
      copyFileSync(from, to);
      synced.push({ src: `exports/gemini-handoff/repomix/${file}`, dest: to.replace(root + '/', '') });
    }
  } catch {
    missing.push('exports/gemini-handoff/repomix/ (kör npm run gemini:pack först)');
  }
  return { synced, missing };
}

function main() {
  const tier1 = copyMapped(TIER1, outRoot);
  const tier2 = copyMapped(TIER2, join(outRoot, 'tier-2-valfritt'));
  const extra = copyMapped(EXTRA, outRoot);
  const repomix = copyRepomixPacks();

  const stamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  writeFileSync(
    join(outRoot, 'SYNC-STAMP.txt'),
    `Senast synkad: ${stamp}\nKommando: npm run gemini:sync:kunskap\n`,
    'utf8',
  );

  const allSynced = [...tier1.synced, ...tier2.synced, ...extra.synced, ...repomix.synced];
  const allMissing = [...tier1.missing, ...tier2.missing, ...extra.missing, ...repomix.missing];

  console.log('[gemini:sync:kunskap] Synkade', allSynced.length, 'filer till docs/external-ai/gemini-kunskap/');
  for (const row of allSynced) {
    console.log('  ', row.dest);
  }
  if (allMissing.length) {
    console.warn('[gemini:sync:kunskap] Saknade källor (hoppade över):');
    for (const m of allMissing) console.warn('  ', m);
  }
}

main();
