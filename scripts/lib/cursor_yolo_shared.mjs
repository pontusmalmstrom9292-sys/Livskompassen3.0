/**
 * Delad logik för Cursor YOLO (`cursor:yolo`, `sdk:yolo`).
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const root = resolve(__dirname, "../..");
export const REPO = "https://github.com/pontusmalmstrom9292-sys/Livskompassen3.0";
export const sdkRunsDir = join(root, ".orkester/sdk-yolo-runs");

export const FORTIFICATION_MANDATE = `
## FORTIFIKATION (obligatorisk — bryt ALDRIG)

- **Endast förbättra, stärka och verifiera** — ta INTE bort fungerande kod, features eller routes.
- **Minsta säkra diff** — inga refaktoreringar "för snyggt", inga massflytt av filer.
- **Bevara Locked UX**, tre silos, WORM, Sacred Features.
- **PMIR-STOPP** (SKIP + blocker.md, gör INTE ändringen):
  - firestore.rules, storage.rules, functions/src/sharedRules.ts
  - AppRoutes-struktur, Barnporten kanon-UI
  - Live Kunskap-ingest (--apply), deploy rules/functions/hosting utan explicit "OK deploy"
- Vid osäkerhet: **SKIP och dokumentera** — riv aldrig för att "fixa".
- Jämför mot hela projektets kontext. Arbeta autonomt tills smoke PASS eller tydlig blocker.
`.trim();

/** @param {number} yoloVersion */
export function getYoloConfig(yoloVersion) {
  const CONFIG = {
    5: mkConfig(5, "p4-p13-master", "MASTER sekventiell P4→P13", true, [
      { id: "p1-yolo-vakt", paths: ["docs/evaluations/2026-07-13-yolo-audit.md"] },
      { id: "p2-ux-guardian", paths: ["docs/evaluations/2026-07-13-ux-guardian.md"] },
      {
        id: "p3-design-debt",
        paths: [
          "docs/evaluations/2026-07-13-design-debt-done.md",
          "docs/evaluations/2026-07-13-cursor-yolo-v5-log.md",
        ],
        requireAll: false,
      },
    ]),
    6: mkConfig(6, "p14-p23-master", "MASTER sekventiell P14→P23", false, []),
    7: mkConfig(7, "p24-p33-master", "MASTER sekventiell P24→P33", false, [
      { id: "p24-baseline", paths: ["docs/evaluations/2026-07-13-yolo-v7-baseline.md"] },
    ]),
    8: mkConfig(8, "p34-p43-master", "MASTER sekventiell P34→P43", false, [
      { id: "p34-baseline", paths: ["docs/evaluations/2026-07-13-yolo-v8-baseline.md"] },
    ]),
    9: mkConfig(9, "p44-p53-master", "MASTER sekventiell P44→P53", false, [
      { id: "p44-baseline", paths: ["docs/evaluations/2026-07-13-yolo-v9-baseline.md"] },
    ]),
    10: mkConfig(10, "p54-p63-master", "MASTER sekventiell P54→P63", false, [
      { id: "p54-baseline", paths: ["docs/evaluations/2026-07-13-yolo-v10-baseline.md"] },
    ]),
    11: mkConfig(11, "p64-p73-master", "MASTER sekventiell P64→P73", false, [
      { id: "p64-baseline", paths: ["docs/evaluations/2026-07-13-cursor-yolo-v11-log.md"] },
    ], { nextVersion: 12, prevPhaseEnd: 73, nextPhaseStart: 74 }),
    12: mkConfig(12, "p74-p83-master", "MASTER sekventiell P74→P83", false, [], {
      nextVersion: 13,
      prevPhaseEnd: 83,
      nextPhaseStart: 84,
    }),
    13: mkConfig(13, "p84-p93-master", "MASTER sekventiell P84→P93", false, [], {
      nextVersion: 14,
      prevPhaseEnd: 93,
      nextPhaseStart: 94,
    }),
    14: mkConfig(14, "p94-p102-master", "MASTER sekventiell P94→P102", false, [], {
      nextVersion: 15,
      prevPhaseEnd: 102,
      nextPhaseStart: 103,
    }),
    15: mkConfig(15, "p103-p112-master", "MASTER sekventiell P103→P112", false, [], {
      nextVersion: 16,
      prevPhaseEnd: 112,
      nextPhaseStart: 113,
    }),
  };
  if (CONFIG[yoloVersion]) return CONFIG[yoloVersion];
  if (yoloVersion >= BUILD_WAVE_MIN && yoloVersion <= BUILD_WAVE_MAX) return mkBuildConfig(yoloVersion);
  if (yoloVersion >= 16) return mkFortificationConfig(yoloVersion);
  return null;
}

