import { FileText } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { EmptyState } from '../../core/ui/EmptyState';

export function DossierPage() {
  return (
    <div className="space-y-6">
      <BentoCard title="Dossier-Generator" icon={<FileText className="h-4 w-4" />}>
        <p className="mb-4 text-sm text-text-muted">
          Sacred Feature — samlad WORM-export från valv, dagbok och barnen. Full aggregation kommer i nästa fas.
        </p>
        <EmptyState message="Snabbexport finns idag per post i Valv (PDF) och Barnen (JSON). generateDossier callable planeras här." />
      </BentoCard>
    </div>
  );
}
