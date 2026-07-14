#!/usr/bin/env node
/**
 * Långa Cursor YOLO-körningar via @cursor/sdk.
 * Fortifikation: endast förbättra — aldrig riva fungerande kod.
 *
 * Usage:
 *   npm run sdk:yolo                    # nästa task (lokal agent)
 *   npm run sdk:yolo -- --run           # alla kvarvarande tasks sekventiellt
 *   npm run sdk:yolo -- --master        # en lång MASTER-körning
 *   npm run sdk:yolo -- --cloud         # cloud agent (ny branch/PR)
 *   npm run sdk:yolo -- --version=14
 *   npm run sdk:yolo -- --resume=<agentId>
 *
 * Env:
 *   CURSOR_API_KEY          krävs för SDK (utom ren --dry-run)
 *   CURSOR_YOLO_VERSION=14  default version
 */
import { Agent, CursorAgentError } from "@cursor/sdk";
import {
  REPO,
  getYoloConfig,
  loadQueue,
  loadState,
  saveState,
  resolveNextTask,
  buildTaskSdkPrompt,
  buildMasterSdkPrompt,
  runTaskSmoke,
  logLine,
  writeSdkRunReport,
  isQueueComplete,
} from "./lib/cursor_yolo_shared.mjs";

const args = process.argv.slice(2);
const versionArg = args.find((a) => a.startsWith("--version="))?.split("=")[1];
const resumeArg = args.find((a) => a.startsWith("--resume="))?.split("=")[1]?.trim();
const branchArg = args.find((a) => a.startsWith("--branch="))?.split("=")[1]?.trim();

const modeRun = args.includes("--run");
const modeMaster = args.includes("--master");
const modeTask = args.includes("--task") || (!modeRun && !modeMaster);
const forceCloud = args.includes("--cloud");
const forceLocal = args.includes("--local");
const dryRun = args.includes("--dry-run");
const allowDeploy = args.includes("--allow-deploy");
const skipSmoke = args.includes("--skip-smoke");

const yoloVersion = Number(versionArg ?? process.env.CURSOR_YOLO_VERSION ?? 14);
const config = getYoloConfig(yoloVersion);

if (!config) {
  console.error("[sdk:yolo] Okänd version:", yoloVersion);
  process.exit(1);
}

function parseArgsHelp() {
  console.log(`Cursor YOLO SDK ${config.label}
Kommandon:
  npm run sdk:yolo              nästa task (default)
  npm run sdk:yolo -- --run     loop tills kön klar eller FAIL
  npm run sdk:yolo -- --master  en lång MASTER-prompt
  npm run sdk:yolo -- --cloud   cloud VM (kräver pushad branch)
  npm run sdk:yolo -- --local   tvinga lokal agent
  npm run sdk:yolo -- --dry-run skriv prompt, starta inte agent
  npm run sdk:yolo -- --resume=<agentId>  fortsätt befintlig agent`);
}

if (args.includes("--help") || args.includes("-h")) {
  parseArgsHelp();
  process.exit(0);
}

function ensureTaskOrder(queue, state) {
  if (!state.taskOrder?.length) {
    state.taskOrder = queue.tasks.filter((t) => t.phase === "sequential").map((t) => t.id);
  }
  return state;
}

function shouldSkipTask(task) {
  if (task.pmir && task.deploy && task.deploy !== "none" && !allowDeploy) {
    console.log(`[sdk:yolo] SKIP PMIR/deploy: ${task.id} (saknar --allow-deploy)`);
    return true;
  }
  return false;
}

async function streamRun(run) {
  let text = "";
  if (run.supports("stream")) {
    for await (const event of run.stream()) {
      if (event.type === "assistant") {
        for (const block of event.message.content) {
          if (block.type === "text") {
            process.stdout.write(block.text);
            text += block.text;
          }
        }
      }
    }
  }
  return text;
}

