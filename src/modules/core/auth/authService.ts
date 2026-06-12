import {
  EmailAuthProvider,
  linkWithCredential,
  linkWithPopup,
  linkWithRedirect,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from './AuthProvider';
import { clearAppUnlockSession } from './appUnlockPrefs';
import { endVaultSession } from '../security/vaultSessionLifecycle';
import { clearSpeglarSession } from '@/features/lifeJournal/diary/mirror/utils/speglarSessionStorage';
import { clearMaterialPackLocalCache } from '../lifeOs/materialPackApi';
import { isCapacitorNative } from './capacitorPlatform';
import { capacitorGoogleSignIn, capacitorNativeSignOut } from './nativeGoogleAuth';
import {
  createGoogleProvider,
  markSkipAnonymousOnce,
  shouldUseGoogleRedirect,
} from './googleAuthProvider';
import { clearAllDrafts } from '../../capture/draftQueue';
import { clearAllPendingBarnportenLogs } from '@/features/onboarding/barnporten/api/barnportenOfflineQueue';

export function mapAuthError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'E-postadressen används redan. Prova Logga in i stället.';
    case 'auth/invalid-email':
      return 'Ogiltig e-postadress.';
    case 'auth/weak-password':
      return 'Lösenordet måste vara minst 6 tecken.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Fel e-post eller lösenord.';
    case 'auth/too-many-requests':
      return 'För många försök. Vänta en stund och försök igen.';
    case 'auth/credential-already-in-use':
      return 'E-postadressen är kopplad till ett annat konto.';
    case 'auth/popup-closed-by-user':
      return 'Inloggningen avbröts.';
    case 'auth/popup-blocked':
      return 'Popup blockerades. Tillåt popups för den här sidan och försök igen.';
    case 'auth/account-exists-with-different-credential':
      return 'E-posten finns redan med annan inloggning. Prova Logga in med e-post.';
    case 'auth/unauthorized-domain':
      return 'Domänen är inte godkänd i Firebase. Lägg till denna URL under Authentication → Settings → Authorized domains.';
    case 'auth/operation-not-supported-in-this-environment':
      return 'Inloggning stöds inte i den här webbläsaren. Prova Chrome/Safari eller dator.';
    case 'auth/cancelled-popup-request':
    case 'auth/user-cancelled':
      return 'Inloggningen avbröts.';
    default:
      if (/developer_error/i.test(code)) {
        return 'Google-inloggning avvisades av Android. Kontrollera SHA-1 i Firebase (se docs/FIREBASE-AUTH-LATHUND.md) och installera om appen.';
      }
      if (code.includes('cancel') || code.includes('12501')) {
        return 'Inloggningen avbröts.';
      }
      return 'Inloggning misslyckades. Försök igen.';
  }
}

/** Kopplar e-post till nuvarande anonym session — behåller samma uid och all sparad data. */
export async function linkOrCreateEmailAccount(email: string, password: string): Promise<User> {
  const trimmed = email.trim();
  const credential = EmailAuthProvider.credential(trimmed, password);
  const current = auth.currentUser;

  if (current?.isAnonymous) {
    const result = await linkWithCredential(current, credential);
    return result.user;
  }

  const result = await createUserWithEmailAndPassword(auth, trimmed, password);
  return result.user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email.trim(), password);
  return result.user;
}

export type SignInWithGoogleOptions = {
  /**
   * true = koppla Google till nuvarande anonym uid (Skapa konto).
   * false = logga in på befintligt Firebase-konto (välj rätt Google i popup).
   */
  linkAnonymous?: boolean;
};

/**
 * Google — vid Logga in: befintligt konto. Vid Skapa konto: koppla anonym uid.
 * Returnerar `null` när redirect startats (sidan lämnar appen — vänta på återkomst).
 */
export async function signInWithGoogle(options: SignInWithGoogleOptions = {}): Promise<User | null> {
  const provider = createGoogleProvider();
  const current = auth.currentUser;
  const linkAnonymous = options.linkAnonymous ?? false;

  if (isCapacitorNative()) {
    if (current?.isAnonymous && linkAnonymous) {
      return capacitorGoogleSignIn(true);
    }
    if (current) {
      markSkipAnonymousOnce();
      await signOut(auth);
    } else {
      markSkipAnonymousOnce();
    }
    return capacitorGoogleSignIn(false);
  }

  const useRedirect = shouldUseGoogleRedirect();

  if (current?.isAnonymous && linkAnonymous) {
    if (useRedirect) {
      await linkWithRedirect(current, provider);
      return null;
    }
    const result = await linkWithPopup(current, provider);
    return result.user;
  }

  if (current) {
    markSkipAnonymousOnce();
    await signOut(auth);
  } else {
    markSkipAnonymousOnce();
  }

  if (useRedirect) {
    await signInWithRedirect(auth, provider);
    return null;
  }

  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  const uid = auth.currentUser?.uid;
  await endVaultSession();
  clearSpeglarSession();
  clearAppUnlockSession();
  if (uid) clearMaterialPackLocalCache(uid);
  await clearAllDrafts();
  await clearAllPendingBarnportenLogs();
  if (isCapacitorNative()) {
    await capacitorNativeSignOut();
  }
  await signOut(auth);
}
