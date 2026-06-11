/** Mänskligt felmeddelande från Firebase callable / App Check / auth. */
export function formatCallableError(err: unknown): string {
  const e = err as { code?: string; message?: string };
  const code = String(e?.code ?? '');
  const msg = String(e?.message ?? err ?? '');

  if (
    code.includes('failed-precondition') ||
    msg.includes('App Check-verifiering') ||
    msg.includes('App Check')
  ) {
    return 'Säkerhetsverifiering (App Check) misslyckades. Uppdatera appen eller logga in igen.';
  }
  if (code.includes('unauthenticated') || msg.includes('Autentisering krävs')) {
    return 'Logga in innan du öppnar Valvet (Konto uppe till höger).';
  }
  if (code.includes('permission-denied') || msg.includes('WebAuthn')) {
    return 'Biometri nekades eller avbröts. Försök igen.';
  }
  if (code.includes('resource-exhausted')) {
    return 'För många försök — vänta en minut och försök igen.';
  }
  if (msg.includes('network') || msg.includes('Network') || msg.includes('fetch')) {
    return 'Nätverksfel. Kontrollera anslutning och försök igen.';
  }
  return msg.length > 0 && msg.length < 200 ? msg : 'Åtgärden misslyckades. Försök igen.';
}
