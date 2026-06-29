import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Layers } from 'lucide-react';
import { clsx } from 'clsx';
import { useStore } from '../store';
import { useEvolutionStore } from '../store/useEvolutionStore';
import { useCapacityScore, useListenToCapacityState } from '../store/useCapacityGate';
import { useLifeHubPreset } from '../lifeOs/useLifeHubPreset';
import {
  filterDevelopmentCardsForPreset,
  HEM_V3_DEVELOPMENT_CARDS,
  HEM_V3_LOW_CAPACITY_CARD_IDS,
  type HemV3DevCard,
} from './hemV3DevelopmentCards';
import { isLowHomeCapacity } from './homeCapacityGate';

type Props = {
  /** Öppna rail efter kompass-sparning (ett steg i taget). */
  refreshKey?: number;
};

export function HemV3DevelopmentRail({ refreshKey = 0 }: Props) {
  const user = useStore((s) => s.user);
  const evolutionDoc = useEvolutionStore((s) => s.doc);
  const listenToEvolutionHub = useEvolutionStore((s) => s.listenToEvolutionHub);
  const capacityScore = useCapacityScore();
  const listenToCapacityState = useListenToCapacityState();
  const { presetId } = useLifeHubPreset();

  const lowCapacity = isLowHomeCapacity(evolutionDoc, capacityScore);

  const pool = useMemo(() => {
    const filtered = filterDevelopmentCardsForPreset(HEM_V3_DEVELOPMENT_CARDS, presetId);
    if (!lowCapacity) return filtered;
    const priority = new Set<string>(HEM_V3_LOW_CAPACITY_CARD_IDS);
    const calm = filtered.filter((c) => priority.has(c.id));
    return calm.length > 0 ? calm : filtered.slice(0, 4);
  }, [presetId, lowCapacity]);

  const [railOpen, setRailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    const unsubEvolution = listenToEvolutionHub(user.uid);
    const unsubCapacity = listenToCapacityState(user.uid);
    return () => {
      unsubEvolution();
      unsubCapacity();
    };
  }, [user?.uid, listenToEvolutionHub, listenToCapacityState]);

  useEffect(() => {
    if (lowCapacity) {
      setRailOpen(false);
      setSelectedId(null);
    }
  }, [lowCapacity, refreshKey]);

  const selected = pool.find((c) => c.id === selectedId) ?? null;

  const handleCard = useCallback((card: HemV3DevCard) => {
    setSelectedId(card.id);
    if (!railOpen) setRailOpen(true);
  }, [railOpen]);

  if (!user || pool.length === 0) return null;

  return (
    <section className="hem-v3-dev-rail space-y-3" aria-label="Utvecklingskort">
      <div className="flex items-center gap-2">
        <Layers className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} aria-hidden />
        <h3 className="font-display-serif text-[10px] font-semibold uppercase tracking-[0.2em] text-text-dim">
          Utvecklingskort
        </h3>
      </div>
      <p className="text-xs text-text-dim">
        {lowCapacity
          ? 'Låg kapacitet — fyra lugna kategorier. Ett kort i taget.'
          : 'Välj en kategori — ett mikrosteg, ingen prestation.'}
      </p>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/30 bg-surface-2/50 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted transition-colors hover:border-accent/30 hover:bg-surface-3/40"
        aria-expanded={railOpen}
        onClick={() => setRailOpen((v) => !v)}
      >
        <span>{railOpen ? 'Dölj kategorier' : `Visa ${pool.length} kategorier`}</span>
        <ChevronDown
          className={clsx('h-3.5 w-3.5 transition-transform', railOpen && 'rotate-180')}
          aria-hidden
        />
      </button>

      {railOpen ? (
        <div
          className="grid grid-cols-3 gap-2 sm:grid-cols-4"
          aria-label={`${pool.length} utvecklingskategorier`}
        >
          {pool.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCard(card)}
              className={clsx(
                'hem-v3-dev-rail__card rounded-xl border border-border/30 bg-surface-2/60 px-2 py-2.5 text-left transition-colors',
                'hover:border-accent/35 hover:bg-surface-3/50',
                selectedId === card.id && 'border-accent/40 bg-surface-3/60 shadow-[0_0_20px_-8px_rgba(212,175,55,0.35)]',
              )}
            >
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-text-dim">
                {card.title}
              </span>
              <span className="mt-0.5 block text-[9px] text-text-muted">{card.hint}</span>
            </button>
          ))}
        </div>
      ) : null}

      {selected ? (
        <article className="rounded-xl border border-accent/20 bg-surface-2/60 px-4 py-3">
          <p className="text-sm leading-relaxed text-text-muted">{selected.body}</p>
          <p className="mt-2 text-[10px] uppercase tracking-widest text-text-dim">
            {selected.title} · {selected.hint}
          </p>
          <Link
            to={{ pathname: selected.to, search: selected.search ?? '' }}
            className="ds-btn ds-btn--ghost mt-3 inline-flex text-xs"
          >
            {selected.actionLabel}
          </Link>
        </article>
      ) : null}
    </section>
  );
}
