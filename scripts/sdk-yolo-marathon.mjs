#!/usr/bin/env node
/**
 * Kör flera YOLO-vågor i rad via SDK (v15 → v16 → v17 …).
 * Fortifikation: stoppar vid FAIL — rivs inte fungerande kod.
 *
 * Usage:
 *   npm run sdk:yolo:marathon
 *   npm run sdk:yolo:marathon -- --from=15 --waves=3
 *
 * Env:
 *   CURSOR_YOLO_VERSION=15   startvåg (default 15)
 *   SDK_YOLO_MAX_WAVES=3     antal vågar i rad (default 3)
 *
 * Mac — håll datorn vaken medan du är borta:
 *   caffeinate -dimsu npm run sdk:yolo:marathon
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadCursorApiKey, cursorApiKeyHint } from "./lib/load_cursor_api_key.mjs";
import {
  getYoloConfig,
  ensureFortificationWave,
  ensureBuildWaveScaffold,
  writeSdkRunReport,
  isQueueComplete,
  loadState,
  BUILD_WAVE_MIN,
  BUILD_WAVE_MAX,
} from "./lib/cursor_yolo_shared.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

function parseArg(name, fallback) {
  const eq = args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
  if (eq !== undefined && eq !== "") return eq;
  const idx = args.indexOf(`--${name}`);
  if (idx >= 0 && args[idx + 1] && !args[idx + 1].startsWith("--")) return args[idx + 1];
  return fallback;
}

const fromArg = parseArg("from", process.env.CURSOR_YOLO_VERSION ?? "15");
const wavesArg = parseArg("waves", process.env.SDK_YOLO_MAX_WAVES ?? "3");

const startVersion = Number(fromArg);
const maxWaves = Number(wavesArg);

function runWave(version) {
  return (
    spawnSync(process.execPath, ["scripts/sdk-cursor-yolo.mjs", "--run", `--version=${version}`], {
      cwd: root,
      stdio: "inherit",
      env: process.env,
    }).status ?? 1
  );
}

async function main() {
  const keyInfo = loadCursorApiKey();
  if (!keyInfo.key) {
    console.error("[sdk:marathon] CURSOR_API_KEY saknas.");
    console.error(cursorApiKeyHint());
    process.exit(1);
  }
  if (keyInfo.source !== "process.env") {
    console.log(`[sdk:marathon] CURSOR_API_KEY från ${keyInfo.source}`);
  }

  console.log(`[sdk:marathon] Start v${startVersion} → ${maxWaves} våg(ar)`);
  console.log("[sdk:marathon] Låt terminalen + Cursor vara öppna. Stäng inte Mac helt.");

  const marathon = {
    runner: "sdk:marathon",
    startVersion,
    maxWaves,
    startedAt: new Date().toISOString(),
    waves: [],
  };

  for (let i = 0; i < maxWaves; i++) {
    const version = startVersion + i;
    const config = getYoloConfig(version);
    if (!config) {
      console.error(`[sdk:marathon] Ingen config för v${version} — stoppar.`);
      break;
    }

    if (version >= 15 && version < BUILD_WAVE_MIN) ensureFortificationWave(version);
    if (version >= BUILD_WAVE_MIN && version <= BUILD_WAVE_MAX) await ensureBuildWaveScaffold(version);

    const state = loadState(config);
    if (isQueueComplete(state)) {
      console.log(`[sdk:marathon] v${version} redan klar — hoppar till nästa.`);
      marathon.waves.push({ version, exitCode: 0, skipped: true, reason: "already-complete" });
      continue;
    }

    console.log("");
    console.log("══════════════════════════════════════════════════");
    console.log(`  MARATHON våg ${i + 1}/${maxWaves} — YOLO v${version}`);
    console.log("══════════════════════════════════════════════════");
    console.log("");

    const code = runWave(version);
    marathon.waves.push({ version, exitCode: code });

    if (code !== 0) {
      console.error(`[sdk:marathon] STOP — v${version} exit ${code}`);
      writeSdkRunReport({ ...marathon, stopped: true });
      process.exit(code);
    }

    if (i < maxWaves - 1) {
      const next = version + 1;
      if (getYoloConfig(next)) {
        if (next >= 15 && next < BUILD_WAVE_MIN) ensureFortificationWave(next);
        if (next >= BUILD_WAVE_MIN && next <= BUILD_WAVE_MAX) await ensureBuildWaveScaffold(next);
      }
    }
  }

  writeSdkRunReport({ ...marathon, completed: true });
  console.log("[sdk:marathon] 🎉 Marathon klart (eller alla vågar i kön färdiga).");
}

await main();
