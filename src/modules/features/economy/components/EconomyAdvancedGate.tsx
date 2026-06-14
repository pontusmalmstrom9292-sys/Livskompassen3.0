import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useStore } from '@/core/store';
import { useEconomyLevel } from '@/features/economy/hooks/useEconomyLevel';
import { EconomyCapacityLockedNotice } from './EconomyCapacityLockedNotice';

type EconomyAdvancedGateProps = {
  children: ReactNode;
  featureLabel?: string;
  compact?: boolean;
  fallback?: ReactNode;
  /** Sekundär upplåsning t.ex. evolution_hub feature flag */
  alsoUnlocked?: boolean;
};

/**
 * Skyddande lager — renderar barn endast när tri-gate isEconomyAdvancedUnlocked är true.
 * Kapacitet via kanonisk useEconomyLevel (capability + economy_status + evolution_hub).
 */
export function EconomyAdvancedGate({
  children,
  featureLabel,
  compact = false,
  fallback,
  alsoUnlocked = false,
}: EconomyAdvancedGateProps) {
  const user = useStore((s) => s.user);
  const { isEconomyAdvancedUnlocked, isLoading } = useEconomyLevel(user?.uid);
  const isUnlocked = isEconomyAdvancedUnlocked || alsoUnlocked;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8 text-text-muted">
        <Loader2 className="h-5 w-5 animate-spin text-accent" />
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <>
        {fallback ?? (
          <EconomyCapacityLockedNotice featureLabel={featureLabel} compact={compact} />
        )}
      </>
    );
  }

  return <>{children}</>;
}
