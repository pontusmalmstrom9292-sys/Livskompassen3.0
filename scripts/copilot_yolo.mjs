#!/usr/bin/env node
/**
 * Copilot Safe YOLO v2 — kanon + preflight + PMIR + deploy-lås + loop.
 *
 * Usage:
 *   npm run copilot:yolo              # nästa kö-uppgift (safe)
 *   npm run copilot:yolo -- loop      # kör våg efter våg tills fail/tom
 *   npm run copilot:yolo -- status    # visa nästa + backlog-hints
 *   npm run copilot:yolo -- sync      # synka hints från MODUL-GAP + master-state
 *   npm run copilot:yolo -- reset     # nollställ state
 *   npm run copilot:yolo -- done|skip|task <id>
 *
 * Env:
 *   COPILOT_YOLO_SKIP_PREFLIGHT=1     hoppa pre-flight före våg
 *   COPILOT_YOLO_FULL_PREFLIGHT=1     kör hela orkester:night (långsam, kräver ev. billing)
 *   COPILOT_YOLO_ALLOW_PMIR=1         tillåt PMIR-filer (endast med Pontus OK)
 *
 * Kräver: brew install copilot-cli && copilot login
 */
import { spawnSync, execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const queuePath = resolve(root, '.orkester/copilot-yolo-queue.json');
const statePath = resolve(root, '.orkester/copilot-yolo-state.json');
const hintsPath = resolve(root, '.orkester/copilot-yolo-backlog-hints.json');
const rulesPackPath = resolve(root, 'exports/cursor-pipeline/copilot-rules-pack.md');
const modulGapPath = resolve(root, 'docs/evaluations/MODUL-GAP-OVERSIKT.md');
const masterStatePath = resolve(root, '.orkester/master-state.json');
const today = new Date().toISOString().slice(0, 10);
const logPath = resolve(root, 'docs/evaluations', `${today}-copilot-yolo-log.md`);

const PMIR_PATHS = [
  'firestore.rules',
  'storage.rules',
  'functions/src/sharedRules.ts',
  '.context/locked-ux-features.md',
  'src/modules/core/layout/NavigationDrawer.tsx',
];

const PMIR_GREP = new RegExp(
  PMIR_PATHS.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
);

const argv = process.argv.slice(2);
const cmd = argv[0] ?? 'run';

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function readText(path, max = 0) {
  if (!existsSync(path)) return '';
  const t = readFileSync(path, 'utf8');
  return max > 0 ? t.slice(0, max) : t;
}

function gitSnapshot() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: root, encoding: 'utf8' }).trim();
    const sha = execSync('git rev-parse HEAD', { cwd: root, encoding: 'utf8' }).trim();
    const short = sha.slice(0, 7);
    return { branch, sha, short };
  } catch {
    return { branch: 'unknown', sha: 'unknown', short: 'unknown' };
  }
}

function ensureLogHeader() {
  mkdirSync(resolve(root, 'docs/evaluations'), { recursive: true });
  if (existsSync(logPath)) return;
  const git = gitSnapshot();
  writeFileSync(
    logPath,
    [
      `# Copilot Safe YOLO log — ${today}`,
      '',
      `**Git:** ${git.branch} @ ${git.short}`,
      `**Kanon:** copilot-rules-pack · copilot-instructions · AGENTS.md`,
      '',
      '| Tid | Task | Status | Smoke | Notering |',
      '|-----|------|--------|-------|----------|',
      '',
    ].join('\n'),
    'utf8',
  );
}

function appendLog(taskId, status, smoke, note) {
  ensureLogHeader();
  const ts = new Date().toISOString().slice(11, 19);
  appendFileSync(logPath, `| ${ts} | ${taskId} | ${status} | ${smoke} | ${note} |\n`, 'utf8');
}

function runStep(label, command, extraEnv = {}) {
  console.log(`[copilot:yolo] ${label} → ${command}`);
  const r = spawnSync(command, {
    cwd: root,
    shell: true,
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
  });
  return r.status === 0;
}

