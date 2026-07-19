import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
  WebAuthnCredential,
} from '@simplewebauthn/server';
import { HttpsError } from 'firebase-functions/v2/https';
import { admin } from './firebaseAdmin';

const CHALLENGE_TTL_MS = 5 * 60 * 1000;
const RP_NAME = 'Livskompassen';

const DEFAULT_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'https://gen-lang-client-0481875058.web.app',
  'https://gen-lang-client-0481875058.firebaseapp.com',
  'https://localhost',
];

const DEFAULT_RP_IDS = [
  'localhost',
  'gen-lang-client-0481875058.web.app',
  'gen-lang-client-0481875058.firebaseapp.com',
];

type StoredVaultCredential = {
  credentialID: string;
  credentialPublicKey: string;
  counter: number;
  transports?: string[];
};

type StoredChallenge = {
  challenge: string;
  flow: 'registration' | 'authentication';
  expiresAt: string;
};

function credentialRef(uid: string) {
  return admin.firestore().doc(`users/${uid}/private/vault_webauthn`);
}

function challengeRef(uid: string) {
  return admin.firestore().doc(`users/${uid}/private/vault_webauthn_challenge`);
}

function allowedOrigins(): string[] {
  const fromEnv = process.env.VAULT_WEBAUTHN_ORIGINS?.split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_ORIGINS;
}

function allowedRpIds(): string[] {
  const fromEnv = process.env.VAULT_WEBAUTHN_RP_IDS?.split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return fromEnv?.length ? fromEnv : DEFAULT_RP_IDS;
}

export function assertVaultWebAuthnContext(data: unknown): { origin: string; rpID: string } {
  const origin = typeof (data as { origin?: unknown })?.origin === 'string'
    ? (data as { origin: string }).origin.trim()
    : '';
  const rpID = typeof (data as { rpID?: unknown })?.rpID === 'string'
    ? (data as { rpID: string }).rpID.trim()
    : '';

  if (!origin || !rpID) {
    throw new HttpsError('invalid-argument', 'origin och rpID krävs för WebAuthn.');
  }

  if (!allowedOrigins().includes(origin)) {
    throw new HttpsError('permission-denied', 'Otillåten origin för Valv-WebAuthn.');
  }

  if (!allowedRpIds().includes(rpID)) {
    throw new HttpsError('permission-denied', 'Otillåten rpID för Valv-WebAuthn.');
  }

  return { origin, rpID };
}

function parseStoredCredential(data: FirebaseFirestore.DocumentData): StoredVaultCredential | null {
  if (
    typeof data?.credentialID !== 'string' ||
    typeof data?.credentialPublicKey !== 'string' ||
    typeof data?.counter !== 'number'
  ) {
    return null;
  }
  return {
    credentialID: data.credentialID,
    credentialPublicKey: data.credentialPublicKey,
    counter: data.counter,
    transports: Array.isArray(data.transports)
      ? data.transports.filter((item: unknown) => typeof item === 'string')
      : undefined,
  };
}

/** Stöd för flera enheter — legacy enkel credential migreras vid läsning. */
async function loadStoredCredentials(uid: string): Promise<StoredVaultCredential[]> {
  const snap = await credentialRef(uid).get();
  if (!snap.exists) return [];

  const data = snap.data();
  if (!data) return [];

  if (Array.isArray(data.credentials)) {
    return data.credentials
      .map((row: FirebaseFirestore.DocumentData) => parseStoredCredential(row))
      .filter((row): row is StoredVaultCredential => row !== null);
  }

  const legacy = parseStoredCredential(data);
  return legacy ? [legacy] : [];
}

async function storeChallenge(uid: string, challenge: string, flow: StoredChallenge['flow']): Promise<void> {
  await challengeRef(uid).set({
    challenge,
    flow,
    expiresAt: new Date(Date.now() + CHALLENGE_TTL_MS).toISOString(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

async function consumeChallenge(uid: string, flow: StoredChallenge['flow']): Promise<string> {
  const snap = await challengeRef(uid).get();
  if (!snap.exists) {
    throw new HttpsError('permission-denied', 'WebAuthn-utmaning saknas. Börja om via Fyren.');
  }

  const data = snap.data() as StoredChallenge;
  if (data.flow !== flow) {
    throw new HttpsError('permission-denied', 'WebAuthn-flödet matchar inte utmaningen.');
  }

  if (typeof data.expiresAt === 'string' && new Date(data.expiresAt).getTime() < Date.now()) {
    await challengeRef(uid).delete();
    throw new HttpsError('permission-denied', 'WebAuthn-utmaningen har gått ut. Försök igen.');
  }

  if (typeof data.challenge !== 'string' || !data.challenge) {
    throw new HttpsError('permission-denied', 'Ogiltig WebAuthn-utmaning.');
  }

  await challengeRef(uid).delete();
  return data.challenge;
}

export async function beginVaultWebAuthnChallenge(
  uid: string,
  origin: string,
  rpID: string,
  forceRegistration = false,
): Promise<{
  flow: 'registration' | 'authentication';
  options: PublicKeyCredentialCreationOptionsJSON | PublicKeyCredentialRequestOptionsJSON;
}> {
  const stored = await loadStoredCredentials(uid);

  if (forceRegistration || stored.length === 0) {
    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID,
      userName: uid,
      userDisplayName: 'Valv',
      attestationType: 'none',
      authenticatorSelection: {
        residentKey: 'required',
        userVerification: 'required',
      },
    });
    await storeChallenge(uid, options.challenge, 'registration');
    return { flow: 'registration', options };
  }

  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'required',
    allowCredentials: stored.map((credential) => ({
      id: credential.credentialID,
      transports: credential.transports as WebAuthnCredential['transports'],
    })),
  });
  await storeChallenge(uid, options.challenge, 'authentication');
  return { flow: 'authentication', options };
}

