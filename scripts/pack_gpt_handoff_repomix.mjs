#!/usr/bin/env node
/**
 * RepoMix-paket för GPT-handoff (arkitektur-först, fem steg).
 * Kör: npm run gpt-handoff:pack
 *      npm run gpt-handoff:pack:01  (endast pack 01)
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'exports/gpt-handoff/repomix');

const PACK_01_INCLUDE = [
  'package.json',
  'tsconfig.json',
  'tsconfig.app.json',
  'tsconfig.node.json',
  'tailwind.config.js',
  'vite.config.ts',
  'firebase.json',
  'firestore.rules',
  'storage.rules',
  'src/main.tsx',
  'src/App.tsx',
  'src/styles/obsidian-calm-2.css',
  'src/modules/core/routing/**',
  'src/modules/core/navigation/**',
  'src/modules/core/copy/valvNavCopy.ts',
  'src/modules/core/layout/**',
  'src/modules/core/pages/HomePage.tsx',
  'src/modules/core/pages/FamiljenPage.tsx',
  'src/modules/core/pages/DagbokPage.tsx',
  'src/modules/core/pages/ValvetRoutePage.tsx',
  'src/modules/shell/**',
  'src/modules/features/admin/planning/components/PlaneringPage.tsx',
  'src/modules/features/admin/planning/planeringHubConfig.ts',
  'src/modules/core/auth/AuthProvider.tsx',
  'src/modules/core/auth/AuthGate.tsx',
  'src/modules/core/auth/sessionService.ts',
  'src/modules/core/auth/valvFyrenGate.ts',
  'src/modules/core/auth/useZeroFootprint.ts',
  'src/modules/core/auth/vaultServerSession.ts',
  'src/modules/core/theme/ThemeProvider.tsx',
  'src/modules/core/components/fyrenWidgetContext.tsx',
  'src/modules/core/store/index.ts',
  'src/modules/core/store/NavigationStore.ts',
  'src/modules/core/store/useVaultStore.ts',
  'src/modules/core/store/useEvolutionStore.ts',
  'src/modules/core/store/useCapacityGate.ts',
  'src/modules/core/security/vaultSessionLifecycle.ts',
  'src/modules/core/security/vaultZones.ts',
  'src/modules/core/security/VaultZoneGate.tsx',
  'src/modules/core/security/vaultPin.ts',
  'src/modules/core/security/vaultWriteUnlock.ts',
  'src/modules/core/types/firestore.ts',
  'src/modules/core/firebase/init.ts',
  'src/modules/core/firebase/firestore.ts',
  'src/modules/core/manifest/**',
  'functions/src/index.ts',
  'functions/src/sharedRules.ts',
  'functions/src/agents/DCAP.ts',
  'functions/src/callables/knowledge.ts',
  'functions/src/callables/valv.ts',
  'functions/src/agents/knowledgeVaultAgent.ts',
  'functions/src/agents/valvChatAgent.ts',
  'functions/src/agents/childrenLogsAgent.ts',
  'functions/src/lib/kampsparQueryRag.ts',
  'functions/src/lib/vaultRag.ts',
  'functions/src/lib/childrenLogsQueryRag.ts',
  'functions/src/lib/barnenModuleRouteGuard.ts',
  'functions/src/lib/mabraCoachGuard.ts',
  '.context/architecture.md',
  '.context/arkiv-minne.md',
  '.context/security.md',
  '.context/system-plan.md',
  'AGENTS.md',
  'docs/SYSTEMKONTROLL.md',
  'docs/design/references/MENU-DRAWER-KANON.md',
  'docs/design/references/DOCK-KANON.md',
].join(',');

const PACK_02_INCLUDE = [
  'docs/specs/modules/Verklighetsvalvet-SPEC.md',
  'docs/design/VALV-HUBB-SPEC.md',
  '.context/locked-ux-features.md',
  '.context/arkiv-minne.md',
  '.context/security.md',
  'firestore.rules',
  'src/modules/core/navigation/navTruth.ts',
  'src/modules/core/pages/ValvetRoutePage.tsx',
  'src/modules/features/lifeJournal/evidence/vault/**',
  'src/modules/features/lifeJournal/evidence/vaultChat/**',
  'src/modules/features/lifeJournal/evidence/knowledge/components/VaultKunskapsbankPanel.tsx',
  'src/modules/features/lifeJournal/evidence/knowledge/components/VaultAktorskartaPanel.tsx',
  'src/modules/features/lifeJournal/evidence/kompis/components/EntityAddForm.tsx',
  'src/modules/features/lifeJournal/evidence/kompis/api/entityProfileService.ts',
  'src/modules/core/security/vaultPin.ts',
  'src/modules/core/auth/vaultWebAuthnClient.ts',
  'src/modules/core/auth/webauthn.ts',
  'src/modules/core/auth/nativeBiometricAuth.ts',
  'src/modules/core/components/VaultLockedGate.tsx',
  'src/modules/core/firebase/VaultService.ts',
  'src/modules/core/firebase/offlineWritePolicy.ts',
  'src/modules/core/store/useVaultStore.ts',
  'src/modules/features/family/children/components/SaveAsEvidencePrompt.tsx',
  'src/modules/features/onboarding/barnporten/components/BarnportenInboxPanel.tsx',
  'src/modules/inkast/components/InkastBarnenValvBridge.tsx',
  'functions/src/callables/unlockVault.ts',
  'functions/src/callables/valv.ts',
  'functions/src/lib/vaultWebAuthn.ts',
  'functions/src/lib/vaultSessionGate.ts',
  'functions/src/lib/vaultRag.ts',
  'functions/src/lib/entityProfileStore.ts',
  'functions/src/lib/entityProfileTypes.ts',
  'functions/src/agents/valvChatAgent.ts',
  'functions/src/triggers/patternScanOnVaultCreate.ts',
].join(',');

const PACK_03_INCLUDE = [
  'docs/design/PLANERINGSSIDA-SPEC.md',
  'docs/design/PLANERING-PROJEKT-HYBRID.md',
  'docs/design/WIDGET-BAR-SPEC.md',
  'src/modules/core/routing/AppRoutes.tsx',
  'src/modules/features/admin/planning/**',
  'src/modules/core/store/useCapacityGate.ts',
  'src/modules/core/store/useEvolutionStore.ts',
  'src/modules/core/evolution/capacity_engine.ts',
  'src/modules/core/evolution/capability_engine.ts',
  'src/modules/core/hooks/useEvolutionSync.ts',
  'src/modules/core/firebase/evolutionLedgerFirestore.ts',
  'src/modules/core/ui/CognitiveLoadStrip.tsx',
  'src/modules/features/dailyLife/wellbeing/compasses/components/ParalysPanel.tsx',
  'src/modules/support/ParalysisBreaker.tsx',
].join(',');

const PACK_04_INCLUDE = [
  'docs/specs/modules/Dagbok-SPEC.md',
  '.context/security.md',
  'src/modules/core/pages/DagbokPage.tsx',
  'src/modules/core/routing/AppRoutes.tsx',
  'src/modules/core/navigation/navTruth.ts',
  'src/modules/features/lifeJournal/diary/**',
  'functions/src/sharedRules.ts',
  'functions/src/callables/agents.ts',
].join(',');

const PACK_05_INCLUDE = [
  'docs/design/FAMILJEN-HUB-SPEC.md',
  'docs/specs/modules/Barnen-SPEC.md',
  'docs/specs/modules/SafeHarbor-SPEC.md',
  '.context/locked-ux-features.md',
  'src/modules/core/pages/FamiljenPage.tsx',
  'src/modules/core/routing/AppRoutes.tsx',
  'src/modules/core/navigation/navTruth.ts',
  'src/modules/features/family/**',
  'src/modules/features/onboarding/barnporten/**',
  'functions/src/index.ts',
  'functions/src/callables/knowledge.ts',
].join(',');

/** @type {Array<{ id: string; name: string; include: string; compress?: boolean }>} */
const PACKS = [
  { id: '01', name: '01-arkitektur', include: PACK_01_INCLUDE, compress: false },
  { id: '02', name: '02-valvet', include: PACK_02_INCLUDE, compress: false },
  { id: '03', name: '03-planering', include: PACK_03_INCLUDE, compress: false },
  { id: '04', name: '04-hjartat', include: PACK_04_INCLUDE, compress: true },
  { id: '05', name: '05-familjen', include: PACK_05_INCLUDE, compress: true },
];

