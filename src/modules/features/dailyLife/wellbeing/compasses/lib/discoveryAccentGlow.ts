import type { CalmCardGlow } from '@/shared/ui/BentoCard';
import type { DiscoveryAccent } from '../content/discoveryBentoCatalog';

const ACCENT_GLOW: Record<DiscoveryAccent, CalmCardGlow> = {
  gold: 'gold',
  amber: 'gold',
  bronze: 'gold',
  copper: 'gold',
  sand: 'gold',
  pearl: 'gold',
  slate: 'gold',
  mist: 'gold',
  ash: 'gold',
  'rose-dim': 'gold',
  moss: 'gold',
  'sea-dim': 'gold',
};

export function discoveryAccentGlow(accent: DiscoveryAccent): CalmCardGlow {
  return ACCENT_GLOW[accent];
}

/** CSS glow-klass — disabled app-wide (returns empty). */
export function discoveryAccentGlowClass(accent: DiscoveryAccent): string {
  void accent;
  return '';
}
