import { useCallback, useEffect, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Shield, Brain } from 'lucide-react';
import { ClusterShell } from '../../core/ui/ClusterShell';
import type { TabBarItem } from '../../core/ui/TabBar';
import { useStore } from '../../core/store';
import { clearVaultGate, hasVaultGate } from '../../core/auth/sessionService';
import {
  getVisibleHjartatTabs,
  parseHjartatTab,
  resolveHjartatTab,
  type HjartatTab,
} from '../../core/navigation/appNavigation';
import { VaultPage } from '../../verklighetsvalvet';
import { SpeglingsSystem } from '../../speglings_system';
import { DagbokPage } from './DagbokPage';

export type { HjartatTab } from '../../core/navigation/appNavigation';
export { parseHjartatTab, resolveHjartatTab } from '../../core/navigation/appNavigation';

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
  const gateOpen = hasVaultGate();
  const requestedTab = parseHjartatTab(searchParams.get('tab'));
  const tab = resolveHjartatTab(searchParams.get('tab'), gateOpen);
  const inVaultSession = tab === 'bevis' && gateOpen;
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

  /** Fyren satte gate men router hann inte till ?tab=bevis — återställ URL. */
  useEffect(() => {
    if (!gateOpen) return;
    if (searchParams.get('tab') !== 'bevis') {
      setSearchParams({ tab: 'bevis' }, { replace: true });
    }
  }, [gateOpen, searchParams, setSearchParams]);

  /** G18: bokmärke ?tab=bevis utan gate — städa URL (inte när Fyren just öppnat). */
  useEffect(() => {
    if (requestedTab === 'bevis' && tab === 'reflektion' && !gateOpen) {
      setSearchParams({}, { replace: true });
    }
  }, [requestedTab, tab, gateOpen, setSearchParams]);

  /** Lås upp-state följer flik — rör inte sessionStorage-gate (Fyren). */
  useEffect(() => {
    if (tab !== 'bevis') {
      setVaultUnlocked(false);
    }
  }, [tab, setVaultUnlocked]);

  return (
    <ClusterShell
      title={inVaultSession ? 'Verklighetsvalvet' : 'Hjärtat'}
      description={
        inVaultSession
          ? 'Forensiskt försvar — stäng när du är klar.'
          : 'Reflektion och spegling'
      }
      tone="gold"
      hint={
        inVaultSession
          ? undefined
          : 'Ett kluster — välj flik, sedan ett steg i taget.'
      }
      tabs={inVaultSession ? undefined : tabs}
      activeTab={inVaultSession ? undefined : tab}
      onTabChange={inVaultSession ? undefined : setTab}
    >
      {tab === 'reflektion' && <DagbokPage embedded />}
      {tab === 'bevis' && <VaultPage embedded onClose={() => setTab('reflektion')} />}
      {tab === 'speglar' && <SpeglingsSystem embedded />}
    </ClusterShell>
  );
}
