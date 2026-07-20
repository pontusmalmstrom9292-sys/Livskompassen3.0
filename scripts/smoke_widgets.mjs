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
assert(shell.includes('showAppLink = false'), 'WidgetShell ska defaulta showAppLink till false');
assert(shell.includes('widget-shell__brand--static'), 'WidgetShell ska ha statisk brand utan app-länk');

console.log('[smoke:widgets] Standalone auth bypass…');
const appUnlock = readCanonical('src/modules/core/auth/AppUnlockGate.tsx');
assert(appUnlock.includes("pathname.startsWith('/widget')"), 'AppUnlockGate ska bypassa biometri på /widget/*');

const widgetPages = [
  'WidgetCompassPage.tsx',
  'WidgetHamnPage.tsx',
  'WidgetFamiljenPage.tsx',
  'WidgetStampPage.tsx',
  'WidgetSnabbvalPage.tsx',
  'WidgetVoiceVaultPage.tsx',
  'WidgetActionDashboardPage.tsx',
  'WidgetModulerPage.tsx',
];
for (const page of widgetPages) {
  const src = readCanonical(`src/modules/features/widgets/pages/${page}`);
  assert(src.includes('variant="widget"'), `${page} ska använda AuthGate variant=widget`);
}

const projektPage = readCanonical('src/modules/features/widgets/pages/WidgetProjektPage.tsx');
assert(!projektPage.includes("navigate('/projekt')"), 'WidgetProjektPage ska inte redirecta till /projekt');

console.log('[smoke:widgets] Standalone skin primitiver…');
assert(existsSync(resolve(root, 'src/styles/widget-tokens.css')), 'widget-tokens.css saknas');
assert(existsSync(resolve(root, 'src/modules/features/widgets/components/WidgetButton.tsx')), 'WidgetButton saknas');
assert(existsSync(resolve(root, 'src/modules/features/widgets/components/WidgetActionTile.tsx')), 'WidgetActionTile saknas');

const recordPage = readCanonical('src/modules/features/widgets/pages/WidgetRecordPage.tsx');
assert(recordPage.includes('WidgetButton'), 'WidgetRecordPage ska använda WidgetButton');
assert(!recordPage.includes('ButtonLink to="/valvet"'), 'WidgetRecordPage ska inte länka till Valv');

const notePageCapture = readCanonical('src/modules/features/widgets/pages/WidgetNotePage.tsx');
assert(notePageCapture.includes('WidgetButton'), 'WidgetNotePage ska använda WidgetButton');
assert(!notePageCapture.includes('ButtonLink'), 'WidgetNotePage ska inte ha ButtonLink till app');

const actionDash = readCanonical('src/modules/features/widgets/components/ActionDashboard.tsx');
assert(actionDash.includes('WidgetButton'), 'ActionDashboard ska använda WidgetButton');
assert(!actionDash.includes('ButtonLink'), 'ActionDashboard ska inte länka till huvudapp');

assert(notePageCapture.includes('ChameleonInputShell'), 'WidgetNotePage ska morpha silo/compose via Chameleon');
assert(notePageCapture.includes('Fortsätt till text'), 'WidgetNotePage ska ha silo→compose steg');

const siloPicker = readCanonical('src/modules/features/widgets/components/WidgetSiloChipPicker.tsx');
assert(siloPicker.includes('WidgetButton'), 'WidgetSiloChipPicker ska använda WidgetButton');

assert(existsSync(resolve(root, 'src/modules/features/widgets/components/WidgetSuccessCard.tsx')), 'WidgetSuccessCard saknas');
assert(existsSync(resolve(root, 'src/modules/features/widgets/components/WidgetDashboardSection.tsx')), 'WidgetDashboardSection saknas');

const actionDashV2 = readCanonical('src/modules/features/widgets/components/ActionDashboard.tsx');
assert(actionDashV2.includes('WidgetDashboardSection'), 'ActionDashboard ska använda WidgetDashboardSection');
assert(!actionDashV2.includes('BentoCard'), 'ActionDashboard ska inte använda BentoCard');

