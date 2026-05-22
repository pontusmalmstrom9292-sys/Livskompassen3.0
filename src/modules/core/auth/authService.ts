import {
  EmailAuthProvider,
  linkWithCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from './AuthProvider';

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
    default:
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

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}
