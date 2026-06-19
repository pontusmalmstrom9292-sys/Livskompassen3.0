#!/usr/bin/env node
/**
 * Avskalad Repomix: hel backend-kärna + systemplan + minnesarkitektur.
 * Kör: npm run repomix:karnkod-systemplan
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import { runRepomixPack } from './lib/repomix_pack.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'exports/repomix/karnkod-systemplan.md');

const include = [
  // — Preamble (läs först) —
  'docs/external-ai/repomix/KARNKOD-SYSTEMPLAN-PREAMBLE.md',

  // — Systemplan (hela) —
  '.context/system-plan.md',
  'docs/SYSTEM_PLAN_v2.md',
  'docs/SYSTEMKONTROLL.md',
  'docs/MODUL-FUNKTIONS-REGISTER.md',
  'docs/MODUL-GAP-OVERSIKT.md',
  'docs/specs/modules/Arkiv-GAP-REGISTER.md',
  'docs/evaluations/2026-06-15-fas19-masterplan-v2.md',
  'docs/architecture/INFINITE_EVOLUTION.md',
  'docs/INNEHALL-REGISTER.md',
  'docs/DEPLOY.md',
  'docs/GCP-INVENTORY-LATEST.md',

  // — Minne, säkerhet, domän —
  '.context/architecture.md',
  '.context/arkiv-minne.md',
  '.context/security.md',
  '.context/database.md',
  '.context/agents.md',
  '.context/innehall-kanon.md',
  '.context/domän-covert-narcissism.md',
  '.context/locked-ux-features.md',
  'AGENTS.md',
  'docs/external-ai/LIFE-OS-BUILD-STATE.md',
  'docs/external-ai/SYNAPSE-LOCK-SPEC.md',
  'docs/external-ai/SECURITY-LOCK-MANIFEST.md',
  'docs/archive/evaluations-2026-05/GRUNDER-UTVARDERING-RESULTAT.md',

  // — Regler & config —
  'firestore.rules',
  'storage.rules',
  'firebase.json',
  'package.json',
  'functions/package.json',
  'functions/tsconfig.json',

  // — Backend (hel kärna) —
  'functions/src/**',

  // — Frontend minimal (typer + auth + evolution) —
  'src/modules/core/types/firestore.ts',
  'src/modules/core/firebase/init.ts',
  'src/modules/core/firebase/firestore.ts',
  'src/modules/core/firebase/evolutionLedgerFirestore.ts',
  'src/modules/core/auth/**',
  'src/modules/core/security/**',
  'src/modules/core/store/useEvolutionStore.ts',
  'src/modules/core/store/useCapacityGate.ts',
  'src/modules/core/evolution/**',
  'src/modules/core/hooks/useEvolutionSync.ts',
];

runRepomixPack({
  root,
  output,
  include,
  label: 'repomix karnkod-systemplan (avskalad backend + systemplan)',
});
