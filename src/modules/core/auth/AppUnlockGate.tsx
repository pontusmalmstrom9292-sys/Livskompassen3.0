import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal } from '@/design-system';
import { useStore } from '../store';
import { isAppUnlockSupported } from './appUnlock';
import { FingerprintUnlockPanel } from './FingerprintUnlockPanel';
import { isAppUnlockEnabled, isAppUnlockedThisSession, markAppUnlockedThisSession } from './appUnlockPrefs';
import { isCapacitorNative } from './capacitorPlatform';

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

  // Capacitor: SacredLockManager äger biometri — web-WebAuthn-gate får inte blockera efter Google-login.
  const isNative = isCapacitorNative();
  const needsUnlock =
    !isWidgetRoute &&
    !isNative &&
    !isLoading &&
    !!user &&
    !user.isAnonymous &&
    isAppUnlockEnabled() &&
    isAppUnlockSupported() &&
    !isAppUnlockedThisSession() &&
    !dismissed;

  useEffect(() => {
    if (isWidgetRoute) return;
    // #region agent log
    const data = {
      isNative,
      isLoading,
      hasUser: !!user,
      isAnonymous: user?.isAnonymous ?? null,
      unlockEnabled: isAppUnlockEnabled(),
      unlockSupported: isAppUnlockSupported(),
      unlockedSession: isAppUnlockedThisSession(),
      needsUnlock,
      path: location.pathname,
    };
    console.warn('[DBG-4bae45]', 'AppUnlockGate.tsx:gate', 'unlock gate decision', data);
    fetch('http://127.0.0.1:7891/ingest/e2aa352c-17db-4fb0-8a3f-df79408d16d3', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '4bae45' },
      body: JSON.stringify({
        sessionId: '4bae45',
        runId: 'pre-fix',
        hypothesisId: 'G',
        location: 'AppUnlockGate.tsx:gate',
        message: 'unlock gate decision',
        data,
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }, [isWidgetRoute, isNative, isLoading, user, needsUnlock, location.pathname]);

  if (isWidgetRoute) {
    return <>{children}</>;
  }

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
