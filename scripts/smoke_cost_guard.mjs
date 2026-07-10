#!/usr/bin/env node
/**
 * Static smoke: GCP kostnadsvakt — blockerar dyra tjänster i kod och konfig.
 * Usage: npm run smoke:cost-guard
 *
 * Gratis, offline. Ingen gcloud krävs.
 * Live API-audit: npm run gcp:audit-apis
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const MANIFEST_PATH = join(ROOT, 'infra/gcp/cost-guard/manifest.json');
const OVERRIDES_PATH = join(ROOT, 'infra/gcp/cost-guard/overrides.json');

const SCAN_DIRS = [
  'functions/src',
  'scripts',
  'src',
  'infra',
];

const SCAN_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.json', '.yaml', '.yml']);

const SKIP_PATH_FRAGMENTS = [
  'node_modules',
  '/lib/functions/',
  'smoke_cost_guard.mjs',
  'gcp_audit_enabled_apis.mjs',
  'list_vertex_agents.mjs',
  'manifest.json',
  'overrides.json',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function loadJson(path) {
  assert(existsSync(path), `saknar fil: ${relative(ROOT, path)}`);
  return JSON.parse(readFileSync(path, 'utf8'));
}

function walkFiles(dir, out = []) {
  const full = join(ROOT, dir);
  if (!existsSync(full)) return out;
  for (const entry of readdirSync(full)) {
    const p = join(full, entry);
    const rel = relative(ROOT, p);
    if (SKIP_PATH_FRAGMENTS.some((s) => rel.includes(s))) continue;
    const st = statSync(p);
    if (st.isDirectory()) walkFiles(rel, out);
    else if (SCAN_EXTENSIONS.has(rel.slice(rel.lastIndexOf('.')))) out.push(p);
  }
  return out;
}

function parseMemoryMiB(text) {
  const matches = [...text.matchAll(/memory:\s*['"](\d+)(MiB|MB|GiB|GB)['"]/gi)];
  return matches.map((m) => {
    const n = Number.parseInt(m[1], 10);
    const unit = m[2].toLowerCase();
    if (unit.startsWith('g')) return n * 1024;
    return n;
  });
}

function main() {
  console.log('[smoke:cost-guard] Kostnadsvakt — statisk granskning…');

  const manifest = loadJson(MANIFEST_PATH);
  const overrides = existsSync(OVERRIDES_PATH) ? loadJson(OVERRIDES_PATH) : { npmDependencies: [], importPatterns: [] };
  const errors = [];

  // 1) Manifest måste finnas och vara låst
  assert(manifest.version >= 1, 'manifest.version saknas');
  assert(manifest.projectId === 'gen-lang-client-0481875058', 'manifest.projectId fel');

  // 2) Förbjudna npm-deps i functions/package.json
  const fnPkg = loadJson(join(ROOT, 'functions/package.json'));
  const deps = { ...fnPkg.dependencies, ...fnPkg.devDependencies };
  for (const dep of manifest.blockedNpmDependencies) {
    if (deps[dep] && !overrides.npmDependencies?.includes(dep)) {
      errors.push(`functions/package.json innehåller blockerad dependency "${dep}" — ta bort eller lägg PMIR-override`);
    }
  }

  // 3) genaiClient ska använda GEMINI_API_KEY (inte Vertex SDK)
  const genai = readFileSync(join(ROOT, 'functions/src/lib/genaiClient.ts'), 'utf8');
  if (!genai.includes('GEMINI_API_KEY')) {
    errors.push('functions/src/lib/genaiClient.ts saknar GEMINI_API_KEY-krav');
  }
  if (genai.includes('@google-cloud/vertexai') || genai.includes('VertexAI')) {
    errors.push('genaiClient.ts får inte importera Vertex SDK — använd @google/genai');
  }

  // 4) modelRouter — flash default, pro kräver nyckelord
  const modelRouter = readFileSync(join(ROOT, 'functions/src/lib/modelRouter.ts'), 'utf8');
  assert(modelRouter.includes('autoSelectTier'), 'modelRouter.ts saknar autoSelectTier');
  assert(modelRouter.includes("return 'flash'"), 'modelRouter måste defaulta till flash');

  // 5) Skanna källkod efter blockerade importmönster
  const files = SCAN_DIRS.flatMap((d) => walkFiles(d));
  for (const file of files) {
    const rel = relative(ROOT, file);
    const text = readFileSync(file, 'utf8');
    for (const pattern of manifest.blockedImportPatterns) {
      if (overrides.importPatterns?.some((o) => o.file === rel && o.pattern === pattern)) continue;
      if (text.includes(pattern)) {
        errors.push(`${rel} innehåller blockerat mönster "${pattern}"`);
      }
    }

    // minInstances / always-on
    for (const key of manifest.functionsLimits.forbiddenRunWithKeys) {
      if (new RegExp(`${key}\\s*:`).test(text)) {
        errors.push(`${rel} innehåller förbjudet "${key}" — skala-till-noll krävs`);
      }
    }

    // Minnesgräns för functions
    if (rel.startsWith('functions/src/') && rel.endsWith('.ts')) {
      const mems = parseMemoryMiB(text);
      const allowed = manifest.functionsLimits.maxMemoryExceptions.includes(rel);
      for (const mem of mems) {
        if (mem > manifest.functionsLimits.maxMemoryMiB && !allowed) {
          errors.push(`${rel} memory ${mem}MiB > max ${manifest.functionsLimits.maxMemoryMiB}MiB`);
        }
      }
    }
  }

  // 6) costTracker + monitoring + costCapGuard ska finnas
  assert(existsSync(join(ROOT, 'functions/src/lib/costTracker.ts')), 'saknar costTracker.ts');
  assert(existsSync(join(ROOT, 'functions/src/lib/costCapGuard.ts')), 'saknar costCapGuard.ts');
  assert(existsSync(join(ROOT, 'functions/src/lib/monitoring.ts')), 'saknar monitoring.ts');

  // 7) Regel + doc ska finnas
  assert(existsSync(join(ROOT, '.cursor/rules/cost-guard.mdc')), 'saknar .cursor/rules/cost-guard.mdc');
  assert(existsSync(join(ROOT, 'docs/governance/GCP-KOSTNADSVAKT.md')), 'saknar docs/governance/GCP-KOSTNADSVAKT.md');

  // 8) package.json scripts
  const rootPkg = loadJson(join(ROOT, 'package.json'));
  assert(rootPkg.scripts['smoke:cost-guard'], 'package.json saknar smoke:cost-guard');
  assert(rootPkg.scripts['gcp:audit-apis'], 'package.json saknar gcp:audit-apis');

  // 8) AI caps ska matcha 100 SEK/mån-budget
  const monthlyCap = manifest.aiCostCaps?.monthlyProjectUsd;
  const dailyCap = manifest.aiCostCaps?.dailyProjectUsd;
  if (typeof monthlyCap !== 'number' || monthlyCap > 10) {
    errors.push(`manifest aiCostCaps.monthlyProjectUsd måste vara ≤10 USD (100 SEK/mån)`);
  }
  if (typeof dailyCap !== 'number' || dailyCap > 0.5) {
    errors.push(`manifest aiCostCaps.dailyProjectUsd måste vara ≤0.5 USD (100 SEK/mån)`);
  }

  if (errors.length > 0) {
    console.error('[smoke:cost-guard] FAIL:');
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  console.log('[smoke:cost-guard] PASS — inga dyra tjänster i kod, manifest + regler OK.');
}

try {
  main();
} catch (err) {
  console.error('[smoke:cost-guard] FAIL:', err.message);
  process.exit(1);
}
