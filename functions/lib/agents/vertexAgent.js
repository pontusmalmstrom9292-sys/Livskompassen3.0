"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.askKnowledgeVault = void 0;
const genai_1 = require("@google/genai");
const sharedRules_1 = require("../sharedRules");
// Initiera det nya, enhetliga Google Gen AI SDK:et
// Det läser automatiskt dina autentiseringsfiler (vertex-sa.json) från miljön
const ai = new genai_1.GoogleGenAI({
    project: 'gen-lang-client-0481875058',
    location: 'us-central1'
});
const askKnowledgeVault = async (prompt) => {
    try {
        console.log(`[Knowledge Vault v2.0] Behandlar förfrågan med uppdaterade systemlagar...`);
        // Anrop enligt den nya @google/genai-standarden
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-pro', // Det nya paketet använder universella modellnamn
            contents: prompt,
            config: {
                // Här tvingar vi in dina globala regler i molnhjärnan!
                systemInstruction: sharedRules_1.LIVSKOMPASSEN_SYSTEM_CONFIG.aiPersona.systemInstruction,
                temperature: 0.2, // Håller AI:n fokuserad och strukturerad
            }
        });
        return response.text || "Inget svar genererades.";
    }
    catch (error) {
        console.error("[Knowledge Vault] Fel vid anrop till det nya Google Gen AI SDK:", error);
        throw new Error("Kunde inte nå den uppgraderade AI-motorn.");
    }
};
exports.askKnowledgeVault = askKnowledgeVault;
//# sourceMappingURL=vertexAgent.js.map