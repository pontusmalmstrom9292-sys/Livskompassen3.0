import { useCallback, useState } from 'react';
import {
  analyzeBiffMessage,
  extractGreyRockReply,
  extractTheoryWithoutEvidence,
  type GransAnalysis,
} from '../api/biffService';

export type HamnBiffWizardState = {
  grans: GransAnalysis | null;
  agentName: string | null;
  riskScore: number | null;
  hitlRequired: boolean;
  theoryWithoutEvidence: boolean;
  reply: string | null;
  pendingReply: string | null;
  triageReady: boolean;
  loading: boolean;
  error: string | null;
};

const INITIAL: HamnBiffWizardState = {
  grans: null,
  agentName: null,
  riskScore: null,
  hitlRequired: false,
  theoryWithoutEvidence: false,
  reply: null,
  pendingReply: null,
  triageReady: false,
  loading: false,
  error: null,
};

export function useHamnBiffWizard() {
  const [state, setState] = useState<HamnBiffWizardState>(INITIAL);

  const reset = useCallback(() => {
    setState(INITIAL);
  }, []);

  const analyze = useCallback(async (message: string) => {
    setState({ ...INITIAL, loading: true });
    try {
      const result = await analyzeBiffMessage(message);
      const pendingReply = extractGreyRockReply(result);
      setState({
        grans: result.data?.gransAnalysis ?? null,
        agentName: result.data?.agentName ?? null,
        riskScore: result.dcap?.riskScore ?? null,
        hitlRequired: result.data?.hitlRequired === true,
        theoryWithoutEvidence: extractTheoryWithoutEvidence(result),
        reply: null,
        pendingReply,
        triageReady: true,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState({
        ...INITIAL,
        error:
          err instanceof Error ? err.message : 'Analysen svarar inte. Försök igen om en stund.',
      });
    }
  }, []);

  const confirmReply = useCallback(() => {
    setState((prev) => {
      if (!prev.pendingReply) return prev;
      return { ...prev, reply: prev.pendingReply };
    });
  }, []);

  return { state, reset, analyze, confirmReply };
}
