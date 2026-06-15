#!/usr/bin/env node
/**
 * Komplett Valv-fokuserad repomix för Livskompassen v2.
 * Kör: npm run repomix:valv-komplett
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dateStamp = new Date().toISOString().slice(0, 10);
const outDir = join(root, 'exports/repomix-valv');
const repomixRaw = join(outDir, `_repomix-raw-${dateStamp}.md`);
const repomixFinal = join(outDir, `repomix-valv-komplett-${dateStamp}.md`);
const uploadDir = join(outDir, 'upload');

const REPOMIX_INCLUDE = [
  // Kontext & säkerhet
  '.context/security.md',
  '.context/locked-ux-features.md',
  '.context/arkiv-minne.md',
  '.context/architecture.md',
  '.context/database.md',
  '.context/modules/verklighetsvalvet.md',
  '.context/modules/valv_chatt.md',
  '.context/modules/dossier.md',
  // Valv-spec & design
  'docs/design/VALV-HUBB-SPEC.md',
  'docs/design/references/VALV-ICON-KANON.md',
  'docs/specs/modules/Verklighetsvalvet-SPEC.md',
  'docs/evaluations/VERKLIGHETSVALV-ARKITEKTUR.md',
  'docs/evaluations/2026-05-29-valv-samla-cursor-plan.md',
  'docs/SYSTEMKONTROLL.md',
  'docs/SMOKE_CHECKLIST.md',
  'AGENTS.md',
  // Hela frontend-moduler
  'src/modules/**',
  // Backend — Valv, session, entity, dossier, orkester
  'functions/src/index.ts',
  'functions/src/sharedRules.ts',
  'functions/src/callables/valv.ts',
  'functions/src/callables/unlockVault.ts',
  'functions/src/agents/valvChatAgent.ts',
  'functions/src/lib/vaultSessionGate.ts',
  'functions/src/lib/vaultWebAuthn.ts',
  'functions/src/lib/vaultRag.ts',
  'functions/src/lib/entityProfileStore.ts',
  'functions/src/lib/entityProfileTypes.ts',
  'functions/src/lib/guardSensitiveCallable.ts',
  'functions/src/lib/guardSensitiveCallableV2.ts',
  'functions/src/triggers/patternScanOnVaultCreate.ts',
  'functions/src/callables/analyzeMessage.ts',
  'functions/src/callables/generateDossier.ts',
  // Firestore & routing
  'firestore.rules',
  'firestore.indexes.json',
  'src/modules/core/routing/AppRoutes.tsx',
].join(',');

const SACRED_FEATURES = [
  { name: 'Verklighetsvalvet', files: ['src/modules/features/lifeJournal/evidence/vault/**', 'functions/src/callables/unlockVault.ts', 'functions/src/lib/vaultWebAuthn.ts'] },
  { name: 'Sanningens Sköld (WORM)', files: ['firestore.rules', 'src/modules/core/firebase/firestore.ts'] },
  { name: 'Dossier-Generator', files: ['src/modules/features/lifeJournal/evidence/vault/dossier/**', 'functions/src/callables/generateDossier.ts'] },
  { name: 'Speglings-Systemet', files: ['src/modules/features/lifeJournal/diary/mirror/**'] },
  { name: 'Draft Layer', files: ['src/modules/capture/**'] },
  { name: 'Device Clear', files: ['src/modules/core/security/clearDeviceSession.ts', 'src/modules/core/security/ClearDevicePanel.tsx'] },
  { name: 'Morgonkompassen', files: ['src/modules/features/dailyLife/wellbeing/compasses/**', 'src/modules/morning/**'] },
];

const LOCKED_UX_VALV = [
  { feature: 'Pansaret — Mönster & Orkester', route: '/valvet?vaultTab=…', files: [
    'src/modules/features/lifeJournal/evidence/vault/components/VaultMonsterPanel.tsx',
    'src/modules/features/lifeJournal/evidence/vault/components/VaultOrkesterPanel.tsx',
    'src/modules/features/lifeJournal/evidence/vault/components/VaultAktorskartaPanel.tsx',
    'src/modules/features/lifeJournal/evidence/vault/components/VaultKunskapsbankPanel.tsx',
    'src/modules/features/lifeJournal/evidence/vault/dossier/**',
  ]},
  { feature: 'Valv-gate & session', route: '/valvet', files: [
    'src/modules/core/security/VaultZoneGate.tsx',
    'src/modules/core/security/vaultSessionLifecycle.ts',
    'src/modules/core/auth/vaultServerSession.ts',
    'src/modules/core/auth/useZeroFootprint.ts',
    'functions/src/lib/vaultSessionGate.ts',
  ]},
  { feature: 'Sidomeny Vardag + Valv', route: 'drawer', files: [
    'src/modules/core/navigation/navTruth.ts',
    'src/modules/core/layout/NavigationDrawer.tsx',
  ]},
];

/** @param {string} dir */
function walkSourceFiles(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name.startsWith('.')) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkSourceFiles(full, acc);
    else if (/\.(ts|tsx|js|jsx|mjs)$/.test(name)) acc.push(full);
  }
  return acc;
}

