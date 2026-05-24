import { useCallback, useState } from 'react';
import { hasPinConfigured, setupPin, verifyPin } from './vaultPin';

type Options = {
  onUnlocked?: () => void;
  minLength?: number;
};

export function useVaultPinUnlock({ onUnlocked, minLength = 4 }: Options = {}) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSetup, setIsSetup] = useState(!hasPinConfigured());
  const [error, setError] = useState<string | null>(null);

  const resetPinFields = useCallback(() => {
    setPin('');
    setConfirmPin('');
  }, []);

  const submit = useCallback(() => {
    if (isSetup) {
      if (pin.length < minLength) {
        setError(`PIN måste vara minst ${minLength} tecken.`);
        return false;
      }
      if (pin !== confirmPin) {
        setError('PIN matchar inte.');
        return false;
      }
      setupPin(pin);
      setIsSetup(false);
      resetPinFields();
      setError(null);
      onUnlocked?.();
      return true;
    }
    if (verifyPin(pin)) {
      resetPinFields();
      setError(null);
      onUnlocked?.();
      return true;
    }
    setError('Fel PIN.');
    return false;
  }, [confirmPin, isSetup, minLength, onUnlocked, pin, resetPinFields]);

  return {
    pin,
    setPin,
    confirmPin,
    setConfirmPin,
    isSetup,
    error,
    setError,
    submit,
    resetPinFields,
  };
}
