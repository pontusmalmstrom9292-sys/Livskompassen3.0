/**
 * Static smoke: Arbetsliv Input Superhub (Fas 14A).
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(c, m) { if (!c) throw new Error(m); }
function read(p) { const f = resolve(root, p); assert(existsSync(f), `saknar fil: ${p}`); return readFileSync(f, 'utf8'); }
function mustInclude(p, ...n) { const t = read(p); for (const x of n) assert(t.includes(x), `${p} saknar: ${x}`); }
function mustNotInclude(p, ...n) { const t = read(p); for (const x of n) assert(!t.includes(x), `${p} får inte innehålla: ${x}`); }

const files = [
  'src/modules/features/dailyLife/arbetsliv/supermodule/ArbetslivInputSuperModule.tsx',
  'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivFlexDelegate.tsx',
  'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivInkomstDelegate.tsx',
  'src/modules/features/dailyLife/arbetsliv/supermodule/delegates/ArbetslivValvBroDelegate.tsx',
];
for (const f of files) read(f);

mustInclude('src/modules/features/dailyLife/arbetsliv/supermodule/arbetslivInputModes.ts', "'inkomster'", "'stampla'", "'tid'");
mustNotInclude('src/modules/features/dailyLife/arbetsliv/supermodule/arbetslivInputModes.ts', "id: 'logg'");
mustInclude('src/modules/features/dailyLife/arbetsliv/supermodule/ArbetslivInputSuperModule.tsx', 'glow-bottom-blue', 'text-accent-secondary', 'ArbetslivValvBroDelegate');
mustNotInclude('src/modules/features/dailyLife/arbetsliv/supermodule/ArbetslivInputSuperModule.tsx', 'ArbetslivLoggDelegate', 'EconomyTidPanel');
console.log('[smoke:arbetsliv-superhub] PASS — Fas 14A');
