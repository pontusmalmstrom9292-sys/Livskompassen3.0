#!/usr/bin/env node
/**
 * Copilot YOLO launcher — nästa uppgift + full autopilot via GitHub Copilot CLI.
 *
 * Usage:
 *   npm run copilot:yolo              # kör nästa kö-uppgift
 *   npm run copilot:yolo -- status    # visa nästa
 *   npm run copilot:yolo -- reset     # nollställ state (behåll kö)
 *   npm run copilot:yolo -- done      # markera nuvarande som klar
 *   npm run copilot:yolo -- skip      # hoppa över nuvarande
 *   npm run copilot:yolo -- task w2-backend-audit
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
const today = new Date().toISOString().slice(0, 10);
const logPath = resolve(root, 'docs/evaluations', `${today}-copilot-yolo-log.md`);

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

function gitSnapshot() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: root, encoding: 'utf8' }).trim();
    const sha = execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8' }).trim();
    return { branch, sha };
  } catch {
    return { branch: 'unknown', sha: 'unknown' };
  }
}

function ensureLogHeader() {
  mkdirSync(resolve(root, 'docs/evaluations'), { recursive: true });
  if (existsSync(logPath)) return;
  const git = gitSnapshot();
  writeFileSync(
    logPath,
    [
      `# Copilot YOLO log — ${today}`,
      '',
      `**Git:** ${git.branch} @ ${git.sha}`,
      `**Kanon:** .github/copilot-instructions.md · AGENTS.md · .cursor/index.mdc`,
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
  appendFileSync(
    logPath,
    `| ${ts} | ${taskId} | ${status} | ${smoke} | ${note} |\n`,
    'utf8',
  );
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
  if (existing?.version === 1) return existing;
  return {
    version: 1,
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentTaskId: null,
    completedTaskIds: [],
    skippedTaskIds: [],
    failedTaskIds: [],
    taskOrder: queue.tasks.map((t) => t.id),
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

function buildPrompt(task) {
  const pmir = task.pmir
    ? `PMIR-AKTIV: Rör INTE ${task.deploy ?? 'Sacred paths'} utan explicit "Pontus OK" i chatten. Förbered kod+smoke, deploy endast om användaren skriver det.`
    : 'PMIR: Rör INTE firestore.rules, storage.rules, sharedRules.ts, Locked UX utan explicit Pontus OK.';

  const smoke = (task.smoke ?? ['npm run smoke:predeploy']).join(' && ');

  return [
    `Livskompassen YOLO — uppgift "${task.id}": ${task.title}`,
    '',
    'Du är GitHub Copilot CLI i full autopilot. Bygg klart uppgiften autonomt.',
    '',
    'Läs först (kort):',
    '- .github/copilot-instructions.md',
    '- AGENTS.md',
    '- .cursor/index.mdc',
    '',
    `Plan: ${task.plan}`,
    '',
    'MUST:',
    '- WORM append-only · tre silos (ingen cross-RAG) · DCAP före LLM · Zero Footprint',
    '- Bevara Locked UX (Valv, Familjen/Barnporten, Planering-widget)',
    `- Verifiera innan du avslutar: ${smoke}`,
    '- Committa med: copilot-yolo: <task-id> — <kort varför>',
    pmir,
    '',
    'Arbeta tills smoke PASS eller du blockeras (PMIR). Rapportera kort: vad, varför, verifiering, risk.',
  ].join('\n');
}

function runSmoke(task) {
  const steps = task.smoke ?? ['npm run smoke:predeploy'];
  for (const step of steps) {
    console.log(`[copilot:yolo] smoke → ${step}`);
    const r = spawnSync(step, {
      cwd: root,
      shell: true,
      stdio: 'inherit',
      env: process.env,
    });
    if (r.status !== 0) return false;
  }
  return true;
}

function findCopilotBin() {
  const candidates = ['copilot', '/opt/homebrew/bin/copilot'];
  for (const bin of candidates) {
    const r = spawnSync('which', [bin], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
    if (existsSync(bin)) return bin;
  }
  console.error('[copilot:yolo] copilot CLI saknas. Kör: brew install copilot-cli && copilot login');
  process.exit(1);
}

function launchCopilot(task) {
  const copilot = findCopilotBin();
  const prompt = buildPrompt(task);
  const args = [
    '-i',
    prompt,
    '--yolo',
    '--autopilot',
    '--mode',
    'autopilot',
    '--no-ask-user',
    '--experimental',
    '--max-autopilot-continues',
    '30',
    '--effort',
    'high',
    '--model',
    'auto',
    '--name',
    `lk-yolo-${task.id}`,
    '-C',
    root,
  ];

  console.log('');
  console.log('══════════════════════════════════════════════════');
  console.log(`  COPILOT YOLO — ${task.id}`);
  console.log(`  ${task.title}`);
  console.log('══════════════════════════════════════════════════');
  console.log('[copilot:yolo] Startar Copilot CLI (autopilot + yolo)...');
  console.log('[copilot:yolo] Avsluta session med Ctrl+C om du behöver pausa.');
  console.log('');

  return spawnSync(copilot, args, {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      COPILOT_ALLOW_ALL: 'true',
    },
  });
}

function printStatus(queue, state) {
  const next = resolveTask(queue, state);
  console.log('[copilot:yolo] State:', statePath);
  console.log('[copilot:yolo] Klara:', state.completedTaskIds.length, '/', state.taskOrder.length);
  if (state.currentTaskId) console.log('[copilot:yolo] Pågår:', state.currentTaskId);
  if (next) {
    console.log('[copilot:yolo] Nästa:', next.id, '—', next.title);
  } else {
    console.log('[copilot:yolo] Kö tom — lägg till tasks i .orkester/copilot-yolo-queue.json');
  }
}

function main() {
  const queue = loadQueue();
  let state = loadState(queue);

  if (cmd === 'status') {
    printStatus(queue, state);
    return;
  }

  if (cmd === 'reset') {
    state = {
      version: 1,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentTaskId: null,
      completedTaskIds: [],
      skippedTaskIds: [],
      failedTaskIds: [],
      taskOrder: queue.tasks.map((t) => t.id),
    };
    saveState(state);
    console.log('[copilot:yolo] State nollställd.');
    printStatus(queue, state);
    return;
  }

  if (cmd === 'done') {
    const id = state.currentTaskId;
    if (!id) {
      console.error('[copilot:yolo] Ingen pågående task. Kör copilot:yolo först.');
      process.exit(1);
    }
    if (!state.completedTaskIds.includes(id)) state.completedTaskIds.push(id);
    state.currentTaskId = null;
    saveState(state);
    appendLog(id, 'done (manual)', '—', 'markerad klar');
    console.log('[copilot:yolo] Markerad klar:', id);
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
    appendLog(id, 'skipped', '—', 'hoppad över');
    console.log('[copilot:yolo] Hoppade över:', id);
    printStatus(queue, state);
    return;
  }

  const taskIdArg = cmd === 'task' ? argv[1] : null;
  if (cmd === 'task' && !taskIdArg) {
    console.error('[copilot:yolo] Usage: npm run copilot:yolo -- task <id>');
    process.exit(1);
  }

  const task = resolveTask(queue, state, taskIdArg);
  if (!task) {
    console.log('[copilot:yolo] Alla uppgifter klara eller hoppade över.');
    console.log('[copilot:yolo] Kör: npm run copilot:yolo -- reset');
    return;
  }

  state.currentTaskId = task.id;
  saveState(state);

  const result = launchCopilot(task);
  if (result.status !== 0 && result.signal) {
    appendLog(task.id, 'interrupted', '—', result.signal);
    console.log('[copilot:yolo] Avbruten. Kör yolo igen för att fortsätta.');
    return;
  }

  console.log('');
  console.log('[copilot:yolo] Copilot avslutad — kör smoke-gate...');
  const smokeOk = runSmoke(task);

  if (smokeOk) {
    if (!state.completedTaskIds.includes(task.id)) state.completedTaskIds.push(task.id);
    state.currentTaskId = null;
    saveState(state);
    appendLog(task.id, 'PASS', 'ok', task.title);
    console.log('[copilot:yolo] ✓ Smoke PASS — uppgift klar:', task.id);
    printStatus(queue, state);
    console.log('');
    console.log('[copilot:yolo] Skriv yolo igen för nästa uppgift.');
  } else {
    if (!state.failedTaskIds.includes(task.id)) state.failedTaskIds.push(task.id);
    saveState(state);
    appendLog(task.id, 'smoke FAIL', 'fail', 'kör yolo igen eller yolo skip');
    console.error('[copilot:yolo] ✗ Smoke FAIL — samma uppgift körs vid nästa yolo.');
    console.error('[copilot:yolo] Eller: npm run copilot:yolo -- skip');
  }
}

main();
