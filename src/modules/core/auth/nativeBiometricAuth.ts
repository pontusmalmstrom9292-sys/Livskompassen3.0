/**
 * nativeBiometricAuth.ts
 *
 * Adapter mot @aparajita/capacitor-biometric-auth.
 * Används ENBART när isCapacitorNative() === true och WebAuthn bedömts
 * som opålitlig i Capacitor WebView (se isWebAuthnReliable() i vaultWebAuthnClient.ts).
 *
 * Säkerhetsegenskaper:
 * - Biometrin verifieras av Android TEE (Trusted Execution Environment) / Secure Enclave (iOS).
 * - allowDeviceCredential: false → systemets PIN/mönster accepteras INTE som fallback.
 *   Vi vill inte delegera till Android-systemlåset — vår PIN-grind hanteras separat.
 * - Inga biometriska data lämnar enheten — vi får bara boolean ok/fail från OS.
 * - allowDeviceCredential: false är ett viktigt säkerhetsbeslut i linje med Zero Footprint.
 */

import { BiometricAuth, BiometryType } from '@aparajita/capacitor-biometric-auth';
import { isCapacitorNative, getCapacitorPlatform } from '../platform/capacitorPlatform';

export type NativeBiometricResult =
  | { ok: true; platform: 'android' | 'ios' }
  | { ok: false; message: string; reason: 'unavailable' | 'cancelled' | 'error' };

/**
 * Kontrollerar om native biometri är tillgänglig och konfigurerad på enheten.
 * Returnerar false om vi inte är i Capacitor native-context.
 */
export async function isNativeBiometricAvailable(): Promise<boolean> {
  if (!isCapacitorNative()) return false;
  try {
    const info = await BiometricAuth.checkBiometry();
    return info.isAvailable;
  } catch {
    return false;
  }
}

/**
 * Utför native biometrisk autentisering via Android Fingerprint / Face Unlock
 * eller iOS Touch ID / Face ID.
 *
 * Returnerar { ok: true, platform } vid godkänd biometri.
 * Returnerar { ok: false, reason, message } vid avbrott, nekad, eller ej tillgänglig.
 */
export async function performNativeBiometric(): Promise<NativeBiometricResult> {
  if (!isCapacitorNative()) {
    return {
      ok: false,
      message: 'Native biometri är inte tillgänglig i webbläsarmiljö.',
      reason: 'unavailable',
    };
  }

  try {
    const info = await BiometricAuth.checkBiometry();

    if (!info.isAvailable) {
      const hint = buildUnavailableHint(info.biometryType);
      return { ok: false, message: hint, reason: 'unavailable' };
    }

    // Utför autentiseringen — OS visar systemets biometri-dialog
    await BiometricAuth.authenticate({
      reason: 'Verifiera din identitet för att öppna Valvet',
      cancelTitle: 'Avbryt',
      // SÄKERHETSBESLUT: false = systemets PIN/mönster är INTE tillåtet som fallback.
      // Valvet har sin egen PIN-grind — vi delegerar inte till Android-låsskärmen.
      allowDeviceCredential: false,
      iosFallbackTitle: '', // tom = döljer "Use Passcode"-knappen på iOS
    });

    const platform = getCapacitorPlatform() as 'android' | 'ios';
    return { ok: true, platform };
  } catch (err) {
    return classifyBiometricError(err);
  }
}

/**
 * Returnerar ett användarvänligt felmeddelande baserat på biometritype.
 */
function buildUnavailableHint(biometryType: BiometryType): string {
  switch (biometryType) {
    case BiometryType.none:
      return 'Ingen biometri är konfigurerad på enheten. Aktivera fingeravtryck eller Face ID i Android-inställningar → Säkerhet → Biometri.';
    case BiometryType.touchId:
      return 'Touch ID är inte tillgängligt. Kontrollera inställningarna.';
    case BiometryType.faceId:
      return 'Face ID är inte tillgängligt. Kontrollera inställningarna.';
    default:
      return 'Biometri är inte tillgänglig på enheten just nu.';
  }
}

/**
 * Klassificerar fel från BiometricAuth.authenticate():
 * - Avbrott av användare → 'cancelled'
 * - Ogiltig autentisering / too many attempts → 'error'
 */
function classifyBiometricError(err: unknown): NativeBiometricResult {
  const message = err instanceof Error ? err.message : String(err);
  const lower = message.toLowerCase();

  // Typiska avbrottsfel från @aparajita/capacitor-biometric-auth
  if (
    lower.includes('cancel') ||
    lower.includes('user cancel') ||
    lower.includes('biometrycanceled') ||
    lower.includes('authenticationfailed') === false && lower.includes('cancel')
  ) {
    return {
      ok: false,
      message: 'Biometri avbruten. Tryck igen för att öppna Valvet.',
      reason: 'cancelled',
    };
  }

  // Fel vid för många misslyckade försök, lockout, etc.
  if (lower.includes('lockout') || lower.includes('too many')) {
    return {
      ok: false,
      message: 'För många misslyckade försök. Lås upp enheten med PIN och försök igen.',
      reason: 'error',
    };
  }

  return {
    ok: false,
    message: 'Biometri misslyckades. Försök igen eller kontakta support.',
    reason: 'error',
  };
}
