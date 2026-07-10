import type { ReactNode } from 'react';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { NAV_PATHS } from '@/core/navigation/navTruth';

type Props = { children: ReactNode };

/** Fångar render-fel i Planering så hela appen inte vit-skärmar (t.ex. WebView på Android). */
export function PlaneringErrorBoundary({ children }: Props) {
  return (
    <HubErrorBoundary
      title="Handling kunde inte laddas"
      errorBody="Ett tekniskt fel stoppade vyn. Prova igen — dina uppgifter i molnet påverkas inte."
      glow="gold"
      backTo={NAV_PATHS.VARDAGEN}
      backLabel="Till Liv och göra"
      logTag="PlaneringErrorBoundary"
    >
      {children}
    </HubErrorBoundary>
  );
}
