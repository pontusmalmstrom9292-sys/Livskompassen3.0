/**
 * Widget Studio types — WIDGET_BIBLE Kapitel 5.1
 */

import type { WidgetSize } from '../core/WidgetFramework';

export type StudioMaterial = 'sapphire' | 'matte_metal';
export type StudioAccent = 'gold' | 'ethereal' | 'muted';
export type StudioAnimation = 'breathe' | 'slow_rotate' | 'static';

export type StudioModuleKey =
  | 'inkast'
  | 'dagbok'
  | 'fyren'
  | 'hamn'
  | 'barn'
  | 'planering'
  | 'kompass'
  | 'mabra';

export type StudioInfoFlags = {
  showEnergy: boolean;
  showStress: boolean;
  showCapacity: boolean;
  showSleep: boolean;
};

export type StudioShortcutId = 'text' | 'voice' | 'photo' | 'link' | 'video';

export type WidgetStudioConfig = {
  widgetId: string;
  enabled: boolean;
  /** Prefer on Hem rail (max 2 — clamped in store). */
  homePin: boolean;
  size: WidgetSize;
  moduleKey: StudioModuleKey;
  material: StudioMaterial;
  accent: StudioAccent;
  animation: StudioAnimation;
  info: StudioInfoFlags;
  shortcuts: StudioShortcutId[];
};

export type WidgetStudioState = {
  version: 1;
  updatedAt: number;
  /** Global smart layer toggles */
  smartTimeEnabled: boolean;
  smartAiEnabled: boolean;
  widgets: Record<string, WidgetStudioConfig>;
};

export const STUDIO_CACHE_KEY = 'studio:state';

export const STUDIO_ACCENTS: StudioAccent[] = ['gold', 'ethereal', 'muted'];
export const STUDIO_MATERIALS: StudioMaterial[] = ['sapphire', 'matte_metal'];
export const STUDIO_ANIMATIONS: StudioAnimation[] = ['breathe', 'slow_rotate', 'static'];
export const STUDIO_MODULES: { id: StudioModuleKey; label: string }[] = [
  { id: 'inkast', label: 'Inkast' },
  { id: 'dagbok', label: 'Dagbok' },
  { id: 'fyren', label: 'Fyren' },
  { id: 'hamn', label: 'Trygg Hamn' },
  { id: 'barn', label: 'Familjen' },
  { id: 'planering', label: 'Planering' },
  { id: 'kompass', label: 'Kompassen' },
  { id: 'mabra', label: 'MåBra' },
];
