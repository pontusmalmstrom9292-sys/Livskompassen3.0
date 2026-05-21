export { AuthProvider, auth } from './AuthProvider';
export { AuthGate } from './AuthGate';
export { EmailAuthPanel } from './EmailAuthPanel';
export { AccountSecureBanner } from './AccountSecureBanner';
export { linkOrCreateEmailAccount, signInWithEmail, signOutUser, mapAuthError } from './authService';
export { useZeroFootprint } from './useZeroFootprint';
export {
  invalidateServerSession,
  setVaultGate,
  clearVaultGate,
  hasVaultGate,
} from './sessionService';
