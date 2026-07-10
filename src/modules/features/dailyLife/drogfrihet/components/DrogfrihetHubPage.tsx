import { BookOpen, Brain, HeartHandshake, Shield, Sparkles, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Modal, textStyles } from '@/design-system';
import { HubPageShell } from '@/core/layout/HubPageShell';
import {
  immersiveModalOverlayClass,
  immersiveModalPanelClass,
} from '@/core/ui/zenModeOverlayClasses';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { BentoCard } from '@/shared/ui/BentoCard';
import { TabBar, type TabBarItem } from '@/core/ui/TabBar';
import { useStore } from '@/core/store';
import { RecoveryRealityCheckForm } from '@/features/mabra/components/RecoveryRealityCheckForm';
import { RecoveryTwelveStepJournal } from '@/features/mabra/components/RecoveryTwelveStepJournal';
import { RecoveryUrgeSosModule } from '@/features/mabra/components/RecoveryUrgeSosModule';
import { DROGFRIHET_CARDS } from '../content/drogfrihetCatalog';
import { DROGFRIHET_FACTS } from '../constants/kunskapFacts';
import { DROGFRIHET_DISCLAIMER, DROGFRIHET_RESOURCES } from '../constants/resources';
import { pickDrogfrihetIdag } from '../lib/pickDrogfrihetIdag';
import { DrogfrihetCounterBadge } from './DrogfrihetCounterBadge';

export type DrogfrihetTab = 'idag' | 'resurser' | 'reflektion' | 'kunskap' | 'steg';

const DROGFRIHET_SUBTABS: TabBarItem<DrogfrihetTab>[] = [
  { id: 'idag', label: 'Idag', icon: <Sparkles className="h-3 w-3" /> },
  { id: 'steg', label: '12 steg', icon: <BookOpen className="h-3 w-3" /> },
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
  const [realityCheckOpen, setRealityCheckOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);

  const reflectionCard = DROGFRIHET_CARDS[reflectionIndex % DROGFRIHET_CARDS.length]!;

  const body = (
    <>
      <div className="flex justify-end">
        <ModuleHelpFromRegistry moduleId="drogfrihet" mode={tab} />
      </div>
      <TabBar<DrogfrihetTab>
        tabs={tabs}
        active={tab}
        onChange={(id) => setTab(id)}
      />

      {tab === 'idag' && (
        <>
          <DrogfrihetCounterBadge uid={user?.uid} />
          <Button
            variant="secondary"
            onClick={() => setSosOpen(true)}
            className="w-full text-sm uppercase tracking-[0.14em]"
          >
            SOS — sug nu
          </Button>
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

      {tab === 'steg' && (
        <BentoCard title="12-steg journal" icon={<BookOpen className="h-4 w-4" />} glow="green">
          <RecoveryTwelveStepJournal userId={user?.uid} />
        </BentoCard>
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
        <>
          <BentoCard title="Reflektion" icon={<HeartHandshake className="h-4 w-4" />} glow="green">
            <div className="home-module-panel__question-box">
              <p className="text-base text-accent">{reflectionCard.text_sv}</p>
              <p className="mt-2 text-xs text-text-dim">Inget fel svar — ett ord räcker.</p>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() =>
                  setReflectionIndex((i) => (i + 1) % DROGFRIHET_CARDS.length)
                }
              >
                Nästa kort
              </Button>
            </div>
            <p className="mt-3 text-xs text-text-muted">
              {DROGFRIHET_CARDS.length} kort i poolen — inga poäng, ingen missad dag.
            </p>
          </BentoCard>

          <section className="rounded-2xl border-[0.5px] border-border bg-gradient-to-br from-surface-2/80 via-surface to-surface-2 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 space-y-1">
                <p className={`flex items-center gap-2 ${textStyles.eyebrow}`}>
                  <Brain className="h-3 w-3 shrink-0 text-accent/70" strokeWidth={1.5} aria-hidden />
                  Verklighetskontroll
                </p>
                <p className="text-sm text-text-muted">
                  KBT — granska en tanke steg för steg. Sparas i Vit-zonen, inte Valv.
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={() => setRealityCheckOpen(true)}
                className="shrink-0 text-xs uppercase tracking-[0.14em]"
              >
                Öppna
              </Button>
            </div>
          </section>
        </>
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

  const realityCheckOverlay = (
    <Modal
      open={realityCheckOpen}
      onClose={() => setRealityCheckOpen(false)}
      hideHeader
      ariaLabel="Verklighetskontroll"
      className={`${immersiveModalOverlayClass} !z-[60]`}
      panelClassName={`${immersiveModalPanelClass} !bg-gradient-to-b !from-bg !via-surface !to-surface-2`}
    >
      <div className="flex h-full min-h-[100dvh] flex-col">
        <header className="flex shrink-0 items-center justify-between border-b-[0.5px] border-border px-4 py-3 sm:px-6">
          <p className={textStyles.eyebrow}>Verklighetskontroll</p>
          <button
            type="button"
            onClick={() => setRealityCheckOpen(false)}
            className="rounded-xl border-[0.5px] border-border/60 p-2 text-text-muted transition-colors hover:border-accent/30 hover:bg-surface-3 hover:text-text"
            aria-label="Stäng verklighetskontroll"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </header>
        <div className="calm-scroll-island flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
          <RecoveryRealityCheckForm
            userId={user?.uid}
            onComplete={() => setRealityCheckOpen(false)}
          />
        </div>
      </div>
    </Modal>
  );

  const sosOverlay = sosOpen ? <RecoveryUrgeSosModule onClose={() => setSosOpen(false)} /> : null;

  if (embedded) {
    return (
      <div className="space-y-4">
        {body}
        {realityCheckOverlay}
        {sosOverlay}
      </div>
    );
  }

  return (
    <HubPageShell
      eyebrow="Drogfrihet"
      title="Nykterhet · ett steg i taget"
      lead="Dagräknare, reflektion och fakta — nollställning bara under Inställningar. Akut: 113."
    >
      {body}
      {realityCheckOverlay}
      {sosOverlay}
    </HubPageShell>
  );
}
