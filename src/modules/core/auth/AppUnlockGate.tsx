import { useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../store';
import { isAppUnlockSupported } from './appUnlock';
import { FingerprintUnlockPanel } from './FingerprintUnlockPanel';
import { isAppUnlockEnabled, isAppUnlockedThisSession, markAppUnlockedThisSession } from './appUnlockPrefs';

type Props = {
  children: ReactNode;
};

/** Kräver fingeravtryck/Face ID när aktiverat och Firebase-session finns. */
export function AppUnlockGate({ children }: Props) {
  const user = useStore((s) => s.user);
  const isLoading = useStore((s) => s.system.isLoading);
  const [dismissed, setDismissed] = useState(false);

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
      {createPortal(
        <div className="app-unlock-gate" role="dialog" aria-label="Lås upp Livskompassen">
          <FingerprintUnlockPanel
            autoTry
            onSuccess={() => {
              markAppUnlockedThisSession();
              setDismissed(true);
            }}
          />
        </div>,
        document.body,
      )}
    </>
  );
}