const ethics = readCanonical('src/modules/features/widgets/components/WidgetRecordingEthicsGate.tsx');
assert(ethics.includes('WidgetButton'), 'WidgetRecordingEthicsGate ska använda WidgetButton');

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
const projektPageRail = readCanonical('src/modules/features/widgets/pages/WidgetProjektPage.tsx');
assert(projektPageRail.includes('W1KompaktProjektRail'), 'WidgetProjektPage saknar kompakt rail');
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

console.log('[smoke:widgets] Android WH7 Åtgärder…');
const actionProvider = readCanonical('android/app/src/main/java/com/livskompassen/app/widgets/ActionDashboardWidgetProvider.java');
assert(actionProvider.includes('ActionDashboardWidgetProvider'), 'WH7 ActionDashboardWidgetProvider saknas');
assert(actionProvider.includes('/widget/aktioner'), 'WH7 ska deep-linka till /widget/aktioner');
assert(existsSync(resolve(root, 'android/app/src/main/res/xml/widget_action_dashboard_info.xml')), 'widget_action_dashboard_info saknas');
assert(existsSync(resolve(root, 'android/app/src/main/res/drawable/widget_ic_wh7_actions.xml')), 'widget_ic_wh7_actions saknas');
assert(androidStrings.includes('widget_action_title'), 'WH7 strings saknas');
const manifest = readCanonical('android/app/src/main/AndroidManifest.xml');
assert(manifest.includes('ActionDashboardWidgetProvider'), 'AndroidManifest saknar WH7 receiver');

console.log('[smoke:widgets] Android WH8 Mina moduler…');
const modulerProvider = readCanonical('android/app/src/main/java/com/livskompassen/app/widgets/ModulerWidgetProvider.java');
assert(modulerProvider.includes('ModulerWidgetProvider'), 'WH8 ModulerWidgetProvider saknas');
assert(modulerProvider.includes('/widget/moduler'), 'WH8 ska deep-linka till /widget/moduler');
assert(existsSync(resolve(root, 'android/app/src/main/res/xml/widget_moduler_info.xml')), 'widget_moduler_info saknas');
assert(existsSync(resolve(root, 'android/app/src/main/res/drawable/widget_ic_wh8_moduler.xml')), 'widget_ic_wh8_moduler saknas');
assert(androidStrings.includes('widget_moduler_title'), 'WH8 strings saknas');
assert(manifest.includes('ModulerWidgetProvider'), 'AndroidManifest saknar WH8 receiver');

console.log('[smoke:widgets] Android WH9 Utvecklingskort…');
const utvProvider = readCanonical(
  'android/app/src/main/java/com/livskompassen/app/widgets/UtvecklingskortWidgetProvider.java',
);
assert(utvProvider.includes('UtvecklingskortWidgetProvider'), 'WH9 UtvecklingskortWidgetProvider saknas');
assert(utvProvider.includes('utv_kort_body'), 'WH9 ska läsa utv_kort_body');
assert(utvProvider.includes('/?expand_dev=true'), 'WH9 ska deep-linka till expand_dev');
assert(existsSync(resolve(root, 'android/app/src/main/res/xml/widget_utv_kort_info.xml')), 'widget_utv_kort_info saknas');
assert(existsSync(resolve(root, 'android/app/src/main/res/layout/widget_utv_kort.xml')), 'widget_utv_kort layout saknas');
assert(androidStrings.includes('widget_utv_kort_title'), 'WH9 strings saknas');
assert(manifest.includes('UtvecklingskortWidgetProvider'), 'AndroidManifest saknar WH9 receiver');
const widgetUpdate = readCanonical(
  'android/app/src/main/java/com/livskompassen/app/core/WidgetUpdateManager.java',
);
assert(widgetUpdate.includes('UtvecklingskortWidgetProvider'), 'WidgetUpdateManager ska uppdatera WH9');
const shortcutMgr = readCanonical(
  'android/app/src/main/java/com/livskompassen/app/core/ShortcutManager.java',
);
assert(shortcutMgr.includes('dynamic_utv_kort'), 'ShortcutManager saknar Dagens kort');
assert(shortcutMgr.includes('expand_dev=true'), 'ShortcutManager ska öppna expand_dev');
assert(shortcutMgr.includes('lastPath'), 'ShortcutManager måste behålla lastPath (ej wipe)');
const chromeFusion = readCanonical('src/modules/core/hooks/useSystemChromeFusion.ts');
assert(chromeFusion.includes('setSystemTheme'), 'useSystemChromeFusion saknar setSystemTheme');
const bento = readCanonical('src/modules/core/home/DevelopmentBentoWidget.tsx');
assert(bento.includes('setMixNonce'), 'DevelopmentBentoWidget saknar pull-to-refresh mixNonce');
assert(bento.includes('updateUtvecklingskortShortcut'), 'Bento ska synka native shortcut');
assert(bento.includes("setWidgetData?.('utv_kort_body'"), 'Bento ska synka WH9 body');

