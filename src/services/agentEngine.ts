// src/services/agentEngine.ts
import { geminiService } from './geminiService';

export type AgentRole = 'Gräns-Arkitekten' | 'Skydds-Agenten' | 'Livs-Arkivarien' | 'Nätverksvisir';

const AGENT_SYSTEM_PROMPTS: Record<AgentRole, string> = {
  'Gräns-Arkitekten': "Du är Gräns-Arkitekten. Analysera input för JADE (Justify, Argue, Defend, Explain). Svara enbart i JSON med fälten: { decision: 'BLOCK'|'ALLOW', advice: string, explanation: string }.",
  'Skydds-Agenten': "Du är Skydds-Agenten. Identifiera narcissistisk gaslighting. Svara enbart i JSON med fälten: { threatLevel: 'LOW'|'MEDIUM'|'HIGH', detection: string, advice: string }.",
  'Livs-Arkivarien': "Du är Livs-Arkivarien. Hitta logiska inkonsekvenser i användarens historiska loggar. Svara enbart i JSON med fälten: { inconsistencyFound: boolean, details: string, suggestedAnchor: string }.",
  'Nätverksvisir': "Du är Nätverksvisir. Analysera sociala mönster i nätverket. Svara enbart i JSON med fälten: { allyRisk: 'SAFE'|'RISK', reasoning: string }."
};

export const AgentEngine = {
  async run(agent: AgentRole, input: string) {
    const prompt = AGENT_SYSTEM_PROMPTS[agent];
    try {
      // Skickar till vår proxy som redan har JSON-mode aktiverat
      const response = await geminiService.analyzeIntegrity(input, prompt);
      return response; 
    } catch (error) {
      console.error(`Agent ${} failed:`, error);
      return { error: 'Agent-kollaps. Försök igen.' };
    }
  }
};
2. Uppdatera src/pages/TerminalPage.tsx
Nu kopplar vi UI:t till AgentEngine. Leta upp din agents-array och runAnalysis-function i TerminalPage.tsx och uppdatera dem:

// Ersätt din existerande agents-array i TerminalPage.tsx med denna anropbara version:
import { AgentEngine, AgentRole } from '../services/agentEngine';

// I din komponent:
const triggerAgent = async (agentName: string) => {
  setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Aktiverar agent: ${}...`]);
  
  const result = await AgentEngine.run(agentName as AgentRole, "Analysera senaste statusen.");
  
  setLogs(prev => [
    ...prev, 
    `[${new Date().toLocaleTimeString()}] Svar: ${JSON.stringify(result)}`
  ]);
};
3. Säkra "Valvet" (Persistence)
För att spara agent-konfigurationer i databasen (enligt firebase-blueprint.json), kör detta script i din terminal för att initialisera din första "Gräns-Arkitekt" i Firestore.

Skapa scripts/seed-agents.ts:

// scripts/seed-agents.ts
import { db } from '../src/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

async function seed() {
  await addDoc(collection(db, 'ai_agents'), {
    userId: 'DIN_USER_ID_HÄR',
    name: 'Gräns-Arkitekten',
    role: 'Kommunikations-Vakt',
    prompt: 'Analysera input för JADE...',
    isActive: true,
    category: 'SAFETY',
    createdAt: serverTimestamp()
  });
  console.log("Agent arkiverad i systemet.");
}
seed();