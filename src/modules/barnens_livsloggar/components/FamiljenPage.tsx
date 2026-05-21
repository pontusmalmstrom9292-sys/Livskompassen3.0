import { BentoCard } from '../../core/ui/BentoCard';
import { BarnensPage } from './BarnensPage';

export function FamiljenPage() {
  return (
    <div className="space-y-6">
      <BentoCard title="Familjen" description="Trygg hamn · neutral loggning">
        <p className="text-sm text-text-muted">
          Kasper och Arvid — livsloggar och Balansmätaren i ett kluster.
        </p>
      </BentoCard>
      <BarnensPage embedded />
    </div>
  );
}
