import type { A2AMessage } from '../agents/types';
import { resolveExecutorId } from '../agents/cards';
import { runExecutor } from './executors/runExecutor';
import { validateIntent, getAgentCard, assertCollectionAccess } from './registry';
import { appendMutation, createTrace, clearSynapseState } from './stateStore';
import { applyParalysBreak, isHeavyResponse } from './synapses/paralysBrytarenSynapse';
import { assertBackendSiloIsolation, type SiloId } from './manifest';
import type { DispatchOptions, OrchestrationResult } from './types';

/** Gatekeeper — enkel PII-rensning innan svar lämnar backend. */
function gatekeeperSanitize(text: string): string {
  return text
    .replace(/\b\d{6}[-\s]?\d{4}\b/g, '[PERSONNUMMER BORTTAGET]')
    .replace(/[\w._%+-]+@[\w.-]+\.[a-zA-Z]{2,}/g, '[E-POST BORTTAGEN]')
    .replace(/(\+46|0)\s?\d{2,3}[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}/g, '[TELEFON BORTTAGEN]');
}

/**
 * ADK Orchestrator — A2A state-mutationer mellan agenter.
 * Deterministisk routing via AgentCards; prompter från sharedRules.
 */
export class AdkOrchestrator {
  private supervisorId = 'agent_kompis_supervisor';

  async dispatch(message: A2AMessage, options: DispatchOptions = {}): Promise<OrchestrationResult> {
    const contextId = message.contextId ?? 'anonymous';
    const productAgentId = options.productAgentId ?? message.toAgentId;
    const executorId = resolveExecutorId(message.toAgentId);

    const executorCard = getAgentCard(executorId);
    if (!executorCard) {
      return await this.errorResult(contextId, productAgentId, `Executor ${executorId} saknas.`);
    }

    if (!this.intentAllowed(productAgentId, executorId, message.intent)) {
      return await this.errorResult(
        contextId,
        productAgentId,
        `Intent "${message.intent}" är inte registrerad för ${productAgentId}/${executorId}.`
      );
    }

    try {
      this.enforceManifestPolicy(executorId, message, options);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Manifest policy violation.';
      return await this.errorResult(contextId, productAgentId, msg);
    }

    const state = await appendMutation(contextId, {
      fromAgentId: message.fromAgentId,
      toAgentId: executorId,
      intent: message.intent,
      payload: message.payload,
    });

    console.log(
      `[ADK] ${message.fromAgentId} → ${executorId} (${message.intent}) trace=${state.traceId}`
    );

    try {
      const rawText = await runExecutor(executorId, { ...message, toAgentId: executorId }, options.ragContext ?? []);
      const safeText = gatekeeperSanitize(rawText);

      const shouldBreak =
        options.applyParalysBreak === true ||
        (options.applyParalysBreak !== false && isHeavyResponse(safeText));

      let microSteps;
      if (shouldBreak) {
        microSteps = await applyParalysBreak(safeText);
      }

      return {
        response: {
          agentId: productAgentId,
          status: 'SUCCESS',
          data: {
            response: safeText,
            executorId,
            microSteps,
            safeForUser: true,
          },
        },
        microSteps,
        state,
        rawAgentText: safeText,
      };
    } catch (err) {
      console.error('[ADK] Executor-fel:', err);
      return await this.errorResult(contextId, productAgentId, 'Agentexekvering misslyckades.');
    }
  }

  /** Wrapper för Kompis Supervisor — samma A2A-kontrakt. */
  async dispatchFromSupervisor(
    route: { productAgentId: string; executorId: string; intent: string },
    userInput: string,
    userId: string,
    ragContext: string[],
    dcapPayload: Record<string, unknown>
  ): Promise<OrchestrationResult> {
    const message: A2AMessage = {
      fromAgentId: this.supervisorId,
      toAgentId: route.executorId,
      timestamp: new Date().toISOString(),
      intent: route.intent,
      payload: { query: userInput, ...dcapPayload },
      contextId: userId,
    };

    return this.dispatch(message, {
      ragContext,
      productAgentId: route.productAgentId,
      applyParalysBreak: false,
    });
  }

  async clearContext(contextId: string): Promise<void> {
    await clearSynapseState(contextId);
  }

  private intentAllowed(productAgentId: string, executorId: string, intent: string): boolean {
    return validateIntent(productAgentId, intent) || validateIntent(executorId, intent);
  }

  private enforceManifestPolicy(
    executorId: string,
    message: A2AMessage,
    options: DispatchOptions,
  ): void {
    const payload = message.payload ?? {};
    const sourceSilo = payload.sourceSilo as SiloId | undefined;
    const targetSilo = payload.targetSilo as SiloId | undefined;
    if (sourceSilo && targetSilo) {
      assertBackendSiloIsolation(sourceSilo, targetSilo);
    }

    for (const collection of options.targetCollections ?? []) {
      if (!assertCollectionAccess(executorId, collection)) {
        throw new Error(`Manifest: executor ${executorId} får inte läsa ${collection}`);
      }
    }
  }

  async initTrace(contextId: string) {
    return await createTrace(contextId);
  }

  private async errorResult(contextId: string, agentId: string, error: string): Promise<OrchestrationResult> {
    return {
      response: { agentId, status: 'ERROR', error },
      state: await createTrace(contextId),
    };
  }
}

export const adkOrchestrator = new AdkOrchestrator();
