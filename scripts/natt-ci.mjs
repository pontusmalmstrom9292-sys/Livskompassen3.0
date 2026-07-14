#!/usr/bin/env node
/**
 * Natt-CI — merge-gate + valfria live-smokes.
 * Cloud SDK: npm run sdk:natt-ci
 */
import { execSync } from "node:child_process";
import {
  root,
  STATIC_STEPS,
  LIVE_STEPS,
  runStep,
  runNpm,
  ensureEnvFile,
  ensureRootDeps,
  ensureFunctionsDeps,
  ensurePlaywright,
  hasAppCheckDebugToken,
  writeRunReport,
  printSummary,
} from "./lib/natt_ci_shared.mjs";

const args = process.argv.slice(2);
const failFast = args.includes("--fail-fast");

console.log("Natt-CI — start", new Date().toISOString());

const git = (() => {
  try {
    return {
      branch: execSync("git rev-parse --abbrev-ref HEAD", { cwd: root, encoding: "utf8" }).trim(),
      sha: execSync("git rev-parse --short HEAD", { cwd: root, encoding: "utf8" }).trim(),
    };
  } catch {
    return { branch: "unknown", sha: "unknown" };
  }
})();

const results = [];

if (!ensureRootDeps()) {
  results.push({ label: "npm install", ok: false, phase: "A", skipped: false });
} else if (!ensureFunctionsDeps()) {
  results.push({ label: "functions npm install", ok: false, phase: "A", skipped: false });
} else if (!ensurePlaywright()) {
  results.push({ label: "playwright install chromium", ok: false, phase: "A", skipped: false });
} else {
  for (const [label, cmd, args, cwd] of STATIC_STEPS) {
    const r = await runStep(label, cmd, args, cwd);
    results.push({ ...r, phase: "A" });
    if (failFast && !r.ok) break;
  }
}

const envOk = ensureEnvFile();
const liveReady = envOk && hasAppCheckDebugToken();

if (!envOk) {
  console.log("Fas B: SKIP — kunde inte skapa/uppdatera .env");
} else if (!liveReady) {
  console.log("Fas B: SKIP — VITE_APP_CHECK_DEBUG_TOKEN saknas (lägg i Cursor Cloud Secrets)");
} else {
  console.log("Fas B: App Check-token hittad — kör live-smokes");
  for (const [label, script] of LIVE_STEPS) {
    const r = await runNpm(label, script);
    results.push({ ...r, skipped: false });
    if (failFast && !r.ok) break;
  }
}

if (!liveReady) {
  for (const [label] of LIVE_STEPS) {
    results.push({ label, ok: null, phase: "B", skipped: true });
  }
}

const failed = printSummary(results);
writeRunReport(results, { runner: "natt:ci", git, liveReady, envOk });
process.exit(failed > 0 ? 2 : 0);
