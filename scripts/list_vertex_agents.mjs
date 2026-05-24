#!/usr/bin/env node
/**
 * Jämför Vertex / Agent Builder / Agent Engine-resurser i GCP mot Livskompassen-repo.
 *
 * Usage:
 *   node scripts/list_vertex_agents.mjs
 *   node scripts/list_vertex_agents.mjs --json
 *   node scripts/list_vertex_agents.mjs --project gen-lang-client-0481875058
 *
 * Kräver: gcloud inloggad (`gcloud auth application-default login` eller user login).
 */
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'fs';
import { execSync, spawnSync } from 'child_process';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const DEFAULT_PROJECT = 'gen-lang-client-0481875058';
const PROJECT_NUMBER = '1084026575972';
const CANON_REGION = 'europe-west1';

const REASONING_REGIONS = [
  'europe-west1',
  'europe-west2',
  'europe-west4',
  'us-central1',
  'us-east1',
];

const AI_CALLABLE_HINTS = [
  'analyzeMessage',
  'knowledgeVaultQuery',
  'valvChatQuery',
  'childrenLogsQuery',
  'speglingsMirror',
  'mabraCoach',
  'breakDownResponse',
  'generateDossier',
  'weaveJournalEntry',
  'generateEmbedding',
  'getAgentRegistry',
  'previewInboxClassification',
];

function parseArgs() {
  const args = process.argv.slice(2);
  let project = process.env.GCP_PROJECT_ID || DEFAULT_PROJECT;
  let json = false;
  let writeReport = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--json') json = true;
    else if (args[i] === '--write-report') writeReport = true;
    else if (args[i] === '--project' && args[i + 1]) {
      project = args[++i];
    }
  }
  return { project, json, writeReport };
}

function sh(cmd, opts = {}) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...opts }).trim();
  } catch (e) {
    const err = e.stderr?.toString?.() || e.message;
    return { error: err };
  }
}

function getAccessToken() {
  const out = sh('gcloud auth print-access-token');
  if (typeof out === 'object' && out.error) {
    throw new Error(
      `Kunde inte hämta access token. Kör: gcloud auth login\n${out.error}`
    );
  }
  return out;
}

async function fetchJson(url, token, project) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-goog-user-project': project,
    },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = { raw: text.slice(0, 400) };
  }
  if (!res.ok) {
    return { ok: false, status: res.status, body };
  }
  return { ok: true, status: res.status, body };
}

async function listPaginated(buildUrl, token, project, collectionKey) {
  const items = [];
  let pageToken;
  for (let page = 0; page < 20; page++) {
    const sep = buildUrl().includes('?') ? '&' : '?';
    const url = pageToken ? `${buildUrl()}${sep}pageToken=${encodeURIComponent(pageToken)}` : buildUrl();
    const { ok, body } = await fetchJson(url, token, project);
    if (!ok) return { items, error: body };
    const chunk = body[collectionKey] ?? [];
    items.push(...chunk);
    pageToken = body.nextPageToken;
    if (!pageToken) break;
  }
  return { items };
}

function scanRepoAgentIds() {
  const ids = new Set();
  const patterns = [
    /id:\s*['"](agent_[a-z0-9_]+)['"]/g,
    /['"](agent_[a-z0-9_]+)['"]:\s/g,
    /(agent_[a-z0-9_]+)/g,
  ];
  const dirs = [
    join(ROOT, 'functions/src'),
    join(ROOT, 'src/modules'),
  ];

  function walkFile(path) {
    const text = readFileSync(path, 'utf8');
    for (const re of patterns) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(text))) {
        if (m[1]?.startsWith('agent_')) ids.add(m[1]);
      }
    }
  }

  function walkDir(dir) {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, name.name);
      if (name.isDirectory() && !name.name.startsWith('.') && name.name !== 'node_modules') {
        walkDir(p);
      } else if (/\.(ts|tsx)$/.test(name.name)) {
        walkFile(p);
      }
    }
  }

  for (const d of dirs) walkDir(d);

  // Filnamn som ofta missförstås (inte GCP-agent-ID)
  ids.delete('agent_engine');

  return [...ids].sort();
}

function scanRepoCallables() {
  const indexPath = join(ROOT, 'functions/src/index.ts');
  if (!existsSync(indexPath)) return [];
  const text = readFileSync(indexPath, 'utf8');
  const names = new Set();
  const re = /export const (\w+) = (?:functions|onCall)/g;
  let m;
  while ((m = re.exec(text))) names.add(m[1]);
  return [...names].sort();
}

