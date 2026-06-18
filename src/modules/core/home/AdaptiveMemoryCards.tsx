import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { getRecentCheckIns, getJournalEntries } from '../firebase/firestore';
import { filterAdaptiveCardsForPreset, type LifeHubPresetId } from '../lifeOs/lifeHubPresets';
import {
  buildAdaptiveMemoryCards,
  type AdaptiveMemoryCard,
} from './compassAdaptiveCards';
import { buildProactiveTriggerCards } from './homeProactiveTriggers';
import { useEvolutionStore } from '../store/useEvolutionStore';

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
      const proactive = buildProactiveTriggerCards({
        evolutionDoc,
        hasJournalToday,
        presetId,
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
      <div className="flex items-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} aria-hidden />
        <h3 className="font-display-serif text-[10px] font-semibold uppercase tracking-[0.2em] text-text-dim">
          För dig just nu
        </h3>
      </div>
      <p className="text-xs text-text-dim">
        Små frågor och uppgifter — baserat på dina svar i Kompasser idag.
      </p>

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
        </p>
      ) : (
        <>
          <div className="adaptive-card-grid">
            {visibleCards.map((card) => (
              <article
                key={card.id}
                className={`adaptive-card rounded-2xl border p-4 ${toneClass[card.tone]}`}
              >
                <p className="text-[10px] uppercase tracking-widest text-text-dim">{card.title}</p>
                <p className="mt-2 text-sm text-text-muted">{card.prompt}</p>
                <Link
                  to={{
                    pathname: card.to,
                    search: card.search ?? '',
                    hash: card.hash ? `#${card.hash.replace(/^#/, '')}` : '',
                  }}
                  className="btn-pill--ghost mt-3 inline-flex text-xs"
                >
                  {card.actionLabel}
                </Link>
              </article>
            ))}
          </div>
          {cards.length > initialVisibleCount ? (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="btn-pill--ghost text-xs"
            >
              {expanded ? 'Visa färre' : `Visa mer (${cards.length - initialVisibleCount})`}
            </button>
          ) : null}
        </>
      )}
    </section>
  );
}
