#!/usr/bin/env node
/**
 * Rollout Autorun — Cursor-native Block A+B nattpass utan LLM.
 * Usage: npm run rollout:night
 *
 * Skriver:
 *   .orkester/rollout-state.json
 *   .orkester/runs/rollout-<timestamp>.json
 *   docs/evaluations/YYYY-MM-DD-rollout-natt.md
 */
import { execSync, spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const orkesterDir = resolve(root, '.orkester');
const runsDir = resolve(orkesterDir, 'runs');
const statePath = resolve(orkesterDir, 'rollout-state.json');
const today = new Date().toISOString().slice(0, 10);
const reportPath = resolve(root, 'docs/evaluations', `${today}-rollout-natt.md`);

const PHASES = [
  { id: 'rollout-smoke', label: 'Cursor-native smoke:rollout', cmd: 'npm run smoke:rollout' },
  { id: 'functions-build', label: 'Functions build', cmd: 'npm run build', cwd: 'functions' },
  { id: 'frontend-build', label: 'Frontend build', cmd: 'npm run build' },
  { id: 'lint', label: 'ESLint', cmd: 'npx eslint . --max-warnings 0', optional: true },
];

const AGENT_COVERED = [
  'Hem / CaptureSuper (locked-ux)',
  'Kompass inkast (smoke:inkast)',
  'Liv 6 kort (design-modules + arbetsliv)',
  'Familjen/drogfrihet (design-modules)',
  'Planering inkorg-länk (rollout static)',
  'Valv Samla canonical kö (locked-ux)',
  'SpeglarSuperModule (design-modules + speglar)',
  '#3 WORM (smoke:vault-worm om .env)',
  '#4 optimistic kod + children_logs (om .env)',
];

const USER_REMAINS = [
  '#2d Dagbok bilaga — filväljare + Storage journal_memories/',
  'Valfritt visuellt: Hem en Skriv-yta; Speglar en Fortsätt-knapp i ACT',
];

function ensureDirs() {
  mkdirSync(runsDir, { recursive: true });
  mkdirSync(resolve(root, 'docs/evaluations'), { recursive: true });
}

function runPhase(phase) {
  const cwd = phase.cwd ? resolve(root, phase.cwd) : root;
  const started = Date.now();
  try {
    execSync(phase.cmd, { cwd, stdio: 'pipe', encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    return {
      id: phase.id,
      label: phase.label,
      status: 'PASS',
      durationMs: Date.now() - started,
      optional: phase.optional ?? false,
    };
  } catch (err) {
    const stderr = err.stderr?.toString?.() ?? err.message ?? String(err);
    const stdout = err.stdout?.toString?.() ?? '';
    return {
      id: phase.id,
      label: phase.label,
      status: phase.optional ? 'SKIP_FAIL' : 'FAIL',
      durationMs: Date.now() - started,
      optional: phase.optional ?? false,
      error: stderr.slice(0, 4000),
      stdout: stdout.slice(0, 2000),
    };
  }
}

function gitSnapshot() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: root, encoding: 'utf8' }).trim();
    const sha = execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim();
    const dirty = spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).stdout?.trim();
    return { branch, sha, dirty: dirty ? dirty.split('\n').length : 0 };
  } catch {
    return { branch: 'unknown', sha: 'unknown', dirty: -1 };
  }
}

function writeReport(run) {
  const failures = run.phases.filter((p) => p.status === 'FAIL');
  const lines = [
    `# Rollout nattpass — Cursor-native Block A+B — ${today}`,
    '',
    `**Kört:** ${run.startedAt}`,
    `**Git:** ${run.git.branch} @ ${run.git.sha} (${run.git.dirty} unstaged)`,
    '',
    '## Faser',
    '',
    '| Fas | Status | ms |',
    '|-----|--------|-----|',
  ];
  for (const p of run.phases) {
    lines.push(`| ${p.label} | ${p.status} | ${p.durationMs} |`);
  }

  lines.push('', '## Du behöver inte köra (agent autorun)', '');
  for (const item of AGENT_COVERED) {
    lines.push(`- ${item}`);
  }

  lines.push('', '## Kvar för dig (~5 min)', '');
  for (const item of USER_REMAINS) {
    lines.push(`- ${item}`);
  }

  lines.push('', '## Sammanfattning', '');
  if (failures.length === 0) {
    lines.push('Alla obligatoriska faser **PASS**. Se `npm run smoke:rollout` för checklista-mapping.');
  } else {
    lines.push(`${failures.length} fas(er) **FAIL** — se detaljer nedan.`);
  }

  lines.push('', '## Nästa steg (1)', '');
  if (failures.length > 0) {
    lines.push(`Fixa **${failures[0].label}** — ${failures[0].error?.split('\n')[0] ?? 'se run-log'}.`);
  } else if (run.git.dirty > 0) {
    lines.push('Commit/push ostaged arbete (t.ex. SpeglarSuperModule) innan deploy.');
  } else {
    lines.push('Fråga om `firebase deploy --only hosting` om prod ska uppdateras.');
  }

  lines.push('', '## Detaljer (FAIL)', '');
  for (const p of failures) {
    lines.push(`### ${p.label}`, '', '```', p.error ?? '(ingen stderr)', '```', '');
  }

  writeFileSync(reportPath, lines.join('\n'), 'utf8');
}

function main() {
  ensureDirs();
  const startedAt = new Date().toISOString();
  const runId = `rollout-${startedAt.replace(/[:.]/g, '-')}`;
  const git = gitSnapshot();

  const state = {
    startedAt,
    nextPhase: 'rollout-smoke',
    completedPhases: [],
    failures: [],
    git,
  };
  writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');

  console.log(`[rollout:night] Start ${startedAt}`);
  const phaseResults = [];

  for (const phase of PHASES) {
    console.log(`[rollout:night] → ${phase.label}...`);
    state.nextPhase = phase.id;
    writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');

    const result = runPhase(phase);
    phaseResults.push(result);

    if (result.status === 'PASS' || result.status === 'SKIP_FAIL') {
      state.completedPhases.push(phase.id);
    } else {
      state.failures.push({ phase: phase.id, error: result.error?.slice(0, 500) });
    }
    writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');

    console.log(`[rollout:night]   ${result.status} (${result.durationMs}ms)`);
    if (result.status === 'FAIL' && !phase.optional) {
      console.error('[rollout:night] Obligatorisk fas FAIL — fortsätter övriga faser.');
    }
  }

  state.nextPhase = 'done';
  state.finishedAt = new Date().toISOString();
  writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');

  const run = { startedAt, git, phases: phaseResults };
  writeFileSync(resolve(runsDir, `${runId}.json`), JSON.stringify(run, null, 2), 'utf8');
  writeReport(run);

  const hardFail = phaseResults.some((p) => p.status === 'FAIL' && !p.optional);
  console.log(`[rollout:night] Rapport: ${reportPath}`);
  console.log(`[rollout:night] ${hardFail ? 'FAIL' : 'PASS'}`);
  process.exit(hardFail ? 1 : 0);
}

main();