export const BUILD_WAVE_MIN = 34;
/** Improvement waves v49–v62 (Evigt Minne v55–v62); bump when manifest grows. */
export const BUILD_WAVE_MAX = 62;
/** First improvement-wave version (Fas 24 finish). */
export const IMPROVEMENT_WAVE_MIN = 49;
/** Evigt Minne auto-chain hard stop (rules/deploy require phrases after this). */
export const MINNE_AUTO_THROUGH = 60;

/** @param {number} version v34–v48 */
export function mkBuildConfig(version) {
  const label = `v${version}`;
  return {
    version,
    kind: "build",
    queuePath: join(root, `.orkester/cursor-yolo-queue-${label}.json`),
    statePath: join(root, `.orkester/cursor-yolo-state-${label}.json`),
    nextPromptPath: join(root, `.cursor/pipeline/yolo-${label}/NEXT-PROMPT.md`),
    masterPath: join(root, `docs/cursor-pipeline/yolo-${label}/MASTER-SEQUENTIAL.md`),
    promptDir: `docs/cursor-pipeline/yolo-${label}`,
    logSuffix: `cursor-yolo-${label}-log`,
    label,
    masterTaskId: `b${version}-build`,
    masterTitle: `BUILD v${version}`,
    requiresParallelGate: false,
    gateArtifacts: [],
    nextVersion: version < BUILD_WAVE_MAX ? version + 1 : null,
    prevPhaseEnd: null,
    nextPhaseStart: null,
  };
}

/** Skapar build-kö + state om de saknas (v34–v48). */
export async function ensureBuildWaveScaffold(version) {
  if (version < BUILD_WAVE_MIN || version > BUILD_WAVE_MAX) {
    return { created: false, reason: "not-build-wave" };
  }
  const config = getYoloConfig(version);
  if (!config) return { created: false, reason: "no-config" };
  const { ensureBuildWave } = await import("./cursor_yolo_build.mjs");
  return ensureBuildWave(version, config);
}

/** @param {number} version v15+ */
export function fortificationDeployPhase(version) {
  return 103 + (version - 15) * 10;
}

/** @param {number} version v15+ */
function mkFortificationConfig(version) {
  const pDeploy = fortificationDeployPhase(version);
  const pEnd = pDeploy + 9;
  return mkConfig(
    version,
    `p${pDeploy}-p${pEnd}-master`,
    `MASTER sekventiell P${pDeploy}→P${pEnd}`,
    false,
    [],
    { nextVersion: version + 1, prevPhaseEnd: pEnd, nextPhaseStart: pDeploy + 10 },
  );
}

