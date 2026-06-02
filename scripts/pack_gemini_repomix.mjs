#!/usr/bin/env node
/**
 * Repomix-paket för Gemini-app (kompass / meny / valv).
 * Kör: npm run gemini:pack
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'exports/gemini-handoff/repomix');

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
];

mkdirSync(outDir, { recursive: true });

for (const pack of PACKS) {
  const output = join(outDir, `gemini-pack-${pack.name}.md`);
  console.log(`\n=== repomix ${pack.name} ===`);
  const result = spawnSync(
    'npx',
    ['repomix', '--include', pack.include, '--output', output],
    { cwd: root, stdio: 'inherit', shell: true },
  );
  if (result.status !== 0) {
    console.error(`[fail] gemini-pack-${pack.name}`);
    process.exit(result.status ?? 1);
  }
}

console.log(`\nKlart. Filer i ${outDir}`);
