import { useEffect, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInAnonymously,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '../firebase/init';
import { googleRedirectBoot } from '../firebase/authRedirectBoot';
import { useStore } from '../store';
import { isCapacitorAndroid } from './capacitorPlatform';
import { tryCompletePendingNativeGoogleSignIn } from './nativeGoogleAuth';
import { consumeSkipAnonymousOnce } from './googleAuthProvider';
import { isEmailAuthRequired } from './requireEmailAuth';
import { enableAppUnlock, isAppUnlockSupported } from './appUnlock';
import { consumeFingerprintSetupPending } from './appUnlockPrefs';
import { toast } from '../store/toastStore';
import { mapAuthError } from './authService';
import { FirebaseError } from 'firebase/app';

function syncUserToStore(
  firebaseUser: User,
  setUser: ReturnType<typeof useStore.getState>['setUser'],
): void {
  setUser({
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? undefined,
    isAnonymous: firebaseUser.isAnonymous,
    emailVerified: firebaseUser.emailVerified,
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useStore((s) => s.setUser);
  const setLoading = useStore((s) => s.setLoading);
  const resetState = useStore((s) => s.resetState);

  useEffect(() => {
    setLoading(true);
    let isUnmounted = false;
    const loadingWatchdog = window.setTimeout(() => {
      if (!isUnmounted) {
        console.warn('[AuthProvider] auth boot watchdog — släpper laddningslås');
        setLoading(false);
      }
    }, 12_000);

    const handleAuthUser = async (firebaseUser: User | null) => {
      window.clearTimeout(loadingWatchdog);
      if (firebaseUser) {
        if (isEmailAuthRequired() && firebaseUser.isAnonymous) {
          try {
            await signOut(auth);
          } catch {
            /* ignore */
          }
          if (!isUnmounted) resetState();
          if (!isUnmounted) setLoading(false);
          return;
        }
        try {
          syncUserToStore(firebaseUser, setUser);
          if (!firebaseUser.isAnonymous && consumeFingerprintSetupPending() && isAppUnlockSupported()) {
            void enableAppUnlock();
          }
        } catch (err: unknown) {
          console.error('[AuthProvider] Auth State Error:', err);
          const msg = err instanceof Error ? err.message : 'Något gick fel vid inloggning.';
          toast.error(msg, 6000);
        }
      } else if (!isEmailAuthRequired()) {
        if (consumeSkipAnonymousOnce()) {
          resetState();
          setLoading(false);
          return;
        }
        try {
          const cred = await signInAnonymously(auth);
          if (!isUnmounted) {
            syncUserToStore(cred.user, setUser);
          }
        } catch (err: unknown) {
          console.error('[AuthProvider] Anonymous sign-in failed', err);
          if (!isUnmounted) resetState();
          const code = err instanceof FirebaseError ? err.code : '';
          toast.error(
            mapAuthError(code) || 'Kunde inte starta gästsession. Kontrollera nätverket och försök igen.',
            6000,
          );
        }
      } else {
        resetState();
      }
      if (!isUnmounted) setLoading(false);
    };

    // Listener direkt — UI uppdateras utan manuell reload efter Google popup.
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      void handleAuthUser(firebaseUser);
    });

    void (async () => {
      if (isCapacitorAndroid()) {
        const pendingUser = await tryCompletePendingNativeGoogleSignIn();
        if (pendingUser && !isUnmounted) {
          syncUserToStore(pendingUser, setUser);
          setLoading(false);
        }
      }

      await googleRedirectBoot.catch((err: unknown) => {
        console.error('[AuthProvider] getRedirectResult failed', err);
        const code = err instanceof FirebaseError ? err.code : '';
        const message = err instanceof Error ? err.message : '';
        const missingState = /missing initial state|saknat initialt tillst/i.test(message);
        toast.error(
          missingState
            ? 'Google-inloggning tappade sessionen. Stäng auth-fliken, gå tillbaka till appen och försök igen — tillåt popups i webbläsaren.'
            : mapAuthError(code) || 'Inloggningen misslyckades.',
          missingState ? 8000 : 6000,
        );
        return null;
      });

      await auth.authStateReady();
      const redirectUser = auth.currentUser;
      if (redirectUser && !redirectUser.isAnonymous && !isUnmounted) {
        syncUserToStore(redirectUser, setUser);
        setLoading(false);
      }
    })();

    return () => {
      isUnmounted = true;
      window.clearTimeout(loadingWatchdog);
      unsub();
    };
  }, [setUser, setLoading, resetState]);

  return <>{children}</>;
}
