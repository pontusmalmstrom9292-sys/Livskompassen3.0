import {
  AvailableAgents,
  EXECUTOR_AGENT_IDS,
  GransArkitektenCard,
  routeFromDcap,
} from './cards';
import type { AgentResponse } from './types';
import { analyzeDcap, DcapResult } from './DCAP';
import { askGransArkitekten, parseGransJson, type GransArkitektenResult } from './gransArkitektenAgent';
import { resolveHamnTheoryWithoutEvidence } from '../lib/epistemicGuard';
import { deleteRegistryEntriesForUser } from '../lib/contextCacheRegistry';
import { adkOrchestrator } from '../adk/orchestrator';
import { emitSynapse } from '../adk/synapses/synapseBus';
import { hashPayload } from '../adk/stateStore';
import type { DcapAlertResult } from '../adk/synapses/dcapAlertSynapse';


/**
 * Kompis Supervisor Agent v2
 * Delegerar via ADK Orchestrator (A2A + state-mutationer).
 */
export class KompisSupervisor {
  public async handleUserRequest(
    userInput: string,
    userId: string,
    ragContext: string[] = [],
    options?: { preferGransArkitekten?: boolean }
  ): Promise<AgentResponse & { dcap?: DcapResult }> {
    console.log(`[Kompis] Anrop från uid=${userId}, inputlängd=${userInput.length}`);

    const dcapResult = await analyzeDcap(userInput);

    console.log(`[Kompis] DCAP riskScore=${dcapResult.riskScore}, action=${dcapResult.recommendedAction}`);

    const route = options?.preferGransArkitekten
      ? {
          productAgentId: GransArkitektenCard.metadata.id,
          executorId: EXECUTOR_AGENT_IDS.gransArkitekten,
          intent: 'analyzeCommunication' as const,
        }
      : routeFromDcap(dcapResult.riskScore, dcapResult.recommendedAction);
    const productCard = AvailableAgents[route.productAgentId];

    let hitlRequired = false;
    let alertId = '';

    if (dcapResult.recommendedAction === 'ALERT' || dcapResult.riskScore >= 70) {
      const alertResult = (await emitSynapse(adkOrchestrator, {
        trigger: 'dcap_alert',
        contextId: userId,
        payload: {
          ownerId: userId,
          riskScore: dcapResult.riskScore,
          recommendedAction: dcapResult.recommendedAction,
          inputHash: hashPayload({ message: userInput }),
          detectionCount: dcapResult.detections?.length ?? 0,
        },
      })) as DcapAlertResult;
      hitlRequired = alertResult.hitlRequired;
      alertId = alertResult.alertId;
    }

    console.log(
      `[Kompis] → ${productCard?.metadata.name ?? route.productAgentId} via ${route.executorId} (${route.intent})`
    );

    if (route.executorId === EXECUTOR_AGENT_IDS.gransArkitekten) {
      const orchestration = await adkOrchestrator.dispatchFromSupervisor(
        route,
        userInput,
        userId,
        ragContext,
        {
          dcapRiskScore: dcapResult.riskScore,
          greyRockSuggestion: dcapResult.greyRockResponse,
        },
      );

      let grans: GransArkitektenResult;
      if (orchestration.response.status === 'SUCCESS' && orchestration.rawAgentText) {
        grans = parseGransJson(orchestration.rawAgentText, dcapResult);
      } else {
        grans = await askGransArkitekten(userInput, dcapResult);
      }

      const theoryWithoutEvidence = resolveHamnTheoryWithoutEvidence(
        userInput,
        grans,
        dcapResult,
        grans.theoryWithoutEvidence,
      );
      return {
        agentId: route.productAgentId,
        status: 'SUCCESS',
        data: {
          agentName: productCard?.metadata.name ?? GransArkitektenCard.metadata.name,
          gransAnalysis: grans,
          response: grans.greyRockReply,
          greyRockResponse: grans.greyRockReply,
          recommendedAction: dcapResult.recommendedAction,
          hitlRequired,
          alertId: alertId || undefined,
          theoryWithoutEvidence,
        },
        dcap: dcapResult,
      };
    }

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
        hitlRequired,
        alertId: alertId || undefined,
      },
      dcap: dcapResult,
    };
  }

  public async invalidateUserSession(userId: string): Promise<void> {
    await deleteRegistryEntriesForUser(userId);
    adkOrchestrator.clearContext(userId);
    console.log(`[Kompis] Session + ADK-state rensad för uid=${userId}`);
  }
}
