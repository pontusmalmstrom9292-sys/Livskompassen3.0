import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Fingerprint, Lock } from 'lucide-react';
import { BentoCard } from '../ui/BentoCard';
import {
  hasVaultGate,
  hasVaultZone,
  setVaultZone,
  clearVaultZone,
  type VaultZoneId,
} from '../auth/sessionService';
import { authenticateVaultGate } from '../auth/webauthn';
import { useVaultZoneIdle } from './useVaultZoneIdle';

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
  description = 'Fingeravtryck eller Face ID. Sessionen gäller tills du lämnar vyn eller varit inaktiv 15 min.',
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
    if (!window.PublicKeyCredential) {
      if (hasVaultGate()) {
        unlock();
        return;
      }
      setError('Biometri krävs. Öppna Valv via Fyren (håll Hjärtat 3 sek) och försök igen.');
      return;
    }
    setWebAuthnPending(true);
    const ok = await authenticateVaultGate();
    setWebAuthnPending(false);
    if (ok) {
      unlock();
    } else {
      setError('Biometri avbruten. Försök igen.');
    }
  };

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <BentoCard title={title} icon={<Lock className="h-4 w-4" />}>
      <p className="mb-3 text-sm text-text-muted">{description}</p>
      <button
        type="button"
        disabled={webAuthnPending}
        onClick={() => void tryUnlock()}
        className="btn-pill--accent flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 disabled:opacity-60"
      >
        <Fingerprint className="h-4 w-4" strokeWidth={2} />
        {webAuthnPending ? 'Verifierar…' : 'Lås upp med biometri'}
      </button>
      {error ? <p className="mt-2 text-xs text-amber-400/90">{error}</p> : null}
    </BentoCard>
  );
}
