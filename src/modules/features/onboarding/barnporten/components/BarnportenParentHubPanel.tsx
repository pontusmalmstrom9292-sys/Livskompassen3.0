import { ButtonLink, textStyles } from '@/design-system';
import { ExternalLink, Smartphone } from 'lucide-react';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { BentoCard } from '@/shared/ui/BentoCard';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
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
    <HubErrorBoundary
      title="Barnporten kunde inte laddas"
      glow="blue"
      logTag="BarnportenParentHubPanel"
    >
      <div className="familjen-tab-surface space-y-4">
      <div className="flex justify-end">
        <ModuleHelpFromRegistry moduleId="barnporten" />
      </div>
      <BentoCard glow="blue" className="!p-4">
        <div className="flex items-start gap-3">
          <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
          <div>
            <p className={textStyles.eyebrow}>Barn-PWA</p>
            <p className="mt-1 text-sm text-text-muted">
              Barnet öppnar <strong className="font-normal text-text">/barnporten</strong> på sin
              enhet — separat manifest, ingen Valv-exponering.
            </p>
            <ButtonLink
              to="/barnporten"
              variant="accent"
              className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              aria-label="Öppna Barnporten i föräldraläge"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              Öppna Barnporten (föräldraläge)
            </ButtonLink>
          </div>
        </div>
      </BentoCard>

      <BarnportenQrPanel />
      <p className="text-xs text-text-muted">Aktivt barn i hubben: {activeChild}</p>
      <BarnportenInboxPanel />
      <BarnportenOrkesterPanel />
      </div>
    </HubErrorBoundary>
  );
}
