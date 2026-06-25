/**
 * Smoke: PV1b widget silo-chip + panik dölj + rensa vid stäng
 * Usage: npm run smoke:widgets
 */
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

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

const shell = readCanonical('src/modules/features/widgets/layout/WidgetShell.tsx');
assert(shell.includes('Dölj nu'), 'WidgetShell saknar panik «Dölj nu»');
assert(shell.includes('WidgetShellProvider'), 'WidgetShell saknar rensa-vid-stäng provider');
assert(shell.includes('widget-shell--panic'), 'WidgetShell saknar panik-blur på innehåll');
assert(shell.includes('widget-panic-blur-overlay'), 'WidgetShell saknar panik-overlay');

const note = readCanonical('src/modules/features/widgets/pages/WidgetNotePage.tsx');
assert(note.includes('WidgetSiloChipPicker'), 'WidgetNotePage saknar silo-chip');
assert(note.includes('saveWidgetTextCapture'), 'WidgetNotePage ska routea via widgetSiloCapture');
assert(!note.includes("lead=\"En rad → låses i Valvet.\""), 'WidgetNotePage får inte defaulta till Valv-copy');
assert(note.includes('useWidgetShellClear'), 'WidgetNotePage saknar clear on unmount');

const config = readCanonical('src/modules/features/widgets/config/widgetSiloConfig.ts');
assert(config.includes("'inkast'"), 'widgetSiloConfig saknar default inkast');
assert(config.includes("'dagbok'"), 'widgetSiloConfig saknar dagbok');
assert(config.includes("'bevis'"), 'widgetSiloConfig saknar bevis');
assert(config.includes("'barn'"), 'widgetSiloConfig saknar barn');
assert(config.includes("'mabra'"), 'widgetSiloConfig saknar mabra');
assert(config.includes("'planering'"), 'widgetSiloConfig saknar planering');
assert(config.includes("DEFAULT_WIDGET_SILO: WidgetSiloId = 'inkast'") || config.includes("DEFAULT_WIDGET_SILO = 'inkast'"), 'default silo måste vara inkast');

const capture = readCanonical('src/modules/features/widgets/api/widgetSiloCapture.ts');
assert(capture.includes('submitInkastLite'), 'inkast-route saknas');
assert(capture.includes('saveVaultLog'), 'bevis-route saknas');
assert(capture.includes('saveChildrenLog'), 'barn-route saknas');
assert(capture.includes('saveVitEntry'), 'mabra-route saknas');
assert(capture.includes('createPlanningTask'), 'planering-route saknas');

const panic = readCanonical('src/modules/features/widgets/hooks/useWidgetPanicHide.ts');
assert(panic.includes("navigate('/', { replace: true })"), 'panik ska navigera neutral hem');
assert(panic.includes('setVaultUnlocked(false)'), 'panik ska låsa Valv');

console.log('[smoke:widgets] PV1a Fyren silo-labels…');
const fyren = readCanonical('src/modules/core/components/FyrenWidgetBar.tsx');
assert(fyren.includes("label: 'Dagbok'"), 'Fyren saknar Dagbok-label');
assert(fyren.includes("label: 'Bevis-rad'"), 'Fyren saknar Bevis-rad-label');
assert(fyren.includes("label: 'Barnobs'"), 'Fyren saknar Barnobs-label');
assert(fyren.includes("to: '/widget/familjen'"), 'Fyren saknar barnobs-route');
const sideDock = readCanonical('src/modules/core/components/FyrenSideQuickDock.tsx');
assert(sideDock.includes("label: 'Dagbok'"), 'Side dock saknar Dagbok-label');
assert(sideDock.includes("label: 'Barnobs'"), 'Side dock saknar Barnobs-label');

console.log('[smoke:widgets] PASS');
