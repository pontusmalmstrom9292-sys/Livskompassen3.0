#!/usr/bin/env node
/**
 * Startar Natt-CI via @cursor/sdk (cloud agent) eller lokal fallback.
 * Lokal körning: npm run natt:ci
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { Agent, CursorAgentError } from "@cursor/sdk";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO = "https://github.com/pontusmalmstrom9292-sys/Livskompassen3.0";

const PROMPT = `Kör Natt-CI i repo-roten. Ett steg i taget — rapportera PASS/FAIL:

Fas A (alltid):
1. npm run setup:env
2. cd functions && npm install (om node_modules saknas) && npm run build
3. npm run build (frontend)
4. npx playwright install chromium (om saknas)
5. npm run smoke:predeploy

Fas B (endast om .env har VITE_APP_CHECK_DEBUG_TOKEN):
6. npm run smoke:valv
7. npm run smoke:kunskap
8. npm run smoke:dossier

Avsluta med tabell: steg | fas | status | ev. felrad.`;

function runLocalNattCi() {
  return new Promise((resolve) => {
    console.log("SDK Natt-CI — lokal fallback (npm run natt:ci)…");
    const child = spawn("npm", ["run", "natt:ci"], {
      cwd: root,
      stdio: "inherit",
      shell: false,
      env: process.env,
    });
    child.on("close", (code) => resolve(code ?? 1));
  });
}

const apiKey = process.env.CURSOR_API_KEY?.trim();
if (!apiKey) {
  console.warn("[sdk:natt-ci] CURSOR_API_KEY saknas — kör lokal natt:ci i denna cloud-agent.");
  process.exit(await runLocalNattCi());
}

console.log("SDK Natt-CI — startar cloud agent via @cursor/sdk…");

try {
  const result = await Agent.prompt(PROMPT, {
    apiKey,
    model: { id: "composer-2.5" },
    cloud: {
      repos: [{ url: REPO }],
      skipReviewerRequest: true,
    },
  });

  console.log("\n── Agent status:", result.status);
  if (result.result) console.log(result.result);
  if (result.agentId) console.log("Agent ID:", result.agentId);

  process.exit(result.status === "finished" ? 0 : 2);
} catch (err) {
  if (err instanceof CursorAgentError) {
    console.error("SDK startup failed:", err.message, "retryable=", err.isRetryable);
    console.warn("[sdk:natt-ci] Faller tillbaka till lokal natt:ci…");
    process.exit(await runLocalNattCi());
  }
  throw err;
}