console.log('[smoke:widgets] Design Freeport standalone lab…');
const freeportPage = readCanonical('src/modules/sandbox/DesignFreeportPage.tsx');
assert(freeportPage.includes('WidgetStandaloneLab'), 'Design Freeport saknar WidgetStandaloneLab');
assert(freeportPage.includes('widget-standalone'), 'Design Freeport saknar widget-standalone panel');
assert(existsSync(resolve(root, 'docs/design/widget/STANDALONE-WIDGET-SKIN.md')), 'STANDALONE-WIDGET-SKIN.md saknas');

console.log('[smoke:widgets] PV1a Fyren silo-labels…');
const fyren = readCanonical('src/modules/core/components/FyrenWidgetBar.tsx');
assert(fyren.includes("label: 'Dagbok'"), 'Fyren saknar Dagbok-label');
assert(fyren.includes("label: 'Bevis-rad'"), 'Fyren saknar Bevis-rad-label');
assert(fyren.includes("label: 'Barnobs'"), 'Fyren saknar Barnobs-label');
assert(fyren.includes("to: '/widget/familjen'"), 'Fyren saknar barnobs-route');
const sideDock = readCanonical('src/modules/core/components/FyrenSideQuickDock.tsx');
assert(sideDock.includes("label: 'Dagbok'"), 'Side dock saknar Dagbok-label');
assert(sideDock.includes("label: 'Barnobs'"), 'Side dock saknar Barnobs-label');

console.log('[smoke:widgets] v3 HomeWidgetRenderer + moduler-route…');
const homeRenderer = readCanonical('src/modules/features/widgets/components/HomeWidgetRenderer.tsx');
assert(homeRenderer.includes('WidgetDashboardSection'), 'HomeWidgetRenderer ska använda WidgetDashboardSection');
assert(!homeRenderer.includes('BentoCard'), 'HomeWidgetRenderer ska inte använda BentoCard');
assert(existsSync(resolve(root, 'src/modules/features/widgets/components/WidgetModulerBoard.tsx')), 'WidgetModulerBoard saknas');
assert(existsSync(resolve(root, 'src/modules/features/widgets/pages/WidgetModulerPage.tsx')), 'WidgetModulerPage saknas');
const modulerBoard = readCanonical('src/modules/features/widgets/components/WidgetModulerBoard.tsx');
assert(modulerBoard.includes('subscribeUserWidgets'), 'WidgetModulerBoard ska prenumerera user_widgets');
assert(modulerBoard.includes('HomeWidgetRenderer'), 'WidgetModulerBoard ska rendera HomeWidgetRenderer');
const widgetRoutes = readCanonical('src/modules/features/widgets/routing/WidgetRoutes.tsx');
assert(widgetRoutes.includes('path="moduler"'), 'WidgetRoutes saknar /widget/moduler');
assert(existsSync(resolve(root, 'docs/evaluations/2026-07-14-unlock-MOD-WIDGET-standalone-v3.md')), 'v3 unlock-doc saknas');

console.log('[smoke:widgets] PASS');
