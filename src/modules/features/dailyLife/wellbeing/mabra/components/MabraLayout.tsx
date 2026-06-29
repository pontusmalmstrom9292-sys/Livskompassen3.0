import { memo, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useMabraStore } from '../store/mabraStore';
import { useTheme } from '@/core/theme';
import { isMidnightExecutiveTheme } from '@/core/theme/themePackMidnightExecutive';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import { LivBackLink } from '@/modules/shell/LivBackLink';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { getMabraRsdErrorCopy } from '../lib/mabraRsdErrorCopy';
import { MabraBentoShell } from './MabraBentoShell';

export const MabraLayout = memo(function MabraLayout() {
  const reset = useMabraStore(useShallow((state) => state.reset));
  const { themeId } = useTheme();
  const executiveHeader = isMidnightExecutiveTheme(themeId);

  // Rensa state vid unmount (när användaren lämnar hela MåBra-modulen)
  useEffect(() => {
    return () => reset();
  }, [reset]);

  return (
    <HubErrorBoundary
      title="MåBra kunde inte laddas"
      errorBody={getMabraRsdErrorCopy()}
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
        executiveHeader={executiveHeader}
      >
        <MabraBentoShell className="mabra-layout-shell">
          <div className="mabra-layout-shell__body">
            <Outlet />
          </div>
        </MabraBentoShell>
      </HubPageShell>
    </HubErrorBoundary>
  );
});
