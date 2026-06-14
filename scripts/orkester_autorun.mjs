/**
 * Orkestrerad natt-autorun — deterministisk fas-körning utan LLM.
 * Usage: npm run orkester:night
 *
 * Skriver:
 *   .orkester/state.json
 *   .orkester/runs/<timestamp>.json
 *   docs/evaluations/YYYY-MM-DD-orkester-natt.md
 */
import { execSync, spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const orkesterDir = resolve(root, '.orkester');
const runsDir = resolve(orkesterDir, 'runs');
const statePath = resolve(orkesterDir, 'state.json');
const today = new Date().toISOString().slice(0, 10);
const reportPath = resolve(root, 'docs/evaluations', `${today}-orkester-natt.md`);

const PHASES = [
  { id: 'ux', label: 'UX Guardian', cmd: 'npm run smoke:locked-ux && npm run smoke:design-modules' },
  { id: 'rollout', label: 'Cursor-native rollout', cmd: 'npm run smoke:rollout', optional: true },
  { id: 'innehall', label: 'Innehall U6', cmd: 'npm run smoke:innehall' },
  { id: 'locked-icons', label: 'Locked icons', cmd: 'npm run smoke:locked-icons' },
  { id: 'adk', label: 'ADK Weaver', cmd: 'npm run smoke:orkester' },
  { id: 'capability-gate', label: 'Capability Gate', cmd: 'node scripts/orkester_capability_gate.mjs' },
  { id: 'functions-build', label: 'Functions build', cmd: 'npm run build', cwd: 'functions' },
  { id: 'frontend-build', label: 'Frontend build', cmd: 'npm run build' },
  { id: 'lint', label: 'ESLint', cmd: 'npx eslint . --max-warnings 0', optional: true },
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
  const lines = [
    `# Orkester nattpass — ${today}`,
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
  const failures = run.phases.filter((p) => p.status === 'FAIL');
  lines.push('', '## Sammanfattning', '');
  if (failures.length === 0) {
    lines.push('Alla obligatoriska faser **PASS**. Locked UX, ADK wiring och build gröna.');
  } else {
    lines.push(`${failures.length} fas(er) **FAIL** — se detaljer i \`.orkester/runs/\`.`);
  }
  lines.push('', '## Nästa steg (1)', '');
  if (failures.length > 0) {
    lines.push(`Fixa **${failures[0].label}** — ${failures[0].error?.split('\n')[0] ?? 'se run-log'}.`);
  } else {
    lines.push('Manuell smoke enligt `docs/SMOKE_CHECKLIST.md` (#1–7, #18) om du deployat nyligen.');
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
  const runId = startedAt.replace(/[:.]/g, '-');
  const git = gitSnapshot();

  const state = {
    startedAt,
    nextPhase: 'ux',
    completedPhases: [],
    failures: [],
    git,
  };
  writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');

  console.log(`[orkester:night] Start ${startedAt}`);
  const phaseResults = [];

  for (const phase of PHASES) {
    console.log(`[orkester:night] → ${phase.label}...`);
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

    console.log(`[orkester:night]   ${result.status} (${result.durationMs}ms)`);
    if (result.status === 'FAIL' && !phase.optional) {
      console.error(`[orkester:night] Obligatorisk fas FAIL — fortsätter övriga faser.`);
    }
  }

  state.nextPhase = 'done';
  state.finishedAt = new Date().toISOString();
  writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');

  const run = { startedAt, git, phases: phaseResults };
  writeFileSync(resolve(runsDir, `${runId}.json`), JSON.stringify(run, null, 2), 'utf8');
  writeReport(run);

  const hardFail = phaseResults.some((p) => p.status === 'FAIL' && !p.optional);
  console.log(`[orkester:night] Rapport: ${reportPath}`);
  console.log(`[orkester:night] ${hardFail ? 'FAIL' : 'PASS'}`);
  process.exit(hardFail ? 1 : 0);
}

main();