/** @param {{ name: string; include: string; compress?: boolean }} pack */
function runRepomix(pack) {
  const output = join(outDir, `gpt-pack-${pack.name}.md`);
  console.log(`\n=== repomix gpt-pack-${pack.name} ===`);
  const args = [
    'repomix',
    '--style',
    'markdown',
    '--include',
    pack.include,
    '--output',
    output,
  ];
  if (pack.compress) {
    args.push('--compress', '--remove-comments', '--remove-empty-lines');
  }
  const result = spawnSync('npx', args, { cwd: root, stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    console.error(`[fail] gpt-pack-${pack.name}`);
    process.exit(result.status ?? 1);
  }
  return output;
}

const onlyIdx = process.argv.indexOf('--only');
const onlyId =
  onlyIdx >= 0
    ? process.argv[onlyIdx].includes('=')
      ? process.argv[onlyIdx].split('=')[1]
      : process.argv[onlyIdx + 1]
    : undefined;

mkdirSync(outDir, { recursive: true });

const selected = onlyId
  ? PACKS.filter((p) => p.id === onlyId.padStart(2, '0'))
  : PACKS;

if (onlyId && selected.length === 0) {
  console.error(`[fail] Okänt pack-id: ${onlyId}. Använd 01–05.`);
  process.exit(1);
}

for (const pack of selected) {
  runRepomix(pack);
}

console.log(`\nKlart. Filer i ${outDir}`);
if (!onlyId) {
  console.log('Läsordning: docs/gpt-handoff/README.md');
}
