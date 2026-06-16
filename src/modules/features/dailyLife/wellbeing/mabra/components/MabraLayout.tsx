import { memo, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useMabraStore } from '../store/mabraStore';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import { LivBackLink } from '@/modules/shell/LivBackLink';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { MabraBentoShell } from './MabraBentoShell';

export const MabraLayout = memo(function MabraLayout() {
  const reset = useMabraStore(useShallow((state) => state.reset));

  // Rensa state vid unmount (när användaren lämnar hela MåBra-modulen)
  useEffect(() => {
    return () => reset();
  }, [reset]);

  return (
    <HubErrorBoundary
      title="MåBra kunde inte laddas"
      glow="green"
      backTo={NAV_PATHS.VARDAGEN}
      backLabel="Till Liv och göra"
      logTag="MabraPage"
    >
      <HubPageShell
        eyebrow="MåBra"
        title="För dig — ett steg i taget"
        lead="Snabbstart och zoner — tillbaka öppnar samma zon igen."
        headerAside={<LivBackLink />}
      >
        <MabraBentoShell>
          <Outlet />
        </MabraBentoShell>
      </HubPageShell>
    </HubErrorBoundary>
  );
});
