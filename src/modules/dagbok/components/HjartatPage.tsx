import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Shield, Brain } from 'lucide-react';
import { TabBar } from '../../core/ui/TabBar';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import { clearVaultGate } from '../../core/auth/sessionService';
import { VaultPage } from '../../verklighetsvalvet';
import { SpeglingsSystem } from '../../speglings_system';
import { DagbokPage } from './DagbokPage';

export type HjartatTab = 'reflektion' | 'bevis' | 'speglar';

const ALL_TABS = [
  { id: 'reflektion' as const, label: 'Reflektion', icon: <BookOpen className="h-3 w-3" /> },
  { id: 'bevis' as const, label: 'Bevis', icon: <Shield className="h-3 w-3" /> },
  { id: 'speglar' as const, label: 'Speglar', icon: <Brain className="h-3 w-3" /> },
];

const HIDE_BEVIS_TAB = import.meta.env.VITE_HIDE_BEVIS_TAB === 'true';
const TABS = HIDE_BEVIS_TAB ? ALL_TABS.filter((t) => t.id !== 'bevis') : ALL_TABS;

export function parseHjartatTab(raw: string | null): HjartatTab {
  if (raw === 'bevis' || raw === 'speglar') return raw;
  return 'reflektion';
}

export function HjartatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = parseHjartatTab(searchParams.get('tab'));
  const setVaultUnlocked = useStore((s) => s.setVaultUnlocked);

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
    <div className="space-y-6">
      <BentoCard title="Hjärtat" description="Sanning · reflektion · spegling">
        <p className="mb-4 text-sm text-text-muted">
          Ett kluster — ett livsområde. Välj flik nedan.
        </p>
        <TabBar tabs={TABS} active={tab} onChange={setTab} />
      </BentoCard>

      {tab === 'reflektion' && <DagbokPage embedded />}
      {tab === 'bevis' && <VaultPage embedded onClose={() => setTab('reflektion')} />}
      {tab === 'speglar' && <SpeglingsSystem embedded />}
    </div>
  );
}