function loadQueue() {
  const queue = readJson(queuePath, null);
  if (!queue?.tasks?.length) {
    console.error('[copilot:yolo] Saknar kö:', queuePath);
    process.exit(1);
  }
  return queue;
}

function loadState(queue) {
  const existing = readJson(statePath, null);
  if (existing?.version === 2) return existing;
  if (existing?.version === 1) {
    return {
      version: 2,
      startedAt: existing.startedAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentTaskId: existing.currentTaskId ?? null,
      completedTaskIds: existing.completedTaskIds ?? [],
      skippedTaskIds: existing.skippedTaskIds ?? [],
      failedTaskIds: existing.failedTaskIds ?? [],
      taskOrder: existing.taskOrder ?? queue.tasks.map((t) => t.id),
      taskStartSha: existing.taskStartSha ?? null,
    };
  }
  return {
    version: 2,
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentTaskId: null,
    completedTaskIds: [],
    skippedTaskIds: [],
    failedTaskIds: [],
    taskOrder: queue.tasks.map((t) => t.id),
    taskStartSha: null,
  };
}

function saveState(state) {
  state.updatedAt = new Date().toISOString();
  writeJson(statePath, state);
}

function resolveTask(queue, state, taskId) {
  if (taskId) {
    const t = queue.tasks.find((x) => x.id === taskId);
    if (!t) {
      console.error('[copilot:yolo] Okänd task:', taskId);
      process.exit(1);
    }
    return t;
  }
  for (const id of state.taskOrder) {
    if (state.completedTaskIds.includes(id)) continue;
    if (state.skippedTaskIds.includes(id)) continue;
    const t = queue.tasks.find((x) => x.id === id);
    if (t) return t;
  }
  return null;
}

function syncBacklogHints() {
  const hints = {
    syncedAt: new Date().toISOString(),
    modulGap: [],
    masterYolo: null,
    openSystemPlan: [],
  };

  const gapText = readText(modulGapPath);
  if (gapText) {
    for (const line of gapText.split('\n')) {
      if (!line.startsWith('|') || line.includes('Modul | Route')) continue;
      const lower = line.toLowerCase();
      if (/\*\*done\*\*/.test(lower) && !/(partial|defer|user|öppen|wait|våg 8)/.test(lower)) continue;
      if (/(partial|defer|user-test|user |öppen|wait|våg 8|nästa)/i.test(line)) {
        hints.modulGap.push(line.trim().slice(0, 220));
      }
    }
  }

  const master = readJson(masterStatePath, null);
  if (master) {
    hints.masterYolo = {
      status: master.status,
      nextWaveId: master.nextWaveId,
      completed: master.completedWaves?.length ?? 0,
    };
  }

  const planPath = resolve(root, '.context/system-plan.md');
  const plan = readText(planPath);
  for (const line of plan.split('\n')) {
    if (line.startsWith('- [ ]')) hints.openSystemPlan.push(line.replace('- [ ]', '').trim().slice(0, 160));
  }

  writeJson(hintsPath, hints);
  return hints;
}

function getSmokeSteps(task) {
  const steps = [...(task.smoke ?? [])];
  const fullGate = 'npm run smoke:predeploy:build';
  if (task.fullGate !== false && !steps.includes(fullGate)) steps.push(fullGate);
  if (steps.length === 0) return [fullGate];
  return steps;
}

function kanonExcerpt() {
  const pack = readText(rulesPackPath, 3500);
  if (pack) return pack;
  return readText(resolve(root, '.github/copilot-instructions.md'), 2500);
}

