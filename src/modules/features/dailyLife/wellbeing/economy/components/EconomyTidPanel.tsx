import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { TimeAndPayPanel } from './TimeAndPayPanel';
import { EconomyPayslipCard } from './EconomyPayslipCard';

export function EconomyTidPanel() {
  return (
    <div className="space-y-4">
      <TimeAndPayPanel />
      <EconomyPayslipCard />
      <BentoCard title="Full stämpelvy" icon={<Clock className="h-4 w-4" />}>
        <p className="mb-3 text-sm text-text-dim">Veckokalender och senaste pass.</p>
        <Link to="/arbetsliv?tab=stampla" className="btn-pill--ghost inline-block text-sm">
          Öppna stämpelklocka
        </Link>
      </BentoCard>
    </div>
  );
}