function collectDeprecated() {
  const roots = [join(root, 'src/modules'), join(root, 'functions/src')];
  const hits = [];
  const re = /@deprecated[^\n]*/gi;
  for (const base of roots) {
    if (!statSync(base, { throwIfNoEntry: false })) continue;
    for (const file of walkSourceFiles(base)) {
      const text = readFileSync(file, 'utf8');
      const matches = text.match(re);
      if (!matches) continue;
      hits.push({
        path: relative(root, file),
        notes: [...new Set(matches.map((m) => m.trim()))],
      });
    }
  }
  return hits.sort((a, b) => a.path.localeCompare(b.path));
}

function buildIndex() {
  const deprecated = collectDeprecated();
  const valvDeprecated = deprecated.filter((d) =>
    /vault|valv|session|inkast|inbox/i.test(d.path) || d.notes.some((n) => /valv|vault|inkast|inbox|session/i.test(n)),
  );

  const lines = [
    '# Livskompassen v2 — Valv-komplett Repomix',
    '',
    `**Genererad:** ${new Date().toISOString()}`,
    '**Projekt:** livskompassen-v2 (StudioProjects/Livskompassen3.0)',
    '**Syfte:** Komplett kodbas med Valv-fokus för AI-analys. Endast textkälla — inga binärer/node_modules.',
    '',
    '---',
    '',
    '## Modulkarta (prioriterad Valv-kontext)',
    '',
    '| Område | Sökväg | Ansvar |',
    '|--------|--------|--------|',
    '| **Valv UI** | `src/modules/features/lifeJournal/evidence/vault/` | Zoner, flikar, bevislista, Orkester, Dossier, Mönster |',
    '| **Valv supermodul** | `.../vault/supermodule/ValvInputSuperModule.tsx` | Inkast/granska i Valv |',
    '| **Valv-chatt** | `src/modules/features/lifeJournal/evidence/vaultChat/` | AI-analys (Sannings-Analytikern) |',
    '| **Auth & session** | `src/modules/core/auth/` | Firebase Auth, WebAuthn, vaultServerSession |',
    '| **Säkerhetslager** | `src/modules/core/security/` | PIN, zone gate, idle timeout, Device Clear |',
    '| **Navigation** | `src/modules/core/navigation/` | navTruth, drawer, Valv-routes |',
    '| **Backend callables** | `functions/src/callables/valv.ts` | valvChatQuery, entity profiles, dossier |',
    '| **Backend agents** | `functions/src/agents/valvChatAgent.ts` | Valv RAG-agent |',
    '| **Session gate** | `functions/src/lib/vaultSessionGate.ts` | Server-side Valv-session efter WebAuthn |',
    '| **Entity store** | `functions/src/lib/entityProfileStore.ts` | G9 Aktörskarta metadata |',
    '| **WORM rules** | `firestore.rules` | reality_vault, dossier_snapshots append-only |',
    '',
    '---',
    '',
    '## Sacred Features (får inte försvagas — se `.context/security.md`)',
    '',
    '| Feature | Nyckelfiler |',
    '|---------|-------------|',
    ...SACRED_FEATURES.map((f) => `| **${f.name}** | ${f.files.map((p) => `\`${p}\``).join(', ')} |`),
    '',
    '**Smoke:** `npm run smoke:valv-gate`, `smoke:vault-worm`, `smoke:dossier`, `smoke:valv`, `smoke:entities`, `smoke:orkester`',
    '',
    '---',
    '',
    '## Locked UX — Valv-relaterade (får inte tas bort — se `.context/locked-ux-features.md`)',
    '',
  ];

  for (const block of LOCKED_UX_VALV) {
    lines.push(`### ${block.feature}`);
    lines.push(`- **Route:** ${block.route}`);
    lines.push('- **Filer:**');
    for (const f of block.files) lines.push(`  - \`${f}\``);
    lines.push('');
  }

  lines.push('---', '', '## @deprecated / pågående migrering (Valv-relaterat)', '');
  if (valvDeprecated.length === 0) {
    lines.push('_Inga markerade deprecated i Valv-scope._');
  } else {
    for (const d of valvDeprecated) {
      lines.push(`- **\`${d.path}\`**`);
      for (const n of d.notes) lines.push(`  - ${n}`);
    }
  }

  lines.push('', '---', '', '## Övriga @deprecated i src/modules + functions', '');
  const rest = deprecated.filter((d) => !valvDeprecated.includes(d));
  for (const d of rest.slice(0, 40)) {
    lines.push(`- \`${d.path}\`: ${d.notes[0]}`);
  }
  if (rest.length > 40) lines.push(`- _…och ${rest.length - 40} till i rå repomix._`);

  lines.push('', '---', '', '## Inkluderade mönster (repomix --include)', '', '```', REPOMIX_INCLUDE.replace(/,/g, '\n'), '```', '', '---', '', '# Repomix-innehåll (nedan)', '');

  return lines.join('\n');
}

