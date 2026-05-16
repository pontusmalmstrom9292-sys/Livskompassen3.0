require('dotenv').config();
const express = require('express');
const { SessionsClient } = require('@google-cloud/dialogflow-cx');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Configuration för Vertex AI Agent Builder (Dialogflow CX)
// Byt ut dessa mot dina faktiska värden från Google Cloud Console
const projectId = process.env.PROJECT_ID || 'ditt-google-cloud-projekt-id';
const location = process.env.LOCATION || 'global'; // t.ex. 'global', 'europe-west1'
const agentId = process.env.AGENT_ID || 'ditt-agent-id';
const languageCode = 'sv'; // Svenska

// Skapa en klient för att prata med agenten
const client = new SessionsClient({
  apiEndpoint: location === 'global' ? 'dialogflow.googleapis.com' : `${location}-dialogflow.googleapis.com`
});

app.get('/', (req, res) => {
  res.send('Hej! Din backend för Livskompassen fungerar och är redo för Vertex AI.');
});

// Endpoint för att skicka meddelanden till Vertex AI Agenten
app.post('/api/chat', async (req, res) => {
  try {
    const { sessionId, text } = req.body;

    if (!sessionId || !text) {
      return res.status(400).json({ error: 'sessionId och text krävs i request body.' });
    }

    // Skapa sessions-path
    const sessionPath = client.projectLocationAgentSessionPath(
      projectId,
      location,
      agentId,
      sessionId
    );

    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
        },
        languageCode: languageCode,
      },
    };

    // Skicka anropet till Vertex AI Agent Builder
    const [response] = await client.detectIntent(request);
    
    // Hämta agentens svar
    const responseMessages = response.queryResult.responseMessages;
    const botTextResponses = responseMessages
      .filter(msg => msg.text)
      .map(msg => msg.text.text.join(' '))
      .join('\n');

    res.json({
      reply: botTextResponses,
      intent: response.queryResult.intent ? response.queryResult.intent.displayName : 'Inget matchat intent',
    });

  } catch (error) {
    console.error('Fel vid anrop till Vertex AI:', error);
    res.status(500).json({ error: 'Ett internet fel uppstod vid kommunikation med Vertex AI.' });
  }
});

app.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
  console.log('Kom ihåg att sätta miljövariablerna PROJECT_ID, LOCATION, och AGENT_ID i en .env-fil.');
});
