import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { geminiApiKey } from '../lib/geminiSecret';
import { classifyInboxDocument, buildInboxClassifyBlob } from '../lib/inboxClassifier';
import {
  confirmInboxQueueItem,
  dismissInboxQueueItem,
  listPendingInboxQueue,
} from '../lib/inboxPersist';
import { submitInkastLiteForUser } from '../lib/submitInkastLite';
import { assertVaultSession } from '../lib/vaultSessionGate';
import {
  normalizeInkastSourceModule,
  stripInjectedSourceModuleFromText,
} from '../lib/inkastSourceModule';

export const getInboxQueue = onCall({ region: 'europe-west1' }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs för inkorgen.');
  }

  const items = await listPendingInboxQueue(request.auth.uid);
  return { items };
});

export const confirmInboxItem = onCall({ region: 'europe-west1' }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  const queueId = request.data?.queueId;
  const routing = request.data?.routing;
  if (!queueId || typeof queueId !== 'string') {
    throw new HttpsError('invalid-argument', 'queueId krävs.');
  }
  if (
    routing !== 'kunskap' &&
    routing !== 'bevis' &&
    routing !== 'barnen' &&
    routing !== 'dagbok'
  ) {
    throw new HttpsError(
      'invalid-argument',
      'routing måste vara kunskap, bevis, barnen eller dagbok.'
    );
  }

  const childAlias =
    typeof request.data?.childAlias === 'string' && request.data.childAlias.trim()
      ? request.data.childAlias.trim()
      : undefined;

  const overrideTags = Array.isArray(request.data?.overrideTags)
    ? request.data.overrideTags.filter((v: unknown) => typeof v === 'string')
    : undefined;

  const overrideCategory = typeof request.data?.overrideCategory === 'string' && request.data.overrideCategory.trim()
    ? request.data.overrideCategory.trim()
    : undefined;

  if (routing === 'bevis') {
    await assertVaultSession(request.auth.uid, request.data);
  }

  try {
    return await confirmInboxQueueItem({
      uid: request.auth.uid,
      queueId,
      routing,
      childAlias,
      overrideTags,
      overrideCategory,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Bekräftelse misslyckades.';
    throw new HttpsError('failed-precondition', message);
  }
});

export const dismissInboxItem = onCall({ region: 'europe-west1' }, async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  const queueId = request.data?.queueId;
  if (!queueId || typeof queueId !== 'string') {
    throw new HttpsError('invalid-argument', 'queueId krävs.');
  }

  try {
    await dismissInboxQueueItem(request.auth.uid, queueId);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Avvisning misslyckades.';
    throw new HttpsError('failed-precondition', message);
  }
});

export const previewInboxClassification = onCall(
  { region: 'europe-west1', secrets: [geminiApiKey] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Autentisering krävs.');
    }

    const text = request.data?.text;
    const fileName =
      typeof request.data?.fileName === 'string' && request.data.fileName.trim()
        ? request.data.fileName.trim()
        : 'dokument.txt';

    if (!text || typeof text !== 'string') {
      throw new HttpsError('invalid-argument', 'text (string) krävs.');
    }
    if (text.length > 12000) {
      throw new HttpsError('invalid-argument', 'text max 12000 tecken.');
    }

    const cleanText = stripInjectedSourceModuleFromText(text);
    const sourceModule = normalizeInkastSourceModule(
      typeof request.data?.sourceModule === 'string' ? request.data.sourceModule : undefined
    );

    const classifyBlob = buildInboxClassifyBlob(cleanText, sourceModule);

    const classification = await classifyInboxDocument(
      classifyBlob,
      fileName,
      geminiApiKey.value()
    );
    return { classification };
  }
);

export const submitInkastLite = onCall(
  { region: 'europe-west1', secrets: [geminiApiKey], memory: '1GiB', timeoutSeconds: 300 },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Autentisering krävs.');
    }

    const text = typeof request.data?.text === 'string' ? request.data.text : undefined;
    const base64 = typeof request.data?.base64 === 'string' ? request.data.base64 : undefined;
    const base64Files = Array.isArray(request.data?.base64Files)
      ? request.data.base64Files.filter((v: unknown) => typeof v === 'string')
      : undefined;
    const mimeTypes = Array.isArray(request.data?.mimeTypes)
      ? request.data.mimeTypes.filter((v: unknown) => typeof v === 'string')
      : undefined;
    const fileNames = Array.isArray(request.data?.fileNames)
      ? request.data.fileNames.filter((v: unknown) => typeof v === 'string')
      : undefined;
    const fileName =
      typeof request.data?.fileName === 'string' ? request.data.fileName : undefined;
    const mimeType =
      typeof request.data?.mimeType === 'string' ? request.data.mimeType : undefined;
    const optInTrauma = request.data?.optInTrauma === true;
    const sourceModule =
      typeof request.data?.sourceModule === 'string' ? request.data.sourceModule : undefined;
    const manualRouting = request.data?.manualRouting;
    const manualCategory =
      typeof request.data?.manualCategory === 'string' ? request.data.manualCategory : undefined;
    const manualTags = Array.isArray(request.data?.manualTags)
      ? request.data.manualTags.filter((v: unknown) => typeof v === 'string')
      : undefined;
    const manualComment =
      typeof request.data?.manualComment === 'string' ? request.data.manualComment : undefined;
    const manualChildAlias =
      typeof request.data?.manualChildAlias === 'string' ? request.data.manualChildAlias : undefined;


    const normalizedSourceModule = normalizeInkastSourceModule(sourceModule);
    const sanitizedText =
      typeof text === 'string' ? stripInjectedSourceModuleFromText(text) : text;
    const effectiveManualRouting =
      manualRouting === 'kunskap' ||
      manualRouting === 'bevis' ||
      manualRouting === 'barnen' ||
      manualRouting === 'dagbok'
        ? manualRouting
        : undefined;

    const bevisVaultIntent =
      effectiveManualRouting === 'bevis' ||
      normalizedSourceModule === 'valv_samla' ||
      normalizedSourceModule === 'hamn_biff' ||
      normalizedSourceModule === 'hamn';
    if (bevisVaultIntent) {
      await assertVaultSession(request.auth.uid, request.data);
    }

    try {
      return await submitInkastLiteForUser(
        request.auth.uid,
        {
          text: sanitizedText,
          base64,
          base64Files,
          mimeTypes,
          fileNames,
          fileName,
          mimeType,
          optInTrauma,
          sourceModule: normalizedSourceModule,
          manualRouting: effectiveManualRouting,
          manualCategory,
          manualTags,
          manualComment,
          manualChildAlias,
        },
        geminiApiKey.value()
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Inkast misslyckades.';
      throw new HttpsError('invalid-argument', message);
    }
  }
);
