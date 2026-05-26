import { useEffect, type ReactNode } from 'react';
import { getAuth, getRedirectResult, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { app } from '../firebase/init';
import { useStore } from '../store';
import { consumeSkipAnonymousOnce } from './googleAuthProvider';
import { isEmailAuthRequired } from './requireEmailAuth';

const auth = getAuth(app);

export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useStore((s) => s.setUser);
  const setLoading = useStore((s) => s.setLoading);
  const resetState = useStore((s) => s.resetState);

  useEffect(() => {
    setLoading(true);
    let unsub: (() => void) | undefined;

    void getRedirectResult(auth)
      .then((cred) => {
        if (cred?.user) {
          setUser({
            uid: cred.user.uid,
            email: cred.user.email ?? undefined,
            isAnonymous: cred.user.isAnonymous,
          });
        }
      })
      .catch(() => {
        /* ogiltig redirect-state — ignorera */
      })
      .finally(() => {
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
