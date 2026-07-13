/**
 * Natt-CI — automatiserad nattpass-loop (A–D) med valfri @cursor/sdk-agent.
 *
 * Usage:
 *   npm run natt-ci              # alla faser
 *   npm run natt-ci:fas-a        # terminal (orkester:night)
 *   npm run natt-ci:fas-b        # ikoner
 *   npm run natt-ci:fas-c        # git
 *   npm run natt-ci -- --agent   # + SDK-sammanfattning (readonly)
 *   npm run natt-ci -- --fas=b   # en fas
 */
import { execSync, spawnSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const orkesterDir = resolve(root, '.orkester');
const runsDir = resolve(orkesterDir, 'natt-ci-runs');
const today = new Date().toISOString().slice(0, 10);
const reportPath = resolve(root, 'docs/evaluations', `${today}-orkester-natt.md`);

const V4_GENERATOR = resolve(root, 'scripts/generate_icon_proposals_v4.mjs');
const V4_OUTPUT = resolve(root, 'docs/design/icons-proposals/2026-05-26-v4-round2-dna');
const V2_PREMIUM = resolve(root, 'docs/design/icons-proposals/2026-05-26-v2-premium');
const V2_ANCHORS = [
  join(V2_PREMIUM, 'app/B1-kanon-ros.svg'),
  join(V2_PREMIUM, 'kompass/D1-helros.svg'),
  join(V2_PREMIUM, 'kompis/M2-orakeloga.svg'),
];

const args = process.argv.slice(2);
const wantAgent = args.includes('--agent');
const fasArg = args.find((a) => a.startsWith('--fas='))?.split('=')[1] ?? 'all';
const runA = fasArg === 'all' || fasArg === 'a';
const runB = fasArg === 'all' || fasArg === 'b';
const runC = fasArg === 'all' || fasArg === 'c';

function ensureDirs() {
  mkdirSync(runsDir, { recursive: true });
  mkdirSync(resolve(root, 'docs/evaluations'), { recursive: true });
}

function runCmd(label, cmd, { cwd = root, optional = false } = {}) {
  const started = Date.now();
  try {
    execSync(cmd, { cwd, stdio: 'pipe', encoding: 'utf8', maxBuffer: 12 * 1024 * 1024 });
    return { label, status: 'PASS', durationMs: Date.now() - started };
  } catch (err) {
    const stderr = err.stderr?.toString?.() ?? err.message ?? String(err);
    return {
      label,
      status: optional ? 'SKIP_FAIL' : 'FAIL',
      durationMs: Date.now() - started,
      error: stderr.slice(0, 3000),
      optional,
    };
  }
}

function gitSnapshot() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: root, encoding: 'utf8' }).trim();
    const sha = execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim();
    const dirty = spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).stdout?.trim();
    return { branch, sha, dirty: dirty ? dirty.split('\n') : [] };
  } catch {
    return { branch: 'unknown', sha: 'unknown', dirty: [] };
  }
}

function generatorChangedSinceOutput() {
  if (!existsSync(V4_GENERATOR)) return false;
  const genMtime = statSync(V4_GENERATOR).mtimeMs;
  if (!existsSync(V4_OUTPUT)) return true;
  try {
    const outMtime = statSync(V4_OUTPUT).mtimeMs;
    return genMtime > outMtime;
  } catch {
    return true;
  }
}

function anchorsPresent() {
  return V2_ANCHORS.every((p) => existsSync(p));
}

function runFasA() {
  console.log('[natt-ci] Fas A — orkester:night...');
  const result = runCmd('Fas A — orkester:night', 'npm run orkester:night');
  console.log(`[natt-ci]   ${result.status} (${result.durationMs}ms)`);

  const extra = [
  runCmd('smoke:valv', 'npm run smoke:valv', { optional: true }),
  runCmd('smoke:kunskap', 'npm run smoke:kunskap', { optional: true }),
  runCmd('smoke:dossier', 'npm run smoke:dossier', { optional: true }),
  ];
  for (const step of extra) {
    console.log(`[natt-ci]   ${step.label}: ${step.status}`);
  }
  return { id: 'a', steps: [result, ...extra] };
}

function runFasB() {
  console.log('[natt-ci] Fas B — ikoner...');
  const steps = [];
  const changed = generatorChangedSinceOutput();
  const anchors = anchorsPresent();

  if (changed && anchors) {
    const gen = runCmd('icons:proposals-v4', 'npm run icons:proposals-v4');
    steps.push(gen);
    console.log(`[natt-ci]   v4-generator: ${gen.status}`);
  } else {
    const reason = !anchors
      ? 'v2-premium-ankare saknas — skip batch'
      : 'generator oförändrad — skip batch';
    steps.push({ label: 'icons:proposals-v4', status: 'SKIP', reason });
    console.log(`[natt-ci]   v4-generator: SKIP (${reason})`);
  }

  const smoke = runCmd('smoke:locked-icons', 'npm run smoke:locked-icons');
  steps.push(smoke);
  console.log(`[natt-ci]   smoke:locked-icons: ${smoke.status}`);
  return { id: 'b', steps };
}

