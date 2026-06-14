import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useStore } from '@/core/store';
import {
  useIsCapacityLoading,
  useIsEconomyAdvancedUnlocked,
  useListenToCapacityState,
} from '@/core/store/useCapacityGate';
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
 * Skyddande lager — renderar barn endast när isEconomyAdvancedUnlocked är true.
 * Kapacitet hämtas reaktivt från user_capability_state (orkester / capacity_engine).
 */
export function EconomyAdvancedGate({
  children,
  featureLabel,
  compact = false,
  fallback,
  alsoUnlocked = false,
}: EconomyAdvancedGateProps) {
  const user = useStore((s) => s.user);
  const listenToCapacityState = useListenToCapacityState();
  const isUnlocked = useIsEconomyAdvancedUnlocked() || alsoUnlocked;
  const isLoading = useIsCapacityLoading();

  useEffect(() => {
    if (user?.uid) {
      return listenToCapacityState(user.uid);
    }
  }, [user?.uid, listenToCapacityState]);

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
