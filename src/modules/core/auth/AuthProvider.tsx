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
        console.warn('[AuthProvider] getRedirectResult failed', err);
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

    void (async () => {
      if (isCapacitorAndroid()) {
        const pendingUser = await tryCompletePendingNativeGoogleSignIn();
        if (pendingUser) {
          setUser({
            uid: pendingUser.uid,
            email: pendingUser.email ?? undefined,
            isAnonymous: pendingUser.isAnonymous,
          });
        }
      }

      const cred = await getRedirectResultSingleFlight();
      if (cred?.user) {
        setUser({
          uid: cred.user.uid,
          email: cred.user.email ?? undefined,
          isAnonymous: cred.user.isAnonymous,
        });
      }
    })().finally(() => {
      unsub = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email ?? undefined,
            isAnonymous: firebaseUser.isAnonymous,
          });
        } else if (!isEmailAuthRequired()) {
          if (consumeSkipAnonymousOnce()) {
            resetState();
            setLoading(false);
            return;
          }
          try {
            const cred = await signInAnonymously(auth);
            setUser({
              uid: cred.user.uid,
              isAnonymous: true,
            });
          } catch {
            resetState();
          }
        } else {
          resetState();
        }
        setLoading(false);
      });
    });

    return () => {
      unsub?.();
    };
  }, [setUser, setLoading, resetState]);

  return <>{children}</>;
}

export { auth };
