import { Wallet } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { SaldoHero } from '../../core/ui/SaldoHero';
import { MetricTile } from '../../core/ui/MetricTile';
import { EmptyState } from '../../core/ui/EmptyState';

export function EconomyPage() {
  return (
    <div className="space-y-4">
      <SaldoHero label="Vad har jag kvar" amount="— kr" hint="Veckopeng och matlåda — inga grafer." />

      <div className="grid grid-cols-2 gap-3">
        <MetricTile label="Veckopeng" value="—" hint="Placeholder" />
        <MetricTile label="Matlåda" value="—" hint="Placeholder" />
      </div>

      <BentoCard title="Transaktioner" icon={<Wallet className="h-4 w-4" />}>
        <EmptyState message="Inga transaktioner ännu. Firestore-schema kommer i nästa fas." />
      </BentoCard>
    </div>
  );
}