mkdirSync(outDir, { recursive: true });
mkdirSync(uploadDir, { recursive: true });

console.log('=== Valv-komplett repomix ===');
const result = spawnSync(
  'npx',
  ['repomix', '--style', 'markdown', '--include', REPOMIX_INCLUDE, '--output', repomixRaw],
  { cwd: root, stdio: 'inherit', shell: true },
);
if (result.status !== 0) {
  console.error('[fail] repomix:valv-komplett');
  process.exit(result.status ?? 1);
}

const index = buildIndex();
const raw = readFileSync(repomixRaw, 'utf8');
writeFileSync(repomixFinal, `${index}\n\n${raw}`);
writeFileSync(join(uploadDir, `repomix-valv-komplett-${dateStamp}.md`), readFileSync(repomixFinal));
writeFileSync(
  join(uploadDir, 'LÄS-MIG.txt'),
  `Livskompassen v2 — Valv-komplett Repomix
=========================================

Fil att bifoga i Cursor/Gemini/ChatGPT:
  repomix-valv-komplett-${dateStamp}.md

Innehåll:
  - Hela src/modules/
  - Valv-backend (callables, agents, session gate, entity store)
  - firestore.rules + auth/security
  - Index: Sacred Features, Locked UX, @deprecated

Genererad: ${new Date().toISOString()}
Kör om: npm run repomix:valv-komplett
`,
);

const sizeMb = (statSync(repomixFinal).size / (1024 * 1024)).toFixed(2);
console.log(`\nKlart.`);
console.log(`  Huvudfil: ${repomixFinal} (${sizeMb} MB)`);
console.log(`  Upload:   ${uploadDir}/`);