/** @param {number} version v15+ */
export function buildFortificationQueue(version) {
  const p = fortificationDeployPhase(version);
  const task = (id, title, agent, plan, smoke, extra = {}) => ({
    id,
    title,
    phase: "sequential",
    agent,
    plan,
    smoke,
    fullGate: extra.fullGate ?? false,
    pmir: extra.pmir ?? false,
    deploy: extra.deploy ?? "none",
  });
  return {
    version,
    description: `Cursor YOLO v${version} — Auto-Lock & Fortifikation P${p}–P${p + 9}`,
    sequentialPhase: { label: "Fortifikation" },
    tasks: [
      task(`p${p}-deploy`, `P${p} — (Valfritt) hosting deploy`, "yolo-vakt", "SKIP om ej Pontus OK deploy", [], {
        pmir: true,
        deploy: "hosting",
      }),
      task(`p${p + 1}-baseline`, `P${p + 1} — Read-only baseline`, "yolo-vakt", `smoke:predeploy:build. Eval baseline v${version}.`, [
        "npm run smoke:predeploy:build",
      ]),
      task(`p${p + 2}-auto-lock-hygiene`, `P${p + 2} — Auto-lock hygiene`, "specialist-verifier", "entryFiles + LOCK-MANIFEST.", [
        "npm run smoke:module-lock",
      ]),
      task(`p${p + 3}-security`, `P${p + 3} — Security read-only`, "specialist-security-auditor", `WORM, silos. Eval security-v${version}.md.`, [
        "npm run smoke:manifest",
        "npm run smoke:valv-security",
      ]),
      task(`p${p + 4}-ux-guardian`, `P${p + 4} — Locked UX re-snapshot`, "specialist-ux-guardian", "locked-ux smokes.", [
        "npm run smoke:locked-ux",
        "npm run smoke:e2e-locked-ux",
        "npm run smoke:plausible-deniability",
        "npm run smoke:basta-dock-lock",
      ]),
      task(`p${p + 5}-drift`, `P${p + 5} — Drift & smoke`, "specialist-verifier", `journal-2d, mabra, valv, widgets. Eval drift-v${version}.md.`, [
        "npm run smoke:journal-2d",
        "npm run smoke:mabra",
        "npm run smoke:valv",
        "npm run smoke:widgets",
      ]),
      task(`p${p + 6}-design-debt`, `P${p + 6} — Design-debt guard`, "specialist-ux-guardian", "dsBtn 0, btnPill 0, adHocDialog 0.", [
        "npm run smoke:design-debt",
        "npm run smoke:copy-audit",
        "npm run smoke:calm-card-audit",
      ]),
      task(`p${p + 7}-fortification`, `P${p + 7} — Agent-fortifikation v${version}`, "yolo-vakt", `cursor:yolo:v${version} + queue/state.`, [
        "npm run smoke:governance",
        "npm run smoke:mdc",
      ]),
      task(`p${p + 8}-integration`, `P${p + 8} — Integration dry-run`, "livskompassen-arkiv-master", "preflight + seed --dry-run. Aldrig --apply.", [
        "npm run smoke:innehall",
        "npm run smoke:content-waves",
      ]),
      task(`p${p + 9}-yolo-vakt`, `P${p + 9} — yolo-vakt slutgate`, "yolo-vakt", `GO/NO-GO + handoff v${version + 1}`, ["npm run smoke:predeploy:build"], {
        fullGate: true,
      }),
    ],
  };
}

/** Skapar kö + state för fortifikationsvåg om de saknas (v15+). */
export function ensureFortificationWave(version) {
  if (version < 15) return { created: false, reason: "not-fortification" };
  const config = getYoloConfig(version);
  if (!config) return { created: false, reason: "no-config" };

  let created = false;
  if (!existsSync(config.queuePath)) {
    writeJson(config.queuePath, buildFortificationQueue(version));
    created = true;
  }
  if (!existsSync(config.statePath)) {
    const queue = readJson(config.queuePath) ?? buildFortificationQueue(version);
    const deployId = queue.tasks[0]?.id;
    writeJson(config.statePath, {
      version,
      queueFile: `.orkester/cursor-yolo-queue-v${version}.json`,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sequentialPhase: {
        status: "in_progress",
        currentTaskId: null,
        completedTaskIds: [],
        skippedTaskIds: deployId ? [deployId] : [],
        failedTaskIds: [],
      },
      taskOrder: queue.tasks.map((t) => t.id),
      notes: `YOLO v${version} Auto-Lock — SDK marathon scaffold`,
    });
    created = true;
  }
  return { created, config };
}

function mkConfig(
  version,
  masterTaskId,
  masterTitle,
  requiresParallelGate,
  gateArtifacts,
  extra = {},
) {
  const label = `v${version}`;
  return {
    version,
    queuePath: join(root, `.orkester/cursor-yolo-queue-${label}.json`),
    statePath: join(root, `.orkester/cursor-yolo-state-${label}.json`),
    nextPromptPath: join(root, `.cursor/pipeline/yolo-${label}/NEXT-PROMPT.md`),
    masterPath: join(root, `docs/cursor-pipeline/yolo-${label}/MASTER-SEQUENTIAL.md`),
    promptDir: `docs/cursor-pipeline/yolo-${label}`,
    logSuffix: `cursor-yolo-${label}-log`,
    label,
    masterTaskId,
    masterTitle,
    requiresParallelGate,
    gateArtifacts,
    nextVersion: extra.nextVersion ?? null,
    prevPhaseEnd: extra.prevPhaseEnd ?? null,
    nextPhaseStart: extra.nextPhaseStart ?? null,
  };
}

