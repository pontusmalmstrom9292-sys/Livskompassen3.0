"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeDriveFile = void 0;
const genai_1 = require("@google/genai");
const googleapis_1 = require("googleapis");
const sharedRules_1 = require("../sharedRules");
const ai = new genai_1.GoogleGenAI({
    project: 'gen-lang-client-0481875058',
    location: 'us-central1'
});
const analyzeDriveFile = async (fileId, fileName, mimeType) => {
    try {
        console.log(`[File Pipeline] Startar automatisk analys av: ${fileName} (${mimeType})`);
        const auth = new googleapis_1.google.auth.GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
        });
        const drive = googleapis_1.google.drive({ version: 'v3', auth });
        const fileResponse = await drive.files.get({ fileId: fileId, alt: 'media' }, { responseType: 'arraybuffer' });
        const fileBuffer = Buffer.from(fileResponse.data);
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
                systemInstruction: sharedRules_1.LIVSKOMPASSEN_SYSTEM_CONFIG.aiPersona.systemInstruction,
                temperature: 0.1,
            }
        });
        return aiResponse.text || "{}";
    }
    catch (error) {
        console.error(`[File Pipeline] Fel vid analys av filen ${fileId}:`, error);
        throw error;
    }
};
exports.analyzeDriveFile = analyzeDriveFile;
//# sourceMappingURL=documentAgent.js.map