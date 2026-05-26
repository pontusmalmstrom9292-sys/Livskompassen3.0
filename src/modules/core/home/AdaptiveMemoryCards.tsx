import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Loader2, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { getRecentCheckIns } from '../firebase/firestore';
import { filterAdaptiveCardsForPreset, type LifeHubPresetId } from '../lifeOs/lifeHubPresets';
import {
  buildAdaptiveMemoryCards,
  type AdaptiveMemoryCard,
} from './compassAdaptiveCards';

const toneBorder: Record<AdaptiveMemoryCard['tone'], string> = {
  gold: 'border-gold/25 bg-gold/5',
  indigo: 'border-indigo-400/25 bg-indigo-500/5',
  lavender: 'border-violet-400/25 bg-violet-500/5',
  emerald: 'border-accent/25 bg-accent/5',
};

export function AdaptiveMemoryCards({
  refreshKey = 0,
  presetId = 'foralder_trygg',
}: {
  refreshKey?: number;
  presetId?: LifeHubPresetId;
}) {
  const user = useStore((s) => s.user);
  const location = useLocation();
  const [cards, setCards] = useState<AdaptiveMemoryCard[]>([]);
  const [loading, setLoading] = useState(true);

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
      setCards(filterAdaptiveCardsForPreset(built, presetId));
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, [user, presetId]);

  useEffect(() => {
    load();
  }, [load, location.pathname, refreshKey]);

  if (!user) return null;

  return (
    <section className="space-y-3" aria-label="Anpassade minneskort">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-accent" strokeWidth={1.75} />
        <h3 className="font-display text-sm font-semibold text-text">För dig just nu</h3>
      </div>
      <p className="text-xs text-text-dim">
        Små frågor och uppgifter — baserat på dina svar i Kompasser idag.
      </p>

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
        </p>
      ) : (
        <div className="adaptive-card-grid">
          {cards.map((card) => (
            <article
              key={card.id}
              className={`adaptive-card rounded-2xl border p-4 ${toneBorder[card.tone]}`}
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
      )}
    </section>
  );
}
