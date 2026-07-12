/**
 * Static smoke — Android viewport + redirect wiring (G85 390px).
 * Usage: npm run smoke:android-viewport
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function read(rel) {
  const p = resolve(root, rel);
  if (!existsSync(p)) throw new Error(`Missing: ${rel}`);
  return readFileSync(p, 'utf8');
}

function assert(name, ok, detail = '') {
  if (!ok) {
    console.error(`FAIL ${name}${detail ? `: ${detail}` : ''}`);
    process.exit(1);
  }
  console.log(`PASS ${name}`);
}

const dockCss = read('src/styles/dock-kanon-match.css');
assert('android app-main full width', dockCss.includes('max-width: none'));
assert('android calm-scroll pan-y', dockCss.includes('touch-action: pan-y'));
assert('no overflow-x clip on shell', !dockCss.includes('overflow-x: clip'));
assert('android header min-width 0', dockCss.includes('min-width: 0'));

const tabBar = read('src/modules/core/ui/TabBar.tsx');
assert('TabBar touch-manipulation', tabBar.includes('touch-manipulation'));
assert('TabBar mobile wrap', tabBar.includes('max-sm:flex-wrap'));

const widgetSilo = read('src/modules/features/widgets/config/widgetSiloConfig.ts');
assert('widget inkast link', widgetSilo.includes("linkTo: '/planering/input?inputMode=inkast'"));
assert('widget planering link', widgetSilo.includes("linkTo: '/planering?tab=handling'"));

const launcher = read('src/modules/shell/livLauncherRoutes.ts');
assert('launcher inkast redirect', launcher.includes("inkast: '/planering/input?inputMode=inkast'"));
assert('launcher planering redirect', launcher.includes("planering: '/planering?tab=handling'"));

const homeRoutes = read('src/modules/core/home/homeSuperhubRoutes.ts');
assert('hemInkast route not hash', homeRoutes.includes("hemInkast: '/planering/input?inputMode=inkast'"));
assert('no hash inkast-lite in home routes', !homeRoutes.includes('/#inkast-lite'));

const sheet = read('src/design-system/components/Sheet.tsx');
assert('Sheet pointer backdrop', sheet.includes('onPointerUp'));

console.log('\n[smoke:android-viewport] PASS');
