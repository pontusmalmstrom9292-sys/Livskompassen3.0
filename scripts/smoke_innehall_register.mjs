/**
 * Static smoke: Innehållskanon U6 — register, bankers, kurator-agenter, sharedRules lock.
 * Usage: npm run smoke:innehall
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function read(relPath) {
  const full = resolve(root, relPath);
  assert(existsSync(full), `saknar fil: ${relPath}`);
  return readFileSync(full, 'utf8');
}

function mustInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    assert(text.includes(needle), `${relPath} saknar: ${needle}`);
  }
}

function main() {
  console.log('[smoke:innehall] Register + kanon...');
  mustInclude(
    'docs/INNEHALL-REGISTER.md',
    'content_class',
    'specialist-innehall-dirigent',
    'specialist-mabra-curator',
    'specialist-kunskap-seed',
    'MUST NOT',
    'fjärde RAG-silo',
  );
  mustInclude('.context/innehall-kanon.md', 'U6', 'Utveckling (Vit)', 'Mabra-CONTENT-BANK');

  console.log('[smoke:innehall] Content banks...');
  mustInclude('docs/specs/modules/Mabra-CONTENT-BANK.md', 'INNEHALL-REGISTER', 'Kunskap-RAG');
  mustInclude('docs/specs/modules/Kunskap-CONTENT-SEED.md', 'content_class: FACT', 'ROUTE_MABRA');
  mustInclude('docs/specs/modules/Barnen-PLAY-BANK.md', 'barnfokus', 'reality_vault');

  mustInclude('docs/specs/modules/Mabra-CONTENT-BANK.md', 'DM-CARD-01', 'daglig_mix');
  mustInclude('src/modules/mabra/content/dagligMixCatalog.ts', 'DM-CARD-01', 'DAGLIG_MIX_CARDS');

  console.log('[smoke:innehall] Cursor rules + grunder U6...');
  mustInclude('.cursor/rules/innehall-register.mdc', 'alwaysApply: true', 'U6');
  mustInclude('.cursor/rules/grunder-kanon.mdc', 'U6', 'INNEHALL-REGISTER');

  console.log('[smoke:innehall] Kurator agents...');
  for (const agent of [
    'specialist-innehall-dirigent.md',
    'specialist-mabra-curator.md',
    'specialist-kunskap-seed.md',
  ]) {
    assert(existsSync(resolve(root, '.cursor/agents', agent)), `saknar .cursor/agents/${agent}`);
    mustInclude(`.cursor/agents/${agent}`, 'INNEHALL-REGISTER', 'MUST NOT');
  }

  console.log('[smoke:innehall] Functions lock (mabraCoach)...');
  mustInclude(
    'functions/src/sharedRules.ts',
    'MABRA_COACHEN_SYSTEM_PROMPT',
    'Mabra-CONTENT-BANK',
    'Ingen RAG',
  );
  mustInclude('functions/src/lib/mabraCoachGuard.ts', 'shouldRedirectMabraCoachToSpeglar');

  console.log('[smoke:innehall] Mabra no Kunskap RAG (spec)...');
  mustInclude(
    'docs/specs/modules/Mabra-SPEC.md',
    'knowledgeVaultQuery',
    'Ingen RAG-export',
  );

  console.log('[smoke:innehall] PASS');
}

try {
  main();
} catch (err) {
  console.error('[smoke:innehall] FAIL:', err.message ?? err);
  process.exit(1);
}
