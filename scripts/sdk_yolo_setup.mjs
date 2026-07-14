#!/usr/bin/env node
/**
 * Verifierar SDK + CURSOR_API_KEY + YOLO v14 state före lång körning.
 * Usage: npm run sdk:yolo:setup
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import { getYoloConfig, loadState, resolveNextTask, loadQueue, root } from "./lib/cursor_yolo_shared.mjs";

const require = createRequire(import.meta.url);
const version = Number(process.env.CURSOR_YOLO_VERSION ?? 14);
const config = getYoloConfig(version);

async function checkSdk() {
  try {
    await import("@cursor/sdk");
    const entry = require.resolve("@cursor/sdk");
    const pkgPath = resolve(entry, "../../../package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    return { ok: true, version: pkg.version };
  } catch {
    return { ok: false, version: null };
  }
}

async function checkApiKey() {
  const key = process.env.CURSOR_API_KEY?.trim();
  if (!key) return { ok: false, reason: "CURSOR_API_KEY saknas" };
  try {
    const { Cursor } = await import("@cursor/sdk");
    const models = await Cursor.models.list({ apiKey: key });
    return { ok: true, modelCount: models?.length ?? 0 };
  } catch (err) {
    return { ok: false, reason: err?.message ?? "API-fel" };
  }
}

async function main() {
  console.log(`[sdk:yolo:setup] version=${config?.label ?? "?"} cwd=${root}`);

  const sdk = await checkSdk();
  console.log(`[sdk:yolo:setup] @cursor/sdk: ${sdk.ok ? `v${sdk.version}` : "SAKNAS"}`);

  const api = await checkApiKey();
  if (api.ok) {
    console.log(`[sdk:yolo:setup] CURSOR_API_KEY: OK (${api.modelCount} modeller)`);
  } else if (process.env.CURSOR_API_KEY?.trim()) {
    console.warn(`[sdk:yolo:setup] CURSOR_API_KEY: ej verifierad — ${api.reason}`);
  } else {
    console.warn("[sdk:yolo:setup] CURSOR_API_KEY: saknas");
  }

  if (!config) {
    console.error("[sdk:yolo:setup] FAIL — okänd YOLO-version");
    process.exit(1);
  }

  try {
    const queue = loadQueue(config);
    const state = loadState(config);
    const next = resolveNextTask(queue, state, config);
    const done = state.sequentialPhase?.completedTaskIds?.length ?? 0;
    const total = state.taskOrder?.length ?? queue.tasks.length;
    console.log(`[sdk:yolo:setup] Kö ${config.label}: ${done}/${total} klara`);
    if (next) console.log(`[sdk:yolo:setup] Nästa: ${next.id} — ${next.title}`);
    else console.log("[sdk:yolo:setup] Kön klar eller blockerad");
  } catch (err) {
    console.warn(`[sdk:yolo:setup] Kö: ${err.message}`);
  }

  if (!sdk.ok) {
    console.error("[sdk:yolo:setup] FAIL — kör: npm install");
    process.exit(1);
  }

  console.log("\n[sdk:yolo:setup] Starta lång körning:");
  console.log("  npm run sdk:yolo -- --run        # lokal, alla kvarvarande tasks");
  console.log("  npm run sdk:yolo -- --master     # en lång MASTER-körning");
  console.log("  npm run sdk:yolo -- --dry-run    # visa prompt utan agent");
}

await main();
