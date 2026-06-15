#!/usr/bin/env node
/** Fas 14A smoke — ekonomi utan tid-flik */
import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(c, m) { if (!c) throw new Error(m); }
function read(p) { const f = resolve(root, p); assert(existsSync(f), `saknar fil: ${p}`); return readFileSync(f, 'utf8'); }
function mustInclude(p, ...n) { const t = read(p); for (const x of n) assert(t.includes(x), `${p} saknar: ${x}`); }
function mustNotInclude(p, ...n) { const t = read(p); for (const x of n) assert(!t.includes(x), `${p} får inte innehålla: ${x}`); }

mustInclude('src/modules/features/dailyLife/wellbeing/economy/components/EkonomiModulValjare.tsx', "'logg'", 'LoggPreviewMini');
mustInclude('src/modules/features/dailyLife/wellbeing/economy/components/EconomyOverviewPanel.tsx', "activeTab === 'logg'");
mustNotInclude('src/modules/features/dailyLife/wellbeing/economy/components/EconomyOverviewPanel.tsx', 'EconomyTidPanel', "activeTab === 'tid'");
mustInclude('src/modules/features/dailyLife/wellbeing/economy/supermodule/delegates/EkonomiLoggDelegate.tsx', 'scope="vardag"');
console.log('[smoke:ekonomi] PASS — Fas 14A');