function buildPrompt(task) {
  const smoke = getSmokeSteps(task).join(' && ');
  const deploy = task.deploy && task.deploy !== 'none' ? task.deploy : null;

  return [
    `Livskompassen SAFE YOLO v2 — uppgift "${task.id}": ${task.title}`,
    '',
    'Du är GitHub Copilot CLI i autopilot. Bygg ENDAST scope för denna våg.',
    '',
    '=== KANON (MUST) ===',
    readText(resolve(root, '.github/copilot-instructions.md'), 1800),
    '',
    '=== RULES PACK (utdrag) ===',
    kanonExcerpt().slice(0, 2000),
    '',
    `=== PLAN ===`,
    task.plan,
    task.gapRef ? `GAP/modul: ${task.gapRef}` : '',
    '',
    '=== MUST ===',
    '- WORM · tre silos · DCAP före LLM · Zero Footprint · Locked UX intakt',
    '- Prompts endast i functions/src/sharedRules.ts',
    `- Verifiera: ${smoke}`,
    '- Committa: copilot-yolo: <task-id> — <kort varför>',
    '',
    '=== MUST NOT (PMIR — hard stop) ===',
    '- Ändra INTE: firestore.rules, storage.rules, sharedRules.ts, NavigationDrawer.tsx, locked-ux-features',
    '- Kör ALDRIG firebase deploy (skriv kommando i slutrapport om deploy behövs)',
    '- Ingen force-push · ingen cross-RAG · ingen mock-WORM',
    deploy
      ? `- Deploy föreslås efter Pontus OK: firebase deploy --only ${deploy}`
      : '- Deploy: none för denna våg',
    '',
    'LEVERANS: vad · varför · smoke-resultat · risk · ev. deploy-kommando (ej kört).',
  ]
    .filter(Boolean)
    .join('\n');
}

function runPreflight() {
  if (process.env.COPILOT_YOLO_SKIP_PREFLIGHT === '1') {
    console.log('[copilot:yolo] Pre-flight hoppad (COPILOT_YOLO_SKIP_PREFLIGHT=1)');
    return true;
  }
  if (process.env.COPILOT_YOLO_FULL_PREFLIGHT === '1') {
    console.log('[copilot:yolo] Pre-flight: orkester:night (full, live-progress)...');
    return runStep('preflight', 'npm run orkester:night', { ORKESTER_LIVE: '1' });
  }
  // Static gate — no Firestore capability gate, no long rollout network phase
  console.log('[copilot:yolo] Pre-flight: static (locked-ux + orkester + build)...');
  return runStep(
    'preflight',
    'npm run smoke:locked-ux && npm run smoke:orkester && cd functions && npm run build && cd .. && npm run build',
  );
}

function runSmoke(task) {
  for (const step of getSmokeSteps(task)) {
    if (!runStep('smoke', step)) return false;
  }
  return true;
}

