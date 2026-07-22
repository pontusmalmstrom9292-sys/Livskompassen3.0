import { useState, useEffect, useMemo } from 'react';
import { LayoutGrid, Wallet, Leaf, PiggyBank, ScrollText, PauseCircle, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { Button, ButtonLink } from '@/design-system';
import { EconomyBudgetTab } from './EconomyBudgetTab';
import { EconomyMealPrepPanel } from './EconomyMealPrepPanel';
import { EconomyImpulsePanel } from './EconomyImpulsePanel';
import { EconomySavingsPanel } from './EconomySavingsPanel';
import { EconomyLogPanel } from './EconomyLogPanel';
import { PinnedPlaneringModuleSlot } from '@/features/admin/planning/components/PinnedPlaneringModuleSlot';
import {
  EkonomiModulValjare,
  type EkonomiModuleChoice,
} from './EkonomiModulValjare';
import { hasSeenEkonomiModulValjare } from '../utils/ekonomiModulValjareStorage';
import { useEconomyLevel } from '@/features/economy/hooks/useEconomyLevel';
import type { EconomyCapacityLevel } from '../supermodule/capacityResolver';

const TABS: { id: EkonomiModuleChoice; label: string; icon: typeof Wallet }[] = [
  { id: 'budget', label: 'Budget', icon: Wallet },
  { id: 'kost_prepp', label: 'Neuro-Kost', icon: Leaf },
  { id: 'impuls', label: 'Impuls', icon: PauseCircle },
  { id: 'spar', label: 'Spar', icon: PiggyBank },
  { id: 'logg', label: 'Logg', icon: ScrollText },
];

function allowedTabIdsForLevel(level: EconomyCapacityLevel): Set<EkonomiModuleChoice> {
  if (level === 'critical' || level === 1) {
    return new Set(['budget']);
  }
  if (level === 2) {
    return new Set(['budget', 'kost_prepp', 'logg', 'spar']);
  }
  return new Set(['budget', 'kost_prepp', 'impuls', 'spar', 'logg']);
}

type Props = {
  userId: string;
};

export function EconomyOverviewPanel({ userId }: Props) {
  const [showPicker, setShowPicker] = useState(() => !hasSeenEkonomiModulValjare());
  const [activeTab, setActiveTab] = useState<EkonomiModuleChoice>('budget');
  const { level, isEconomyAdvancedUnlocked, isLoading } = useEconomyLevel(userId);

  const visibleTabs = useMemo(() => {
    const allowed = allowedTabIdsForLevel(level);
    return TABS.filter((tab) => allowed.has(tab.id));
  }, [level]);

  useEffect(() => {
    if (isLoading) return;
    if (!visibleTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab('budget');
    }
  }, [isLoading, activeTab, visibleTabs]);

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
    <div className="calm-card glow-bottom-gold overflow-hidden p-1">
      <div className="mb-2 flex items-center justify-between gap-2 px-2 pt-2">
        <div className="flex flex-1 gap-1 overflow-x-auto rounded-t-xl border-b border-border/30 bg-surface-2 p-1 calm-scroll-island">
          {visibleTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={clsx(
                'flex min-h-[var(--ds-touch-target)] shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2.5 text-[11px] font-medium transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50',
                activeTab === id
                  ? 'border border-accent/20 bg-accent/10 text-accent shadow-[0_0_10px_rgba(212,175,55,0.05)]'
                  : 'border border-transparent text-text-muted hover:bg-surface-3/50 hover:text-text',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowPicker(true)}
          title="Välj verktyg"
          aria-label="Öppna modulväljare"
        >
          <LayoutGrid className="h-4 w-4 text-accent/70" />
        </Button>
        {isEconomyAdvancedUnlocked && (
          <ButtonLink
            to="/ekonomi/avancerad"
            variant="ghost"
            size="icon"
            className="flex items-center justify-center border border-accent/20 bg-accent/5 hover:bg-accent/10 hover:text-accent transition-colors rounded-lg"
            title="Avancerad instrumentpanel"
            aria-label="Gå till avancerad ekonomi"
          >
            <Sparkles className="h-4 w-4 text-accent" />
          </ButtonLink>
        )}
      </div>

      <div className="px-4 pb-2">
        <PinnedPlaneringModuleSlot targetId="vardagen.ekonomi" />
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
        {activeTab === 'logg' && <EconomyLogPanel scope="vardag" />}
      </div>
    </div>
  );
}
