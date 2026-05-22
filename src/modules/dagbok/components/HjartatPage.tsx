import { useCallback, useEffect, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Shield, Brain } from 'lucide-react';
import { ClusterShell } from '../../core/ui/ClusterShell';
import type { TabBarItem } from '../../core/ui/TabBar';
import { useStore } from '../../core/store';
import { clearVaultGate } from '../../core/auth/sessionService';
import {
  getVisibleHjartatTabs,
  parseHjartatTab,
  type HjartatTab,
} from '../../core/navigation/appNavigation';
import { VaultPage } from '../../verklighetsvalvet';
import { SpeglingsSystem } from '../../speglings_system';
import { DagbokPage } from './DagbokPage';

export type { HjartatTab } from '../../core/navigation/appNavigation';
export { parseHjartatTab } from '../../core/navigation/appNavigation';

const TAB_ICONS: Record<HjartatTab, ReactNode> = {
  reflektion: <BookOpen className="h-3 w-3" />,
  bevis: <Shield className="h-3 w-3" />,
  speglar: <Brain className="h-3 w-3" />,
};

function buildTabItems(): TabBarItem<HjartatTab>[] {
  return getVisibleHjartatTabs().map((t) => ({
    id: t.id,
    label: t.label,
    icon: TAB_ICONS[t.id],
  }));
}

export function HjartatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = parseHjartatTab(searchParams.get('tab'));
  const setVaultUnlocked = useStore((s) => s.setVaultUnlocked);
  const tabs = buildTabItems();

  const setTab = useCallback(
    (next: HjartatTab) => {
      if (tab === 'bevis' && next !== 'bevis') {
        setVaultUnlocked(false);
        clearVaultGate();
      }
      setSearchParams(next === 'reflektion' ? {} : { tab: next }, { replace: true });
    },
    [tab, setSearchParams, setVaultUnlocked],
  );

  useEffect(() => {
    if (tab !== 'bevis') {
      setVaultUnlocked(false);
      clearVaultGate();
    }
  }, [tab, setVaultUnlocked]);

  return (
    <ClusterShell
      title="Hjärtat"
      description="Sanning · reflektion · spegling"
      tone="gold"
      hint="Ett kluster — välj flik, sedan ett steg i taget."
      tabs={tabs}
      activeTab={tab}
      onTabChange={setTab}
    >
      {tab === 'reflektion' && <DagbokPage embedded />}
      {tab === 'bevis' && <VaultPage embedded onClose={() => setTab('reflektion')} />}
      {tab === 'speglar' && <SpeglingsSystem embedded />}
    </ClusterShell>
  );
}
