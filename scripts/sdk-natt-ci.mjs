#!/usr/bin/env node
/**
 * Startar Natt-CI via @cursor/sdk (cloud agent).
 * Lokal körning: npm run natt:ci
 */
import { Agent, CursorAgentError } from "@cursor/sdk";

const REPO = "https://github.com/pontusmalmstrom9292-sys/Livskompassen3.0";

const PROMPT = `Kör Natt-CI i repo-roten. Ett steg i taget — rapportera PASS/FAIL:

Fas A (alltid):
1. cd functions && npm install (om node_modules saknas) && npm run build
2. npm run build (frontend)
3. npm run smoke:predeploy

Fas B (endast om .env finns):
4. npm run smoke:valv
5. npm run smoke:kunskap
6. npm run smoke:dossier

Avsluta med tabell: steg | fas | status | ev. felrad.`;

const apiKey = process.env.CURSOR_API_KEY?.trim();
if (!apiKey) {
  console.error("CURSOR_API_KEY saknas — sätt nyckel från Cursor Dashboard → Integrations");
  process.exit(1);
}

console.log("SDK Natt-CI — startar cloud agent…");

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
    process.exit(1);
  }
  throw err;
}
