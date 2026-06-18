import { useStore } from '../store';

const SANDBOX_USER = {
  uid: 'design-sandbox-user',
  email: 'sandbox@livskompassen.local',
  isAnonymous: false,
} as const;

export function isDesignSandbox(): boolean {
  return import.meta.env.VITE_DESIGN_SANDBOX === 'true';
}

/** Mock auth + vault för design-playground utan Firebase-inloggning. */
export function initDesignSandbox(): void {
  const { setUser, setLoading, setVaultUnlocked } = useStore.getState();
  setUser({ ...SANDBOX_USER });
  setLoading(false);
  setVaultUnlocked(true);
}

export function toggleSandboxVaultUnlocked(): void {
  const { ui, setVaultUnlocked } = useStore.getState();
  setVaultUnlocked(!ui.isVaultUnlocked);
}
