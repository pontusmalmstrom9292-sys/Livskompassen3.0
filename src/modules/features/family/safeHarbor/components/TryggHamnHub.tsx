import { memo, useState, useEffect } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { ButtonLink } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { TabBar } from '@/core/ui/TabBar';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { KompassradPanel } from '@/features/dailyLife/wellbeing/compasses/components/KompassradPanel';
import { BiffPublicPanel } from './BiffPublicPanel';
import { hjartatTabHref } from '@/core/navigation/appNavigation';
import { vaultDrawerPath } from '@/core/navigation/navTruth';
import { MaterialPackShortcuts, useLifeHubPreset } from '@/core/lifeOs';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { HamnModuleStack } from './HamnModuleStack';
import { markHamnSessionOpen } from '@/core/home/homeProactiveTriggers';
import {
  HAMN_BRUSFILTER_HINT,
  HAMN_BRUSFILTER_LEAD,
  HAMN_EMBEDDED_LEAD,
  HAMN_GREY_ROCK_LEAD,
} from '../hamnCopy';
import { HamnTaktikLexikonBro } from './HamnTaktikLexikonBro';

const HAMN_SUB_TABS = [
  { id: 'oversikt', label: 'Översikt' },
  { id: 'biff', label: 'BIFF' },
  { id: 'speglar', label: 'Speglar' },
  { id: 'barn', label: 'Barn' },
] as const;

type HamnSubTabId = (typeof HAMN_SUB_TABS)[number]['id'];

const VALID_HAMN_TABS = new Set<string>(HAMN_SUB_TABS.map((t) => t.id));

function resolveHamnSubTab(raw: string | null): HamnSubTabId {
  if (raw && VALID_HAMN_TABS.has(raw)) return raw as HamnSubTabId;
  return 'biff';
}

type Props = {
  initialMessage?: string;
  /** Inbäddad i Familjehubben — lokal flikstate, ingen ?tab-kollision med hubben. */
  embedded?: boolean;
};

/** B2 — primär: BIFF-triage. Sekundär: brusfilter, kompass, lexikon (CalmCollapsible + meta). */
function HamnBiffWorkflow({
  initialMessage,
  embeddedLead,
}: {
  initialMessage: string;
  embeddedLead?: boolean;
}) {
  return (
    <div className="space-y-3">
      <BentoCard glow="indigo" className="!px-4 !py-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-accent/80">Trygg hamn · BIFF</p>
        {embeddedLead ? (
          <p className="mt-1 text-xs text-text-dim">{HAMN_EMBEDDED_LEAD}</p>
        ) : (
          <p className="mt-1 text-xs text-text-dim">{HAMN_GREY_ROCK_LEAD}</p>
        )}
        <div className="mt-3">
          <BiffPublicPanel initialMessage={initialMessage} />
        </div>
      </BentoCard>

      <CalmCollapsible title="Brusfilter" meta="Före Grey Rock" defaultOpen={false} glow="blue">
        <p className="text-xs text-text-muted">{HAMN_BRUSFILTER_LEAD}</p>
        <p className="mt-2 text-xs text-text-muted" role="note">
          {HAMN_BRUSFILTER_HINT}
        </p>
        <ButtonLink to={hjartatTabHref('speglar')} variant="accent" className="mt-3 inline-flex text-xs">
          Öppna Speglar
        </ButtonLink>
      </CalmCollapsible>

      <CalmCollapsible title="Kompassråd" meta="Dygnsrytm" defaultOpen={false} glow="blue">
        <HamnModuleStack compassOnly biffPanel={null} />
      </CalmCollapsible>

      <CalmCollapsible title="Taktik-lexikon" meta="Metod · Valv-PIN" defaultOpen={false} glow="blue">
        <HamnTaktikLexikonBro />
      </CalmCollapsible>
    </div>
  );
}

/** D6 — Trygg Hamn hub. BIFF publikt; Analys via Valv-menyn. */
export const TryggHamnHub = memo(function TryggHamnHub({ initialMessage = '', embedded = false }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [embeddedTab, setEmbeddedTab] = useState<HamnSubTabId>('biff');
  const { preset } = useLifeHubPreset();

  useEffect(() => {
    markHamnSessionOpen();
  }, []);

  const urlHamTab = searchParams.get('hamTab');
  const subTab = embedded ? embeddedTab : resolveHamnSubTab(urlHamTab);

  const onSubTabChange = (id: string) => {
    if (embedded) {
      setEmbeddedTab(id as HamnSubTabId);
      return;
    }
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (id === 'biff') next.delete('hamTab');
        else next.set('hamTab', id);
        return next;
      },
      { replace: true },
    );
  };

  if (searchParams.get('tab') === 'analys') {
    return <Navigate to={vaultDrawerPath('hamn_analys')} replace />;
  }

  if (embedded) {
    return (
      <div className="calm-scroll-island familjen-tab-surface space-y-4">
        <div className="flex justify-end">
          <ModuleHelpFromRegistry moduleId="hamn" />
        </div>
        <HamnBiffWorkflow initialMessage={initialMessage} embeddedLead />
      </div>
    );
  }

  return (
    <div className="familjen-tab-surface space-y-4">
      <div className="flex items-start justify-between gap-2">
        <MaterialPackShortcuts preset={preset} hub="hamn" />
        <ModuleHelpFromRegistry moduleId="hub_hamn" preset={preset} />
      </div>
      <TabBar tabs={[...HAMN_SUB_TABS]} active={subTab} onChange={onSubTabChange} />

      {subTab === 'oversikt' && (
        <div className="space-y-4">
          <KompassradPanel />
          <p className="text-xs text-text-dim">
            BIFF och Grey Rock finns under fliken BIFF. Brusfilter (logistik vs beten) visas efter analys.
            Riskanalys och bevis under Valv → Hamn · Analys.
          </p>
          <CalmCollapsible title="Modulstack" meta="Kompass + BIFF" defaultOpen={false} glow="blue">
            <HamnModuleStack biffPanel={<BiffPublicPanel initialMessage={initialMessage} />} />
          </CalmCollapsible>
          <CalmCollapsible title="Taktik-lexikon" meta="Metod · Valv-PIN" defaultOpen={false} glow="blue">
            <HamnTaktikLexikonBro />
          </CalmCollapsible>
        </div>
      )}

      {subTab === 'biff' && <HamnBiffWorkflow initialMessage={initialMessage} />}

      {subTab === 'speglar' && (
        <BentoCard glow="indigo" className="!p-4 text-sm text-text-muted">
          <p className="text-text-dim">
            Akut känslovalidering (ACT) och bevisjämförelse — innan du formulerar svar här.
          </p>
          <ButtonLink to={hjartatTabHref('speglar')} variant="accent" className="mt-3 inline-flex text-xs">
            Öppna Speglar
          </ButtonLink>
        </BentoCard>
      )}

      {subTab === 'barn' && (
        <BentoCard glow="indigo" className="!p-4 text-sm text-text-muted">
          <p className="text-text-dim">
            Barnfokus och minnesankare ligger i Familjen — separat från ex-kommunikation.
          </p>
          <ButtonLink to="/familjen?tab=reflektion" variant="accent" className="mt-3 inline-flex text-xs">
            Öppna Familjen
          </ButtonLink>
        </BentoCard>
      )}
    </div>
  );
});