function changedFilesSince(sha) {
  if (!sha || sha === 'unknown') {
    try {
      return execSync('git diff --name-only HEAD', { cwd: root, encoding: 'utf8' })
        .trim()
        .split('\n')
        .filter(Boolean);
    } catch {
      return [];
    }
  }
  try {
    return execSync(`git diff --name-only ${sha}`, { cwd: root, encoding: 'utf8' })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch {
    return [];
  }
}

function checkPmirViolations(files) {
  return files.filter((f) => PMIR_GREP.test(f));
}

function printDeployInstructions(task) {
  if (!task.deploy || task.deploy === 'none') return;
  const cmd = `firebase use gen-lang-client-0481875058 && firebase deploy --only ${task.deploy}`;
  console.log('');
  console.log('══════════════════════════════════════════════════');
  console.log('  DEPLOY-LÅS — kräver Pontus OK');
  console.log('══════════════════════════════════════════════════');
  console.log(cmd);
  console.log('Efter deploy (valfritt live): npm run smoke:predeploy:live');
  console.log('');
  appendLog(task.id, 'deploy-ready', '—', cmd);
}

function findCopilotBin() {
  for (const bin of ['copilot', '/opt/homebrew/bin/copilot']) {
    const r = spawnSync('which', [bin], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
    if (existsSync(bin)) return bin;
  }
  console.error('[copilot:yolo] copilot CLI saknas. Kör: brew install copilot-cli && copilot login');
  process.exit(1);
}

function launchCopilot(task) {
  const copilot = findCopilotBin();
  const args = [
    '-i',
    buildPrompt(task),
    '--yolo',
    '--autopilot',
    '--no-ask-user',
    '--experimental',
    '--max-autopilot-continues',
    '30',
    '--effort',
    'high',
    '--model',
    'auto',
    '--name',
    `lk-safe-yolo-${task.id}`,
    '-C',
    root,
  ];

  console.log('');
  console.log('══════════════════════════════════════════════════');
  console.log(`  COPILOT SAFE YOLO — ${task.id}`);
  console.log(`  ${task.title}`);
  console.log('══════════════════════════════════════════════════');
  console.log('[copilot:yolo] Copilot autopilot + yolo (deploy låst i prompt)...');
  console.log('');

  return spawnSync(copilot, args, {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, COPILOT_ALLOW_ALL: 'true' },
  });
}

function printStatus(queue, state) {
  const next = resolveTask(queue, state);
  const hints = readJson(hintsPath, null);
  console.log('[copilot:yolo] Safe YOLO v2');
  console.log('[copilot:yolo] State:', statePath);
  console.log('[copilot:yolo] Klara:', state.completedTaskIds.length, '/', state.taskOrder.length);
  if (state.currentTaskId) console.log('[copilot:yolo] Pågår:', state.currentTaskId);
  if (next) console.log('[copilot:yolo] Nästa:', next.id, '—', next.title);
  else console.log('[copilot:yolo] Kö tom.');
  if (hints?.modulGap?.length) {
    console.log('[copilot:yolo] MODUL-GAP hints:', hints.modulGap.length, '(kör sync för detalj)');
  }
  if (hints?.openSystemPlan?.length) {
    console.log('[copilot:yolo] system-plan öppet:', hints.openSystemPlan[0]);
  }
}

/** @returns {boolean} true = våg klar, false = stopp */
function runOneWave(queue, state, task) {
  const startSha = gitSnapshot().sha;
  state.currentTaskId = task.id;
  state.taskStartSha = startSha;
  saveState(state);

  if (!runPreflight()) {
    appendLog(task.id, 'preflight FAIL', 'fail', 'orkester:night');
    console.error('[copilot:yolo] ✗ Pre-flight FAIL — fixa innan nästa försök.');
    return false;
  }

  const result = launchCopilot(task);
  if (result.status !== 0) {
    if (result.signal) {
      appendLog(task.id, 'interrupted', '—', result.signal);
      console.log('[copilot:yolo] Avbruten.');
    } else {
      appendLog(task.id, 'copilot FAIL', '—', `exit ${result.status ?? 'unknown'}`);
      console.error('[copilot:yolo] Copilot startade inte — smoke hoppas över.');
    }
    return false;
  }

  const changed = changedFilesSince(startSha);
  const pmirHits = checkPmirViolations(changed);
  if (pmirHits.length && process.env.COPILOT_YOLO_ALLOW_PMIR !== '1') {
    appendLog(task.id, 'PMIR BLOCK', '—', pmirHits.join(', '));
    console.error('[copilot:yolo] ✗ PMIR-stopp — Sacred-filer ändrade:');
    pmirHits.forEach((f) => console.error(`  - ${f}`));
    console.error('[copilot:yolo] Reverta eller kör med Pontus OK: COPILOT_YOLO_ALLOW_PMIR=1 yolo');
    return false;
  }

  console.log('');
  console.log('[copilot:yolo] Smoke-gate (alltid smoke:predeploy:build)...');
  const smokeOk = runSmoke(task);

  if (!smokeOk) {
    if (!state.failedTaskIds.includes(task.id)) state.failedTaskIds.push(task.id);
    saveState(state);
    appendLog(task.id, 'smoke FAIL', 'fail', 'kör yolo igen eller yolo skip');
    console.error('[copilot:yolo] ✗ Smoke FAIL');
    return false;
  }

  if (!state.completedTaskIds.includes(task.id)) state.completedTaskIds.push(task.id);
  state.currentTaskId = null;
  state.taskStartSha = null;
  saveState(state);
  appendLog(task.id, 'PASS', 'ok', task.title);
  console.log('[copilot:yolo] ✓ Våg klar:', task.id);
  printDeployInstructions(task);
  return true;
}

function main() {
  const queue = loadQueue();
  let state = loadState(queue);

  if (cmd === 'status') {
    printStatus(queue, state);
    return;
  }

  if (cmd === 'sync') {
    const hints = syncBacklogHints();
    console.log('[copilot:yolo] Sync klar →', hintsPath);
    console.log('[copilot:yolo] MODUL-GAP hints:', hints.modulGap.length);
    console.log('[copilot:yolo] system-plan öppet:', hints.openSystemPlan.length);
    if (hints.masterYolo) console.log('[copilot:yolo] master-state:', hints.masterYolo.status, hints.masterYolo.nextWaveId);
    return;
  }

  if (cmd === 'reset') {
    state = {
      version: 2,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentTaskId: null,
      completedTaskIds: [],
      skippedTaskIds: [],
      failedTaskIds: [],
      taskOrder: queue.tasks.map((t) => t.id),
      taskStartSha: null,
    };
    saveState(state);
    syncBacklogHints();
    console.log('[copilot:yolo] State nollställd + backlog sync.');
    printStatus(queue, state);
    return;
  }

  if (cmd === 'done') {
    const id = state.currentTaskId;
    if (!id) {
      console.error('[copilot:yolo] Ingen pågående task.');
      process.exit(1);
    }
    if (!state.completedTaskIds.includes(id)) state.completedTaskIds.push(id);
    state.currentTaskId = null;
    saveState(state);
    appendLog(id, 'done (manual)', '—', '');
    printStatus(queue, state);
    return;
  }

  if (cmd === 'skip') {
    const id = state.currentTaskId ?? resolveTask(queue, state)?.id;
    if (!id) {
      console.error('[copilot:yolo] Ingen task att hoppa över.');
      process.exit(1);
    }
    if (!state.skippedTaskIds.includes(id)) state.skippedTaskIds.push(id);
    state.currentTaskId = null;
    saveState(state);
    appendLog(id, 'skipped', '—', '');
    console.log('[copilot:yolo] Hoppade över:', id);
    printStatus(queue, state);
    return;
  }

  const taskIdArg = cmd === 'task' ? argv[1] : null;
  if (cmd === 'task' && !taskIdArg) {
    console.error('[copilot:yolo] Usage: npm run copilot:yolo -- task <id>');
    process.exit(1);
  }

  syncBacklogHints();

  if (cmd === 'loop') {
    console.log('[copilot:yolo] LOOP — kör tills smoke fail, PMIR eller tom kö.');
    let n = 0;
    while (n < 20) {
      const task = resolveTask(queue, state);
      if (!task) {
        console.log('[copilot:yolo] Kö tom — loop klar.');
        break;
      }
      console.log(`[copilot:yolo] Loop våg ${n + 1}: ${task.id}`);
      const ok = runOneWave(queue, state, task);
      state = loadState(queue);
      if (!ok) {
        console.log('[copilot:yolo] Loop stoppad — fixa eller yolo skip');
        break;
      }
      n += 1;
      printStatus(queue, state);
    }
    return;
  }

  const task = resolveTask(queue, state, taskIdArg);
  if (!task) {
    console.log('[copilot:yolo] Alla uppgifter klara eller hoppade över.');
    return;
  }

  const ok = runOneWave(queue, state, task);
  if (ok) {
    printStatus(queue, state);
    console.log('');
    console.log('[copilot:yolo] Nästa: yolo  |  alla vågar: yolo loop');
  }
}

main();
