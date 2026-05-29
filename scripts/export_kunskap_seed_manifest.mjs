#!/usr/bin/env node
/**
 * Exporterar KEEP-yaml från Kunskap-CONTENT-SEED.md → JSON-manifest för seed.
 * Usage: npm run export:kunskap-seed
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const seedMd = resolve(root, 'docs/specs/modules/Kunskap-CONTENT-SEED.md');
const outJson = resolve(root, 'docs/specs/modules/Kunskap-CONTENT-SEED.json');

function parseYamlBlocks(text) {
  const blocks = [];
  const re = /```yaml\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const raw = m[1].trim();
    const obj = {};
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const colon = trimmed.indexOf(':');
      if (colon === -1) continue;
      const key = trimmed.slice(0, colon).trim();
      let val = trimmed.slice(colon + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      obj[key] = val;
    }
    if (obj.id && obj.status === 'KEEP' && obj.content_class === 'FACT') {
      const content = obj.content || obj.text_sv || '';
      if (content.length > 40 && !content.startsWith('…')) {
        blocks.push(obj);
      }
    }
  }
  return blocks;
}

function toManifestEntry(row) {
  const category = row.category || 'kunskap_seed';
  const title = row.title || row.id;
  const content = row.content || row.text_sv || '';
  return {
    id: row.id,
    title,
    content,
    category,
    eventDate: null,
    source: 'kunskap_content_seed',
    citation_hint: row.citation_hint || undefined,
    source_tier: row.source_tier || undefined,
  };
}

function main() {
  const text = readFileSync(seedMd, 'utf8');
  const rows = parseYamlBlocks(text);
  const byId = new Map();
  for (const row of rows) {
    if (!byId.has(row.id) || row.id.match(/^kunskap-fact-\d+$/)) {
      byId.set(row.id, row);
    }
  }
  const entries = [...byId.values()]
    .filter((r) => r.id.startsWith('kunskap-fact-'))
    .sort((a, b) => {
      const na = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
      const nb = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
      if (a.id.includes('df') && !b.id.includes('df')) return 1;
      if (!a.id.includes('df') && b.id.includes('df')) return -1;
      return na - nb || a.id.localeCompare(b.id);
    })
    .map(toManifestEntry);

  const manifest = {
    version: new Date().toISOString().slice(0, 10),
    source_policy: 'kunskap_content_seed_keep_only',
    default_source: 'kunskap_content_seed',
    entries,
  };

  writeFileSync(outJson, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`[export:kunskap-seed] ${entries.length} KEEP → ${outJson}`);
}

main();
