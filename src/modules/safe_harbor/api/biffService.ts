import { httpsCallable } from 'firebase/functions';
import { functions } from '../../core/firebase/init';

const analyzeMessageCallable = httpsCallable(functions, 'analyzeMessage');

export type BiffAnalysisResult = {
  agentId?: string;
  status?: string;
  dcap?: { riskScore?: number; greyRockResponse?: string; categories?: string[] };
  data?: {
    response?: string;
    greyRockResponse?: string;
    recommendedAction?: string;
  };
  greyRockResponse?: string;
  suggestedReply?: string;
  reply?: string;
};

export async function analyzeBiffMessage(message: string): Promise<BiffAnalysisResult> {
  try {
    const result = await analyzeMessageCallable({ message, ragContext: [] });
    return result.data as BiffAnalysisResult;
  } catch (error) {
    console.error('Fel vid analyzeMessage:', error);
    throw new Error('Kunde inte analysera meddelandet. Kontrollera inloggning och deployade functions.');
  }
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
