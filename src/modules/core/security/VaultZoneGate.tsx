import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Fingerprint, Lock } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import {
  hasVaultGate,
  hasVaultZone,
  setVaultZone,
  clearVaultZone,
  type VaultZoneId,
} from '../auth/sessionService';
import { authenticateVaultGateUniversal } from '../auth/webauthn';
import {
  applyVaultJwtClaim,
} from './vaultWriteUnlock';
import {
  ensureVaultServerSessionFromGate,
} from '../auth/vaultServerSession';
import { useVaultZoneIdle } from './useVaultZoneIdle';
import { Button } from '@/design-system';

type Props = {
  zone: VaultZoneId;
  title?: string;
  description?: string;
  /** Default true — false keeps session across child unmount (e.g. dagbok steg-byte). */
  clearOnUnmount?: boolean;
  onLock?: () => void;
  onUnlocked?: () => void;
  children: ReactNode;
};

/** Zon-gate med WebAuthn — ingen PIN (samma princip som Valv via Fyren). */
export function VaultZoneGate({
  zone,
  title = 'Lås upp analys',
  description = 'Fingeravtryck eller Face ID. Håll Kompis-ögat i toppmenyn i 3 sek — samma session i 1 timme.',
  clearOnUnmount = true,
  onLock,
  onUnlocked,
  children,
}: Props) {
  const [unlocked, setUnlocked] = useState(() => hasVaultZone(zone));
  const [webAuthnPending, setWebAuthnPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unlock = useCallback(() => {
    setVaultZone(zone);
    setUnlocked(true);
    setError(null);
    onUnlocked?.();
  }, [zone, onUnlocked]);

  const lock = useCallback(() => {
    clearVaultZone(zone);
    setUnlocked(false);
    onLock?.();
  }, [zone, onLock]);

  useVaultZoneIdle(zone, unlocked, lock);

  useEffect(() => {
    if (unlocked || !hasVaultGate()) return;
    unlock();
  }, [unlocked, unlock]);

  useEffect(() => {
    if (!unlocked || !clearOnUnmount) return;
    return () => {
      clearVaultZone(zone);
    };
  }, [zone, unlocked, clearOnUnmount]);

  const tryUnlock = async () => {
    setError(null);
    setWebAuthnPending(true);
    const result = await authenticateVaultGateUniversal();
    
    if (!result.ok) {
      setError("Biometrisk verifiering avbröts eller misslyckades. Försök igen.");
      setWebAuthnPending(false);
      return;
    }

    try {
      const session = await ensureVaultServerSessionFromGate();
      if (session.ok === false) {
        setError(session.message);
        setWebAuthnPending(false);
        return;
      }

      const claim = await applyVaultJwtClaim();
      if (claim.ok === false) {
        setError(claim.message);
        setWebAuthnPending(false);
        return;
      }

      unlock();
    } catch (err) {
      console.error("Backend-verifiering misslyckades:", err);
      setError("Kunde inte verifiera upplåsningen via servern. Försök igen.");
    } finally {
      setWebAuthnPending(false);
    }
  };

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <BentoCard title={title} icon={<Lock className="h-4 w-4" />}>
      <p className="mb-3 text-sm text-text-muted">{description}</p>
      <Button type="button" disabled={webAuthnPending} onClick={() => void tryUnlock()} variant="accent" className="--accent flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 disabled:opacity-60">
        <Fingerprint className="h-4 w-4" strokeWidth={2} />
        {webAuthnPending ? 'Verifierar…' : 'Lås upp med biometri'}
      </Button>
      {error ? <p className="mt-2 text-xs text-amber-400/90">{error}</p> : null}
    </BentoCard>
  );
}
