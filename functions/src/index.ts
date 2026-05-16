import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { KompisSupervisor } from './agents/kompis-supervisor';

admin.initializeApp();

const supervisor = new KompisSupervisor();

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 1: generateEmbedding
// Genererar en textembedding (textembedding-gecko) för ett Kampspår-dokument.
// Anropas av frontend för att indexera ny data i Vector Search.
// ─────────────────────────────────────────────────────────────────────────────
export const generateEmbedding = functions.region('europe-west1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Endast inloggade användare får generera inbäddningar för Kampspår.'
    );
  }

  const text: string = data.text;
  if (!text || typeof text !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'En textsträng krävs.');
  }

  try {
    const projectId = process.env.GCP_PROJECT_ID ?? 'livskompassen-v2';
    const location = 'europe-west1';

    // Använd Vertex AI SDK (textembedding-gecko via REST för enklare typer)
    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/textembedding-gecko:predict`;
    const { GoogleAuth } = await import('google-auth-library');
    const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
    const client = await auth.getClient();
    const token = await client.getAccessToken();

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ instances: [{ content: text }] }),
    });

    const json = await resp.json() as { predictions?: { embeddings?: { values?: number[] } }[] };
    const embedding = json.predictions?.[0]?.embeddings?.values ?? [];

    console.log(`[generateEmbedding] OK för uid=${context.auth.uid}, dims=${embedding.length}`);
    return { embedding };
  } catch (error) {
    console.error('[generateEmbedding] Fel:', error);
    throw new functions.https.HttpsError('internal', 'Kunde inte generera inbäddning via Vertex AI.');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 2: analyzeMessage
// Kör DCAP + Kompis Supervisor på ett givet meddelande.
// Frontend anropar denna för att analysera t.ex. ett mottaget SMS.
// Returnerar DCAP-resultat, riskScore och ett Grey Rock-svar om relevant.
// ─────────────────────────────────────────────────────────────────────────────
export const analyzeMessage = functions.region('europe-west1').https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  const message = data.message;
  const ragContext: string[] = data.ragContext ?? []; // RAG-data hämtas av frontend via Vector Search

  if (!message || typeof message !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Fältet "message" (string) krävs.');
  }

  if (message.length > 5000) {
    throw new functions.https.HttpsError('invalid-argument', 'Meddelandet får vara max 5000 tecken.');
  }

  try {
    const result = await supervisor.handleUserRequest(message, context.auth.uid, ragContext);
    console.log(`[analyzeMessage] DCAP riskScore=${result.dcap?.riskScore} för uid=${context.auth.uid}`);
    return result;
  } catch (error) {
    console.error('[analyzeMessage] Fel:', error);
    throw new functions.https.HttpsError('internal', 'Analys misslyckades. Försök igen.');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 3: invalidateSession
// Kill Switch — rensar Vertex AI Context Cache och sessionsdata vid utloggning.
// Uppfyller "Zero Footprint"-kravet i system_plan.md.
// ─────────────────────────────────────────────────────────────────────────────
export const invalidateSession = functions.region('europe-west1').https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Autentisering krävs.');
  }

  supervisor.invalidateUserSession(context.auth.uid);
  console.log(`[invalidateSession] Session rensad för uid=${context.auth.uid}`);
  return { success: true };
});

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 4: scheduledRetentionJob
// Schemalagd GDPR-rensning. Körs dagligen kl 03:00 (europe-west1).
// Motsvarar Cloud Scheduler YAML-konfigurationen i scripts/scheduler/.
// ─────────────────────────────────────────────────────────────────────────────
export const scheduledRetentionJob = functions
  .region('europe-west1')
  .pubsub.schedule('0 3 * * *') // Cron: varje natt kl 03:00
  .timeZone('Europe/Stockholm')
  .onRun(async (_context) => {
    console.log('[scheduledRetentionJob] Startar GDPR-rensning...');
    // Importera och kör retention-jobbet inline
    const { default: runRetention } = await import('./jobs/retentionJob');
    if (typeof runRetention === 'function') {
      await runRetention();
    }
    console.log('[scheduledRetentionJob] Klar.');
  });

// ─────────────────────────────────────────────────────────────────────────────
// Funktion 5: notifyNewFile
// Anropas av Google Apps Script när en fil flyttats till Kunskapsvalvet.
// Registrerar filen i Firestore för framtida RAG-bearbetning.
// ─────────────────────────────────────────────────────────────────────────────
export const notifyNewFile = functions.region('europe-west1').https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { fileId, fileName, mimeType } = req.body;

  if (!fileId || !fileName) {
    res.status(400).send('Missing fileId or fileName');
    return;
  }

  try {
    const db = admin.firestore();
    await db.collection('vault').add({
      fileId,
      fileName,
      mimeType,
      status: 'pending_index',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      ownerId: 'SYSTEM_AUTONOMOUS', // Eller specifik uid om tillgänglig via token
    });

    console.log(`[notifyNewFile] Fil registrerad: ${fileName}`);
    res.status(200).json({ success: true, message: 'File registered in Knowledge Vault' });
  } catch (error) {
    console.error('[notifyNewFile] Fel:', error);
    res.status(500).send('Internal Server Error');
  }
});

