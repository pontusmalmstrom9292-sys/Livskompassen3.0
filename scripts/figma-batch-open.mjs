#!/usr/bin/env node
/**
 * Batch-open Livskompassen routes for Figma html-to-design capture.
 * Requires capture script in index.html and npm run dev on :5173.
 *
 * Usage:
 *   1. In Figma file, start ONE capture via Cursor (generate_figma_design) or Figma toolbar.
 *   2. After first capture, use the Figma capture toolbar in the browser to re-capture each page.
 *
 * Or open each route with a pre-generated captureId from Cursor:
 *   node scripts/figma-batch-open.mjs <captureId> <path>
 *   node scripts/figma-batch-open.mjs --list
 */
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const routes = JSON.parse(readFileSync(join(__dirname, 'figma-capture-routes.json'), 'utf8'));

const args = process.argv.slice(2);
if (args[0] === '--list') {
  routes.forEach((r, i) => console.log(`${String(i + 1).padStart(2, '0')}. ${r.name}\n    ${r.path}`));
  process.exit(0);
}

const captureId = args[0];
const pathPart = args[1] ?? '/';
if (!captureId) {
  console.error('Usage: node scripts/figma-batch-open.mjs <captureId> [path]');
  console.error('       node scripts/figma-batch-open.mjs --list');
  process.exit(1);
}

const endpoint = encodeURIComponent(`https://mcp.figma.com/mcp/capture/${captureId}/submit`);
const url = `http://localhost:5173${pathPart}#figmacapture=${captureId}&figmaendpoint=${endpoint}&figmadelay=5000`;
console.log(url);
execSync(`open "${url}"`, { stdio: 'inherit' });
