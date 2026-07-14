import { useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal } from '@/design-system';
import { useStore } from '../store';
import { isAppUnlockSupported } from './appUnlock';
import { FingerprintUnlockPanel } from './FingerprintUnlockPanel';
import { isAppUnlockEnabled, isAppUnlockedThisSession, markAppUnlockedThisSession } from './appUnlockPrefs';

type Props = {
  children: ReactNode;
};

/** Kräver fingeravtryck/Face ID när aktiverat och Firebase-session finns. */
export function AppUnlockGate({ children }: Props) {
  const location = useLocation();
  const user = useStore((s) => s.user);
  const isLoading = useStore((s) => s.system.isLoading);
  const [dismissed, setDismissed] = useState(false);

  const isWidgetRoute = location.pathname.startsWith('/widget');

  if (isWidgetRoute) {
    return <>{children}</>;
  }

  const needsUnlock =
    !isLoading &&
    !!user &&
    !user.isAnonymous &&
    isAppUnlockEnabled() &&
    isAppUnlockSupported() &&
    !isAppUnlockedThisSession() &&
    !dismissed;

  if (!needsUnlock) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <Modal
        open
        onClose={() => {
          /* Blockerande gate — stängs endast via lyckad biometri */
        }}
        hideHeader
        ariaLabel="Lås upp Livskompassen"
        className="!z-[225] !items-center !justify-center !bg-black/40 !px-6 !backdrop-blur-none"
        panelClassName="!border-0 !bg-transparent !p-0 !shadow-none glow-none"
        lockScroll
      >
        <FingerprintUnlockPanel
          autoTry
          onSuccess={() => {
            markAppUnlockedThisSession();
            setDismissed(true);
          }}
        />
      </Modal>
    </>
  );
}
