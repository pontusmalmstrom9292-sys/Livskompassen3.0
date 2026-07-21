/** @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET.md
 * Companion Widget OS — public barrel (WIDGET_BIBLE kap 3). */

export {
  WidgetPalette,
  WidgetMaterial,
  WidgetTouch,
  WidgetType,
  WidgetCssVars,
  applyWidgetTheme,
  getSapphireCardSurface,
  WIDGET_THEME_VERSION,
} from './core/WidgetTheme';

export {
  hydrateWidgetCache,
  getCached,
  setCached,
  enqueueSyncItem,
  listSyncQueue,
  subscribeWidgetCache,
} from './core/WidgetCache';

export {
  dispatchWidgetGesture,
  triggerWidgetHaptic,
  onWidgetAction,
  createLongPressController,
} from './core/WidgetActions';

export {
  queueWidgetSync,
  flushWidgetSyncQueue,
  bindWidgetSyncLifecycle,
  setWidgetSyncTransport,
  subscribeWidgetSyncStatus,
} from './core/WidgetSync';

export {
  bootWidgetFramework,
  registerWidget,
  mountWidget,
  listWidgets,
  subscribeWidgetFramework,
  setFrameworkTransport,
} from './core/WidgetFramework';
export type { WidgetDefinition, WidgetSize, WidgetLevel } from './core/WidgetFramework';

export {
  resolveWidgetRoute,
  routeWidgetAction,
  setWidgetModuleNavigator,
  setWidgetOverlayOpener,
} from './core/WidgetRouter';

export {
  WidgetMotion,
  WidgetAnimClass,
  playPressAnimation,
  playCompassRotate,
  setBreatheActive,
  prefersReducedMotion,
} from './core/WidgetAnimations';

export {
  ensureWidgetMedia,
  requestWidgetMicrophone,
  requestWidgetCamera,
  releaseMediaStream,
  queryWidgetPermission,
} from './core/WidgetPermissions';

export { WidgetCard } from './components/WidgetCard';
export { WidgetGlass } from './components/WidgetGlass';
export { WidgetButton } from './components/WidgetButton';
export { WidgetHeader } from './components/WidgetHeader';
export { WidgetProgress } from './components/WidgetProgress';
export { WidgetQuickAction } from './components/WidgetQuickAction';
export { WidgetMoodCheckIn, moodFaceLabel } from './components/WidgetMoodCheckIn';
export type { MoodFaceId } from './components/WidgetMoodCheckIn';

export { useCompanionOnline } from './core/useCompanionOnline';
export { softFocusWidgetControl } from './core/softFocusWidgetControl';
export { createCompanionSyncTransport, companionScopeFromSource } from './core/companionSyncTransport';
export { blobToVoicePayload, uploadCompanionVoice } from './core/companionVoiceUpload';
export { fileToPhotoPayload, uploadCompanionPhoto } from './core/companionPhotoUpload';
export type { CompanionAndroidScope } from './core/companionWidgetBridge';
export { pushCompanionWidgetStatus, flushCompanionWidgetStatus } from './core/companionWidgetBridge';
export { finishCompanionCapture } from './core/finishCompanionCapture';
export { formatBarnfokusCaptureText } from './core/companionBarnText';
export { registerCorePack, CORE_PACK_DEFINITIONS } from './pack/registerCorePack';
export { CompanionWidgetLabPage } from './pack/CompanionWidgetLabPage';
export { CompanionHomeRail } from './pack/CompanionHomeRail';
export { WidgetStudioPage } from './studio/WidgetStudioPage';
export { resolveHomeSurface } from './smart/resolveHomeSurface';
export { useCompanionSurface } from './smart/useCompanionSurface';
export {
  readCompanionAiSignals,
  getBarnveckaPref,
  setBarnveckaPref,
  applyJournalMoodToSignals,
  STUDIO_SIGNAL_OVERRIDE_KEY,
} from './smart/readCompanionSignals';
export { WidgetSyncStatusChip } from './components/WidgetSyncStatusChip';
export { useWidgetSyncStatus } from './core/useWidgetSyncStatus';
export { hydrateWidgetStudio, getWidgetStudioState, resetStudioToCalmDefaults } from './studio/widgetStudioStore';
export { WidgetStudioModePanel } from './studio/WidgetStudioModePanel';
