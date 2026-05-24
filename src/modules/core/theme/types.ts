export type ThemeBackground =
  | 'gradient'
  | 'texture-stone'
  | 'texture-marble'
  | 'aurora'
  | 'nautical';

export type ThemePack = {
  id: string;
  label: string;
  description: string;
  background: ThemeBackground;
  cssVars: Record<string, string>;
  preview?: string;
};

export type ThemeMode = 'auto' | 'manual';
