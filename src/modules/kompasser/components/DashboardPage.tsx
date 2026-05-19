import { Compass, Heart, TrendingUp } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';

export function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <BentoCard title="Dagens Fokus" icon={<Compass className="h-4 w-4" />}>
        <p className="text-sm text-slate-300">Vilket mikrosteg gor mest skillnad idag?</p>
      </BentoCard>
      <BentoCard title="Valmaende" icon={<Heart className="h-4 w-4" />}>
        <p className="text-sm text-slate-300">Energiniva stabil och aterhamtning aktiv.</p>
      </BentoCard>
      <BentoCard title="Ekonomi" icon={<TrendingUp className="h-4 w-4" />}>
        <p className="text-sm text-slate-300">Budget och likviditet overvakade i realtid.</p>
      </BentoCard>
    </div>
  );
}
