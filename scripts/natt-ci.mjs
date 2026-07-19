#!/usr/bin/env node
/**
 * Säker natt-loop / merge-gate:
 *   Fas A  — build + smoke:predeploy
 *   Fas E2E — locked-ux Playwright + android-platform
 *   Fas B  — live-smokes (om App Check-token)
 *   Fas C  — Pontus OK-scan (säkerhet / Locked UX)
 *
 * Usage:
 *   npm run natt:ci
 *   npm run natt:secure
 *   npm run natt:secure -- --fail-fast
 * Cloud SDK: npm run sdk:natt-ci
 */
import { execSync } from "node:child_process";
import {
  root,
  STATIC_STEPS,
  E2E_STEPS,
  LIVE_STEPS,
  runStep,
  runNpm,
  ensureEnvFile,
  ensureRootDeps,
  ensureFunctionsDeps,
  ensurePlaywright,
  hasAppCheckDebugToken,
  writeRunReport,
  writeSecureNightMarkdown,
  scanPontusOkGates,
  printSummary,
} from "./lib/natt_ci_shared.mjs";

const args = process.argv.slice(2);
const failFast = args.includes("--fail-fast");

console.log("Säker natt-loop — start", new Date().toISOString());

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
  for (const [label, cmd, cmdArgs, cwd] of STATIC_STEPS) {
    const r = await runStep(label, cmd, cmdArgs, cwd);
    results.push({ ...r, phase: "A" });
    if (failFast && !r.ok) break;
  }
}

const predeployOk = results.some((r) => r.label === "smoke:predeploy" && r.ok === true);
const shouldRunE2e = !failFast || predeployOk || !results.some((r) => r.phase === "A" && r.ok === false);

if (shouldRunE2e) {
  console.log("\n── Fas E2E ──");
  for (const [label, script] of E2E_STEPS) {
    const r = await runNpm(label, script);
    results.push({ ...r, phase: "E2E", skipped: false });
    if (failFast && !r.ok) break;
  }
} else {
  for (const [label] of E2E_STEPS) {
    results.push({ label, ok: null, phase: "E2E", skipped: true });
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

const pontusOk = scanPontusOkGates();
console.log("\n── Fas C — Pontus OK-scan ──");
if (pontusOk.hits.length > 0) {
  console.log(`STOP — ${pontusOk.hits.length} fil(er) kräver Pontus OK:`);
  for (const h of pontusOk.hits.slice(0, 12)) {
    console.log(`  • ${h.file} (${h.reason})`);
  }
} else {
  console.log(`PASS — inga säkerhets-/Locked UX-hits (${pontusOk.dirtyCount} dirty totalt)`);
}
results.push({
  label: "pontus-ok-scan",
  ok: pontusOk.hits.length === 0,
  phase: "C",
  skipped: false,
  note: pontusOk.hits.length > 0 ? "STOP — kräver Pontus OK (inte ett kodfel)" : undefined,
});

const failed = printSummary(results);
writeRunReport(results, { runner: "natt:secure", git, liveReady, envOk, pontusOk });
const md = writeSecureNightMarkdown(results, { runner: "natt:secure", git, liveReady, pontusOk });

/**
 * Hard FAIL = Fas A / E2E only.
 * Fas B (live) = miljö/App Check — WARN, inte exit 2 (kräver ofta Console/token).
 * Fas C = Pontus OK-stopp → exit 3.
 */
const hardFails = results.filter(
  (r) =>
    r.ok === false &&
    !r.skipped &&
    (r.phase === "A" || r.phase === "E2E") &&
    r.label !== "pontus-ok-scan",
);
const liveFails = results.filter((r) => r.ok === false && !r.skipped && r.phase === "B");
if (liveFails.length > 0) {
  console.log(
    `[natt:secure] WARN Fas B (${liveFails.length}) — live/App Check-miljö, inte kod-gate`,
  );
}
if (hardFails.length > 0) {
  console.log(`[natt:secure] FAIL (${hardFails.length} steg) — rapport: ${md.reportPath}`);
  process.exit(2);
}
if (md.needsPontusOk) {
  console.log(`[natt:secure] SMOKES PASS — STOP för Pontus OK — rapport: ${md.reportPath}`);
  process.exit(3);
}
if (liveFails.length > 0) {
  console.log(`[natt:secure] PASS med Fas B-WARN — rapport: ${md.reportPath}`);
  process.exit(0);
}
console.log(`[natt:secure] PASS — rapport: ${md.reportPath}`);
process.exit(0);
