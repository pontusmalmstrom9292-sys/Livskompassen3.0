import type { CalmCardGlow } from '@/shared/ui/BentoCard';
import type { DiscoveryAccent } from '../content/discoveryBentoCatalog';

const ACCENT_GLOW: Record<DiscoveryAccent, CalmCardGlow> = {
  gold: 'gold',
  amber: 'gold',
  bronze: 'gold',
  copper: 'gold',
  sand: 'gold',
  pearl: 'gold',
  slate: 'blue',
  mist: 'blue',
  ash: 'blue',
  'rose-dim': 'blue',
  moss: 'green',
  'sea-dim': 'green',
};

export function discoveryAccentGlow(accent: DiscoveryAccent): CalmCardGlow {
  return ACCENT_GLOW[accent];
}

/** CSS glow-klass för deck-knappar (samma mapping som BentoCard). */
export function discoveryAccentGlowClass(accent: DiscoveryAccent): string {
  const glow = discoveryAccentGlow(accent);
  if (glow === 'gold') return 'glow-bottom-gold';
  if (glow === 'green') return 'glow-bottom-green';
  return 'glow-bottom-blue';
}
