/**
 * Delad logik för Natt-CI (`natt:ci`, `sdk:natt-ci`).
 */
import { spawn, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const functionsDir = path.join(root, "functions");
export const envPath = path.join(root, ".env");
export const runsDir = path.join(root, ".orkester/natt-ci-runs");
export const REPO = "https://github.com/pontusmalmstrom9292-sys/Livskompassen3.0";

export const STATIC_STEPS = [
  ["setup:env", "npm", ["run", "setup:env"], root],
  ["functions build", "npm", ["run", "build"], functionsDir],
  ["frontend build", "npm", ["run", "build"], root],
  ["smoke:predeploy", "npm", ["run", "smoke:predeploy"], root],
];

/** Extra e2e after predeploy (predeploy already includes smoke:e2e-locked-ux static gate). */
export const E2E_STEPS = [
  ["test:e2e:locked-ux", "test:e2e:locked-ux"],
  ["smoke:android-platform", "smoke:android-platform"],
];

export const LIVE_STEPS = [
  ["smoke:valv", "smoke:valv"],
  ["smoke:kunskap", "smoke:kunskap"],
  ["smoke:dossier", "smoke:dossier"],
];

/** Paths that require Pontus OK before commit/deploy (security / Locked UX / rules). */
export const PONTUS_OK_PATTERNS = [
  { re: /firestore\.rules$/, reason: "säkerhetsregler (Firestore)" },
  { re: /storage\.rules$/, reason: "säkerhetsregler (Storage)" },
  { re: /sharedRules\.ts$/, reason: "låsta AI-regler" },
  { re: /android\/app\/src\/main\/java\/com\/livskompassen\/app\/core\//, reason: "Android Sacred core" },
  { re: /SacredLock|SessionSentry|IntegrityManager|MemoryManager|SecurePrefs/, reason: "Sacred / Zero Footprint" },
  { re: /useZeroFootprint|vaultServerSession|appCheck\.ts|nativeSecureDownload/, reason: "Valv-session / App Check" },
  { re: /locked-ux|LockedUx|Barnporten|barnporten/, reason: "Locked UX" },
];

/** @param {string} label @param {string} cmd @param {string[]} args @param {string} cwd */
export function runStep(label, cmd, args, cwd = root) {
  const started = Date.now();
  return new Promise((resolve) => {
    console.log(`\n▶ ${label}`);
    const child = spawn(cmd, args, { cwd, stdio: "inherit", shell: false, env: process.env });
    child.on("close", (code) => {
      const ok = code === 0;
      console.log(ok ? `✓ ${label}` : `✗ ${label} (exit ${code})`);
      resolve({ label, ok, phase: "A", durationMs: Date.now() - started, exitCode: code ?? 1 });
    });
  });
}

/** @param {string} label @param {string} script */
export function runNpm(label, script, cwd = root) {
  const started = Date.now();
  return runStep(label, "npm", ["run", script], cwd).then((r) => ({
    ...r,
    label,
    phase: "B",
    durationMs: Date.now() - started,
  }));
}

export function readEnvFile() {
  if (!existsSync(envPath)) return {};
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

export function hasAppCheckDebugToken(env = readEnvFile()) {
  const fromFile = env.VITE_APP_CHECK_DEBUG_TOKEN?.trim();
  const fromProcess = process.env.VITE_APP_CHECK_DEBUG_TOKEN?.trim();
  return Boolean(fromFile || fromProcess);
}

export function ensureEnvFile() {
  console.log("\n▶ setup:env (uppdaterar .env från google-services + secrets)");
  try {
    execSync("node scripts/setup_env_from_google_services.mjs", { cwd: root, stdio: "inherit" });
    return existsSync(envPath);
  } catch {
    return false;
  }
}

export function ensureRootDeps() {
  if (existsSync(path.join(root, "node_modules"))) return true;
  console.log("\n▶ npm install (saknade node_modules i root)");
  try {
    execSync("npm install --legacy-peer-deps", { cwd: root, stdio: "inherit" });
    console.log("✓ npm install");
    return true;
  } catch {
    console.log("✗ npm install");
    return false;
  }
}

export function ensureFunctionsDeps() {
  if (existsSync(path.join(functionsDir, "node_modules"))) return true;
  console.log("\n▶ functions npm install (saknade node_modules)");
  try {
    execSync("npm install", { cwd: functionsDir, stdio: "inherit" });
    console.log("✓ functions npm install");
    return true;
  } catch {
    console.log("✗ functions npm install");
    return false;
  }
}

export function ensurePlaywright() {
  const marker = path.join(
    process.env.HOME ?? "/tmp",
    ".cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell",
  );
  if (existsSync(marker)) return true;
  console.log("\n▶ playwright install chromium (saknade browsers)");
  try {
    execSync("npx playwright install chromium", { cwd: root, stdio: "inherit" });
    console.log("✓ playwright install chromium");
    return true;
  } catch {
    console.log("✗ playwright install chromium");
    return false;
  }
}

/** @param {Array<{label:string,ok:boolean|null,phase:string,skipped?:boolean,durationMs?:number}>} results @param {object} meta */
export function writeRunReport(results, meta = {}) {
  mkdirSync(runsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const report = {
    at: new Date().toISOString(),
    ...meta,
    results,
    summary: {
      pass: results.filter((r) => r.ok === true).length,
      fail: results.filter((r) => r.ok === false).length,
      skip: results.filter((r) => r.skipped).length,
    },
  };
  const file = path.join(runsDir, `${stamp}.json`);
  writeFileSync(file, JSON.stringify(report, null, 2), "utf8");
  console.log(`\n[natt-ci] Rapport: ${file}`);
  return file;
}

export function printSummary(results) {
  console.log("\n── Sammanfattning ──");
  let failed = 0;
  for (const { label, ok, phase, skipped } of results) {
    if (skipped) {
      console.log(`SKIP  ${label} (fas ${phase})`);
      continue;
    }
    console.log(`${ok ? "PASS" : "FAIL"}  ${label} (fas ${phase})`);
    if (!ok) failed++;
  }
  return failed;
}

/** Dirty-tree scan — STOP for Pontus OK on security / Locked UX / Sacred. */
export function scanPontusOkGates() {
  try {
    const dirty = execSync("git status --porcelain", { cwd: root, encoding: "utf8" })
      .trim()
      .split("\n")
      .filter(Boolean);
    const hits = [];
    for (const line of dirty) {
      const file = line.slice(3).trim().replace(/^.* -> /, "");
      for (const { re, reason } of PONTUS_OK_PATTERNS) {
        if (re.test(file) || re.test(line)) {
          hits.push({ file, reason, line });
          break;
        }
      }
    }
    return { dirtyCount: dirty.length, hits };
  } catch {
    return { dirtyCount: 0, hits: [] };
  }
}

/**
 * Kort morgonrapport för säker natt-loop.
 * @param {Array<{label:string,ok:boolean|null,phase:string,skipped?:boolean}>} results
 * @param {{ git?: object, liveReady?: boolean, pontusOk?: ReturnType<typeof scanPontusOkGates>, runner?: string }} meta
 */
export function writeSecureNightMarkdown(results, meta = {}) {
  const today = new Date().toISOString().slice(0, 10);
  const evalDir = path.join(root, "docs/evaluations");
  mkdirSync(evalDir, { recursive: true });
  const reportPath = path.join(evalDir, `${today}-secure-natt.md`);

  const hardFails = results.filter(
    (r) => r.ok === false && !r.skipped && (r.phase === "A" || r.phase === "E2E"),
  );
  const liveFails = results.filter((r) => r.ok === false && !r.skipped && r.phase === "B");
  const pontus = meta.pontusOk ?? { dirtyCount: 0, hits: [] };
  const needsPontusOk = pontus.hits.length > 0;

  const lines = [
    `# Säker natt-loop — ${today}`,
    "",
    `**Kört:** ${new Date().toISOString()}`,
    `**Runner:** ${meta.runner ?? "natt:secure"}`,
    `**Git:** ${meta.git?.branch ?? "?"} @ ${meta.git?.sha ?? "?"}`,
    "",
    "## Resultat",
    "",
    "| Fas | Steg | Status |",
    "|-----|------|--------|",
  ];

  for (const r of results) {
    let status = "—";
    if (r.skipped) status = "SKIP";
    else if (r.label === "pontus-ok-scan" && r.ok === false) status = "STOP";
    else if (r.phase === "B" && r.ok === false) status = "WARN";
    else if (r.ok === true) status = "PASS";
    else if (r.ok === false) status = "FAIL";
    lines.push(`| ${r.phase} | ${r.label} | ${status} |`);
  }

  lines.push("", "## Pontus OK (stopp)", "");
  if (needsPontusOk) {
    lines.push(
      "**STOP** — osparade ändringar rör säkerhet / Locked UX / Sacred. Ingen commit eller deploy utan ditt OK.",
      "",
    );
    for (const h of pontus.hits.slice(0, 12)) {
      lines.push(`- \`${h.file}\` — ${h.reason}`);
    }
  } else {
    lines.push("Inga dirty filer i säkerhets-/Locked UX-zon (eller ren tree).");
  }

  lines.push("", "## Policy", "");
  lines.push("- Fixa **bara** tydliga låg-risk-buggar (typo, smoke-assert, import).");
  lines.push("- **Stoppa** vid säkerhet, Locked UX, firestore.rules, sharedRules, deploy.");
  lines.push("- Fas B (live) = miljö/App Check — WARN, inte merge-block.");
  lines.push("- Deploy endast efter `smoke:predeploy` PASS + yolo-vakt GO + Pontus OK.");

  lines.push("", "## Sammanfattning", "");
  if (hardFails.length > 0) {
    lines.push(`**FAIL** på ${hardFails.length} kod-gate-steg — se första felet nedan.`);
    lines.push(`- Första FAIL: **${hardFails[0].label}**`);
  } else {
    lines.push("Kod-gate (A + E2E) **PASS**.");
  }
  if (liveFails.length > 0) {
    lines.push(
      `- Fas B WARN (${liveFails.length}): live/App Check-miljö — ofta ogiltig debug-token (403).`,
    );
  }

  lines.push("", "## Nästa steg (1)", "");
  if (needsPontusOk) {
    lines.push(
      "Granska säkerhetsändringarna (App Check / Valv-session / Android core) och svara **OK att behålla** eller **revert**.",
    );
  } else if (hardFails.length > 0) {
    lines.push(`Fixa **${hardFails[0].label}** (låg-risk om möjligt) och kör ` + "`npm run natt:secure`" + " igen.");
  } else {
    lines.push("Inget akut — fortsätt G85 daily driver enligt `docs/G85-DAILY-DRIVER-CHECKLIST.md`.");
  }

  writeFileSync(reportPath, lines.join("\n") + "\n", "utf8");
  console.log(`[natt:secure] Rapport: ${reportPath}`);
  return { reportPath, needsPontusOk, fails: hardFails };
}

export function buildSdkPrompt() {
  return `Kör säker Natt-CI (natt:secure) i repo-roten. Ett steg i taget — rapportera PASS/FAIL:

Fas A (alltid):
1. npm run setup:env
2. npm install (root, om node_modules saknas)
3. cd functions && npm install (om saknas) && npm run build
4. npm run build (frontend)
5. npx playwright install chromium (om saknas)
6. npm run smoke:predeploy

Fas E2E (efter predeploy PASS eller alltid — rapportera även FAIL):
7. npm run test:e2e:locked-ux
8. npm run smoke:android-platform

Fas B (endast om VITE_APP_CHECK_DEBUG_TOKEN finns i .env eller miljö):
9. npm run smoke:valv
10. npm run smoke:kunskap
11. npm run smoke:dossier

Fas C (Pontus OK-scan):
12. git status — flagga dirty filer i Sacred core, App Check, Zero Footprint, Locked UX, firestore.rules

Regler:
- Avbryt inte Fas A vid första fel — kör alla steg och rapportera.
- Fixa BARA tydliga låg-risk-buggar. STOPPA för Pontus OK vid säkerhet/Locked UX/deploy.
- Fas B: SKIP med tydlig orsak om App Check-token saknas.
- MUST NOT: firebase deploy, merge till main, ändra firestore.rules eller sharedRules.ts.
- Avsluta med tabell: steg | fas | status | ev. felrad.`;
}