function toWebAuthnCredential(stored: StoredVaultCredential): WebAuthnCredential {
  return {
    id: stored.credentialID,
    publicKey: Buffer.from(stored.credentialPublicKey, 'base64'),
    counter: stored.counter,
    transports: stored.transports as WebAuthnCredential['transports'],
  };
}

function isRegistrationResponse(
  response: RegistrationResponseJSON | AuthenticationResponseJSON,
): response is RegistrationResponseJSON {
  return 'attestationObject' in response.response;
}

async function appendRegisteredCredential(
  uid: string,
  credential: WebAuthnCredential,
  credentialDeviceType: string,
  credentialBackedUp: boolean,
): Promise<void> {
  const existing = await loadStoredCredentials(uid);
  const next: StoredVaultCredential = {
    credentialID: credential.id,
    credentialPublicKey: Buffer.from(credential.publicKey).toString('base64'),
    counter: credential.counter,
    transports: credential.transports ?? [],
  };

  const withoutDuplicate = existing.filter((row) => row.credentialID !== next.credentialID);
  await credentialRef(uid).set({
    credentials: [...withoutDuplicate, next],
    credentialDeviceType,
    credentialBackedUp,
    registeredAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
}

async function updateCredentialCounter(
  uid: string,
  credentialId: string,
  newCounter: number,
): Promise<void> {
  const existing = await loadStoredCredentials(uid);
  const updated = existing.map((row) =>
    row.credentialID === credentialId ? { ...row, counter: newCounter } : row,
  );
  if (!updated.some((row) => row.credentialID === credentialId)) {
    throw new HttpsError('permission-denied', 'Okänd Valv-passkey för denna enhet.');
  }
  await credentialRef(uid).set(
    {
      credentials: updated,
      lastUsedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
}

export async function verifyVaultWebAuthnResponse(
  uid: string,
  webAuthnResponse: RegistrationResponseJSON | AuthenticationResponseJSON,
  _origin: string,
  _rpID: string,
): Promise<void> {
  if (isRegistrationResponse(webAuthnResponse)) {
    const expectedChallenge = await consumeChallenge(uid, 'registration');
    const verification = await verifyRegistrationResponse({
      response: webAuthnResponse,
      expectedChallenge,
      expectedOrigin: allowedOrigins(),
      expectedRPID: allowedRpIds(),
      requireUserVerification: true,
    });

    if (!verification.verified || !verification.registrationInfo) {
      throw new HttpsError('permission-denied', 'WebAuthn-registrering kunde inte verifieras.');
    }

    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo;
    await appendRegisteredCredential(uid, credential, credentialDeviceType, credentialBackedUp);
    return;
  }

  const stored = await loadStoredCredentials(uid);
  if (stored.length === 0) {
    throw new HttpsError('permission-denied', 'Ingen registrerad Valv-passkey. Börja om via Fyren.');
  }

  const matching = stored.find((row) => row.credentialID === webAuthnResponse.id);
  if (!matching) {
    throw new HttpsError(
      'permission-denied',
      'Passkey från annan enhet. Håll Fyren igen för att registrera fingeravtryck här.',
    );
  }

  const expectedChallenge = await consumeChallenge(uid, 'authentication');
  const verification = await verifyAuthenticationResponse({
    response: webAuthnResponse as AuthenticationResponseJSON,
    expectedChallenge,
    expectedOrigin: allowedOrigins(),
    expectedRPID: allowedRpIds(),
    credential: toWebAuthnCredential(matching),
    requireUserVerification: true,
  });

  if (!verification.verified || !verification.authenticationInfo) {
    throw new HttpsError('permission-denied', 'WebAuthn-autentisering kunde inte verifieras.');
  }

  await updateCredentialCounter(uid, matching.credentialID, verification.authenticationInfo.newCounter);
}
