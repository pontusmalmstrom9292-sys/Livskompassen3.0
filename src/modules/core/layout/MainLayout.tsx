/* PROTECTED CORE COMPONENT: DO NOT MODIFY, REFRACTOR, OR REMOVE UI ELEMENTS. THIS FILE IS LOCKED FOR ARCHITECTURAL STABILITY. */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { FloatingDock } from './FloatingDock';
import './coreLayoutChrome.css';
import { ExecutiveHomeChromeProvider } from '../home/ExecutiveHomeChromeContext';
import { FyrenWidgetBar } from '../components/FyrenWidgetBar';
import {
  FyrenHeaderQuickProvider,
  FyrenHeaderQuickToggle,
} from '../components/FyrenSideQuickDock';
import { W1EdgeQuickDock } from '../components/W1EdgeQuickDock';
import { FyrenWidgetProvider } from '../components/fyrenWidgetContext';

import { AppHeaderBar } from '../components/AppHeaderBar';
import { AmbientBackground } from './AmbientBackground';
import { KompisHeaderVaultButton } from '../components/KompisHeaderVaultButton';
import { AccountAuthMenu } from '../auth/AccountAuthMenu';
import { NavigationDrawer } from './NavigationDrawer';
import { FirestoreNetworkChip } from '../components/FirestoreNetworkChip';
import { SystemErrorBanner } from '../components/SystemErrorBanner';
import { useDesignPack } from '../design/useDesignPack';
import { isBarnportenChildRoute } from '@/features/onboarding/barnporten/constants/barnportenRoutes';
import { useStore } from '../store';
import { useTheme } from '../theme';
import { getTheme } from '../theme/themeRegistry';
import { isMidnightExecutiveTheme } from '../theme/themePackMidnightExecutive';
import { isBastaDesignTheme } from '../theme/themePackBastaDesign';
import { isMockupTheme } from '../theme/mockupTheme';
import { themeUsesDesignPackChrome } from '../theme/themePackDesign';
import { useCapacityScore } from '../store/useCapacityGate';
import { CAPACITY_LOW_HOME_THRESHOLD, normalizeStoredCapacityScore } from '../../../../shared/evolution/capacityScore';
import { SosMainTrigger } from '@/modules/features/sos/components/SosMainTrigger';
import { ExecutiveDecorCompass } from '../ui/executive/ExecutiveDecorCompass';
import { BastaDesignHeader } from './basta-design/BastaDesignHeader';
import { BastaDesignDock } from './basta-design/BastaDesignDock';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isScenicHome = location.pathname === '/';
  const user = useStore((s) => s.user);
  const kompisAuraActive = useStore((s) => s.system.kompisAuraActive);
  const isMenuOpen = useStore((s) => s.ui.isMenuOpen);
  const setMenuOpen = useStore((s) => s.setMenuOpen);
  const { themeId } = useTheme();
  const { active: designPackActive } = useDesignPack();
  const bastaDesignSkin = isBastaDesignTheme(themeId);
  const mockupSkin =
    isMockupTheme(themeId) ||
    themeUsesDesignPackChrome(getTheme(themeId)) ||
    isMidnightExecutiveTheme(themeId) ||
    bastaDesignSkin;
  const executiveSkin = isMidnightExecutiveTheme(themeId) && !bastaDesignSkin;
  const barnportenChildShell = isBarnportenChildRoute(location.pathname);
  const [accountOpen, setAccountOpen] = useState(false);
  const slimHeaderChrome = designPackActive && isScenicHome;
  const capacityScore = useCapacityScore();
  const normalized = normalizeStoredCapacityScore(capacityScore);
  const isLowCapacity = normalized > 0 && normalized < CAPACITY_LOW_HOME_THRESHOLD;

  useEffect(() => {
    if (!user) setMenuOpen(false);
  }, [user, setMenuOpen]);

  return (
    <FyrenWidgetProvider>
    <FyrenHeaderQuickProvider>
    <ExecutiveHomeChromeProvider enabled={executiveSkin}>
    <div
      className={clsx(
        'app-shell relative min-h-screen text-text font-sans selection:bg-accent/30',
        mockupSkin && 'app-shell--mockup-skin',
        bastaDesignSkin && 'app-shell--basta-design',
        isLowCapacity && 'capacity-low'
      )}
    >
      <AmbientBackground />

      {bastaDesignSkin ? (
        <BastaDesignHeader
          onMenuClick={() => setMenuOpen(true)}
          accountOpen={accountOpen}
          onAccountOpenChange={setAccountOpen}
        />
      ) : (
      <header className={clsx('app-header', executiveSkin && 'app-header--executive-premium')}>
        <div className="app-header__inner">
          <AppHeaderBar
            menuExpanded={isMenuOpen}
            onMenuClick={() => setMenuOpen(true)}
            headerVariant={executiveSkin ? 'executive-premium' : 'default'}
            headerQuickToggle={executiveSkin ? undefined : <FyrenHeaderQuickToggle />}
            actions={
              executiveSkin ? (
                <>
                  <AccountAuthMenu
                    open={accountOpen}
                    onOpenChange={setAccountOpen}
                    compactTrigger
                    chromeVariant="executive"
                  />
                  <KompisHeaderVaultButton
                    kompisAuraActive={kompisAuraActive}
                    variant="executive-header"
                  />
                  <span className="exec-header-compass-mark" aria-hidden>
                    <ExecutiveDecorCompass size="sm" />
                  </span>
                </>
              ) : slimHeaderChrome ? (
                <KompisHeaderVaultButton kompisAuraActive={kompisAuraActive} />
              ) : (
                <>
                  <AccountAuthMenu
                    open={accountOpen}
                    onOpenChange={setAccountOpen}
                    compactTrigger
                  />
                  <KompisHeaderVaultButton kompisAuraActive={kompisAuraActive} />
                </>
              )
            }
          />
        </div>
      </header>
      )}

      <NavigationDrawer />

      <FirestoreNetworkChip />
      <SystemErrorBanner />

      <main
        className={clsx(
          'app-main relative z-10 mx-auto flex min-h-0 w-full max-w-2xl flex-col',
          bastaDesignSkin ? (isScenicHome ? 'px-0' : 'px-4') : 'px-4',
          barnportenChildShell && 'pb-16',
        )}
      >
        <SosMainTrigger />
        {children}
      </main>

      {!barnportenChildShell ? (
        <>
          {!executiveSkin && !bastaDesignSkin ? <FyrenWidgetBar /> : null}
          {executiveSkin ? <W1EdgeQuickDock /> : null}
          {bastaDesignSkin ? <BastaDesignDock /> : <FloatingDock />}
        </>
      ) : null}
    </div>
    </ExecutiveHomeChromeProvider>
    </FyrenHeaderQuickProvider>
    </FyrenWidgetProvider>
  );
}
