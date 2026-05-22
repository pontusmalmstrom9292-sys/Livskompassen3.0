const test = require('node:test');
const assert = require('node:assert');

// Exempel på det förväntade JSON-schemat.
// Byt ut detta mot ditt faktiska schema-valideringsverktyg (t.ex. Ajv eller Zod) om du har ett.
const expectedSchema = {
    type: 'object',
    properties: {
        response: { type: 'string' },
    },
    required: ['response']
};

function validateSchema(data, schema) {
    // Enkel mock-validering, kan bytas ut mot riktigt bibliotek.
    if (typeof data !== 'object' || data === null) return false;
    for (const key of schema.required) {
        if (!(key in data)) return false;
    }
    return true;
}

// Lista över ord som kan betraktas som emotionella eller reaktiva.
// Anpassa denna lista utifrån projektets behov.
const emotionalWords = [
    'arg', 'ledsen', 'besviken', 'frustrerad', 'skriker', 'hatar', 
    'idiot', 'fan', 'älskar', 'känner', 'upprörd', 'förbannad', 'ledsen'
];

function containsEmotionalWords(text) {
    const lowerText = text.toLowerCase();
    // Kontrollera om något av de emotionella orden finns i texten
    // Vi använder en regex med ordgränser för att inte matcha delar av andra ord.
    return emotionalWords.some(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(lowerText);
    });
}

// Simulera anropet till din LLM eller agent med din grey_rock.prompt
async function mockLlmCall(prompt, input) {
    // Här bör du i framtiden anropa Vertex AI / Dialogflow (som i server.js)
    // och skicka med `grey_rock.prompt` som systeminstruktion.
    
    // För detta test simulerar vi en bra "grey rock"-respons.
    const mockModelResponse = {
        response: "Jag noterar vad du säger. Vi går vidare till nästa punkt."
    };
    
    return mockModelResponse;
}

test('Test av grey_rock.prompt: Hantera toxiskt meddelande', async (t) => {
    // 1. Simulera det toxiska meddelandet från en användare
    const toxicMessage = "Du är helt värdelös och jag hatar dig! Din jävla idiot!";
    
    // 2. Anropa agenten/prompten (Här mockat)
    const modelResponse = await mockLlmCall('grey_rock.prompt', toxicMessage);

    // 3. Verifiera att utdatan följer JSON-schemat
    const isSchemaValid = validateSchema(modelResponse, expectedSchema);
    assert.strictEqual(
        isSchemaValid, 
        true, 
        'Agentens svar följer inte det förväntade JSON-schemat.'
    );

    // 4. Verifiera att svaret (utdatan) inte innehåller emotionella ord
    const hasEmotionalWords = containsEmotionalWords(modelResponse.response);
    assert.strictEqual(
        hasEmotionalWords, 
        false, 
        `Agentens svar innehåller emotionella ord, vilket bryter mot "grey rock"-principen. Svar: "${modelResponse.response}"`
    );
});
