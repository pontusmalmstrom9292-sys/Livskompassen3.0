/**
 * Static smoke: Bästa design prod chrome lock — header + dock + hem-paritet (2026-07-09).
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
  mustInclude(
    'docs/design/BASTA-DESIGN-CHROME-LOCK.md',
    'LÅST 2026-07-09',
    'header-start',
    'placement="header"',
  );
  mustInclude('docs/design/BASTA-DESIGN-V2-PARITY.md', 'bästa designv2', 'BastaDesignHero');
  mustInclude('.cursor/rules/basta-design-dock-lock.mdc', 'BASTA-DESIGN', 'MUST NOT');

  const header = read('src/modules/core/layout/basta-design/BastaDesignHeader.tsx');
  assert(header.includes('BastaDesignResurserWidget'), 'BastaDesignHeader: Resurser-widget saknas');
  assert(header.includes('placement="header"'), 'BastaDesignHeader: placement="header" saknas');
  assert(header.includes('ResurserOverlay'), 'BastaDesignHeader: ResurserOverlay saknas');
  assert(header.includes('basta-design__header-start'), 'BastaDesignHeader: header-start saknas');
  assert(header.includes('basta-design__header-brand'), 'BastaDesignHeader: header-brand saknas');
  assert(header.includes('basta-design__header-actions'), 'BastaDesignHeader: header-actions saknas');
  assert(header.includes('Livskompassen'), 'BastaDesignHeader: titel saknas');
  assert(
    /basta-design__header-start[\s\S]*BastaDesignResurserWidget/.test(header),
    'BastaDesignHeader: Resurser måste ligga i header-start (vänster)',
  );
  assert(
    !/basta-design__header-actions[\s\S]*BastaDesignResurserWidget/.test(header),
    'BastaDesignHeader: Resurser får inte ligga i header-actions (höger)',
  );
  assert(
    header.includes('BASTA-DESIGN DOCK LOCK') || header.includes('BASTA-DESIGN-CHROME-LOCK'),
    'BastaDesignHeader: PROTECTED-kommentar saknas',
  );

  const headerCss = read('src/styles/basta-design.css');
  assert(
    headerCss.includes('.basta-design__header--prod') && headerCss.includes('grid-template-columns'),
    'basta-design.css: prod header grid saknas',
  );
  assert(headerCss.includes('.basta-design__header-start'), 'basta-design.css: header-start saknas');

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

  mustInclude(
    'src/modules/core/pages/HomePage.tsx',
    'BastaDesignHome',
    'home-page--basta-design',
    'isBastaDesignTheme',
  );

  mustInclude(
    'src/modules/core/home/basta-design/BastaDesignHome.tsx',
    'BastaDesignHero',
    'Dagens fokus',
    'Fråga livscoachen',
    'Dagens ankar',
    'Planering',
    'Tidigare anteckningar',
  );

  mustInclude(
    'src/modules/core/home/basta-design/BastaDesignHero.tsx',
    'Dagens reflektion',
    'Reflektionsfråga',
    'Stanna upp',
    'Skriv nu',
  );

  const dockCss = read('src/styles/dock-kanon-match.css');
  assert(dockCss.includes('basta-resurser-widget--header'), 'dock-kanon-match: header-widget-variant saknas');
  assert(
    /\.dock-shell--basta-v2 \.basta-dock-bar[\s\S]*width:\s*100%/.test(dockCss),
    'dock-kanon-match: dock width 100% saknas',
  );
  assert(
    /\.dock-shell--basta-v2 \.basta-dock-bar[\s\S]*margin-right:\s*0/.test(dockCss),
    'dock-kanon-match: margin-right 0 saknas',
  );
  assert(!dockCss.includes('margin-right: 2.2rem'), 'dock-kanon-match: gammal widget-marginal får inte finnas');

  mustInclude('src/index.css', 'dock-kanon-match.css', 'basta-design.css');

  console.log(
    '[smoke:basta-dock-lock] PASS — header (vänster Resurser + brand) + dock v2 + hem v2-paritet.',
  );
}

try {
  main();
} catch (err) {
  console.error('[smoke:basta-dock-lock] FAIL —', err.message || err);
  process.exit(1);
}
