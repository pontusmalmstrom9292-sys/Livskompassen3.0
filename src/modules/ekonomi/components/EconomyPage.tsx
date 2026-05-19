import { PieChart, Wallet } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';

export function EconomyPage() {
  return (
    <BentoCard title="Ekonomi" icon={<Wallet className="h-4 w-4" />}>
      <div className="space-y-3 text-sm text-slate-300">
        <p>Likviditet, transaktioner och sparmal samlas i samma vy.</p>
        <div className="flex items-center gap-2 text-[#FDE68A]">
          <PieChart className="h-4 w-4" />
          Kernlogg aktiv: budget + sparande
        </div>
      </div>
    </BentoCard>
  );
}
