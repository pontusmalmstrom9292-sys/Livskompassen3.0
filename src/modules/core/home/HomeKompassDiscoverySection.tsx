import { clsx } from 'clsx';
import { ChevronDown, Compass } from 'lucide-react';
import { useState } from 'react';
import { KompassDiscoveryCardFlow } from '@/features/dailyLife/wellbeing/compasses/components/KompassDiscoveryCardFlow';
import { KompassDiscoveryDeck } from '@/features/dailyLife/wellbeing/compasses/components/KompassDiscoveryDeck';
import type { DiscoveryCategoryId } from '@/features/dailyLife/wellbeing/compasses/content/discoveryBentoCatalog';

type Props = {
  userId?: string;
  className?: string;
  onFlowActiveChange?: (active: boolean) => void;
};

/** Utforska → bento-deck → ett kort — alla hem-teman (ej Forge-dublett). */
export function HomeKompassDiscoverySection({
  userId,
  className,
  onFlowActiveChange,
}: Props) {
  const [deckOpen, setDeckOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<DiscoveryCategoryId | null>(null);

  const closeFlow = () => {
    setActiveCategory(null);
    setDeckOpen(false);
    onFlowActiveChange?.(false);
  };

  const openCategory = (categoryId: DiscoveryCategoryId) => {
    setActiveCategory(categoryId);
    setDeckOpen(false);
    onFlowActiveChange?.(true);
  };

  if (activeCategory) {
    return (
      <div className={clsx('home-kompass-discovery px-4 pb-4', className)}>
        <KompassDiscoveryCardFlow
          userId={userId}
          categoryId={activeCategory}
          variant="default"
          onBack={() => {
            setActiveCategory(null);
            onFlowActiveChange?.(false);
          }}
          onDone={closeFlow}
        />
      </div>
    );
  }

  return (
    <div className={clsx('home-kompass-discovery px-4 pb-4', className)}>
      <button
        type="button"
          className={clsx(
            'home-kompass-discovery__explore calm-card bento-card !rounded-[14px] border-[2px] border-accent/22',
            deckOpen && 'home-kompass-discovery__explore--open glow-bottom-gold',
          )}
        aria-expanded={deckOpen}
        onClick={() => setDeckOpen((v) => !v)}
      >
        <Compass className="h-3.5 w-3.5 text-accent/90" strokeWidth={1.5} aria-hidden />
        Utforska
        <ChevronDown
          className={clsx(
            'home-kompass-discovery__explore-chevron',
            deckOpen && 'home-kompass-discovery__explore-chevron--open',
          )}
          strokeWidth={1.5}
          aria-hidden
        />
      </button>
      {deckOpen ? (
        <KompassDiscoveryDeck variant="default" className="mt-3" onSelect={openCategory} />
      ) : null}
    </div>
  );
}
