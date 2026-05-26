export { AuthProvider, auth } from './AuthProvider';
export { AuthGate } from './AuthGate';
export { AppUnlockGate } from './AppUnlockGate';
export { EmailAuthPanel } from './EmailAuthPanel';
export { AccountAuthMenu } from './AccountAuthMenu';
export {
  linkOrCreateEmailAccount,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  mapAuthError,
} from './authService';
export { useZeroFootprint } from './useZeroFootprint';
export {
  invalidateServerSession,
  setVaultGate,
  clearVaultGate,
  hasVaultGate,
} from './sessionService';
