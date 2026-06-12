import { useEffect, type ReactNode } from 'react';
import {
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  signInAnonymously,
  type UserCredential,
} from 'firebase/auth';
import { app } from '../firebase/init';
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

const auth = getAuth(app);

/**
 * getRedirectResult() may only be consumed once per redirect round-trip.
 * React 18 Strict Mode runs effects twice in dev — a second call returns empty
 * and would leave the user stuck on anonymous unless we share one promise.
 */
let redirectResultPromise: Promise<UserCredential | null> | null = null;

function getRedirectResultSingleFlight(): Promise<UserCredential | null> {
  if (!redirectResultPromise) {
    redirectResultPromise = getRedirectResult(auth)
      .catch((err: unknown) => {
        console.error('[AuthProvider] getRedirectResult failed', err);
        const code = err instanceof FirebaseError ? err.code : '';
        toast.error(mapAuthError(code) || 'Inloggningen misslyckades.', 6000);
        redirectResultPromise = null;
        return null;
      });
  }
  return redirectResultPromise;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useStore((s) => s.setUser);
  const setLoading = useStore((s) => s.setLoading);
  const resetState = useStore((s) => s.resetState);

  useEffect(() => {
    setLoading(true);
    let unsub: (() => void) | undefined;
    let isUnmounted = false;

    void (async () => {
      if (isCapacitorAndroid()) {
        const pendingUser = await tryCompletePendingNativeGoogleSignIn();
        if (pendingUser && !isUnmounted) {
          setUser({
            uid: pendingUser.uid,
            email: pendingUser.email ?? undefined,
            isAnonymous: pendingUser.isAnonymous,
          });
        }
      }

      const cred = await getRedirectResultSingleFlight();
      if (cred?.user && !isUnmounted) {
        setUser({
          uid: cred.user.uid,
          email: cred.user.email ?? undefined,
          isAnonymous: cred.user.isAnonymous,
        });
      }
    })().finally(() => {
      if (isUnmounted) return;
      unsub = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          console.log("Auth State:", firebaseUser);
          try {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email ?? undefined,
              isAnonymous: firebaseUser.isAnonymous,
            });
            if (!firebaseUser.isAnonymous && consumeFingerprintSetupPending() && isAppUnlockSupported()) {
              void enableAppUnlock();
            }
          } catch (err: unknown) {
            console.error("Auth State Error:", err);
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
              setUser({
                uid: cred.user.uid,
                isAnonymous: true,
              });
            }
          } catch {
            if (!isUnmounted) resetState();
          }
        } else {
          resetState();
        }
        if (!isUnmounted) setLoading(false);
      });
    });

    return () => {
      isUnmounted = true;
      unsub?.();
    };
  }, [setUser, setLoading, resetState]);

  return <>{children}</>;
}

export { auth };
