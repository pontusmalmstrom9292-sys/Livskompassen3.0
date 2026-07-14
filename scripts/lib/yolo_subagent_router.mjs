/**
 * Hård resolveSubagent från .cursor/agents/ + auto-routing matris.
 * Används av sdk-cursor-yolo.mjs och smoke_sdk_subagent_routing.mjs.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { root } from "./cursor_yolo_shared.mjs";

const AGENTS_DIR = join(root, ".cursor/agents");

/** @type {Map<string, { name: string, description: string, body: string, file: string }>} */
let agentCache = null;

/** Auto-routing keyword → agent (från auto-routing.mdc) */
const ROUTING_KEYWORDS = [
  { keywords: ["widget", "MOD-WIDGET", "FyrenWidget", "android widget"], agent: "specialist-widgets" },
  { keywords: ["navigation", "drawer", "accordion", "navTruth", "flikar", "meny"], agent: "specialist-ux-guardian" },
  { keywords: ["premium", "design-debt", "Executive Midnight", "calm card"], agent: "specialist-ux-guardian" },
  { keywords: ["planering", "Fyren", "Morgonkompassen", "hybrid-widget"], agent: "specialist-planering" },
  { keywords: ["valv", "vault", "Mönster", "Orkester", "evidence"], agent: "specialist-valv-builder" },
  { keywords: ["familjen", "barnfokus", "hamn", "livslogg", "barnporten"], agent: "specialist-familjen-hamn-builder" },
  { keywords: ["integration", "innehall", "seed", "FACT", "REFLECTION", "arkiv"], agent: "livskompassen-arkiv-master" },
  { keywords: ["governance", "TODO", "PROJECT_STATE", "LOCK-MANIFEST"], agent: "specialist-beslutsstod" },
  { keywords: ["yolo-vakt", "slutgate", "GO/NO-GO"], agent: "yolo-vakt" },
  { keywords: ["ADK", "synapser", "DCAP", "journal_woven", "ingest"], agent: "specialist-adk-weaver" },
  { keywords: ["drift", "journal-2d", "hygiene"], agent: "specialist-verifier" },
  { keywords: ["evolution", "ledger"], agent: "specialist-beslutsstod" },
  { keywords: ["minne", "memory", "RAG", "dossier"], agent: "minnes-arkitekten" },
  { keywords: ["ekonomi", "veckopeng", "transactions"], agent: "specialist-ekonomi" },
  { keywords: ["dagbok", "journal", "Vävaren"], agent: "specialist-dagbok" },
  { keywords: ["firestore.rules", "storage.rules", "WORM enforcement"], agent: "specialist-firestore-rules" },
  { keywords: ["security", "Zero Footprint", "Sacred"], agent: "specialist-security-auditor" },
];

function parseAgentFile(filePath) {
  const raw = readFileSync(filePath, "utf8");
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    const base = filePath.split("/").pop().replace(/\.md$/, "");
    return { name: base, description: base, body: raw.trim(), file: filePath };
  }
  const fm = fmMatch[1];
  const body = fmMatch[2].trim();
  const name = fm.match(/^name:\s*(.+)$/m)?.[1]?.trim() ?? filePath.split("/").pop().replace(/\.md$/, "");
  const description = fm.match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? name;
  return { name, description, body, file: filePath };
}

/** @returns {Map<string, { name: string, description: string, body: string, file: string }>} */
export function loadAgentRegistry() {
  if (agentCache) return agentCache;
  agentCache = new Map();
  if (!existsSync(AGENTS_DIR)) return agentCache;

  for (const file of readdirSync(AGENTS_DIR).filter((f) => f.endsWith(".md"))) {
    const parsed = parseAgentFile(join(AGENTS_DIR, file));
    agentCache.set(parsed.name, parsed);
    const stem = file.replace(/\.md$/, "");
    if (!agentCache.has(stem)) agentCache.set(stem, parsed);
  }
  return agentCache;
}

/** @param {string} agentId */
export function resolveAgentFile(agentId) {
  const registry = loadAgentRegistry();
  const normalized = agentId?.replace(/^\//, "") ?? "";
  if (registry.has(normalized)) return registry.get(normalized);
  const withSpecialist = normalized.startsWith("specialist-") ? normalized : `specialist-${normalized}`;
  if (registry.has(withSpecialist)) return registry.get(withSpecialist);
  return null;
}

/**
 * @param {object} task — queue task { agent, title, plan, id }
 * @returns {{ agentId: string, agentFile: string | null, description: string, promptExcerpt: string, source: string }}
 */
export function resolveSubagent(task) {
  const registry = loadAgentRegistry();
  const haystack = `${task?.title ?? ""} ${task?.plan ?? ""} ${task?.id ?? ""}`.toLowerCase();

  if (task?.agent) {
    const direct = resolveAgentFile(task.agent);
    if (direct) {
      return {
        agentId: direct.name,
        agentFile: direct.file,
        description: direct.description,
        promptExcerpt: direct.body.slice(0, 800),
        source: "task.agent",
      };
    }
  }

  for (const route of ROUTING_KEYWORDS) {
    if (route.keywords.some((kw) => haystack.includes(kw.toLowerCase()))) {
      const match = resolveAgentFile(route.agent);
      if (match) {
        return {
          agentId: match.name,
          agentFile: match.file,
          description: match.description,
          promptExcerpt: match.body.slice(0, 800),
          source: "keyword-routing",
        };
      }
    }
  }

  const fallback = resolveAgentFile("yolo-vakt") ?? resolveAgentFile("orkester-conductor");
  return {
    agentId: fallback?.name ?? "yolo-vakt",
    agentFile: fallback?.file ?? null,
    description: fallback?.description ?? "Fallback agent",
    promptExcerpt: fallback?.body?.slice(0, 400) ?? "",
    source: "fallback",
  };
}

/** @param {object} task */
export function subagentPromptHint(task) {
  const resolved = resolveSubagent(task);
  return [
    `## Specialist-routing`,
    `- **Agent:** \`${resolved.agentId}\` (${resolved.source})`,
    resolved.agentFile ? `- **Kanon:** \`${resolved.agentFile.replace(root + "/", "")}\`` : "",
    `- **Scope:** ${resolved.description}`,
    "",
    resolved.promptExcerpt ? `### Agent-kanon (utdrag)\n${resolved.promptExcerpt.slice(0, 600)}…` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Rensa cache (test) */
export function clearAgentCache() {
  agentCache = null;
}

export function listRegisteredAgents() {
  return [...loadAgentRegistry().keys()].sort();
}
