import { A2AMessage, AgentResponse } from './types';
import { AvailableAgents } from './cards';
import { analyzeDcap, DcapResult } from './DCAP';
import { getOrCreateCache, generateWithCache, invalidateCache } from '../lib/vertexCache';

const PROJECT_ID = process.env.GCP_PROJECT_ID ?? 'livskompassen-v2';

// Systemprompten för Kompis — stabil, aldrig användardata (krypteras i cache)
const KOMPIS_SYSTEM_PROMPT = `Du är Kompis, en empatisk och deterministisk AI-navigatör i Livskompassen.
Din uppgift är att skydda och stärka användaren baserat på verifierade bevis ur deras Kampspår.
Du HÅLLer dig till RAG-data. Du hallucinerar aldrig. Du påhitar aldrig fakta.
Vid tecken på manipulation: svara lugnt, hänvisa till Grey Rock och avbryt eskalering.
Svara alltid på svenska. Var kortfattad, varm och tydlig.`;

/**
 * Kompis Supervisor Agent v2
 * Integrerar DCAP (psykologisk skanning) och Context Caching.
 */
export class KompisSupervisor {
  private supervisorId = 'agent_kompis_supervisor';

  /**
   * Huvudingångspunkt: Analyserar input, kör DCAP och delegerar till rätt sub-agent.
   * @param userInput Användarens text (t.ex. ett mottaget SMS för analys).
   * @param userId Inloggad användares UID — styr RAG-filtrering och cache-nyckel.
   * @param ragContext RAG-hämtad historisk kontext från Vector Search (Kampspår).
   */
  public async handleUserRequest(
    userInput: string,
    userId: string,
    ragContext: string[] = []
  ): Promise<AgentResponse & { dcap?: DcapResult }> {
    console.log(`[Kompis] Anrop från uid=${userId}, inputlängd=${userInput.length}`);

    // ── Steg 1: DCAP-skanning (alltid, parallellt med cache-prep) ──────────────
    const [dcapResult, cachedCtx] = await Promise.all([
      analyzeDcap(userInput, PROJECT_ID),
      getOrCreateCache(`kompis_${userId}`, {
        systemInstruction: KOMPIS_SYSTEM_PROMPT,
        backgroundDocuments: ragContext,
        ttlSeconds: 3600,
      }),
    ]);

    console.log(`[Kompis] DCAP riskScore=${dcapResult.riskScore}, action=${dcapResult.recommendedAction}`);

    // ── Steg 2: Routing baserat på DCAP-resultat ────────────────────────────────
    let targetAgentId: string;
    let intent: string;

    if (dcapResult.recommendedAction === 'ALERT' || dcapResult.riskScore >= 70) {
      // Hög risk → Gräns-Arkitekten + Grey Rock direkt
      targetAgentId = 'agent_grans_arkitekten';
      intent = 'generateGreyRockResponse';
    } else if (
      dcapResult.recommendedAction === 'COACHING' ||
      dcapResult.riskScore >= 30
    ) {
      // Medel risk → Gräns-Arkitekten för coaching
      targetAgentId = 'agent_grans_arkitekten';
      intent = 'analyzeCommunication';
    } else {
      // Låg risk → Livs-Arkivarien hämtar historik
      targetAgentId = 'agent_livs_arkivarien';
      intent = 'searchKampspar';
    }

    const targetCard = AvailableAgents[targetAgentId];
    if (!targetCard) {
      return {
        agentId: this.supervisorId,
        status: 'ERROR',
        error: `Agent ${targetAgentId} saknas i registret.`,
      };
    }

    console.log(`[Kompis] → ${targetCard.metadata.name} (${intent})`);

    // ── Steg 3: A2A-delegering ──────────────────────────────────────────────────
    const message: A2AMessage = {
      fromAgentId: this.supervisorId,
      toAgentId: targetAgentId,
      timestamp: new Date().toISOString(),
      intent,
      payload: {
        query: userInput,
        dcapRiskScore: dcapResult.riskScore,
        greyRockSuggestion: dcapResult.greyRockResponse,
      },
      contextId: userId,
    };

    // ── Steg 4: Generera svar med cachat kontext ────────────────────────────────
    const agentPrompt = this.buildAgentPrompt(message, dcapResult);
    const aiResponse = await generateWithCache(cachedCtx, agentPrompt);

    // ── Steg 5: Gatekeeper — aldrig PII till frontend ───────────────────────────
    const safeResponse = this.gatekeeperSanitize(aiResponse);

    return {
      agentId: targetAgentId,
      status: 'SUCCESS',
      data: {
        response: safeResponse,
        recommendedAction: dcapResult.recommendedAction,
        greyRockResponse: dcapResult.greyRockResponse,
        safeForUser: true,
      },
      dcap: dcapResult,
    };
  }

  /** Bygger prompten till sub-agenten baserat på DCAP-kontext */
  private buildAgentPrompt(message: A2AMessage, dcap: DcapResult): string {
    const lines = [
      `Uppgift: ${message.intent}`,
      `Användarens meddelande: "${message.payload.query}"`,
    ];

    if (dcap.riskScore > 0) {
      lines.push(`DCAP-analys: Riskpoäng ${dcap.riskScore}/100.`);
      if (dcap.detections.length > 0) {
        const techniques = dcap.detections.map((d) => d.technique).join(', ');
        lines.push(`Detekterade tekniker: ${techniques}.`);
      }
      if (dcap.greyRockResponse) {
        lines.push(`Föreslaget Grey Rock-svar: "${dcap.greyRockResponse}"`);
      }
    }

    lines.push('Basera ditt svar uteslutande på ovanstående data och bakgrundskontexten.');
    return lines.join('\n');
  }

  /** Gatekeeper: Tar bort potentiellt känslig data från AI-svar */
  private gatekeeperSanitize(text: string): string {
    // Enkel PII-rensning: personnummer, e-post och telefonnummer
    return text
      .replace(/\b\d{6}[-\s]?\d{4}\b/g, '[PERSONNUMMER BORTTAGET]')
      .replace(/[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}/g, '[E-POST BORTTAGEN]')
      .replace(/(\+46|0)\s?\d{2,3}[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}/g, '[TELEFON BORTTAGEN]');
  }

  /** Kill Switch: Ogiltigförklara cache vid utloggning / Zero Footprint */
  public invalidateUserSession(userId: string): void {
    invalidateCache(`kompis_${userId}`);
    console.log(`[Kompis] Session rensad för uid=${userId}`);
  }
}
