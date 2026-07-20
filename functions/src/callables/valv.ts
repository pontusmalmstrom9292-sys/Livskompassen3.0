import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';

import { askValvChat } from '../agents/valvChatAgent';
import { generateDossierInternal } from '../lib/generateDossierInternal';
import { rescanAllVaultPatternMetadata, writePatternScanMetadata, assistAllVaultFlowPatternMetadata, assistFlowPatternMetadataForSource, TACTIC_LIBRARY_VERSION } from '../lib/patternScanMetadata';
import { addUserEntityProfile, loadEntityProfileBundle } from '../lib/entityProfileStore';
import {
  assertVaultSession,
  issueVaultSession as createVaultSession,
} from '../lib/vaultSessionGate';
import {
  beginVaultBiometricChallenge,
  consumeVaultBiometricChallenge,
} from '../lib/vaultBiometricChallenge';
import {
  assertVaultWebAuthnContext,
  beginVaultWebAuthnChallenge,
  verifyVaultWebAuthnResponse,
} from '../lib/vaultWebAuthn';
import { assertAppCheckV2, guardSensitiveCallableV2 } from '../lib/callableGuards';
import { assertRateLimit } from '../lib/rateLimit';
import { geminiApiKey } from '../lib/geminiSecret';
import { createSiloGuard, Silo } from '../lib/siloEnforcer';
import type { EntityRole } from '../lib/entityProfileTypes';
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/server';

const ASSIST_PATTERN_METADATA_WINDOW_MS = 60 * 60 * 1000;
const valvChatGuard = createSiloGuard('valvChatQuery', Silo.VALV);

/** P3 Flow-assist — auth + 2 anrop/timme per UID (PMIR-A). */
async function guardAssistPatternMetadata(request: CallableRequest): Promise<string> {
  assertAppCheckV2(request);
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs.');
  }
  if (process.env.REQUIRE_EMAIL_AUTH === 'true' && !request.auth.token.email_verified) {
    throw new HttpsError('permission-denied', 'Verifierad e-post krävs för denna miljö.');
  }
  const uid = request.auth.uid;
  await assertRateLimit(uid, 'assistPatternMetadata', 2, ASSIST_PATTERN_METADATA_WINDOW_MS);
  return uid;
}

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
 * Steg 1 — server-utmaning före native biometri (Capacitor Android/iOS).
 * Klient: begin → OS-biometri → issueVaultSessionViaBiometric med challengeProof.
 */
export const beginVaultBiometricChallengeCallable = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(
      request,
      'beginVaultBiometricChallenge',
      10,
    );
    return beginVaultBiometricChallenge(uid);
  },
);

/**
 * Nativ-biometri-kanal (Capacitor Android / iOS).
 *
 * Autentiseringsgaranti (v1):
 *  1. Firebase ID-token — verifieras av Cloud Functions runtime.
 *  2. Kortlivad server-utmaning — måste begäras före issue och konsumeras en gång inom 90 s.
 *  3. OS-biometri — klienten kör performNativeBiometric() mellan begin och issue.
 *  4. App Check (prod) — APP_CHECK_ENFORCE + Play Integrity / DeviceCheck rekommenderas (PMIR fas 2).
 *
 * Rate-limiting: 10 anrop/minut per UID.
 */
export const issueVaultSessionViaBiometric = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(
      request,
      'issueVaultSessionViaBiometric',
      10,
    );

    const platform = (request.data as { platform?: unknown })?.platform;
    if (platform !== 'android' && platform !== 'ios') {
      throw new HttpsError(
        'invalid-argument',
        'Ogiltig plattform. Endast android och ios är tillåtna.',
      );
    }

    const payload = request.data as {
      challengeId?: unknown;
      challengeProof?: unknown;
    };

    await consumeVaultBiometricChallenge(uid, {
      challengeId: payload.challengeId,
      challengeProof: payload.challengeProof,
      platform,
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

export const valvChatQuery = onCall(
  { region: 'europe-west1', memory: '512MiB', secrets: [geminiApiKey] },
  async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'valvChatQuery', 30);
  await assertVaultSession(uid, request.data);

  const question = request.data?.question;
  if (!question || typeof question !== 'string') {
    throw new HttpsError('invalid-argument', 'Fältet "question" (string) krävs.');
  }

  if (question.length > 2000) {
    throw new HttpsError('invalid-argument', 'Frågan får vara max 2000 tecken.');
  }

  try {
    valvChatGuard.assertCollections(['reality_vault', 'entity_profiles']);
    const result = await askValvChat(uid, question.trim(), geminiApiKey.value());
    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Valv-Chat kunde inte svara.';
    console.error('[valvChatQuery]', error);
    throw new HttpsError('internal', message);
  }
  },
);

export const rescanPatternMetadata = onCall({ region: 'europe-west1' }, async (request) => {
  const uid = await guardSensitiveCallableV2(request, 'rescanPatternMetadata', 3);
  await assertVaultSession(uid, request.data);
  const written = await rescanAllVaultPatternMetadata(uid);
  return { written, libraryVersion: TACTIC_LIBRARY_VERSION };
});

/** P3 Flow-assist — kompletterande metadata (FLOW-lager), DCAP före LLM, ingen WORM-mutation. */
export const assistPatternMetadata = onCall(
  { region: 'europe-west1', secrets: [geminiApiKey] },
  async (request) => {
    const uid = await guardAssistPatternMetadata(request);
    await assertVaultSession(uid, request.data);
    const sourceRef = String((request.data as { sourceRef?: unknown })?.sourceRef ?? '').trim();

    try {
      if (sourceRef) {
        const docId = await assistFlowPatternMetadataForSource(
          uid,
          sourceRef,
          geminiApiKey.value(),
        );
        return { written: docId ? 1 : 0, libraryVersion: TACTIC_LIBRARY_VERSION, docId };
      }
      const written = await assistAllVaultFlowPatternMetadata(uid, geminiApiKey.value(), 25);
      return { written, libraryVersion: TACTIC_LIBRARY_VERSION };
    } catch (error) {
      console.error('[assistPatternMetadata] Fel:', error);
      throw new HttpsError('internal', 'Flow-assist misslyckades.');
    }
  },
);

export const writePatternScanMetadataCallable = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'writePatternScanMetadata', 30);
    await assertVaultSession(uid, request.data);
    const sourceRef = String((request.data as { sourceRef?: unknown })?.sourceRef ?? '').trim();
    if (!sourceRef) {
      throw new HttpsError('invalid-argument', 'sourceRef krävs.');
    }
    const docId = await writePatternScanMetadata({
      userId: uid,
      sourceRef,
      text: '',
      scanLayer: 'REGEX',
    });
    return { docId, created: Boolean(docId) };
  },
);

export const generateDossier = onCall(
  { region: 'europe-west1', secrets: [geminiApiKey] },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'generateDossier', 5);
    await assertVaultSession(uid, request.data);

    try {
      return await generateDossierInternal(uid, request.data, geminiApiKey.value());
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
