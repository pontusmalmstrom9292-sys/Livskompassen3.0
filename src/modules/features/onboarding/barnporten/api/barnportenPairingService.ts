import { httpsCallable } from 'firebase/functions';
import { functions } from '@/core/firebase/init';

export type CreatePairingResult = {
  token: string;
  childAlias: string;
  expiresAt: string;
  pairUrl: string;
};

export type ClaimPairingResult = {
  childAlias: string;
  deviceId: string;
  deviceDocId: string;
};

const createPairingCallable = httpsCallable<
  { childAlias: string; origin: string },
  CreatePairingResult
>(functions, 'createBarnportenPairing');

const claimPairingCallable = httpsCallable<
  { token: string; deviceId: string; deviceLabel?: string },
  ClaimPairingResult
>(functions, 'claimBarnportenPairing');

export async function createBarnportenPairing(childAlias: string): Promise<CreatePairingResult> {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const res = await createPairingCallable({ childAlias, origin });
  return res.data;
}

export async function claimBarnportenPairing(
  token: string,
  deviceId: string,
  deviceLabel?: string,
): Promise<ClaimPairingResult> {
  const res = await claimPairingCallable({ token, deviceId, deviceLabel });
  return res.data;
}
