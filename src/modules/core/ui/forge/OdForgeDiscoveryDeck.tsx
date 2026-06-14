import { KompassDiscoveryDeck } from '@/features/dailyLife/wellbeing/compasses/components/KompassDiscoveryDeck';
import type { DiscoveryCategoryId } from '@/features/dailyLife/wellbeing/compasses/content/discoveryBentoCatalog';

type Props = {
  onSelect: (categoryId: DiscoveryCategoryId) => void;
};

/** Forge Theme Lab — dämpade bento-accenter för utvecklings-deck. */
export function OdForgeDiscoveryDeck({ onSelect }: Props) {
  return <KompassDiscoveryDeck variant="forge" onSelect={onSelect} />;
}
