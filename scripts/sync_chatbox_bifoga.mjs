#!/usr/bin/env node
/**
 * Synkar kanon-filer till docs/external-ai/bifoga/ för enkel ChatBox-bifogning.
 * Kör: npm run chatbot:sync:bifoga
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const bifogaRoot = join(root, 'docs/external-ai/bifoga');

/** @type {Record<string, string[]>} */
const GROUPS = {
  '01-register': [
    'docs/DOC-INDEX.md',
    'docs/external-ai/LIFE-OS-BUILD-STATE.md',
    'docs/external-ai/SECURITY-LOCK-MANIFEST.md',
    'docs/external-ai/SYNAPSE-LOCK-SPEC.md',
    'docs/external-ai/UPLOAD-UNIFIED-SPEC.md',
    'docs/external-ai/DEPLOY-CHATBOT-WAVE.md',
    'docs/external-ai/APPCHECK-ENFORCE-GUIDE.md',
    'docs/external-ai/DESIGN-KEEP-REGISTER.md',
    'docs/external-ai/CHECKPOINT-LOG.md',
    'docs/external-ai/HYGIENE-LOG.md',
    'docs/external-ai/LIFE-OS-CORE-LOCKED.md',
    'docs/external-ai/imports/gap-matrix-2026-06-16.md',
  ],
  '02-leveranser': [
    'docs/external-ai/leveranser/2026-06-15-fas-01-security.md',
    'docs/external-ai/leveranser/2026-06-15-fas-02-upload-spec.md',
    'docs/external-ai/leveranser/2026-06-15-fas-03-backend-implementation.md',
    'docs/external-ai/leveranser/2026-06-15-fas-04-frontend-implementation.md',
    'docs/external-ai/leveranser/2026-06-15-fas-05-synapse-spec.md',
    'docs/external-ai/leveranser/2026-06-15-fas-05-cursor-implementation.md',
  ],
  '03-prompter': [
    'docs/external-ai/CHATBOT-MASTER-PROMPT.md',
    'docs/external-ai/PHASE-07-final-lock.md',
    'docs/external-ai/MODEL-PICKER.md',
    'docs/external-ai/CHATBOX-LATHUND.md',
    'exports/chatbot-handoff/prompts/PHASE-08-hygiene-audit.md',
    'exports/chatbot-handoff/prompts/PHASE-09-life-os-vision.md',
    'exports/chatbot-handoff/prompts/PHASE-10-nav-wave3-pmir.md',
    'exports/chatbot-handoff/prompts/PHASE-11-design-tokens.md',
    'exports/chatbot-handoff/prompts/PHASE-12-supermodule-polish.md',
  ],
};

const REPOMIX_PACKS = [
  'chatbot-pack-security.md',
  'ui-design-pack.md',
  'chatbot-pack-life-os-vision.md',
  'chatbot-pack-supermodules.md',
  'chatbot-pack-nav-wave3.md',
  'chatbot-pack-design-tokens.md',
  'chatbot-pack-hygiene.md',
];

function copyOne(relPath, destDir) {
  const src = join(root, relPath);
  const base = relPath.split('/').pop();
  const dest = join(destDir, base);
  copyFileSync(src, dest);
  return { src: relPath, dest: dest.replace(root + '/', ''), bytes: statSync(dest).size };
}

function main() {
  const synced = [];
  const missing = [];

  for (const [folder, paths] of Object.entries(GROUPS)) {
    const destDir = join(bifogaRoot, folder);
    mkdirSync(destDir, { recursive: true });
    for (const relPath of paths) {
      const src = join(root, relPath);
      try {
        statSync(src);
        synced.push(copyOne(relPath, destDir));
      } catch {
        missing.push(relPath);
      }
    }
  }

  const repomixDir = join(bifogaRoot, '04-repomix');
  mkdirSync(repomixDir, { recursive: true });
  const handoffDir = join(root, 'exports/chatbot-handoff');

  for (const name of REPOMIX_PACKS) {
    const repomixSrc = join(handoffDir, name);
    try {
      statSync(repomixSrc);
      copyFileSync(repomixSrc, join(repomixDir, name));
      synced.push({
        src: `exports/chatbot-handoff/${name}`,
        dest: `docs/external-ai/bifoga/04-repomix/${name}`,
        bytes: statSync(join(repomixDir, name)).size,
      });
    } catch {
      missing.push(`exports/chatbot-handoff/${name}`);
    }
  }

  if (missing.some((p) => p.startsWith('exports/chatbot-handoff/'))) {
    writeFileSync(
      join(repomixDir, 'README-SAKNAR-REPOMIX.md'),
      '# Repomix saknas\n\nKör först:\n\n```bash\nnpm run chatbot:pack:handoff\nnpm run chatbot:sync:bifoga\n```\n',
    );
  }

  const stamp = new Date().toISOString();
  writeFileSync(
    join(bifogaRoot, 'SYNC-STAMP.txt'),
    `Senast synkad: ${stamp}\nKommando: npm run chatbot:sync:bifoga\n`,
  );

  console.log('[chatbot:sync:bifoga] Synkade', synced.length, 'filer till docs/external-ai/bifoga/');
  for (const row of synced) {
    console.log('  ', row.dest);
  }
  if (missing.length) {
    console.warn('[chatbot:sync:bifoga] Saknade källor (hoppade över):');
    for (const p of missing) console.warn('  ', p);
    process.exitCode = 1;
  }
}

main();
