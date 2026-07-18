#!/usr/bin/env node
/**
 * Offline assert: improvement-wave machine integrity.
 * npm run smoke:wave-machine
 */
import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadBuildManifest, BUILD_WAVE_MIN, BUILD_WAVE_MAX } from "./lib/cursor_yolo_build.mjs";
import { IMPROVEMENT_WAVE_MIN, WAVE_MACHINE_STATE_PATH, PMIR_REGISTER_PATH } from "./lib/wave_machine.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failed = 0;

function ok(msg) {
  console.log(`[smoke:wave-machine] ✓ ${msg}`);
}
function fail(msg) {
  console.error(`[smoke:wave-machine] FAIL — ${msg}`);
  failed += 1;
}

const manifest = loadBuildManifest();
if (!manifest?.waves?.length) fail("cursor-yolo-build-manifest.json saknar waves");
else ok(`manifest ${manifest.waves.length} waves`);

const versions = (manifest.waves ?? []).map((w) => w.version).sort((a, b) => a - b);
const min = Math.min(...versions);
const max = Math.max(...versions);
if (min !== BUILD_WAVE_MIN) fail(`manifest min ${min} ≠ BUILD_WAVE_MIN ${BUILD_WAVE_MIN}`);
else ok(`BUILD_WAVE_MIN=${BUILD_WAVE_MIN}`);
if (max !== BUILD_WAVE_MAX) fail(`manifest max ${max} ≠ BUILD_WAVE_MAX ${BUILD_WAVE_MAX}`);
else ok(`BUILD_WAVE_MAX=${BUILD_WAVE_MAX}`);

const improvement = (manifest.waves ?? []).filter((w) => w.version >= IMPROVEMENT_WAVE_MIN);
if (improvement.length < 6) fail(`förväntade ≥6 improvement waves (v49–v54), fick ${improvement.length}`);
else ok(`${improvement.length} improvement waves (≥v${IMPROVEMENT_WAVE_MIN})`);

for (const w of improvement) {
  if (!w.id || !w.agent || !w.plan) fail(`v${w.version} saknar id/agent/plan`);
  if (!Array.isArray(w.smoke) || w.smoke.length === 0) fail(`v${w.version} saknar smoke[]`);
}

const requiredIds = [
  "SOFT-DEBT",
  "ZONE-VALV-HJARTAT-FINISH",
  "ZONE-VARDAGEN-FAMILJEN-FINISH",
  "BACKEND-HARDEN",
  "UX-POLISH-ANDROID-SYNC",
  "SLUTGATE-FARDIG",
  "MINNE-G0-MACHINE",
  "MINNE-M1-RRF",
  "MINNE-M2-EMBED",
  "MINNE-M3-GATES",
  "MINNE-M4-ARCHIVE",
  "MINNE-GATE",
  "MINNE-RULES",
  "MINNE-DEPLOY",
];
for (const id of requiredIds) {
  if (!improvement.some((w) => w.id === id)) fail(`saknar wave id ${id}`);
  else ok(`wave ${id}`);
}

const minneWaves = improvement.filter((w) => w.version >= 55);
for (const w of minneWaves) {
  if (!w.class || !["docs", "code", "rules", "ingest", "deploy"].includes(w.class)) {
    fail(`v${w.version} saknar giltig class`);
  } else ok(`v${w.version} class=${w.class}`);
}

if (!existsSync(PMIR_REGISTER_PATH)) fail("sdk-pmir-register.json saknas");
else {
  try {
    JSON.parse(readFileSync(PMIR_REGISTER_PATH, "utf8"));
    ok("sdk-pmir-register.json giltig JSON");
  } catch (e) {
    fail(`sdk-pmir-register.json: ${e.message}`);
  }
}

if (!existsSync(WAVE_MACHINE_STATE_PATH)) {
  fail("wave-machine-state.json saknas — kör waves:autorun --dry-run en gång");
} else {
  try {
    const st = JSON.parse(readFileSync(WAVE_MACHINE_STATE_PATH, "utf8"));
    if (st.machine !== "improvement-waves") fail("wave-machine-state.machine fel");
    else ok("wave-machine-state.json OK");
  } catch (e) {
    fail(`wave-machine-state.json: ${e.message}`);
  }
}

const docs = join(root, "docs/IMPROVEMENT-WAVES-AUTORUN.md");
if (!existsSync(docs)) fail("docs/IMPROVEMENT-WAVES-AUTORUN.md saknas");
else ok("IMPROVEMENT-WAVES-AUTORUN.md");

const wrapper = join(root, "scripts/waves_autorun.mjs");
if (!existsSync(wrapper)) fail("scripts/waves_autorun.mjs saknas");
else ok("waves_autorun.mjs");

if (failed > 0) {
  console.error(`[smoke:wave-machine] ${failed} fel`);
  process.exit(1);
}
console.log("[smoke:wave-machine] PASS");
