/**
 * Shared boot for Companion OS widget deep-link surfaces.
 */

import { bootWidgetFramework, setFrameworkTransport } from './WidgetFramework';
import { createCompanionSyncTransport } from './companionSyncTransport';
import { hydrateWidgetStudio } from '../studio/widgetStudioStore';
import { registerCorePack } from '../pack/registerCorePack';
import { applyWidgetTheme } from './WidgetTheme';
import { setWidgetModuleNavigator, setWidgetOverlayOpener } from './WidgetRouter';

export function bootCompanionSurface(rootId: string): void {
  const root = document.getElementById(rootId);
  applyWidgetTheme(root);
  registerCorePack();
  setFrameworkTransport(createCompanionSyncTransport());

  /* Ensure module/open buttons navigate for real (Android deep-link hosts). */
  setWidgetModuleNavigator((path) => {
    if (typeof window === 'undefined') return;
    window.location.assign(path);
  });
  setWidgetOverlayOpener(() => {
    /* Overlays stay in-widget; pack widgets use inline panels instead. */
  });

  void hydrateWidgetStudio().then(() => bootWidgetFramework({ root }));
}
