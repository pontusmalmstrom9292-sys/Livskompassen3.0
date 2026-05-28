import { ChromeV4Icon, type ChromeV4Category } from './chromeIcons';

type IconProps = { className?: string };

/** L1 — v4 chrome (D1-skiva + glyph) endast i hem-kompassen (HOME-HERO-KANON). */

function HeroChromeIcon({ category, className }: IconProps & { category: ChromeV4Category }) {
  return <ChromeV4Icon category={category} className={className} />;
}

export function HeroRutinerIcon({ className }: IconProps) {
  return <HeroChromeIcon category="rutiner" className={className} />;
}

export function HeroEkonomiIcon({ className }: IconProps) {
  return <HeroChromeIcon category="ekonomi" className={className} />;
}

export function HeroUtvecklingIcon({ className }: IconProps) {
  return <HeroChromeIcon category="utveckling" className={className} />;
}

export function HeroKunskapIcon({ className }: IconProps) {
  return <HeroChromeIcon category="kunskap" className={className} />;
}

export function HeroPlaneringIcon({ className }: IconProps) {
  return <HeroChromeIcon category="planering" className={className} />;
}

export function HeroFamiljenIcon({ className }: IconProps) {
  return <HeroChromeIcon category="familjen" className={className} />;
}

export function HeroDagbokIcon({ className }: IconProps) {
  return <HeroChromeIcon category="dagbok" className={className} />;
}

export function HeroValvIcon({ className }: IconProps) {
  return <HeroChromeIcon category="valv" className={className} />;
}

export const HERO_ORBIT_ICONS = {
  rutiner: HeroRutinerIcon,
  ekonomi: HeroEkonomiIcon,
  mabra: HeroUtvecklingIcon,
  kunskap: HeroKunskapIcon,
  planering: HeroPlaneringIcon,
  familjen: HeroFamiljenIcon,
  dagbok: HeroDagbokIcon,
  valv: HeroValvIcon,
} as const;
