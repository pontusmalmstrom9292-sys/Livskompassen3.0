import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import {
  GoogleAuthProvider,
  linkWithCredential,
  signInWithCredential,
  type User,
} from 'firebase/auth';
import { auth } from '../firebase/init';
import { getExpectedLoginEmail } from './googleAuthProvider';
import { isCapacitorAndroid } from './capacitorPlatform';

/** OAuth tokens from native Google picker — web Firebase JS SDK signs in separately. */
async function fetchNativeGoogleCredential() {
  const hint = getExpectedLoginEmail();
  const result = await FirebaseAuthentication.signInWithGoogle({
    skipNativeAuth: true,
    ...(hint
      ? {
          customParameters: [{ key: 'login_hint', value: hint }],
        }
      : {}),
  });

  const idToken = result.credential?.idToken;
  if (!idToken) {
    throw new Error('Google-inloggning returnerade ingen token.');
  }

  return GoogleAuthProvider.credential(idToken, result.credential?.accessToken);
}

/**
 * Google Sign-In inside Capacitor (Android/iOS) — stays in-app via native Credential Manager.
 * Syncs the Firebase JS SDK session used by Firestore.
 */
export async function capacitorGoogleSignIn(linkAnonymous: boolean): Promise<User> {
  const credential = await fetchNativeGoogleCredential();
  const current = auth.currentUser;

  if (current?.isAnonymous && linkAnonymous) {
    const linked = await linkWithCredential(current, credential);
    return linked.user;
  }

  const signedIn = await signInWithCredential(auth, credential);
  return signedIn.user;
}

/** Android: finish auth if OS backgrounded the app during Google flow. */
export async function tryCompletePendingNativeGoogleSignIn(): Promise<User | null> {
  if (!isCapacitorAndroid()) return null;

  try {
    const pending = await FirebaseAuthentication.getPendingAuthResult();
    const idToken = pending.credential?.idToken;
    if (!idToken) return null;

    const credential = GoogleAuthProvider.credential(idToken, pending.credential?.accessToken);
    const result = await signInWithCredential(auth, credential);
    return result.user;
  } catch {
    return null;
  }
}

/** Clear native Firebase session when signing out on device. */
export async function capacitorNativeSignOut(): Promise<void> {
  try {
    await FirebaseAuthentication.signOut();
  } catch {
    /* native layer may already be signed out */
  }
}
