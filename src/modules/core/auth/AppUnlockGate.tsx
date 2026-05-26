import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Fingerprint, Loader2 } from 'lucide-react';
import { useStore } from '../store';
import { authenticateAppUnlock, isAppUnlockSupported } from './appUnlock';
import {
  isAppUnlockEnabled,
  isAppUnlockedThisSession,
  markAppUnlockedThisSession,
} from './appUnlockPrefs';

type Props = {
  children: ReactNode;
};

/** Kräver fingeravtryck/Face ID när aktiverat och Firebase-session finns. */
export function AppUnlockGate({ children }: Props) {
  const user = useStore((s) => s.user);
  const isLoading = useStore((s) => s.system.isLoading);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const needsUnlock =
    !isLoading &&
    !!user &&
    !user.isAnonymous &&
    isAppUnlockEnabled() &&
    isAppUnlockSupported() &&
    !isAppUnlockedThisSession() &&
    !dismissed;

  const tryUnlock = useCallback(async () => {
    setPending(true);
    setError(null);
    const ok = await authenticateAppUnlock();
    setPending(false);
    if (ok) {
      markAppUnlockedThisSession();
      setDismissed(true);
    } else {
      setError('Upplåsning misslyckades. Försök igen.');
    }
  }, []);

  useEffect(() => {
    if (!needsUnlock) return;
    void tryUnlock();
  }, [needsUnlock, tryUnlock]);

  if (!needsUnlock) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {createPortal(
        <div className="app-unlock-gate" role="dialog" aria-label="Lås upp Livskompassen">
          <div className="app-unlock-gate__card glass-card">
            <Fingerprint className="mx-auto h-8 w-8 text-accent" strokeWidth={1.5} />
            <p className="mt-3 text-center text-sm font-medium text-text">Lås upp med fingeravtryck</p>
            <p className="mt-1 text-center text-xs text-text-dim">
              Ditt Google-konto är redan inloggat — verifiera dig för att öppna appen.
            </p>
            <button
              type="button"
              className="btn-pill--accent mt-4 flex w-full items-center justify-center gap-2"
              disabled={pending}
              onClick={() => void tryUnlock()}
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Fingerprint className="h-4 w-4" />}
              {pending ? 'Verifierar…' : 'Lås upp'}
            </button>
            {error && <p className="mt-2 text-center text-xs text-danger">{error}</p>}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
