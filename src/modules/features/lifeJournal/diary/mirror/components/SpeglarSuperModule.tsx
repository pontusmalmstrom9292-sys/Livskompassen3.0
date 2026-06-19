import { useStore } from '@/core/store';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { SpeglingsForensicPanel, SpeglingsSystem } from './SpeglingsSystem';

export type SpeglarSuperVariant = 'dagbok' | 'forensic';

export type SpeglarSuperModuleProps = {
  variant: SpeglarSuperVariant;
  /** Valv forensic — valfri startkänsla från bro (t.ex. Hamn). */
  initialFeeling?: string;
};

/**
 * Canonical router för Speglar-ytor.
 * B3 — progressive disclosure via SpeglingsSystem (CalmCollapsible).
 * - dagbok: publikt ACT + valv-gated forensic (Hjärtat)
 * - forensic: endast VIVIR/bevis (Valv speglar_fordjupat)
 */
export function SpeglarSuperModule({
  variant,
  initialFeeling = '',
}: SpeglarSuperModuleProps) {
  const userId = useStore((s) => s.user?.uid);

  return (
    <HubErrorBoundary
      title="Speglar kunde inte laddas"
      glow="gold"
      logTag="SpeglarSuperModule"
    >
      {variant === 'forensic' ? (
        <SpeglingsForensicPanel userId={userId} initialFeeling={initialFeeling} />
      ) : (
        <SpeglingsSystem embedded />
      )}
    </HubErrorBoundary>
  );
}