export function readJson(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

export function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

/** @param {ReturnType<typeof getYoloConfig>} config */
export function loadQueue(config) {
  const queue = readJson(config.queuePath);
  if (!queue?.tasks?.length) {
    throw new Error(`Saknar kö: ${config.queuePath}`);
  }
  return queue;
}

/** @param {ReturnType<typeof getYoloConfig>} config */
export function loadState(config) {
  return (
    readJson(config.statePath) ?? {
      version: config.version,
      parallelPhase: {
        status: config.requiresParallelGate ? "in_progress" : "skipped",
        gatePassed: !config.requiresParallelGate,
        completedTaskIds: [],
      },
      sequentialPhase: {
        status: config.requiresParallelGate ? "waiting_for_gate" : "ready",
        completedTaskIds: [],
        skippedTaskIds: [],
        failedTaskIds: [],
        currentTaskId: null,
      },
      taskOrder: [],
    }
  );
}

/** @param {ReturnType<typeof getYoloConfig>} config @param {object} state */
export function saveState(config, state) {
  state.updatedAt = new Date().toISOString();
  writeJson(config.statePath, state);
}

/** @param {object} task @param {ReturnType<typeof getYoloConfig>} config */
export function readTaskPrompt(task, config) {
  const rel = task.promptFile ?? `${config.promptDir}/${task.id}.md`;
  const abs = join(root, rel);
  if (!existsSync(abs)) {
    return `# ${task.id}\n\n${task.plan}\n`;
  }
  const raw = readFileSync(abs, "utf8");
  const match = raw.match(/```[\s\S]*?```/);
  return match ? match[0].replace(/^```\n?/, "").replace(/\n?```$/, "") : raw;
}

/** @param {ReturnType<typeof getYoloConfig>} config */
export function readMasterPrompt(config) {
  if (!existsSync(config.masterPath)) return buildDefaultMasterPrompt(config);
  const raw = readFileSync(config.masterPath, "utf8");
  const match = raw.match(/```[\s\S]*?```/);
  return match ? match[0].replace(/^```\n?/, "").replace(/\n?```$/, "").trim() : raw.trim();
}

/** @param {ReturnType<typeof getYoloConfig>} config */
function buildDefaultMasterPrompt(config) {
  const queue = loadQueue(config);
  const tasks = queue.tasks.filter((t) => t.phase === "sequential");
  const lines = tasks.map(
    (t) => `- **${t.id}** (${t.agent ?? "agent"}): ${t.title} — ${t.plan}`,
  );
  return `# YOLO ${config.label} — MASTER sekventiell

Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md

Kör ALLA uppgifter sekventiellt i ordning. Efter varje uppgift: kör task-smoke, logga PASS/FAIL.

## Uppgifter
${lines.join("\n")}

## Exit
Alla icke-SKIP tasks PASS → npm run smoke:predeploy:build → kort leveransrapport i docs/evaluations/`;
}

/** @param {object} queue @param {object} state @param {ReturnType<typeof getYoloConfig>} config */
export function resolveNextTask(queue, state, config) {
  if (config.requiresParallelGate && !state.parallelPhase?.gatePassed) return null;
  for (const id of state.taskOrder ?? []) {
    if (state.sequentialPhase.completedTaskIds?.includes(id)) continue;
    if (state.sequentialPhase.skippedTaskIds?.includes(id)) continue;
    const t = queue.tasks.find((x) => x.id === id);
    if (t) return t;
  }
  return null;
}

/** @param {object} state */
export function isQueueComplete(state) {
  const total = state.taskOrder?.length ?? 0;
  const done =
    (state.sequentialPhase?.completedTaskIds?.length ?? 0) +
    (state.sequentialPhase?.skippedTaskIds?.length ?? 0);
  return total > 0 && done >= total;
}

/** @param {object} task */
export function runTaskSmoke(task) {
  const steps = [...(task.smoke ?? [])];
  if (task.fullGate) steps.push("npm run smoke:predeploy:build");
  if (steps.length === 0) return { ok: true, failedStep: null };
  for (const step of steps) {
    console.log(`[sdk:yolo] smoke → ${step}`);
    const r = spawnSync(step, { cwd: root, shell: true, stdio: "inherit" });
    if (r.status !== 0) return { ok: false, failedStep: step };
  }
  return { ok: true, failedStep: null };
}

/** @param {object} task @param {ReturnType<typeof getYoloConfig>} config */
export function buildTaskSdkPrompt(task, config) {
  const body = readTaskPrompt(task, config).trim();
  const smokeList = [...(task.smoke ?? []), ...(task.fullGate ? ["npm run smoke:predeploy:build"] : [])];
  return `${FORTIFICATION_MANDATE}

---

# Uppgift: ${task.id} — ${task.title}

**Agent:** ${task.agent ?? "generalPurpose"}
**Plan:** ${task.plan}
**PMIR:** ${task.pmir ? "JA — SKIP om inte explicit godkänt" : "nej"}
**Deploy:** ${task.deploy ?? "none"}

## Instruktion
Implementera ENDAST scope ovan. Ingen scope creep.

## Verifiering (kör innan du avslutar)
${smokeList.length ? smokeList.map((s) => `- \`${s}\``).join("\n") : "- Ingen task-smoke — rapportera vad som verifierats"}

