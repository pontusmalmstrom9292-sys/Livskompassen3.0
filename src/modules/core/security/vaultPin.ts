export const VAULT_PIN_STORAGE_KEY = 'livskompassen_vault_pin_hash';

export function hashPin(pin: string): string {
  let h = 0;
  for (let i = 0; i < pin.length; i++) h = (Math.imul(31, h) + pin.charCodeAt(i)) | 0;
  return String(h);
}

export function verifyPin(pin: string): boolean {
  const envPin = import.meta.env.VITE_VAULT_PIN as string | undefined;
  if (envPin && pin === envPin) return true;
  const stored = localStorage.getItem(VAULT_PIN_STORAGE_KEY);
  if (!stored) return false;
  return stored === hashPin(pin);
}

export function setupPin(pin: string): void {
  localStorage.setItem(VAULT_PIN_STORAGE_KEY, hashPin(pin));
}

export function hasPinConfigured(): boolean {
  return Boolean(localStorage.getItem(VAULT_PIN_STORAGE_KEY) || import.meta.env.VITE_VAULT_PIN);
}
