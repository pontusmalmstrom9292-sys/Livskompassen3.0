#!/usr/bin/env node
/**
 * Applies Evigt Minne v61 Admin-only create patch to firestore.rules.
 * Requires wave-machine phrases.okRules + readyForRules (or --force with OK).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadWaveMachineState } from './lib/wave_machine.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const force = process.argv.includes('--force');
const state = loadWaveMachineState();

if (!force && (state.phrases?.okRules !== true || state.readyForRules !== true)) {
  console.error('[minne-rules] PAUS — kräver readyForRules + fras "OK rules"');
  console.error('  npm run waves:autorun -- --phrase="OK rules"');
  process.exit(3);
}

const path = join(root, 'firestore.rules');
let rt = readFileSync(path, 'utf8');
const replacements = [
  [
    `    match /kb_docs/{docId} {
      allow read: if isOwner();
      allow create: if isOwnerCreate();
      allow update, delete: if false;`,
    `    match /kb_docs/{docId} {
      allow read: if isOwner();
      // Evigt Minne v61 — Admin SDK only (client create blocked). Callables write via Admin.
      allow create: if false;
      allow update, delete: if false;`,
  ],
  [
    `    match /kampspar/{docId} {
      allow read: if isOwner();
      allow create: if isOwnerCreate();
      allow update, delete: if false;`,
    `    match /kampspar/{docId} {
      allow read: if isOwner();
      // Evigt Minne v61 — Admin SDK only (client create blocked). Callables write via Admin.
      allow create: if false;
      allow update, delete: if false;`,
  ],
];

let changed = 0;
for (const [from, to] of replacements) {
  if (rt.includes(to)) continue;
  if (!rt.includes(from)) {
    console.error('[minne-rules] pattern saknas — manuellt granska firestore.rules');
    process.exit(1);
  }
  rt = rt.replace(from, to);
  changed += 1;
}

if (changed === 0) {
  console.log('[minne-rules] redan Admin-only');
} else {
  writeFileSync(path, rt);
  console.log(`[minne-rules] applicerade ${changed} collection(s) → allow create: if false`);
}