async function createAgent(apiKey) {
  if (resumeArg) {
    console.log(`[sdk:yolo] Resume agent ${resumeArg}`);
    return Agent.resume(resumeArg, { apiKey });
  }

  const useCloud = forceCloud && !forceLocal;
  if (useCloud) {
    console.log("[sdk:yolo] Cloud agent — repos:", REPO, branchArg ? `branch=${branchArg}` : "");
    return Agent.create({
      apiKey,
      model: { id: "composer-2.5" },
      cloud: {
        repos: [{ url: REPO, ...(branchArg ? { branch: branchArg } : {}) }],
        skipReviewerRequest: true,
      },
    });
  }

  console.log("[sdk:yolo] Lokal agent — cwd:", process.cwd());
  return Agent.create({
    apiKey,
    model: { id: "composer-2.5" },
    local: { cwd: process.cwd(), settingSources: [] },
  });
}

/** @param {import('@cursor/sdk').Agent} agent @param {string} prompt @param {object} meta */
async function sendAndWait(agent, prompt, meta) {
  const run = await agent.send(prompt);
  console.log(`[sdk:yolo] agentId=${agent.agentId} runId=${run.id}`);
  meta.runs.push({ runId: run.id, agentId: agent.agentId, ...meta.current });

  const text = await streamRun(run);
  const result = await run.wait();
  console.log("\n── Run status:", result.status);

  meta.runs[meta.runs.length - 1].status = result.status;
  meta.runs[meta.runs.length - 1].excerpt = text.slice(-4000);

  if (result.status === "error") {
    return { ok: false, startup: false, result, text };
  }
  return { ok: true, startup: false, result, text };
}

/** @param {import('@cursor/sdk').Agent} agent @param {object} queue @param {object} state @param {object} meta */
async function runSingleTask(agent, queue, state, task, meta) {
  if (shouldSkipTask(task)) {
    if (!state.sequentialPhase.skippedTaskIds.includes(task.id)) {
      state.sequentialPhase.skippedTaskIds.push(task.id);
    }
    state.sequentialPhase.currentTaskId = null;
    saveState(config, state);
    logLine(config, task.id, "SKIP", "PMIR/deploy SDK auto-skip");
    return { ok: true, skipped: true };
  }

  state.sequentialPhase.currentTaskId = task.id;
  saveState(config, state);

  const prompt = buildTaskSdkPrompt(task, config);
  meta.current = { taskId: task.id, title: task.title, mode: "task" };

  if (dryRun) {
    console.log("\n── DRY-RUN prompt ──\n");
    console.log(prompt);
    return { ok: true, dryRun: true };
  }

  const sent = await sendAndWait(agent, prompt, meta);
  if (!sent.ok) {
    if (!state.sequentialPhase.failedTaskIds.includes(task.id)) {
      state.sequentialPhase.failedTaskIds.push(task.id);
    }
    saveState(config, state);
    logLine(config, task.id, "AGENT FAIL", task.title);
    return { ok: false, reason: "agent" };
  }

  if (!skipSmoke) {
    console.log("[sdk:yolo] Kör deterministisk task-smoke…");
    const smoke = runTaskSmoke(task);
    if (!smoke.ok) {
      if (!state.sequentialPhase.failedTaskIds.includes(task.id)) {
        state.sequentialPhase.failedTaskIds.push(task.id);
      }
      state.sequentialPhase.currentTaskId = null;
      saveState(config, state);
      logLine(config, task.id, "smoke FAIL", smoke.failedStep ?? "");
      return { ok: false, reason: "smoke" };
    }
  }

  if (!state.sequentialPhase.completedTaskIds.includes(task.id)) {
    state.sequentialPhase.completedTaskIds.push(task.id);
  }
  state.sequentialPhase.currentTaskId = null;
  saveState(config, state);
  logLine(config, task.id, "PASS", task.title);
  console.log(`[sdk:yolo] ✓ Klar: ${task.id}`);
  return { ok: true };
}

