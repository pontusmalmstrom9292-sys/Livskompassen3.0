import { google, drive_v3 } from 'googleapis';
import { LIVSKOMPASSEN_SYSTEM_CONFIG } from '../sharedRules';
import { createGenAI } from '../lib/genaiClient';

const ai = createGenAI();

/** Same model family as knowledgeVaultAgent (verified in prod smoke). */
const DRIVE_ANALYSIS_MODEL = 'gemini-2.5-flash';

/** Google Workspace-native files cannot use files.get?alt=media — export instead. */
const GOOGLE_APP_EXPORT_MIME: Record<string, string> = {
  'application/vnd.google-apps.document': 'text/plain',
  'application/vnd.google-apps.spreadsheet': 'text/csv',
  'application/vnd.google-apps.presentation': 'application/pdf',
};

async function downloadDriveFileBuffer(
  drive: drive_v3.Drive,
  fileId: string,
  mimeType: string
): Promise<{ buffer: Buffer; geminiMimeType: string }> {
  const exportMime = GOOGLE_APP_EXPORT_MIME[mimeType];
  if (exportMime) {
    const exported = await drive.files.export(
      { fileId, mimeType: exportMime },
      { responseType: 'arraybuffer' }
    );
    return {
      buffer: Buffer.from(exported.data as ArrayBuffer),
      geminiMimeType: exportMime,
    };
  }

  const fileResponse = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'arraybuffer' }
  );
  return {
    buffer: Buffer.from(fileResponse.data as ArrayBuffer),
    geminiMimeType: mimeType,
  };
}

export const analyzeDriveFile = async (fileId: string, fileName: string, mimeType: string): Promise<string> => {
  try {
    console.log(`[File Pipeline] Startar automatisk analys av: ${fileName} (fileId=${fileId}, ${mimeType})`);

    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
    const drive = google.drive({ version: 'v3', auth });

    const { buffer: fileBuffer, geminiMimeType } = await downloadDriveFileBuffer(drive, fileId, mimeType);
    const base64Data = fileBuffer.toString('base64');

    console.log(`[File Pipeline] Fil nedladdad. Skickar till ${DRIVE_ANALYSIS_MODEL}...`);

    const aiResponse = await ai.models.generateContent({
      model: DRIVE_ANALYSIS_MODEL,
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: geminiMimeType,
          }
        },
        {
          text: "Analysera detta dokument noggrant utifrån dina tilldelade systeminstruktioner."
        }
      ],
      config: {
        systemInstruction: LIVSKOMPASSEN_SYSTEM_CONFIG.aiPersona.systemInstruction,
        temperature: 0.1,
      }
    });

    return aiResponse.text || "{}";
  } catch (error) {
    console.error(`[File Pipeline] Fel vid analys av filen ${fileId}:`, error);
    throw error;
  }
};