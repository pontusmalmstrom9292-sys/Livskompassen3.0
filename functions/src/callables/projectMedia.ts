import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { admin } from '../lib/firebaseAdmin';
import { createGenAI } from '../lib/genaiClient';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { OCR_PROMPT } from '../sharedRules';

export const analyzeProjectImage = onCall(
  { region: 'europe-west1' },
  async (request) => {
    const uid = await guardSensitiveCallableV2(request, 'analyzeProjectImage', 10);
    const { projectId, blockId } = request.data as { projectId?: string; blockId?: string };

    if (!projectId || !blockId) {
      throw new HttpsError('invalid-argument', 'projectId och blockId krävs.');
    }

    const db = admin.firestore();
    const projSnap = await db.collection('projects').doc(projectId).get();
    if (!projSnap.exists || projSnap.data()?.ownerId !== uid) {
      throw new HttpsError('permission-denied', 'Endast ägaren kan köra OCR på detta projekt.');
    }

    const blockRef = db.collection('project_blocks').doc(blockId);
    const blockSnap = await blockRef.get();
    if (!blockSnap.exists) {
      throw new HttpsError('not-found', 'Blocket hittades inte.');
    }

    const blockData = blockSnap.data();
    if (blockData?.projectId !== projectId) {
      throw new HttpsError('invalid-argument', 'Blocket tillhör inte angivet projekt.');
    }

    const storagePath = blockData?.storagePath;
    if (!storagePath) {
      throw new HttpsError('failed-precondition', 'Blocket saknar bildfil (storagePath).');
    }

    const bucket = admin.storage().bucket();
    const file = bucket.file(storagePath);
    const [exists] = await file.exists();
    if (!exists) {
      throw new HttpsError('not-found', 'Bildfilen hittades inte i Storage.');
    }

    const [metadata] = await file.getMetadata();
    const mimeType = metadata.contentType || 'image/jpeg';
    if (!mimeType.startsWith('image/')) {
      throw new HttpsError('failed-precondition', 'Endast bilder stöds för OCR.');
    }

    if (Number(metadata.size) > 4 * 1024 * 1024) {
      throw new HttpsError('failed-precondition', 'Bilden är för stor för OCR (max 4MB).');
    }

    const [buffer] = await file.download();
    const ai = createGenAI();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            data: buffer.toString('base64'),
            mimeType,
          },
        },
        { text: OCR_PROMPT },
      ],
      config: { temperature: 0.1, maxOutputTokens: 2048 },
    });

    const text = (response.text ?? '').trim();
    if (!text || text.includes('Ingen text upptäckt')) {
      throw new HttpsError('internal', 'Ingen text kunde extraheras från bilden.');
    }

    const currentContent = blockData?.content ? blockData.content + '\n\n' : '';

    await blockRef.update({
      content: currentContent + text,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, text };
  }
);
