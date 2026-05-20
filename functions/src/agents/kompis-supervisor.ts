import { AvailableAgents, routeFromDcap } from './cards';
import type { AgentResponse } from './types';
import { GCP_PROJECT_ID } from '../config';
import { analyzeDcap, DcapResult } from './DCAP';
import { getOrCreateCache, invalidateCache } from '../lib/vertexCache';
import { KOMPIS_SYSTEM_PROMPT } from '../sharedRules';
import { adkOrchestrator } from '../adk/orchestrator';


/**
 * Kompis Supervisor Agent v2
 * Delegerar via ADK Orchestrator (A2A + state-mutationer).
 */
export class KompisSupervisor {
  public async handleUserRequest(
    userInput: string,
    userId: string,
    ragContext: string[] = []
  ): Promise<AgentResponse & { dcap?: DcapResult }> {
    console.log(`[Kompis] Anrop från uid=${userId}, inputlängd=${userInput.length}`);

    const [dcapResult] = await Promise.all([
      analyzeDcap(userInput, GCP_PROJECT_ID),
      getOrCreateCache(`kompis_${userId}`, {
        systemInstruction: KOMPIS_SYSTEM_PROMPT,
        backgroundDocuments: ragContext,
        ttlSeconds: 3600,
      }),
    ]);

    console.log(`[Kompis] DCAP riskScore=${dcapResult.riskScore}, action=${dcapResult.recommendedAction}`);

    const route = routeFromDcap(dcapResult.riskScore, dcapResult.recommendedAction);
    const productCard = AvailableAgents[route.productAgentId];

    console.log(
      `[Kompis] → ${productCard?.metadata.name ?? route.productAgentId} via ${route.executorId} (${route.intent})`
    );

    const orchestration = await adkOrchestrator.dispatchFromSupervisor(
      route,
      userInput,
      userId,
      ragContext,
      {
        dcapRiskScore: dcapResult.riskScore,
        greyRockSuggestion: dcapResult.greyRockResponse,
      }
    );

    if (orchestration.response.status === 'ERROR') {
      return { ...orchestration.response, dcap: dcapResult };
    }

    return {
      agentId: route.productAgentId,
      status: 'SUCCESS',
      data: {
        ...orchestration.response.data,
        recommendedAction: dcapResult.recommendedAction,
        greyRockResponse: dcapResult.greyRockResponse,
        microSteps: orchestration.microSteps,
        traceId: orchestration.state.traceId,
      },
      dcap: dcapResult,
    };
  }

  public invalidateUserSession(userId: string): void {
    invalidateCache(`kompis_${userId}`);
    adkOrchestrator.clearContext(userId);
    console.log(`[Kompis] Session + ADK-state rensad för uid=${userId}`);
  }
}
