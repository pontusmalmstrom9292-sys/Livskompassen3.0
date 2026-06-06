import { useStore } from '@/core/store';
import { SpeglingsForensicPanel, SpeglingsSystem } from './SpeglingsSystem';

export type SpeglarSuperVariant = 'dagbok' | 'forensic';

export type SpeglarSuperModuleProps = {
  variant: SpeglarSuperVariant;
  /** Valv forensic — valfri startkänsla från bro (t.ex. Hamn). */
  initialFeeling?: string;
};

/**
 * Canonical router för Speglar-ytor.
 * - dagbok: publikt ACT + valv-gated forensic (Hjärtat)
 * - forensic: endast VIVIR/bevis (Valv speglar_fordjupat)
 */
export function SpeglarSuperModule({
  variant,
  initialFeeling = '',
}: SpeglarSuperModuleProps) {
  const userId = useStore((s) => s.user?.uid);

  if (variant === 'forensic') {
    return <SpeglingsForensicPanel userId={userId} initialFeeling={initialFeeling} />;
  }

  return <SpeglingsSystem embedded />;
}
