import { Link } from 'react-router-dom';
import { FileText, ScrollText } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { DOSSIER_PATH } from '../../core/navigation/appNavigation';

export function VaultDossierBridge() {
  return (
    <BentoCard title="Dossier" icon={<ScrollText className="h-4 w-4" />}>
      <p className="mb-4 text-sm text-text-muted">
        Sacred Feature — samlad WORM-export från valv, dagbok och barnen. Generatorn öppnas
        separat; inget skickas automatiskt.
      </p>
      <ul className="mb-4 space-y-2 text-xs text-text-dim">
        <li className="flex items-start gap-2">
          <FileText className="mt-0.5 h-3 w-3 shrink-0" />
          Välj källor, granska hela poster, ladda ner PDF
        </li>
      </ul>
      <Link to={DOSSIER_PATH} className="btn-pill--secondary inline-flex items-center gap-2">
        Öppna Dossier-generator
      </Link>
    </BentoCard>
  );
}
