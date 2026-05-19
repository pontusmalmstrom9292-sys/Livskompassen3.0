import { GoogleGenAI } from '@google/genai';
import { google } from 'googleapis';
import { LIVSKOMPASSEN_SYSTEM_CONFIG } from '../sharedRules';
import { GCP_PROJECT_ID, GCP_REGION } from '../config';

const ai = new GoogleGenAI({
  project: GCP_PROJECT_ID,
  location: GCP_REGION,
});

export const analyzeDriveFile = async (fileId: string, fileName: string, mimeType: string): Promise<string> => {
  try {
    console.log(`[File Pipeline] Startar automatisk analys av: ${fileName} (${mimeType})`);

    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
    const drive = google.drive({ version: 'v3', auth });

    const fileResponse = await drive.files.get(
      { fileId: fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );
    
    const fileBuffer = Buffer.from(fileResponse.data as ArrayBuffer);
    const base64Data = fileBuffer.toString('base64');

    console.log(`[File Pipeline] Fil nedladdad. Skickar till Gemini Pro...`);

    const aiResponse = await ai.models.generateContent({
      model: 'gemini-1.5-pro',
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
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