function scanRepoGcpResourceRefs() {
  const refs = new Set();
  const re =
    /(reasoningEngines\/[a-zA-Z0-9-]+|projects\/\d+\/locations\/[^/]+\/agents\/[a-zA-Z0-9_-]+|gemini-enterprise-[a-zA-Z0-9_]+)/g;

  function walkDir(dir) {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, name.name);
      if (name.isDirectory() && !['node_modules', '.git', 'dist', 'lib'].includes(name.name)) {
        walkDir(p);
      } else if (/\.(ts|tsx|js|mjs|md)$/.test(name.name)) {
        const text = readFileSync(p, 'utf8');
        let m;
        while ((m = re.exec(text))) refs.add(m[1]);
      }
    }
  }

  walkDir(join(ROOT, 'functions'));
  walkDir(join(ROOT, 'src'));
  walkDir(join(ROOT, 'scripts'));
  return [...refs];
}

function listDeployedFunctions(project) {
  const out = sh(`firebase functions:list --project ${project} 2>/dev/null`);
  if (typeof out === 'object' && out.error) {
    return { error: out.error, names: [] };
  }
  const names = [];
  for (const line of out.split('\n')) {
    const m = line.match(/│\s+([a-zA-Z0-9_]+)\s+│/);
    if (m && m[1] !== 'Function') names.push(m[1]);
  }
  return { names: [...new Set(names)].sort() };
}

function listVectorIndexes(project, region) {
  const out = sh(
    `gcloud ai indexes list --region=${region} --project=${project} --format=json 2>/dev/null`
  );
  if (typeof out === 'object' && out.error) {
    return { error: out.error, indexes: [] };
  }
  try {
    return { indexes: JSON.parse(out || '[]') };
  } catch {
    return { indexes: [], error: 'Kunde inte parsa gcloud ai indexes list' };
  }
}

function resourceTail(name) {
  if (!name) return '';
  const parts = name.split('/');
  return parts[parts.length - 1];
}

function repoReferencesResource(resourceId, repoRefs, repoIds) {
  const tail = resourceTail(resourceId);
  if (repoRefs.some((r) => r.includes(tail) || r.includes(resourceId))) return true;
  if (repoIds.some((id) => resourceId.toLowerCase().includes(id.replace('agent_', '')))) return false;
  return false;
}

function classifyGcpResource(item, repoRefs) {
  const name = item.name || item.displayName || '';
  const tail = resourceTail(name);
  const inRepo = repoRefs.some((r) => r === tail || r === name || name.includes(r));
  return inRepo ? 'REFERENCED_IN_REPO' : 'ORPHAN_GCP';
}

