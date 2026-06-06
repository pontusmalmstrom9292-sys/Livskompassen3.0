import { httpsCallable, type FunctionsError } from 'firebase/functions';
import { functions } from '@/core/firebase/init';
import { withVaultSessionPayload } from '@/core/auth/vaultServerSession';

export interface ValvChatCitation {
  docId: string;
  date: string;
  excerpt: string;
}

export interface ValvChatResponse {
  answer: string;
  citations: ValvChatCitation[];
}

const valvChatQueryCallable = httpsCallable(functions, 'valvChatQuery');

export async function callValvChat(question: string): Promise<ValvChatResponse> {
  try {
    const result = await valvChatQueryCallable(withVaultSessionPayload({ question }));
    return result.data as ValvChatResponse;
  } catch (error) {
    console.error('Fel vid anrop till valvChatQuery:', error);
    const fnError = error as FunctionsError;
    if (fnError.code === 'functions/unauthenticated') {
      throw new Error('Autentisering krävs för Valv-Chat.');
    }
    if (fnError.code === 'functions/permission-denied') {
      throw new Error('Lås upp Valvet via Fyren (3 sek) och biometri innan du söker.');
    }
    throw new Error(fnError.message || 'Kunde inte söka i valvet. Försök igen senare.');
  }
}
