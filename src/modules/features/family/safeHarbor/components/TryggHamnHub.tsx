import { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { TabBar } from '@/core/ui/TabBar';
import { KompassradPanel } from '@/features/dailyLife/wellbeing/compasses/components/KompassradPanel';
import { BiffPublicPanel } from './BiffPublicPanel';
import { vaultDrawerPath } from '@/core/navigation/navTruth';
import { MaterialPackShortcuts, useLifeHubPreset } from '@/core/lifeOs';

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

/** D6 — Trygg Hamn hub. BIFF publikt; Analys via Valv-menyn. */
export function TryggHamnHub({ initialMessage = '', embedded = false }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [embeddedTab, setEmbeddedTab] = useState<HamnSubTabId>('biff');
  const { preset } = useLifeHubPreset();

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
    const vaultPath = vaultDrawerPath('hamn_analys');
    const qIndex = vaultPath.indexOf('?');
    const search = qIndex >= 0 ? vaultPath.slice(qIndex) : '';
    return <Navigate to={{ pathname: '/dagbok', search }} replace />;
  }

  // Om embedded, rendera endast BIFF-panelen för Obsidian Calm 2.0 (ingen TabBar)
  if (embedded) {
    return (
      <div className="calm-scroll-island">
        <BiffPublicPanel initialMessage={initialMessage} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!embedded && <MaterialPackShortcuts preset={preset} hub="hamn" />}
      <TabBar tabs={[...HAMN_SUB_TABS]} active={subTab} onChange={onSubTabChange} />

      {subTab === 'oversikt' && (
        <div className="space-y-4">
          {!embedded && <KompassradPanel />}
          <p className="text-xs text-text-dim">
            BIFF och Grey Rock finns under fliken BIFF. Riskanalys och bevis under Valv → Hamn · Analys.
          </p>
        </div>
      )}

      {subTab === 'biff' && (
        <div className="space-y-3">
          <div className="calm-card glow-bottom-blue px-4 py-3">
            <p className="text-[10px] uppercase tracking-widest text-accent/80">Steg 1 · Brusfilter</p>
            <p className="mt-1 text-xs text-text-dim">
              Rensa känsloladdning och projektioner innan Grey Rock. Klistra in i Speglar → Svart på vitt,
              eller fortsätt direkt till BIFF om du redan har rena fakta.
            </p>
            <Link to="/dagbok?tab=speglar" className="btn-pill--accent mt-2 inline-flex text-xs">
              Öppna Speglar
            </Link>
          </div>
          <BiffPublicPanel initialMessage={initialMessage} />
        </div>
      )}

      {subTab === 'speglar' && (
        <div className="calm-card glow-bottom-blue p-4 text-sm text-text-muted">
          <p className="text-text-dim">
            Akut känslovalidering (ACT) och bevisjämförelse — innan du formulerar svar här.
          </p>
          <Link to="/dagbok?tab=speglar" className="btn-pill--accent mt-3 inline-flex text-xs">
            Öppna Speglar
          </Link>
        </div>
      )}

      {subTab === 'barn' && (
        <div className="calm-card glow-bottom-blue p-4 text-sm text-text-muted">
          <p className="text-text-dim">
            Barnfokus och minnesankare ligger i Familjen — separat från ex-kommunikation.
          </p>
          <Link to="/familjen?tab=reflektion" className="btn-pill--accent mt-3 inline-flex text-xs">
            Öppna Familjen
          </Link>
        </div>
      )}
    </div>
  );
}
