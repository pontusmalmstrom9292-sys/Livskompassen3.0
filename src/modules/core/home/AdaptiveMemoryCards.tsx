import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, ButtonLink } from '@/design-system';
import { useStore } from '../store';
import { getRecentCheckIns, getJournalEntries } from '../firebase/firestore';
import { getLatestKasamAggregation } from '../firebase/kasamAggregationFirestore';
import { filterAdaptiveCardsForPreset, type LifeHubPresetId } from '../lifeOs/lifeHubPresets';
import {
  buildAdaptiveMemoryCards,
  type AdaptiveMemoryCard,
} from './compassAdaptiveCards';
import { buildProactiveTriggerCards } from './homeProactiveTriggers';
import { useEvolutionStore } from '../store/useEvolutionStore';
import { HubPanelSkeleton } from '../ui/HubPanelSkeleton';
import { EmptyState } from '../ui/EmptyState';

const toneClass: Record<AdaptiveMemoryCard['tone'], string> = {
  gold: 'adaptive-card--gold',
  indigo: 'adaptive-card--indigo',
  lavender: 'adaptive-card--lavender',
  emerald: 'adaptive-card--emerald',
};

export function AdaptiveMemoryCards({
  refreshKey = 0,
  presetId = 'foralder_trygg',
}: {
  refreshKey?: number;
  presetId?: LifeHubPresetId;
}) {
  const user = useStore((s) => s.user);
  const evolutionDoc = useEvolutionStore((s) => s.doc);
  const location = useLocation();
  const [cards, setCards] = useState<AdaptiveMemoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const initialVisibleCount = cards.length > 3 ? 1 : 2;
  const visibleCards = expanded ? cards : cards.slice(0, initialVisibleCount);

  const load = useCallback(async () => {
    if (!user) {
      setCards([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const checkins = await getRecentCheckIns(user.uid, 24);
      const built = buildAdaptiveMemoryCards(checkins, { omitCompassPrompts: true });
      const journal = await getJournalEntries(user.uid);
      const today = new Date().toISOString().slice(0, 10);
      const hasJournalToday = journal.some((e) => e.createdAt?.slice(0, 10) === today);
      const latestKasam = await getLatestKasamAggregation(user.uid).catch(() => null);
      const proactive = buildProactiveTriggerCards({
        evolutionDoc,
        hasJournalToday,
        presetId,
        latestKasam,
        dayOfWeek: new Date().getDay(),
      });
      const merged = [...proactive, ...built];
      setCards(filterAdaptiveCardsForPreset(merged, presetId));
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, [user, presetId, evolutionDoc]);

  useEffect(() => {
    load();
  }, [load, location.pathname, refreshKey]);

  if (!user) return null;

  return (
    <section className="space-y-3" aria-label="Anpassade minneskort">
      {loading ? (
        <HubPanelSkeleton label="Laddar minneskort…" lines={3} />
      ) : cards.length === 0 ? (
        <EmptyState message="Inga anpassade kort just nu — kom tillbaka efter en check-in eller reflektion." />
      ) : (
        <>
          <div className="adaptive-card-grid">
            {visibleCards.map((card) => (
              <article
                key={card.id}
                className={`adaptive-card rounded-2xl border p-4 ${toneClass[card.tone]}`}
              >
                <p className="text-[10px] uppercase tracking-widest text-text-muted">{card.title}</p>
                <p className="mt-2 text-sm text-text-muted">{card.prompt}</p>
                <ButtonLink
                  to={{
                    pathname: card.to,
                    search: card.search ?? '',
                    hash: card.hash ? `#${card.hash.replace(/^#/, '')}` : '',
                  }}
                  variant="ghost"
                  className="mt-3 inline-flex text-xs"
                >
                  {card.actionLabel}
                </ButtonLink>
              </article>
            ))}
          </div>
          {cards.length > initialVisibleCount ? (
            <Button variant="ghost" size="sm" onClick={() => setExpanded((v) => !v)}>
              {expanded ? 'Visa färre' : `Visa mer (${cards.length - initialVisibleCount})`}
            </Button>
          ) : null}
        </>
      )}
    </section>
  );
}
