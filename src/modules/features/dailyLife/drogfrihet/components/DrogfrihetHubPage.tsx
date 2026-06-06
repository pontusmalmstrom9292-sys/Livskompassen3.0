import { BookOpen, HeartHandshake, Shield, Sparkles } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { BentoCard } from '@/shared/ui/BentoCard';
import { TabBar, type TabBarItem } from '@/core/ui/TabBar';
import { useStore } from '@/core/store';
import { DROGFRIHET_CARDS } from '../content/drogfrihetCatalog';
import { DROGFRIHET_FACTS } from '../constants/kunskapFacts';
import { DROGFRIHET_DISCLAIMER, DROGFRIHET_RESOURCES } from '../constants/resources';
import { pickDrogfrihetIdag } from '../lib/pickDrogfrihetIdag';
import { DrogfrihetCounterBadge } from './DrogfrihetCounterBadge';

export type DrogfrihetTab = 'idag' | 'resurser' | 'reflektion' | 'kunskap';

const DROGFRIHET_SUBTABS: TabBarItem<DrogfrihetTab>[] = [
  { id: 'idag', label: 'Idag', icon: <Sparkles className="h-3 w-3" /> },
  { id: 'resurser', label: 'Stöd', icon: <Shield className="h-3 w-3" /> },
  { id: 'reflektion', label: 'Reflektion', icon: <HeartHandshake className="h-3 w-3" /> },
  { id: 'kunskap', label: 'Kunskap', icon: <BookOpen className="h-3 w-3" /> },
];

const VALID_DROGFRIHET_TABS = new Set<DrogfrihetTab>(DROGFRIHET_SUBTABS.map((t) => t.id));

type DrogfrihetHubPageProps = {
  /** Inbäddad i Familjehubben — utan egen HubPageShell-rubrik. */
  embedded?: boolean;
};

function useDrogfrihetSubTab(embedded: boolean) {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramKey = embedded ? 'drogfrihetTab' : 'tab';
  const rawTab = searchParams.get(paramKey);
  const tab: DrogfrihetTab =
    rawTab && VALID_DROGFRIHET_TABS.has(rawTab as DrogfrihetTab)
      ? (rawTab as DrogfrihetTab)
      : 'idag';

  const setTab = useCallback(
    (next: DrogfrihetTab) => {
      setSearchParams(
        (prev) => {
          const nextParams = new URLSearchParams(prev);
          if (next === 'idag') nextParams.delete(paramKey);
          else nextParams.set(paramKey, next);
          return nextParams;
        },
        { replace: true },
      );
    },
    [setSearchParams, paramKey],
  );

  return { tabs: DROGFRIHET_SUBTABS, tab, setTab };
}

export function DrogfrihetHubPage({ embedded = false }: DrogfrihetHubPageProps = {}) {
  const { tabs, tab, setTab } = useDrogfrihetSubTab(embedded);
  const user = useStore((s) => s.user);
  const idag = useMemo(() => pickDrogfrihetIdag({ uid: user?.uid }), [user?.uid]);
  const [reflectionIndex, setReflectionIndex] = useState(0);

  const reflectionCard = DROGFRIHET_CARDS[reflectionIndex % DROGFRIHET_CARDS.length]!;

  const body = (
    <>
      <TabBar<DrogfrihetTab>
        tabs={tabs}
        active={tab}
        onChange={(id) => setTab(id)}
      />

      {tab === 'idag' && (
        <>
          <DrogfrihetCounterBadge uid={user?.uid} />
          <BentoCard title="Idag" icon={<HeartHandshake className="h-4 w-4" />} glow="green">
            <div className="home-module-panel__question-box">
              <p className="text-base text-accent">{idag.card.text_sv}</p>
              <p className="mt-2 text-xs text-text-dim">
                Ett kort hela dagen ({idag.dateKey}). Inget fel svar — ett ord räcker om du skriver.
              </p>
            </div>
            <p className="mt-3 text-xs text-text-muted">{DROGFRIHET_DISCLAIMER}</p>
          </BentoCard>
        </>
      )}

      {tab === 'resurser' && (
        <div className="space-y-3">
          {DROGFRIHET_RESOURCES.map((r) => (
            <BentoCard key={r.id} title={r.title_sv} icon={<Shield className="h-4 w-4" />} glow="green">
              <p className="text-sm text-text-muted">{r.body_sv}</p>
              {r.href ? (
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm text-accent hover:underline"
                >
                  Öppna
                </a>
              ) : null}
            </BentoCard>
          ))}
          <p className="text-xs text-text-dim">{DROGFRIHET_DISCLAIMER}</p>
        </div>
      )}

      {tab === 'reflektion' && (
        <BentoCard title="Reflektion" icon={<HeartHandshake className="h-4 w-4" />} glow="green">
          <div className="home-module-panel__question-box">
            <p className="text-base text-accent">{reflectionCard.text_sv}</p>
            <p className="mt-2 text-xs text-text-dim">Inget fel svar — ett ord räcker.</p>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="btn-pill--secondary flex-1"
              onClick={() =>
                setReflectionIndex((i) => (i + 1) % DROGFRIHET_CARDS.length)
              }
            >
              Nästa kort
            </button>
          </div>
          <p className="mt-3 text-xs text-text-muted">
            {DROGFRIHET_CARDS.length} kort i poolen — inga poäng, ingen missad dag.
          </p>
        </BentoCard>
      )}

      {tab === 'kunskap' && (
        <div className="space-y-3">
          <p className="text-xs text-text-muted">
            Statisk fakta från Kunskap-seed — ingen live-sökning i Kunskapsvalvet här.
          </p>
          {DROGFRIHET_FACTS.map((f) => (
            <BentoCard key={f.id} title={f.title_sv}>
              <p className="text-sm text-text-muted">{f.content_sv}</p>
              <p className="mt-2 text-[10px] text-text-dim">
                {f.citation_hint} · tier {f.source_tier}
              </p>
            </BentoCard>
          ))}
          <p className="text-sm text-text-muted">
            Mer fakta bakom PIN:{' '}
            <a href="/valvet?vaultTab=kunskapsbank" className="text-accent hover:underline">
              Valv → Kunskapsbank
            </a>
          </p>
        </div>
      )}
    </>
  );

  if (embedded) {
    return <div className="space-y-4">{body}</div>;
  }

  return (
    <HubPageShell
      eyebrow="Drogfrihet"
      title="Nykterhet · ett steg i taget"
      lead="Dagräknare, reflektion och fakta — nollställning bara under Inställningar. Akut: 113."
    >
      {body}
    </HubPageShell>
  );
}
