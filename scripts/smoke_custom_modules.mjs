/**
 * Smoke: Egna moduler W1–W5 (user_widgets motor + Hem-slot + Planering tab=bygg)
 * Usage: npm run smoke:custom-modules
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

console.log('[smoke:custom-modules] Contract + types…');
const types = readCanonical('src/modules/core/types/firestore.ts');
assert(types.includes("type: 'countdown'"), 'UserWidget saknar countdown');
assert(types.includes('pinnedToHome'), 'UserWidget saknar pinnedToHome');
assert(types.includes('slotId?'), 'UserWidget saknar slotId');
assert(types.includes("stylePreset?"), 'UserWidget saknar stylePreset');
assert(types.includes("status?: UserWidgetStatus"), 'UserWidget saknar status');
assert(types.includes('schemaVersion?'), 'UserWidget saknar schemaVersion');
assert(types.includes('targetDateTime?'), 'config saknar targetDateTime');
assert(types.includes('caption?'), 'config saknar caption');
assert(types.includes('backgroundPath?'), 'config saknar backgroundPath');

console.log('[smoke:custom-modules] CRUD helpers…');
const fsApi = readCanonical('src/modules/core/firebase/firestore.ts');
assert(fsApi.includes('saveUserWidget'), 'saveUserWidget saknas');
assert(fsApi.includes('updateUserWidgetMeta'), 'updateUserWidgetMeta saknas');
assert(fsApi.includes('archiveUserWidget'), 'archiveUserWidget saknas');
assert(fsApi.includes('subscribeUserWidgets'), 'subscribeUserWidgets saknas');
assert(fsApi.includes('schemaVersion'), 'save/subscribe mappar schemaVersion');

console.log('[smoke:custom-modules] Style presets + MVP types…');
const presets = readCanonical('src/modules/features/widgets/config/widgetStylePresets.ts');
for (const id of ['midnight', 'gold_glass', 'photo_dim', 'minimal', 'celebration', 'focus']) {
  assert(presets.includes(id), `style preset saknas: ${id}`);
}
assert(presets.includes('label_sv'), 'presets saknar label_sv');
const mvp = readCanonical('src/modules/features/widgets/config/widgetMvpTypes.ts');
assert(mvp.includes('WIDGET_MVP_TYPES'), 'WIDGET_MVP_TYPES saknas');
assert(mvp.includes("'countdown'"), 'MVP saknar countdown');

const norm = readCanonical('src/modules/features/widgets/utils/normalizeUserWidget.ts');
assert(norm.includes('normalizeUserWidget'), 'normalizeUserWidget saknas');
assert(norm.includes('USER_WIDGET_HOME_SLOT_ID'), 'HOME_SLOT konstant saknas');

console.log('[smoke:custom-modules] UI surfaces…');
const board = readCanonical('src/modules/features/widgets/components/WidgetModulerBoard.tsx');
assert(board.includes('WidgetModulerBoard'), 'WidgetModulerBoard saknas');
assert(board.includes('archiveUserWidget'), 'Board ska arkivera (archive-first)');
assert(board.includes("!== 'archived'"), 'Board filtrerar archived');

const add = readCanonical('src/modules/features/widgets/components/WidgetModulerAddForm.tsx');
assert(add.includes('CONTENT_TEMPLATES') || add.includes('semester'), 'AddForm saknar mallgalleri');
assert(add.includes('Experimentera') || add.includes('experimentMode'), 'AddForm saknar Experimentera');
assert(add.includes('hem.brass.below-grid') || add.includes('USER_WIDGET_HOME_SLOT_ID') || add.includes('pinToHome'), 'AddForm saknar pin-to-home');
assert(add.includes('Förhandsvisning') || add.includes('previewWidget'), 'AddForm saknar live-preview');
assert(add.includes('capacity'), 'AddForm saknar capacity prop');

console.log('[smoke:custom-modules] Kapacitetsgate…');
const capacity = readCanonical('src/modules/features/widgets/utils/widgetBuildCapacity.ts');
assert(capacity.includes('resolveWidgetBuildCapacity'), 'resolveWidgetBuildCapacity saknas');
assert(capacity.includes('canExperiment'), 'capacity saknar canExperiment');
assert(capacity.includes('WIDGET_BUILD_EXPERIMENT_MIN_LEVEL'), 'MIN_LEVEL saknas');
assert(board.includes('resolveWidgetBuildCapacity'), 'Board ska använda capacity-gate');
assert(board.includes('listenToEvolutionHub'), 'Board ska lyssna på evolution_hub');

const renderer = readCanonical('src/modules/features/widgets/components/HomeWidgetRenderer.tsx');
assert(renderer.includes('HomeWidgetRenderer'), 'HomeWidgetRenderer saknas');
assert(renderer.includes('resolveWidgetStylePreset'), 'Renderer ska använda style presets');
assert(renderer.includes('caption') || renderer.includes('description'), 'Renderer ska visa caption');
assert(renderer.includes('backgroundPath') || renderer.includes('widget-home-module__bg'), 'Renderer ska stödja bakgrund');

const homeSlot = readCanonical('src/modules/core/home/UserWidgetHomeSlot.tsx');
assert(homeSlot.includes('UserWidgetHomeSlot'), 'UserWidgetHomeSlot saknas');
assert(homeSlot.includes('subscribeUserWidgets'), 'HomeSlot ska prenumerera');
assert(homeSlot.includes('readOnly'), 'HomeSlot ska vara read-only');

const homeLayout = readCanonical('src/modules/core/home/HomeLayoutA.tsx');
assert(homeLayout.includes('UserWidgetHomeSlot'), 'HomeLayoutA ska montera UserWidgetHomeSlot');
assert(homeLayout.includes('PinnedPlaneringModuleSlot'), 'HomeLayoutA behåller PinnedPlaneringModuleSlot');
const pinIdx = homeLayout.indexOf('PinnedPlaneringModuleSlot');
const uwIdx = homeLayout.indexOf('UserWidgetHomeSlot');
assert(uwIdx > pinIdx, 'UserWidgetHomeSlot ska monteras EFTER PinnedPlaneringModuleSlot');

console.log('[smoke:custom-modules] Planering tab=bygg…');
const planTypes = readCanonical('src/modules/features/admin/planning/types.ts');
assert(planTypes.includes("'bygg'"), 'PlaneringTab saknar bygg');
const hubCfg = readCanonical('src/modules/features/admin/planning/planeringHubConfig.ts');
assert(hubCfg.includes('bygg'), 'PLANERING_VIEW_TITLES/parse saknar bygg');
const planPage = readCanonical('src/modules/features/admin/planning/components/PlaneringPage.tsx');
assert(planPage.includes("case 'bygg'"), 'PlaneringPage saknar case bygg');
assert(planPage.includes('WidgetModulerBoard'), 'PlaneringPage ska bädda in WidgetModulerBoard');
const drawer = readCanonical('src/modules/features/admin/planning/components/VerktygDrawer.tsx');
assert(drawer.includes("id: 'bygg'"), 'VerktygDrawer EXTRA_TOOLS saknar bygg');

console.log('[smoke:custom-modules] Rules (kod, ej deploy)…');
const rules = readCanonical('firestore.rules');
assert(rules.includes('isValidUserWidgetCreate'), 'firestore.rules saknar isValidUserWidgetCreate');
assert(rules.includes('isValidUserWidgetUpdate'), 'firestore.rules saknar isValidUserWidgetUpdate');
assert(rules.includes("status == 'archived'"), 'delete ska kräva archived (eller legacy)');
const storage = readCanonical('storage.rules');
assert(storage.includes('module_media/{userId}/{allPaths=**}'), 'storage.rules saknar module_media');
assert(storage.includes('2 * 1024 * 1024') || storage.includes('2097152'), 'module_media size gate');
assert(storage.includes('image/(jpeg|png|webp)'), 'module_media MIME gate');

console.log('[smoke:custom-modules] PASS');
