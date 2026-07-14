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
assert(panic.includes('WIDGET_RECORDING_ETHICS_STORAGE_KEY'), 'panik ska rensa ethics-nyckel');

console.log('[smoke:widgets] W1 v2 kompakt rail + executive edge…');
const kompaktRail = readCanonical('src/modules/features/widgets/components/W1KompaktProjektRail.tsx');
assert(kompaktRail.includes('W1KompaktProjektRail'), 'W1KompaktProjektRail saknas');
assert(kompaktRail.includes('W1_KOMPAKT_RAIL_ACTIONS'), 'W1KompaktProjektRail ska använda delad config');
assert(kompaktRail.includes('/widget/projekt'), 'W1 kompakt rail ska routea lista till /widget/projekt');
assert(kompaktRail.includes('/widget/anteckning'), 'W1 kompakt rail ska routea anteckning');
assert(kompaktRail.includes('/widget/inspelning'), 'W1 kompakt rail ska routea tyst inspelning');
const railConfig = readCanonical('src/modules/features/widgets/config/w1KompaktRailActions.ts');
assert(railConfig.includes("label: 'Nytt projekt'"), 'W1 rail config saknar Nytt projekt');
assert(railConfig.includes("label: 'Planering'"), 'W1 rail config saknar Planering');
const projektPage = readCanonical('src/modules/features/widgets/pages/WidgetProjektPage.tsx');
assert(projektPage.includes('W1KompaktProjektRail'), 'WidgetProjektPage saknar kompakt rail');
const edgeDock = readCanonical('src/modules/core/components/W1EdgeQuickDock.tsx');
assert(edgeDock.includes('W1KompaktProjektRail'), 'W1EdgeQuickDock ska använda kompakt rail');
const mainLayout = readCanonical('src/modules/core/layout/MainLayout.tsx');
assert(mainLayout.includes('W1EdgeQuickDock'), 'MainLayout saknar W1EdgeQuickDock på executive');
assert(existsSync(resolve(root, 'docs/evaluations/2026-07-14-unlock-MOD-WIDGET-W1-V2.md')), 'W1 v2 unlock-doc saknas');
assert(existsSync(resolve(root, 'android/app/src/main/res/drawable/widget_bg_premium_panel.xml')), 'widget_bg_premium_panel saknas');
const dockStrip = readCanonical('android/app/src/main/res/layout/widget_dock_strip.xml');
assert(dockStrip.includes('widget_bg_premium_panel'), 'WH1 layout ska använda widget_bg_premium_panel');
const dockTile = readCanonical('android/app/src/main/res/layout/widget_dock_tile.xml');
assert(dockTile.includes('widget_bg_premium_panel'), 'WH2 layout ska använda widget_bg_premium_panel');

console.log('[smoke:widgets] Android WH1 discreet + WH2 inkast copy…');
const recordProvider = readCanonical('android/app/src/main/java/com/livskompassen/app/widgets/RecordWidgetProvider.java');
assert(recordProvider.includes('discreetNote'), 'RecordWidgetProvider ska använda discreetNote');
const recordInfo = readCanonical('android/app/src/main/res/xml/widget_record_info.xml');
assert(recordInfo.includes('widget_dock_strip'), 'WH1 ska använda dock-strip layout');
const noteProvider = readCanonical('android/app/src/main/java/com/livskompassen/app/widgets/NoteWidgetProvider.java');
assert(noteProvider.includes('widget_ic_wh2_note'), 'NoteWidgetProvider ska ha unik WH2-ikon');
const androidStrings = readCanonical('android/app/src/main/res/values/strings.xml');
assert(androidStrings.includes('En rad → Inkast'), 'WH2 Android subtitle ska peka Inkast');
assert(androidStrings.includes('Snabbanteckning'), 'WH2 Android title ska vara Snabbanteckning');

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
