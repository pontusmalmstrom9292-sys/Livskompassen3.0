import { useCapacityScore } from '@/core/store/useCapacityGate';
import { EconomySavingsPanel } from '../../components/EconomySavingsPanel';

export type EkonomiSparDelegateProps = {
  userId: string;
};

const STABILITY_THRESHOLD = 0.5;

/**
 * Fas 8D — Sparmålspanel delegate.
 * Visar Sparmål via EconomySavingsPanel.
 */
export function EkonomiSparDelegate({ userId }: EkonomiSparDelegateProps) {
  const capacityScore = useCapacityScore();
  const isLowCapacity = capacityScore < STABILITY_THRESHOLD;
  const hasUser = Boolean(userId);

  if (!hasUser) {
    return <p className="text-sm text-text-dim">Logga in för att hantera sparmål.</p>;
  }

  return (
    <div className="space-y-5">
      <EconomySavingsPanel
        panelTitle="Sparmål"
        description="Visa och modifiera sparmål. En siffra i taget."
        disabled={isLowCapacity}
      />
    </div>
  );
}
