import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EconomyBudgetTab } from './EconomyBudgetTab';
import { EconomySavingsPanel } from './EconomySavingsPanel';

type EconomyPageProps = {
  embedded?: boolean;
};

/** Full-page ekonomi — wraps hub budget tab + savings. Prefer EconomyOverviewPanel on /vardagen. */
export function EconomyPage({ embedded = false }: EconomyPageProps) {
  return (
    <div className="space-y-4">
      <EconomyBudgetTab />

      {!embedded && (
        <BentoCard
          title="Arbetsliv"
          icon={<Briefcase className="h-4 w-4" />}
          description="Stämpel, flex, sjuk/VAB och lönespec"
        >
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/arbetsliv" className="text-accent hover:underline">
              Öppna Arbetsliv-hubben
            </Link>
            <Link to="/arbetsliv?tab=logg" className="text-accent hover:underline">
              Fasta räkningar och ekonomilogg
            </Link>
          </div>
        </BentoCard>
      )}

      <EconomySavingsPanel />
    </div>
  );
}
