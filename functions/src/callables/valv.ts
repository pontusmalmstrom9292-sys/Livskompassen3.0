import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as functions from 'firebase-functions';
import { askValvChat } from '../agents/valvChatAgent';
import { generateDossierInternal } from '../lib/generateDossierInternal';
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
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs för Valv-WebAuthn.');
  }
  const { origin, rpID } = assertVaultWebAuthnContext(request.data);
  return beginVaultWebAuthnChallenge(request.auth.uid, origin, rpID);
});

export const issueVaultSession = onCall({ region: 'europe-west1' }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs för Valv-session.');
  }
  const { origin, rpID } = assertVaultWebAuthnContext(request.data);
  const webAuthnResponse = readWebAuthnResponse(request.data);
  await verifyVaultWebAuthnResponse(request.auth.uid, webAuthnResponse, origin, rpID);
  return createVaultSession(request.auth.uid);
});

export const getEntityProfileRegistry = onCall({ region: 'europe-west1' }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs för aktörskartan.');
  }
  await assertVaultSession(request.auth.uid, request.data);

  const bundle = await loadEntityProfileBundle(request.auth.uid);
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
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs för att lägga till person.');
  }
  await assertVaultSession(request.auth.uid, request.data);

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
    return await addUserEntityProfile(request.auth.uid, {
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
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs för Valv-Chat.');
  }
  await assertVaultSession(request.auth.uid, request.data);

  const question = request.data?.question;
  if (!question || typeof question !== 'string') {
    throw new HttpsError('invalid-argument', 'Fältet "question" (string) krävs.');
  }

  if (question.length > 2000) {
    throw new HttpsError('invalid-argument', 'Frågan får vara max 2000 tecken.');
  }

  const result = await askValvChat(request.auth.uid, question.trim());
  return result;
});

export const generateDossier = functions.region('europe-west1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }
  await assertVaultSession(context.auth.uid, data);

  try {
    return await generateDossierInternal(context.auth.uid, data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Generering misslyckades.';
    if (
      message.includes('Ogiltigt') ||
      message.includes('Minst ett') ||
      message.includes('Max ') ||
      message.includes('dateFrom') ||
      message.includes('saknas eller')
    ) {
      throw new functions.https.HttpsError('invalid-argument', message);
    }
    console.error('[generateDossier] Fel:', error);
    throw new functions.https.HttpsError('internal', message);
  }
});
