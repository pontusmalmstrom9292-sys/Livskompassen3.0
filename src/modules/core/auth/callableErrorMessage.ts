import { isCapacitorNative } from '../platform/capacitorPlatform';

/** Mänskligt felmeddelande från Firebase callable / App Check / auth. */
export function formatCallableError(err: unknown): string {
  const e = err as { code?: string; message?: string };
  const code = String(e?.code ?? '');
  const msg = String(e?.message ?? err ?? '').trim();

  if (code.includes('unauthenticated') || msg.includes('Autentisering krävs')) {
    return 'Logga in innan du öppnar Valvet (Konto uppe till höger).';
  }
  if (
    code.includes('failed-precondition') ||
    msg.includes('App Check') ||
    msg.includes('App Check-verifiering')
  ) {
    if (isCapacitorNative()) {
      return 'App Check misslyckades på telefonen. Bygg om appen i Android Studio (Run), kör npm run android:appcheck-adb med USB, och kontrollera att debug-token finns i Firebase Console under App Check.';
    }
    return 'Säkerhetsverifiering (App Check) misslyckades. Ladda om sidan (Cmd+Shift+R) och försök igen.';
  }
  if (code.includes('resource-exhausted')) {
    return 'För många försök — vänta en minut och försök igen.';
  }
  if (msg.includes('network') || msg.includes('Network') || msg.includes('fetch')) {
    return 'Nätverksfel. Kontrollera anslutning och försök igen.';
  }
  if (code.includes('permission-denied') && msg.length > 0 && msg.length < 220) {
    return msg;
  }
  if (msg.length > 0 && msg.length < 200) {
    return msg;
  }
  return 'Åtgärden misslyckades. Försök igen.';
}
