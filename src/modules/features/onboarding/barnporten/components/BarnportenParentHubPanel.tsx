import { Link } from 'react-router-dom';
import { ExternalLink, Smartphone } from 'lucide-react';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { BentoCard } from '@/shared/ui/BentoCard';
import { BarnportenQrPanel } from './BarnportenQrPanel';
import { BarnportenInboxPanel } from './BarnportenInboxPanel';
import { BarnportenOrkesterPanel } from './BarnportenOrkesterPanel';
import type { ChildAlias } from '@/features/family/children/constants';

type Props = {
  activeChild: ChildAlias;
};

/**
 * V4 — föräldravy på /familjen?tab=barnporten med QR, inkorg och PWA-länk.
 */
export function BarnportenParentHubPanel({ activeChild }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ModuleHelpFromRegistry moduleId="barnporten" />
      </div>
      <BentoCard glow="blue" className="!p-4">
        <div className="flex items-start gap-3">
          <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
          <div>
            <p className="text-xs uppercase tracking-widest text-text-dim">Barn-PWA</p>
            <p className="mt-1 text-sm text-text-muted">
              Barnet öppnar <strong className="font-normal text-text">/barnporten</strong> på sin
              enhet — separat manifest, ingen Valv-exponering.
            </p>
            <Link
              to="/barnporten"
              className="ds-btn ds-btn--accent mt-3 inline-flex items-center gap-2 text-xs"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              Öppna Barnporten (föräldraläge)
            </Link>
          </div>
        </div>
      </BentoCard>

      <BarnportenQrPanel />
      <p className="text-xs text-text-dim">Aktivt barn i hubben: {activeChild}</p>
      <BarnportenInboxPanel />
      <BarnportenOrkesterPanel />
    </div>
  );
}
