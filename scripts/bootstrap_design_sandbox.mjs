#!/usr/bin/env node
/**
 * Bootstrap design sandbox in a project copy.
 * Usage: node scripts/bootstrap_design_sandbox.mjs --target "/path/to/copy"
 *
 * Idempotent — safe to re-run.
 */
import { cpSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const templatesDir = join(root, 'scripts/design-sandbox-templates');

function parseTarget(argv) {
  const i = argv.indexOf('--target');
  if (i === -1 || !argv[i + 1]) {
    console.error('Usage: node scripts/bootstrap_design_sandbox.mjs --target "/path/to/copy"');
    process.exit(1);
  }
  return argv[i + 1];
}

function writeIfMissing(target, rel, content) {
  const path = join(target, rel);
  if (existsSync(path)) return false;
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
  return true;
}

function patchEnv(target) {
  const envPath = join(target, '.env');
  let env = existsSync(envPath) ? readFileSync(envPath, 'utf8') : '';
  if (!env.includes('VITE_DESIGN_SANDBOX=true')) {
    env += '\n# Design sandbox\nVITE_DESIGN_SANDBOX=true\n';
  }
  env = env.replace(/VITE_REQUIRE_EMAIL_AUTH=true/g, 'VITE_REQUIRE_EMAIL_AUTH=false');
  writeFileSync(envPath, env.trimEnd() + '\n', 'utf8');
}

function disableRules(target) {
  const rulesDir = join(target, '.cursor/rules');
  for (const name of ['design-calm.mdc', 'ui-design.mdc', 'locked-icons.mdc', 'locked-ux-features.mdc']) {
    const from = join(rulesDir, name);
    const to = join(rulesDir, `${name}.disabled`);
    if (existsSync(from) && !existsSync(to)) renameSync(from, to);
  }
}

function copyTemplates(target) {
  if (!existsSync(templatesDir)) {
    console.warn('[warn] templates missing — copy sandbox files manually from Desktop-kopia');
    return;
  }
  cpSync(templatesDir, join(target, 'src/modules/core/sandbox'), { recursive: true });
}

function patchPackageJson(target) {
  const pkgPath = join(target, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  pkg.scripts ??= {};
  pkg.scripts['smoke:sandbox'] = 'npm run build';
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
}

const target = parseTarget(process.argv);
console.log(`=== Bootstrap design sandbox ===\nTarget: ${target}\n`);

if (!existsSync(join(target, 'package.json'))) {
  console.error('[fail] Not a Livskompassen project root');
  process.exit(1);
}

copyTemplates(target);
patchEnv(target);
disableRules(target);
patchPackageJson(target);

console.log('Done. Next:');
console.log(`  cd "${target}"`);
console.log('  npm ci --legacy-peer-deps && npm run dev');
console.log('  open http://localhost:5173/dev/theme-lab');
