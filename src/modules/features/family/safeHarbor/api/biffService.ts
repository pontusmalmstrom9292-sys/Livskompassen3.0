import { httpsCallable } from 'firebase/functions';
import { functions } from '@/core/firebase/init';

const analyzeMessageCallable = httpsCallable(functions, 'analyzeMessage');

export type GransAnalysis = {
  cleanFacts: string[];
  emotionalBait: string[];
  greyRockReply: string;
  techniques: string[];
  coachingNote: string;
};

export type BiffAnalysisResult = {
  agentId?: string;
  status?: string;
  dcap?: { riskScore?: number; greyRockResponse?: string; categories?: string[] };
  data?: {
    agentName?: string;
    gransAnalysis?: GransAnalysis;
    response?: string;
    greyRockResponse?: string;
    recommendedAction?: string;
    hitlRequired?: boolean;
    alertId?: string;
    theoryWithoutEvidence?: boolean;
  };
  theoryWithoutEvidence?: boolean;
  greyRockResponse?: string;
  suggestedReply?: string;
  reply?: string;
};

export async function analyzeBiffMessage(message: string): Promise<BiffAnalysisResult> {
  try {
    const result = await analyzeMessageCallable({
      message,
      ragContext: [],
      module: 'safe_harbor',
    });
    return result.data as BiffAnalysisResult;
  } catch (error) {
    console.error('Fel vid analyzeMessage:', error);
    throw new Error(
      'Analysen svarar inte just nu. Kontrollera att du är inloggad och försök igen om en stund.',
    );
  }
}

export function extractTheoryWithoutEvidence(result: BiffAnalysisResult): boolean {
  return result.data?.theoryWithoutEvidence === true || result.theoryWithoutEvidence === true;
}

export function extractGreyRockReply(result: BiffAnalysisResult): string {
  const fromData = result.data?.greyRockResponse ?? result.data?.response;
  const fromDcap = result.dcap?.greyRockResponse;
  return (
    fromData ??
    fromDcap ??
    result.greyRockResponse ??
    result.suggestedReply ??
    result.reply ??
    'Inget svar kunde genereras. Försök igen med kortare text.'
  );
}
