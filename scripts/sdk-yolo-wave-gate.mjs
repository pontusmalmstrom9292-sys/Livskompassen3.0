#!/usr/bin/env node
/**
 * Per-våg gate: build → static smoke → smoke:e2e-live (full).
 *
 * Usage:
 *   node scripts/sdk-yolo-wave-gate.mjs --version=35
 *   node scripts/sdk-yolo-wave-gate.mjs --version=35 --gate=static
 *   node scripts/sdk-yolo-wave-gate.mjs --version=35 --gate=build
 *
 * Gates:
 *   build  — npm run build only
 *   static — smoke:governance + wave smokes from manifest
 *   full   — build + static + smoke:e2e-live (default)
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from "node:url";
import { buildWaveSmokeList, getBuildWaveDef, BUILD_WAVE_MIN, BUILD_WAVE_MAX } from "./lib/cursor_yolo_build.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

function parseArg(name, fallback) {
  const eq = args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
  return eq ?? fallback;
}

const version = Number(parseArg("version", process.env.CURSOR_YOLO_VERSION ?? "34"));
const gate = parseArg("gate", process.env.SDK_YOLO_WAVE_GATE ?? "full");

function runStep(label, cmd) {
  console.log(`[wave-gate] ▶ ${label}`);
  const r = spawnSync(cmd, { cwd: root, shell: true, stdio: "inherit" });
  if (r.status !== 0) {
    console.error(`[wave-gate] FAIL — ${label}`);
    process.exit(r.status ?? 1);
  }
}

async function main() {
  if (version < BUILD_WAVE_MIN || version > BUILD_WAVE_MAX) {
    console.error(`[wave-gate] v${version} är inte build wave (${BUILD_WAVE_MIN}–${BUILD_WAVE_MAX})`);
    process.exit(1);
  }

  const wave = getBuildWaveDef(version);
  console.log(`[wave-gate] v${version} ${wave.id} — gate=${gate}`);

  if (gate === "build" || gate === "full") {
    runStep("build", "npm run build");
  }

  if (gate === "static" || gate === "full") {
    runStep("governance", "npm run smoke:governance");
    const smokes = buildWaveSmokeList(version).filter((s) => !s.includes("e2e-live"));
    for (const step of smokes) {
      runStep(step, step);
    }
  }

  if (gate === "full") {
    const wantsE2e = (wave.smoke ?? []).some((s) => s.includes("e2e-live"));
    if (wantsE2e) {
      runStep("e2e-live", "npm run smoke:e2e-live");
    } else {
      console.log("[wave-gate] Hoppar e2e-live — ingår inte i vågens manifest-smoke");
    }
  }

  console.log(`[wave-gate] ✓ v${version} PASS (${gate})`);
}

await main();
