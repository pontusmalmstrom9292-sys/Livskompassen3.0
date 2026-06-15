import { onCall, HttpsError } from 'firebase-functions/v2/https';

import { askValvChat } from '../agents/valvChatAgent';
import { generateDossierInternal } from '../lib/generateDossierInternal';
import { rescanAllVaultPatternMetadata, writePatternScanMetadata } from '../lib/patternScanMetadata';
import { addUserEntityProfile, loadEntityProfileBundle } from '../lib/entityProfileStore';
import {
  assertVaultSession,
  issueVaultSession as createVaultSession,
} from '../lib/vaultSessionGate';
import {
  assertVaultWebAuthnContext,
  beginVaultWebAuthnChallenge,
  verifyVaultWebAuthnResponse,
} from '../lib/vaultWebAuthn';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import type { EntityRole } from '../lib/entityProfileTypes';
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/server';

function readWebAuthnResponse(data: unknown): RegistrationResponseJSON | AuthenticationResponseJSON {
  const response = (data as { webAuthnResponse?: unknown })?.webAuthnResponse;
  if (!response || typeof response !== 'object') {
    throw new HttpsError(
      'permission-denied',
      'WebAuthn krävs. Lås upp Valvet via Fyren och biometri.',
    );
  }
  return response as RegistrationResponseJSON | AuthenticationResponseJSON;
}

export const beginVaultWebAuthnChallengeCallable = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'beginVaultWebAuthnChallenge', 20);
  const { origin, rpID } = assertVaultWebAuthnContext(request.data);
  const forceRegistration = (request.data as { forceRegistration?: unknown })?.forceRegistration === true;
  return beginVaultWebAuthnChallenge(uid, origin, rpID, forceRegistration);
});

export const issueVaultSession = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'issueVaultSession', 10);
  const { origin, rpID } = assertVaultWebAuthnContext(request.data);
  const webAuthnResponse = readWebAuthnResponse(request.data);
  await verifyVaultWebAuthnResponse(uid, webAuthnResponse, origin, rpID);
  return createVaultSession(uid);
});

/**
 * Nativ-biometri-kanal (Capacitor Android / iOS).
 *
 * Autentiseringsgaranti:
 *  1. Firebase ID-token — verifieras automatiskt av Cloud Functions runtime.
 *     Klienten kan inte förfalska detta utan att ha ett giltigt Google-konto.
 *  2. Android TEE / iOS Secure Enclave — klienten utför biometriverifiering
 *     INNAN detta anrop görs (performNativeBiometric() i nativeBiometricAuth.ts).
 *     Vi litar på OS-garantin precis som mobilbanks-appar gör.
 *
 * Rate-limiting: 10 anrop/minut per UID (samma som WebAuthn-kanalen).
 * Zero Footprint: Identisk sessionslivstid (1h idle) via createVaultSession().
 * WORM: Oförändrat — Firestore-regler kräver assertVaultSession() per write.
 * Audit: Loggpost per utfärdad session (uid + platform + tidsstämpel).
 */
export const issueVaultSessionViaBiometric = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(
      request,
      'issueVaultSessionViaBiometric',
      10, // samma rate limit som WebAuthn-kanalen
    );

    const platform = (request.data as { platform?: unknown })?.platform;
    if (platform !== 'android' && platform !== 'ios') {
      throw new HttpsError(
        'invalid-argument',
        'Ogiltig plattform. Endast android och ios är tillåtna.',
      );
    }

    // Audit-spår: loggad server-side, aldrig i WORM reality_vault
    console.info('[VaultSession] Biometric path issued:', {
      uid,
      platform,
      ts: new Date().toISOString(),
    });

    return createVaultSession(uid);
  },
);


export const getEntityProfileRegistry = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'getEntityProfileRegistry', 30);
  await assertVaultSession(uid, request.data);

  const bundle = await loadEntityProfileBundle(uid);
  return {
    profiles: bundle.profiles.map((p) => ({
      entityKey: p.entityKey,
      role: p.role,
      displayName: p.displayName,
      aliases: p.aliases,
      category: p.category ?? null,
      isKeyEntity: p.isKeyEntity,
    })),
    synapses: bundle.synapses.map((s) => ({
      title: s.title,
      category: s.category,
      analysis: s.analysis,
      groundingPoints: s.groundingPoints,
      hallucinationRisk: s.hallucinationRisk,
      relatedEntityKeys: s.relatedEntityKeys ?? [],
    })),
  };
});

export const addEntityProfile = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'addEntityProfile', 20);
  await assertVaultSession(uid, request.data);

  const displayName =
    typeof request.data?.displayName === 'string' ? request.data.displayName : '';
  const role = request.data?.role as EntityRole | undefined;
  const aliases = Array.isArray(request.data?.aliases)
    ? request.data.aliases.filter((a: unknown) => typeof a === 'string')
    : undefined;
  const groundingNotes =
    typeof request.data?.groundingNotes === 'string' ? request.data.groundingNotes : undefined;

  if (!displayName.trim()) {
    throw new HttpsError('invalid-argument', 'displayName krävs.');
  }
  if (!role) {
    throw new HttpsError('invalid-argument', 'role krävs.');
  }

  try {
    return await addUserEntityProfile(uid, {
      displayName,
      role,
      aliases,
      groundingNotes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Kunde inte spara personen.';
    if (message.includes('finns redan') || message.includes('Ogiltig') || message.includes('måste')) {
      throw new HttpsError('invalid-argument', message);
    }
    console.error('[addEntityProfile]', error);
    throw new HttpsError('internal', 'Kunde inte spara personen.');
  }
});

export const valvChatQuery = onCall({ region: 'europe-west1', memory: '512MiB' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'valvChatQuery', 30);
  await assertVaultSession(uid, request.data);

  const question = request.data?.question;
  if (!question || typeof question !== 'string') {
    throw new HttpsError('invalid-argument', 'Fältet "question" (string) krävs.');
  }

  if (question.length > 2000) {
    throw new HttpsError('invalid-argument', 'Frågan får vara max 2000 tecken.');
  }

  const result = await askValvChat(uid, question.trim());
  return result;
});

export const rescanPatternMetadata = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'rescanPatternMetadata', 3);
  await assertVaultSession(uid, request.data);
  const written = await rescanAllVaultPatternMetadata(uid);
  return { written, libraryVersion: '2026.06.1' };
});

export const writePatternScanMetadataCallable = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'writePatternScanMetadata', 30);
    await assertVaultSession(uid, request.data);
    const sourceRef = String((request.data as { sourceRef?: unknown })?.sourceRef ?? '').trim();
    const text = String((request.data as { text?: unknown })?.text ?? '').trim();
    if (!sourceRef) {
      throw new HttpsError('invalid-argument', 'sourceRef krävs.');
    }
    const docId = await writePatternScanMetadata({
      userId: uid,
      sourceRef,
      text,
      scanLayer: 'REGEX',
    });
    return { docId, created: Boolean(docId) };
  },
);

export const generateDossier = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'generateDossier', 5);
    await assertVaultSession(uid, request.data);

    try {
      return await generateDossierInternal(uid, request.data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Generering misslyckades.';
      if (
        message.includes('Ogiltigt') ||
        message.includes('Minst ett') ||
        message.includes('Max ') ||
        message.includes('dateFrom') ||
        message.includes('saknas eller')
      ) {
        throw new HttpsError('invalid-argument', message);
      }
      console.error('[generateDossier] Fel:', error);
      throw new HttpsError('internal', message);
    }
  }
);
