import { clsx } from 'clsx';
import {
  BookOpen,
  Brain,
  Heart,
  HelpCircle,
  Leaf,
  Shield,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import {
  filterDevelopmentCardsForPreset,
  HEM_V3_DEVELOPMENT_CARDS,
  HEM_V3_LOW_CAPACITY_CARD_IDS,
  type HemV3DevCard,
} from '@/core/home/hemV3DevelopmentCards';
import type { FreeportZoneId } from '../freeportZones';

type Props = {
  zone: FreeportZoneId;
  selectedCardId: string | null;
  lowCapacity?: boolean;
  onSelectCard: (card: HemV3DevCard) => void;
};

const HINT_ICONS: Record<string, LucideIcon> = {
  Mikrosteg: Sparkles,
  Reflektion: BookOpen,
  Kropp: Leaf,
  BIFF: Shield,
  Speglar: Brain,
  Plan: Leaf,
  Fråga: HelpCircle,
  Familj: Heart,
};

function iconForCard(card: HemV3DevCard): LucideIcon {
  return HINT_ICONS[card.hint] ?? Sparkles;
}

function cardMatchesZone(card: HemV3DevCard, zone: FreeportZoneId): boolean {
  if (zone === 'hjartat') {
    return card.to.includes('hjartat') || card.actionLabel === 'Dagbok' || card.actionLabel === 'Speglar';
  }
  if (zone === 'vardagen') {
    return (
      card.to.includes('planering') ||
      card.to.includes('mabra') ||
      card.to.includes('vardagen') ||
      card.actionLabel === 'Planering' ||
      card.actionLabel === 'MåBra'
    );
  }
  return card.to.includes('familjen') || card.actionLabel === 'Familjen' || card.actionLabel === 'Trygg Hamn';
}

export function FreeportDiscoveryCards({
  zone,
  selectedCardId,
  lowCapacity = false,
  onSelectCard,
}: Props) {
  let pool = filterDevelopmentCardsForPreset(HEM_V3_DEVELOPMENT_CARDS, 'foralder_trygg').filter((c) =>
    cardMatchesZone(c, zone),
  );

  if (lowCapacity) {
    const calm = new Set<string>(HEM_V3_LOW_CAPACITY_CARD_IDS);
    const filtered = pool.filter((c) => calm.has(c.id));
    pool = filtered.length > 0 ? filtered : pool.slice(0, 4);
  }

  if (pool.length === 0) {
    return (
      <p className="design-freeport__hint mt-2">Inga kort för denna zon i nuvarande pool.</p>
    );
  }

  return (
    <div className="design-freeport__cards" role="list">
      {pool.map((card) => {
        const Icon = iconForCard(card);
        return (
          <button
            key={card.id}
            type="button"
            role="listitem"
            className={clsx(
              'design-freeport__card',
              selectedCardId === card.id && 'design-freeport__card--on',
            )}
            onClick={() => onSelectCard(card)}
          >
            <span className="design-freeport__card-icon" aria-hidden>
              <Icon className="h-4 w-4" />
            </span>
            <span className="design-freeport__card-badge">{card.hint}</span>
            <p className="design-freeport__card-title">{card.title}</p>
            <p className="design-freeport__card-preview">
              {card.body.length > 72 ? `${card.body.slice(0, 72)}…` : card.body}
            </p>
            <span className="design-freeport__card-action">{card.actionLabel} →</span>
          </button>
        );
      })}
    </div>
  );
}
