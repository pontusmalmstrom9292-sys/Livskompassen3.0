import { useCallback, useEffect, useState } from 'react';
import { useStore } from '@/core/store';
import { getPeriodEconomySummary, type PeriodEconomySummary } from '@/core/firebase/economyFirestore';
import { HamnForensicPanel } from '@/features/family/safeHarbor/components/BiffPublicPanel';
import { DagbokSuperModule } from '@/features/lifeJournal/diary/diary/components/DagbokSuperModule';
import { SpeglarSuperModule } from '@/features/lifeJournal/diary/mirror';
import { FamiljenMonsterTab } from '@/features/family/children/components/familjen/FamiljenMonsterTab';
import { useFamiljenShell } from '@/features/family/children/hooks/useFamiljenShell';
import { VaultEconomyPanel } from '@/modules/valv_ekonomi';
import { EconomyPeriodSummary } from '@/features/dailyLife/wellbeing/economy/components/EconomyPeriodSummary';
import { EconomyPayslipCard } from '@/features/dailyLife/wellbeing/economy/components/EconomyPayslipCard';
import { FORENSIC_TAB_INGRESS, type ForensicVaultTab } from '../utils/vaultTabs';

function ArbetslivLonForensic() {
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

type Props = {
  tab: ForensicVaultTab;
};

/** Forensic paneler på Valv-baksidan — PIN redan upplåst i VaultPage. */
export function VaultForensicPanel({ tab }: Props) {
  const shell = useFamiljenShell();

  const ingress = (
    <p className="mb-3 text-sm text-text-muted">{FORENSIC_TAB_INGRESS[tab]}</p>
  );

  switch (tab) {
    case 'hamn_analys':
      return (
        <>
          {ingress}
          <HamnForensicPanel initialMessage="" />
        </>
      );
    case 'speglar_fordjupat':
      return (
        <>
          {ingress}
          <SpeglarSuperModule variant="forensic" />
        </>
      );
    case 'dagbok_arkiv':
      return (
        <>
          {ingress}
          <DagbokSuperModule variant="forensic-readonly" />
        </>
      );
    case 'familjen_monster':
      return shell.user ? (
        <>
          {ingress}
          <FamiljenMonsterTab shell={shell} />
        </>
      ) : null;
    case 'arbetsliv_franvaro':
      return (
        <>
          {ingress}
          <VaultEconomyPanel />
        </>
      );
    case 'arbetsliv_lon':
      return (
        <>
          {ingress}
          <ArbetslivLonForensic />
        </>
      );
    default:
      return null;
  }
}
