import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { Lock, Fingerprint } from 'lucide-react';
import { BentoCard } from '../ui/BentoCard';
import { PinGate } from '../ui/PinGate';
import {
  hasVaultZone,
  setVaultZone,
  clearVaultZone,
  type VaultZoneId,
} from '../auth/sessionService';
import { authenticateVaultGate } from '../auth/webauthn';
import { useVaultPinUnlock } from './useVaultPinUnlock';
import { useVaultZoneIdle } from './useVaultZoneIdle';

type Props = {
  zone: VaultZoneId;
  title?: string;
  description?: string;
  /** Optional WebAuthn before PIN (fingeravtryck / Face ID). */
  useWebAuthn?: boolean;
  /** Default true — false keeps session across child unmount (e.g. dagbok steg-byte). */
  clearOnUnmount?: boolean;
  onLock?: () => void;
  onUnlocked?: () => void;
  children: ReactNode;
};

export function VaultZoneGate({
  zone,
  title = 'Lås upp analys',
  description = 'Samma PIN som Valv. Sessionen gäller tills du lämnar vyn eller varit inaktiv 15 min.',
  useWebAuthn = true,
  clearOnUnmount = true,
  onLock,
  onUnlocked,
  children,
}: Props) {
  const [unlocked, setUnlocked] = useState(() => hasVaultZone(zone));
  const [webAuthnPending, setWebAuthnPending] = useState(false);
  const [webAuthnFailed, setWebAuthnFailed] = useState(false);

  const lock = useCallback(() => {
    clearVaultZone(zone);
    setUnlocked(false);
    onLock?.();
  }, [zone, onLock]);

  const pin = useVaultPinUnlock({
    onUnlocked: () => {
      setVaultZone(zone);
      setUnlocked(true);
      onUnlocked?.();
    },
  });

  useVaultZoneIdle(zone, unlocked, lock);

  useEffect(() => {
    if (!unlocked || !clearOnUnmount) return;
    return () => {
      clearVaultZone(zone);
    };
  }, [zone, unlocked, clearOnUnmount]);

  const tryUnlock = async () => {
    if (useWebAuthn && window.PublicKeyCredential) {
      setWebAuthnPending(true);
      setWebAuthnFailed(false);
      const ok = await authenticateVaultGate();
      setWebAuthnPending(false);
      if (ok) {
        setVaultZone(zone);
        setUnlocked(true);
        onUnlocked?.();
        return;
      }
      setWebAuthnFailed(true);
    }
    if (pin.submit()) {
      /* setVaultZone via onUnlocked */
    }
  };

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <BentoCard title={title} icon={<Lock className="h-4 w-4" />}>
      <PinGate
        description={description}
        pin={pin.pin}
        confirmPin={pin.confirmPin}
        setupMode={pin.isSetup}
        error={pin.error}
        onPinChange={pin.setPin}
        onConfirmPinChange={pin.setConfirmPin}
        onSubmit={() => void tryUnlock()}
        submitLabel={webAuthnPending ? 'Verifierar…' : pin.isSetup ? 'Skapa PIN' : 'Lås upp'}
        icon={useWebAuthn ? <Fingerprint className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
      />
      {webAuthnFailed && (
        <p className="mt-2 text-xs text-text-dim">
          Biometri avbruten — ange PIN manuellt och tryck Lås upp igen.
        </p>
      )}
    </BentoCard>
  );
}
