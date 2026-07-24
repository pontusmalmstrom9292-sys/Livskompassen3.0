import { useState } from 'react';
import { clsx } from 'clsx';
import {
  BookOpen,
  Brain,
  ChevronDown,
  Compass,
  Heart,
  HelpCircle,
  Layers,
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
  zone?: FreeportZoneId;
  selectedCardId: string | null;
  lowCapacity?: boolean;
  onSelectCard: (card: HemV3DevCard) => void;
  /** Kanon Hem v3 — ihopfällt som standard, 12 kategorier vid expand */
  collapsible?: boolean;
  /** Visa alla 12 kort (ej zonfiltrerat) — låst Hem-rail */
  fullRail?: boolean;
  executiveSkin?: boolean;
  /** Prod-mönster: Compass + Utforska i kompassmodulen (ej float-dock) */
  compassLinked?: boolean;
  /** @deprecated Använd compassLinked */
  floatDock?: boolean;
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
      card.actionLabel === 'Mabra'
    );
  }
  return card.to.includes('familjen') || card.actionLabel === 'Familjen' || card.actionLabel === 'Trygg Hamn';
}

export function FreeportDiscoveryCards({
  zone = 'hjartat',
  selectedCardId,
  lowCapacity = false,
  onSelectCard,
  collapsible = false,
  fullRail = false,
  executiveSkin = false,
  compassLinked = false,
  floatDock = false,
}: Props) {
  const [railOpen, setRailOpen] = useState(false);

  let pool = filterDevelopmentCardsForPreset(HEM_V3_DEVELOPMENT_CARDS, 'foralder_trygg');
  if (!fullRail) {
    pool = pool.filter((c) => cardMatchesZone(c, zone));
  }

  if (lowCapacity) {
    const calm = new Set<string>(HEM_V3_LOW_CAPACITY_CARD_IDS);
    const filtered = pool.filter((c) => calm.has(c.id));
    pool = filtered.length > 0 ? filtered : pool.slice(0, 4);
  }

  const selected = pool.find((c) => c.id === selectedCardId) ?? null;

  if (pool.length === 0) {
    return (
      <p className="design-freeport__hint mt-2">Inga kort för denna zon i nuvarande pool.</p>
    );
  }

  const grid = (
    <div
      className={clsx(
        executiveSkin ? 'design-freeport__exec-dev-rail' : 'design-freeport__cards',
      )}
      role="list"
      aria-label={`${pool.length} utvecklingskategorier`}
    >
      {pool.map((card) => {
        const Icon = iconForCard(card);
        return (
          <button
            key={card.id}
            type="button"
            role="listitem"
            className={clsx(
              executiveSkin ? 'design-freeport__exec-dev-card' : 'design-freeport__card',
              selectedCardId === card.id &&
                (executiveSkin
                  ? 'design-freeport__exec-dev-card--on'
                  : 'design-freeport__card--on'),
            )}
            onClick={() => onSelectCard(card)}
          >
            {executiveSkin ? (
              <>
                <span className="design-freeport__exec-dev-cat">{card.title}</span>
                <span className="design-freeport__exec-dev-hint">{card.hint}</span>
              </>
            ) : (
              <>
                <span className="design-freeport__card-icon" aria-hidden>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="design-freeport__card-badge">{card.hint}</span>
                <p className="design-freeport__card-title">{card.title}</p>
                <p className="design-freeport__card-preview">
                  {card.body.length > 72 ? `${card.body.slice(0, 72)}…` : card.body}
                </p>
                <span className="design-freeport__card-action">{card.actionLabel} →</span>
              </>
            )}
          </button>
        );
      })}
    </div>
  );

  const detail = selected ? (
    <article
      className={clsx(
        executiveSkin
          ? 'design-freeport__exec-dev-detail'
          : 'design-freeport__card-detail mt-3',
      )}
    >
      <p className={executiveSkin ? 'design-freeport__exec-dev-detail-body' : undefined}>
        {selected.body}
      </p>
      <p
        className={
          executiveSkin ? 'design-freeport__exec-dev-detail-meta' : 'design-freeport__hint mt-2'
        }
      >
        {selected.title} · {selected.hint} · {selected.actionLabel}
      </p>
    </article>
  ) : null;

  if (!collapsible) {
    return (
      <>
        {grid}
        {detail}
      </>
    );
  }

  const menuChip = (
    <button
      type="button"
      className={clsx(
        compassLinked
          ? 'design-freeport__exec-kompass-explore'
          : floatDock
            ? 'design-freeport__exec-dev-menu'
            : executiveSkin
              ? 'design-freeport__exec-rail-toggle'
              : 'design-freeport__rail-toggle',
        floatDock && railOpen && 'design-freeport__exec-dev-menu--open',
        compassLinked && railOpen && 'design-freeport__exec-kompass-explore--open',
      )}
      aria-expanded={railOpen}
      aria-label={
        compassLinked
          ? railOpen
            ? 'Dölj utvecklingskort'
            : `Utforska ${pool.length} kategorier`
          : railOpen
            ? 'Dölj utvecklingskort'
            : `Visa ${pool.length} utvecklingskategorier`
      }
      onClick={() => setRailOpen((v) => !v)}
    >
      {compassLinked ? (
        <>
          <Compass className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          <span>Utforska</span>
          <span className="design-freeport__exec-kompass-explore-count">{pool.length}</span>
          <ChevronDown
            className={clsx(
              'design-freeport__exec-kompass-explore-chevron',
              railOpen && 'design-freeport__exec-kompass-explore-chevron--open',
            )}
            strokeWidth={1.5}
            aria-hidden
          />
        </>
      ) : floatDock ? (
        <>
          <Layers className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          <span className="design-freeport__exec-dev-menu-label">Utveckling</span>
          <span className="design-freeport__exec-dev-menu-count">{pool.length}</span>
          <ChevronDown
            className={clsx(
              'design-freeport__exec-dev-menu-chevron',
              railOpen && 'design-freeport__exec-dev-menu-chevron--open',
            )}
            strokeWidth={1.5}
            aria-hidden
          />
        </>
      ) : (
        <>
          <span>{railOpen ? 'Dölj kategorier' : `Visa ${pool.length} kategorier`}</span>
          <ChevronDown
            className={clsx('h-3.5 w-3.5 transition-transform', railOpen && 'rotate-180')}
            aria-hidden
          />
        </>
      )}
    </button>
  );

  const body = (
    <div
      className={clsx(
        'design-freeport__dev-rail',
        floatDock && 'design-freeport__dev-rail--float',
        compassLinked && 'design-freeport__dev-rail--kompass',
      )}
      aria-label="Utvecklingskort"
    >
      {!floatDock && !compassLinked ? (
        <p className={executiveSkin ? 'design-freeport__exec-dev-rail-lead' : 'design-freeport__hint'}>
          {lowCapacity
            ? 'Låg kapacitet — lugna kategorier. Ett kort i taget.'
            : 'Välj en kategori — ett mikrosteg, ingen prestation.'}
        </p>
      ) : null}
      <div
        className={clsx(
          floatDock && 'design-freeport__exec-dev-float-bar',
          floatDock && railOpen && 'design-freeport__exec-dev-float-bar--open',
          compassLinked && 'design-freeport__exec-kompass-explore-wrap',
        )}
      >
        {menuChip}
        {floatDock && selected && !railOpen ? (
          <span className="design-freeport__exec-dev-float-picked">{selected.title}</span>
        ) : null}
      </div>
      {railOpen ? (
        <div
          className={clsx(
            floatDock && 'design-freeport__exec-dev-float-panel',
            compassLinked && 'design-freeport__exec-kompass-deck',
          )}
        >
          {grid}
        </div>
      ) : null}
      {detail}
    </div>
  );

  if (floatDock) {
    return <div className="design-freeport__exec-dev-float">{body}</div>;
  }

  return body;
}
