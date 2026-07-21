/**
 * Guided Customization — frihet inom trygga ramar (WIDGET_BIBLE 5.2 / UX Law 05).
 * Never allows configs that break 56 dp touch or neon accents.
 */

import type { WidgetSize } from '../core/WidgetFramework';
import type {
  StudioAccent,
  StudioAnimation,
  StudioMaterial,
  StudioShortcutId,
  WidgetStudioConfig,
} from './widgetStudioTypes';
import { STUDIO_ACCENTS, STUDIO_ANIMATIONS, STUDIO_MATERIALS } from './widgetStudioTypes';

/** Stable pack order for pin clamp (avoid importing registerCorePack — circular). */
const PIN_ORDER = [
  'quick_capture',
  'compass',
  'quick_note',
  'inbox',
  'daily_anchor',
  'child_focus',
  'beacon',
  'daily_tasks',
  'journal',
  'safe_harbor',
] as const;

/** Max shortcuts that still fit 56 dp targets per size (bible 4.1 + Law 05). */
export function maxShortcutsForSize(size: WidgetSize): number {
  switch (size) {
    case 'xs':
      return 1;
    case 'small':
      return 3;
    case 'medium':
      return 4;
    case 'large':
      return 6;
    default:
      return 3;
  }
}

export function clampShortcuts(
  shortcuts: StudioShortcutId[],
  size: WidgetSize,
): StudioShortcutId[] {
  const max = maxShortcutsForSize(size);
  const unique = Array.from(new Set(shortcuts));
  return unique.slice(0, max);
}

export function isSafeAccent(accent: string): accent is StudioAccent {
  return (STUDIO_ACCENTS as string[]).includes(accent);
}

export function isSafeMaterial(material: string): material is StudioMaterial {
  return (STUDIO_MATERIALS as string[]).includes(material);
}

export function isSafeAnimation(animation: string): animation is StudioAnimation {
  return (STUDIO_ANIMATIONS as string[]).includes(animation);
}

/**
 * Sanitize any partial config so it can never violate UX Laws.
 * Neon / unknown values fall back to gold + sapphire + static.
 */
export function guideWidgetConfig(input: WidgetStudioConfig): WidgetStudioConfig {
  const size = input.size;
  const accent = isSafeAccent(input.accent) ? input.accent : 'gold';
  const material = isSafeMaterial(input.material) ? input.material : 'sapphire';
  const animation = isSafeAnimation(input.animation) ? input.animation : 'static';

  return {
    ...input,
    size,
    accent,
    material,
    animation,
    homePin: Boolean(input.homePin),
    shortcuts: clampShortcuts(input.shortcuts ?? [], size),
    info: {
      showEnergy: Boolean(input.info?.showEnergy),
      showStress: Boolean(input.info?.showStress),
      showCapacity: Boolean(input.info?.showCapacity ?? true),
      showSleep: Boolean(input.info?.showSleep),
    },
  };
}

export function defaultConfigForWidget(
  widgetId: string,
  defaults: Partial<WidgetStudioConfig> & { size: WidgetSize; moduleKey: WidgetStudioConfig['moduleKey'] },
): WidgetStudioConfig {
  return guideWidgetConfig({
    widgetId,
    enabled: defaults.enabled ?? true,
    homePin: defaults.homePin ?? false,
    size: defaults.size,
    moduleKey: defaults.moduleKey,
    material: defaults.material ?? 'sapphire',
    accent: defaults.accent ?? 'gold',
    animation: defaults.animation ?? 'static',
    info: defaults.info ?? {
      showEnergy: true,
      showStress: true,
      showCapacity: true,
      showSleep: true,
    },
    shortcuts: defaults.shortcuts ?? ['text', 'voice', 'photo'],
  });
}

/** Max widgets pinned to Hem — keeps rail calm (UX Law: one job). */
export const MAX_HOME_PINS = 2;

/**
 * Keep at most MAX_HOME_PINS homePin flags (stable pack order).
 */
export function clampHomePins(
  widgets: Record<string, WidgetStudioConfig>,
  preferId?: string,
): Record<string, WidgetStudioConfig> {
  const pinned = Object.entries(widgets)
    .filter(([, cfg]) => cfg.homePin)
    .map(([id]) => id);
  if (pinned.length <= MAX_HOME_PINS) {
    return widgets;
  }
  const packOrder = [...PIN_ORDER, ...pinned.filter((id) => !(PIN_ORDER as readonly string[]).includes(id))];
  const stable = packOrder.filter((id) => pinned.includes(id));
  const ordered =
    preferId && pinned.includes(preferId)
      ? [preferId, ...stable.filter((id) => id !== preferId)]
      : stable;
  const keep = new Set(ordered.slice(0, MAX_HOME_PINS));
  const next: Record<string, WidgetStudioConfig> = { ...widgets };
  for (const id of pinned) {
    if (!keep.has(id) && next[id]) {
      next[id] = { ...next[id], homePin: false };
    }
  }
  return next;
}
