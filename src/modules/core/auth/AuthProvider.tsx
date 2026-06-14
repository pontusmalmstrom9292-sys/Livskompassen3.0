import { useEffect, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInAnonymously,
  signOut,
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

      await googleRedirectBoot.catch((err: unknown) => {
        console.error('[AuthProvider] getRedirectResult failed', err);
        const code = err instanceof FirebaseError ? err.code : '';
        toast.error(mapAuthError(code) || 'Inloggningen misslyckades.', 6000);
        return null;
      });
      await auth.authStateReady();
      const redirectUser = auth.currentUser;
      if (redirectUser && !redirectUser.isAnonymous && !isUnmounted) {
        setUser({
          uid: redirectUser.uid,
          email: redirectUser.email ?? undefined,
          isAnonymous: redirectUser.isAnonymous,
        });
      }
    })().finally(() => {
      if (isUnmounted) return;
      unsub = onAuthStateChanged(auth, async (firebaseUser) => {
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
