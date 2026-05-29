import { ChromeV5Icon, type ChromeV5Category } from './chromeIcons';

type IconProps = { className?: string };

function HeroChromeIcon({ category, className }: IconProps & { category: ChromeV5Category }) {
  return <ChromeV5Icon category={category} className={className} />;
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
