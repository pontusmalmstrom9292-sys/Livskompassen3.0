#!/usr/bin/env node
/**
 * Startar Natt-CI via @cursor/sdk (cloud agent) eller lokal fallback.
 *
 * Usage:
 *   npm run sdk:natt-ci
 *   npm run sdk:natt-ci -- --local
 *   npm run sdk:natt-ci -- --branch cursor/min-gren
 */
import { spawn } from "node:child_process";
import { Agent, CursorAgentError } from "@cursor/sdk";
import {
  root,
  REPO,
  buildSdkPrompt,
  writeRunReport,
} from "./lib/natt_ci_shared.mjs";

const args = process.argv.slice(2);
const forceLocal = args.includes("--local");
const branchArg = args.find((a) => a.startsWith("--branch="))?.split("=")[1]?.trim();

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

async function runCloudAgent(apiKey) {
  const prompt =
    buildSdkPrompt() +
    (branchArg ? `\n\nKör mot branch: ${branchArg} (git checkout före steg 1).` : "");

  console.log("SDK Natt-CI — startar cloud agent via @cursor/sdk…");
  if (branchArg) console.log(`[sdk:natt-ci] branch: ${branchArg}`);

  const agent = await Agent.create({
    apiKey,
    model: { id: "composer-2.5" },
    cloud: {
      repos: [{ url: REPO, ...(branchArg ? { branch: branchArg } : {}) }],
      skipReviewerRequest: true,
    },
  });

  try {
    const run = await agent.send(prompt);
    console.log(`[sdk:natt-ci] agentId=${agent.agentId} runId=${run.id}`);

    let text = "";
    if (run.supports("stream")) {
      for await (const event of run.stream()) {
        if (event.type === "assistant") {
          for (const block of event.message.content) {
            if (block.type === "text") {
              process.stdout.write(block.text);
              text += block.text;
            }
          }
        }
      }
    }

    const result = await run.wait();
    console.log("\n── Agent status:", result.status);

    writeRunReport(
      [{ label: "sdk:cloud-agent", ok: result.status === "finished", phase: "SDK" }],
      {
        runner: "sdk:natt-ci",
        agentId: agent.agentId,
        runId: run.id,
        branch: branchArg ?? "default",
        status: result.status,
        excerpt: text.slice(-4000),
      },
    );

    return result.status === "finished" ? 0 : 2;
  } finally {
    await agent[Symbol.asyncDispose]?.();
  }
}

async function main() {
  const apiKey = process.env.CURSOR_API_KEY?.trim();

  if (forceLocal || !apiKey) {
    if (!apiKey) {
      console.warn("[sdk:natt-ci] CURSOR_API_KEY saknas — kör lokal natt:ci.");
    }
    process.exit(await runLocalNattCi());
  }

  try {
    process.exit(await runCloudAgent(apiKey));
  } catch (err) {
    if (err instanceof CursorAgentError) {
      console.error("SDK startup failed:", err.message, "retryable=", err.isRetryable);
      console.warn("[sdk:natt-ci] Faller tillbaka till lokal natt:ci…");
      process.exit(await runLocalNattCi());
    }
    throw err;
  }
}

await main();
