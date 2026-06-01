import { HeartHandshake, Shield } from 'lucide-react';
import { useMemo, useState } from 'react';
import { HubPageShell } from '../../core/layout/HubPageShell';
import { BentoCard } from '@/shared/ui/BentoCard';
import { TabBar, type TabBarItem } from '../../core/ui/TabBar';
import { useStore } from '../../core/store';
import { useHubTab } from '../../core/navigation/hooks/useHubTab';
import { DROGFRIHET_CARDS } from '../content/drogfrihetCatalog';
import { DROGFRIHET_FACTS } from '../constants/kunskapFacts';
import { DROGFRIHET_DISCLAIMER, DROGFRIHET_RESOURCES } from '../constants/resources';
import { pickDrogfrihetIdag } from '../lib/pickDrogfrihetIdag';
import { DrogfrihetCounterBadge } from './DrogfrihetCounterBadge';

export type DrogfrihetTab = 'idag' | 'resurser' | 'reflektion' | 'kunskap';

export function DrogfrihetHubPage() {
  const { tabs, activeTab, setTab } = useHubTab('drogfrihet');
  const tab = activeTab as DrogfrihetTab;
  const user = useStore((s) => s.user);
  const idag = useMemo(() => pickDrogfrihetIdag({ uid: user?.uid }), [user?.uid]);
  const [reflectionIndex, setReflectionIndex] = useState(0);

  const reflectionCard = DROGFRIHET_CARDS[reflectionIndex % DROGFRIHET_CARDS.length]!;

  return (
    <HubPageShell
      eyebrow="Drogfrihet"
      title="Nykterhet · ett steg i taget"
      lead="Dagräknare, reflektion och fakta — nollställning bara under Inställningar. Akut: 113."
    >
      <TabBar<DrogfrihetTab>
        tabs={tabs as TabBarItem<DrogfrihetTab>[]}
        active={tab}
        onChange={(id) => setTab(id)}
      />

      {tab === 'idag' && (
        <>
          <DrogfrihetCounterBadge uid={user?.uid} />
        <BentoCard title="Idag" icon={<HeartHandshake className="h-4 w-4" />}>
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
            <BentoCard key={r.id} title={r.title_sv} icon={<Shield className="h-4 w-4" />}>
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
        <BentoCard title="Reflektion" icon={<HeartHandshake className="h-4 w-4" />}>
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
            <a href="/dagbok?tab=bevis&vaultTab=kunskapsbank" className="text-accent hover:underline">
              Valv → Kunskapsbank
            </a>
          </p>
        </div>
      )}
    </HubPageShell>
  );
}
