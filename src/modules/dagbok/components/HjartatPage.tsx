import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TabBar } from '../../core/ui/TabBar';
import { getHubTabsFromNav } from '../../core/navigation/hubTabs';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import { clearVaultGate, clearVaultZone } from '../../core/auth/sessionService';
import { VaultPage, parseVaultTab, type VaultTab } from '../../verklighetsvalvet';
import { SpeglingsSystem } from '../../speglings_system';
import { DagbokPage } from './DagbokPage';

export type HjartatTab = 'reflektion' | 'bevis' | 'speglar';

const DAGBOK_HUB_TABS = getHubTabsFromNav('dagbok');

export function parseHjartatTab(raw: string | null): HjartatTab {
  if (raw === 'bevis') return 'bevis';
  if (raw === 'speglar') return 'speglar';
  return 'reflektion';
}

export function HjartatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const vaultTabParam = searchParams.get('vaultTab');
  const tabParam = searchParams.get('tab');
  const tab: HjartatTab =
    vaultTabParam || tabParam === 'bevis' ? 'bevis' : parseHjartatTab(tabParam);
  const vaultTab: VaultTab = parseVaultTab(vaultTabParam);
  const setVaultUnlocked = useStore((s) => s.setVaultUnlocked);

  const setTab = useCallback(
    (next: HjartatTab) => {
      if (tab === 'bevis' && next !== 'bevis') {
        setVaultUnlocked(false);
        clearVaultGate();
      }
      if (tab === 'reflektion' && next !== 'reflektion') {
        clearVaultZone('dagbok_forensic');
      }
      setSearchParams(next === 'reflektion' ? {} : { tab: next }, { replace: true });
    },
    [tab, setSearchParams, setVaultUnlocked],
  );

  const setVaultTab = useCallback(
    (next: VaultTab) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.set('tab', 'bevis');
          params.set('vaultTab', next);
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  useEffect(() => {
    if (tab !== 'bevis') {
      setVaultUnlocked(false);
      clearVaultGate();
    }
    if (tab !== 'reflektion') {
      clearVaultZone('dagbok_forensic');
    }
  }, [tab, setVaultUnlocked]);

  return (
    <div className="space-y-6">
      <BentoCard title="Hjärtat" description="Reflektion · spegling">
        <p className="mb-4 text-sm text-text-muted">
          Dagbok och spegling här. Bevis, kunskap och analys finns bakom Valv — öppna via menyn.
        </p>
        <TabBar
          tabs={DAGBOK_HUB_TABS}
          active={tab === 'bevis' ? 'reflektion' : tab}
          onChange={(id) => setTab(id as HjartatTab)}
        />
      </BentoCard>

      {tab === 'reflektion' && <DagbokPage embedded />}
      {tab === 'bevis' && (
        <VaultPage
          embedded
          initialVaultTab={vaultTab}
          onVaultTabChange={setVaultTab}
          onClose={() => setTab('reflektion')}
        />
      )}
      {tab === 'speglar' && <SpeglingsSystem embedded />}
    </div>
  );
}
