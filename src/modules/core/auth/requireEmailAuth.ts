/**
 * När true: ingen anonym auto-inloggning — användaren måste koppla e-post (framtida hård låsning).
 * Sätt i `.env`: VITE_REQUIRE_EMAIL_AUTH=true
 */
export function isEmailAuthRequired(): boolean {
  return import.meta.env.VITE_REQUIRE_EMAIL_AUTH === 'true';
}
