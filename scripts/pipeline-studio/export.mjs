#!/usr/bin/env node
/** npm run pipeline:export -- <toolId> */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { loadFtd, root } from './lib/ftdLoader.mjs';

const toolId = process.argv[2];
if (!toolId) {
  console.error('Usage: npm run pipeline:export -- <toolId>');
  process.exit(1);
}

const ftd = loadFtd(toolId);
const outDir = join(root, 'exports/pipeline-studio');
mkdirSync(outDir, { recursive: true });

const schemaPath = join(root, ftd.schemaModule ?? '');
let schemaSnippet = '(ingen schemaModule)';
if (ftd.schemaModule && existsSync(schemaPath)) {
  schemaSnippet = readFileSync(schemaPath, 'utf8').slice(0, 8000);
}

const mdPath = join(root, `docs/pipeline-studio/tools/${toolId}.md`);
const md = existsSync(mdPath) ? readFileSync(mdPath, 'utf8') : '';

const pack = `# Pipeline Studio Export — ${toolId}

## FTD
\`\`\`json
${JSON.stringify(ftd, null, 2)}
\`\`\`

## Doc
${md}

## Schema module
\`\`\`typescript
${schemaSnippet}
\`\`\`

## Node graph
${(ftd.nodeGraph ?? []).join(' → ')}

## Smoke
${(ftd.smoke ?? []).join('\n')}

Upload to Google AI Studio with task prompt. Export validated code to Cursor via pipeline:cursor-pack.
`;

const outFile = join(outDir, `${toolId}-ai-studio.md`);
writeFileSync(outFile, pack, 'utf8');
console.log(`Exported: ${outFile}`);
