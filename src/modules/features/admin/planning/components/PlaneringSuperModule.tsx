import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';
import { PlaneringInkorgPanel } from './PlaneringInkorgPanel';

export type PlaneringSuperVariant = 'inkorg' | 'capture';

export type PlaneringSuperModuleProps = {
  variant: PlaneringSuperVariant;
  onSaved?: () => void;
};

/**
 * Canonical router för Planering-ytor.
 * - inkorg: Gmail/kalender + mejl→uppgift + granskningslänk
 * - capture: G10 smart inkast (sourceModule planering_inkorg)
 */
export function PlaneringSuperModule({ variant, onSaved }: PlaneringSuperModuleProps) {
  if (variant === 'capture') {
    return <CaptureSuperModule variant="planering" onSaved={onSaved} />;
  }

  return <PlaneringInkorgPanel />;
}
