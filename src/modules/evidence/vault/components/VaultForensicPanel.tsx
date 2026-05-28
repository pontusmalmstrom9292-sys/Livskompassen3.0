import { useCallback, useEffect, useState } from 'react';
import { useStore } from '../../../core/store';
import { getJournalEntries } from '../../../core/firebase/firestore';
import { getPeriodEconomySummary, type PeriodEconomySummary } from '../../../core/firebase/timeEconomyFirestore';
import { HamnForensicPanel } from '../../../family/safeHarbor/components/BiffPublicPanel';
import { SpeglingsForensicPanel } from '../../../diary/mirror/components/SpeglingsSystem';
import { JournalArchive } from '../../../diary/diary/components/JournalArchive';
import type { JournalEntry } from '../../../diary/diary/types/journal';
import { FamiljenMonsterTab } from '../../../family/children/components/familjen/FamiljenMonsterTab';
import { useFamiljenShell } from '../../../family/children/hooks/useFamiljenShell';
import { VaultEconomyPanel } from '../../../valv_ekonomi';
import { EconomyPeriodSummary } from '../../../wellbeing/economy/components/EconomyPeriodSummary';
import { EconomyPayslipCard } from '../../../wellbeing/economy/components/EconomyPayslipCard';
import type { ForensicVaultTab } from '../utils/vaultTabs';

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
  const user = useStore((s) => s.user);
  const shell = useFamiljenShell();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    if (tab !== 'dagbok_arkiv' || !user) return;
    getJournalEntries(user.uid)
      .then((rows) => setJournalEntries(rows as JournalEntry[]))
      .catch(() => setJournalEntries([]));
  }, [tab, user]);

  switch (tab) {
    case 'hamn_analys':
      return <HamnForensicPanel initialMessage="" />;
    case 'speglar_fordjupat':
      return <SpeglingsForensicPanel userId={user?.uid} />;
    case 'dagbok_arkiv':
      return <JournalArchive entries={journalEntries} />;
    case 'familjen_monster':
      return shell.user ? <FamiljenMonsterTab shell={shell} /> : null;
    case 'arbetsliv_franvaro':
      return <VaultEconomyPanel />;
    case 'arbetsliv_lon':
      return <ArbetslivLonForensic />;
    default:
      return null;
  }
}
