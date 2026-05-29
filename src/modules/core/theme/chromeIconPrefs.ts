export type ChromeIconStyle = 'g1' | 'g2' | 'g3' | 'g4' | 'g5';

export type AppIconVariant = 'p6' | 'p7-alpha' | 'p8-alpha';

export type HeroVisualVariant = 'classic' | 'orbit-h1-full' | 'orbit-h1-alpha';

const CHROME_KEY = 'lk.chromeIconStyle';
const APP_ICON_KEY = 'lk.appIconVariant';
const HERO_VISUAL_KEY = 'lk.heroVisual';

export function getChromeIconStyle(): ChromeIconStyle {
  if (typeof window === 'undefined') return 'g1';
  const v = localStorage.getItem(CHROME_KEY);
  if (v === 'g2' || v === 'g3' || v === 'g4' || v === 'g5') return v;
  return 'g1';
}

export function setChromeIconStyle(style: ChromeIconStyle): void {
  localStorage.setItem(CHROME_KEY, style);
}

export function getAppIconVariant(): AppIconVariant {
  if (typeof window === 'undefined') return 'p6';
  const v = localStorage.getItem(APP_ICON_KEY);
  if (v === 'p7-alpha' || v === 'p8-alpha') return v;
  return 'p6';
}

export function setAppIconVariant(variant: AppIconVariant): void {
  localStorage.setItem(APP_ICON_KEY, variant);
}

export function getHeroVisualVariant(): HeroVisualVariant {
  if (typeof window === 'undefined') return 'classic';
  const v = localStorage.getItem(HERO_VISUAL_KEY);
  if (v === 'orbit-h1-full' || v === 'orbit-h1-alpha') return v;
  return 'classic';
}

export function setHeroVisualVariant(variant: HeroVisualVariant): void {
  localStorage.setItem(HERO_VISUAL_KEY, variant);
}
