import { useState } from 'react';
import { Wallet, Leaf, PiggyBank } from 'lucide-react';
import { clsx } from 'clsx';
import { EconomyBudgetTab } from './EconomyBudgetTab';
import { EconomyMealPrepPanel } from './EconomyMealPrepPanel';
import { EconomyImpulsePanel } from './EconomyImpulsePanel';
import { EconomySavingsPanel } from './EconomySavingsPanel';

type InternalTab = 'budget' | 'kost_prepp' | 'smarta_verktyg';

type Props = {
  userId: string;
};

export function EconomyOverviewPanel({ userId: _userId }: Props) {
  const [activeTab, setActiveTab] = useState<InternalTab>('budget');

  return (
    <div className="calm-card glow-bottom-gold p-1">
      <div className="mb-2 flex gap-1 rounded-t-xl border-b border-border/30 bg-surface-2 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('budget')}
          className={clsx(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[11px] font-medium transition-all duration-200',
            activeTab === 'budget'
              ? 'border border-accent/20 bg-accent/10 text-accent shadow-[0_0_10px_rgba(212,175,55,0.05)]'
              : 'border border-transparent text-text-dim hover:bg-surface-3/50 hover:text-text',
          )}
        >
          <Wallet className="h-3.5 w-3.5" />
          Budget
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('kost_prepp')}
          className={clsx(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[11px] font-medium transition-all duration-200',
            activeTab === 'kost_prepp'
              ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.05)]'
              : 'border border-transparent text-text-dim hover:bg-surface-3/50 hover:text-text',
          )}
        >
          <Leaf className="h-3.5 w-3.5" />
          Neuro-Kost
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('smarta_verktyg')}
          className={clsx(
            'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[11px] font-medium transition-all duration-200',
            activeTab === 'smarta_verktyg'
              ? 'border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.05)]'
              : 'border border-transparent text-text-dim hover:bg-surface-3/50 hover:text-text',
          )}
        >
          <PiggyBank className="h-3.5 w-3.5" />
          Smarta Verktyg
        </button>
      </div>

      <div className="animate-fade-in min-h-[260px] p-4 sm:p-5">
        {activeTab === 'budget' && <EconomyBudgetTab />}

        {activeTab === 'kost_prepp' && <EconomyMealPrepPanel />}

        {activeTab === 'smarta_verktyg' && (
          <div className="space-y-5">
            <EconomySavingsPanel
              tagFilter="family"
              panelTitle="Barnens Äventyrskassa"
              description="Familjesparmål — t.ex. Liseberg till sommaren"
              compact
            />
            <EconomySavingsPanel panelTitle="Sparmål" />
            <EconomyImpulsePanel />
          </div>
        )}
      </div>
    </div>
  );
}
