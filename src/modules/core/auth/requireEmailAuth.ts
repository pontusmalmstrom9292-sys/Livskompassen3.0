import type { User } from '../store';

/**
 * När true: ingen anonym auto-inloggning — användaren måste koppla Google/e-post.
 * Prod: sätt `VITE_REQUIRE_EMAIL_AUTH=true` vid `npm run build` (se docs/DEPLOY.md).
 */
export function isEmailAuthRequired(): boolean {
  return import.meta.env.VITE_REQUIRE_EMAIL_AUTH === 'true';
}

/** Sant när användaren har verifierat e-post (Google eller Email/Password). */
export function isVerifiedEmailUser(isAnonymous: boolean, email?: string, emailVerified?: boolean): boolean {
  if (isAnonymous) return false;
  if (emailVerified === false) return false;
  if (emailVerified === true) return true;
  return Boolean(email);
}

/**
 * Matchar Firestore `isSensitiveAuth()` — journal, emotional_memory, vit_entries m.fl.
 * Kräver inloggad, icke-anonym användare med verifierad e-post.
 */
export function canAccessSensitiveFirestoreSilo(user: User | null | undefined): boolean {
  if (!user?.uid) return false;
  return isVerifiedEmailUser(user.isAnonymous ?? true, user.email, user.emailVerified);
}

export const SENSITIVE_SILO_LOGIN_MESSAGE =
  'Dagbok och känslig data kräver Google-inloggning med verifierad e-post. Tryck Konto uppe till höger och logga in.';
