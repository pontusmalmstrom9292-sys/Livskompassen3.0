import type { NavigateFunction } from 'react-router-dom';
import { NAV_PATHS } from '../navigation/navTruth';
import { setVaultGate, clearVaultGate } from './sessionService';
import { isWebAuthnReliable, performVaultWebAuthnForSession } from './vaultWebAuthnClient';
import { issueVaultServerSession, issueVaultSessionViaBiometric } from './vaultServerSession';
import { isEmailAuthRequired } from './requireEmailAuth';
import { isCapacitorNative, getCapacitorPlatform } from '../platform/capacitorPlatform';
import { performNativeBiometric } from './nativeBiometricAuth';
import { useStore } from '../store';

type OpenValvViaFyrenOptions = {
  pathname?: string;
  search?: string;
  onDenied?: (message: string) => void;
};

/**
 * Kompis-öga 3s-håll (eller nödknapp) → autentisering → Valv (Dagbok bevis).
 *
 * Autentiseringskedja (i prioritetsordning):
 *  1. Webb/Desktop     → WebAuthn (server-backed FIDO2) — primärt, oförändrat.
 *  2. Capacitor native → Native Biometric (Android TEE / iOS Secure Enclave) — fallback.
 *     Aktiveras automatiskt om isWebAuthnReliable() returnerar false.
 *
 * Bakåtkompatibel: WebAuthn-logiken för webbläsare är helt oförändrad.
 * Zero Footprint: sessionslivstid 1h idle, same som innan.
 */
export async function openValvViaFyren(
  navigate: NavigateFunction,
  options?: OpenValvViaFyrenOptions,
): Promise<boolean> {
  const { isAuthenticated } = useStore.getState();
  if (!isAuthenticated) {
    options?.onDenied?.(
      isEmailAuthRequired()
        ? 'Logga in med Google eller e-post innan du öppnar Valvet.'
        : 'Logga in via Konto innan du öppnar Valvet.',
    );
    return false;
  }

  // ── GREN 1: WebAuthn (webb/desktop, primärt flöde — oförändrat) ────────────
  const webAuthnOk = await isWebAuthnReliable();
  if (webAuthnOk) {
    const webAuthn = await performVaultWebAuthnForSession();
    if (webAuthn.ok === false) {
      options?.onDenied?.('WebAuthn verifiering misslyckades.');
      return false;
    }

    setVaultGate();
    useStore.getState().setVaultUnlocked(true);

    const issued = await issueVaultServerSession(webAuthn.response);
    if (issued.ok === false) {
      clearVaultGate();
      useStore.getState().setVaultUnlocked(false);
      options?.onDenied?.(issued.message);
      return false;
    }

    navigate({
      pathname: options?.pathname ?? NAV_PATHS.VALVET,
      search: options?.search ?? '',
    });
    return true;
  }

  // ── GREN 2: Native Biometric (Capacitor Android / iOS — fallback) ──────────
  if (isCapacitorNative()) {
    const bio = await performNativeBiometric();
    if (bio.ok === false) {
      options?.onDenied?.('Biometrisk verifiering misslyckades.');
      return false;
    }

    setVaultGate();
    useStore.getState().setVaultUnlocked(true);

    const issued = await issueVaultSessionViaBiometric(bio.platform);
    if (issued.ok === false) {
      clearVaultGate();
      useStore.getState().setVaultUnlocked(false);
      options?.onDenied?.(issued.message);
      return false;
    }

    navigate({
      pathname: options?.pathname ?? NAV_PATHS.VALVET,
      search: options?.search ?? '',
    });
    return true;
  }

  // ── GREN 3: Ingen autentisering tillgänglig ─────────────────────────────────
  options?.onDenied?.(
    'Biometri stöds inte i denna miljö. Öppna appen på din mobil eller använd Chrome på datorn.',
  );
  return false;
}
