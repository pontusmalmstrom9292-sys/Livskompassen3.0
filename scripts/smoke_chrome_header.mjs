/**
 * Static smoke: Header chrome layout (SOS i main, kompass-toggle i header-bar).
 * Usage: npm run smoke:chrome-header
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
  mustInclude(
    'src/modules/features/sos/components/SosMainTrigger.tsx',
    'activateSOS',
    'Aktivera SOS-läge',
    'LifeBuoy',
  );

  const mainLayout = read('src/modules/core/layout/MainLayout.tsx');
  assert(
    mainLayout.includes('<SosMainTrigger />'),
    'MainLayout.tsx: SosMainTrigger måste finnas i app-main',
  );
  assert(
    />\s*\n\s*<SosMainTrigger\s*\/>/.test(mainLayout) ||
      mainLayout.includes('<SosMainTrigger />\n        {children}'),
    'MainLayout.tsx: SosMainTrigger måste vara före {children} i main',
  );
  assert(
    mainLayout.includes('headerQuickToggle={<FyrenHeaderQuickToggle />}'),
    'MainLayout.tsx: headerQuickToggle ska vara prop till AppHeaderBar, inte i actions',
  );
  assert(
    !/actions=\{[\s\S]*FyrenHeaderQuickToggle/.test(mainLayout),
    'MainLayout.tsx: FyrenHeaderQuickToggle får inte ligga i actions-blocket',
  );
  assert(
    !mainLayout.includes('activateSOS'),
    'MainLayout.tsx: SOS-aktivering ska ligga i SosMainTrigger, inte MainLayout',
  );

  mustInclude(
    'src/modules/core/components/AppHeaderBar.tsx',
    'headerQuickToggle?: ReactNode',
    '{headerQuickToggle}',
    'glass-header-bar--kanon',
  );

  const appHeader = read('src/modules/core/components/AppHeaderBar.tsx');
  const kanonBlock = appHeader.slice(appHeader.indexOf('glass-header-bar--kanon'));
  assert(
    kanonBlock.includes('{headerQuickToggle}'),
    'AppHeaderBar.tsx: headerQuickToggle måste renderas i glass-header-bar--kanon',
  );

  mustInclude(
    'src/modules/core/components/FyrenSideQuickDock.tsx',
    'export function FyrenHeaderQuickProvider',
    'export function FyrenHeaderQuickToggle',
    'Öppna snabbåtkomst',
    'FyrenHeaderQuickPanel',
  );

  mustInclude(
    'src/index.css',
    'grid-cols-[minmax(0,1fr)_auto_auto]',
    'fyren-header-quick__toggle-wrap',
  );

  console.log('[smoke:chrome-header] PASS — SOS i main, kompass-toggle i header-bar (C2).');
}

try {
  main();
} catch (err) {
  console.error('[smoke:chrome-header] FAIL —', err.message || err);
  process.exit(1);
}
