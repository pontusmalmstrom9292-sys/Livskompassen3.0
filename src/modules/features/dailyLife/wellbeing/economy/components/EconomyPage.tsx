import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EconomyBudgetTab } from './EconomyBudgetTab';
import { EconomySavingsPanel } from './EconomySavingsPanel';

type EconomyPageProps = {
  embedded?: boolean;
};

export function EconomyPage({ embedded = false }: EconomyPageProps) {
  return (
    <div className="economy-page-shell mx-auto max-w-5xl space-y-4 pb-12">
      <div className="space-y-4">
        <EconomyBudgetTab />

        {!embedded && (
          <BentoCard
            title="Arbetsliv"
            icon={<Briefcase className="h-4 w-4" />}
            description="Stämpel, inkomster och lönespec — separat hub"
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 text-sm">
              <Link
                to="/arbetsliv/input"
                className="inline-flex min-h-11 items-center text-accent-secondary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
              >
                Öppna Arbetsliv-hubben
              </Link>
              <Link
                to="/vardagen?tab=ekonomi&inputMode=logg"
                className="inline-flex min-h-11 items-center text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
              >
                Logg & fasta räkningar (privatekonomi)
              </Link>
            </div>
          </BentoCard>
        )}

        <EconomySavingsPanel />
      </div>
    </div>
  );
}