function runFasC() {
  console.log('[natt-ci] Fas C — git/arbetsyta...');
  const git = gitSnapshot();
  const forbidden = git.dirty.filter(
    (line) =>
      /\.env/.test(line) ||
      /service.*account.*\.json/i.test(line) ||
      /google-services\.json/.test(line),
  );
  const status = forbidden.length > 0 ? 'FAIL' : git.dirty.length > 0 ? 'WARN' : 'PASS';
  console.log(`[natt-ci]   git: ${status} (${git.dirty.length} filer)`);
  if (forbidden.length > 0) {
    console.error('[natt-ci]   MUST NOT committa secrets:', forbidden.join(', '));
  }
  return {
    id: 'c',
    steps: [{ label: 'git status', status, dirtyCount: git.dirty.length, forbidden }],
    git,
  };
}

function writeReport(run) {
  const lines = [
    `# Orkester nattpass — ${today}`,
    '',
    `**Kört:** ${run.startedAt}`,
    `**Natt-CI:** fas ${run.fasArg}`,
    `**Git:** ${run.git.branch} @ ${run.git.sha} (${run.git.dirty.length} unstaged)`,
    '',
    '## Natt-CI faser',
    '',
    '| Fas | Steg | Status |',
    '|-----|------|--------|',
  ];

  for (const phase of run.phases) {
    for (const step of phase.steps) {
      lines.push(`| ${phase.id.toUpperCase()} | ${step.label} | ${step.status} |`);
    }
  }

  const hardFail = run.phases.some((p) =>
    p.steps.some((s) => s.status === 'FAIL' && !s.optional),
  );

  lines.push('', '## Sammanfattning', '');
  lines.push(
    hardFail
      ? 'Minst en obligatorisk fas **FAIL** — se `.orkester/natt-ci-runs/`.'
      : 'Natt-CI **PASS** (eller SKIP på valfria steg).',
  );

  if (run.agentSummary) {
    lines.push('', '## SDK-agent (readonly)', '', run.agentSummary);
  }

  lines.push('', '## Backlog (A–D)', '');
  lines.push(`- [${run.phases.find((p) => p.id === 'a') ? 'x' : ' '}] A Terminal`);
  lines.push(`- [${run.phases.find((p) => p.id === 'b') ? 'x' : ' '}] B Ikoner`);
  lines.push(`- [${run.phases.find((p) => p.id === 'c') ? 'x' : ' '}] C Git`);
  lines.push('- [x] D Rapport');

  lines.push('', '## Nästa steg (1)', '');
  const firstFail = run.phases
    .flatMap((p) => p.steps)
    .find((s) => s.status === 'FAIL' && !s.optional);
  if (firstFail) {
    lines.push(`Fixa **${firstFail.label}** — ${firstFail.error?.split('\n')[0] ?? 'se run-log'}.`);
  } else if (run.git.dirty.length > 0) {
    lines.push('Planera commit/PR för kvarlämnade ändringar (Fas C).');
  } else {
    lines.push('Inget akut — fortsätt enligt `docs/TODO.md`.');
  }

  writeFileSync(reportPath, lines.join('\n'), 'utf8');
  console.log(`[natt-ci] Rapport: ${reportPath}`);
}

async function runSdkAgent(run) {
  const apiKey = process.env.CURSOR_API_KEY?.trim();
  if (!apiKey) {
    console.warn('[natt-ci] --agent: CURSOR_API_KEY saknas, hoppar över SDK');
    return null;
  }

  const failures = run.phases
    .flatMap((p) => p.steps.filter((s) => s.status === 'FAIL'))
    .map((s) => s.label)
    .join(', ');

  const prompt = [
    'Readonly Natt-CI sammanfattning för Livskompassen.',
    failures ? `FAIL på: ${failures}. Ge exakt ett fixsteg.` : 'Alla faser gröna. Bekräfta kort.',
    'MUST NOT: deploy, merge, ändra firestore.rules eller sharedRules.ts.',
    'Max 5 meningar.',
  ].join('\n');

  try {
    const { Agent } = await import('@cursor/sdk');
    console.log('[natt-ci] SDK-agent startar (local)...');
    const result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: 'composer-2.5' },
      local: { cwd: root, settingSources: [] },
    });
    if (result.status === 'error') {
      console.warn(`[natt-ci] SDK-agent FAIL: ${result.id}`);
      return null;
    }
    console.log('[natt-ci] SDK-agent klar');
    return result.result ?? null;
  } catch (err) {
    console.warn(`[natt-ci] SDK-agent startup FAIL: ${err?.message ?? err}`);
    return null;
  }
}

async function main() {
  ensureDirs();
  const startedAt = new Date().toISOString();
  const runId = startedAt.replace(/[:.]/g, '-');
  const git = gitSnapshot();
  const phases = [];

  console.log(`[natt-ci] Start ${startedAt} (fas=${fasArg})`);

  if (runA) phases.push(runFasA());
  if (runB) phases.push(runFasB());
  if (runC) phases.push(runFasC());

  const run = { startedAt, fasArg, git, phases, agentSummary: null };
  if (wantAgent) {
    run.agentSummary = await runSdkAgent(run);
  }

  writeFileSync(resolve(runsDir, `${runId}.json`), JSON.stringify(run, null, 2), 'utf8');
  writeReport(run);

  const hardFail = phases.some((p) =>
    p.steps.some((s) => s.status === 'FAIL' && !s.optional),
  );
  const gitFail = phases.some((p) => p.id === 'c' && p.steps.some((s) => s.status === 'FAIL'));
  console.log(`[natt-ci] ${hardFail || gitFail ? 'FAIL' : 'PASS'}`);
  process.exit(hardFail || gitFail ? 1 : 0);
}

main();
