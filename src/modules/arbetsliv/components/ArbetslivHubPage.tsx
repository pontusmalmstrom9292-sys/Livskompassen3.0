import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { clearVaultZone } from '../../core/auth/sessionService';
import { BentoCard } from '../../core/ui/BentoCard';
import { TabBar, type TabBarItem } from '../../core/ui/TabBar';
import { VaultZoneGate } from '../../core/security/VaultZoneGate';
import { StampClockPage } from '../../stampla/components/StampClockPage';
import { EconomyTidPanel } from '../../ekonomi/components/EconomyTidPanel';
import { EconomyLogPanel } from '../../ekonomi/components/EconomyLogPanel';
import { EconomyPeriodSummary } from '../../ekonomi/components/EconomyPeriodSummary';
import { EconomyPayslipCard } from '../../ekonomi/components/EconomyPayslipCard';
import { VaultEconomyPanel } from '../../valv_ekonomi';
import { useStore } from '../../core/store';
import {
  getPeriodEconomySummary,
  type PeriodEconomySummary,
} from '../../core/firebase/timeEconomyFirestore';

export type ArbetslivTab = 'stampla' | 'tid' | 'franvaro' | 'lon' | 'logg';

const TABS: TabBarItem<ArbetslivTab>[] = [
  { id: 'stampla', label: 'Stämpel' },
  { id: 'tid', label: 'Tid & flex' },
  { id: 'franvaro', label: 'Frånvaro' },
  { id: 'lon', label: 'Lön & spec' },
  { id: 'logg', label: 'Logg' },
];

function parseArbetslivTab(raw: string | null): ArbetslivTab {
  if (raw === 'tid' || raw === 'franvaro' || raw === 'lon' || raw === 'logg') return raw;
  return 'stampla';
}

function LonTab() {
  const user = useStore((s) => s.user);
  const [summary, setSummary] = useState<PeriodEconomySummary | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      setSummary(await getPeriodEconomySummary(user.uid));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return (
    <div className="space-y-4">
      <EconomyPeriodSummary summary={summary} loading={loading} />
      <EconomyPayslipCard />
    </div>
  );
}

/** Arbetsliv — stämpel, tid, frånvaro, lönespec (PIN på känsliga flikar). */
export function ArbetslivHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = parseArbetslivTab(searchParams.get('tab'));

  const setTab = (next: ArbetslivTab) => {
    setSearchParams(next === 'stampla' ? {} : { tab: next }, { replace: true });
  };

  const isForensicTab = tab === 'franvaro' || tab === 'lon';

  useEffect(() => {
    if (!isForensicTab) clearVaultZone('arbetsliv_forensic');
  }, [isForensicTab]);

  const publicPanel = useMemo(() => {
    switch (tab) {
      case 'stampla':
        return <StampClockPage />;
      case 'tid':
        return <EconomyTidPanel />;
      case 'logg':
        return <EconomyLogPanel />;
      default:
        return null;
    }
  }, [tab]);

  const forensicPanel = useMemo(() => {
    if (tab === 'franvaro') return <VaultEconomyPanel />;
    if (tab === 'lon') return <LonTab />;
    return null;
  }, [tab]);

  return (
    <div className="arbetsliv-hub space-y-5 pb-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.35em] text-accent/80">Arbetsliv</p>
        <h1 className="text-xl font-display text-text">Tid · frånvaro · lön</h1>
        <p className="mt-1 text-xs text-text-dim">
          Stämpel och flex är öppna. Frånvaro och lönespec kräver samma PIN som Valv.
        </p>
      </header>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {isForensicTab ? (
        <VaultZoneGate
          zone="arbetsliv_forensic"
          title="Arbetsliv — låst"
          description="Frånvaro, sjuk/VAB och lönespec. Samma PIN som Valv."
        >
          {forensicPanel}
        </VaultZoneGate>
      ) : (
        publicPanel
      )}

      <BentoCard
        title="Vardagsekonomi"
        description="Veckopeng och matlåda ligger kvar under Vardagen."
        icon={<Briefcase className="h-4 w-4" />}
      >
        <p className="text-sm text-text-muted">
          Den här hubben är för jobb och lön. Privat kassa:{' '}
          <a href="/vardagen?tab=ekonomi" className="text-accent hover:underline">
            Vardagen → Ekonomi
          </a>
          .
        </p>
      </BentoCard>
    </div>
  );
}
