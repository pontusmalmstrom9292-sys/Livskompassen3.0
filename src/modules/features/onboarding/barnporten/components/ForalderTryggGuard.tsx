import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useEvolutionStore } from '@/core/store/useEvolutionStore';

export interface ForalderTryggGuardProps {
  children: ReactNode;
}

/** Route guard — kräver barnportenLevel >= 2 för Förälder Trygg-pack. */
export function ForalderTryggGuard({ children }: ForalderTryggGuardProps) {
  const barnportenLevel = useEvolutionStore((s) => s.barnportenLevel);

  if (barnportenLevel < 2) {
    return <Navigate to="/barnporten" replace />;
  }

  return <>{children}</>;
}
