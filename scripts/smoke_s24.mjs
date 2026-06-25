/**
 * Smoke: Fas S24 — Zero Footprint widget + DCAP 4 band + mabraCoachGuard
 * Usage: npm run smoke:s24
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readCanonical(relativePath) {
  const full = resolve(root, relativePath);
  assert(existsSync(full), `Saknar fil: ${relativePath}`);
  return readFileSync(full, 'utf8');
}

const dcap = readCanonical('functions/src/agents/cards/index.ts');
assert(dcap.includes("intent: 'mirrorFeeling'"), 'S24: DCAP band 30–49 saknar mirrorFeeling');
assert(dcap.includes('riskScore >= 50'), 'S24: DCAP band 50–69 saknas');
assert(dcap.includes('riskScore >= 70'), 'S24: DCAP band 70+ saknas');

const checkin = readCanonical('src/components/mabra/MabraCheckinModal.tsx');
assert(checkin.includes('shouldRedirectMabraCoachToSpeglar'), 'S24: check-in saknar mabraCoachGuard');

const record = readCanonical('src/modules/features/widgets/pages/WidgetRecordPage.tsx');
assert(record.includes('useWidgetShellClear'), 'S24: WidgetRecordPage saknar clear');

const voice = readCanonical('src/modules/features/widgets/pages/WidgetVoiceVaultPage.tsx');
assert(voice.includes('useWidgetShellClear'), 'S24: WidgetVoiceVaultPage saknar clear');

execSync('node scripts/smoke_dcap_routing.mjs', { cwd: root, stdio: 'inherit' });

console.log('[smoke:s24] PASS');
