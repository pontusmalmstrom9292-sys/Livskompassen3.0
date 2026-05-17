const { genkit, z } = require('genkit');
const { vertexAI } = require('@genkit-ai/vertexai');

// Konfiguration av AI-Motorn (Vertex AI RAG / Genkit)
const ai = genkit({
  plugins: [
    vertexAI({
      projectId: process.env.GOOGLE_CLOUD_PROJECT || 'livskompassen-v2',
      location: process.env.GOOGLE_CLOUD_LOCATION || 'europe-west1'
    })
  ],
});

// Agent: Brusfiltret / BIFF-Skölden
// Deterministiskt filter som tvättar manipulativ indata och returnerar Yellow Rock/BIFF-svar.
const kommunikationsTvattenFlow = ai.defineFlow(
  {
    name: 'kommunikationsTvatten',
    inputSchema: z.string(),
    outputSchema: z.object({
      huvudsyfte: z.string(),
      manipulationsTekniker: z.array(z.string()),
      yellowRockSvar: z.array(z.string()),
    }),
  },
  async (toxicMessage) => {
    const response = await ai.generate({
      model: 'gemini-1.5-pro',
      prompt: `Analysera följande meddelande för dold narcissism, projektion och manipulation (VIVIR/BBIC): "${toxicMessage}". \nKlinisk instruktion: Noll empati tillåten. Ge huvudsyftet med meddelandet, en lista på de exakta manipulationsteknikerna, samt tre (3) gränssättande Yellow Rock / BIFF-svar.`,
      output: { format: 'json' }
    });
    return response.output;
  }
);

module.exports = { kommunikationsTvattenFlow };