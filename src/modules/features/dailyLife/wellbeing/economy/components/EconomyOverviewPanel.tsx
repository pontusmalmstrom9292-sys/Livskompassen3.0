import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Wallet, Leaf, PiggyBank, Clock, PauseCircle, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { EconomyBudgetTab } from './EconomyBudgetTab';
import { EconomyMealPrepPanel } from './EconomyMealPrepPanel';
import { EconomyImpulsePanel } from './EconomyImpulsePanel';
import { EconomySavingsPanel } from './EconomySavingsPanel';
import { EconomyTidPanel } from './EconomyTidPanel';
import {
  EkonomiModulValjare,
  type EkonomiModuleChoice,
} from './EkonomiModulValjare';
import { hasSeenEkonomiModulValjare } from '../utils/ekonomiModulValjareStorage';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';
import { useIsEconomyAdvancedUnlocked, useListenToCapacityState } from '@/modules/core/store/useCapacityGate';

const TABS: { id: EkonomiModuleChoice; label: string; icon: typeof Wallet }[] = [
  { id: 'budget', label: 'Budget', icon: Wallet },
  { id: 'kost_prepp', label: 'Neuro-Kost', icon: Leaf },
  { id: 'impuls', label: 'Impuls', icon: PauseCircle },
  { id: 'spar', label: 'Spar', icon: PiggyBank },
  { id: 'tid', label: 'Tid', icon: Clock },
];

type Props = {
  userId: string;
};

export function EconomyOverviewPanel({ userId }: Props) {
  const [showPicker, setShowPicker] = useState(() => !hasSeenEkonomiModulValjare());
  const [activeTab, setActiveTab] = useState<EkonomiModuleChoice>('budget');
  const hasAdvanced = useEvolutionStore((s) => s.hasFeature('economy_advanced'));
  const isEconomyAdvancedUnlocked = useIsEconomyAdvancedUnlocked();
  const listenToCapacityState = useListenToCapacityState();

  useEffect(() => {
    if (userId) {
      const unsubscribe = listenToCapacityState(userId);
      return () => unsubscribe();
    }
  }, [userId, listenToCapacityState]);

  const visibleTabs = TABS.filter((t) => {
    if (t.id === 'impuls' || t.id === 'spar') return isEconomyAdvancedUnlocked || hasAdvanced;
    return true;
  });

  useEffect(() => {
    // Om man är på en flik som man inte längre har tillgång till, hoppa till budget
    if (!visibleTabs.some((t) => t.id === activeTab)) {
      setActiveTab('budget');
    }
  }, [isEconomyAdvancedUnlocked, hasAdvanced, activeTab, visibleTabs]);

  const openTab = (tab: EkonomiModuleChoice) => {
    setActiveTab(tab);
    setShowPicker(false);
  };

  if (showPicker) {
    return (
      <div className="calm-card glow-bottom-gold overflow-hidden rounded-2xl">
        <EkonomiModulValjare onSelect={openTab} />
      </div>
    );
  }

  return (
    <div className="calm-card glow-bottom-gold p-1">
      <div className="mb-2 flex items-center justify-between gap-2 px-2 pt-2">
        <div className="flex flex-1 gap-1 overflow-x-auto rounded-t-xl border-b border-border/30 bg-surface-2 p-1 calm-scroll-island">
          {visibleTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={clsx(
                'flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2.5 text-[11px] font-medium transition-all duration-200',
                activeTab === id
                  ? 'border border-accent/20 bg-accent/10 text-accent shadow-[0_0_10px_rgba(212,175,55,0.05)]'
                  : 'border border-transparent text-text-dim hover:bg-surface-3/50 hover:text-text',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="btn-pill--ghost shrink-0 p-2"
          title="Välj verktyg"
          aria-label="Öppna modulväljare"
        >
          <LayoutGrid className="h-4 w-4 text-accent/70" />
        </button>
        {isEconomyAdvancedUnlocked && (
          <Link
            to="/ekonomi/avancerad"
            className="btn-pill--ghost shrink-0 p-2 flex items-center justify-center border border-accent/20 bg-accent/5 hover:bg-accent/10 hover:text-accent transition-colors rounded-lg"
            title="Avancerad instrumentpanel"
            aria-label="Gå till avancerad ekonomi"
          >
            <Sparkles className="h-4 w-4 text-accent" />
          </Link>
        )}
      </div>

      <div className="animate-fade-in min-h-[260px] p-4 sm:p-5">
        {activeTab === 'budget' && <EconomyBudgetTab />}
        {activeTab === 'kost_prepp' && <EconomyMealPrepPanel />}
        {activeTab === 'impuls' && <EconomyImpulsePanel />}
        {activeTab === 'spar' && (
          <div className="space-y-5">
            <EconomySavingsPanel
              tagFilter="family"
              panelTitle="Barnens Äventyrskassa"
              description="Familjesparmål — t.ex. Liseberg till sommaren"
              compact
            />
            <EconomySavingsPanel panelTitle="Sparmål" />
          </div>
        )}
        {activeTab === 'tid' && <EconomyTidPanel />}
      </div>
    </div>
  );
}