async function main() {
  const { project, json, writeReport } = parseArgs();
  const token = getAccessToken();
  const repoAgentIds = scanRepoAgentIds();
  const repoCallables = scanRepoCallables();
  const repoGcpRefs = scanRepoGcpResourceRefs();
  const deployed = listDeployedFunctions(project);
  const vectorWest1 = listVectorIndexes(project, CANON_REGION);

  const report = {
    generatedAt: new Date().toISOString(),
    project,
    projectNumber: PROJECT_NUMBER,
    repo: {
      agentIds: repoAgentIds,
      callables: repoCallables,
      gcpResourceRefs: repoGcpRefs,
    },
    gcp: {
      reasoningEngines: [],
      vertexAgentsGlobal: [],
      discoveryEngines: [],
      discoveryDataStores: [],
      cachedContents: [],
      vectorIndexes: vectorWest1.indexes ?? [],
    },
    deployedFunctions: deployed.names ?? [],
    summary: {},
    notes: [],
  };

  // Reasoning Engines (Agent Engine runtime)
  for (const region of REASONING_REGIONS) {
    const url = `https://${region}-aiplatform.googleapis.com/v1/projects/${project}/locations/${region}/reasoningEngines`;
    const { items, error } = await listPaginated(() => url, token, project, 'reasoningEngines');
    if (error) {
      report.notes.push(`reasoningEngines@${region}: ${JSON.stringify(error).slice(0, 200)}`);
      continue;
    }
    for (const item of items) {
      report.gcp.reasoningEngines.push({
        region,
        name: item.name,
        displayName: item.displayName,
        createTime: item.createTime,
        status: classifyGcpResource(item, repoGcpRefs),
      });
    }
  }

  // Vertex Agent Service (global — Agent Builder / Gemini Enterprise console)
  {
    const url = `https://aiplatform.googleapis.com/v1beta1/projects/${project}/locations/global/agents`;
    const { items, error } = await listPaginated(() => url, token, project, 'agents');
    if (error) {
      report.notes.push(`agents@global: ${JSON.stringify(error).slice(0, 200)}`);
    } else {
      for (const item of items) {
        report.gcp.vertexAgentsGlobal.push({
          name: item.name,
          displayName: item.displayName,
          description: item.description?.slice?.(0, 120),
          status: classifyGcpResource(item, repoGcpRefs),
        });
      }
    }
  }

  // Discovery Engine (legacy Agent Builder / Search apps)
  {
    const base = `https://discoveryengine.googleapis.com/v1alpha/projects/${PROJECT_NUMBER}/locations/global/collections/default_collection`;
    const engines = await listPaginated(
      () => `${base}/engines`,
      token,
      project,
      'engines'
    );
    if (engines.error) {
      report.notes.push(`discovery engines: ${JSON.stringify(engines.error).slice(0, 200)}`);
    } else {
      for (const item of engines.items) {
        const tail = resourceTail(item.name);
        report.gcp.discoveryEngines.push({
          name: item.name,
          displayName: item.displayName,
          solutionType: item.solutionType,
          createTime: item.createTime,
          status: repoGcpRefs.some((r) => item.name.includes(r) || r.includes(tail))
            ? 'REFERENCED_IN_REPO'
            : 'ORPHAN_GCP',
        });
      }
    }

    const stores = await listPaginated(
      () => `${base}/dataStores`,
      token,
      project,
      'dataStores'
    );
    if (!stores.error) {
      for (const item of stores.items) {
        report.gcp.discoveryDataStores.push({
          name: item.name,
          displayName: item.displayName,
          status: classifyGcpResource(item, repoGcpRefs),
        });
      }
    }
  }

  // Context caches (Vertex)
  {
    const url = `https://${CANON_REGION}-aiplatform.googleapis.com/v1/projects/${project}/locations/${CANON_REGION}/cachedContents`;
    const { items, error } = await listPaginated(() => url, token, project, 'cachedContents');
    if (!error) {
      for (const item of items) {
        report.gcp.cachedContents.push({
          name: item.name,
          displayName: item.displayName,
          expireTime: item.expireTime,
          status: 'RUNTIME_CACHE',
        });
      }
    }
  }

  const gcpAgentLike = [
    ...report.gcp.reasoningEngines,
    ...report.gcp.vertexAgentsGlobal,
  ];
  const orphanGcp = gcpAgentLike.filter((x) => x.status === 'ORPHAN_GCP');
  const aiCallablesDeployed = (deployed.names ?? []).filter((n) =>
    AI_CALLABLE_HINTS.includes(n) || /Query|analyze|Coach|Mirror|Dossier|Embedding/i.test(n)
  );

  report.summary = {
    repoAgentIdCount: repoAgentIds.length,
    deployedFunctionCount: deployed.names?.length ?? 0,
    aiCallableDeployedCount: aiCallablesDeployed.length,
    reasoningEngineCount: report.gcp.reasoningEngines.length,
    vertexGlobalAgentCount: report.gcp.vertexAgentsGlobal.length,
    discoveryEngineCount: report.gcp.discoveryEngines.length,
    orphanGcpAgentCount: orphanGcp.length,
    repoGcpRefCount: repoGcpRefs.length,
    vectorIndexCount: report.gcp.vectorIndexes.length,
  };

  if (
    report.gcp.reasoningEngines.length === 0 &&
    report.gcp.vertexAgentsGlobal.length === 0
  ) {
    report.notes.push(
      'Inga deployade Reasoning Engines eller globala Vertex-agenter hittades via API. Agenter du ser i Vertex AI Studio / Agent Designer kan vara utkast (console-only) tills de deployas till Agent Engine.'
    );
  }

  if (writeReport) {
    const outPath = join(ROOT, 'docs/vertex-agent-audit.latest.json');
    writeFileSync(outPath, JSON.stringify(report, null, 2));
    if (!json) console.log(`\nRapport sparad: ${outPath}`);
  }

  if (json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  const line = '─'.repeat(72);
  console.log(line);
  console.log('Livskompassen — Vertex / agent-audit');
  console.log(`Projekt: ${project}  ·  ${report.generatedAt}`);
  console.log(line);

  console.log('\n## 1. Det appen faktiskt kör (Firebase Functions, europe-west1)');
  if (deployed.error) {
    console.log(`  ⚠ firebase functions:list: ${deployed.error.slice(0, 120)}`);
  } else {
    console.log(`  Deployade: ${deployed.names.length} funktioner`);
    console.log('  AI-relaterade callables:');
    for (const n of aiCallablesDeployed) console.log(`    ✓ ${n}  [IN_DRIFT]`);
  }

  console.log('\n## 2. Agenter definierade i kod (repo) — IN_DRIFT via Functions + sharedRules');
  console.log(`  ${repoAgentIds.length} agent_*-ID:n:`);
  for (const id of repoAgentIds) console.log(`    · ${id}`);

  console.log('\n## 3. GCP — Agent Engine (reasoningEngines)');
  if (report.gcp.reasoningEngines.length === 0) {
    console.log('  (inga deployade)');
  } else {
    for (const r of report.gcp.reasoningEngines) {
      console.log(`    [${r.status}] ${r.displayName || resourceTail(r.name)} @ ${r.region}`);
      console.log(`           ${r.name}`);
    }
  }

  console.log('\n## 4. GCP — Vertex agents (global, Agent Builder API)');
  if (report.gcp.vertexAgentsGlobal.length === 0) {
    console.log('  (inga via API — konsol-utkast syns ofta inte här)');
  } else {
    for (const a of report.gcp.vertexAgentsGlobal) {
      console.log(`    [${a.status}] ${a.displayName || resourceTail(a.name)}`);
      console.log(`           ${a.name}`);
    }
  }

  console.log('\n## 5. GCP — Discovery Engine (Agent Builder / Search)');
  if (report.gcp.discoveryEngines.length === 0) {
    console.log('  (inga engines)');
  } else {
    for (const e of report.gcp.discoveryEngines) {
      console.log(`    [${e.status}] ${e.displayName} (${e.solutionType})`);
      console.log(`           ${e.name}`);
    }
  }
  if (report.gcp.discoveryDataStores.length > 0) {
    console.log('  Data stores:');
    for (const d of report.gcp.discoveryDataStores) {
      console.log(`    [${d.status}] ${d.displayName || resourceTail(d.name)}`);
    }
  }

  console.log('\n## 6. Vector Search (RAG i drift)');
  if (vectorWest1.error) {
    console.log(`  ⚠ ${vectorWest1.error.slice(0, 100)}`);
  } else {
    for (const idx of report.gcp.vectorIndexes) {
      const id = resourceTail(idx.name);
      const inRepo =
        repoGcpRefs.some((r) => r.includes(id)) ||
        existsSync(join(ROOT, 'functions/src/lib/vectorSearchClient.ts'));
      console.log(
        `    [${inRepo ? 'WIRED_REPO' : 'ORPHAN_GCP'}] ${idx.displayName || id}  (${idx.indexUpdateMethod || '?'})`
      );
    }
  }

  console.log('\n## 7. Repo-referenser till GCP agent-resurs-ID');
  if (repoGcpRefs.length === 0) {
    console.log('  (inga reasoningEngine/agent-resursnamn hårdkodade i repo)');
  } else {
    for (const r of repoGcpRefs) console.log(`    · ${r}`);
  }

  console.log('\n## Slutsats');
  console.log(
    `  · Prod-orkester = Cloud Functions + kod-agenter (${repoAgentIds.length} roller), inte Vertex Console-listan.`
  );
  console.log(
    `  · Deployade Reasoning Engines: ${report.gcp.reasoningEngines.length}  ·  Globala Vertex-agenter (API): ${report.gcp.vertexAgentsGlobal.length}`
  );
  if (orphanGcp.length > 0) {
    console.log(`  · ${orphanGcp.length} GCP-agentresurs(er) utan repo-koppling — kan vara experiment att städa.`);
  } else if (
    report.gcp.reasoningEngines.length === 0 &&
    report.gcp.vertexAgentsGlobal.length === 0
  ) {
    console.log(
      '  · Dina många agenter i konsolen är troligen utkast i Studio — appen använder dem inte förrän resurs-ID finns i repo + deploy.'
    );
  }

  if (report.notes.length) {
    console.log('\n  Noteringar:');
    for (const n of report.notes) console.log(`    - ${n}`);
  }

  console.log(`\n${line}`);
  console.log('Kör igen med --json eller --write-report för maskinläsbar output.');
  console.log(line);
}

main().catch((err) => {
  console.error('[list_vertex_agents]', err.message || err);
  process.exit(1);
});
