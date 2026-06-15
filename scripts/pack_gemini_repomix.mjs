#!/usr/bin/env node
/**
 * Repomix-paket för Gemini (modulvisa + helhets-konsolidering).
 * Kör: npm run gemini:pack
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'exports/gemini-handoff/repomix');

/** @param {{ name: string; include: string; compress?: boolean }} pack */
function runRepomix(pack) {
  const output = join(outDir, `gemini-pack-${pack.name}.md`);
  console.log(`\n=== repomix ${pack.name} ===`);
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
    args.push('--compress', '--remove-comments', '--remove-empty-lines', '--no-directory-structure');
  }
  const result = spawnSync('npx', args, { cwd: root, stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    console.error(`[fail] gemini-pack-${pack.name}`);
    process.exit(result.status ?? 1);
  }
  return output;
}

const PACKS = [
  {
    name: 'kompass',
    include:
      'docs/design/KOMPASS-MODUL-SPEC.md,docs/design/references/KOMPASS-TRE-TIDPUNKTER.md,docs/evaluations/2026-05-29-kompass-widget-snabbstart-plan.md,docs/specs/modules/De-3-Kompasserna-SPEC.md,src/modules/core/home/**,src/modules/features/dailyLife/wellbeing/compasses/**,docs/design/ICON-STYLE-GUIDE.md,.context/locked-icons.md',
  },
  {
    name: 'meny',
    include:
      'docs/design/references/MENU-DRAWER-KANON.md,docs/design/NAVIGATION-UX-DETALJER.md,docs/design/references/DOCK-KANON.md,src/modules/core/layout/**,src/modules/core/navigation/**',
  },
  {
    name: 'valv',
    include:
      'docs/design/VALV-HUBB-SPEC.md,docs/specs/modules/Verklighetsvalvet-SPEC.md,.context/locked-ux-features.md,src/modules/features/lifeJournal/evidence/vault/**',
  },
  {
    name: 'mabra',
    include:
      'docs/specs/modules/Mabra-SPEC.md,docs/specs/modules/Mabra-CONTENT-BANK.md,src/modules/features/dailyLife/wellbeing/mabra/**,docs/design/ICON-STYLE-GUIDE.md',
  },
  {
    name: 'ekonomi',
    include:
      'docs/specs/modules/Ekonomi-SPEC.md,src/modules/features/dailyLife/wellbeing/economy/**,src/modules/core/firebase/timeEconomyFirestore.ts',
  },
  {
    name: 'arbetsliv',
    include:
      'src/modules/features/dailyLife/arbetsliv/**,src/modules/features/admin/stampla/**,docs/evaluations/2026-05-25-arbetsliv-hub.md',
  },
  {
    name: 'familjehubb',
    include:
      'src/modules/features/family/**,src/modules/core/pages/FamiljenPage.tsx,src/modules/core/layout/HubPageShell.tsx,src/modules/core/ui/HubDropdownNav.tsx,src/modules/core/ui/CognitiveLoadStrip.tsx,src/modules/core/navigation/navTruth.ts,src/modules/core/navigation/navigationRegistry.ts,src/modules/core/navigation/hubTabs.tsx,src/modules/core/navigation/hooks/useHubTab.ts,src/modules/core/routing/AppRoutes.tsx,src/modules/core/firebase/firestore.ts,src/modules/core/types/firestore.ts,src/modules/shell/index.ts,src/modules/features/onboarding/barnporten/**,docs/specs/modules/Barnen-SPEC.md,docs/specs/modules/SafeHarbor-SPEC.md,.context/locked-ux-features.md,functions/src/index.ts',
  },
  {
    name: 'speglar',
    include:
      'src/modules/features/lifeJournal/diary/mirror/**,src/modules/features/lifeJournal/diary/diary/api/journalQuickMirrorService.ts,src/modules/core/pages/DagbokPage.tsx,docs/specs/modules/Dagbok-SPEC.md,.context/security.md,functions/src/sharedRules.ts',
  },
  {
    name: 'inkast',
    include:
      'src/modules/inkast/**,src/modules/capture/**,src/modules/shared/components/TaggSelector.tsx,src/modules/shared/components/TaggHelpPanel.tsx,src/modules/shared/tags/**,docs/evaluations/2026-06-06-inkast-lockdown.md,docs/archive/evaluations-fas21-2026-06/2026-06-01-superhub-hem-capture-deep.md,docs/evaluations/2026-06-01-superhub-domän-covert-narcissism.md,functions/src/lib/submitInkastLite.ts,functions/src/lib/analyzeUploadForKnowledge.ts,functions/src/lib/uploadInkastEvidence.ts,functions/src/lib/inboxClassifier.ts,functions/src/lib/inboxPersist.ts',
  },
  {
    name: 'konsolidering',
    compress: true,
    include:
      '.context/architecture.md,.context/arkitektur-beslut.md,.context/arkiv-minne.md,.context/security.md,.context/system-plan.md,.context/locked-ux-features.md,.context/database.md,AGENTS.md,docs/SYSTEMKONTROLL.md,docs/MODUL-FUNKTIONS-REGISTER.md,docs/MODUL-GAP-OVERSIKT.md,docs/specs/modules/Arkiv-GAP-REGISTER.md,docs/specs/modules/Verklighetsvalvet-SPEC.md,docs/specs/modules/Dagbok-SPEC.md,docs/design/VALV-HUBB-SPEC.md,docs/design/FAMILJEN-HUB-SPEC.md,docs/design/PLANERINGSSIDA-SPEC.md,docs/evaluations/2026-05-29-valv-samla-cursor-plan.md,docs/evaluations/2026-06-06-inkast-lockdown.md,docs/archive/evaluations-fas21-2026-06/2026-06-01-superhub-hem-capture-deep.md,docs/evaluations/2026-06-01-superhub-domän-covert-narcissism.md,docs/archive/evaluations-fas21-2026-06/2026-06-01-superhub-arkiv-deep.md,docs/evaluations/VERKLIGHETSVALV-ARKITEKTUR.md,src/modules/README.md,src/modules/inkast/**,src/modules/capture/**,src/modules/shared/components/TaggSelector.tsx,src/modules/shared/tags/**,src/modules/core/firebase/storage.ts,src/modules/core/firebase/firestore.ts,src/modules/core/types/firestore.ts,src/modules/core/ui/EvidenceMediaAttach.tsx,src/modules/core/home/HomeAdaptiveCompass.tsx,src/modules/core/pages/HomePage.tsx,src/modules/core/navigation/navTruth.ts,src/modules/features/lifeJournal/evidence/vault/**,src/modules/features/lifeJournal/evidence/kompis/**,src/modules/features/lifeJournal/evidence/knowledge/**,src/modules/features/lifeJournal/diary/diary/utils/journalUploadHelper.ts,src/modules/features/lifeJournal/diary/mirror/components/SpeglarEvidencePanel.tsx,src/modules/features/family/children/components/SaveAsEvidencePrompt.tsx,src/modules/features/family/children/components/familjen/FamiljenKunskapHubTab.tsx,src/modules/features/family/safeHarbor/components/BiffPublicPanel.tsx,src/modules/features/admin/planning/components/PlaneringInkorgPanel.tsx,src/modules/features/onboarding/barnporten/components/BarnportenInboxPanel.tsx,src/modules/features/widgets/api/widgetVaultRecording.ts,src/modules/features/widgets/hooks/useWidgetVaultRecording.ts,functions/src/index.ts,functions/src/lib/submitInkastLite.ts,functions/src/lib/analyzeUploadForKnowledge.ts,functions/src/lib/uploadInkastEvidence.ts,functions/src/lib/inboxClassifier.ts,functions/src/lib/inboxPersist.ts,functions/src/lib/persistKbDoc.ts,functions/src/adk/synapses/driveIngestSynapse.ts,firestore.rules',
  },
];

mkdirSync(outDir, { recursive: true });

for (const pack of PACKS) {
  runRepomix(pack);
}

console.log(`\nKlart. Filer i ${outDir}`);