async function main() {
  const apiKey = process.env.CURSOR_API_KEY?.trim();
  if (!apiKey && !dryRun) {
    console.error("[sdk:yolo] CURSOR_API_KEY saknas. Hämta nyckel: Cursor Dashboard → Integrations");
    console.error("[sdk:yolo] Eller kör: npm run sdk:yolo:setup");
    process.exit(1);
  }

  const queue = loadQueue(config);
  let state = ensureTaskOrder(queue, loadState(config));

  const meta = {
    runner: "sdk:yolo",
    version: yoloVersion,
    mode: modeMaster ? "master" : modeRun ? "run" : "task",
    cloud: forceCloud && !forceLocal,
    branch: branchArg ?? null,
    runs: [],
  };

  if (modeMaster) {
    if (isQueueComplete(state)) {
      console.log("[sdk:yolo] Kön redan klar.");
      process.exit(0);
    }
    const prompt = buildMasterSdkPrompt(config, queue, state);
    meta.current = { taskId: config.masterTaskId, title: config.masterTitle, mode: "master" };

    if (dryRun) {
      console.log("\n── DRY-RUN MASTER ──\n");
      console.log(prompt);
      process.exit(0);
    }

    const agent = await createAgent(apiKey);
    try {
      const sent = await sendAndWait(agent, prompt, meta);
      writeSdkRunReport(meta);
      process.exit(sent.ok ? 0 : 2);
    } finally {
      await agent[Symbol.asyncDispose]?.();
    }
  }

  const agent = dryRun ? null : await createAgent(apiKey);
  try {
    if (modeTask) {
      const task = resolveNextTask(queue, state, config);
      if (!task) {
        console.log("[sdk:yolo] Ingen kvarvarande uppgift.");
        process.exit(0);
      }
      console.log(`[sdk:yolo] Task: ${task.id} — ${task.title}`);
      const result = await runSingleTask(agent, queue, state, task, meta);
      writeSdkRunReport(meta);
      if (result.dryRun) process.exit(0);
      process.exit(result.ok ? 0 : result.skipped ? 0 : 2);
    }

    // --run: loop
    console.log(`[sdk:yolo] --run ${config.label}: sekventiell SDK-loop`);
    let iterations = 0;
    const maxIterations = (state.taskOrder?.length ?? 20) + 2;

    while (iterations < maxIterations) {
      iterations++;
      state = loadState(config);
      const task = resolveNextTask(queue, state, config);
      if (!task) {
        console.log("[sdk:yolo] 🎉 Alla uppgifter klara.");
        writeSdkRunReport({ ...meta, completed: true });
        process.exit(0);
      }
      console.log(`\n[sdk:yolo] === ${task.id} (${iterations}/${state.taskOrder.length}) ===`);
      const result = await runSingleTask(agent, queue, state, task, meta);
      if (!result.ok && !result.skipped) {
        console.error(`[sdk:yolo] STOP — FAIL på ${task.id} (${result.reason})`);
        writeSdkRunReport({ ...meta, stoppedAt: task.id, reason: result.reason });
        process.exit(2);
      }
    }

    console.error("[sdk:yolo] Loop-gräns nådd — avbryter säkerhetsstopp.");
    writeSdkRunReport({ ...meta, loopLimit: true });
    process.exit(2);
  } catch (err) {
    if (err instanceof CursorAgentError) {
      const msg = err.message ?? "";
      if (msg.includes("Invalid UserAPI Key") || err.status === 401) {
        console.error("[sdk:yolo] Ogiltig CURSOR_API_KEY (401).");
        console.error("[sdk:yolo] Skapa ny User API Key: https://cursor.com/dashboard/integrations");
        console.error("[sdk:yolo] Nyckeln ska börja med crsr_ (User API Key). Kopiera hela nyckeln direkt vid skapande.");
        console.error("[sdk:yolo] Kör sedan: npm run sdk:yolo:setup");
      } else {
        console.error("[sdk:yolo] Startup failed:", msg, "retryable=", err.isRetryable);
      }
      writeSdkRunReport({ ...meta, startupError: msg, retryable: err.isRetryable });
      process.exit(1);
    }
    throw err;
  } finally {
    if (agent) await agent[Symbol.asyncDispose]?.();
  }
}

await main();
