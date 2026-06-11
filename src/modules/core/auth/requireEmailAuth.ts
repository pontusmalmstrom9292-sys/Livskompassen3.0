/**
 * När true: ingen anonym auto-inloggning — användaren måste koppla Google/e-post.
 * Prod: sätt `VITE_REQUIRE_EMAIL_AUTH=true` vid `npm run build` (se docs/DEPLOY.md).
 */
export function isEmailAuthRequired(): boolean {
  return import.meta.env.VITE_REQUIRE_EMAIL_AUTH === 'true';
}

/** Sant när användaren har verifierat e-post (Google eller Email/Password). */
export function isVerifiedEmailUser(isAnonymous: boolean, email?: string): boolean {
  return !isAnonymous && Boolean(email);
}
