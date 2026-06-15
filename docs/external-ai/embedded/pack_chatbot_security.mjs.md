# Embedded: pack_chatbot_security.mjs

Kopiera till `scripts/pack_chatbot_security.mjs`:

```javascript
#!/usr/bin/env node
/**
 * Litet repomix-paket för ChatBox AI — säkerhet + synapser.
 * Kör: npm run chatbot:pack:security
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'exports/chatbot-handoff');
const output = join(outDir, 'chatbot-pack-security.md');

const include = [
  '.context/security.md',
  '.context/arkiv-minne.md',
  '.context/locked-ux-features.md',
  'docs/specs/modules/Arkiv-GAP-REGISTER.md',
  'docs/evaluations/2026-06-15-fas19-masterplan-v2.md',
  'firestore.rules',
  'functions/src/lib/callableGuards.ts',
  'functions/src/lib/vaultSessionGate.ts',
  'functions/src/callables/unlockVault.ts',
  'functions/src/adk/synapses/synapseBus.ts',
  'functions/src/adk/synapses/driveIngestSynapse.ts',
  'functions/src/adk/synapses/dcapAlertSynapse.ts',
  'functions/src/adk/synapses/journalWovenSynapse.ts',
  'functions/src/adk/synapses/paralysBrytarenSynapse.ts',
  'functions/src/adk/orchestrator.ts',
  'functions/src/adk/stateStore.ts',
  'functions/src/agents/cards/index.ts',
  'functions/src/agents/kompis-supervisor.ts',
  'src/modules/core/firebase/appCheck.ts',
  'src/modules/core/security/vaultWriteUnlock.ts',
  'docs/external-ai/LIFE-OS-BUILD-STATE.md',
].join(',');

mkdirSync(outDir, { recursive: true });

console.log('=== chatbot-pack-security ===');
const result = spawnSync(
  'npx',
  [
    'repomix',
    '--style',
    'markdown',
    '--compress',
    '--remove-comments',
    '--remove-empty-lines',
    '--no-directory-structure',
    '--include',
    include,
    '--output',
    output,
  ],
  { cwd: root, stdio: 'inherit', shell: true },
);

if (result.status !== 0) {
  console.error('[fail] chatbot-pack-security');
  process.exit(result.status ?? 1);
}

console.log(`\nKlart: ${output}`);
```
