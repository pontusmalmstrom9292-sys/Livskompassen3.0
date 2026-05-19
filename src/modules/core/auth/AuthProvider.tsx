import { useEffect, type ReactNode } from 'react';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { app } from '../firebase/init';
import { useStore } from '../store';

const auth = getAuth(app);

export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useStore((s) => s.setUser);
  const setLoading = useStore((s) => s.setLoading);
  const resetState = useStore((s) => s.resetState);

  useEffect(() => {
    setLoading(true);
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? undefined,
          isAnonymous: firebaseUser.isAnonymous,
        });
      } else {
        try {
          const cred = await signInAnonymously(auth);
          setUser({
            uid: cred.user.uid,
            isAnonymous: true,
          });
        } catch {
          resetState();
        }
      }
      setLoading(false);
    });
    return unsub;
  }, [setUser, setLoading, resetState]);

  return <>{children}</>;
}

export { auth };
