export type ThemeBackground =
  | 'gradient'
  | 'texture-stone'
  | 'texture-marble'
  | 'aurora'
  | 'nautical'
  | 'obsidian'
  | 'mockup-scenic'
  | 'mockup-warm'
  | 'mockup-aurora';

import type { DesignPackId } from '../design/designPackMeta';

export type ThemePack = {
  id: string;
  label: string;
  description: string;
  background: ThemeBackground;
  cssVars: Record<string, string>;
  preview?: string;
  /** Helapp chrome — header, dock, kort, drawer (Theme Lab designpaket). */
  designPackId?: DesignPackId;
};

export type ThemeMode = 'auto' | 'manual';
