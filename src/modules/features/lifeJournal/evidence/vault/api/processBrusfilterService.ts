import { httpsCallable, type FunctionsError } from 'firebase/functions';
import { functions } from '@/core/firebase/init';
import { withVaultSessionPayloadReady } from '@/core/auth/vaultServerSession';

export type BrusfilterRecommendedAction = 'INGEN' | 'VARNING';

export interface ProcessBrusfilterResult {
  dcap_analysis: {
    risk_score: number;
    recommended_action: BrusfilterRecommendedAction;
  };
  isolated_logistics: string;
  biff_draft_reply: string;
}

type ProcessBrusfilterPayload = {
  raw_input_text: string;
  vaultSessionToken?: string;
};

const processBrusfilterCallable = httpsCallable<
  ProcessBrusfilterPayload,
  ProcessBrusfilterResult
>(functions, 'processBrusfilter');

export async function callProcessBrusfilter(rawInputText: string): Promise<ProcessBrusfilterResult> {
  try {
    const result = await processBrusfilterCallable(
      await withVaultSessionPayloadReady({ raw_input_text: rawInputText.trim() }),
    );
    return result.data;
  } catch (error) {
    console.error('Fel vid anrop till processBrusfilter:', error);
    const fnError = error as FunctionsError;
    if (fnError.code === 'functions/unauthenticated') {
      throw new Error('Autentisering krävs för Brusfilter.');
    }
    if (fnError.code === 'functions/permission-denied') {
      throw new Error('Lås upp Valvet via Fyren (3 sek) och biometri innan du filtrerar brus.');
    }
    if (fnError.code === 'functions/resource-exhausted') {
      throw new Error('För många försök — vänta en minut och försök igen.');
    }
    throw new Error(fnError.message || 'Brusfilter misslyckades. Försök igen senare.');
  }
}
