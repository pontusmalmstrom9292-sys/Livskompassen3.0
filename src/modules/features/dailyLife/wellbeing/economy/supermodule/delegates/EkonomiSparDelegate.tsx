import { useEconomyLevel } from '@/features/economy/hooks/useEconomyLevel';
import { EconomySavingsPanel } from '../../components/EconomySavingsPanel';

export type EkonomiSparDelegateProps = {
  userId: string;
};

/** Fas 8D — Sparmålspanel delegate. */
export function EkonomiSparDelegate({ userId }: EkonomiSparDelegateProps) {
  const { level, circuitBreakerActive } = useEconomyLevel(userId);
  const isLowCapacity = circuitBreakerActive || level === 'critical' || level === 1;
  const hasUser = Boolean(userId);

  if (!hasUser) {
    return <p className="text-sm text-text-muted">Logga in för att hantera sparmål.</p>;
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
