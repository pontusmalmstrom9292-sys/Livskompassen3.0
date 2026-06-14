#!/usr/bin/env node
/**
 * Snapshot critical config files into docs/system_sync/*_CURRENT.*
 * For Gemini / external AI context uploads.
 */
import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const syncDir = join(root, 'docs/system_sync');

const pairs = [
  ['package.json', 'package_CURRENT.json'],
  ['tailwind.config.js', 'tailwind_CURRENT.js'],
  ['firestore.rules', 'firestore_rules_CURRENT.rules'],
  ['storage.rules', 'storage_rules_CURRENT.rules'],
  ['tsconfig.json', 'tsconfig_CURRENT.json'],
  ['tsconfig.core-strict.json', 'tsconfig_core_strict_CURRENT.json'],
  ['.context/system-plan.md', 'system_plan_CURRENT.md'],
  ['.context/locked-ux-features.md', 'locked_ux_features_CURRENT.md'],
];

for (const [src, dst] of pairs) {
  copyFileSync(join(root, src), join(syncDir, dst));
  console.log(`[sync:system] ${src} → docs/system_sync/${dst}`);
}

const summaryPath = join(syncDir, 'system_architecture_summary.md');
let summary = readFileSync(summaryPath, 'utf8');
const today = new Date().toISOString().slice(0, 10);
const syncLine = `**Senast synkad:** ${today} · Källfiler i \`docs/system_sync/*_CURRENT.*\` · styrning: \`system_plan_CURRENT.md\`, \`locked_ux_features_CURRENT.md\` · säkerhet: \`firestore_rules_CURRENT.rules\`, \`storage_rules_CURRENT.rules\``;

if (summary.includes('**Senast synkad:**')) {
  summary = summary.replace(/\*\*Senast synkad:\*\*[^\n]*/, syncLine);
} else {
  summary = summary.replace(
    /(# System Architecture Summary[^\n]*\n\n)/,
    `$1${syncLine}\n\n`,
  );
}

writeFileSync(summaryPath, summary);
console.log(`[sync:system] system_architecture_summary.md (${today})`);
console.log('[sync:system] PASS');
