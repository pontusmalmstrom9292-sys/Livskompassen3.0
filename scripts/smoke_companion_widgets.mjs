/**
 * Smoke: Companion Widget OS file + bible structure presence
 * Usage: npm run smoke:companion-widgets
 */
import { existsSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function mustExist(relativePath) {
  const full = resolve(root, relativePath);
  assert(existsSync(full), `Saknar fil: ${relativePath}`);
  return readFileSync(full, 'utf8');
}

const core = [
  'WidgetFramework.ts',
  'WidgetActions.ts',
  'WidgetRouter.ts',
  'WidgetTheme.ts',
  'WidgetAnimations.ts',
  'WidgetSync.ts',
  'WidgetCache.ts',
  'WidgetPermissions.ts',
  'companionSyncTransport.ts',
];

for (const file of core) {
  mustExist(`src/widgets/core/${file}`);
}

const components = [
  'WidgetCard.tsx',
  'WidgetHeader.tsx',
  'WidgetButton.tsx',
  'WidgetGlass.tsx',
  'WidgetProgress.tsx',
  'WidgetQuickAction.tsx',
];

for (const file of components) {
  mustExist(`src/widgets/components/${file}`);
}

const pack = [
  'QuickCaptureWidget.tsx',
  'CompassWidget.tsx',
  'QuickNoteWidget.tsx',
  'InboxWidget.tsx',
  'DailyAnchorWidget.tsx',
  'ChildFocusWidget.tsx',
  'BeaconWidget.tsx',
  'DailyTasksWidget.tsx',
  'JournalWidget.tsx',
  'SafeHarborWidget.tsx',
  'registerCorePack.ts',
  'CompanionWidgetLabPage.tsx',
];

for (const file of pack) {
  mustExist(`src/widgets/pack/${file}`);
}

mustExist('src/widgets/companion-widgets.css');
mustExist('src/widgets/index.ts');
const barrel = mustExist('src/widgets/index.ts');
assert(barrel.includes('companionScopeFromSource'), 'Barrel saknar companionScopeFromSource');
assert(barrel.includes('CompanionAndroidScope'), 'Barrel saknar CompanionAndroidScope');

const theme = mustExist('src/widgets/core/WidgetTheme.ts');
assert(theme.includes('#0D0B09'), 'WidgetTheme saknar Obsidian #0D0B09');
assert(theme.includes('#d4af37') || theme.includes('#FDE68A'), 'WidgetTheme saknar Premium Gold');
assert(theme.includes('etherealBlue'), 'WidgetTheme saknar Ethereal Blue');
assert(theme.includes('1.1.0') || theme.includes('WIDGET_THEME_VERSION'), 'Theme version saknas');
assert(theme.includes('matteMetalFill'), 'Theme saknar matt metall');

const button = mustExist('src/widgets/components/WidgetButton.tsx');
assert(button.includes('triggerWidgetHaptic'), 'WidgetButton saknar haptik');
assert(button.includes('56') || button.includes('minDp'), 'WidgetButton saknar 56 dp-mål');

const sync = mustExist('src/widgets/core/WidgetSync.ts');
assert(!sync.includes('setInterval'), 'WidgetSync får inte använda setInterval (3.6)');

const routes = mustExist('src/modules/core/routing/AppRoutes.tsx');
assert(
  routes.includes('/dev/companion-widgets'),
  'AppRoutes saknar /dev/companion-widgets',
);
assert(
  routes.includes('/installningar/widget-studio'),
  'AppRoutes saknar Widget Studio-route',
);

const packReg = mustExist('src/widgets/pack/registerCorePack.ts');
assert(packReg.includes('safe_harbor'), 'registerCorePack saknar Trygg Hamn');
assert(packReg.includes('quick_capture'), 'registerCorePack saknar Quick Capture');

mustExist('src/widgets/core/companionVoiceUpload.ts');
const voiceUp = mustExist('src/widgets/core/companionVoiceUpload.ts');
assert(voiceUp.includes('saveActionVaultRecording') || voiceUp.includes('uploadCompanionVoice'), 'Voice upload helper saknas');

mustExist('src/widgets/core/companionPhotoUpload.ts');
const photoUp = mustExist('src/widgets/core/companionPhotoUpload.ts');
assert(photoUp.includes('submitInkastLite'), 'Photo upload måste gå via submitInkastLite');
assert(photoUp.includes('fileToPhotoPayload'), 'Photo helper saknar fileToPhotoPayload');

mustExist('src/widgets/core/companionWidgetBridge.ts');
const bridge = mustExist('src/widgets/core/companionWidgetBridge.ts');
assert(bridge.includes('setWidgetData'), 'Bridge saknar setWidgetData');
assert(bridge.includes('DEBOUNCE') || bridge.includes('280'), 'Bridge måste debounca status');

const transport = mustExist('src/widgets/core/companionSyncTransport.ts');
assert(transport.includes('isCompanionVoicePayload'), 'Transport saknar röstgren');
assert(transport.includes('uploadCompanionVoice'), 'Transport anropar inte röstuppladdning');
assert(transport.includes('isCompanionPhotoPayload'), 'Transport saknar fotogren');
assert(transport.includes('uploadCompanionPhoto'), 'Transport anropar inte fotouppladdning');
assert(transport.includes('pushCompanionWidgetStatus'), 'Transport pushar inte widget-status');
assert(transport.includes('companionScopeFromSource'), 'Transport saknar scopeFromSource');

const qc = mustExist('src/widgets/pack/QuickCaptureWidget.tsx');
assert(qc.includes('blobToVoicePayload'), 'QuickCapture sparar inte ArrayBuffer-payload');
assert(qc.includes('finishCompanionCapture'), 'QuickCapture måste använda finishCompanionCapture');

const studioStore = mustExist('src/widgets/studio/widgetStudioStore.ts');
assert(studioStore.includes('resetStudioToCalmDefaults'), 'Studio saknar lugna defaults');
assert(studioStore.includes('mergeMissingPackWidgets'), 'Studio måste merge:a nya pack-widgets');
assert(studioStore.includes('calmOn') || studioStore.includes('daily_anchor'), 'Studio defaults måste vara lugna');

const studioPage = mustExist('src/widgets/studio/WidgetStudioPage.tsx');
assert(studioPage.includes('Barnvecka'), 'Studio saknar barnvecka-toggle');
assert(studioPage.includes('WidgetStudioPreview'), 'Studio saknar live-preview');
assert(studioPage.includes('WidgetStudioModePanel'), 'Studio saknar lägespanel');
assert(studioPage.includes('Lugna defaults'), 'Studio saknar återställ-knapp');
assert(studioPage.includes('Dölj') || studioPage.includes('Visa'), 'Studio måste tipsa om Hem Dölj/Visa');
assert(studioPage.includes('Öppna Hem'), 'Studio saknar Öppna Hem');
assert(studioPage.includes('cw_home_rail_collapsed'), 'Studio måste kunna visa Companion på Hem');

const shell = mustExist('src/modules/features/widgets/layout/WidgetShell.tsx');
assert(shell.includes('companion'), 'WidgetShell saknar companion-läge');

const surfacePage = mustExist('src/modules/features/widgets/pages/WidgetCompanionSurfacePage.tsx');
assert(surfacePage.includes('companion'), 'Companion surface måste sätta companion-shell');

const header = mustExist('src/widgets/components/WidgetHeader.tsx');
assert(header.includes('cw-header__sync--offline'), 'Header saknar offline-puls');
assert(header.includes('aria-live'), 'Header-subtitle måste ha aria-live');

const inbox = mustExist('src/widgets/pack/InboxWidget.tsx');
assert(inbox.includes('useCompanionVoiceCapture') || inbox.includes('blobToVoicePayload'), 'Inkast-röst saknar uppladdningspayload');
assert(inbox.includes('fileToPhotoPayload'), 'Inkast-foto saknar uppladdningspayload');
assert(inbox.includes('cw-inbox-draft') || inbox.includes('saveTextOrLink'), 'Inkast-text måste vara interaktiv');
assert(inbox.includes('finishCompanionCapture'), 'Inkast måste använda finishCompanionCapture');
assert(inbox.includes('cw-trust-row'), 'Inkast saknar trust-rad');
assert(inbox.includes('aria-live'), 'Inkast trust-rad måste ha aria-live');
assert(inbox.includes('softFocusWidgetControl'), 'Inkast måste soft-focusa textfält');

const note = mustExist('src/widgets/pack/QuickNoteWidget.tsx');
assert(note.includes('fileToPhotoPayload'), 'QuickNote-foto saknar uppladdningspayload');
assert(note.includes('useCompanionVoiceCapture'), 'QuickNote-röst måste vara interaktiv');
assert(note.includes('finishCompanionCapture'), 'QuickNote måste använda finishCompanionCapture');
assert(note.includes(':draft'), 'QuickNote måste spara draft');

const child = mustExist('src/widgets/pack/ChildFocusWidget.tsx');
assert(child.includes('useCompanionVoiceCapture'), 'Barnfokus-röst måste vara interaktiv');
assert(child.includes('openRecent') || child.includes('Senaste'), 'Barnfokus Senaste måste vara interaktiv');
assert(child.includes('softFocusWidgetControl'), 'Barnfokus måste soft-focusa svarfält');

mustExist('src/widgets/core/useCompanionVoiceCapture.ts');

/* Android Companion chips + web deep-link targets — full pack (10) */
const companionProviders = [
  'Capture',
  'Inbox',
  'Note',
  'Harbor',
  'Compass',
  'Child',
  'Beacon',
  'Journal',
  'Anchor',
  'Tasks',
];
for (const name of companionProviders) {
  mustExist(
    `android/app/src/main/java/com/livskompassen/app/widgets/Companion${name}WidgetProvider.java`,
  );
}

const companionSlugs = [
  'capture',
  'inbox',
  'note',
  'harbor',
  'compass',
  'child',
  'beacon',
  'journal',
  'anchor',
  'tasks',
];
for (const slug of companionSlugs) {
  mustExist(`android/app/src/main/res/xml/widget_companion_${slug}_info.xml`);
}

mustExist('android/app/src/main/res/drawable/widget_ic_companion_mic.xml');
mustExist('android/app/src/main/res/drawable/widget_ic_companion_inbox.xml');
mustExist('android/app/src/main/res/drawable/widget_ic_companion_note.xml');
mustExist('android/app/src/main/res/drawable/widget_ic_companion_harbor.xml');
mustExist('android/app/src/main/res/drawable/widget_ic_companion_child.xml');
mustExist('android/app/src/main/res/drawable/widget_ic_companion_beacon.xml');
mustExist('android/app/src/main/res/drawable/widget_ic_companion_journal.xml');
mustExist('android/app/src/main/res/drawable/widget_ic_companion_anchor.xml');
mustExist('src/modules/features/widgets/pages/WidgetCompanionCapturePage.tsx');
mustExist('src/modules/features/widgets/pages/WidgetCompanionSurfacePage.tsx');
mustExist('src/widgets/core/bootCompanionSurface.ts');

const manifest = mustExist('android/app/src/main/AndroidManifest.xml');
for (const name of companionProviders) {
  assert(
    manifest.includes(`Companion${name}WidgetProvider`),
    `AndroidManifest saknar Companion${name} receiver`,
  );
}

const widgetRoutes = mustExist('src/modules/features/widgets/routing/WidgetRoutes.tsx');
for (const slug of companionSlugs) {
  assert(
    widgetRoutes.includes(`companion-${slug}`),
    `WidgetRoutes saknar companion-${slug}`,
  );
}

mustExist('src/widgets/core/softFocusWidgetControl.ts');
const softFocus = mustExist('src/widgets/core/softFocusWidgetControl.ts');
assert(softFocus.includes('cw-soft-focus'), 'Soft focus måste sätta highlight-klass');

const surface = mustExist('src/modules/features/widgets/pages/WidgetCompanionSurfacePage.tsx');
assert(surface.includes('CompanionDailyTasksHost'), 'Surface saknar Planering-uppgifter');
assert(surface.includes('CompassWidget'), 'Surface saknar Compass');
assert(surface.includes('JournalWidget'), 'Surface saknar Journal');
assert(surface.includes('softFocusWidgetControl'), 'Surface måste använda softFocusWidgetControl');

const harbor = mustExist('src/widgets/pack/SafeHarborWidget.tsx');
assert(harbor.includes('cycle') || harbor.includes('Byt mening'), 'Trygg Hamn måste vara interaktiv');
assert(harbor.includes('triggerWidgetHaptic'), 'Hamn måste ha haptik');
assert(harbor.includes('getCached'), 'Hamn måste återställa senaste mening');
assert(harbor.includes('cw-lotus') || harbor.includes('Andas'), 'Hamn saknar lotus/andas');
assert(harbor.includes('widget_harbor_breath') || harbor.includes('breatheOnce'), 'Hamn saknar andningssteg');
assert(harbor.includes('cw-trust-row'), 'Hamn saknar trust-rad');
assert(harbor.includes('widgetCardClass'), 'Hamn måste använda studio-idle animation');

const childTrust = mustExist('src/widgets/pack/ChildFocusWidget.tsx');
assert(childTrust.includes('cw-trust-row'), 'Barnfokus saknar trust-rad');

const tasksTrust = mustExist('src/widgets/pack/DailyTasksWidget.tsx');
assert(tasksTrust.includes('cw-trust-row'), 'Uppgifter saknar trust-rad');

const anchorTrust = mustExist('src/widgets/pack/DailyAnchorWidget.tsx');
assert(anchorTrust.includes('cw-trust-row'), 'Ankare saknar trust-rad');

const compassTrust = mustExist('src/widgets/pack/CompassWidget.tsx');
assert(compassTrust.includes('cw-trust-row'), 'Kompass saknar trust-rad');

const homeRail = mustExist('src/widgets/pack/CompanionHomeRail.tsx');
assert(homeRail.includes('useCompanionSurface'), 'Home rail måste använda smart surface');
assert(homeRail.includes('readCompanionAiSignals'), 'Home rail måste läsa riktiga signaler');
assert(homeRail.includes('WidgetSyncStatusChip'), 'Home rail saknar synk-status');
assert(homeRail.includes('subscribeWidgetCache'), 'Home rail måste lyssna på cache');
assert(homeRail.includes('CompanionDailyTasksHost'), 'Home rail saknar Planering-bro');
assert(homeRail.includes('cw-mode-badge'), 'Home rail saknar lägesbadge');
assert(homeRail.includes('cw-mode-badge--period') || homeRail.includes('Morgon'), 'Home rail saknar period-badge');
assert(homeRail.includes('Slå på Capture') || homeRail.includes('patchWidgetStudioConfig'), 'Home rail saknar tom-CTA');
assert(homeRail.includes('import.meta.env.DEV') && homeRail.includes('Labb'), 'Home rail måste dölja Labb i prod');
assert(homeRail.includes('/installningar/widget-studio') || homeRail.includes('Studio'), 'Home rail saknar Studio-länk');
assert(homeRail.includes('cw_home_rail_collapsed') || homeRail.includes('Dölj'), 'Home rail saknar Dölj/Visa');
assert(homeRail.includes('vilande') || homeRail.includes('cw-home-rail-collapsed'), 'Home rail saknar kollaps-copy');
assert(homeRail.includes('onClick={toggleCollapsed}') || homeRail.includes('cw-home-rail-collapsed'), 'Kollaps-rad måste vara klickbar');
assert(homeRail.includes('HubErrorBoundary'), 'Home rail måste ha HubErrorBoundary');
assert(note.includes('cw-trust-row'), 'QuickNote saknar trust-rad');
assert(homeRail.includes('cw-home-pin') || homeRail.includes('Fäst'), 'Hem-rail saknar pin-badge');
assert(homeRail.includes('subscribeWidgetStudio'), 'Home rail måste lyssna på Studio');

mustExist('src/widgets/core/finishCompanionCapture.ts');
const finishCap = mustExist('src/widgets/core/finishCompanionCapture.ts');
assert(finishCap.includes('Sparat lokalt'), 'finishCompanionCapture saknar offline-copy');
assert(finishCap.includes('androidScope'), 'finishCompanionCapture måste skicka androidScope');

const androidStrings = mustExist('android/app/src/main/res/values/strings.xml');
assert(androidStrings.includes('Andas här'), 'Android Hamn-sub måste vara lugn copy');
assert(
  androidStrings.includes('Tryck · håll tyst') ||
    androidStrings.includes('startar inspelning') ||
    androidStrings.includes('Tryck mic') ||
    androidStrings.includes('Håll 2 sek') ||
    androidStrings.includes('spela in i widgeten'),
  'Android Capture-sub måste vara tydlig',
);
assert(androidStrings.includes('En rad räcker'), 'Android Dagbok-sub måste vara kort copy');
assert(androidStrings.includes('Håll för meny'), 'Android Kompass-sub måste nämna meny');
assert(androidStrings.includes('Svara kort'), 'Android Barnfokus-sub måste vara kort');

mustExist('src/widgets/core/useCompanionOnline.ts');
const onlineHook = mustExist('src/widgets/core/useCompanionOnline.ts');
assert(onlineHook.includes('flushWidgetSyncQueue'), 'Online-hook måste flusha vid reconnect');

assert(qc.includes('useCompanionOnline'), 'QuickCapture måste använda useCompanionOnline');
assert(inbox.includes('useCompanionOnline'), 'Inkast måste använda useCompanionOnline');
assert(note.includes('useCompanionOnline'), 'QuickNote måste använda useCompanionOnline');

assert(studioPage.includes('av ') || studioPage.includes('enabledCount'), 'Studio saknar enable-count');
assert(studioPage.includes('dubbelklicka') || studioPage.includes('onDoubleClick'), 'Studio saknar snabb På/Av');
assert(studioPage.includes('Fäst på Hem') || studioPage.includes('homePin'), 'Studio saknar Fäst på Hem');

const guidedPins = mustExist('src/widgets/studio/guidedCustomization.ts');
assert(guidedPins.includes('clampHomePins'), 'Saknar clampHomePins');
assert(guidedPins.includes('MAX_HOME_PINS'), 'Saknar MAX_HOME_PINS');

const resolveHome = mustExist('src/widgets/smart/resolveHomeSurface.ts');
assert(resolveHome.includes('homePin'), 'Hem-yta måste respektera homePin');

assert(finishCap.includes('pushCompanionWidgetStatus'), 'finishCompanionCapture måste pusha Android-status');

assert(qc.includes('Avbryt') || qc.includes('cancelRecording'), 'QuickCapture måste kunna avbryta');
assert(qc.includes('SWIPE_CANCEL') || qc.includes('swipe'), 'QuickCapture måste stödja svep-avbryt');
assert(qc.includes('openRecent') || qc.includes('Senaste'), 'QuickCapture måste öppna Senaste');
assert(qc.includes('createDoubleTapController') || qc.includes('doubleTap'), 'QuickCapture måste stödja dubbeltryck');
assert(qc.includes('pulseHint') || qc.includes('cw-pulse-cta'), 'QuickCapture måste ha soft pulse CTA');
assert(qc.includes('softFocusWidgetControl'), 'QuickCapture måste soft-focusa mic vid pulse');

const studioPreview = mustExist('src/widgets/studio/WidgetStudioPreview.tsx');
assert(studioPreview.includes('pulseHint') || studioPreview.includes('Pulse'), 'Studio-preview saknar Pulse-toggle');
assert(studioPreview.includes('På Hem') || studioPreview.includes('enabled'), 'Studio-preview saknar På/Av');
assert(studioPreview.includes('homePin') || studioPreview.includes('Fäst'), 'Studio-preview saknar Fäst');
assert(studioPreview.includes('enabled') || studioPreview.includes('På Hem'), 'Studio-preview saknar På/Av');

const labSoft = mustExist('src/widgets/pack/CompanionWidgetLabPage.tsx');
assert(labSoft.includes('softFocusWidgetControl'), 'Lab måste soft-focusa första widget');

const actionsCore = mustExist('src/widgets/core/WidgetActions.ts');
assert(actionsCore.includes('createDoubleTapController'), 'WidgetActions saknar createDoubleTapController');

const compassMenu = mustExist('src/widgets/pack/CompassWidget.tsx');
assert(compassMenu.includes('QUICK_MENU') || compassMenu.includes('Snabbmeny'), 'Kompass saknar långtryck-meny');
assert(compassMenu.includes('createLongPressController'), 'Kompass måste använda långtryck');


const beacon = mustExist('src/widgets/pack/BeaconWidget.tsx');
assert(beacon.includes('nudge') || beacon.includes('Spara'), 'Fyren måste vara justerbar');
assert(beacon.includes('setCached'), 'Fyren måste cacha metrics vid justering');
assert(beacon.includes('finishCompanionCapture'), 'Fyren måste använda finishCompanionCapture');
assert(beacon.includes('useCompanionOnline'), 'Fyren måste visa offline');
assert(beacon.includes('cw-trust-row'), 'Fyren saknar trust-rad');
assert(beacon.includes('widgetCardClass'), 'Fyren måste använda studio-idle animation');

const childFocusOnline = mustExist('src/widgets/pack/ChildFocusWidget.tsx');
assert(childFocusOnline.includes('finishCompanionCapture'), 'Barnfokus måste använda finishCompanionCapture');
assert(childFocusOnline.includes('useCompanionOnline'), 'Barnfokus måste visa offline');

const compassOnline = mustExist('src/widgets/pack/CompassWidget.tsx');
assert(compassOnline.includes('finishCompanionCapture'), 'Kompass måste använda finishCompanionCapture');
assert(compassOnline.includes('useCompanionOnline'), 'Kompass måste visa offline');

const harborOnline = mustExist('src/widgets/pack/SafeHarborWidget.tsx');
assert(harborOnline.includes('useCompanionOnline'), 'Hamn måste visa offline');

const anchorOnline = mustExist('src/widgets/pack/DailyAnchorWidget.tsx');
assert(anchorOnline.includes('finishCompanionCapture'), 'Ankare måste använda finishCompanionCapture');
assert(anchorOnline.includes('useCompanionOnline'), 'Ankare måste visa offline');

const lab = mustExist('src/widgets/pack/CompanionWidgetLabPage.tsx');
assert(lab.includes('WidgetSyncStatusChip'), 'Lab saknar sync-chip');
assert(lab.includes('cw-mode-badge'), 'Lab saknar lägesbadge');

const syncChip = mustExist('src/widgets/components/WidgetSyncStatusChip.tsx');
assert(syncChip.includes('aria-live'), 'Sync-chip saknar aria-live');
assert(syncChip.includes('aria-busy'), 'Sync-chip saknar aria-busy');
assert(syncChip.includes('retry'), 'Sync-chip saknar retry');
assert(syncChip.includes('Synkat') || syncChip.includes('lastFlushAt'), 'Sync-chip måste visa lyckad synk');

const css = mustExist('src/widgets/companion-widgets.css');
assert(css.includes('cw-signature'), 'CSS saknar systemets signatur');
assert(css.includes('cw-compass-disc'), 'CSS saknar kompass-djup');
assert(css.includes('cw-soft-focus'), 'CSS saknar soft-focus');
assert(css.includes('cw-mode-badge'), 'CSS saknar mode-badge');
assert(css.includes('cw-pulse-cta'), 'CSS saknar pulse CTA');
assert(css.includes('cw-lotus'), 'CSS saknar lotus');
assert(css.includes('cw-check-burst'), 'CSS saknar ankare-checkmark');

const anchorBurst = mustExist('src/widgets/pack/DailyAnchorWidget.tsx');
assert(anchorBurst.includes('cw-check-burst') || anchorBurst.includes('justDone'), 'Ankare saknar checkmark-anim');


mustExist('src/widgets/studio/guidedCustomization.ts');
mustExist('src/widgets/studio/widgetStudioStore.ts');
mustExist('src/widgets/components/WidgetMoodCheckIn.tsx');
mustExist('src/widgets/smart/smartTimeContext.ts');
mustExist('src/widgets/smart/widgetAiContext.ts');
mustExist('src/widgets/smart/resolveHomeSurface.ts');

const smartTime = mustExist('src/widgets/smart/smartTimeContext.ts');
assert(smartTime.includes('msUntilNextPeriod'), 'Smart Time måste schemalägga periodgräns');
assert(!/\bsetInterval\s*\(/.test(smartTime), 'Smart Time får inte använda setInterval');
assert(smartTime.includes('morning') && smartTime.includes('night'), 'Smart Time saknar dygnsperioder');

const widgetAi = mustExist('src/widgets/smart/widgetAiContext.ts');
assert(widgetAi.includes('anchor_only'), 'AI saknar låg-energi-läge');
assert(widgetAi.includes('harbor'), 'AI saknar stress→hamn-läge');
assert(widgetAi.includes('single_task'), 'AI saknar overload→single_task');
assert(widgetAi.includes('family') || widgetAi.includes('isBarnvecka'), 'AI saknar barnvecka');
assert(widgetAi.includes('pauseProactive'), 'AI saknar pauseProactive');

const homeSurface = mustExist('src/widgets/smart/resolveHomeSurface.ts');
assert(homeSurface.includes('pauseProactive'), 'Home surface måste exponera pauseProactive');
assert(homeSurface.includes('night') && homeSurface.includes('dimVisual'), 'Home surface måste dimma natt');

const useSurface = mustExist('src/widgets/smart/useCompanionSurface.ts');
assert(useSurface.includes('msUntilNextPeriod'), 'useCompanionSurface måste refresha på period');
assert(!useSurface.includes('setInterval'), 'useCompanionSurface får inte setInterval');

assert(homeRail.includes('cw-home-rail--dim') || homeRail.includes('dimVisual'), 'Hem-rail måste stödja dim');
assert(homeRail.includes('pauseProactive'), 'Hem-rail måste respektera pauseProactive');
assert(homeRail.includes('single_task') && homeRail.includes('maxVisible'), 'Hem-rail måste begränsa tasks i single_task');

const studioSmart = mustExist('src/widgets/studio/WidgetStudioPage.tsx');
assert(studioSmart.includes('smartTimeEnabled') && studioSmart.includes('smartAiEnabled'), 'Studio saknar Smart Time/AI toggles');

const mood = mustExist('src/widgets/components/WidgetMoodCheckIn.tsx');
assert(mood.includes('cw-mood'), 'Mood check-in saknar ansikts-UI');

const guided = mustExist('src/widgets/studio/guidedCustomization.ts');
assert(guided.includes('maxShortcutsForSize'), 'Guided customization saknar max-knappar');
assert(guided.includes('guideWidgetConfig'), 'Guided customization saknar sanitizer');

mustExist('src/widgets/smart/readCompanionSignals.ts');
mustExist('src/widgets/components/WidgetSyncStatusChip.tsx');
mustExist('src/widgets/core/useWidgetSyncStatus.ts');
mustExist('src/widgets/pack/CompanionDailyTasksHost.tsx');
mustExist('src/widgets/studio/WidgetStudioPreview.tsx');

const childFocus = mustExist('src/widgets/pack/ChildFocusWidget.tsx');
assert(childFocus.includes('barnfokusQuestionForToday'), 'Barnfokus måste använda låst frågepool');
assert(childFocus.includes('formatBarnfokusCaptureText'), 'Barnfokus måste använda epistemik-prefix');

const barnText = mustExist('src/widgets/core/companionBarnText.ts');
assert(barnText.includes('[citat]'), 'Barn-text saknar [citat]');
assert(barnText.includes('[tolkning]'), 'Barn-text saknar [tolkning]');

const journal = mustExist('src/widgets/pack/JournalWidget.tsx');
assert(journal.includes('finishCompanionCapture'), 'Journal måste använda finishCompanionCapture');
assert(journal.includes('useCompanionOnline'), 'Journal måste visa offline');
assert(journal.includes('Spara rad') || journal.includes('saveLine'), 'Journal måste ha snabb rad');
assert(journal.includes('cw-trust-row'), 'Journal saknar trust-rad');
assert(journal.includes('softFocusWidgetControl'), 'Journal måste soft-focusa skrivfält');
assert(journal.includes('widgetCardClass'), 'Journal måste använda studio-idle animation');

mustExist('src/widgets/studio/studioIdleClass.ts');
const idleClass = mustExist('src/widgets/studio/studioIdleClass.ts');
assert(idleClass.includes('cw-anim-breathe'), 'studioIdleClass måste mappa breathe');
assert(idleClass.includes('widgetCardClass'), 'studioIdleClass saknar widgetCardClass');

const tasksHost = mustExist('src/widgets/pack/CompanionDailyTasksHost.tsx');
assert(tasksHost.includes('moveTask'), 'Uppgifter måste kunna markera klar i Planering');
assert(tasksHost.includes('hosted'), 'Tasks-host måste markera hosted (inga demo-tasks)');

const dailyTasks = mustExist('src/widgets/pack/DailyTasksWidget.tsx');
assert(dailyTasks.includes('finishCompanionCapture'), 'Uppgifter måste använda finishCompanionCapture');
assert(dailyTasks.includes('cw-task-fade') || dailyTasks.includes('fadingId'), 'Uppgifter måste fadea vid klar');
assert(dailyTasks.includes('useCompanionOnline'), 'Uppgifter måste visa offline');
assert(dailyTasks.includes('Öppna Planering'), 'Tom Planering måste ha öppna-knapp');
assert(dailyTasks.includes('Allt klart'), 'Tom Planering måste ha klart-copy');

const signals = mustExist('src/widgets/smart/readCompanionSignals.ts');
assert(signals.includes('applyJournalMoodToSignals'), 'Signaller måste blanda journal-mood');
assert(signals.includes('very_low'), 'Signaller måste reagera på tungt mood');
assert(signals.includes('STUDIO_SIGNAL_OVERRIDE_KEY'), 'Signaller saknar studio-demo override');
assert(signals.includes('daily_anchor') || signals.includes('safe_harbor:breath'), 'Signaller måste läsa ankare/andas');

mustExist('src/widgets/studio/WidgetStudioModePanel.tsx');
const modePanel = mustExist('src/widgets/studio/WidgetStudioModePanel.tsx');
assert(modePanel.includes('Demo: låg energi'), 'Lägespanel saknar energi-demo');
assert(modePanel.includes('Rensa demo'), 'Lägespanel saknar rensa-demo');
assert(modePanel.includes('många uppgifter') || modePanel.includes('openTaskCount: 8'), 'Studio saknar overload-demo');
assert(modePanel.includes('barnvecka') || modePanel.includes('isBarnvecka: true'), 'Studio saknar barnvecka-demo');

const androidViews = mustExist('android/app/src/main/java/com/livskompassen/app/widgets/WidgetViews.java');
assert(androidViews.includes('substring') || androidViews.includes('40'), 'Android chip måste trunkera last_action');
assert(androidViews.includes('last_action_') || androidViews.includes('statusKey'), 'Android chip måste stödja scoped status');
assert(androidViews.includes('bindClick') || androidViews.includes('widget_icon'), 'Android chip måste binda klick på barn-vyer');

const androidLaunch = mustExist('android/app/src/main/java/com/livskompassen/app/widgets/WidgetLaunch.java');
assert(androidLaunch.includes('setData') || androidLaunch.includes('livskompassen://'), 'WidgetLaunch måste ha unik data-URI per path');

// WIS — Interactive Companion (broadcast / overlay / no primary MainActivity deep-link)
mustExist('android/app/src/main/java/com/livskompassen/app/widgets/WidgetInteract.java');
mustExist('android/app/src/main/java/com/livskompassen/app/widgets/WidgetActionReceiver.java');
mustExist('android/app/src/main/java/com/livskompassen/app/widgets/WidgetOverlayActivity.java');
mustExist('android/app/src/main/java/com/livskompassen/app/widgets/WidgetCaptureService.java');
mustExist('android/app/src/main/java/com/livskompassen/app/widgets/WidgetCaptureStore.java');
mustExist('android/app/src/main/res/layout/activity_widget_overlay.xml');
assert(
  mustExist('android/app/src/main/java/com/livskompassen/app/widgets/WidgetCaptureStore.java')
    .includes('EncryptedFile') &&
    mustExist('android/app/src/main/java/com/livskompassen/app/widgets/WidgetCaptureStore.java')
      .includes('downloadToDownloads'),
  'WidgetCaptureStore måste kryptera + tillåta Downloads-export',
);
mustExist('.cursor/skills/livskompassen-companion-widget-interact/SKILL.md');
mustExist('.cursor/agents/specialist-widget-interact-capture.md');
mustExist('.cursor/agents/specialist-widget-interact-input.md');
mustExist('.cursor/agents/specialist-widget-interact-actions.md');
mustExist('.cursor/agents/specialist-widget-visual-parity.md');
mustExist('.cursor/agents/specialist-widget-sync-bridge.md');
const wisViews = mustExist('android/app/src/main/java/com/livskompassen/app/widgets/WidgetViews.java');
assert(wisViews.includes('WidgetInteract.overlayPendingIntent'), 'Capture/Note måste använda overlay');
assert(wisViews.includes('WidgetInteract.broadcastPendingIntent'), 'Tasks/Harbor måste använda broadcast');
assert(wisViews.includes('MODE_CAPTURE') && wisViews.includes('MODE_NOTE'), 'WIS modes saknas i WidgetViews');
assert(wisViews.includes('ACT_TASK_TOGGLE'), 'Tasks måste ha in-place toggle');
assert(wisViews.includes('WidgetCaptureService'), 'Capture måste använda bakgrundsservice');
const wisManifest = mustExist('android/app/src/main/AndroidManifest.xml');
assert(wisManifest.includes('WidgetOverlayActivity'), 'Manifest saknar WidgetOverlayActivity');
assert(wisManifest.includes('WidgetActionReceiver'), 'Manifest saknar WidgetActionReceiver');
assert(wisManifest.includes('WidgetCaptureService'), 'Manifest saknar WidgetCaptureService');
assert(
  wisManifest.includes('FOREGROUND_SERVICE_MICROPHONE') ||
    wisManifest.includes('foregroundServiceType="microphone"'),
  'Manifest saknar microphone FGS',
);
const wisBible = mustExist('widget_bible.md');
assert(wisBible.includes('Android Interactivity Contract'), 'widget_bible saknar kap. 7 Interactivity Contract');
const wisBridge = mustExist('src/widgets/core/companionWidgetBridge.ts');
assert(wisBridge.includes('pullNativeWidgetQueues'), 'Bridge måste pulla native WIS-kö');
assert(wisBridge.includes('getWidgetData'), 'Bridge måste referera getWidgetData');
const wisSync = mustExist('src/widgets/core/WidgetSync.ts');
assert(wisSync.includes('ingestNativeWidgetQueues') || wisSync.includes('pullNativeWidgetQueues'), 'WidgetSync måste ingest native queues');
mustExist('docs/evaluations/2026-07-22-unlock-MOD-WIDGET-companion-interact.md');

const surfaceAutostart = mustExist('src/modules/features/widgets/pages/WidgetCompanionSurfacePage.tsx');
assert(surfaceAutostart.includes('autostart={autostart'), 'Capture-surface måste skicka autostart till QuickCapture');

const qcAutostart = mustExist('src/widgets/pack/QuickCaptureWidget.tsx');
assert(qcAutostart.includes('autostart') && qcAutostart.includes('startRecording'), 'QuickCapture måste autostarta inspelning');

const updateMgr = mustExist('android/app/src/main/java/com/livskompassen/app/core/WidgetUpdateManager.java');
assert(updateMgr.includes('last_action_capture'), 'WidgetUpdateManager saknar capture-scope');
assert(updateMgr.includes('companionProviderForStatusKey'), 'WidgetUpdateManager saknar scope-map');

const widgetBridge = mustExist('src/widgets/core/companionWidgetBridge.ts');
assert(widgetBridge.includes('last_action_'), 'Bridge måste skriva scoped last_action_*');
assert(widgetBridge.includes('CompanionAndroidScope'), 'Bridge saknar CompanionAndroidScope');

const surfacePulse = mustExist('src/modules/features/widgets/pages/WidgetCompanionSurfacePage.tsx');
assert(surfacePulse.includes('PULSE_SURFACES'), 'Surface saknar PULSE_SURFACES');
assert(surfacePulse.includes("'inbox'") && surfacePulse.includes("'note'"), 'PULSE måste täcka inbox/note');
assert(surfacePulse.includes("'child'") && surfacePulse.includes("'tasks'"), 'PULSE måste täcka child/tasks');
assert(surfacePulse.includes('pulseHint'), 'Surface måste skicka pulseHint');

const inboxPulse = mustExist('src/widgets/pack/InboxWidget.tsx');
assert(inboxPulse.includes('pulseHint'), 'Inkast saknar pulseHint');

const notePulse = mustExist('src/widgets/pack/QuickNoteWidget.tsx');
assert(notePulse.includes('pulseHint') && notePulse.includes('cw-pulse-cta'), 'Note saknar pulse CTA');

const childPulse = mustExist('src/widgets/pack/ChildFocusWidget.tsx');
assert(childPulse.includes('pulseHint'), 'Barnfokus saknar pulseHint');

const beaconPulse = mustExist('src/widgets/pack/BeaconWidget.tsx');
assert(beaconPulse.includes('pulseHint') && beaconPulse.includes('cw-pulse-cta'), 'Fyr saknar pulse CTA');

const compassPulse = mustExist('src/widgets/pack/CompassWidget.tsx');
assert(compassPulse.includes('pulseHint') && compassPulse.includes('cw-pulse-cta'), 'Kompass saknar pulse CTA');

const tasksPulse = mustExist('src/widgets/pack/DailyTasksWidget.tsx');
assert(tasksPulse.includes('pulseHint') && tasksPulse.includes('cw-pulse-cta'), 'Uppgifter saknar pulse CTA');

const labPulse = mustExist('src/widgets/pack/CompanionWidgetLabPage.tsx');
assert(labPulse.includes('Pulse CTA') || labPulse.includes('pulseDemo'), 'Lab saknar Pulse CTA-toggle');

assert(studioPage.includes('Dölj') || studioPage.includes('Visa'), 'Studio måste tipsa om Hem Dölj/Visa');

const harborPulse = mustExist('src/widgets/pack/SafeHarborWidget.tsx');
assert(harborPulse.includes('pulseHint') && harborPulse.includes('cw-pulse-cta'), 'Hamn saknar pulse CTA');

const journalPulse = mustExist('src/widgets/pack/JournalWidget.tsx');
assert(journalPulse.includes('pulseHint') && journalPulse.includes('cw-pulse-cta'), 'Journal saknar pulse CTA');

const anchorPulse = mustExist('src/widgets/pack/DailyAnchorWidget.tsx');
assert(anchorPulse.includes('pulseHint') && anchorPulse.includes('cw-pulse-cta'), 'Ankare saknar pulse CTA');

const captureProvider = mustExist(
  'android/app/src/main/java/com/livskompassen/app/widgets/CompanionCaptureWidgetProvider.java',
);
assert(captureProvider.includes('last_action_capture'), 'Capture-chip saknar scoped status-key');

const basta = mustExist('src/modules/core/home/basta-design/BastaDesignHome.tsx');
assert(basta.includes('CompanionHomeRail'), 'BastaDesignHome saknar CompanionHomeRail');

const homePage = mustExist('src/modules/core/pages/HomePage.tsx');
assert(homePage.includes('CompanionHomeRail'), 'HomePage saknar CompanionHomeRail');

const compass = mustExist('src/widgets/pack/CompassWidget.tsx');
assert(compass.includes('checkIn') || compass.includes('Check-in'), 'Kompass måste ha check-in');

const install = mustExist('src/modules/core/pages/InstallningarPage.tsx');
assert(install.includes('widget-studio'), 'Inställningar saknar länk till Widget Studio');
assert(install.includes('companion-widgets'), 'Inställningar måste nämna Companion-labb (DEV)');
assert(install.includes('import.meta.env.DEV'), 'Inställningar måste dölja labb i prod');
assert(install.includes('Widgets'), 'Inställningar saknar Android-widget-hjälp');


assert(qc.includes('autostart') && qc.includes('startRecording'), 'QuickCapture måste autostarta inspelning via prop');
assert(qc.includes('cw-capture-mic') || qc.includes('cw-capture-stage'), 'QuickCapture saknar mockup mic/stage');
assert(qc.includes('cw-capture-wave'), 'QuickCapture saknar waveform');

assert(note.includes('autoVoice') && note.includes('autoPhoto'), 'QuickNote måste stödja voice/photo deep-links');
assert(note.includes('cw-note-dock') || note.includes('cw-note-add'), 'QuickNote saknar mockup dock');
assert(note.includes('Annat'), 'QuickNote saknar Annat-pill (mockup)');

const surfaceAuto = mustExist('src/modules/features/widgets/pages/WidgetCompanionSurfacePage.tsx');
assert(surfaceAuto.includes('autostart={') || surfaceAuto.includes('autostart='), 'Surface måste skicka autostart till Capture');
assert(surfaceAuto.includes('autoVoice') && surfaceAuto.includes('autoPhoto'), 'Surface måste skicka note voice/photo');

assert(androidViews.includes('companionCapture') && androidViews.includes('companionNote'), 'WidgetViews saknar rich companion helpers');
assert(androidViews.includes('companionCompass') && androidViews.includes('companionBeacon'), 'WidgetViews saknar Compass/Beacon rich helpers');
assert(
  androidViews.includes('companionInbox') &&
    androidViews.includes('companionTasks') &&
    androidViews.includes('companionJournal'),
  'WidgetViews saknar Inbox/Tasks/Journal rich helpers',
);
assert(
  androidViews.includes('companionHarbor') &&
    androidViews.includes('companionAnchor') &&
    androidViews.includes('companionChild'),
  'WidgetViews saknar Harbor/Anchor/Child rich helpers',
);
assert(captureProvider.includes('companionCapture'), 'Capture provider måste använda rich layout');

const noteProvider = mustExist(
  'android/app/src/main/java/com/livskompassen/app/widgets/CompanionNoteWidgetProvider.java',
);
assert(noteProvider.includes('companionNote'), 'Note provider måste använda rich layout');

const compassProvider = mustExist(
  'android/app/src/main/java/com/livskompassen/app/widgets/CompanionCompassWidgetProvider.java',
);
assert(compassProvider.includes('companionCompass'), 'Compass provider måste använda rich layout (ej chip)');
assert(!compassProvider.includes('WidgetViews.chip('), 'Compass får inte använda chip()');

const beaconProvider = mustExist(
  'android/app/src/main/java/com/livskompassen/app/widgets/CompanionBeaconWidgetProvider.java',
);
assert(beaconProvider.includes('companionBeacon'), 'Beacon provider måste använda rich layout (ej chip)');
assert(!beaconProvider.includes('WidgetViews.chip('), 'Beacon får inte använda chip()');

const captureLayout = mustExist('android/app/src/main/res/layout/widget_companion_capture.xml');
assert(captureLayout.includes('widget_waveform_ethereal'), 'Capture saknar ethereal waveform');
assert(captureLayout.includes('widget_bg_gold_ring') || captureLayout.includes('gold_ring'), 'Capture saknar guldring');
assert(captureLayout.includes('widget_companion_capture_trust') || captureLayout.includes('trust'), 'Capture saknar trust-rad');
assert(captureLayout.includes('56dp') || captureLayout.includes('64dp'), 'Capture mic måste vara ≥56dp');

mustExist('android/app/src/main/res/layout/widget_companion_note.xml');
mustExist('android/app/src/main/res/layout/widget_companion_compass.xml');
mustExist('android/app/src/main/res/layout/widget_companion_beacon.xml');
mustExist('android/app/src/main/res/drawable/widget_waveform_ethereal.xml');
mustExist('android/app/src/main/res/drawable/widget_compass_disc.xml');
mustExist('android/app/src/main/res/values/colors.xml');

const captureInfo = mustExist('android/app/src/main/res/xml/widget_companion_capture_info.xml');
assert(captureInfo.includes('widget_companion_capture'), 'Capture info måste previewa rich layout');
assert(captureInfo.includes('250dp'), 'Capture info minWidth/Height måste vara Small 250×110');

const noteInfo = mustExist('android/app/src/main/res/xml/widget_companion_note_info.xml');
assert(noteInfo.includes('widget_companion_note') && noteInfo.includes('250dp'), 'Note info måste vara rich 250×110');

const compassInfo = mustExist('android/app/src/main/res/xml/widget_companion_compass_info.xml');
assert(compassInfo.includes('widget_companion_compass'), 'Compass info måste previewa rich layout');
assert(compassInfo.includes('250dp'), 'Compass info måste vara Large 250×250');

const beaconInfo = mustExist('android/app/src/main/res/xml/widget_companion_beacon_info.xml');
assert(beaconInfo.includes('widget_companion_beacon') && beaconInfo.includes('180dp'), 'Beacon info måste vara Medium 250×180');

const colors = mustExist('android/app/src/main/res/values/colors.xml');
assert(colors.includes('widget_ethereal') || colors.toLowerCase().includes('7ba3c9'), 'Android saknar ethereal color');
assert(colors.includes('D4AF37') || colors.includes('d4af37'), 'Android widget_gold ska vara premium #d4af37');

const compassTsx = mustExist('src/widgets/pack/CompassWidget.tsx');
assert(!compassTsx.includes('boxShadow: WidgetMaterial.glassLip'), 'Compass hero får inte overridea bloom med glassLip');

const cwCss = mustExist('src/widgets/companion-widgets.css');
assert(cwCss.includes('var(--cw-bloom') || cwCss.includes('--cw-bloom'), 'Studio Gold CSS måste använda --cw-bloom');

assert(studioPage.includes('maxBtn') && studioPage.includes('atCap'), 'Studio måste begränsa genvägar (guided max)');
assert(studioPage.includes('cw-signature') || studioPage.includes('lugn, fokus'), 'Studio måste ha Kap 6-signatur');

const richDoc = mustExist('docs/design/COMPANION-ANDROID-RICH-WIDGETS.md');
assert(richDoc.includes('G85') || richDoc.includes('Motorola'), 'Rich-doc måste ha G85 pin-copy');
assert(richDoc.includes('autostart'), 'Rich-doc måste nämna autostart');

assert(install.includes('G85') || install.includes('Motorola'), 'Inställningar måste ha G85 pin-copy');

const inboxProvider = mustExist(
  'android/app/src/main/java/com/livskompassen/app/widgets/CompanionInboxWidgetProvider.java',
);
assert(inboxProvider.includes('companionInbox'), 'Inbox provider måste använda rich layout');
assert(!inboxProvider.includes('WidgetViews.chip('), 'Inbox får inte använda chip()');

const tasksProvider = mustExist(
  'android/app/src/main/java/com/livskompassen/app/widgets/CompanionTasksWidgetProvider.java',
);
assert(tasksProvider.includes('companionTasks'), 'Tasks provider måste använda rich layout');

const journalProvider = mustExist(
  'android/app/src/main/java/com/livskompassen/app/widgets/CompanionJournalWidgetProvider.java',
);
assert(journalProvider.includes('companionJournal'), 'Journal provider måste använda rich layout');

const inboxLayout = mustExist('android/app/src/main/res/layout/widget_companion_inbox.xml');
assert(inboxLayout.includes('widget_companion_inbox_text'), 'Inbox saknar Text-knapp');
assert(inboxLayout.includes('widget_companion_inbox_voice'), 'Inbox saknar Röst-knapp');
assert(inboxLayout.includes('56dp'), 'Inbox knappar måste vara ≥56dp');

mustExist('android/app/src/main/res/layout/widget_companion_tasks.xml');
mustExist('android/app/src/main/res/layout/widget_companion_journal.xml');

const inboxInfoXml = mustExist('android/app/src/main/res/xml/widget_companion_inbox_info.xml');
assert(inboxInfoXml.includes('widget_companion_inbox') && inboxInfoXml.includes('250dp'), 'Inbox info måste vara Small 250×110');

const surfaceInbox = mustExist('src/modules/features/widgets/pages/WidgetCompanionSurfacePage.tsx');
assert(surfaceInbox.includes('autoText') && surfaceInbox.includes('autoLink'), 'Surface måste skicka inbox text/link');
assert(surfaceInbox.includes('autoWrite'), 'Surface måste skicka journal write');

const inboxTsx = mustExist('src/widgets/pack/InboxWidget.tsx');
assert(inboxTsx.includes('autoVoice') && inboxTsx.includes('autoPhoto'), 'Inbox måste stödja voice/photo deep-links');

const journalTsx = mustExist('src/widgets/pack/JournalWidget.tsx');
assert(journalTsx.includes('autoWrite'), 'Journal måste stödja write deep-link');

const harborProvider = mustExist(
  'android/app/src/main/java/com/livskompassen/app/widgets/CompanionHarborWidgetProvider.java',
);
assert(harborProvider.includes('companionHarbor') && !harborProvider.includes('WidgetViews.chip('), 'Harbor måste vara rich');

const anchorProvider = mustExist(
  'android/app/src/main/java/com/livskompassen/app/widgets/CompanionAnchorWidgetProvider.java',
);
assert(anchorProvider.includes('companionAnchor'), 'Anchor måste vara rich');

const childProvider = mustExist(
  'android/app/src/main/java/com/livskompassen/app/widgets/CompanionChildWidgetProvider.java',
);
assert(childProvider.includes('companionChild'), 'Child måste vara rich');

mustExist('android/app/src/main/res/layout/widget_companion_harbor.xml');
mustExist('android/app/src/main/res/layout/widget_companion_anchor.xml');
mustExist('android/app/src/main/res/layout/widget_companion_child.xml');

const childInfoXml = mustExist('android/app/src/main/res/xml/widget_companion_child_info.xml');
assert(childInfoXml.includes('180dp'), 'Child info måste vara Medium 250×180');

console.log('[smoke:companion-widgets] PASS — live rail + studio preview + Våg1–5 rich + Smart/AI');
