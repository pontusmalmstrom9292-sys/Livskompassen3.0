/**
 * Static smoke: Bästa design prod dock + header layout lock (2026-07-09).
 * Usage: npm run smoke:basta-dock-lock
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

function mustNotInclude(relPath, ...needles) {
  const text = read(relPath);
  for (const needle of needles) {
    assert(!text.includes(needle), `${relPath} får inte innehålla: ${needle}`);
  }
}

function main() {
  mustInclude('docs/design/BASTA-DESIGN-DOCK-LOCK.md', 'LÅST 2026-07-09', 'placement="header"');
  mustInclude('.cursor/rules/basta-design-dock-lock.mdc', 'BASTA-DESIGN-DOCK-LOCK.md', 'MUST NOT');

  const header = read('src/modules/core/layout/basta-design/BastaDesignHeader.tsx');
  assert(header.includes('BastaDesignResurserWidget'), 'BastaDesignHeader: Resurser-widget saknas');
  assert(header.includes('placement="header"'), 'BastaDesignHeader: placement="header" saknas');
  assert(header.includes('ResurserOverlay'), 'BastaDesignHeader: ResurserOverlay saknas');
  assert(
    header.includes('BASTA-DESIGN DOCK LOCK') || header.includes('BASTA-DESIGN-DOCK-LOCK'),
    'BastaDesignHeader: PROTECTED-kommentar saknas',
  );

  const dock = read('src/modules/core/layout/basta-design/BastaDesignDock.tsx');
  assert(!dock.includes('BastaDesignResurserWidget'), 'BastaDesignDock: Resurser-widget får inte ligga i dock');
  assert(!dock.includes('ResurserOverlay'), 'BastaDesignDock: ResurserOverlay ska ligga i header');
  assert(dock.includes('BastaDesignDockBar'), 'BastaDesignDock: BastaDesignDockBar saknas');
  assert(dock.includes('dock-shell--basta-v2'), 'BastaDesignDock: v2 shell saknas');

  mustInclude(
    'src/modules/core/layout/basta-design/BastaDesignDockBar.tsx',
    'basta-dock-bar--v2',
    'label="Anteckning"',
    'label="Familj"',
    'label="Mentil"',
    'label="Inkast"',
    'BastaDesignDockCompass',
  );
  mustNotInclude('src/modules/core/layout/basta-design/BastaDesignDockBar.tsx', 'label="Resurser"');

  mustInclude('src/modules/core/layout/MainLayout.tsx', 'BastaDesignHeader', 'BastaDesignDock');

  const css = read('src/styles/dock-kanon-match.css');
  assert(css.includes('basta-resurser-widget--header'), 'dock-kanon-match: header-widget-variant saknas');
  assert(
    /\.dock-shell--basta-v2 \.basta-dock-bar[\s\S]*width:\s*100%/.test(css),
    'dock-kanon-match: dock width 100% saknas',
  );
  assert(
    /\.dock-shell--basta-v2 \.basta-dock-bar[\s\S]*margin-right:\s*0/.test(css),
    'dock-kanon-match: margin-right 0 saknas',
  );
  assert(!css.includes('margin-right: 2.2rem'), 'dock-kanon-match: gammal widget-marginal får inte finnas');

  mustInclude('src/index.css', 'dock-kanon-match.css');

  console.log(
    '[smoke:basta-dock-lock] PASS — Resurser i header, fullbredd v2-dock, 5 zoner (Anteckning/Familj/kompass/Mentil/Inkast).',
  );
}

try {
  main();
} catch (err) {
  console.error('[smoke:basta-dock-lock] FAIL —', err.message || err);
  process.exit(1);
}