## Rapportera
1. Vad som ändrades (kort)
2. Smoke-resultat
3. Eventuell blocker (om SKIP)

---

${body}`;
}

/** @param {ReturnType<typeof getYoloConfig>} config @param {object} queue @param {object} state */
export function buildMasterSdkPrompt(config, queue, state) {
  const remaining = (state.taskOrder ?? [])
    .filter(
      (id) =>
        !state.sequentialPhase.completedTaskIds?.includes(id) &&
        !state.sequentialPhase.skippedTaskIds?.includes(id),
    )
    .map((id) => queue.tasks.find((t) => t.id === id))
    .filter(Boolean);

  const taskBlock = remaining
    .map((t) => `- ${t.id}: ${t.title} (${t.agent ?? "agent"}) — smoke: ${(t.smoke ?? []).join(", ") || "—"}`)
    .join("\n");

  return `${FORTIFICATION_MANDATE}

---

# MASTER YOLO ${config.label} — lång sekventiell körning

Läs först: docs/PROJECT_STATE.md, docs/AI-GOVERNANCE.md, docs/governance/LOCK-MANIFEST.md

Kör **alla kvarvarande uppgifter** i ordning — en i taget, rapportera PASS/FAIL per task.

## Kvar i kö (${remaining.length})
${taskBlock || "(tom)"}

## Per uppgift
1. Implementera minimal fix
2. Kör task-smoke
3. Kort loggrad innan nästa

## Exit
Sista task PASS → \`npm run smoke:predeploy:build\` → skriv \`docs/evaluations/YYYY-MM-DD-cursor-yolo-${config.label}-leverans.md\`

---

${readMasterPrompt(config)}`;
}

/** @param {ReturnType<typeof getYoloConfig>} config @param {string} taskId @param {string} status @param {string} note */
export function logLine(config, taskId, status, note) {
  const today = new Date().toISOString().slice(0, 10);
  const logPath = join(root, "docs/evaluations", `${today}-${config.logSuffix}.md`);
  mkdirSync(dirname(logPath), { recursive: true });
  if (!existsSync(logPath)) {
    writeFileSync(
      logPath,
      `# Cursor YOLO ${config.label} log — ${today}\n\n| Tid | Task | Status | Notering |\n|-----|------|--------|----------|\n`,
      "utf8",
    );
  }
  const ts = new Date().toISOString().slice(11, 19);
  appendFileSync(logPath, `| ${ts} | ${taskId} | ${status} | ${note} |\n`, "utf8");
}

/** @param {object} meta */
export function writeSdkRunReport(meta) {
  mkdirSync(sdkRunsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = join(sdkRunsDir, `${stamp}.json`);
  writeFileSync(file, `${JSON.stringify({ at: new Date().toISOString(), ...meta }, null, 2)}\n`, "utf8");
  console.log(`[sdk:yolo] Rapport: ${file}`);
  return file;
}
